from __future__ import annotations

from urllib.parse import urlparse, urlunparse, urlencode, parse_qs

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings


def _ensure_sslmode_disable(url: str) -> str:
    """
    Always inject sslmode=disable into the DATABASE_URL.
    EasyPanel's internal Postgres runs without SSL and psycopg3 defaults
    to sslmode=prefer which can cause connection hangs.
    """
    if "sslmode" in url:
        return url
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}sslmode=disable"


_db_url = _ensure_sslmode_disable(settings.DATABASE_URL)

engine = create_async_engine(
    _db_url,
    echo=settings.APP_ENV == "dev",
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
