# 21 — QA & Launch Checklist

A single page. The AI coder ticks every box **before** the founder switches DNS.

## 1. Build & lint

- [ ] `frontend`: `npm run lint` → 0 errors, 0 warnings.
- [ ] `frontend`: `npm run typecheck` → 0 errors.
- [ ] `frontend`: `npm run build` → succeeds; bundle sizes within budget (see `09 § 5`).
- [ ] `backend`: `ruff check .` + `ruff format --check .` clean.
- [ ] `backend`: `mypy app` clean.
- [ ] `backend`: `pytest -q` green.

## 2. Visual / brand

- [ ] Header lockup renders correctly on 320 px, 375 px, 414 px, 768 px, 1280 px.
- [ ] Footer columns stack on mobile, render in 4 cols on desktop.
- [ ] Brand color tokens match `08-design-system.md`.
- [ ] All headings use Tajawal; sub-mark uses Cormorant Garamond italic.
- [ ] No `lorem ipsum`, no stock-photo non-Khaleeji models.
- [ ] Alternating image/text rule respected on PDP and home.

## 3. Copy

- [ ] Every Arabic string sourced from `04-copy-bank-arabic-ksa.md`.
- [ ] No English in body text outside the logo + science citations.
- [ ] Reviews, FAQs, ingredient cards match `04` and `05`.
- [ ] Stock labels match the launch values in `05`.

## 4. Funnel

- [ ] PDP shows 3 offer tiles; T3 is pre-selected and recommended.
- [ ] Add-to-cart adds the **selected** tier (default T3).
- [ ] Cart drawer opens automatically after add-to-cart.
- [ ] Cart drawer shows cross-sells (other 2 SKUs) when ≥ 1 line exists.
- [ ] Cross-sell `أضيفي` adds T3 of that SKU to cart.
- [ ] Cart drawer CTA opens checkout modal.
- [ ] Checkout modal validates name + KSA phone live.
- [ ] Submit with invalid phone shows the error message from `04 § K`.
- [ ] Submit with valid phone POSTs to `/api/orders` with `Idempotency-Key`.
- [ ] On 201, upsell modal opens with 15s countdown.
- [ ] Clicking accept calls `PATCH /api/orders/{id}/upsell` → redirects to `/thank-you`.
- [ ] Clicking skip / timing out → redirects to `/thank-you`.
- [ ] Thank-you page shows correct order summary.

## 5. Validation & idempotency

- [ ] Submitting the same form twice (double-click) does not produce two orders (idempotency dedup).
- [ ] Submitting with `+966 50 123 4567`, `0501234567`, `00966501234567` all accepted; normalized to `+9665XXXXXXXX`.
- [ ] Submitting with non-SA number rejected with Arabic error.
- [ ] Honeypot field populated → backend returns 201 but no row appears in DB.

## 6. Pixels (Web)

- [ ] No pixel script in `<head>` on initial HTML.
- [ ] After first interaction (scroll/pointerdown), `fbq`, `ttq`, `snaptr` appear in `window`.
- [ ] `Facebook Pixel Helper` shows `PageView`, then `AddToCart`, then `Purchase` with consistent event IDs.
- [ ] TikTok Pixel Helper shows `Pageview`, `AddToCart`, `CompletePayment` events.
- [ ] Snap Pixel Helper shows `PAGE_VIEW`, `ADD_CART`, `PURCHASE` events with `client_dedup_id`.

## 7. CAPI (Server)

- [ ] Backend test events visible in Meta Events Manager → Test Events.
- [ ] Backend test events visible in TikTok Events Manager → Test Event.
- [ ] Backend test events visible in Snap Events Manager → Test Events.
- [ ] Each `Purchase` event shows `Browser + Server` in Meta dedup column.
- [ ] EMQ ≥ 7/10 on Meta and TikTok.
- [ ] No PII (raw phone, raw name) appears in CAPI logs.
- [ ] Phone hashed per platform per `13-pixels-tracking-capi.md § 2`:
  - Meta: `9665XXXXXXXX` (no +) → SHA-256 ✓
  - TikTok: `+9665XXXXXXXX` (with +) → SHA-256 ✓
  - Snap: `9665XXXXXXXX` (no +) → SHA-256 ✓
