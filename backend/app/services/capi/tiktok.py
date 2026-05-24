from __future__ import annotations

from datetime import datetime, timezone

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.services.capi.base import UserData, build_tiktok_user_data

logger = structlog.get_logger()

EVENT_MAP: dict[str, str] = {
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Purchase": "CompletePayment",
    "UpsellAccept": "CompletePayment",
    "PageView": "Pageview",
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
    referrer: str | None = None,
) -> None:
    if not settings.ENABLE_CAPI or not settings.ENABLE_TIKTOK_CAPI:
        return
    if not settings.TIKTOK_PIXEL_CODE or not settings.TIKTOK_ACCESS_TOKEN:
        return

    platform_event = EVENT_MAP.get(event_name, event_name)
    ts = datetime.fromtimestamp(event_time, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    payload: dict = {
        "pixel_code": settings.TIKTOK_PIXEL_CODE,
        "event": platform_event,
        "event_id": event_id,
        "timestamp": ts,
        "context": {
            "page": {
                "url": event_source_url,
                "referrer": referrer or "",
            },
            "user_agent": user_data.client_user_agent or "",
            "ip": user_data.client_ip or "",
            "user": build_tiktok_user_data(user_data),
        },
        "properties": custom_data,
    }
    if settings.TIKTOK_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.TIKTOK_TEST_EVENT_CODE

    url = f"https://business-api.tiktok.com/open_api/{settings.TIKTOK_API_VERSION}/event/track/"
    headers = {
        "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json=payload, headers=headers)
        if r.status_code >= 400:
            logger.warning("capi.tiktok.error", status=r.status_code, body=r.text[:500])
        else:
            logger.info("capi.tiktok.ok", event=platform_event, event_id=event_id)
