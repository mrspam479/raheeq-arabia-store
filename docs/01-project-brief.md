# 01 — Project Brief

## 1. The business in one sentence

**Raheeq Arabia (رحيق)** is a Saudi-Arabian, Arabic-first, DTC functional-gummy brand sold direct via paid social (Snapchat + TikTok + Meta) on a **Cash-on-Delivery** model, engineered around premium positioning, high AOV, and high confirmation/delivery rate.

## 2. Why this brand wins in 2026

- KSA women have access to global supplements but **rarely** see a premium, Arabic-native, female-coded supplement brand that talks to them in their dialect with their cultural references.
- The product format — **gummies (حلوى)** — is delightful, gift-able, and has high perceived value vs. capsules.
- Snapchat + TikTok in KSA index high on women 18–45 with disposable income. UGC-style ads convert when the landing page **looks like the brand owns the product**.
- COD removes the #1 conversion blocker (card friction, distrust of unfamiliar checkout).

## 3. Three SKUs (locked)

All three SKUs are sold at one price ladder. Names below are final.

| Product | Arabic | English working name | Hero benefit |
|---|---|---|---|
| Hair | **حبّة جذر** | Hair Gummy | شعر أقوى وأكثر كثافة — Biotin + Saw Palmetto + Marine Collagen |
| Sleep | **حبّة ليالي** | Sleep Gummy | نوم عميق وراحة الأعصاب — Melatonin + Ashwagandha |
| Beauty | **حبّة نورة** | Beauty Gummy | بشرة مشرقة وأظافر قوية — Marine Collagen + Vitamin C |

Full specs live in `05-products.md`.

## 4. Pricing & offer (locked)

Single ladder, identical for all three SKUs:

| Tier | Quantity | Price | Per-box | Saving vs 1 box |
|---|---|---|---|---|
| Starter | 1 box | **199 SAR** | 199 | — |
| Couple | 2 boxes | **279 SAR** | 139.5 | 60 SAR |
| Glow Kit | 3 boxes | **349 SAR** | 116.3 | 248 SAR |

- Default selected tier in PDP: **3 boxes — Glow Kit**.
- **No coupon codes.** **No discount fields.**
- The **only** discount on the entire site is the **post-checkout one-time upsell at 99 SAR** for a relevant gummy (different SKU than the cart).

## 5. KPIs (success metrics)

| KPI | Target |
|---|---|
| Add-to-cart rate (PDP) | ≥ 18% |
| Reach-checkout rate (cart → form open) | ≥ 55% |
| Lead submission rate (form open → submit) | ≥ 70% |
| Upsell take rate (lead → 99 SAR upsell taken) | ≥ 22% |
| Average order value (AOV) | ≥ 310 SAR |
| Confirmation rate (call-center verifies order) | ≥ 78% |
| Delivery rate (delivered / confirmed) | ≥ 85% |
| LCP (mobile, 4G) | ≤ 2.0 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |

## 6. Scope (this build)

In:

- Marketing storefront (Home, About, Contact, Collection, 3 PDPs/landings, Cart drawer, Checkout modal, Post-form upsell modal, Thank-you).
- COD order capture (name + valid KSA phone + chosen offer + selected SKUs).
- Cross-sell inside cart drawer.
- One-shot post-form upsell (single SKU, 99 SAR).
- Orders persisted to Postgres **and** mirrored to a Google Sheet via Apps Script webhook.
- Meta + TikTok + Snapchat Web Pixels (deferred) and CAPI server-side with shared `event_id` for dedup.
- Backend admin endpoints (lightweight) protected by static API key, sufficient for ops.

Out:

- Real payment gateway.
- Account / login system.
- Wishlists, reviews submission (reviews are curated static for v1).
- Multilingual storefront (English is logo + science citations only).
- Loyalty program (planned post-launch).

## 7. Constraints

- **Server**: Single VPS with EasyPanel + managed Postgres already running. DB name `raheeqarabia`, internal URL provided.
- **Domains**: `raheeqarabia.com` (frontend) + `api.raheeqarabia.com` (backend). Both behind EasyPanel reverse proxy with auto HTTPS.
- **Compliance**: Supplements in KSA must be sold with non-medical claims worded as wellness benefits. SFDA registration claim if/when available (`see 05-products.md`).
- **Privacy**: We store name + phone + address (when collected later) + order metadata. We do **not** store payment data. We do **not** ship PII unhashed to any pixel API.
- **No telemetry** to third parties beyond the three ad pixels and the Apps Script webhook.

## 8. Non-goals

- Building a generic e-commerce platform.
- Replicating Shopify functionality. We replace the parts of Shopify that matter for one funnel (PDP → cart → COD form → thank-you) and ignore the rest.
- Multi-variant inventory.

## 9. Team handoff

- The **founder** approves copy, pricing, photos, and offer math.
- The **AI coder** implements per these docs.
- The **media buyer** plugs pixel IDs into env vars after launch (`18-env-and-deployment.md`).
- The **call-center** uses the Google Sheet (`14-google-sheet-webhook.md`).
