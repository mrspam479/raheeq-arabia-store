# 06 — Offers, AOV & Funnel Logic

The single source of truth for **prices, bundles, cross-sells, upsells, COD rules, and the entire order/funnel sequence.** If anything in code contradicts this doc, the code is wrong.

## 1. Price ladder (locked, all SKUs)

| Tier code | Label (AR) | Quantity | Price (SAR) | Per-box (SAR) | Implied saving vs 1-box |
|---|---|---|---|---|---|
| `T1` | علبة | 1 | **199** | 199.00 | — |
| `T2` | الزوجي | 2 | **279** | 139.50 | 119 SAR |
| `T3` | Glow Kit (الأنصح) | 3 | **349** | 116.33 | 248 SAR |

- **No coupon system.**
- **No global discount fields.**
- The values above are immutable through the admin UI (v1 hard-codes them in the DB seed). Editing requires a code change + migration.
- **Default selected tier on PDP and in PDP/landing CTAs**: `T3 (Glow Kit)`.

The frontend stores the selected tier as `selectedOfferCode` on the product detail UI and adds the *resulting line item* to the cart with shape:

```ts
type CartLine = {
  sku: 'habba-jathr' | 'habba-layali' | 'habba-noura';
  productId: string;          // backend UUID
  productNameAr: string;
  offerCode: 'T1' | 'T2' | 'T3';
  offerLabelAr: string;       // e.g. "Glow Kit (الأنصح)"
  quantity: 1 | 2 | 3;        // mirrors offer
  unitPrice: number;          // 199 / 279 / 349 (bundle price, not per-box)
  imageUrl: string;
};
```

Note: `quantity` in `CartLine` reflects the **number of boxes inside the chosen bundle**, but the line itself is one cart entry whose `unitPrice` is the bundle's price (199/279/349). The cart subtotal is the sum of `unitPrice` across lines (NOT `unitPrice * quantity`).

### Tier rendering rules
- T3 has an accent-gold border (`--brand-accent`), an `الأنصح` ribbon, and a "وفّري ٢٤٨ ر.س" pill.
- T2 has a subtler "وفّري ١١٩ ر.س" pill (no border emphasis).
- T1 has no pill.
- The price (199 / 279 / 349) is displayed prominently; per-box price (e.g., "116.33 ر.س لكل علبة") sits as a faint sub-line in `--muted`.
- **Never** show strike-through prices. We do not have a "before" price.

## 2. Cross-sell logic (cart drawer)

When the cart drawer is open and the cart contains ≥ 1 line:

- Show a **"يضيف لطلبكِ"** section listing the **other two SKUs** in compact card form (image + name + 1-line benefit + "أضيفي" button).
- Clicking "أضيفي" on a cross-sell card adds **T3 (Glow Kit) of that SKU** to the cart (defaults are sacred).
- If the cart already contains all three SKUs, hide the section.
- The section is collapsible on mobile (default collapsed) to avoid blocking the CTA.

## 3. Post-form upsell (the one-and-only discount on the site)

After the user submits the COD checkout form successfully:

1. The frontend immediately POSTs the order to `POST /api/orders` (see `12-api-contract.md`).
2. On `201 Created`, the frontend **does not** redirect yet — it opens the **Upsell modal**.
3. Modal shows for **15 seconds** with a visible countdown (linear shrinking bar + numeric s).
4. The upsell SKU is decided by `05-products.md § 6` (the SKU not present in the cart, fallback `نورة > جذر > ليالي`).
5. Price displayed: **99 SAR** (the *only* place we discount; "بدل ١٩٩").
6. If the user clicks "أضيفيها":
   - Frontend POSTs `PATCH /api/orders/{id}/upsell` with `sku` + `priceSar:99`.
   - Then redirects to `/thank-you?id={orderId}`.
7. If the user clicks "لا، شكرًا" or 15 s elapses:
   - Frontend redirects to `/thank-you?id={orderId}`.
8. The upsell modal is shown **once per order**. No re-opens, no second-chance offer.

## 4. AOV math (the bet)

The site is engineered to convert toward a **3-box choice + upsell take**. Expected AOV:

| Path | Probability (target) | Order value |
|---|---|---|
| T1 only | 12% | 199 |
| T2 only | 16% | 279 |
| T3 only | 50% | 349 |
| T3 + cross-sell T3 (other SKU) | 5% | 698 |
| Any tier + upsell taken (99 SAR) | × 22% of all orders | + 99 |

Blended expected AOV ≈ **329 SAR** (target ≥ 310). The KPI in `01-project-brief.md` matches.

## 5. COD rules

