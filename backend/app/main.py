from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    configure_logging(settings.LOG_LEVEL)
    logger = structlog.get_logger()

    # Seed catalog (migrations already run by docker-entrypoint.sh before startup)
    try:
        from app.db.base import AsyncSessionLocal
        from app.db.seed import run_seed

        async with AsyncSessionLocal() as session:
            await run_seed(session)
    except Exception:
        logger.exception("seed.failed")

    yield

    logger.info("shutdown")


app = FastAPI(
    title="Raheeq Arabia API",
    version="1.0.0",
    docs_url=None if settings.APP_ENV == "production" else "/docs",
    redoc_url=None if settings.APP_ENV == "production" else "/redoc",
    openapi_url=None if settings.APP_ENV == "production" else "/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Idempotency-Key", "X-API-Key"],
    max_age=86400,
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger = structlog.get_logger()
    logger.exception("unhandled_error", path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "SERVER_ERROR", "message": "خطأ في الخادم، حاولي مرة ثانية."}},
    )


# Register routers
from app.routers import admin, health, orders, products, track

app.include_router(health.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(track.router)
app.include_router(admin.router)
