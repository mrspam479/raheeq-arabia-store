from __future__ import annotations

from decimal import Decimal

TIER_MAP: dict[str, tuple[int, Decimal]] = {
    "T1": (1, Decimal("199")),
    "T2": (2, Decimal("279")),
    "T3": (3, Decimal("349")),
}

UPSELL_PRICE = Decimal("99")

UPSELL_MAP: dict[str, str] = {
    "habba-jathr": "habba-noura",
    "habba-layali": "habba-noura",
    "habba-noura": "habba-jathr",
}

PRIORITY_UPSELL_ORDER = ["habba-noura", "habba-jathr", "habba-layali"]


def get_upsell_sku(cart_slugs: list[str]) -> str | None:
    """Return the best upsell SKU not already in the cart."""
    cart_set = set(cart_slugs)
    for sku in PRIORITY_UPSELL_ORDER:
        if sku not in cart_set:
            return sku
    return None
