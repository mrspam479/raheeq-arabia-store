# 07 — Information Architecture & Page Composition

The exact sitemap + section-by-section structure of every page, desktop and mobile, with alternating image/text layouts. Read with `04-copy-bank-arabic-ksa.md` open in a second tab — every text string already exists there.

## 1. Sitemap

```
/                              Home
/collection                    Collection (all 3 SKUs)
/p/habba-jathr                 PDP / Landing — حبّة جذر
/p/habba-layali                PDP / Landing — حبّة ليالي
/p/habba-noura                 PDP / Landing — حبّة نورة
/about                         About / Founder story
/contact                       Contact
/thank-you?id=...              Thank-you (post-order)
/legal/shipping                Shipping policy
/legal/returns                 Returns policy
/legal/privacy                 Privacy policy
/legal/terms                   Terms of service

# 404 and 500 are custom but live inside Next.js conventions (not separate routes in nav).
```

## 2. Global chrome

### 2.1 Top announcement bar (always visible above header)

- Height: 32px mobile, 36px desktop.
- Background: `--brand-primary`. Text: `--bg-cream`.
- Rotates 3 messages (see `04 § B1`) every 6s with a 200ms fade.
- Dismissable via tiny `×` (state stored in `sessionStorage` — reappears next session).
- `dir="rtl"` means the dismiss `×` appears at the **left** edge.

### 2.2 Header (sticky, always)

- Height: 64px mobile, 72px desktop.
- Background: `--bg-cream/95` with `backdrop-filter: blur(14px)`. Bottom border `--border`.
- RTL layout:
  - **Right side**: Logo lockup (`<Logo />` component — see `02-brand-identity.md § 3`). Clicking → `/`.
  - **Center (desktop only)**: Menu (`الرئيسية`, `المنتجات`, `عن رحيق`, `تواصلي معنا`).
  - **Left side**:
    - Search icon (decorative only in v1 — opens a soft "قريبًا" tooltip; not in nav for v1; **omit if cluttered**).
    - **Cart icon button** with a badge showing line count. Tap toggles cart drawer.
- Mobile only: hamburger replaces the menu (slides from the right; clicking a link closes it).
- Hover state on menu items: 1px underline animation in `--brand-accent`.

### 2.3 Cart Drawer (overlay)

Already specified in `06-offers-aov-funnel.md § 8`. Renders next to the page (not inside it). State held in Zustand.

### 2.4 Footer

Background `--brand-primary`. Text `--bg-cream`/`--bg-sand`.

4 columns desktop, accordion stacked on mobile:

| Column | Items |
|---|---|
| رحيق | About / Contact / Founder note one-liner |
| المنتجات | حبّة جذر / حبّة ليالي / حبّة نورة / المجموعة الكاملة |
| المساعدة | الشحن / الإرجاع / الأسئلة الشائعة (anchor to `/#faq`) / تواصلي معنا |
| السياسات | الخصوصية / الشروط |

Bottom strip (centered):
- Tagline: `رحيق — مكمّلات تليق بكِ.`
- Payment line: `الدفع عند الاستلام فقط · شحن داخل المملكة`.
- Copyright: `© رحيق ٢٠٢٦ — كل الحقوق محفوظة.`
- Social row: Snapchat / TikTok / Instagram icon links (URLs in env vars: `NEXT_PUBLIC_SOCIAL_SNAP`, `..._TIKTOK`, `..._IG`).

## 3. Home `/`

The structure alternates **text-right / image-left** then **text-left / image-right** for visual rhythm. (Remember: in RTL, the "leading" side is the *right* — so "text on the right" on home means starting reading from where the eye lands.)

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero | Full-width. Background image right 55%, copy block left 45% (desktop). On mobile: image stacks on top (4:5), copy below. | Hero image filename: `home-hero.jpg`. |
| 2 | Trust strip | Single row of 5 chips (icon + label). | Sticky-ish — sits directly under hero with -16px overlap. |
| 3 | "ليش رحيق؟" 3-col | 3 cards in a row (desktop); 1-col stacked on mobile. | No images, illustrative icons only. |
| 4 | Products row (the 3 SKUs) | 3-up grid on desktop, 1-up stack mobile. | Each card links to its PDP. |
| 5 | "حبّتان في اليوم" ritual section | Image right / text left. | Image: `home-ritual.jpg`. |
| 6 | Proof bar (4 stats) | 4-up row, 2x2 mobile. | No image. |
| 7 | Founder note | Image left / text right. | Image: `home-founder.jpg` (warm portrait, modest). |
| 8 | Reviews carousel | Edge-to-edge horizontal carousel of 6 review cards; native scroll snap on mobile. | No images. |
| 9 | FAQ | Vertical accordion. | No images. |
| 10 | Closing CTA band | Full-bleed band in `--brand-primary`. | No image, but a soft botanical SVG pattern overlay. |

Copy bank refs: `04 § B`.

## 4. Collection `/collection`

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero | Compact hero (40vh). Image right, text left. | Image: `collection-hero.jpg`. |
| 2 | 3 product cards | Larger format than home, with 1 hero image + 3 ingredient thumbs each. | Each card → PDP. |
| 3 | Combo strip | Full-bleed sand band, copy centered. | No image (botanical SVG only). |
| 4 | Trust & shipping band | 3 chips in a row. | No image. |

Copy bank refs: `04 § G`.

## 5. Product Detail / Landing `/p/{slug}`

This is the **most important** page of the site.

### Layout columns

