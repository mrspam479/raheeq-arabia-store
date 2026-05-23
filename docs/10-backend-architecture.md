# 10 — Backend Architecture

The backend is a focused FastAPI service: catalog, orders, upsell patch, CAPI fan-out, Google Sheet webhook. No CMS, no auth except a single static API key for ops endpoints.

## 1. Stack (locked)

| Layer | Choice |
|---|---|
| Language | **Python 3.12** |
| Framework | **FastAPI 0.115+** |
| ASGI server | **Uvicorn 0.32+** with `--workers 2 --loop uvloop --http httptools` |
| ORM | **SQLAlchemy 2.x** (async) |
| Migrations | **Alembic 1.13+** (async) — auto-run on container start |
| DB driver | **psycopg 3** (`psycopg[binary]`) via `postgresql+psycopg://` |
| Config | **pydantic-settings v2** |
| Validation | **pydantic v2** |
| HTTP client (CAPI) | **httpx 0.27+** (async) |
| Retries | **tenacity 9+** |
| Logging | **structlog 24+** + JSON renderer |
| Time | **arrow** (timezone-aware) |
| Testing | **pytest** + **httpx ASGI transport** |
| Lint / format | **ruff** + **black** + **mypy --strict** |
| Process | **gunicorn** wrapping uvicorn workers in prod, with `--preload` |

Pin in `requirements.txt` or `pyproject.toml` (`uv` is fine — see `17-coding-rules-and-conventions.md`):

```
fastapi==0.115.*
uvicorn[standard]==0.32.*
gunicorn==23.*
sqlalchemy[asyncio]==2.0.*
alembic==1.13.*
psycopg[binary]==3.2.*
pydantic==2.9.*
pydantic-settings==2.6.*
httpx==0.27.*
tenacity==9.*
structlog==24.*
arrow==1.3.*
python-slugify==8.*
itsdangerous==2.2.*
phonenumbers==8.13.*
pytest==8.*
pytest-asyncio==0.24.*
ruff==0.6.*
black==24.*
mypy==1.11.*
```

## 2. Folder structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI() + middleware + lifespan
│   ├── config.py                     # Settings (pydantic-settings)
│   ├── logging.py                    # structlog setup
│   ├── deps.py                       # FastAPI dependencies (DB session, API key, idempotency)
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py                   # async engine + sessionmaker
│   │   ├── models.py                 # SQLAlchemy models
│   │   └── seed.py                   # idempotent product/offer seeding
│   ├── schemas/                      # Pydantic v2 input/output schemas
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── tracking.py
│   │   └── common.py
│   ├── routers/                      # FastAPI routers (one per concern)
│   │   ├── health.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── track.py
│   │   └── admin.py
│   ├── services/
│   │   ├── orders.py                 # business logic: create order, attach upsell
│   │   ├── pricing.py                # offer table + computations
│   │   ├── phone.py                  # normalize KSA, hash variants per platform
│   │   ├── webhooks.py               # Google Sheet poster (tenacity-wrapped)
│   │   ├── capi/
│   │   │   ├── __init__.py
│   │   │   ├── base.py               # common: event_id, user_data builder
│   │   │   ├── meta.py
│   │   │   ├── tiktok.py
│   │   │   └── snap.py
│   │   └── seed.py
│   ├── utils/
│   │   ├── hashing.py                # SHA-256 helpers
│   │   ├── ids.py                    # UUID4, ULID
│   │   └── ksa_phone.py              # parse/normalize + per-pixel formatting
│   └── alembic/
│       ├── env.py
│       ├── script.py.mako
│       └── versions/                 # generated migrations
├── tests/
│   ├── unit/
│   └── e2e/
├── alembic.ini
├── .env.example
├── pyproject.toml
├── requirements.txt
├── Dockerfile
├── docker-entrypoint.sh
└── README.md
```

## 3. Lifecycle / boot sequence

`main.py` uses a FastAPI `lifespan` async context manager:

1. **On startup**:
   - Configure structlog.
   - Build async engine + sessionmaker.
   - **Run Alembic upgrade to head** (`command.upgrade(cfg, 'head')` in a thread).
   - Seed catalog (idempotent) — see `db/seed.py`.
   - Warm CAPI clients (httpx AsyncClients with shared connection pools).
   - Spawn a `webhook_worker` background task (a small in-memory queue draining outbound sheet/CAPI calls).
2. **On shutdown**:
   - Drain the queue with a 10s timeout.
   - Close engine & httpx clients.

## 4. Endpoint surface

(See `12-api-contract.md` for full payloads.)

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/health` | Liveness | — |
| GET | `/ready` | Includes DB ping | — |
| GET | `/api/products` | All 3 SKUs + offers (RSC-fetchable) | — |
| GET | `/api/products/{slug}` | Single SKU (deep) | — |
| POST | `/api/orders` | Create COD order; idempotent via `Idempotency-Key` | — (rate-limited) |
| PATCH | `/api/orders/{id}/upsell` | Attach 99 SAR upsell | — (token bound to order_id) |
| POST | `/api/track` | Forwarded events from frontend → CAPI fan-out | server-only header `X-API-Key` |
| GET | `/api/admin/orders` | List orders (operations) | `X-API-Key` |
| PATCH | `/api/admin/orders/{id}` | Update status (`confirmed/shipped/delivered/…`) | `X-API-Key` |

