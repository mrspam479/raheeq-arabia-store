from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now(), nullable=False
    )


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    slug: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    name_ar: Mapped[str] = mapped_column(String(120), nullable=False)
    working_name: Mapped[str] = mapped_column(String(120), nullable=False)
    hero_tag_ar: Mapped[str] = mapped_column(String(280), nullable=False)
    short_description_ar: Mapped[str] = mapped_column(Text, nullable=False)
    long_description_ar: Mapped[str] = mapped_column(Text, nullable=False)
    rating_value: Mapped[Decimal] = mapped_column(
        Numeric(3, 2), nullable=False, default=Decimal("4.9")
    )
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    stock_label_ar: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cover_image_url: Mapped[str] = mapped_column(Text, nullable=False)
    gallery_image_urls: Mapped[list[str]] = mapped_column(
        JSONB, nullable=False, server_default="[]"
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    seo_title_ar: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seo_description_ar: Mapped[str | None] = mapped_column(String(300), nullable=True)

    ingredients: Mapped[list[Ingredient]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="Ingredient.sort_order"
    )
    offers: Mapped[list[Offer]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="Offer.sort_order"
    )
    reviews: Mapped[list[Review]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    faqs: Mapped[list[Faq]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="Faq.sort_order"
    )

    __table_args__ = (
        Index("ix_products_active_sort", "is_active", "sort_order"),
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )
    name_ar: Mapped[str] = mapped_column(String(120), nullable=False)
    name_en: Mapped[str] = mapped_column(String(120), nullable=False)
    dose: Mapped[str] = mapped_column(String(40), nullable=False)
    what_it_does_ar: Mapped[str] = mapped_column(Text, nullable=False)
    science_source_short: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    thumb_image_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    product: Mapped[Product] = relationship(back_populates="ingredients")

    __table_args__ = (
        Index("ix_ingredients_product_sort", "product_id", "sort_order"),
    )


class Offer(Base):
    __tablename__ = "offers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(8), nullable=False)
    label_ar: Mapped[str] = mapped_column(String(60), nullable=False)
    quantity: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    price_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    is_recommended: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    product: Mapped[Product] = relationship(back_populates="offers")

    __table_args__ = (
        UniqueConstraint("product_id", "code", name="uq_offers_product_code"),
        CheckConstraint("code IN ('T1','T2','T3')", name="ck_offers_code"),
    )


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    product_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
        nullable=True,
    )
    author_first_name_ar: Mapped[str] = mapped_column(String(40), nullable=False)
    author_city_ar: Mapped[str | None] = mapped_column(String(40), nullable=True)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    body_ar: Mapped[str] = mapped_column(Text, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False
    )

    product: Mapped[Product | None] = relationship(back_populates="reviews")

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_reviews_rating"),
        Index("ix_reviews_product_published", "product_id", "is_published", "sort_order"),
    )


class Faq(Base):
    __tablename__ = "faqs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    product_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
        nullable=True,
    )
    question_ar: Mapped[str] = mapped_column(String(280), nullable=False)
    answer_ar: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    product: Mapped[Product | None] = relationship(back_populates="faqs")


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    idempotency_key: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, unique=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending"
    )
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone_e164: Mapped[str] = mapped_column(String(20), nullable=False)
    address_line: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(80), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    subtotal_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    upsell_added_sar: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=Decimal("0")
    )
    total_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="SAR")
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    client_ip: Mapped[str | None] = mapped_column(INET, nullable=True)
    client_user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    fbp: Mapped[str | None] = mapped_column(String(120), nullable=True)
    fbc: Mapped[str | None] = mapped_column(String(160), nullable=True)
    ttp: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ttclid: Mapped[str | None] = mapped_column(String(160), nullable=True)
    sc_click_id: Mapped[str | None] = mapped_column(String(160), nullable=True)
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
    landing_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_term: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_content: Mapped[str | None] = mapped_column(String(120), nullable=True)
    upsell_token: Mapped[str | None] = mapped_column(String(255), nullable=True)

    items: Mapped[list[OrderItem]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending','confirmed','shipped','delivered','returned','cancelled')",
            name="ck_orders_status",
        ),
        Index("ix_orders_status_created", "status", "created_at"),
        Index("ix_orders_phone", "phone_e164"),
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id"), nullable=False
    )
    offer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("offers.id"), nullable=False
    )
    product_slug: Mapped[str] = mapped_column(String(64), nullable=False)
    product_name_ar: Mapped[str] = mapped_column(String(120), nullable=False)
    offer_code: Mapped[str] = mapped_column(String(8), nullable=False)
    offer_label_ar: Mapped[str] = mapped_column(String(60), nullable=False)
    quantity: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    unit_price_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    is_upsell: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    order: Mapped[Order] = relationship(back_populates="items")

    __table_args__ = (Index("ix_order_items_order", "order_id"),)


class WebhookLog(Base):
    __tablename__ = "webhook_log"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    order_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True
    )
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    attempt: Mapped[int] = mapped_column(SmallInteger, nullable=False, default=1)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False)
    http_status: Mapped[int | None] = mapped_column(Integer, nullable=True)
    response_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_webhook_log_order", "order_id"),
        Index("ix_webhook_log_created", "created_at"),
        Index("ix_webhook_log_kind_success", "kind", "success"),
    )


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    event_name: Mapped[str] = mapped_column(String(40), nullable=False)
    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    client_ip: Mapped[str | None] = mapped_column(INET, nullable=True)
    client_user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_valid_ksa: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_tracking_events_event_id", "event_id"),
        Index("ix_tracking_events_name_created", "event_name", "created_at"),
    )
