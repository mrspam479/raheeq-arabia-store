# رحيق Raheeq Arabia — AI Engineering & Design Brief

> **Read this before writing a single line.** This document captures every validated decision, preference, and constraint for the Raheeq e-commerce store. Deviating from this brief without explicit instruction is not acceptable.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Brand name | **رحيق** (Arabic) / **Raheeq Arabia** (English) |
| Logo text | Single **ر** — never "رحيق العربية", never two ر characters |
| Tagline | حلوى يومية. نتيجة تُحسّينها. |
| Country | Saudi Arabia 🇸🇦 — lean into this. It builds trust. |
| Target | Saudi women (18–40), aspirational, quality-conscious |
| Tone | Warm, empowering, feminine, science-backed — NOT clinical, NOT pushy |
| Language | Arabic-first (RTL). All UI copy in Arabic. No mixing of French/English in user-facing copy. |

### Products (3 SKUs — do NOT invent others)
| Slug | Name | Goal |
|---|---|---|
| `habba-jathr` | حبّة جذر | شعر (Hair) |
| `habba-layali` | حبّة ليالي | نوم (Sleep) |
| `habba-noura` | حبّة نورة | بشرة (Skin) |

**All three products are identical in price and offer structure (T1/T2/T3).**  
- T1: 199 SAR — 1 box  
- T2: 279 SAR — 2 boxes  
- T3: 349 SAR — 3 boxes (Glow Kit, always recommended)

---

## 2. Design System

### Color Palette
```
Primary (emerald): #0F4D3D   — brand green, used for bg, text, borders
Primary dark:      #082e22   — hero section background (very dark, high contrast)
Accent (saffron):  #B98A3A   — gold, used for secondary CTAs and highlights
Ivory:             #FBF3E7   — warm off-white backgrounds
Charcoal:          #2F241D   — body text (NEVER pure black #000)
CTA green:         #00C97A   — primary button color (vibrant, eye-catching)
Brand light:       #34C48C   — lighter green for supporting text on dark bg
```

### Typography
- **Font Tajawal** — all Arabic text. Weights: 400, 600, 700, 900
- **Font Cormorant Garamond** — italic accents only (heroTagAr, luxury feel)
- **Font Inter** — numbers (prices, stats). Use `en-US` locale for all numbers.
- **Numbers**: Always Latin (1, 2, 3 — NOT ١، ٢، ٣)

### Spacing & Radii
- Cards: `rounded-[28px]` — signature Raheeq radius
- Buttons: `rounded-xl` (14px)
- Section padding: `py-16 md:py-20`

### Layout Direction
- RTL (`dir="rtl"`) on `<html>`
- All CSS logical properties (start/end, not left/right)

---

## 3. CTA (Call to Action) — Critical

The primary CTA is the **most important element on every page**. It must be:
- **Color**: `bg-[#00C97A]` with `text-[#082a1c]` (near-black text on vivid green)
- **Animation**: CSS `cta-pulse` keyframe (pulsing green glow) — defined in `globals.css`
- **Size**: minimum `h-14`, `text-lg font-black`, `w-full` on mobile
- **Copy**: action-first ("اطلبيها الآن", "اختاري حبّتكِ", "أكّدي الطلب")
- **Never** make it disappear, change on hover, or use `opacity < 1`
- A 60-year-old with no tech experience must immediately know to click it

### Button Variants
```
primary   → bg-[#00C97A] text-[#082a1c] — main purchase CTA
secondary → bg-saffron text-charcoal — used on dark (emerald) backgrounds only
ghost     → transparent, emerald text — nav/minor actions
outline   → white border, emerald text — low-priority actions
```

---

## 4. Offer / Product Selector — Critical UX Rules

When a customer selects an offer tier (T1, T2, T3):

**Selected state MUST show:**
- ✓ Checkmark badge (green circle, top-left corner of card)
- White background with 3px `border-[#00C97A]` border
- Full opacity, vibrant price in `#00A85A`
- `box-shadow` with green glow

**Non-selected state:**
- `opacity-65` — visually "dimmed/available"  
- Thin `border-[#ddd0bc]`
- Greyed price and text

**Rule**: Nothing disappears when an offer is selected. All 3 cards always remain visible in a `grid-cols-3` layout. No flex/justify-between toggle logic.

**Urgency text** (always visible near selector):
- "⏳ العرض لفترة محدودة" — right-aligned next to the label
- Below grid: "استفيدي من العرض — الأكثر توفيرًا هو Glow Kit"

