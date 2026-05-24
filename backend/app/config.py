from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    APP_ENV: str = "production"
    APP_NAME: str = "Raheeq Arabia API"
    API_BASE_URL: str = "https://api.raheeqarabia.com"
    FRONTEND_URL: str = "https://raheeqarabia.com"

    DATABASE_URL: str = "postgresql+psycopg://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia"
    SECRET_KEY: str = "change-me-in-production"
    BACKEND_API_KEY: str = "change-me-in-production"

    CORS_ORIGINS: list[str] = ["https://raheeqarabia.com", "http://localhost:3000"]
    PROXY_TRUST_HOPS: int = 1
    LOG_LEVEL: str = "INFO"

    SHEET_WEBHOOK_URL: str | None = None
    SHEET_WEBHOOK_SECRET: str | None = None

    # Meta CAPI
    META_PIXEL_ID: str | None = None
    META_ACCESS_TOKEN: str | None = None
    META_API_VERSION: str = "v20.0"
    META_TEST_EVENT_CODE: str | None = None

    # TikTok CAPI
    TIKTOK_PIXEL_CODE: str | None = None
    TIKTOK_ACCESS_TOKEN: str | None = None
    TIKTOK_API_VERSION: str = "v1.3"
    TIKTOK_TEST_EVENT_CODE: str | None = None

    # Snap CAPI
    SNAP_PIXEL_ID: str | None = None
    SNAP_ACCESS_TOKEN: str | None = None
    SNAP_TEST_EVENT_CODE: str | None = None

    # CAPI master + per-platform switches
    ENABLE_CAPI: bool = True
    ENABLE_META_CAPI: bool = True
    ENABLE_TIKTOK_CAPI: bool = True
    ENABLE_SNAP_CAPI: bool = True

    SFDA_BADGE_ENABLED: bool = False

    # MaxMind GeoIP2 — block non-KSA / VPN / suspicious IPs
    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""
    ENABLE_IP_FRAUD_CHECK: bool = True
    # Comma-separated phones that bypass the IP fraud check (for testing)
    WHITELISTED_PHONES: str = "050000007,055000000"


settings = Settings()
