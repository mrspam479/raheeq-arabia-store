from __future__ import annotations

from dataclasses import dataclass, field

from app.utils.hashing import normalize_name, sha256_hex
from app.utils.ksa_phone import KsaPhone


@dataclass
class UserData:
    phone_raw: str | None = None
    first_name: str | None = None
    order_id: str | None = None
    country: str = "sa"
    client_ip: str | None = None
    client_user_agent: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    sc_click_id: str | None = None


def build_meta_user_data(ud: UserData) -> dict:
    data: dict = {}
    if ud.phone_raw:
        try:
            ksa = KsaPhone(ud.phone_raw)
            data["ph"] = [sha256_hex(ksa.for_meta())]
        except ValueError:
            pass
    if ud.first_name:
        data["fn"] = [sha256_hex(normalize_name(ud.first_name))]
    data["country"] = [sha256_hex(ud.country)]
    if ud.order_id:
        data["external_id"] = [sha256_hex(ud.order_id.lower())]
    if ud.client_ip:
        data["client_ip_address"] = ud.client_ip
    if ud.client_user_agent:
        data["client_user_agent"] = ud.client_user_agent
    if ud.fbp:
        data["fbp"] = ud.fbp
    if ud.fbc:
        data["fbc"] = ud.fbc
    return data


def build_tiktok_user_data(ud: UserData) -> dict:
    data: dict = {}
    if ud.phone_raw:
        try:
            ksa = KsaPhone(ud.phone_raw)
            data["phone_number"] = sha256_hex(ksa.for_tiktok())
        except ValueError:
            pass
    if ud.order_id:
        data["external_id"] = sha256_hex(ud.order_id.lower())
    if ud.ttp:
        data["ttp"] = ud.ttp
    if ud.ttclid:
        data["ttclid"] = ud.ttclid
    return data


def build_snap_user_data(ud: UserData) -> dict:
    data: dict = {}
    if ud.phone_raw:
        try:
            ksa = KsaPhone(ud.phone_raw)
            data["ph"] = [sha256_hex(ksa.for_snap())]
        except ValueError:
            pass
    if ud.first_name:
        data["fn"] = [sha256_hex(normalize_name(ud.first_name))]
    data["country"] = [sha256_hex(ud.country)]
    if ud.order_id:
        data["external_id"] = [sha256_hex(ud.order_id.lower())]
    if ud.client_ip:
        data["client_ip_address"] = ud.client_ip
    if ud.client_user_agent:
        data["client_user_agent"] = ud.client_user_agent
    if ud.sc_click_id:
        data["sc_click_id"] = ud.sc_click_id
    return data
