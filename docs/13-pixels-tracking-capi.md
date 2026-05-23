# 13 — Pixels & Tracking (Web + CAPI), Dedup, Hashing, Deferral

The most error-prone area for a media buyer. This doc is the authority for **every** event payload, hashing convention, dedup ID, and deferral pattern. The AI coder must follow it line by line.

## 0. The three platforms

| Platform | Web pixel | Server CAPI | Test param |
|---|---|---|---|
| **Meta** (Facebook/IG) | `fbq` | Conversions API (Graph API `events` edge) | `test_event_code` |
| **TikTok** | `ttq` | Events API v1.3 (`/event/track/`) | `test_event_code` |
| **Snapchat** | `snaptr` | Conversions API (`tr/v3/conversion/`) | `test_event_code` |

## 1. Event vocabulary mapping

Internal event names map to platform names as follows. The Internal name is what the frontend façade calls; the backend translates per platform.

| Internal | Meta web (`fbq`) | Meta CAPI | TikTok web (`ttq`) | TikTok CAPI | Snap web (`snaptr`) | Snap CAPI |
|---|---|---|---|---|---|---|
| `PageView` | `PageView` | `PageView` | `Pageview` (auto) | (skip) | `PAGE_VIEW` | `PAGE_VIEW` |
| `ViewContent` | `ViewContent` | `ViewContent` | `ViewContent` | `ViewContent` | `VIEW_CONTENT` | `VIEW_CONTENT` |
| `AddToCart` | `AddToCart` | `AddToCart` | `AddToCart` | `AddToCart` | `ADD_CART` | `ADD_CART` |
| `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `InitiateCheckout` | `START_CHECKOUT` | `START_CHECKOUT` |
| `Purchase` (COD lead committed) | `Purchase` | `Purchase` | `CompletePayment` | `CompletePayment` | `PURCHASE` | `PURCHASE` |
| `UpsellAccept` | `Purchase` (with `is_upsell:true` custom param) | `Purchase` | `CompletePayment` | `CompletePayment` | `PURCHASE` | `PURCHASE` |

> Rationale for `Purchase` on form-submit (COD): the order is committed at form submit (no later checkout step). This matches what every successful KSA COD brand does, and lets the bidder optimize for the right action.

## 2. Hashing rules (BEFORE sending CAPI)

All hashed fields use **SHA-256**, lowercase hex.

| Field | Normalization before hashing | Hashed? | Hash on… |
|---|---|---|---|
| `em` (email) | trim + lowercase | yes | — (we don't collect email v1) |
| **`ph` Meta** | digits only, country code, no `+`, no symbols (e.g. `9665XXXXXXXX`) | yes | server |
| **`ph` TikTok** | E.164 with leading `+` (e.g. `+9665XXXXXXXX`) | yes | server |
| **`ph` Snap** | digits only, country code, no `+` (e.g. `9665XXXXXXXX`) | yes | server |
| `fn` (first name) | trim + lowercase + strip diacritics | yes | server |
| `ct` (city) | trim + lowercase | yes | (we don't collect city v1) |
| `country` | ISO-2 lowercase: `sa` | yes | server |
| `external_id` | order id (UUID string, lowercase) | yes | server |
| `fbp` / `fbc` / `ttp` / `ttclid` / `sc_click_id` | as-is | **NO** | — |
| `client_ip_address` / IP | as-is | **NO** | — |
| `client_user_agent` / UA | as-is | **NO** | — |
| `event_source_url` | as-is | **NO** | — |

Implementation: `backend/app/utils/hashing.py` exposes `sha256_hex(value: str) -> str`. The CAPI services call it on each PII field.

**Important: Web pixels do NOT pre-hash.** `fbq` advanced matching expects raw values; the platform hashes client-side. We *only* hash for CAPI server calls.

## 3. Event ID dedup

The frontend generates a UUID v4 per "logical event" and:

1. Passes it to the web pixel call (`fbq('track', 'Purchase', data, { eventID: '…uuid…' })` for Meta; `ttq.track('CompletePayment', data, { event_id: '…' })` for TikTok; `snaptr('track', 'PURCHASE', data, { client_dedup_id: '…' })` for Snap).
2. POSTs `/api/track` with the same `event_id`.

The backend forwards that `event_id` to each platform's CAPI as `event_id` (Meta + TikTok) / `client_dedup_id` (Snap).

The dedup window: 7 days (Meta), 5 days (TikTok), 7 days (Snap). We are well within these.

## 4. Deferral pattern (no main-thread blocking)

All three pixels live in `frontend/lib/analytics/{meta,tiktok,snap}.ts`. They expose `load()` and `track()` functions.

`load()` is called once, lazily, by a single bootstrap:

```ts
// frontend/lib/analytics/index.ts
let ready = false;
function bootstrap() {
  if (ready) return;
  ready = true;
  // load all three pixels in idle time
  const start = () => {
    import('./meta').then(m => m.load(process.env.NEXT_PUBLIC_META_PIXEL_ID));
    import('./tiktok').then(m => m.load(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_CODE));
    import('./snap').then(m => m.load(process.env.NEXT_PUBLIC_SNAP_PIXEL_ID));
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(start, { timeout: 2000 });
  } else {
    setTimeout(start, 1200);
  }
}

