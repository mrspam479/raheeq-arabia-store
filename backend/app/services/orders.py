from __future__ import annotations

import uuid
from decimal import Decimal

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models import Offer, Order, OrderItem, Product
from app.schemas.orders import OrderCreateIn, OrderItemOut, OrderOut, UpsellOfferOut
from app.services.pricing import UPSELL_PRICE, get_upsell_sku
from app.utils.ksa_phone import KsaPhone

logger = structlog.get_logger()


def _make_upsell_token(order_id: uuid.UUID, secret_key: str) -> str:
    from itsdangerous import URLSafeTimedSerializer

    s = URLSafeTimedSerializer(secret_key)
    return str(s.dumps(str(order_id)))


def verify_upsell_token(token: str, order_id: uuid.UUID, secret_key: str, max_age: int = 600) -> bool:
    from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

    s = URLSafeTimedSerializer(secret_key)
    try:
        value = s.loads(token, max_age=max_age)
        return str(value) == str(order_id)
    except (BadSignature, SignatureExpired):
        return False


def _serialize_order(order: Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        status=order.status,
        subtotal_sar=order.subtotal_sar,
        upsell_added_sar=order.upsell_added_sar,
        total_sar=order.total_sar,
        currency=order.currency,
        lines=[
            OrderItemOut(
                product_slug=item.product_slug,
                product_name_ar=item.product_name_ar,
                offer_code=item.offer_code,
                offer_label_ar=item.offer_label_ar,
                quantity=item.quantity,
                unit_price_sar=item.unit_price_sar,
                is_upsell=item.is_upsell,
            )
            for item in order.items
        ],
        created_at=order.created_at,
    )


