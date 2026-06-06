from __future__ import annotations

import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.deps import get_db, require_api_key
from app.db.models import Order, TrackingEvent
from app.schemas.orders import AdminOrderUpdateIn, OrderItemOut, OrderOut

router = APIRouter(prefix="/api/admin", tags=["admin"])

class LoginIn(BaseModel):
    username: str
    password: str

@router.post("/login")
async def admin_login(payload: LoginIn) -> dict:
    if payload.username == settings.ADMIN_LOGIN and payload.password == settings.ADMIN_PASSWORD:
        return {"token": settings.BACKEND_API_KEY}
    raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid credentials"})

@router.get("/metrics", dependencies=[Depends(require_api_key)])
async def get_metrics(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db)
) -> dict:
    now = datetime.utcnow()
    # Default to last 30 days if not provided
    try:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00')).replace(tzinfo=None) if start_date else now - timedelta(days=30)
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00')).replace(tzinfo=None) if end_date else now
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")

    # Total Valid Clicks (page views from KSA non-VPN)
    clicks_stmt = select(func.count(TrackingEvent.id)).where(
        TrackingEvent.event_name == "ViewContent",
        TrackingEvent.is_valid_ksa == True,
        TrackingEvent.created_at >= start_dt,
        TrackingEvent.created_at <= end_dt
    )
    clicks = (await db.execute(clicks_stmt)).scalar() or 0

    # Total Orders
    orders_stmt = select(func.count(Order.id)).where(
        Order.created_at >= start_dt,
        Order.created_at <= end_dt
    )
    orders = (await db.execute(orders_stmt)).scalar() or 0

    # Conversion Rate
    conversion_rate = (orders / clicks * 100) if clicks > 0 else 0.0

    return {
        "clicks": clicks,
        "orders": orders,
        "conversion_rate": round(conversion_rate, 2),
    }

@router.get("/orders", dependencies=[Depends(require_api_key)])
async def list_orders(
    status: str | None = None,
    q: str | None = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
) -> dict:
    stmt = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).limit(limit)
    if status:
        stmt = stmt.where(Order.status == status)
    result = await db.execute(stmt)
    orders = result.scalars().all()
    return {
        "items": [
            OrderOut(
                id=o.id,
                status=o.status,
                subtotal_sar=o.subtotal_sar,
                upsell_added_sar=o.upsell_added_sar,
                total_sar=o.total_sar,
                currency=o.currency,
                lines=[
                    OrderItemOut(
                        product_slug=i.product_slug,
                        product_name_ar=i.product_name_ar,
                        offer_code=i.offer_code,
                        offer_label_ar=i.offer_label_ar,
                        quantity=i.quantity,
                        unit_price_sar=i.unit_price_sar,
                        is_upsell=i.is_upsell,
                    )
                    for i in o.items
                ],
                created_at=o.created_at,
            )
            for o in orders
        ]
    }


@router.patch("/orders/{order_id}", status_code=204, response_model=None, dependencies=[Depends(require_api_key)])
async def update_order(
    order_id: uuid.UUID,
    payload: AdminOrderUpdateIn,
    db: AsyncSession = Depends(get_db),
) -> None:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Order not found"})

    if payload.status:
        valid_statuses = {"pending", "confirmed", "shipped", "delivered", "returned", "cancelled"}
        if payload.status not in valid_statuses:
            raise HTTPException(status_code=422, detail={"code": "INVALID_STATUS"})
        order.status = payload.status
    if payload.address_line is not None:
        order.address_line = payload.address_line
    if payload.city is not None:
        order.city = payload.city
    if payload.notes is not None:
        order.notes = payload.notes

    await db.commit()
