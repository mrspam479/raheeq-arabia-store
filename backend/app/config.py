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

    CORS_ORIGINS: str = "https://raheeqarabia.com,http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
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

    # MaxMind GeoIP2 — STRICT KSA-only blocking + VPN/proxy detection.
    # 1) Web service mode: set MAXMIND_ACCOUNT_ID + MAXMIND_LICENSE_KEY (recommended).
    # 2) Local DB mode (optional, faster, cheaper at scale): set MAXMIND_DB_PATH to
    #    a local GeoIP2-Country.mmdb / GeoIP2-Anonymous-IP.mmdb file.
    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_DB_PATH: str = ""
    ENABLE_IP_FRAUD_CHECK: bool = True
    # Comma-separated phones that bypass the IP fraud check (owner / QA testing).
    # 050000001 is the default test number — use it on the live site to make a fake order.
    WHITELISTED_PHONES: str = "050000001,050000007,055000000"


settings = Settings()