## 5. Security

- **CORS**: only `https://raheeqarabia.com` (+ `http://localhost:3000` in dev). Methods: `GET, POST, PATCH, OPTIONS`. Allowed headers include `Content-Type, Idempotency-Key`. Credentials = false.
- **Rate limit** on `/api/orders`: 6 / min / IP using a tiny in-process token bucket (Redis-less for v1). Honeypot + IP block list reserved for future.
- **Honeypot field** `website` on the form: orders with non-empty honeypot are silently dropped (return `201` to confuse bots).
- **Static API key** for admin and `/api/track`: read from env `BACKEND_API_KEY`. Strong (32-byte b64). Compared via `secrets.compare_digest`.
- **Upsell PATCH** is authorized by a short-lived signed token (`itsdangerous.URLSafeTimedSerializer`) returned in `POST /api/orders` response (TTL = 600s) and bound to the order_id; this prevents a third party from attaching an upsell to a stranger's order.
- **Input limits**: name ≤ 80 chars, phone ≤ 20 chars; reject otherwise with 422.
- **PII**: only name + phone stored; **never** logged at INFO level. CAPI hashing happens inside `services/capi/*` before logging.
- **TLS**: terminated at EasyPanel reverse proxy.

## 6. Phone normalization (the source of truth)

KSA phone: country code `+966`, mobile prefix `5`, then 8 digits → 9 NSN digits, E.164 `+9665XXXXXXXX`.

`utils/ksa_phone.py`:

```python
import phonenumbers
from phonenumbers import NumberParseException

class KsaPhone:
    def __init__(self, raw: str) -> None:
        self.raw = raw.strip()
        try:
            parsed = phonenumbers.parse(self.raw, "SA")
        except NumberParseException as e:
            raise ValueError("Invalid phone") from e
        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("Invalid phone")
        country = phonenumbers.region_code_for_number(parsed)
        if country != "SA":
            raise ValueError("Phone must be Saudi (SA)")
        self.e164 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)  # "+9665XXXXXXXX"
        self.digits = self.e164.lstrip("+")  # "9665XXXXXXXX"

    # Per-platform format (BEFORE hashing) — see 13-pixels-tracking-capi.md.
    def for_meta(self) -> str:    return self.digits          # "9665XXXXXXXX" (no +)
    def for_tiktok(self) -> str:  return self.e164             # "+9665XXXXXXXX" (with +)
    def for_snap(self) -> str:    return self.digits           # "9665XXXXXXXX" (no +)
```

## 7. CAPI services (Meta / TikTok / Snap)

Each `services/capi/{platform}.py` exposes:

```python
async def send_event(
    *,
    event_name: str,
    event_id: str,
    event_time: int,        # unix seconds
    event_source_url: str,
    user_data: UserData,    # from build_user_data(...)
    custom_data: dict,
) -> CapiResult: ...
```

`build_user_data` (in `services/capi/base.py`) accepts: raw phone (already validated), first_name, IP, UA, fbp/fbc/ttp/ttclid/scid/sccid cookies; formats per platform; hashes the PII fields with SHA-256 lowercase hex.

Full payload examples in `13-pixels-tracking-capi.md`.

## 8. Webhook to Google Sheet

`services/webhooks.py` calls the Apps Script Web App URL (`SHEET_WEBHOOK_URL`, env var) with the order row payload. See `14-google-sheet-webhook.md` for payload shape, CSV columns, Apps Script code, and retry semantics.

