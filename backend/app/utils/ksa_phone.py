from __future__ import annotations

import phonenumbers
from phonenumbers import NumberParseException


class KsaPhone:
    """Parse and normalize a KSA phone number; expose per-platform formats for CAPI hashing."""

    def __init__(self, raw: str) -> None:
        self.raw = raw.strip()
        try:
            parsed = phonenumbers.parse(self.raw, "SA")
        except NumberParseException as exc:
            raise ValueError("Invalid phone") from exc

        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("Invalid phone")

        country = phonenumbers.region_code_for_number(parsed)
        if country != "SA":
            raise ValueError("Phone must be Saudi (SA)")

        self.e164: str = phonenumbers.format_number(
            parsed, phonenumbers.PhoneNumberFormat.E164
        )  # "+9665XXXXXXXX"
        self.digits: str = self.e164.lstrip("+")  # "9665XXXXXXXX"

    def for_meta(self) -> str:
        """Meta: digits only, country code, no + (e.g. '9665XXXXXXXX')."""
        return self.digits

    def for_tiktok(self) -> str:
        """TikTok: E.164 with leading + (e.g. '+9665XXXXXXXX')."""
        return self.e164

    def for_snap(self) -> str:
        """Snap: digits only, country code, no + (e.g. '9665XXXXXXXX')."""
        return self.digits
