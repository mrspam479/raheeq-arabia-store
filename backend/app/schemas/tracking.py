from __future__ import annotations

import uuid
from typing import Any

from pydantic import BaseModel


class TrackUserIn(BaseModel):
    phone: str | None = None
    first_name: str | None = None


class TrackClientIn(BaseModel):
    user_agent: str | None = None
    ip: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    sc_click_id: str | None = None


class TrackContentItem(BaseModel):
    id: str
    quantity: int
    item_price: float


class TrackDataIn(BaseModel):
    currency: str = "SAR"
    value: float
    contents: list[TrackContentItem] = []
    num_items: int = 0
    content_type: str = "product"
    order_id: str | None = None


class TrackEventIn(BaseModel):
    event_name: str
    event_id: uuid.UUID
    event_time: int
    event_source_url: str
    user: TrackUserIn = TrackUserIn()
    client: TrackClientIn = TrackClientIn()
    data: TrackDataIn


class TrackEventOut(BaseModel):
    queued: bool = True
