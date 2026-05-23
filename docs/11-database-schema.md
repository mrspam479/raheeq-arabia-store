# 11 — Database Schema (PostgreSQL)

Database: `raheeqarabia` (already provisioned in EasyPanel). Internal URL: `postgres://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia?sslmode=disable`.

> For SQLAlchemy 2 async + psycopg 3, the SQLAlchemy URL must use `postgresql+psycopg://` and (since EasyPanel internal is plain TCP) **drop** `?sslmode=disable` — psycopg3 ignores it but it can be passed via `connect_args={"sslmode": "disable"}`.

## 1. Naming conventions

- snake_case for tables and columns.
- All tables have `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- All tables have `created_at TIMESTAMPTZ NOT NULL DEFAULT now()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` with an update trigger or SQLAlchemy `onupdate=func.now()`.
- Booleans named `is_*` or `*_enabled`.
- Foreign keys named `<table>_id`.
- Enums encoded as `VARCHAR` with check constraint (Postgres native enums are avoided for easier migration).

Required extension: `pgcrypto` (or `uuid-ossp`) for `gen_random_uuid()`.

## 2. Tables

### 2.1 `products`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `slug` | VARCHAR(64) NOT NULL UNIQUE | `habba-jathr`, `habba-layali`, `habba-noura` |
| `name_ar` | VARCHAR(120) NOT NULL | `حبّة جذر` |
| `working_name` | VARCHAR(120) NOT NULL | `Hair Gummy` |
| `hero_tag_ar` | VARCHAR(280) NOT NULL | |
| `short_description_ar` | TEXT NOT NULL | |
| `long_description_ar` | TEXT NOT NULL | |
| `rating_value` | NUMERIC(3,2) NOT NULL DEFAULT 4.9 | |
| `review_count` | INTEGER NOT NULL DEFAULT 0 | |
| `stock_label_ar` | VARCHAR(80) | rotating string, see CRO doc |
| `cover_image_url` | TEXT NOT NULL | |
| `gallery_image_urls` | JSONB NOT NULL DEFAULT '[]' | |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `is_active` | BOOLEAN NOT NULL DEFAULT true | |
| `seo_title_ar` | VARCHAR(200) | |
| `seo_description_ar` | VARCHAR(300) | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Indexes: `(slug)` unique, `(is_active, sort_order)`.

### 2.2 `ingredients`

(One row per ingredient inside a SKU; ordered.)

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `product_id` | UUID FK → products(id) ON DELETE CASCADE | |
| `name_ar` | VARCHAR(120) NOT NULL | |
| `name_en` | VARCHAR(120) NOT NULL | |
| `dose` | VARCHAR(40) NOT NULL | `5000 mcg` |
| `what_it_does_ar` | TEXT NOT NULL | |
| `science_source_short` | TEXT NOT NULL | |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `thumb_image_url` | TEXT | |

Indexes: `(product_id, sort_order)`.

### 2.3 `offers`

(Three tiers per SKU, identical across SKUs in v1. Kept as a table for future flexibility.)

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `product_id` | UUID FK → products(id) ON DELETE CASCADE | |
| `code` | VARCHAR(8) NOT NULL | `T1` / `T2` / `T3` |
| `label_ar` | VARCHAR(60) NOT NULL | `Glow Kit (الأنصح)` |
| `quantity` | SMALLINT NOT NULL | 1 / 2 / 3 |
| `price_sar` | NUMERIC(10,2) NOT NULL | 199 / 279 / 349 |
| `is_recommended` | BOOLEAN NOT NULL DEFAULT false | T3 only |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `is_active` | BOOLEAN NOT NULL DEFAULT true | |

Unique constraint: `(product_id, code)`.

### 2.4 `reviews`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `product_id` | UUID FK NULLABLE → products(id) | NULL = global review (home carousel) |
| `author_first_name_ar` | VARCHAR(40) NOT NULL | |
| `author_city_ar` | VARCHAR(40) | `الرياض` |
| `rating` | SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5) | |
| `body_ar` | TEXT NOT NULL | |
| `is_published` | BOOLEAN NOT NULL DEFAULT true | |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `created_at` | TIMESTAMPTZ | |

Indexes: `(product_id, is_published, sort_order)`.

### 2.5 `faqs`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `product_id` | UUID FK NULLABLE → products(id) | NULL = global FAQ |
| `question_ar` | VARCHAR(280) NOT NULL | |
| `answer_ar` | TEXT NOT NULL | |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `is_active` | BOOLEAN NOT NULL DEFAULT true | |

### 2.6 `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | also the public id |
| `idempotency_key` | UUID NOT NULL UNIQUE | from `Idempotency-Key` header |
| `status` | VARCHAR(20) NOT NULL DEFAULT 'pending' | CHECK IN (`pending`,`confirmed`,`shipped`,`delivered`,`returned`,`cancelled`) |
| `full_name` | VARCHAR(120) NOT NULL | raw, stored |
| `phone_e164` | VARCHAR(20) NOT NULL | `+9665XXXXXXXX` |
| `address_line` | TEXT | NULL — call-center fills later |
| `city` | VARCHAR(80) | NULL — call-center fills |
| `notes` | TEXT | |
| `subtotal_sar` | NUMERIC(10,2) NOT NULL | sum of order_items unit_price |
| `upsell_added_sar` | NUMERIC(10,2) NOT NULL DEFAULT 0 | 99 if upsell taken |
| `total_sar` | NUMERIC(10,2) NOT NULL | subtotal + upsell_added |
| `currency` | VARCHAR(3) NOT NULL DEFAULT 'SAR' | |
| `event_id` | UUID NOT NULL | shared with web pixel events for dedup |
| `client_ip` | INET | for CAPI |
| `client_user_agent` | TEXT | for CAPI |
| `fbp` | VARCHAR(120) | from `_fbp` cookie |
| `fbc` | VARCHAR(160) | from `_fbc` cookie |
| `ttp` | VARCHAR(120) | TikTok cookie |
| `ttclid` | VARCHAR(160) | TikTok click id |
| `sc_click_id` | VARCHAR(160) | Snap click id |
| `referrer` | TEXT | |
| `landing_url` | TEXT | |
| `utm_source` | VARCHAR(80) | |
| `utm_medium` | VARCHAR(80) | |
| `utm_campaign` | VARCHAR(120) | |
| `utm_term` | VARCHAR(120) | |
| `utm_content` | VARCHAR(120) | |
| `upsell_token` | VARCHAR(255) | signed token (itsdangerous) returned to client, expires 10 min |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Indexes: `(idempotency_key)` unique, `(status, created_at desc)`, `(phone_e164)`.

