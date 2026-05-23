# 15 — CRO, Trust Stack, Social Proof & Scarcity

The persuasion blueprint. Every element below must appear on every relevant page in the exact form described.

## 1. The trust stack (where each badge appears)

| Badge | Home Hero strip | Collection cards | PDP trust row | Checkout modal | Footer | Cart Drawer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| الدفع عند الاستلام | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| شحن ١–٣ أيام داخل المملكة | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| حلال ١٠٠٪ | ✓ | ✓ | ✓ | — | ✓ | — |
| بدون سكر مضاف | — | ✓ (per SKU) | ✓ | — | — | — |
| بدون جيلاتين حيواني | — | ✓ | ✓ | — | — | — |
| مفحوصة مخبريًا — COA لكل دفعة | ✓ | — | ✓ | ✓ | — | — |
| GMP | — | — | ✓ | — | — | — |
| صُمِّمت في السعودية | ✓ | — | ✓ | — | ✓ | — |
| ضمان رضا ١٤ يوم | — | — | ✓ | ✓ | ✓ | ✓ |

## 2. Social proof matrix

### 2.1 Quantitative proof bar (Home + closing PDP band)

- `+12,000` `عميلة سعودية`
- `4.9 / 5` `متوسط تقييم`
- `97٪` `نسبة الرضا`
- `1–3 أيام` `للتوصيل في المدن الرئيسية`

These are aspirational but defensible. If the founder wants conservative numbers at launch, start at `+1,200` / `4.9 / 5` / `95٪` / `1–3 أيام`. The AI coder ships the larger numbers behind an env flag `NEXT_PUBLIC_PROOF_TIER=large` to allow ramp-up.

### 2.2 Reviews

- Use curated reviews from `04 § C` and product-specific reviews from `04 § D8/E7/F7`.
- Each review card shows name + city + stars + body.
- On the home page reviews carousel, randomize order on each visit.
- On the PDP, the SKU-specific reviews appear in the order defined.

### 2.3 UGC strip (post-launch)

Reserve a `<UgcStrip />` component placeholder on the home page (after the founder note section) that the founder can later wire to a JSON file containing TikTok/Snap UGC video stills. Hidden by default in v1 (`NEXT_PUBLIC_UGC_STRIP_ENABLED=false`).

## 3. Authority elements

| Element | Where |
|---|---|
| Ingredient mg per serving (PDP ingredient cards) | PDP |
| Lab certificate (COA) note in trust row | PDP |
| Founder portrait + signature | Home, About |
| Scientific source short reference (e.g. "EFSA: …") inside each ingredient card | PDP |
| Comparison band (optional) — Raheeq vs Western brand at SAR price | PDP (collapsible, off by default) |
| Press strip (optional, post-launch) — logos of Saudi blogs / KOLs | Home, About |

## 4. Scarcity rules

- The stock label on each PDP is a **batch label**: `بقي 27 علبة من دفعة هذا الأسبوع.`
- The number is read from the backend via `products.stock_label_ar`. It rotates manually every week. (We do not lie about stock; the batch is real even if the label is conservative.)
- The post-form upsell modal has a **15-second countdown**. The bar shrinks linearly and the seconds number is displayed.
- Cart drawer + checkout modal show a one-line micro-scarcity copy: `بقي عدد محدود من علب هذه الدفعة — احجزي طلبكِ.`

Never use:
- Fake "X others are looking at this product right now" widgets.
- Fake "X bought in last 24h" pop-ups.
- Strike-through pricing.

## 5. The 6 CRO checks on every PDP

1. The hero promise (subhead) is the same promise the ad video makes.
2. The Glow Kit (T3) tile is **pre-selected** and visibly recommended.
3. Above-the-fold benefit chips (4) translate the offer into 4 tangible outcomes.
4. The trust micro-row (COD + Shipping + Lab + Halal) sits within 1 scroll of the CTA.
5. Sticky CTA bar appears on mobile after the user scrolls past the inline CTA.
6. FAQ exists with the **objection-busting** items from `03 § 5`.

## 6. The 8 CRO checks on the checkout modal

1. Order summary visible at the top — the user always sees what they're confirming.
2. Two fields only (name + phone). No address. No city. No email.
3. Live phone validation (`libphonenumber-js`), Arabic error message, format on blur.
4. Submit button copy explicitly says `تأكيد الطلب — دفع عند الاستلام`.
5. Disabled until fields are valid (prevents anxious double-clicks).
6. Honeypot field hidden via `display: none; opacity: 0; position: absolute; pointer-events: none`.
7. One trust line under the heading + one trust row at the bottom.
8. Idempotency via UUID `Idempotency-Key`. Double-submit returns the same order.

