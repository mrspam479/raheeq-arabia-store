from __future__ import annotations

from pydantic import BaseModel


class HealthOut(BaseModel):
    status: str = "ok"


class ErrorDetail(BaseModel):
    code: str
    message: str
    fields: dict[str, str] | None = None


class ErrorOut(BaseModel):
    error: ErrorDetail
