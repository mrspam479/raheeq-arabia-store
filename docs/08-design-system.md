# 08 — Design System

A complete token + component contract. The AI coder implements it once in `frontend/lib/tokens` (or `globals.css` variables + tailwind config) and never invents one-off styles.

## 1. CSS variables (in `frontend/app/globals.css`)

```css
:root {
  /* Brand */
  --brand-primary: #0E4F3A;
  --brand-primary-dark: #08332A;
  --brand-primary-light: #1F6E54;
  --brand-accent: #C9943F;
  --brand-accent-light: #E0B561;
  --brand-accent-dark: #9F7227;

  /* Surfaces */
  --bg-cream: #FBF7F0;
  --bg-sand: #F3EADA;
  --bg-card: #FFFFFF;
  --border: #E6DDCB;

  /* Text */
  --ink: #1B1B1B;
  --ink-soft: #3A3530;
  --muted: #5C5751;

  /* States */
  --success: #1E7A3A;
  --error: #A4382D;
  --info: #2D6CA3;

  /* Radii */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-1: 0 1px 2px rgba(27,27,27,0.04), 0 1px 1px rgba(27,27,27,0.04);
  --shadow-2: 0 4px 14px rgba(27,27,27,0.06), 0 1px 2px rgba(27,27,27,0.04);
  --shadow-3: 0 12px 32px rgba(27,27,27,0.08), 0 2px 4px rgba(27,27,27,0.04);

  /* Spacing scale (multiples of 4) */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Easing */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

html, body { background: var(--bg-cream); color: var(--ink); }
```

## 2. Tailwind v4 config (the AI coder mirrors these tokens in `tailwind.config.ts`)

- Use Tailwind v4's `@theme` directive when applicable.
- Expose tokens as utilities: `bg-cream`, `bg-sand`, `text-ink`, `text-muted`, `border-border`, `bg-brand`, `text-brand`, `bg-accent`, `text-accent`.
- Add a custom variant `rtl:` already supported by Tailwind v4 via `dir`.

## 3. Typography (Tailwind classes + fonts)

Fonts wired in `frontend/app/layout.tsx`:

```ts
import { Tajawal, Cormorant_Garamond, Inter } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});
```

`<html lang="ar" dir="rtl" className={`${tajawal.variable} ${cormorant.variable} ${inter.variable}`}>` and body uses `font-family: var(--font-tajawal), system-ui, ...`.

### Type classes (helper)

- `.text-display` — `clamp(40px, 8vw, 64px) / 1.1 / weight-900`
- `.text-h1` — `clamp(32px, 6vw, 44px) / 1.2 / 700`
- `.text-h2` — `clamp(24px, 5vw, 32px) / 1.25 / 700`
- `.text-h3` — `20px / 1.35 / 600` (24px desktop)
- `.text-body` — `16px / 1.7 / 400` (17px desktop)
- `.text-small` — `13px / 1.55 / 400`
- `.text-xs` — `11px / 1.4 / 500`
- `.text-eyebrow` — `12px / 1.4 / 600 / uppercase letter-spacing 0.16em / color: var(--brand-accent)`

## 4. Components contract

### 4.1 Button

Variants: `primary` (filled brand-primary), `secondary` (outline brand-primary), `accent` (filled accent gold), `ghost` (text + underline-on-hover), `link` (no padding).

Sizes: `sm` (32 h, 12 px), `md` (44 h, 16 px), `lg` (52 h, 20 px), `xl` (60 h, 24 px).

States: idle, hover (-2% lightness), active (-4% lightness + 1px shift down), focus-visible (`outline: 2px solid var(--brand-accent); outline-offset: 2px`), disabled (opacity 0.5, cursor not-allowed), loading (left-aligned spinner replaces icon).

Width: 100% on mobile by default; `auto` desktop.

Implementation: `frontend/components/ui/Button.tsx`.

### 4.2 Input / Field

States: idle, focus (border becomes `--brand-primary`), filled, invalid (border `--error`, error text below).

For phone: `dir="ltr"` even inside the RTL page; placeholder `05XXXXXXXX`; the visible value is formatted on blur via `libphonenumber-js`.

Implementation: `frontend/components/ui/Field.tsx`.

### 4.3 Card (product card)

- Background `--bg-card`, border `--border`, radius `--radius-md`, shadow `--shadow-1`.
- Hover (desktop only): shadow upgrades to `--shadow-2`, translateY(-2px), 200ms.
- 4:5 image area on top.
- Body: title + benefit + stars + price strip + CTA.

### 4.4 Drawer (cart)

Headless via Radix `Dialog` with custom transform + Framer Motion.

### 4.5 Modal (checkout + upsell + mobile menu)

Headless via Radix `Dialog`. Backdrop `rgba(11, 11, 11, 0.42)` with `backdrop-filter: blur(4px)`. Focus-trapped. Close on ESC + backdrop click.

### 4.6 Accordion (FAQ)

Radix `Accordion`. Plus icon rotates 45° to become close. Border-bottom on each item only.

### 4.7 Carousel (reviews)

Native scroll-snap on mobile (`scroll-snap-type: x mandatory; scroll-snap-align: start;`). On desktop, two arrows snap items by one. No dependency added — pure CSS + a tiny `useRef` for arrow clicks.

