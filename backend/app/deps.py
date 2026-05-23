from __future__ import annotations

import asyncio
import secrets
from collections import defaultdict
from time import time
from typing import AsyncGenerator

import structlog
from fastapi import Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.base import AsyncSessionLocal

logger = structlog.get_logger()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


def require_api_key(x_api_key: str = Header(...)) -> None:
    if not secrets.compare_digest(x_api_key, settings.BACKEND_API_KEY):
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid API key"})


# Simple in-process token bucket for rate limiting
_buckets: dict[str, list[float]] = defaultdict(list)
_bucket_lock = asyncio.Lock()


async def rate_limit_orders(request: Request) -> None:
    """6 requests / minute / IP for /api/orders."""
    ip = _get_client_ip(request)
    now = time()
    async with _bucket_lock:
        window = [t for t in _buckets[ip] if now - t < 60]
        if len(window) >= 6:
            raise HTTPException(
                status_code=429,
                detail={"code": "RATE_LIMITED", "message": "أعيدي المحاولة بعد قليل."},
            )
        window.append(now)
        _buckets[ip] = window


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"