---

## 5. Hero Section Rules

- **Background**: `#062318` (near-black forest green) — white text must be clearly readable
- **Headline contrast**: white text on dark bg = contrast ratio 14:1 (excellent)
- Add `textShadow: '0 2px 24px rgba(0,0,0,0.45)'` to H1 for crispness
- **Never** use `text-white/82` or similar opacity reductions — use full `text-white`
- For supporting text on dark bg: use `#c8edd8` (soft mint) or `#34C48C` — not white (avoids visual noise)
- The "سعر" pill (`من 199 SAR · بدون بطاقة`) must use `text-saffron` on dark bg (always readable)

### Hero Copy Structure (validated)
```
[Eyebrow badge] صُنع في السعودية · مفحوص مخبريًا

[H1 white]   علمٌ بطعم الحلوى.
[H1 saffron] نتيجة تُبهر المرآة.

[Sub white-bold]  حبّة رحيق — تركيبة مدروسة لشعركِ، نومكِ، أو بشرتكِ.
[Sub mint]        30 يومًا كافية — إن لم تشوفي فرق، [bold white] نردّ لكِ كل ريال.

[CTA]  اختاري حبّتكِ الآن  (secondary / saffron button)
[Sub]  من 199 SAR · بدون بطاقة  (saffron text)
       دفع عند الاستلام · شحن 1–3 أيام  (soft green text)

[Proof] 4.9/5 تقييم  |  +12k عميلة  |  1–3 أيام شحن
        (numbers in #00C97A with green glow)
```

---

## 6. Announcement Bar Rules

- Background: `#072820` (very dark green, darker than hero)
- Text: `text-white font-bold text-[13px]`
- Height: `py-3.5`
- Separator dots: `bg-[#00C97A]` (not saffron)
- Top edge: thin saffron gradient line for premium feel
- Animation: RTL marquee → `translateX(-33%)` (moves right-to-left, natural for Arabic)
- Contains: 🚚 شحن · 💳 دفع عند الاستلام · ✅ ضمان · 🌿 حلال · 📦 تغليف · 🇸🇦 سعودي

---

## 7. Trust Architecture — Non-Negotiable Elements

These elements **must always be visible** somewhere on the PDP and checkout flow:

1. **COD badge**: "الدفع عند الاستلام" — at hero, PDP, and checkout
2. **No card required**: "بدون بطاقة" — hero CTA row and checkout header
3. **Money-back guarantee**: "ضمان رضا 14 يوم" — announcement bar + PDP trust row
4. **Lab-tested**: "مفحوصة مخبريًا" — announcement bar + PDP badges
5. **Saudi brand**: "صُنع في السعودية" — announcement bar + hero badge
6. **Call confirmation**: "نتصل للتأكيد قبل الشحن" — PDP and checkout

---

## 8. Checkout Funnel Flow

```
PDP → Cart Drawer → Checkout Modal → Upsell Modal (99 SAR, 15s timer) → Thank-you page
```

### Checkout Modal Rules
- Only asks for: **name + phone** — nothing else, ever
- Header: dark emerald gradient, saffron eyebrow, "احجزي طلبك الآن"
- Trust row below form: "بدون بطاقة · بدون عنوان الآن · اتصال للتأكيد"
- CTA: primary button (`#00C97A`) with text "أكّدي الطلب الآن — دفع عند الاستلام"
- Post-submit: triggers 99 SAR upsell modal (15-second countdown, single-use)

### Upsell Modal Rules
- Price: 99 SAR only, locked, non-negotiable
- Countdown: 15 seconds visible progress bar
- One accept, one decline — both must clearly work
- **Testing**: `isLocalPreview()` check bypasses real API calls

---

## 9. "How It Works" Section — 3 Steps

| Step | Title | Featured? |
|---|---|---|
| 1 | اختاري | No |
| **2** | **أكّدي** | **Yes — most important** |
| 3 | استلمي | No |

**Step 2 featured design**: white background, 3px `border-[#00C97A]`, green number badge, floating "✓ الخطوة الأهم" badge above. **Never** use dark-bg on this card — text becomes unreadable.

---

## 10. Product Switcher (PDP)

Shows all 3 products as navigation links inside the PDP. Rules:
- `min-h-[44px]` on every switcher button — ensures consistent height regardless of name length
- `flex items-center justify-center` — vertically centers names that wrap
- Active: `bg-emerald text-white border-saffron`
- Inactive: `bg-white text-emerald border-emerald/10`
- "حبّة نورة" wraps in 2 lines on small screens — this is expected and handled by min-h