### 4.8 Badge / Pill

`bg-sand text-ink rounded-pill px-3 py-1 text-xs font-medium`. Accent variant uses `bg-accent/12 text-accent-dark`.

### 4.9 Toast

Tiny utility, top-center mobile / top-right desktop. 2.4s, slides + fades. Implementation: own minimal Zustand store (`frontend/store/toast.ts`).

### 4.10 SplitSection (image+text alternating)

```tsx
<SplitSection imageSide="right" eyebrow="…" heading="…" image="/images/…">
  {body}
</SplitSection>
```

Prop API: `imageSide: 'right' | 'left'`. On mobile (< md), image is always on top and copy below regardless of `imageSide`.

### 4.11 OfferTile (PDP T1/T2/T3)

`<OfferTile tier="T3" recommended price={349} ... />`. Selected state: `--brand-primary` border, accent ribbon, scale 1.02. Clicking sets the parent state.

### 4.12 StarRating

`<StarRating value={4.9} max={5} />`. Renders 5 SVGs; partial last star via clip-path.

### 4.13 ProofStrip

A horizontal row of `{number, label}` pairs separated by 1px dividers.

### 4.14 Skeleton

Minimal: a div with `bg-sand` shimmer (linear-gradient anim, 1.4s loop). **Do not** use external skeleton libs.

## 5. RTL rules

- Set `<html dir="rtl" lang="ar">`.
- All `marginLeft/-Right` and `paddingLeft/-Right` in components must be replaced by **logical properties** (`ms-` / `me-` / `ps-` / `pe-`) or Tailwind's `start-/end-` utilities.
- All chevrons that mean "next" or "back" must flip in RTL. The AI coder uses `lucide-react`'s `ChevronLeft` for "next" in RTL (because reading goes leading-to-trailing = right-to-left). Verify directionality visually before shipping.
- The Cart Drawer slides in from the right edge of the viewport (which is the *leading* edge in RTL).
- Carousels swipe from right to left to advance to the next slide in RTL.
- Numbers and prices can stay LTR — wrap in `<bdi>` to prevent bidi reordering issues: `<bdi>199</bdi> ر.س`.

## 6. Motion language

| Where | Animation | Duration | Easing |
|---|---|---|---|
| Section reveal | `opacity 0→1, translateY 12px→0` (intersection at 0.15) | 200ms | `--ease-out` |
| Button hover | scale 1.02 | 80ms | `--ease-out` |
| Add-to-cart "pop" | scale 1.04 → 1 | 160ms | `--ease-out` |
| Cart drawer slide | translateX 100% → 0 | 320ms | `--ease-out` |
| Modal open | opacity + scale 0.98→1 | 200ms | `--ease-out` |
| Accordion expand | height auto via `framer-motion`'s `<AnimatePresence>` | 220ms | `--ease-in-out` |

All motion respects `prefers-reduced-motion: reduce` → durations become 0ms and translates become 0.

## 7. Spacing rules

- All vertical section paddings: `py-12 md:py-20 lg:py-24` (48 / 80 / 96 px).
- Container max-width: `1200px` (`max-w-[1200px] mx-auto`).
- Side gutters: `px-4 md:px-6 lg:px-8` (16 / 24 / 32).
- Section internal spacing (heading → content): `space-y-4 md:space-y-6`.

## 8. Accessibility baseline

- All interactive elements have `aria-label` or visible text.
- Focus ring is always visible on keyboard (`focus-visible`).
- Color contrast — AA minimum for body, AAA for primary CTA where possible.
- All images have meaningful `alt` text (see `19-images-and-assets.md`).
- Heading hierarchy is strict: one `h1` per page.
- The cart drawer + modals manage focus correctly: focus moves into the dialog on open and returns to the trigger on close.

## 9. Cursor / hover affordances

Buttons: `cursor-pointer` (default), `cursor-not-allowed` when disabled. Cards that link should NOT have a separate "see more" button — the whole card is clickable.

## 10. Empty / error / loading states (per component)

- Cart empty: friendly illustration (botanical SVG) + copy from `04 § J` + CTA.
- Cart error (e.g. fetch fails): inline retry button.
- PDP loading: skeleton mirrors the layout (image block + offer block).
- Form submit failure: error toast + form remains filled.

## 11. Icon set

`lucide-react` only. Allowed icons: `ShoppingBag`, `Menu`, `X`, `ChevronLeft`, `ChevronRight`, `ChevronDown`, `Check`, `Star`, `Truck`, `ShieldCheck`, `Leaf`, `Sparkles`, `Moon`, `Sun`, `Heart`, `Phone`, `Mail`, `MapPin`, `BadgeCheck`, `Plus`, `Minus`, `Loader2`.

For ingredient illustrations and badges that need brand polish, build custom inline SVG components under `frontend/components/icons/` (e.g. `<DropletIcon />`, `<SaffronSprig />`).

## 12. Don'ts

- Don't import a UI library (no MUI, no Chakra, no shadcn — too generic for this brand).
- Don't use ready-made supplement-template Tailwind UI kits.
- Don't add a lottie file.
- Don't use box-shadow with a brand color tint (keep shadows neutral).
- Don't break the alternating-image rule in long pages.
- Don't use a different font weight than the ones declared above.
