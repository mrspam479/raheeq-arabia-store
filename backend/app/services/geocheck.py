"""
MaxMind GeoIP2 Precision Insights — fraud detection for orders.

Strategy:
  We do NOT block based on country because KSA residents frequently use VPNs
  (which make their IP appear as another country). Since the store is COD-only
  with KSA-only shipping + Saudi phone required, the real fraud protection is:
    - Must have a valid Saudi phone number (validated separately)
    - Must pay on delivery at a real Saudi address

  What we DO block:
    - TOR exit nodes (anonymous fraud)
    - Hosting/data-center IPs (bots, scrapers, automated attacks)
    - Whitelisted phones bypass all checks (owner testing)
"""
from __future__ import annotations

import ipaddress
import logging
from typing import NamedTuple

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

MAXMIND_INSIGHTS_URL = "https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"

GEO_BLOCK_MESSAGE = "عذرًا، لا يمكنك إتمام الطلب من هذا الاتصال. حاولي من شبكة أخرى."


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
    Checks IP for fraud signals (TOR, hosting).
    Does NOT block based on country — KSA residents use VPNs.
    """
    # 1. Whitelisted phones always pass
    if phone and is_phone_whitelisted(phone):
        return GeoCheckResult(allowed=True, reason="whitelisted_phone")

    # 2. If fraud check disabled, allow
    if not settings.ENABLE_IP_FRAUD_CHECK:
        return GeoCheckResult(allowed=True, reason="ip_fraud_check_disabled")

    # 3. If MaxMind not configured, allow
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        return GeoCheckResult(allowed=True, reason="maxmind_not_configured")

    # 4. No IP — allow (can't check, COD protects us)
    if not ip or ip in ("127.0.0.1", "::1", "localhost", ""):
        return GeoCheckResult(allowed=True, reason="no_ip_cod_protected")

    # 5. Private IPs — allow (internal network, likely dev or proxy)
    try:
        parsed_ip = ipaddress.ip_address(ip)
        if parsed_ip.is_private or parsed_ip.is_loopback or parsed_ip.is_link_local:
            return GeoCheckResult(allowed=True, reason="private_ip")
    except ValueError:
        return GeoCheckResult(allowed=True, reason="invalid_ip_format")

    # 6. Call MaxMind — only check for TOR/hosting (bot fraud)
    url = MAXMIND_INSIGHTS_URL.format(ip=ip)

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                url,
                auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
            )

        if resp.status_code != 200:
            logger.warning("MaxMind returned %d for IP %s — allowing (COD protected)", resp.status_code, ip)
            return GeoCheckResult(allowed=True, reason=f"maxmind_error_{resp.status_code}")

        data = resp.json()
        traits = data.get("traits", {})

        is_hosting = traits.get("is_hosting_provider", False)
        is_tor = traits.get("is_tor_exit_node", False)

        if is_tor:
            logger.info("Blocked TOR exit node: IP %s", ip)
            return GeoCheckResult(allowed=False, reason="tor_exit_node")

        if is_hosting:
            logger.info("Blocked hosting/data-center IP: %s", ip)
            return GeoCheckResult(allowed=False, reason="hosting_provider")

        # All good — allow regardless of country (VPN users in KSA are welcome)
        country_iso = data.get("country", {}).get("iso_code", "")
        logger.info("IP %s from %s — allowed (COD + Saudi phone = protected)", ip, country_iso)
        return GeoCheckResult(allowed=True, reason=f"allowed:{country_iso}")

    except httpx.TimeoutException:
        logger.warning("MaxMind timeout for IP %s — allowing (COD protected)", ip)
        return GeoCheckResult(allowed=True, reason="maxmind_timeout")
    except Exception as exc:
        logger.warning("MaxMind error for IP %s: %s — allowing (COD protected)", ip, exc)
        return GeoCheckResult(allowed=True, reason="maxmind_exception")