### 2.7 `order_items`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `order_id` | UUID FK → orders(id) ON DELETE CASCADE | |
| `product_id` | UUID FK → products(id) | |
| `offer_id` | UUID FK → offers(id) | |
| `product_slug` | VARCHAR(64) NOT NULL | denormalized for the Sheet payload |
| `product_name_ar` | VARCHAR(120) NOT NULL | denormalized |
| `offer_code` | VARCHAR(8) NOT NULL | denormalized |
| `offer_label_ar` | VARCHAR(60) NOT NULL | denormalized |
| `quantity` | SMALLINT NOT NULL | boxes within the bundle (1/2/3) |
| `unit_price_sar` | NUMERIC(10,2) NOT NULL | bundle price (199/279/349) |
| `is_upsell` | BOOLEAN NOT NULL DEFAULT false | true for the 99 SAR upsell line |

Indexes: `(order_id)`.

### 2.8 `webhook_log`

(Audit trail for sheet + CAPI calls.)

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `order_id` | UUID FK NULLABLE → orders(id) | |
| `kind` | VARCHAR(40) NOT NULL | `sheet`, `meta_capi`, `tiktok_capi`, `snap_capi` |
| `attempt` | SMALLINT NOT NULL | 1..N |
| `success` | BOOLEAN NOT NULL | |
| `http_status` | INTEGER | |
| `response_body` | TEXT | truncated to 4 KB |
| `created_at` | TIMESTAMPTZ | |

