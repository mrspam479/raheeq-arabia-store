from __future__ import annotations

import asyncio
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.deps import get_db, rate_limit_orders
from app.schemas.orders import OrderCreateIn, OrderCreateOut, UpsellAttachOut, UpsellIn
from app.services import orders as order_service
from app.services import webhooks
from app.services.capi import meta as meta_capi
from app.services.capi import snap as snap_capi
from app.services.capi import tiktok as tiktok_capi
from app.services.capi.base import UserData
from app.services.geocheck import check_ip as geocheck_ip

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _get_client_ip(request: Request) -> str:
    # X-Real-Client-IP is set by our Next.js proxy with the CF-Connecting-IP value
    # (Cloudflare's guaranteed real user IP). This survives the second Cloudflare hop
    # between the Next.js server and this backend.
    real_client = request.headers.get("X-Real-Client-IP")
    if real_client and real_client.strip():
        return real_client.strip()
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return ""


@router.post("", response_model=OrderCreateOut, status_code=201)
async def create_order(
    payload: OrderCreateIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _rl: None = Depends(rate_limit_orders),
    idempotency_key: str | None = Header(default=None),
) -> OrderCreateOut:
    # Honeypot — silently drop but return 201 to confuse bots
    if payload.honeypot:
        fake_id = uuid.uuid4()
        from app.schemas.orders import OrderItemOut, OrderOut
        from decimal import Decimal
        from datetime import datetime

        return OrderCreateOut(
            order=OrderOut(
                id=fake_id,
                status="pending",
                subtotal_sar=Decimal("349"),
                upsell_added_sar=Decimal("0"),
                total_sar=Decimal("349"),
                currency="SAR",
                lines=[],
                created_at=datetime.utcnow(),
            ),
            upsell=None,
        )

    client_ip = _get_client_ip(request)

    # MaxMind geo + VPN/proxy check (fail-closed)
    geo_result = await geocheck_ip(client_ip, phone=payload.customer.phone)
    if not geo_result.allowed:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "GEO_BLOCKED",
                "message": "عذرًا، لا يمكنك إتمام الطلب. الخدمة متاحة فقط من داخل المملكة العربية السعودية.",
                "reason": geo_result.reason,
            },
        )

    try:
        order_out, upsell = await order_service.create_order(
            session=db,
            payload=payload,
            client_ip=client_ip,
            secret_key=settings.SECRET_KEY,
        )
    except ValueError as exc:
        code = str(exc).split(":")[0] if ":" in str(exc) else "VALIDATION_ERROR"
        raise HTTPException(
            status_code=422,
            detail={"code": code, "message": str(exc)},
        ) from exc

    # Enqueue background jobs (best-effort)
    asyncio.create_task(_fanout(order_out, payload, client_ip, str(payload.tracking.event_id)))

    return OrderCreateOut(order=order_out, upsell=upsell)


@router.patch("/{order_id}/upsell", response_model=UpsellAttachOut)
async def attach_upsell(
    order_id: uuid.UUID,
    payload: UpsellIn,
    db: AsyncSession = Depends(get_db),
) -> UpsellAttachOut:
    try:
        order_out = await order_service.attach_upsell(
            session=db,
            order_id=order_id,
            sku=payload.sku,
            token=payload.token,
            secret_key=settings.SECRET_KEY,
        )
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "message": str(exc)}) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail={"code": "VALIDATION_ERROR", "message": str(exc)}) from exc

    # Enqueue upsell sheet + CAPI
    asyncio.create_task(_upsell_fanout(order_out, payload.sku, str(order_id)))

    return UpsellAttachOut(order=order_out)


async def _fanout(order_out, payload: OrderCreateIn, client_ip: str, event_id: str) -> None:
    import arrow

    event_time = arrow.utcnow().int_timestamp
    tracking = payload.tracking

    ud = UserData(
        phone_raw=payload.customer.phone,
        first_name=payload.customer.full_name.split()[0] if payload.customer.full_name else None,
        order_id=str(order_out.id),
        client_ip=client_ip,
        client_user_agent=tracking.client_user_agent,
        fbp=tracking.fbp,
        fbc=tracking.fbc,
        ttp=tracking.ttp,
        ttclid=tracking.ttclid,
        sc_click_id=tracking.sc_click_id,
    )

    custom_data = {
        "currency": "SAR",
        "value": float(order_out.total_sar),
        "content_type": "product",
        "content_ids": [l.product_slug for l in order_out.lines if not l.is_upsell],
        "contents": [
            {"id": l.product_slug, "quantity": l.quantity, "item_price": float(l.unit_price_sar)}
            for l in order_out.lines if not l.is_upsell
        ],
        "num_items": sum(l.quantity for l in order_out.lines if not l.is_upsell),
        "order_id": str(order_out.id),
    }

    event_source_url = tracking.landing_url or "https://raheeqarabia.com"

    await webhooks.post_to_sheet("order", webhooks.build_order_payload_from_out(order_out, payload))

    await asyncio.gather(
        meta_capi.send_event(event_name="Purchase", event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data=custom_data),
        tiktok_capi.send_event(event_name="Purchase", event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data={"currency": "SAR", "value": float(order_out.total_sar), "contents": [{"content_id": l.product_slug, "quantity": l.quantity, "price": float(l.unit_price_sar)} for l in order_out.lines if not l.is_upsell], "content_type": "product", "order_id": str(order_out.id)}, referrer=tracking.referrer),
        snap_capi.send_event(event_name="Purchase", event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data={"currency": "SAR", "value": float(order_out.total_sar), "num_items": sum(l.quantity for l in order_out.lines if not l.is_upsell), "content_ids": [l.product_slug for l in order_out.lines if not l.is_upsell], "content_type": "product", "order_id": str(order_out.id)}),
        return_exceptions=True,
    )


async def _upsell_fanout(order_out, sku: str, order_id: str) -> None:
    import arrow
    from app.utils.ids import new_uuid_str

    event_id = new_uuid_str()
    event_time = arrow.utcnow().int_timestamp

    await webhooks.post_to_sheet("upsell", {
        "created_at": arrow.utcnow().isoformat(),
        "order_id": order_id,
        "sku": sku,
        "price_sar": 99,
    })
