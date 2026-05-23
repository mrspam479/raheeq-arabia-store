"""0001_initial_schema

Revision ID: 0001
Revises:
Create Date: 2026-05-21

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("slug", sa.String(64), nullable=False),
        sa.Column("name_ar", sa.String(120), nullable=False),
        sa.Column("working_name", sa.String(120), nullable=False),
        sa.Column("hero_tag_ar", sa.String(280), nullable=False),
        sa.Column("short_description_ar", sa.Text(), nullable=False),
        sa.Column("long_description_ar", sa.Text(), nullable=False),
        sa.Column("rating_value", sa.Numeric(3, 2), nullable=False, server_default="4.9"),
        sa.Column("review_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("stock_label_ar", sa.String(80), nullable=True),
        sa.Column("cover_image_url", sa.Text(), nullable=False),
        sa.Column("gallery_image_urls", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("seo_title_ar", sa.String(200), nullable=True),
        sa.Column("seo_description_ar", sa.String(300), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_products_active_sort", "products", ["is_active", "sort_order"])

    op.create_table(
        "ingredients",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name_ar", sa.String(120), nullable=False),
        sa.Column("name_en", sa.String(120), nullable=False),
        sa.Column("dose", sa.String(40), nullable=False),
        sa.Column("what_it_does_ar", sa.Text(), nullable=False),
        sa.Column("science_source_short", sa.Text(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("thumb_image_url", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_ingredients_product_sort", "ingredients", ["product_id", "sort_order"])

    op.create_table(
        "offers",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("code", sa.String(8), nullable=False),
        sa.Column("label_ar", sa.String(60), nullable=False),
        sa.Column("quantity", sa.SmallInteger(), nullable=False),
        sa.Column("price_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_recommended", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.CheckConstraint("code IN ('T1','T2','T3')", name="ck_offers_code"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("product_id", "code", name="uq_offers_product_code"),
    )

    op.create_table(
        "reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("author_first_name_ar", sa.String(40), nullable=False),
        sa.Column("author_city_ar", sa.String(40), nullable=True),
        sa.Column("rating", sa.SmallInteger(), nullable=False),
        sa.Column("body_ar", sa.Text(), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("rating BETWEEN 1 AND 5", name="ck_reviews_rating"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reviews_product_published", "reviews", ["product_id", "is_published", "sort_order"])

    op.create_table(
        "faqs",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("question_ar", sa.String(280), nullable=False),
        sa.Column("answer_ar", sa.Text(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("idempotency_key", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("full_name", sa.String(120), nullable=False),
        sa.Column("phone_e164", sa.String(20), nullable=False),
        sa.Column("address_line", sa.Text(), nullable=True),
        sa.Column("city", sa.String(80), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("subtotal_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("upsell_added_sar", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("total_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="SAR"),
        sa.Column("event_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("client_ip", postgresql.INET(), nullable=True),
        sa.Column("client_user_agent", sa.Text(), nullable=True),
        sa.Column("fbp", sa.String(120), nullable=True),
        sa.Column("fbc", sa.String(160), nullable=True),
        sa.Column("ttp", sa.String(120), nullable=True),
        sa.Column("ttclid", sa.String(160), nullable=True),
        sa.Column("sc_click_id", sa.String(160), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("landing_url", sa.Text(), nullable=True),
        sa.Column("utm_source", sa.String(80), nullable=True),
        sa.Column("utm_medium", sa.String(80), nullable=True),
        sa.Column("utm_campaign", sa.String(120), nullable=True),
        sa.Column("utm_term", sa.String(120), nullable=True),
        sa.Column("utm_content", sa.String(120), nullable=True),
        sa.Column("upsell_token", sa.String(255), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "status IN ('pending','confirmed','shipped','delivered','returned','cancelled')",
            name="ck_orders_status",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("idempotency_key"),
    )
    op.create_index("ix_orders_status_created", "orders", ["status", "created_at"])
    op.create_index("ix_orders_phone", "orders", ["phone_e164"])

    op.create_table(
        "order_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("offer_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("product_slug", sa.String(64), nullable=False),
        sa.Column("product_name_ar", sa.String(120), nullable=False),
        sa.Column("offer_code", sa.String(8), nullable=False),
        sa.Column("offer_label_ar", sa.String(60), nullable=False),
        sa.Column("quantity", sa.SmallInteger(), nullable=False),
        sa.Column("unit_price_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_upsell", sa.Boolean(), nullable=False, server_default="false"),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.ForeignKeyConstraint(["offer_id"], ["offers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_order_items_order", "order_items", ["order_id"])

    op.create_table(
        "webhook_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("kind", sa.String(40), nullable=False),
        sa.Column("attempt", sa.SmallInteger(), nullable=False, server_default="1"),
        sa.Column("success", sa.Boolean(), nullable=False),
        sa.Column("http_status", sa.Integer(), nullable=True),
        sa.Column("response_body", sa.Text(), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_webhook_log_order", "webhook_log", ["order_id"])
    op.create_index("ix_webhook_log_created", "webhook_log", ["created_at"])
    op.create_index("ix_webhook_log_kind_success", "webhook_log", ["kind", "success"])

    op.create_table(
        "tracking_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("event_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("event_name", sa.String(40), nullable=False),
        sa.Column("platform", sa.String(20), nullable=False),
        sa.Column("client_ip", postgresql.INET(), nullable=True),
        sa.Column("client_user_agent", sa.Text(), nullable=True),
        sa.Column("payload", postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tracking_events_event_id", "tracking_events", ["event_id"])
    op.create_index("ix_tracking_events_name_created", "tracking_events", ["event_name", "created_at"])


def downgrade() -> None:
    op.drop_table("tracking_events")
    op.drop_table("webhook_log")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("faqs")
    op.drop_table("reviews")
    op.drop_table("offers")
    op.drop_table("ingredients")
    op.drop_table("products")
