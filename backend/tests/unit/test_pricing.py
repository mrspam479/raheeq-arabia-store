"""Unit tests for pricing helpers."""
from __future__ import annotations

from decimal import Decimal

from app.services.pricing import get_upsell_sku, TIER_MAP, UPSELL_PRICE


def test_tier_map():
    assert TIER_MAP["T1"] == (1, Decimal("199"))
    assert TIER_MAP["T2"] == (2, Decimal("279"))
    assert TIER_MAP["T3"] == (3, Decimal("349"))


def test_upsell_price():
    assert UPSELL_PRICE == Decimal("99")


def test_upsell_jathr_gets_noura():
    assert get_upsell_sku(["habba-jathr"]) == "habba-noura"


def test_upsell_layali_gets_noura():
    assert get_upsell_sku(["habba-layali"]) == "habba-noura"


def test_upsell_noura_gets_jathr():
    assert get_upsell_sku(["habba-noura"]) == "habba-jathr"


def test_upsell_all_in_cart_returns_none():
    assert get_upsell_sku(["habba-jathr", "habba-layali", "habba-noura"]) is None


def test_upsell_priority_noura_first():
    # If only noura is missing, prefer noura
    assert get_upsell_sku(["habba-jathr", "habba-layali"]) == "habba-noura"
