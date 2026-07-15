from __future__ import annotations

import asyncio

from fastapi import APIRouter, Depends, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import datetime

from app.deps import get_db, require_api_key
from app.db.base import AsyncSessionLocal
from app.db.models import TrackingEvent
from app.schemas.tracking import TrackEventIn, TrackEventOut
from app.services.geocheck import check_ip
from app.services.capi import meta as meta_capi
from app.services.capi import snap as snap_capi
from app.services.capi import tiktok as tiktok_capi
from app.services.capi.base import UserData

router = APIRouter(prefix="/api/track", tags=["tracking"])


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return ""


async def _save_event_db(
    payload: TrackEventIn,
    client_ip: str,
):
    try:
        geo_res = await check_ip(client_ip)
        is_valid_ksa = geo_res.allowed

        async with AsyncSessionLocal() as session:
            db_event = TrackingEvent(
                event_id=payload.event_id,
                event_name=payload.event_name,
                platform="web",
                client_ip=client_ip,
                client_user_agent=payload.client.user_agent,
                payload=payload.model_dump(),
                is_valid_ksa=is_valid_ksa,
                created_at=datetime.datetime.fromtimestamp(payload.event_time, tz=datetime.timezone.utc).replace(tzinfo=None)
            )
            session.add(db_event)
            await session.commit()
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error saving tracking event to DB: {e}")

async def _send_capi_events(
    event_name: str,
    event_id: str,
    event_time: int,
    event_source_url: str | None,
    ud: UserData,
    meta_custom: dict,
    tiktok_custom: dict,
    snap_custom: dict,
) -> None:
    await asyncio.gather(
        meta_capi.send_event(event_name=event_name, event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data=meta_custom),
        tiktok_capi.send_event(event_name=event_name, event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data=tiktok_custom),
        snap_capi.send_event(event_name=event_name, event_id=event_id, event_time=event_time, event_source_url=event_source_url, user_data=ud, custom_data=snap_custom),
        return_exceptions=True,
    )


@router.post("", response_model=TrackEventOut, status_code=202, dependencies=[Depends(require_api_key)])
async def track_event(payload: TrackEventIn, request: Request, background_tasks: BackgroundTasks) -> TrackEventOut:
    client_ip = _get_client_ip(request) or payload.client.ip or ""

    ud = UserData(
        phone_raw=payload.user.phone,
        first_name=payload.user.first_name,
        order_id=payload.data.order_id,
        client_ip=client_ip,
        client_user_agent=payload.client.user_agent,
        fbp=payload.client.fbp,
        fbc=payload.client.fbc,
        ttp=payload.client.ttp,
        ttclid=payload.client.ttclid,
        sc_click_id=payload.client.sc_click_id,
    )

    event_id = str(payload.event_id)
    event_time = payload.event_time
    event_source_url = payload.event_source_url

    meta_custom = {
        "currency": payload.data.currency,
        "value": payload.data.value,
        "content_type": payload.data.content_type,
        "content_ids": [c.id for c in payload.data.contents],
        "contents": [{"id": c.id, "quantity": c.quantity, "item_price": c.item_price} for c in payload.data.contents],
        "num_items": payload.data.num_items,
        "order_id": payload.data.order_id,
    }

    tiktok_custom = {
        "currency": payload.data.currency,
        "value": payload.data.value,
        "contents": [{"content_id": c.id, "quantity": c.quantity, "price": c.item_price} for c in payload.data.contents],
        "content_type": payload.data.content_type,
        "order_id": payload.data.order_id,
    }

    snap_custom = {
        "currency": payload.data.currency,
        "value": payload.data.value,
        "num_items": payload.data.num_items,
        "content_ids": [c.id for c in payload.data.contents],
        "content_type": payload.data.content_type,
        "order_id": payload.data.order_id,
    }

    background_tasks.add_task(
        _send_capi_events,
        payload.event_name, event_id, event_time, event_source_url, ud,
        meta_custom, tiktok_custom, snap_custom,
    )

    background_tasks.add_task(_save_event_db, payload, client_ip)

    return TrackEventOut(queued=True)
