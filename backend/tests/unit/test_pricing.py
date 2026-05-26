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


def test_upsell_jathr_gets_nadra():
    assert get_upsell_sku(["habba-jathr"]) == "habba-nadra"


def test_upsell_bareeq_gets_nadra():
    assert get_upsell_sku(["habba-bareeq"]) == "habba-nadra"


def test_upsell_nadra_gets_bareeq():
    assert get_upsell_sku(["habba-nadra"]) == "habba-bareeq"


def test_upsell_all_in_cart_returns_none():
    assert get_upsell_sku(["habba-nadra", "habba-bareeq", "habba-jathr"]) is None


def test_upsell_priority_nadra_first():
    assert get_upsell_sku(["habba-bareeq", "habba-jathr"]) == "habba-nadra"
