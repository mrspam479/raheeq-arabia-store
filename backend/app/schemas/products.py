from __future__ import annotations

import uuid
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class IngredientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name_ar: str
    name_en: str
    dose: str
    what_it_does_ar: str
    science_source_short: str
    thumb_image_url: str | None = None


class OfferOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    label_ar: str
    quantity: int
    price_sar: Decimal
    is_recommended: bool


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    author_first_name_ar: str
    author_city_ar: str | None = None
    rating: int
    body_ar: str


class FaqOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    question_ar: str
    answer_ar: str


class SeoOut(BaseModel):
    title_ar: str | None = None
    description_ar: str | None = None


class ProductSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    name_ar: str
    hero_tag_ar: str
    short_description_ar: str
    rating_value: Decimal
    review_count: int
    stock_label_ar: str | None = None
    cover_image_url: str
    offers: list[OfferOut] = []


class ProductDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    name_ar: str
    working_name: str
    hero_tag_ar: str
    short_description_ar: str
    long_description_ar: str
    rating_value: Decimal
    review_count: int
    stock_label_ar: str | None = None
    cover_image_url: str
    gallery_image_urls: list[str] = []
    offers: list[OfferOut] = []
    ingredients: list[IngredientOut] = []
    reviews: list[ReviewOut] = []
    faqs: list[FaqOut] = []
    seo: SeoOut = SeoOut()


class ProductListOut(BaseModel):
    products: list[ProductSummaryOut]