---

## 11. Copy Voice Guidelines

### Do ✅
- Second person feminine: "اختاري", "تستحقين", "جوالكِ", "طلبتِ"
- Colloquial Saudi: "شوفي فرق", "ما في بطاقة", "ندق عليكِ"
- Benefit-first: lead with the transformation, not the ingredient
- Short, punchy: max 12 words per sentence in copy blocks
- Urgency: "فترة محدودة", "كمية محدودة", "الأكثر طلبًا"
- Risk reversal: "نردّ لكِ كل ريال" (money-back guarantee always visible)

### Don't ❌
- Formal MSA that feels cold or clinical
- Long paragraphs in hero/PDP purchase area
- English marketing phrases (even "best seller" — use الأكثر طلبًا)
- Exaggerating beyond the product capabilities
- Using "you are amazing" empty flattery

---

## 12. Technical Rules

### Numbers & Formatting
- All numbers in Latin: `en-US` locale in `formatSar()` and `formatNumber()`
- SAR prices: "199 SAR" format (space before SAR, no ر.س)
- Phone: KSA format validation via `libphonenumber-js`

### Pixel / Analytics
- Deferred pixel loading: fires only after user interaction or idle callback
- Server-side CAPI proxy via `/api/track` → backend → Meta/TikTok/Snap
- Event ID deduplication: same UUID sent to both web pixel and CAPI

### Images
- Currently SVG placeholders in `/public/images/products/{slug}/cover.svg`
- **Replace with real product photos before launch** — high priority
- Hero: `/public/images/hero/home-hero.svg` — replace with lifestyle shot

### Performance Budget
- No third-party scripts in `<head>` — all deferred or lazy
- Fonts: only Tajawal (Arabic), Cormorant Garamond (display), Inter (numbers)
- Tailwind v4 — purge is automatic, no config needed

---

## 13. What NOT to Change Without Asking

1. **Pricing** — T1/T2/T3 at 199/279/349 SAR. Locked by business decision.
2. **Upsell price** — 99 SAR, non-negotiable.
3. **Payment method** — COD only. No Mada, no Visa, no Apple Pay.
4. **Brand name** — "رحيق" only. No "رحيق العربية" or "Raheeq".
5. **Logo ر** — single character, no variations.
6. **3-product catalog** — these 3 SKUs only until further notice.

---

## 14. Known Issues & Pending Work (as of May 2026)

- [ ] **Real product photos**: SVG placeholders must be replaced with actual product images before any ad traffic
- [ ] **Backend not running locally**: Use `isLocalPreview()` function in `CheckoutModal` for local testing. The upsell modal won't POST to backend in preview mode.
- [ ] **Marketing copy**: Hero copy is set. PDP long descriptions are placeholders — refine once brand photoshoot is done.
- [ ] **Google Sheets integration**: Backend CRUD to Google Sheets not yet tested end-to-end. Verify `ORDER_CREATED` webhook fires correctly.
- [ ] **EasyPanel deployment**: Docker images built, not yet deployed. Env vars needed: `NEXT_PUBLIC_API_URL`, `META_PIXEL_ID`, `TIKTOK_PIXEL_ID`, `SNAP_PIXEL_ID`, `CAPI_TOKEN_*`
- [ ] **SMS confirmation flow**: Backend sends order to Google Sheet; human team calls customer. No automated SMS yet.

---

## 15. AI Prompt Tips (for future sessions)

When starting a new session, say:

> "I'm building Raheeq Arabia, a Saudi women's supplement e-commerce store. Read `docs/RAHEEQ_AI_BRIEF.md` before doing anything. Current task: [your task]."

Key reminders for AI:
- **CTA must be `#00C97A` (vivid green) with pulsing animation** — do not revert to dark emerald or saffron
- **Never use `text-white/XX` opacity** on dark backgrounds — use full `text-white` or a light-green alias
- **Offer cards**: white bg + green border when selected + checkmark badge. Never dark bg inversion.
- **"أكّدي" step** (TrustStep #2): always white background with green border — never dark bg
- **Announcement bar background**: `#072820` — darker than the hero bg
- The hero bg is `#062318` — if you change this, white text WILL become unreadable again
- Product name "حبّة جذر" needs `overflow-hidden` removed from its parent link so text isn't clipped
- All 3 products must appear in hero cards, product grid, and PDP switcher — check render logic before touching PRODUCTS array
