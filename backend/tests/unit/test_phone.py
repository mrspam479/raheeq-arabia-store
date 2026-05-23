"""Unit tests for KSA phone normalization and per-platform formatting."""
from __future__ import annotations

import pytest

from app.utils.ksa_phone import KsaPhone


def test_local_format():
    ksa = KsaPhone("0501234567")
    assert ksa.e164 == "+966501234567"
    assert ksa.digits == "966501234567"


def test_e164_format():
    ksa = KsaPhone("+966501234567")
    assert ksa.e164 == "+966501234567"


def test_with_spaces():
    ksa = KsaPhone("+966 50 123 4567")
    assert ksa.e164 == "+966501234567"


def test_meta_no_plus():
    ksa = KsaPhone("0501234567")
    assert ksa.for_meta() == "966501234567"
    assert "+" not in ksa.for_meta()


def test_tiktok_with_plus():
    ksa = KsaPhone("0501234567")
    assert ksa.for_tiktok() == "+966501234567"
    assert ksa.for_tiktok().startswith("+")


def test_snap_no_plus():
    ksa = KsaPhone("0501234567")
    assert ksa.for_snap() == "966501234567"
    assert "+" not in ksa.for_snap()


def test_invalid_non_sa():
    with pytest.raises(ValueError):
        KsaPhone("+201234567890")


def test_invalid_garbage():
    with pytest.raises(ValueError):
        KsaPhone("not-a-phone")
