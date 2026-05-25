"""
MaxMind GeoIP2 Precision Insights — fraud & geo gating for orders.

Rules:
  1. IP must geolocate to Saudi Arabia (country_iso = "SA")
  2. IP must NOT be flagged as anonymous proxy / VPN / hosting / TOR
  3. If MaxMind is unreachable or returns an error, we ALLOW the order
     (fail-open) to avoid blocking real customers on transient failures.
  4. Whitelisted phone numbers bypass all checks (for owner testing in prod).
"""
from __future__ import annotations

import logging
from typing import NamedTuple

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

MAXMIND_INSIGHTS_URL = "https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"


class GeoCheckResult(NamedTuple):
    allowed: bool
    reason: str


def _normalize_phone(phone: str) -> str:
    return phone.replace(" ", "").replace("-", "").replace("+", "")


def _whitelisted_phones() -> list[str]:
    """Return normalized whitelisted phones from settings (comma-separated)."""
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
    """
    if phone and is_phone_whitelisted(phone):
        return GeoCheckResult(allowed=True, reason="whitelisted_phone")

    if not settings.ENABLE_IP_FRAUD_CHECK:
        return GeoCheckResult(allowed=True, reason="ip_fraud_check_disabled")

    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.warning("MaxMind credentials not configured — skipping geo check")
        return GeoCheckResult(allowed=True, reason="maxmind_not_configured")

    if not ip or ip in ("127.0.0.1", "::1", "localhost"):
        if settings.APP_ENV != "production":
            return GeoCheckResult(allowed=True, reason="localhost_dev")
        return GeoCheckResult(allowed=False, reason="no_ip")

    # Block RFC-1918 / data-center IPs that MaxMind cannot geolocate.
    # These indicate the real user IP was not forwarded — fail closed in production.
    import ipaddress
    try:
        parsed_ip = ipaddress.ip_address(ip)
        if parsed_ip.is_private or parsed_ip.is_loopback or parsed_ip.is_link_local:
            if settings.APP_ENV != "production":
                return GeoCheckResult(allowed=True, reason="private_ip_dev")
            logger.warning("private_ip_in_production", ip=ip)
            return GeoCheckResult(allowed=False, reason="private_ip")
    except ValueError:
        pass

    url = MAXMIND_INSIGHTS_URL.format(ip=ip)

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                url,
                auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
            )

        if resp.status_code != 200:
            logger.error(
                "MaxMind returned %d for IP %s: %s",
                resp.status_code,
                ip,
                resp.text[:200],
            )
            return GeoCheckResult(allowed=True, reason="maxmind_error_failopen")

        data = resp.json()

        country_iso = data.get("country", {}).get("iso_code", "").upper()
        traits = data.get("traits", {})

        is_anon_proxy = traits.get("is_anonymous_proxy", False)
        is_anon_vpn = traits.get("is_anonymous_vpn", False)
        is_hosting = traits.get("is_hosting_provider", False)
        is_tor = traits.get("is_tor_exit_node", False)
        is_residential = traits.get("is_residential_proxy", False)

        if country_iso != "SA":
            logger.info("Geo-blocked order: IP %s from %s (not SA)", ip, country_iso)
            return GeoCheckResult(
                allowed=False,
                reason=f"country_not_sa:{country_iso}",
            )

        if is_anon_proxy or is_anon_vpn or is_hosting or is_tor or is_residential:
            flags = []
            if is_anon_proxy:
                flags.append("anon_proxy")
            if is_anon_vpn:
                flags.append("vpn")
            if is_hosting:
                flags.append("hosting")
            if is_tor:
                flags.append("tor")
            if is_residential:
                flags.append("residential_proxy")
            logger.info("Geo-blocked order: IP %s flagged as %s", ip, ",".join(flags))
            return GeoCheckResult(
                allowed=False,
                reason=f"suspicious_ip:{','.join(flags)}",
            )

        return GeoCheckResult(allowed=True, reason="sa_clean")

    except httpx.TimeoutException:
        logger.warning("MaxMind timeout for IP %s — fail-open", ip)
        return GeoCheckResult(allowed=True, reason="maxmind_timeout_failopen")
    except Exception as exc:
        logger.exception("MaxMind unexpected error for IP %s: %s", ip, exc)
        return GeoCheckResult(allowed=True, reason="maxmind_exception_failopen")