Indexes: `(order_id)`, `(created_at desc)`, `(kind, success)`.

### 2.9 `tracking_events`

(Optional; lightweight log of pixel events that flowed through `/api/track` for QA and EMQ analysis.)

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `event_id` | UUID NOT NULL | dedup key |
| `event_name` | VARCHAR(40) NOT NULL | `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `UpsellAccept` |
| `platform` | VARCHAR(20) NOT NULL | `meta`, `tiktok`, `snap`, `internal` |
| `client_ip` | INET | |
| `client_user_agent` | TEXT | |
| `payload` | JSONB | scrubbed (no raw PII) |
| `created_at` | TIMESTAMPTZ | |

Indexes: `(event_id)`, `(event_name, created_at desc)`.

## 3. Alembic migrations

- `0001_initial_schema.py` — creates `pgcrypto`, all tables above, all indexes, and applies the check constraints.
- `0002_seed_catalog.py` — INSERTs the 3 products + their ingredients + offers + curated reviews + FAQs. Idempotent: uses `ON CONFLICT (slug) DO NOTHING` for products, and for sub-tables uses `WHERE NOT EXISTS` guards.

Migrations are async-friendly: use `op.execute` for raw SQL when needed; `op.create_table` for the rest. `env.py` uses `async_engine_from_config` and `connection.run_sync(context.run_migrations)`.

## 4. SQLAlchemy 2 models — sketch

```python
# app/db/models.py
from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    String, Text, Boolean, Integer, SmallInteger, Numeric, ForeignKey,
    UniqueConstraint, CheckConstraint, Index, func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase

class Base(DeclarativeBase): ...

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now(), nullable=False)

class Product(Base, TimestampMixin):
    __tablename__ = "products"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    slug: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    name_ar: Mapped[str] = mapped_column(String(120), nullable=False)
    working_name: Mapped[str] = mapped_column(String(120), nullable=False)
    hero_tag_ar: Mapped[str] = mapped_column(String(280), nullable=False)
    short_description_ar: Mapped[str] = mapped_column(Text, nullable=False)
    long_description_ar: Mapped[str] = mapped_column(Text, nullable=False)
    rating_value: Mapped[Decimal] = mapped_column(Numeric(3, 2), nullable=False, default=Decimal("4.9"))
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    stock_label_ar: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cover_image_url: Mapped[str] = mapped_column(Text, nullable=False)
    gallery_image_urls: Mapped[list[str]] = mapped_column(JSONB, nullable=False, server_default="[]")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    seo_title_ar: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seo_description_ar: Mapped[str | None] = mapped_column(String(300), nullable=True)

    ingredients: Mapped[list[Ingredient]] = relationship(back_populates="product", cascade="all, delete-orphan")
    offers:      Mapped[list[Offer]] = relationship(back_populates="product", cascade="all, delete-orphan")
```

Other models follow the same pattern.

## 5. Constraints summary

- `products.slug` unique.
- `offers.(product_id, code)` unique.
- `offers.code IN ('T1','T2','T3')`.
- `orders.status IN ('pending','confirmed','shipped','delivered','returned','cancelled')`.
- `orders.idempotency_key` unique.
- `reviews.rating BETWEEN 1 AND 5`.

## 6. Sample SQL (handy for ops, never used by the app at runtime)

```sql
-- Top SKUs by revenue (last 30 days)
SELECT p.slug, SUM(oi.unit_price_sar) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.created_at > now() - interval '30 days'
GROUP BY p.slug
ORDER BY revenue DESC;

-- Upsell take rate (last 7 days)
SELECT
  ROUND(100.0 * SUM(CASE WHEN upsell_added_sar > 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS upsell_take_rate
FROM orders
WHERE created_at > now() - interval '7 days';
```

## 7. Backups

EasyPanel handles managed Postgres backups; the AI coder enables daily backups in EasyPanel's UI as part of go-live checklist (`21-qa-and-launch-checklist.md`). Application does not ship its own backup logic.