// Triggered on first user interaction OR after window 'load' (whichever comes first).
if (typeof window !== 'undefined') {
  const trigger = () => { bootstrap(); cleanup(); };
  const cleanup = () => {
    window.removeEventListener('scroll', trigger);
    window.removeEventListener('pointerdown', trigger);
    window.removeEventListener('keydown', trigger);
    window.removeEventListener('load', trigger);
  };
  window.addEventListener('scroll', trigger, { once: true, passive: true });
  window.addEventListener('pointerdown', trigger, { once: true, passive: true });
  window.addEventListener('keydown', trigger, { once: true });
  window.addEventListener('load', trigger, { once: true });
}
```

This guarantees the pixels never block LCP and never run before the user has interacted. The penalty is missing a few `PageView`s for bounced visitors — that is fine; the backend can fire a server-side `PageView` for the first page hit instead (optional).

## 5. Per-platform web snippets (deferred, lazy-loaded)

### 5.1 Meta `fbq`

```ts
// frontend/lib/analytics/meta.ts
declare global { interface Window { fbq?: any; _fbq?: any; } }

export function load(pixelId?: string) {
  if (!pixelId || window.fbq) return;
  ;(function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

export function track(eventName: string, params: Record<string, any>, eventID: string) {
  window.fbq?.('track', eventName, params, { eventID });
}

export function trackCustom(eventName: string, params: Record<string, any>, eventID: string) {
  window.fbq?.('trackCustom', eventName, params, { eventID });
}
```

### 5.2 TikTok `ttq`

```ts
declare global { interface Window { ttq?: any; TiktokAnalyticsObject?: string; } }

export function load(pixelCode?: string) {
  if (!pixelCode || window.ttq) return;
  ;(function (w: any, d: any, t: any) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
    ttq.setAndDefer = function (t: any, e: any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t: any) { const e = ttq._i[t] || []; for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e };
    ttq.load = function (e: any, n: any) {
      const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i; ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
      ttq._o = ttq._o || {}; ttq._o[e] = n || {};
      const o = d.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = i + '?sdkid=' + e + '&lib=' + t;
      const a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a);
    };
    ttq.load(pixelCode);
    ttq.page();
  })(window, document, 'ttq');
}

export function track(eventName: string, params: Record<string, any>, event_id: string) {
  window.ttq?.track(eventName, params, { event_id });
}
```

### 5.3 Snapchat `snaptr`

```ts
declare global { interface Window { snaptr?: any; } }

