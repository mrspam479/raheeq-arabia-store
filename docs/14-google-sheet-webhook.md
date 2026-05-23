# 14 — Google Sheet Webhook (Orders Mirror)

The call-center never opens an admin panel. Every order is mirrored to a Google Sheet **immediately** via Apps Script. The founder copies the script into their Sheet's Extensions → Apps Script, deploys it as a Web App, copies the URL, and puts it into the backend's `SHEET_WEBHOOK_URL` env var.

## 1. Sheet template

Create a Google Sheet named **`Raheeq Orders`** with two tabs:

### Tab 1 — `orders` (the live feed)

Header row (row 1, frozen). Copy from `docs/templates/orders-sheet-template.csv`.

| # | Column | Type | Notes |
|---|---|---|---|
| A | `created_at` | datetime ISO | Set by Apps Script using `new Date()` if not present. |
| B | `order_id` | string | UUID. |
| C | `status` | enum | `pending` initially. The call-center changes it via dropdown (Data > Data validation). |
| D | `full_name` | string | |
| E | `phone_e164` | string | `+9665XXXXXXXX` |
| F | `whatsapp_link` | formula | `=HYPERLINK("https://wa.me/" & SUBSTITUTE(E2,"+",""), "WhatsApp")` |
| G | `address_line` | string | empty — call-center fills |
| H | `city` | string | empty — call-center fills |
| I | `notes` | string | empty |
| J | `items_summary` | string | "حبّة جذر × T3 (3) + حبّة نورة × T1 (1)" |
| K | `items_json` | string | JSON of `lines` for ops reference |
| L | `subtotal_sar` | number | |
| M | `upsell_added_sar` | number | 0 or 99 |
| N | `total_sar` | number | |
| O | `currency` | string | `SAR` |
| P | `utm_source` | string | |
| Q | `utm_medium` | string | |
| R | `utm_campaign` | string | |
| S | `utm_content` | string | |
| T | `landing_url` | string | |
| U | `referrer` | string | |
| V | `client_ip` | string | |
| W | `client_user_agent` | string | |
| X | `fbp` | string | |
| Y | `fbc` | string | |
| Z | `ttp` | string | |
| AA | `ttclid` | string | |
| AB | `sc_click_id` | string | |
| AC | `event_id` | string | dedup id |
| AD | `idempotency_key` | string | |
| AE | `confirmed_at` | datetime | manually filled |
| AF | `shipped_at` | datetime | manually filled |
| AG | `delivered_at` | datetime | manually filled |

### Tab 2 — `upsell_attached` (audit)

| # | Column | Notes |
|---|---|---|
| A | `created_at` | when the upsell PATCH succeeded |
| B | `order_id` | |
| C | `sku` | `habba-noura` etc. |
| D | `price_sar` | `99` |

Apps Script appends a row here whenever the backend sends `kind: "upsell"`.

## 2. Apps Script (the webhook)

See `docs/templates/google-apps-script-webhook.js`. The script:

1. Receives a `POST` JSON body.
2. Validates the shared secret (`X-Webhook-Secret` header — but Apps Script web apps don't expose custom headers; we transmit the secret inside the body as `secret` and compare server-side).
3. Routes by `kind` (`order` → tab `orders`, `upsell` → tab `upsell_attached`, `status_update` → updates row by `order_id`).
4. Returns `{ ok: true }`.

### Deploy steps (the founder runs this once)

1. Open the Sheet → **Extensions → Apps Script**.
2. Replace `Code.gs` with the contents of `templates/google-apps-script-webhook.js`.
3. Set `SHEET_WEBHOOK_SECRET` in Apps Script's **Script Properties** (Project Settings → Script properties): a 32-byte random string. Use the same value in `backend/.env`.
4. Click **Deploy → New deployment → Web app**:
   - Description: `Raheeq Orders Webhook`.
   - Execute as: **Me**.
   - Who has access: **Anyone** (the secret guards it).
5. Copy the **Web app URL** → set as `SHEET_WEBHOOK_URL` in the backend env.

## 3. Backend payload to the Sheet

The backend `services/webhooks.py` calls:

```python
async def post_to_sheet(kind: str, payload: dict) -> None:
    if not settings.SHEET_WEBHOOK_URL:
        return  # not configured yet
    body = {"secret": settings.SHEET_WEBHOOK_SECRET, "kind": kind, "payload": payload}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(settings.SHEET_WEBHOOK_URL, json=body, follow_redirects=True)
        r.raise_for_status()
```

Wrapped in `tenacity.retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=1, max=120))`. Failure is logged to `webhook_log` table.

### Order payload (kind = `order`)

```json
{
  "secret": "<server-side secret>",
  "kind": "order",
  "payload": {
    "created_at": "2026-05-21T17:45:00Z",
    "order_id": "8c2ad…",
    "status": "pending",
    "full_name": "نورة العتيبي",
    "phone_e164": "+966501234567",
    "address_line": "",
    "city": "",
    "notes": "",
    "items_summary": "حبّة جذر × Glow Kit (3) + حبّة نورة × علبة (1)",
    "items_json": "[{\"sku\":\"habba-jathr\",\"offer\":\"T3\",\"qty\":3,\"unit_price\":349}, …]",
    "subtotal_sar": 548,
    "upsell_added_sar": 0,
    "total_sar": 548,
    "currency": "SAR",
    "utm_source": "tiktok",
    "utm_medium": "paid",
    "utm_campaign": "jathr_ksa_v3",
    "utm_content": "ugc_03",
    "landing_url": "https://raheeqarabia.com/p/habba-jathr",
    "referrer": "https://www.tiktok.com/",
    "client_ip": "37.123.45.6",
    "client_user_agent": "Mozilla/5.0 …",
    "fbp": "fb.1.…",
    "fbc": "fb.1.…",
    "ttp": "…",
    "ttclid": "…",
    "sc_click_id": "…",
    "event_id": "…",
    "idempotency_key": "…"
  }
}
```

### Upsell payload (kind = `upsell`)

```json
{
  "secret": "…",
  "kind": "upsell",
  "payload": {
    "created_at": "2026-05-21T17:46:11Z",
    "order_id": "8c2ad…",
    "sku": "habba-noura",
    "price_sar": 99
  }
}
```

The Apps Script will also **update** the original order row (Tab 1) — bumping `upsell_added_sar` to 99 and `total_sar` accordingly.

### Status update payload (kind = `status_update`)

```json
{
  "secret": "…",
  "kind": "status_update",
  "payload": {
    "order_id": "8c2ad…",
    "status": "confirmed",
    "confirmed_at": "2026-05-21T18:11:00Z",
    "address_line": "حي الياسمين، شارع …",
    "city": "الرياض",
    "notes": "تفضّل التوصيل مساءً"
  }
}
```

This is sent by `PATCH /api/admin/orders/{id}` if a status update comes in from somewhere other than the Sheet itself.

## 4. Conflict resolution

The Sheet is the **operations** source of truth (it can be edited by humans). Postgres is the **transactional** source of truth (the only thing the website writes to). If they diverge:

- For order status: trust the Sheet (call-center has the most recent info).
- For order line items, prices, and identifiers: trust Postgres.

For v1 we don't run a reconcile job; the call-center updates the sheet manually, and the founder runs ad-hoc SQL when needed.

## 5. Apps Script code outline

(Full code lives in `docs/templates/google-apps-script-webhook.js`. The AI coder copies it verbatim into Apps Script. The founder follows the deploy steps above.)

Key functions:

- `doPost(e)` — main entry; parses JSON, validates secret, dispatches by `kind`.
- `appendOrder_(payload)` — appends a new row to `orders` tab, builds the `whatsapp_link` formula in column F.
- `appendUpsell_(payload)` — appends a row to `upsell_attached` AND updates the matching `orders` row.
- `updateStatus_(payload)` — finds the row by `order_id` (column B), updates status + timestamps + address.
- `findRowByOrderId_(sheet, orderId)` — utility.
- `respond_(obj)` — `ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)`.

The secret is read from `PropertiesService.getScriptProperties().getProperty('SHEET_WEBHOOK_SECRET')`.

## 6. Failures & alerting

- Apps Script failures (e.g. quota exceeded) → backend retries 5x with exponential backoff. After all retries, the failure is logged to `webhook_log` with `success=false`. Ops can re-trigger by calling `POST /api/admin/orders/{id}/resync-sheet` (out of scope for v1; we add it post-launch if needed).
- For v1, **no email/Slack alerting**. Once a week the founder runs a SQL query for orders missing in the Sheet and resyncs manually.