- **Desktop**: 2-column. Right column = gallery (60% width); Left column = sticky info+offer panel (40% width).
- **Mobile**: stacked — gallery first (carousel, scroll-snap), then info+offer block; the offer block becomes a sticky bottom bar after scroll past the in-line block.

### Sections (top to bottom, mobile order)

| # | Section | Layout (desktop) | Layout (mobile) | Notes |
|---|---|---|---|---|
| 1 | Gallery | Right 60% sticky | Top carousel (4 images), 4:5 ratio | Images: `{slug}/cover.jpg`, `{slug}/lifestyle.jpg`, `{slug}/ingredients.jpg`, `{slug}/back.jpg`. |
| 2 | Eyebrow + H1 + Subhead | Left top | Below gallery | `04 § D1 / E1 / F1`. |
| 3 | Stars + reviews count + stock label | Left | Inline below H1 | Stock label in italic accent. |
| 4 | Offer block (3 tiles) | Left | Below stars | `06 § Tier rendering rules`. |
| 5 | Add-to-cart button (primary CTA) | Left (under offer) | Above the fold-after-scroll sticky bar | Copy: `أضيفي إلى السلّة`. Disabled until a tier is selected (default T3 means usually enabled). |
| 6 | Quick benefit chips (4) | Left | Below CTA | Icon + word each. |
| 7 | Trust micro-row (COD + Shipping + Lab + Halal) | Left | Below benefits | Inline. |
| 8 | "ليش …؟" section | Full-width below the two columns | Stacked | Image left / text right (`{slug}/why.jpg`). |
| 9 | Ingredients deep-dive | Alternating left-right cards (5 ingredients = 5 cards), zigzag | Stacked | Each card has thumb `{slug}/ing-{n}.jpg`. |
| 10 | How to use | Centered narrow block | Centered | No image. |
| 11 | Proof section (before/after) | Image full-width with caption | Same | Image: `{slug}/proof.jpg`. |
| 12 | Reviews specific to SKU | 3 cards | 1-up stack | No images. |
| 13 | FAQs specific to SKU | Accordion | Same | No images. |
| 14 | Cross-sell strip ("جربي أيضًا") | 2 cards (the other 2 SKUs) | 2 cards | Each links to its PDP. |
| 15 | Closing trust band | Full-bleed | Same | Same as home § 10 visually. |

Sticky elements:
- On desktop: the entire left column is sticky as the gallery scrolls.
- On mobile: bottom bar appears after the user scrolls past the inline offer block. Bar shows: `{selectedOfferLabel} · {price} ر.س` + `[أضيفي إلى السلّة]` button.

## 6. About `/about`

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero | Full-width, image left / text right, 60vh. | `about-hero.jpg`. |
| 2 | Founder long-form story | Single column ~640px wide, centered. | No image. |
| 3 | Founder portrait + signature | Image right / text left. | `about-founder.jpg`. |
| 4 | 3 pillars | 3-up row. | Icons only. |
| 5 | Process strip (4 steps) | Horizontal stepper. | Icons only. |
| 6 | CTA: ابدئي اليوم → collection | Full-bleed band. | No image. |

Copy bank refs: `04 § H`.

## 7. Contact `/contact`

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero | Compact, centered. | No image. |
| 2 | Contact info card | Centered card, 480px wide. | Icons for WhatsApp / Email / Address. |
| 3 | Contact form | Same card or stacked. | Form is optional in v1 — if `NEXT_PUBLIC_CONTACT_FORM_ENABLED=false`, hide. |

Copy bank refs: `04 § I`.

## 8. Thank-you `/thank-you?id=...`

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero confirmation | Centered, generous whitespace. | Subtle confetti SVG (no animation library). |
| 2 | Order summary card | Centered, 560px. | Read-only. |
| 3 | What happens next (3 steps) | Horizontal stepper. | "اتصال للتأكيد → الشحن → الاستلام". |
| 4 | Suggested SKUs (2) | 2-up row. | Cards link to PDPs. |
| 5 | CTA: العودة للرئيسية | Centered. | |

Copy bank refs: `04 § M`.

## 9. Legal pages

Static MD-ish content with one column of body text. Each is one h1 + content. See `20-legal-policies-shipping.md` for the actual text.

## 10. Modal/overlay components

| Component | Where it opens | Lives in route? | Notes |
|---|---|---|---|
| Cart Drawer | Global | No (portal) | Zustand state. |
| Checkout Modal | From Cart Drawer CTA | No (portal) | Focus-trapped, ESC closes. |
| Upsell Modal | After successful order POST | No (portal) | 15s timer + skip CTA. |
| Mobile menu | From header hamburger | No (portal) | Slides from right. |

All modals/portals use `next/dynamic({ ssr: false })` to keep the initial JS bundle lean.

## 11. Alternating layout rule (visual rhythm)

When a page has ≥ 2 image+text sections, alternate sides:

- Section A: image-right, text-left.
- Section B: image-left, text-right.
- Section C: image-right, text-left.
- ... and so on.

The AI coder must implement a `<SplitSection imageSide="right" | "left">` component to enforce this with a single prop.

## 12. Responsive breakpoints (Tailwind)

| Token | Min width | Use |
|---|---|---|
| `sm` | 640px | Larger phones. |
| `md` | 768px | Small tablets / large landscape phones. |
| `lg` | 1024px | Tablets / small laptops. |
| `xl` | 1280px | Standard desktop. |
| `2xl` | 1536px | Large desktop. |

Design baseline: 375px (iPhone 12/13/14/15) → 1440px (MacBook Air). 95% of traffic = mobile. Always design mobile first.
