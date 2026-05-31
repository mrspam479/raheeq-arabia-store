from __future__ import annotations

import json
from datetime import datetime, timezone
from decimal import Decimal

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.db.models import Order, WebhookLog

logger = structlog.get_logger()

PRODUCT_SKU_MAP: dict[str, str] = {
    "habba-nadra": "RHQ-NDR-001",
    "habba-bareeq": "RHQ-BRQ-001",
    "habba-jathr": "RHQ-JTR-001",
    "bundle-glow-trio": "RHQ-BND-001",
}


def _decimal_default(obj: object) -> str:
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=1, max=120))
async def _post_with_retry(url: str, body: dict) -> None:
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, content=json.dumps(body, default=_decimal_default), headers={"Content-Type": "application/json"}, follow_redirects=True)
        r.raise_for_status()


async def post_to_sheet(kind: str, payload: dict) -> None:
    if not settings.SHEET_WEBHOOK_URL:
        return
    body = {
        "kind": kind,
        "payload": payload,
    }
    try:
        await _post_with_retry(settings.SHEET_WEBHOOK_URL, body)
        logger.info("webhook.sheet.ok", kind=kind)
    except Exception:
        logger.exception("webhook.sheet.failed", kind=kind)


def _format_phone(phone_e164: str) -> str:
    """Ensure phone is in +966XXXXXXXXX format."""
    phone = phone_e164.strip()
    if phone.startswith("+"):
        return phone
    if phone.startswith("966"):
        return f"+{phone}"
    if phone.startswith("05") or phone.startswith("5"):
        digits = phone.lstrip("0")
        return f"+966{digits}"
    return phone


def build_order_payload_from_out(order_out: object, payload: object) -> dict:
    """Build sheet payload matching the sheet columns:
    date, order_id, country, name, phone, product, sku, quantity, totalprice, currency, status
    """
    from app.utils.ksa_phone import KsaPhone

    o = order_out  # type: ignore[assignment]
    p = payload  # type: ignore[assignment]

    products = []
    skus = []
    quantities = []
    for item in o.lines:
        if not item.is_upsell:
            products.append(item.product_name_ar)
            skus.append(PRODUCT_SKU_MAP.get(item.product_slug, item.product_slug))
            quantities.append(str(item.quantity))

    now = o.created_at if hasattr(o, "created_at") and o.created_at else datetime.now(timezone.utc)

    try:
        phone = KsaPhone(p.customer.phone).e164
    except ValueError:
        phone = _format_phone(p.customer.phone)

    return {
        "date": now.strftime("%d/%m/%Y"),
        "country": "KSA",
        "name": p.customer.full_name,
        "phone": phone,
        "product": "/".join(products),
        "sku": "/".join(skus),
        "quantity": "/".join(quantities),
        "totalprice": float(o.total_sar),
        "currency": "SAR",
        "status": "",
    }


def build_order_payload(order: Order) -> dict:
    """Build sheet payload from DB Order model."""
    products = []
    skus = []
    quantities = []
    for item in order.items:
        if not item.is_upsell:
            products.append(item.product_name_ar)
            skus.append(PRODUCT_SKU_MAP.get(item.product_slug, item.product_slug))
            quantities.append(str(item.quantity))

    return {
        "date": order.created_at.strftime("%d/%m/%Y"),
        "country": "KSA",
        "name": order.full_name,
        "phone": _format_phone(order.phone_e164),
        "product": "/".join(products),
        "sku": "/".join(skus),
        "quantity": "/".join(quantities),
        "totalprice": float(order.total_sar),
        "currency": "SAR",
        "status": "",
    }