export function load(pixelId?: string) {
  if (!pixelId || window.snaptr) return;
  ;(function (e: any, t: any, n: any) {
    if (e.snaptr) return;
    const r = (e.snaptr = function () { r.handleRequest ? r.handleRequest.apply(r, arguments) : r.queue.push(arguments) });
    r.queue = [];
    const s = 'script';
    const a = t.createElement(s); a.async = !0; a.src = n;
    const u = t.getElementsByTagName(s)[0]; u.parentNode.insertBefore(a, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');
  window.snaptr('init', pixelId);
  window.snaptr('track', 'PAGE_VIEW');
}

export function track(eventName: string, params: Record<string, any>, dedupId: string) {
  window.snaptr?.('track', eventName, params, { client_dedup_id: dedupId });
}
```

## 6. CAPI payload shapes (server-side)

### 6.1 Meta — `POST https://graph.facebook.com/v20.0/{PIXEL_ID}/events?access_token={ACCESS_TOKEN}`

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1763748300,
      "event_id": "…uuid…",
      "event_source_url": "https://raheeqarabia.com/p/habba-jathr",
      "action_source": "website",
      "user_data": {
        "ph": ["<sha256 of '9665XXXXXXXX'>"],
        "fn": ["<sha256 of 'noura'>"],
        "country": ["<sha256 of 'sa'>"],
        "external_id": ["<sha256 of '<order_uuid_lowercase>'>"],
        "client_ip_address": "37.123.45.6",
        "client_user_agent": "Mozilla/5.0 …",
        "fbp": "fb.1.1717000000000.123456",
        "fbc": "fb.1.1717000000000.AbCdEfg"
      },
      "custom_data": {
        "currency": "SAR",
        "value": 647,
        "content_type": "product",
        "content_ids": ["habba-jathr", "habba-noura"],
        "contents": [
          { "id": "habba-jathr", "quantity": 3, "item_price": 349 },
          { "id": "habba-noura", "quantity": 2, "item_price": 99 }
        ],
        "num_items": 5,
        "order_id": "<order_uuid>"
      }
    }
  ],
  "test_event_code": "TEST12345"
}
```

`test_event_code` is **only** included if `META_TEST_EVENT_CODE` is set (i.e., during QA). In production, omit it.

### 6.2 TikTok — `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`

Headers: `Access-Token: <TIKTOK_ACCESS_TOKEN>`, `Content-Type: application/json`.

```json
{
  "pixel_code": "PIXEL_CODE",
  "event": "CompletePayment",
  "event_id": "…uuid…",
  "timestamp": "2026-05-21T17:45:00Z",
  "test_event_code": "TEST12345",
  "context": {
    "page": {
      "url": "https://raheeqarabia.com/p/habba-jathr",
      "referrer": "https://www.tiktok.com/"
    },
    "user_agent": "Mozilla/5.0 …",
    "ip": "37.123.45.6",
    "user": {
      "external_id": "<sha256 of order_uuid>",
      "phone_number": "<sha256 of '+9665XXXXXXXX'>",
      "ttp": "…",
      "ttclid": "…"
    }
  },
  "properties": {
    "currency": "SAR",
    "value": 647,
    "contents": [
      { "content_id": "habba-jathr", "quantity": 3, "price": 349 },
      { "content_id": "habba-noura", "quantity": 2, "price": 99 }
    ],
    "content_type": "product",
    "order_id": "<order_uuid>"
  }
}
```

> **Note on `phone_number` formatting**: TikTok's docs recommend E.164 format including the leading `+`. We follow that — see `services/phone.py`. (Some community tutorials say no `+`; we use the official TikTok docs as the source of truth.) During QA the AI coder must verify EMQ in the TikTok Events Manager and adjust if TikTok flags the format.

### 6.3 Snapchat — `POST https://tr.snapchat.com/v3/{PIXEL_ID}/events?access_token=<token>`

```json
{
  "data": [
    {
      "event_name": "PURCHASE",
      "event_time": 1763748300,
      "event_source_url": "https://raheeqarabia.com/p/habba-jathr",
      "action_source": "website",
      "event_id": "…uuid…",
      "user_data": {
        "ph": ["<sha256 of '9665XXXXXXXX' (digits only, no +)>"],
        "fn": ["<sha256 of 'noura'>"],
        "country": ["<sha256 of 'sa'>"],
        "external_id": ["<sha256 of order_uuid>"],
        "client_ip_address": "37.123.45.6",
        "client_user_agent": "Mozilla/5.0 …",
        "sc_click_id": "…",
        "sc_cookie1": "…"
      },
      "custom_data": {
        "currency": "SAR",
        "value": 647,
        "num_items": 5,
        "content_ids": ["habba-jathr", "habba-noura"],
        "content_type": "product",
        "order_id": "<order_uuid>"
      }
    }
  ],
  "test_event_code": "OPTIONAL"
}
```

## 7. Web pixel payloads (companions to CAPI)

These fire in the browser **with the same `event_id`** as the matching CAPI payload above.

### 7.1 `AddToCart` (Meta web)

```ts
window.fbq('track', 'AddToCart', {
  content_type: 'product',
  content_ids: ['habba-jathr'],
  contents: [{ id: 'habba-jathr', quantity: 3, item_price: 349 }],
  currency: 'SAR',
  value: 349,
}, { eventID: event_id });
```

### 7.2 `Purchase` (Meta web)

```ts
window.fbq('track', 'Purchase', {
  content_type: 'product',
  content_ids: ['habba-jathr', 'habba-noura'],
  contents: [
    { id: 'habba-jathr', quantity: 3, item_price: 349 },
    { id: 'habba-noura', quantity: 2, item_price: 99 },
  ],
  currency: 'SAR',
  value: 647,
  num_items: 5,
}, { eventID: event_id });
```

### 7.3 `CompletePayment` (TikTok web)

