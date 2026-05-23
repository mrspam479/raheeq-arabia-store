from __future__ import annotations

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.services.capi.base import UserData, build_snap_user_data

logger = structlog.get_logger()

EVENT_MAP: dict[str, str] = {
    "ViewContent": "VIEW_CONTENT",
    "AddToCart": "ADD_CART",
    "InitiateCheckout": "START_CHECKOUT",
    "Purchase": "PURCHASE",
    "UpsellAccept": "PURCHASE",
    "PageView": "PAGE_VIEW",
}


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=30))
async def send_event(
    *,
    event_name: str,
    event_id: str,
    event_time: int,
    event_source_url: str,
    user_data: UserData,
    custom_data: dict,
) -> None:
    if not settings.SNAP_PIXEL_ID or not settings.SNAP_ACCESS_TOKEN:
        return

    platform_event = EVENT_MAP.get(event_name, event_name.upper())
    payload: dict = {
        "data": [
            {
                "event_name": platform_event,
                "event_time": event_time,
                "event_source_url": event_source_url,
                "action_source": "website",
                "event_id": event_id,
                "user_data": build_snap_user_data(user_data),
                "custom_data": custom_data,
            }
        ]
    }
    if settings.SNAP_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.SNAP_TEST_EVENT_CODE

    url = f"https://tr.snapchat.com/v3/{settings.SNAP_PIXEL_ID}/events?access_token={settings.SNAP_ACCESS_TOKEN}"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json=payload)
        if r.status_code >= 400:
            logger.warning("capi.snap.error", status=r.status_code, body=r.text[:500])
        else:
            logger.info("capi.snap.ok", event=platform_event, event_id=event_id)
