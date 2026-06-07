from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.deps import get_db, bearer_scheme
from app.db.models import Order, OrderItem, TrackingEvent
from app.schemas.orders import AdminOrderUpdateIn, OrderItemOut, OrderOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


class LoginIn(BaseModel):
    username: str
    password: str


@router.post("/login")
async def admin_login(payload: LoginIn) -> dict:
    if payload.username == settings.ADMIN_LOGIN and payload.password == settings.ADMIN_PASSWORD:
        return {"token": settings.ADMIN_PASSWORD}
    raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid credentials"})


def _verify_admin_token(cred: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> None:
    if not cred or not secrets.compare_digest(cred.credentials, settings.ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid admin token"})


def _parse_date_range(start_date: str | None, end_date: str | None) -> tuple[datetime, datetime]:
    now = datetime.utcnow()
    try:
        start_dt = (
            datetime.fromisoformat(start_date.replace('Z', '+00:00')).replace(tzinfo=None)
            if start_date else now - timedelta(days=30)
        )
        end_dt = (
            datetime.fromisoformat(end_date.replace('Z', '+00:00')).replace(tzinfo=None)
            if end_date else now
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")
    return start_dt, end_dt


@router.get("/metrics/overview", dependencies=[Depends(_verify_admin_token)])
async def metrics_overview(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    start_dt, end_dt = _parse_date_range(start_date, end_date)
    in_range = and_(Order.created_at >= start_dt, Order.created_at <= end_dt)

    # Visitor count (valid KSA only)
    clicks = (await db.execute(
        select(func.count(TrackingEvent.id)).where(
            TrackingEvent.event_name == "ViewContent",
            TrackingEvent.is_valid_ksa == True,
            TrackingEvent.created_at >= start_dt,
            TrackingEvent.created_at <= end_dt,
        )
    )).scalar() or 0

    # Order counts by status
    status_rows = (await db.execute(
        select(Order.status, func.count(Order.id), func.coalesce(func.sum(Order.total_sar), 0))
        .where(in_range).group_by(Order.status)
    )).all()
    by_status = {s: {"count": c, "revenue": float(r)} for s, c, r in status_rows}

    total_orders = sum(v["count"] for v in by_status.values())
    confirmed_count = sum(by_status.get(s, {}).get("count", 0) for s in ["confirmed", "shipped", "delivered"])
    delivered_count = by_status.get("delivered", {}).get("count", 0)
    cancelled_count = by_status.get("cancelled", {}).get("count", 0)
    returned_count = by_status.get("returned", {}).get("count", 0)
    pending_count = by_status.get("pending", {}).get("count", 0)
    shipped_count = by_status.get("shipped", {}).get("count", 0) + delivered_count + returned_count

    # Revenue (only count delivered as net realized)
    gross_revenue = sum(v["revenue"] for v in by_status.values())
    net_revenue = by_status.get("delivered", {}).get("revenue", 0)

    aov = (gross_revenue / total_orders) if total_orders > 0 else 0
    conversion_rate = (total_orders / clicks * 100) if clicks > 0 else 0
    confirmation_rate = (confirmed_count / total_orders * 100) if total_orders > 0 else 0
    delivery_rate = (delivered_count / confirmed_count * 100) if confirmed_count > 0 else 0
    return_rate = (returned_count / delivered_count * 100) if delivered_count > 0 else 0
    cancel_rate = (cancelled_count / total_orders * 100) if total_orders > 0 else 0

    # Upsell take rate
    upsell_orders = (await db.execute(
        select(func.count(Order.id)).where(in_range, Order.upsell_added_sar > 0)
    )).scalar() or 0
    upsell_rate = (upsell_orders / total_orders * 100) if total_orders > 0 else 0
    upsell_revenue = (await db.execute(
        select(func.coalesce(func.sum(Order.upsell_added_sar), 0)).where(in_range)
    )).scalar() or 0

    return {
        "clicks": clicks,
        "total_orders": total_orders,
        "gross_revenue": float(gross_revenue),
        "net_revenue": float(net_revenue),
        "aov": round(float(aov), 2),
        "conversion_rate": round(conversion_rate, 2),
        "confirmation_rate": round(confirmation_rate, 2),
        "delivery_rate": round(delivery_rate, 2),
        "return_rate": round(return_rate, 2),
        "cancel_rate": round(cancel_rate, 2),
        "upsell_rate": round(upsell_rate, 2),
        "upsell_revenue": float(upsell_revenue),
        "by_status": {
            "pending": pending_count,
            "confirmed": by_status.get("confirmed", {}).get("count", 0),
            "shipped": by_status.get("shipped", {}).get("count", 0),
            "delivered": delivered_count,
            "returned": returned_count,
            "cancelled": cancelled_count,
        },
    }


@router.get("/metrics/top-products", dependencies=[Depends(_verify_admin_token)])
async def metrics_top_products(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    start_dt, end_dt = _parse_date_range(start_date, end_date)
    rows = (await db.execute(
        select(
            OrderItem.product_slug,
            OrderItem.product_name_ar,
            func.sum(OrderItem.quantity).label("qty"),
            func.sum(OrderItem.quantity * OrderItem.unit_price_sar).label("revenue"),
            func.count(OrderItem.id.distinct()).label("orders"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.created_at >= start_dt, Order.created_at <= end_dt)
        .group_by(OrderItem.product_slug, OrderItem.product_name_ar)
        .order_by(func.sum(OrderItem.quantity * OrderItem.unit_price_sar).desc())
        .limit(10)
    )).all()
    return {
        "items": [
            {
                "slug": r[0],
                "name_ar": r[1],
                "quantity": int(r[2] or 0),
                "revenue": float(r[3] or 0),
                "orders": int(r[4] or 0),
            }
            for r in rows
        ]
    }


@router.get("/metrics/top-cities", dependencies=[Depends(_verify_admin_token)])
async def metrics_top_cities(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    start_dt, end_dt = _parse_date_range(start_date, end_date)
    rows = (await db.execute(
        select(
            func.coalesce(Order.city, "غير محدد").label("city"),
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_sar), 0),
        )
        .where(Order.created_at >= start_dt, Order.created_at <= end_dt)
        .group_by(Order.city)
        .order_by(func.count(Order.id).desc())
        .limit(10)
    )).all()
    return {
        "items": [
            {"city": r[0] or "غير محدد", "orders": int(r[1]), "revenue": float(r[2])}
            for r in rows
        ]
    }


@router.get("/metrics/top-sources", dependencies=[Depends(_verify_admin_token)])
async def metrics_top_sources(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    start_dt, end_dt = _parse_date_range(start_date, end_date)
    rows = (await db.execute(
        select(
            func.coalesce(Order.utm_source, "direct").label("source"),
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_sar), 0),
        )
        .where(Order.created_at >= start_dt, Order.created_at <= end_dt)
        .group_by(Order.utm_source)
        .order_by(func.count(Order.id).desc())
        .limit(10)
    )).all()
    return {
        "items": [
            {"source": r[0] or "direct", "orders": int(r[1]), "revenue": float(r[2])}
            for r in rows
        ]
    }


@router.get("/metrics/timeseries", dependencies=[Depends(_verify_admin_token)])
async def metrics_timeseries(
    start_date: str | None = None,
    end_date: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    start_dt, end_dt = _parse_date_range(start_date, end_date)
    rows = (await db.execute(
        select(
            func.date(Order.created_at).label("day"),
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_sar), 0),
        )
        .where(Order.created_at >= start_dt, Order.created_at <= end_dt)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
    )).all()
    return {
        "items": [
            {"day": r[0].isoformat() if r[0] else None, "orders": int(r[1]), "revenue": float(r[2])}
            for r in rows
        ]
    }


@router.get("/orders", dependencies=[Depends(_verify_admin_token)])
async def list_orders(
    status: str | None = None,
    q: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> dict:
    stmt = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).limit(limit)
    if status and status != "all":
        stmt = stmt.where(Order.status == status)
    if q:
        like = f"%{q}%"
        stmt = stmt.where((Order.full_name.ilike(like)) | (Order.phone_e164.ilike(like)) | (Order.city.ilike(like)))
    if start_date or end_date:
        start_dt, end_dt = _parse_date_range(start_date, end_date)
        stmt = stmt.where(Order.created_at >= start_dt, Order.created_at <= end_dt)
    result = await db.execute(stmt)
    orders = result.scalars().all()
    return {
        "items": [
            {
                "id": str(o.id),
                "status": o.status,
                "full_name": o.full_name,
                "phone": o.phone_e164,
                "city": o.city,
                "address_line": o.address_line,
                "notes": o.notes,
                "subtotal_sar": float(o.subtotal_sar),
                "upsell_added_sar": float(o.upsell_added_sar),
                "total_sar": float(o.total_sar),
                "currency": o.currency,
                "utm_source": o.utm_source,
                "utm_medium": o.utm_medium,
                "utm_campaign": o.utm_campaign,
                "created_at": o.created_at.isoformat(),
                "lines": [
                    {
                        "product_slug": i.product_slug,
                        "product_name_ar": i.product_name_ar,
                        "offer_label_ar": i.offer_label_ar,
                        "quantity": i.quantity,
                        "unit_price_sar": float(i.unit_price_sar),
                        "is_upsell": i.is_upsell,
                    }
                    for i in o.items
                ],
            }
            for o in orders
        ]
    }


@router.patch("/orders/{order_id}", status_code=204, response_model=None, dependencies=[Depends(_verify_admin_token)])
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
