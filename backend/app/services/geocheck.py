"""
MaxMind GeoIP2 Precision Insights — fraud & geo gating for orders.

Rules:
  1. Whitelisted phone numbers bypass all checks (for owner testing in prod).
  2. IP must geolocate to Saudi Arabia (country_iso = "SA").
  3. If IP is in SA but flagged as VPN/proxy → ALLOW (KSA residents use VPNs;
     COD means they need a real Saudi address anyway).
  4. If IP is in SA but flagged as TOR/hosting → BLOCK (bots/scrapers).
  5. If IP is NOT in SA → BLOCK (regardless of phone number).
  6. If MaxMind is unreachable or errors → BLOCK (fail-closed).
  7. Only exception: if MaxMind is not configured, allow (dev/staging).
"""
from __future__ import annotations

import ipaddress
import logging
from typing import NamedTuple

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

MAXMIND_INSIGHTS_URL = "https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"

GEO_BLOCK_MESSAGE = "عذرًا، لا يمكنك إتمام الطلب. الخدمة متاحة فقط من داخل المملكة العربية السعودية."


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
    Validates the IP against MaxMind GeoIP2 Insights.
    Returns (allowed=True/False, reason).
    FAIL-CLOSED: unless we can positively confirm the IP is from SA, we block.
    """
    # 1. Whitelisted phones always pass
    if phone and is_phone_whitelisted(phone):
        return GeoCheckResult(allowed=True, reason="whitelisted_phone")

    # 2. If fraud check is explicitly disabled, allow
    if not settings.ENABLE_IP_FRAUD_CHECK:
        return GeoCheckResult(allowed=True, reason="ip_fraud_check_disabled")

    # 3. If MaxMind not configured, allow (dev/staging without credentials)
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.warning("MaxMind credentials not configured — allowing (configure to enable geo-block)")
        return GeoCheckResult(allowed=True, reason="maxmind_not_configured")

    # 4. No IP or localhost — block in production
    if not ip or ip in ("127.0.0.1", "::1", "localhost", ""):
        if settings.APP_ENV != "production":
            return GeoCheckResult(allowed=True, reason="localhost_dev")
        logger.warning("No client IP in production — blocking")
        return GeoCheckResult(allowed=False, reason="no_ip")

    # 5. Private/data-center IPs — block in production
    try:
        parsed_ip = ipaddress.ip_address(ip)
        if parsed_ip.is_private or parsed_ip.is_loopback or parsed_ip.is_link_local:
            if settings.APP_ENV != "production":
                return GeoCheckResult(allowed=True, reason="private_ip_dev")
            logger.warning("Private IP in production: %s — blocking", ip)
            return GeoCheckResult(allowed=False, reason="private_ip")
    except ValueError:
        logger.warning("Invalid IP format: %s — blocking", ip)
        return GeoCheckResult(allowed=False, reason="invalid_ip")

    # 6. Call MaxMind
    url = MAXMIND_INSIGHTS_URL.format(ip=ip)

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                url,
                auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
            )

        if resp.status_code != 200:
            logger.error(
                "MaxMind returned %d for IP %s: %s — BLOCKING (fail-closed)",
                resp.status_code, ip, resp.text[:200],
            )
            return GeoCheckResult(allowed=False, reason=f"maxmind_error_{resp.status_code}")

        data = resp.json()

        country_iso = data.get("country", {}).get("iso_code", "").upper()
        traits = data.get("traits", {})

        is_anon_proxy = traits.get("is_anonymous_proxy", False)
        is_anon_vpn = traits.get("is_anonymous_vpn", False)
        is_hosting = traits.get("is_hosting_provider", False)
        is_tor = traits.get("is_tor_exit_node", False)
        is_residential = traits.get("is_residential_proxy", False)

        # Must be Saudi Arabia
        if country_iso != "SA":
            logger.info("Geo-blocked: IP %s from %s (not SA)", ip, country_iso)
            return GeoCheckResult(allowed=False, reason=f"country_not_sa:{country_iso}")

        # Country IS Saudi Arabia — allow VPN/proxy users (likely KSA residents
        # using VPN for privacy). COD means they need a real Saudi address anyway.
        # Only block TOR exit nodes and hosting providers (bots/scrapers).
        if is_tor or is_hosting:
            flags = []
            if is_tor: flags.append("tor")
            if is_hosting: flags.append("hosting")
            logger.info("Geo-blocked: IP %s in SA but flagged as %s", ip, ",".join(flags))
            return GeoCheckResult(allowed=False, reason=f"suspicious_ip:{','.join(flags)}")

        return GeoCheckResult(allowed=True, reason="sa_clean")

    except httpx.TimeoutException:
        logger.warning("MaxMind timeout for IP %s — BLOCKING (fail-closed)", ip)
        return GeoCheckResult(allowed=False, reason="maxmind_timeout")
    except Exception as exc:
        logger.exception("MaxMind error for IP %s: %s — BLOCKING (fail-closed)", ip, exc)
        return GeoCheckResult(allowed=False, reason="maxmind_exception")