async def create_order(
    session: AsyncSession,
    payload: OrderCreateIn,
    client_ip: str | None,
    secret_key: str,
) -> tuple[OrderOut, UpsellOfferOut | None]:
    # Validate phone
    try:
        ksa = KsaPhone(payload.customer.phone)
    except ValueError as exc:
        raise ValueError(f"INVALID_PHONE: {exc}") from exc

    # Check idempotency
    from app.db.models import Order as OrderModel

    existing = await session.execute(
        select(OrderModel)
        .where(OrderModel.idempotency_key == payload.tracking.event_id)
        .options(selectinload(OrderModel.items))
    )
    # Use a separate idempotency_key concept — but per spec, the event_id IS the shared key
    # Actually per spec: Idempotency-Key header is a UUID generated per checkout session
    # We need to look it up separately. Let's use the tracking.event_id as the idempotency key.
    existing_order = existing.scalar_one_or_none()
    if existing_order is not None:
        upsell_sku = get_upsell_sku([i.product_slug for i in existing_order.items if not i.is_upsell])
        upsell: UpsellOfferOut | None = None
        if upsell_sku:
            token = _make_upsell_token(existing_order.id, secret_key)
            upsell = UpsellOfferOut(token=token, sku=upsell_sku, price_sar=UPSELL_PRICE)
        return _serialize_order(existing_order), upsell

    # Resolve products + offers
    items_to_create: list[dict] = []
    subtotal = Decimal("0")
    cart_slugs: list[str] = []

    for line in payload.lines:
        product_result = await session.execute(
            select(Product)
            .where(Product.slug == line.product_slug, Product.is_active.is_(True))
            .options(selectinload(Product.offers))
        )
        product = product_result.scalar_one_or_none()
        if product is None:
            raise ValueError(f"PRODUCT_NOT_FOUND: {line.product_slug}")

        offer_result = await session.execute(
            select(Offer).where(
                Offer.product_id == product.id,
                Offer.code == line.offer_code,
                Offer.is_active.is_(True),
            )
        )
        offer = offer_result.scalar_one_or_none()
        if offer is None:
            raise ValueError(f"OFFER_NOT_FOUND: {line.offer_code} for {line.product_slug}")

        items_to_create.append(
            {
                "product_id": product.id,
                "offer_id": offer.id,
                "product_slug": product.slug,
                "product_name_ar": product.name_ar,
                "offer_code": offer.code,
                "offer_label_ar": offer.label_ar,
                "quantity": offer.quantity,
                "unit_price_sar": offer.price_sar,
                "is_upsell": False,
            }
        )
        subtotal += offer.price_sar
        cart_slugs.append(product.slug)

    tracking = payload.tracking
    utm = tracking.utm

    order = Order(
        idempotency_key=payload.tracking.event_id,
        status="pending",
        full_name=payload.customer.full_name,
        phone_e164=ksa.e164,
        subtotal_sar=subtotal,
        upsell_added_sar=Decimal("0"),
        total_sar=subtotal,
        currency="SAR",
        event_id=tracking.event_id,
        client_ip=client_ip,
        client_user_agent=tracking.client_user_agent,
        fbp=tracking.fbp,
        fbc=tracking.fbc,
        ttp=tracking.ttp,
        ttclid=tracking.ttclid,
        sc_click_id=tracking.sc_click_id,
        referrer=tracking.referrer,
        landing_url=tracking.landing_url,
        utm_source=utm.source if utm else None,
        utm_medium=utm.medium if utm else None,
        utm_campaign=utm.campaign if utm else None,
        utm_term=utm.term if utm else None,
        utm_content=utm.content if utm else None,
    )
    session.add(order)
    await session.flush()

    for item_data in items_to_create:
        item = OrderItem(order_id=order.id, **item_data)
        session.add(item)

    await session.flush()

    token = _make_upsell_token(order.id, secret_key)
    order.upsell_token = token

    await session.commit()
    await session.refresh(order)

    # Reload with items
    loaded = await session.execute(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
    order = loaded.scalar_one()

    upsell_sku = get_upsell_sku(cart_slugs)
    upsell = None
    if upsell_sku:
        upsell = UpsellOfferOut(token=token, sku=upsell_sku, price_sar=UPSELL_PRICE)

    logger.info("order.created", order_id=str(order.id))
    return _serialize_order(order), upsell


async def attach_upsell(
    session: AsyncSession,
    order_id: uuid.UUID,
    sku: str,
    token: str,
    secret_key: str,
) -> OrderOut:
    if not verify_upsell_token(token, order_id, secret_key):
        raise PermissionError("INVALID_UPSELL_TOKEN")

    loaded = await session.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = loaded.scalar_one_or_none()
    if order is None:
        raise ValueError("ORDER_NOT_FOUND")

    # Idempotent: already has upsell
    if any(i.is_upsell for i in order.items):
        return _serialize_order(order)

    product_result = await session.execute(
        select(Product)
        .where(Product.slug == sku, Product.is_active.is_(True))
        .options(selectinload(Product.offers))
    )
    product = product_result.scalar_one_or_none()
    if product is None:
        raise ValueError(f"PRODUCT_NOT_FOUND: {sku}")

    offer_result = await session.execute(
        select(Offer).where(Offer.product_id == product.id, Offer.code == "T1")
    )
    offer = offer_result.scalar_one_or_none()
    if offer is None:
        raise ValueError("OFFER_NOT_FOUND")

    upsell_item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        offer_id=offer.id,
        product_slug=product.slug,
        product_name_ar=product.name_ar,
        offer_code="T1",
        offer_label_ar="علبة",
        quantity=1,
        unit_price_sar=UPSELL_PRICE,
        is_upsell=True,
    )
    session.add(upsell_item)
    order.upsell_added_sar = UPSELL_PRICE
    order.total_sar = order.subtotal_sar + UPSELL_PRICE
    await session.commit()

    loaded2 = await session.execute(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
    order = loaded2.scalar_one()
    logger.info("order.upsell_attached", order_id=str(order.id), sku=sku)
    return _serialize_order(order)