```ts
window.ttq.track('CompletePayment', {
  contents: [
    { content_id: 'habba-jathr', quantity: 3, price: 349 },
    { content_id: 'habba-noura', quantity: 2, price: 99 },
  ],
  content_type: 'product',
  currency: 'SAR',
  value: 647,
}, { event_id });
```

### 7.4 `PURCHASE` (Snap web)

```ts
window.snaptr('track', 'PURCHASE', {
  currency: 'SAR',
  price: 647,
  transaction_id: orderId,
  item_ids: ['habba-jathr', 'habba-noura'],
  item_category: 'supplements',
  number_items: 5,
}, { client_dedup_id: event_id });
```

## 8. Event timing — where in the flow each fires

| Event | When | Who triggers it |
|---|---|---|
| `PageView` | On page load (Web only; Meta/TikTok/Snap auto-fire after `load()`). | Web pixel loaders. |
| `ViewContent` | Mount of `/p/{slug}` and `/collection`. | Frontend `useEffect`. |
| `AddToCart` | Click on "أضيفي إلى السلّة" on PDP and on cross-sell `أضيفي` buttons. | Frontend store action. |
| `InitiateCheckout` | Open of CheckoutModal (from cart). | Frontend modal open. |
| `Purchase` | After successful `POST /api/orders` (201). | Frontend after order response **and** backend CAPI fan-out. |
| `UpsellAccept` | After `PATCH /api/orders/{id}/upsell` (200). | Frontend + backend CAPI fan-out (a `Purchase` event with `value: 99`, `is_upsell: true` custom param, and a **fresh** `event_id`). |

## 9. `_fbp`/`_fbc`/`_ttp`/`ttclid`/`sc_click_id` capture

The frontend reads these on mount:

- `_fbp` cookie (Meta).
- `_fbc` cookie or, if absent and `fbclid` URL param exists, synthesize:
  `_fbc = 'fb.1.' + Date.now() + '.' + fbclid` and set the cookie.
- `_ttp` cookie (TikTok).
- `ttclid` URL param → also stored in cookie `ttclid` (60 day TTL).
- `sc_click_id` from URL param `?ScCid=…` (Snapchat) → cookie `sc_click_id`.

When the user submits the order, the frontend sends all of these (read fresh) in `tracking.client.*` of `POST /api/orders`. Backend forwards them to CAPI.

## 10. Privacy / consent

KSA does not have a GDPR-style opt-in mandate for cookies (yet); a soft cookie notice is sufficient (`04 § N`). We do **not** wait for user consent before loading pixels, but we do honor `navigator.doNotTrack === '1'` — when set, pixels are skipped, but the server-side CAPI still fires (without `ph`/`fn`/`external_id`, only `event_id` + IP/UA so the bidder still gets aggregate data).

## 11. QA mode

- During QA, the AI coder sets `META_TEST_EVENT_CODE`, `TIKTOK_TEST_EVENT_CODE`, `SNAP_TEST_EVENT_CODE` in `.env`. The backend includes them in CAPI payloads.
- Verify in:
  - Meta Events Manager → "Test Events" tab.
  - TikTok Events Manager → "Test Event" tab.
  - Snap Events Manager → "Test Events".
- Confirm dedup status appears in Meta and TikTok event manager (each event should show "Browser + Server").

## 12. EMQ scoring (Event Match Quality)

To hit ≥ 7/10 EMQ on all three platforms, every CAPI Purchase event ships:

- `ph` (hashed, country code, per-platform format).
- `fn` (first name).
- `external_id` (order_id hashed).
- `country` (`sa` hashed).
- `client_ip_address` + `client_user_agent` (raw).
- `fbp`/`fbc` (Meta), `ttp`/`ttclid` (TikTok), `sc_click_id` (Snap).
- `event_id` (matching the web pixel's `eventID` / `event_id` / `client_dedup_id`).
- `action_source: "website"` (Meta + Snap).

## 13. Common mistakes the AI coder must NOT make

- Loading any pixel in the `<head>` synchronously. **Always deferred.**
- Forgetting to send the same `event_id` from CAPI as from the web pixel.
- Hashing `fbp` / `fbc` / `ttp` / `ttclid` / `sc_click_id` / `client_ip` / `client_user_agent`. **Do not.**
- Sending `phone` with `+` to Meta or Snap (digits only).
- Sending `phone` without `+` to TikTok (E.164 with `+`).
- Sending the upsell `Purchase` with the same `event_id` as the original `Purchase` — they are **separate** events with **separate** `event_id`s.
- Forgetting to upper-case the event name for Snap (`PURCHASE`, not `Purchase`).
- Forgetting the `pixel_code` (TikTok) or `pixel_id` (Meta/Snap) in the URL/body.
