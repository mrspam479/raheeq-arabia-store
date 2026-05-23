"""Unit tests for SHA-256 hashing helpers."""
from __future__ import annotations

from app.utils.hashing import sha256_hex, normalize_name


def test_sha256_known_value():
    # SHA-256 of "test"
    result = sha256_hex("test")
    assert result == "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    assert len(result) == 64
    assert result == result.lower()


def test_normalize_name_arabic():
    # Arabic name normalization should strip diacritics and lowercase
    name = "نورة"
    normalized = normalize_name(name)
    assert normalized == "نورة"


def test_normalize_name_latin():
    name = "  Noura  "
    normalized = normalize_name(name)
    assert normalized == "noura"
