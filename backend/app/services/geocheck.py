"""
MaxMind GeoIP2 Precision Insights — strict KSA-only fraud detection for orders.

Strategy:
  We block any order where the IP is NOT physically in Saudi Arabia, OR is
  flagged as anonymous (VPN, proxy, hosting, TOR). The combination of:
    - Strict KSA-only IP requirement
    - Saudi mobile phone validation (separate)
    - COD with KSA-only shipping addresses
  ...gives us the strongest possible fraud filter without paid card processing.

  Whitelisted phones bypass ALL checks (owner / staff testing).
"""
from __future__ import annotations

import ipaddress
import logging
from typing import NamedTuple

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

MAXMIND_INSIGHTS_URL = "https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"

# Arabic message shown to blocked users
GEO_BLOCK_MESSAGE = "عذرًا، الطلبات متاحة فقط من داخل المملكة العربية السعودية وبدون VPN."

# Required country ISO code for orders
REQUIRED_COUNTRY_ISO = "SA"


class GeoCheckResult(NamedTuple):
    allowed: bool
    reason: str


def _normalize_phone(phone: str) -> str:
    return phone.replace(" ", "").replace("-", "").replace("+", "")


def _whitelisted_phones() -> list[str]:
    raw = settings.WHITELISTED_PHONES
    return [_normalize_phone(p.strip()) for p in raw.split(",") if p.strip()]


def is_phone_whitelisted(phone: str) -> bool:
    normalized = _normalize_phone(phone)
    for wl in _whitelisted_phones():
        if wl == normalized or normalized.endswith(wl):
            return True
    return False


async def check_ip(ip: str, phone: str | None = None) -> GeoCheckResult:
    """
    Strict KSA-only check.

    Order is BLOCKED unless ALL of the following are true:
      1. IP belongs to Saudi Arabia (country ISO == "SA"), AND
      2. IP is NOT an anonymous VPN, public proxy, residential proxy,
         TOR exit node, or hosting/data-center provider.

    Whitelisted phones bypass everything.
    """
    # 1. Whitelisted phones always pass (owner / QA testing)
    if phone and is_phone_whitelisted(phone):
        return GeoCheckResult(allowed=True, reason="whitelisted_phone")

    # 2. If fraud check disabled, allow (e.g. local dev)
    if not settings.ENABLE_IP_FRAUD_CHECK:
        return GeoCheckResult(allowed=True, reason="ip_fraud_check_disabled")

    # 3. If MaxMind not configured: BLOCK in production, allow in dev
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        if settings.APP_ENV == "production":
            logger.error("MaxMind not configured but ENABLE_IP_FRAUD_CHECK=true in production")
            return GeoCheckResult(allowed=False, reason="maxmind_not_configured_prod")
        return GeoCheckResult(allowed=True, reason="maxmind_not_configured_dev")

    # 4. No IP — BLOCK (we cannot verify origin)
    if not ip or ip in ("127.0.0.1", "::1", "localhost", ""):
        if settings.APP_ENV == "production":
            return GeoCheckResult(allowed=False, reason="no_ip_blocked")
        return GeoCheckResult(allowed=True, reason="no_ip_dev_allowed")

    # 5. Private/loopback IPs — allow (internal network / proxy fronted dev)
    try:
        parsed_ip = ipaddress.ip_address(ip)
        if parsed_ip.is_private or parsed_ip.is_loopback or parsed_ip.is_link_local:
            return GeoCheckResult(allowed=True, reason="private_ip")
    except ValueError:
        return GeoCheckResult(allowed=False, reason="invalid_ip_format")

    # 6. Call MaxMind Insights — strict KSA + anti-VPN
    url = MAXMIND_INSIGHTS_URL.format(ip=ip)

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                url,
                auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
                headers={"Accept": "application/json"},
            )

        if resp.status_code != 200:
            logger.warning("MaxMind returned %d for IP %s — blocking (fail-closed)", resp.status_code, ip)
            # Fail-CLOSED: better to block a legitimate order than accept fraud
            return GeoCheckResult(allowed=False, reason=f"maxmind_error_{resp.status_code}")

        data = resp.json()
        traits = data.get("traits", {})
        country = data.get("country", {}) or {}
        country_iso = country.get("iso_code", "")

        # 6a. Block anonymizers (VPN / proxy / TOR / hosting)
        if traits.get("is_tor_exit_node"):
            logger.info("Blocked TOR exit node: %s", ip)
            return GeoCheckResult(allowed=False, reason="tor_exit_node")
        if traits.get("is_anonymous_vpn"):
            logger.info("Blocked anonymous VPN: %s (claimed country %s)", ip, country_iso)
            return GeoCheckResult(allowed=False, reason="anonymous_vpn")
        if traits.get("is_public_proxy"):
            logger.info("Blocked public proxy: %s", ip)
            return GeoCheckResult(allowed=False, reason="public_proxy")
        if traits.get("is_residential_proxy"):
            logger.info("Blocked residential proxy: %s", ip)
            return GeoCheckResult(allowed=False, reason="residential_proxy")
        if traits.get("is_hosting_provider"):
            logger.info("Blocked hosting/data-center IP: %s", ip)
            return GeoCheckResult(allowed=False, reason="hosting_provider")
        if traits.get("is_anonymous"):
            logger.info("Blocked anonymous network: %s", ip)
            return GeoCheckResult(allowed=False, reason="anonymous_network")

        # 6b. Strict country check — must be Saudi Arabia
        if country_iso != REQUIRED_COUNTRY_ISO:
            logger.info("Blocked non-KSA IP %s (country=%s)", ip, country_iso or "unknown")
            return GeoCheckResult(allowed=False, reason=f"country_not_ksa:{country_iso or 'unknown'}")

        logger.info("Allowed KSA IP %s", ip)
        return GeoCheckResult(allowed=True, reason="allowed_ksa")

    except httpx.TimeoutException:
        # Fail-CLOSED on timeout to prevent fraud bypass
        logger.warning("MaxMind timeout for IP %s — blocking (fail-closed)", ip)
        return GeoCheckResult(allowed=False, reason="maxmind_timeout")
    except Exception as exc:
        logger.error("MaxMind error for IP %s: %s — blocking (fail-closed)", ip, exc)
        return GeoCheckResult(allowed=False, reason="maxmind_exception")
