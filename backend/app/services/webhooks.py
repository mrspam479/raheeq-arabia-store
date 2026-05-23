from __future__ import annotations

import json
from decimal import Decimal

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.db.models import Order, WebhookLog

logger = structlog.get_logger()


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
        "secret": settings.SHEET_WEBHOOK_SECRET,
        "kind": kind,
        "payload": payload,
    }
    try:
        await _post_with_retry(settings.SHEET_WEBHOOK_URL, body)
        logger.info("webhook.sheet.ok", kind=kind)
    except Exception:
        logger.exception("webhook.sheet.failed", kind=kind)


def build_order_payload_from_out(order_out: object, payload: object) -> dict:
    """Build sheet payload from Pydantic output objects (used in router after order creation)."""
    from app.schemas.orders import OrderCreateIn, OrderOut

    o = order_out  # type: ignore[assignment]
    p = payload  # type: ignore[assignment]
    items_summary_parts = []
    items_json_list = []
    for item in o.lines:
        if not item.is_upsell:
            items_summary_parts.append(f"{item.product_name_ar} × {item.offer_label_ar} ({item.quantity})")
            items_json_list.append({
                "sku": item.product_slug,
                "offer": item.offer_code,
                "qty": item.quantity,
                "unit_price": float(item.unit_price_sar),
            })

    tracking = p.tracking
    utm = tracking.utm
    return {
        "created_at": o.created_at.isoformat(),
        "order_id": str(o.id),
        "status": o.status,
        "full_name": p.customer.full_name,
        "phone_e164": "",  # normalized e164 not available here; use order db record
        "address_line": "",
        "city": "",
        "notes": "",
        "items_summary": " + ".join(items_summary_parts),
        "items_json": json.dumps(items_json_list, ensure_ascii=False),
        "subtotal_sar": float(o.subtotal_sar),
        "upsell_added_sar": float(o.upsell_added_sar),
        "total_sar": float(o.total_sar),
        "currency": o.currency,
        "utm_source": utm.source if utm else "",
        "utm_medium": utm.medium if utm else "",
        "utm_campaign": utm.campaign if utm else "",
        "utm_content": utm.content if utm else "",
        "landing_url": tracking.landing_url or "",
        "referrer": tracking.referrer or "",
        "client_ip": "",
        "client_user_agent": tracking.client_user_agent or "",
        "fbp": tracking.fbp or "",
        "fbc": tracking.fbc or "",
        "ttp": tracking.ttp or "",
        "ttclid": tracking.ttclid or "",
        "sc_click_id": tracking.sc_click_id or "",
        "event_id": str(tracking.event_id),
        "idempotency_key": str(tracking.event_id),
    }


def build_order_payload(order: Order) -> dict:
    items_summary_parts = []
    items_json_list = []
    for item in order.items:
        if not item.is_upsell:
            items_summary_parts.append(f"{item.product_name_ar} × {item.offer_label_ar} ({item.quantity})")
            items_json_list.append({
                "sku": item.product_slug,
                "offer": item.offer_code,
                "qty": item.quantity,
                "unit_price": float(item.unit_price_sar),
            })

    return {
        "created_at": order.created_at.isoformat(),
        "order_id": str(order.id),
        "status": order.status,
        "full_name": order.full_name,
        "phone_e164": order.phone_e164,
        "address_line": order.address_line or "",
        "city": order.city or "",
        "notes": order.notes or "",
        "items_summary": " + ".join(items_summary_parts),
        "items_json": json.dumps(items_json_list, ensure_ascii=False),
        "subtotal_sar": float(order.subtotal_sar),
        "upsell_added_sar": float(order.upsell_added_sar),
        "total_sar": float(order.total_sar),
        "currency": order.currency,
        "utm_source": order.utm_source or "",
        "utm_medium": order.utm_medium or "",
        "utm_campaign": order.utm_campaign or "",
        "utm_content": order.utm_content or "",
        "landing_url": order.landing_url or "",
        "referrer": order.referrer or "",
        "client_ip": str(order.client_ip) if order.client_ip else "",
        "client_user_agent": order.client_user_agent or "",
        "fbp": order.fbp or "",
        "fbc": order.fbc or "",
        "ttp": order.ttp or "",
        "ttclid": order.ttclid or "",
        "sc_click_id": order.sc_click_id or "",
        "event_id": str(order.event_id),
        "idempotency_key": str(order.idempotency_key),
    }
