from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    APP_ENV: str = "production"
    DATABASE_URL: str = "postgresql+psycopg://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia"
    SECRET_KEY: str = "change-me-in-production"
    BACKEND_API_KEY: str = "change-me-in-production"

    ALLOWED_ORIGINS: list[str] = ["https://raheeqarabia.com", "http://localhost:3000"]
    PROXY_TRUST_HOPS: int = 1
    LOG_LEVEL: str = "INFO"

    SHEET_WEBHOOK_URL: str | None = None
    SHEET_WEBHOOK_SECRET: str | None = None

    META_PIXEL_ID: str | None = None
    META_ACCESS_TOKEN: str | None = None
    META_TEST_EVENT_CODE: str | None = None

    TIKTOK_PIXEL_CODE: str | None = None
    TIKTOK_ACCESS_TOKEN: str | None = None
    TIKTOK_TEST_EVENT_CODE: str | None = None

    SNAP_PIXEL_ID: str | None = None
    SNAP_ACCESS_TOKEN: str | None = None
    SNAP_TEST_EVENT_CODE: str | None = None

    SFDA_BADGE_ENABLED: bool = False

    # MaxMind GeoIP2 Insights — fraud & geo gating
    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""


settings = Settings()
