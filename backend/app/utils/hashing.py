from __future__ import annotations

import hashlib
import unicodedata


def sha256_hex(value: str) -> str:
    """SHA-256 lowercase hex — the standard for CAPI PII fields."""
    return hashlib.sha256(value.encode()).hexdigest()


def normalize_name(value: str) -> str:
    """Trim, lowercase, strip diacritics (Arabic tashkeel) for fn hashing."""
    value = value.strip().lower()
    # Remove diacritics (combining characters)
    value = "".join(c for c in unicodedata.normalize("NFD", value) if unicodedata.category(c) != "Mn")
    return value