- Payment **collected by the courier on delivery**. The site **never** asks for card data.
- All buttons that talk about payment say `دفع عند الاستلام`.
- Shipping is **free, all of KSA**, included in the price.
- The frontend confirmation modal explicitly states `الدفع عند الاستلام`.
- Phone validation is mandatory (see `12-api-contract.md` § validation).
- The address is **not** collected on the site. The call-center confirms address by phone (this lowers form friction and increases form-submission rate). The Google Sheet has an empty `address` column ready for the call-center to fill in.

## 6. Order status state machine

`pending` (lead captured) → `confirmed` (call-center reached customer, confirmed) → `shipped` → `delivered` / `returned` / `cancelled`.

For v1 the only status the website writes is `pending`; the call-center updates status manually in the Google Sheet and/or via a lightweight admin endpoint behind an API key (see `12-api-contract.md`).

## 7. Funnel sequence (end-to-end)

```
[Snap/TikTok/Meta ad] → [Landing/PDP]
   ↓ user picks offer (T3 pre-selected)
[Add to Cart] → [Cart Drawer slides in]
   ↓ cross-sell visible
[Cart CTA: أكملي الطلب] → [Checkout Modal opens]
   ↓ name + KSA phone validated live
[Submit] → [POST /api/orders] → order_id in hand
   ↓ EVENT: Purchase (web pixel + CAPI, dedup via event_id)
[Upsell Modal opens, 15s]
   ├─ Accept → [PATCH /api/orders/{id}/upsell] → [Thank You]
   └─ Decline / Timeout → [Thank You]
[Thank You page] → suggested SKUs, no second checkout
```

## 8. Cart drawer specifics

- **Trigger**: clicking the cart icon in the header, or auto-opening after AddToCart.
- **Slide-in side**: visually from the leading edge in RTL (which is the right of the viewport since `dir=rtl`).
- **Width**: 100% mobile, 420px desktop.
- **Sticky footer** inside the drawer holds subtotal + COD note + primary CTA.
- **Behaviors**:
  - Each line has `-` / `+` to switch its offer tier (clicking `+` upgrades T1→T2→T3 and clicking `-` downgrades). When the user reaches T3, `+` becomes disabled (locked).
  - Remove (`×`) removes the line.
  - Cart persists in `localStorage` (`raheeq.cart.v1`).
  - When all lines are removed → empty state copy (see `04 § J`).

## 9. Checkout modal specifics

- **Layout**: full-screen sheet on mobile (slides up), centered card on ≥ 768px.
- **Order summary** at top (read-only, with prices).
- **Two fields**: full name (Arabic-allowed, RTL input) + KSA phone (LTR `tel` input, formatted with `libphonenumber-js` on blur).
- **Live validation**:
  - Name: `>= 2 word chars`.
  - Phone: passes `libphonenumber-js` validation for SA and the resulting E.164 starts with `+9665`.
- **Submit**: disabled until both pass; on submit, button shows spinner; idempotency key sent (UUID) so a double-click doesn't double-order.
- **On 201**: dispatch `Purchase` pixel events with `event_id`, open Upsell modal.
- **On error**: friendly toast + keep modal open.

## 10. Thank-you page specifics

- Static info: order id, items summary, COD reminder, "we will call you within 24h".
- Suggestions strip: 2 product cards (other SKUs not yet purchased).
- **No** "buy again" CTA that opens checkout — the funnel is done.
- Final pixel event: `CompleteRegistration` (Meta) / `Lead` (TikTok) / `SIGN_UP` (Snap) — see `13-pixels-tracking-capi.md` for the exact mapping; in v1 we treat the form-submit as the `Purchase` event for all three platforms because the order is committed at form submit (COD model), with `event_id` shared between web and CAPI.

## 11. Idempotency & retry guards

- Submit button is **disabled** while the request is in flight.
- The frontend generates a UUID `idempotencyKey` per checkout session and sends it in the `Idempotency-Key` header.
- The backend stores `idempotency_key` on `orders` table and returns the existing order if the same key arrives twice.
- The Apps Script webhook is best-effort. The backend retries failed sheet posts with exponential backoff (1s, 4s, 16s, 64s, 5 min) via a `tenacity` decorator. On final failure the row is still in Postgres; ops can reconcile.

## 12. What we are NOT building in the funnel (avoid scope creep)

- Cart abandonment email/SMS recovery (no email/SMS infra in v1).
- WhatsApp click-to-chat from cart (the funnel must stay in-tab).
- Bundles that mix SKUs at a discount.
- Subscription / auto-replenish.
- Account creation.
