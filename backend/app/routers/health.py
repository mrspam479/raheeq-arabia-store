from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.schemas.common import HealthOut

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthOut)
async def health() -> HealthOut:
    return HealthOut(status="ok")


@router.get("/ready", response_model=HealthOut)
async def ready(db: AsyncSession = Depends(get_db)) -> HealthOut:
    await db.execute(text("SELECT 1"))
    return HealthOut(status="ok")