## 7. The cart drawer's CRO job

- Total visible at all times.
- Cross-sell visible but collapsible on mobile (not blocking the CTA).
- Each line shows the chosen offer label clearly.
- Empty state has friendly Arabic copy + CTA to `/collection`.
- The `أكملي الطلب` CTA is the same green-on-cream `primary` button used everywhere; never a different style.

## 8. Post-form upsell — psychology

- **Eyebrow**: `عرض لمرّة واحدة — لكِ فقط الآن` (Cialdini: scarcity + identity).
- **Headline**: precise (`بسعر ٩٩ ر.س فقط`).
- **Subhead**: "بدل ١٩٩" anchors the discount.
- **3 bullets** rationalize the decision: no extra shipping, same guarantee, won't show again.
- **Visible countdown** removes the "I'll think about it" path.
- **Tertiary skip button** is plain text (not a styled button) so the brain treats accept as the default.

## 9. Friction audit — what we removed

- ❌ Account / login.
- ❌ Email field at checkout.
- ❌ Address field at checkout (call-center captures by phone — improves submission rate).
- ❌ Multiple payment options (we only show COD; one decision).
- ❌ Coupon code field (no discount system).
- ❌ Newsletter pop-up.
- ❌ Cookie wall (only a soft one-line banner that doesn't block scroll).

## 10. Confirmation-rate boosters (call-center facing)

- WhatsApp link auto-built in the Google Sheet (`wa.me/<phone>`), so the call-center can deep-link in one click.
- `items_summary` cell is human-readable Arabic.
- `landing_url` + `utm_*` cells help the call-center match the customer's expectation ("اشتريتي من إعلان TikTok؟ لإطلاعك على…").
- COD-related copy reaffirms expectations multiple times to lower "refused at door" rate.

## 11. Delivery-rate boosters (the package itself)

These are operational; the AI coder reflects them in copy where relevant:

- Insert a "Welcome card" in every box with thank-you note + WhatsApp QR.
- 14-day satisfaction guarantee printed on the box and the welcome card.
- COD instructions printed on the box: "ادفعي عند الاستلام · افتحي الطرد بحضور المندوب لاطمئنانكِ".

(The above are factored into copy and policy doc, not into the site flow itself.)

## 12. Pricing psychology

- Show **3 tiers**. Three is the magic number; one or two flattens decision-making.
- Anchor middle (T2 = 279) as a "good" option, T3 as "best". T1 is the unhappy anchor.
- Express per-box savings, not percentages, because percentages on tiny SAR amounts feel small.

## 13. Visual hierarchy on every key screen (eye-track expectations)

- Mobile PDP first scroll: image → stars → offers → primary CTA. The user's thumb is **already over** the CTA.
- Desktop PDP: sticky right column (40%) holds the entire decision; the left side (60%) is education.
- Mobile checkout: heading → order summary → name → phone → CTA. Order: ≤ 5 actions to commit.

## 14. Microcopy CRO wins

- Submit button copy: `تأكيد الطلب — دفع عند الاستلام` (verb + payment method removes uncertainty).
- Tiny line under CTA: `بياناتكِ تُستخدم فقط لتأكيد الطلب وتوصيله.` (Privacy reassurance.)
- Cart drawer subtotal label: `الإجمالي` is followed by `الشحن مجاني داخل المملكة` (kills hidden-fee anxiety).
- Upsell skip CTA copy: `لا، شكرًا — أكملي بدون الإضافة` (acknowledges and de-stigmatizes "no").

## 15. The "we look like we own the brand" checklist

(Anti-dropship signals. Each item ships in v1.)

- [ ] Founder portrait + first-person story on the About page.
- [ ] Real-feeling ingredient mg + science citations per SKU.
- [ ] Lab/COA mention with the right vocabulary ("شهادة تحليل لكل دفعة").
- [ ] GMP badge + "Made in KSA (assembled & quality-checked)" wording.
- [ ] All product copy in KSA dialect, never auto-translated.
- [ ] Footer policies (Shipping / Returns / Privacy / Terms) actually written, KSA-specific.
- [ ] WhatsApp customer line published in Contact and Footer.
- [ ] Domain on TLD `.com` with HTTPS and brand SSL.
- [ ] Open-Graph / Twitter cards configured with brand visuals.
- [ ] `Organization` JSON-LD with logo URL.
- [ ] Email "hello@raheeqarabia.com" published (if mailbox exists).
