from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CustomerIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=7, max_length=20)


class OrderLineIn(BaseModel):
    product_slug: str
    offer_code: str


class UtmIn(BaseModel):
    source: str | None = None
    medium: str | None = None
    campaign: str | None = None
    term: str | None = None
    content: str | None = None


class TrackingIn(BaseModel):
    event_id: uuid.UUID
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    sc_click_id: str | None = None
    referrer: str | None = None
    landing_url: str | None = None
    utm: UtmIn | None = None
    client_user_agent: str | None = None
    client_ip: str | None = None  # ignored — backend uses proxy-derived IP


class OrderCreateIn(BaseModel):
    customer: CustomerIn
    lines: list[OrderLineIn] = Field(min_length=1, max_length=6)
    tracking: TrackingIn
    honeypot: str = ""


class UpsellIn(BaseModel):
    token: str
    sku: str


class AdminOrderUpdateIn(BaseModel):
    status: str | None = None
    address_line: str | None = None
    city: str | None = None
    notes: str | None = None


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_slug: str
    product_name_ar: str
    offer_code: str
    offer_label_ar: str
    quantity: int
    unit_price_sar: Decimal
    is_upsell: bool


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: str
    subtotal_sar: Decimal
    upsell_added_sar: Decimal
    total_sar: Decimal
    currency: str
    lines: list[OrderItemOut] = []
    created_at: datetime


class UpsellOfferOut(BaseModel):
    token: str
    sku: str
    price_sar: Decimal = Decimal("99")


class OrderCreateOut(BaseModel):
    order: OrderOut
    upsell: UpsellOfferOut | None = None


class UpsellAttachOut(BaseModel):
    order: OrderOut