Wrapped in `tenacity.retry(stop_after_attempt=5, wait_exponential)`; failure logs only — the order is never rolled back because the sheet failed.

## 9. Logging

JSON logs via structlog. Levels:

- `INFO` — order created (without PII), upsell attached, webhook sent OK, CAPI delivered (with hashes only).
- `WARNING` — webhook retry, CAPI 4xx.
- `ERROR` — DB write failed, CAPI 5xx final.

Never log: raw phone, raw email (none in v1), full name. Logs go to stdout (EasyPanel captures them).

## 10. Health/readiness

- `GET /health` — `200 {"status":"ok"}` immediate.
- `GET /ready` — pings DB (`SELECT 1`) and returns 200 only if DB up.

## 11. Dockerfile (production)

The Dockerfile in `18-env-and-deployment.md § 4` is the canonical version. It uses a multi-stage build, installs only runtime deps in the final stage, runs as non-root, and executes `docker-entrypoint.sh` which:

1. Waits for the DB (`pg_isready`-style loop) up to 60s.
2. Runs `alembic upgrade head`.
3. Starts gunicorn + uvicorn workers.

## 12. Configuration (`app/config.py`)

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    APP_ENV: str = "production"          # production | dev | test
    DATABASE_URL: str                    # postgresql+psycopg://...
    SECRET_KEY: str                      # for itsdangerous (upsell token)
    BACKEND_API_KEY: str                 # used by /api/track and admin endpoints

    ALLOWED_ORIGINS: list[str] = ["https://raheeqarabia.com"]

    # Sheet webhook
    SHEET_WEBHOOK_URL: str | None = None
    SHEET_WEBHOOK_SECRET: str | None = None

    # Meta CAPI
    META_PIXEL_ID: str | None = None
    META_ACCESS_TOKEN: str | None = None
    META_TEST_EVENT_CODE: str | None = None      # set during QA, unset in prod

    # TikTok Events API
    TIKTOK_PIXEL_CODE: str | None = None
    TIKTOK_ACCESS_TOKEN: str | None = None
    TIKTOK_TEST_EVENT_CODE: str | None = None

    # Snapchat Conversions API
    SNAP_PIXEL_ID: str | None = None
    SNAP_ACCESS_TOKEN: str | None = None
    SNAP_TEST_EVENT_CODE: str | None = None

    # Feature flags
    SFDA_BADGE_ENABLED: bool = False

    # Misc
    PROXY_TRUST_HOPS: int = 1            # for client IP via X-Forwarded-For
    LOG_LEVEL: str = "INFO"

settings = Settings()
```

The settings instance is the only place env vars are read.

## 13. Migration policy

- Migrations are **always** committed; never auto-generated and shipped without a human-reviewed message.
- The container's entrypoint runs `alembic upgrade head` **before** the server starts accepting traffic.
- Down-migrations exist but are never run in prod.
- Schema is in `11-database-schema.md`; the first migration is named `0001_initial_schema.py`.

## 14. Idempotency on `/api/orders`

Client sends `Idempotency-Key: <uuid>` header. Backend:

1. Looks up `orders` by `idempotency_key`.
2. If found: return the existing order's response (same upsell-token, same 200/201 semantics).
3. If not: process and persist with this key.

Stored 30 days. Replays after that are treated as a new order.

## 15. Background tasks (in-process queue)

For v1 we avoid Celery/RQ/Redis. Inside the FastAPI lifespan we run:

```python
queue: asyncio.Queue[Job] = asyncio.Queue(maxsize=1000)

async def webhook_worker():
    while True:
        job = await queue.get()
        try:
            await dispatch(job)        # routes to sheet or capi platform
        except Exception:
            logger.exception("queue.failure", job=job.kind)
        finally:
            queue.task_done()
```

`POST /api/orders` enqueues 4 jobs (sheet + Meta + TikTok + Snap) and returns immediately. The worker handles retries via tenacity. This keeps the user-facing response < 200ms.

## 16. Testing approach

- **Unit**: pricing, KSA phone normalization, per-pixel formatting, CAPI payload builders (no network), idempotency dedup.
- **Integration**: spin a Postgres test container (or use SQLite-in-memory only if SQLAlchemy's async + SQLite works for our SQL — we keep tests against Postgres if CI allows).
- **E2E** (smoke): hit `POST /api/orders` with a valid payload and assert order is in DB.