- [ ] `META_TEST_EVENT_CODE`, `TIKTOK_TEST_EVENT_CODE`, `SNAP_TEST_EVENT_CODE` UNSET in prod.

## 8. Google Sheet

- [ ] Apps Script deployed; URL pasted into `SHEET_WEBHOOK_URL`.
- [ ] `SHEET_WEBHOOK_SECRET` matches between Apps Script properties and backend `.env`.
- [ ] A test order appears as a new row in the `orders` tab within 5 s.
- [ ] WhatsApp link in column F opens `https://wa.me/<digits>` correctly.
- [ ] Accepting upsell bumps `upsell_added_sar` and `total_sar` on the original order row.
- [ ] A `status_update` test (via `PATCH /api/admin/orders/{id}`) updates the corresponding row in the sheet.

## 9. SEO

- [ ] `/sitemap.xml` lists all canonical pages, excludes `/thank-you`.
- [ ] `/robots.txt` matches `16 § 1.5`.
- [ ] Each PDP injects `Product` JSON-LD.
- [ ] Each page has correct `<title>` and meta description.
- [ ] OG images render correctly when sharing on WhatsApp, Snap, Twitter.

## 10. Performance

- [ ] Lighthouse Mobile on `/` : Perf ≥ 95, A11y ≥ 95, SEO = 100.
- [ ] Lighthouse Mobile on `/p/habba-jathr`: Perf ≥ 95, A11y ≥ 95, SEO = 100.
- [ ] CWV (real device): LCP ≤ 2.0 s, CLS ≤ 0.05, INP ≤ 200 ms.
- [ ] No render-blocking third-party scripts in initial waterfall.
- [ ] Fonts preloaded; no FOIT.

## 11. Accessibility & RTL

- [ ] `<html lang="ar" dir="rtl">`.
- [ ] All interactive elements keyboard-reachable.
- [ ] Cart drawer + modals trap focus and ESC closes them.
- [ ] Color contrast AA across the board.
- [ ] Form labels linked to inputs.
- [ ] Carousels and accordions have ARIA attributes from Radix.

## 12. Security

- [ ] `BACKEND_API_KEY` strong and not present in any frontend bundle.
- [ ] CORS restricted to `https://raheeqarabia.com` (+ `http://localhost:3000` dev only).
- [ ] Rate limits on `/api/orders` and `/api/track` active.
- [ ] `/docs` and `/redoc` disabled in production (`APP_ENV=production`).
- [ ] No PII in logs (phone masked, name not logged).
- [ ] HTTPS forced on both domains.

## 13. Resilience

- [ ] Backend recovers from a DB restart (next request succeeds).
- [ ] Sheet webhook failure does not roll back the order.
- [ ] CAPI failure does not affect the user (background queue retries).
- [ ] Double-submit on the form returns the same order (idempotent).

## 14. Legal & policies

- [ ] `/legal/shipping`, `/legal/returns`, `/legal/privacy`, `/legal/terms` all live with correct Arabic.
- [ ] Cookie banner appears once per device and is dismissable.
- [ ] PDP disclaimer in footer ("ليس دواء…") present.
- [ ] SFDA badge hidden unless `SFDA_BADGE_ENABLED=true`.

## 15. Operations

- [ ] Daily Postgres backups enabled in EasyPanel.
- [ ] Call-center has access to the Google Sheet.
- [ ] Owner has the WhatsApp link and email published in Contact + Footer.
- [ ] Founder has admin API key stored securely (1Password or equivalent).

## 16. Pre-launch dry runs

- [ ] Place 3 real test orders (one per SKU) via the live site with founder's own phone. Verify:
  - Order in Postgres ✓
  - Row in Sheet ✓
  - Purchase event in Meta/TikTok/Snap (live or test) ✓
  - Upsell flow ✓ (accept on order 1, decline on order 2, timeout on order 3)
  - Thank-you page renders correctly ✓

## 17. Final go/no-go

- [ ] Domain DNS pointed and HTTPS green on both `raheeqarabia.com` and `api.raheeqarabia.com`.
- [ ] All env vars production-set (no test event codes).
- [ ] Founder has the EasyPanel access + rollback playbook.
- [ ] Media buyer has the verified pixel IDs in their ad accounts.

Once all 17 sections are green: **launch**.
