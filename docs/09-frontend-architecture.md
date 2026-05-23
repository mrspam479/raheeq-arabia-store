# 09 — Frontend Architecture

The complete frontend contract. Stack, folder layout, libraries, state, performance budgets, SEO conventions, and code-quality rules.

## 1. Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC, Turbopack dev) | RSC keeps client JS small; native i18n + RTL support; great deploy story. |
| Language | **TypeScript 5** strict | Catches the entire class of bugs we cannot afford in a checkout. |
| UI runtime | **React 19** | Aligns with Next 15 RC defaults. |
| Styling | **Tailwind CSS v4** | Already a brand-decision token system; v4 is faster and ergonomically cleaner. |
| Headless UI primitives | **Radix UI** (`@radix-ui/react-dialog`, `…-accordion`, `…-tabs`, `…-tooltip`) | Accessible, unopinionated, RTL-friendly. |
| Animations | **Framer Motion 11** | Modal & reveal animations only; respects `prefers-reduced-motion`. |
| State | **Zustand** | Tiny, no boilerplate; one store for cart, one for toast, one for UI. |
| Forms | **React Hook Form** + **Zod** | Native KSA phone validation via Zod refinement using `libphonenumber-js`. |
| Phone validation | **libphonenumber-js** (`max` build) | Smaller than `libphonenumber-js` full; KSA is supported. |
| Fonts | **next/font/google** with Tajawal + Cormorant Garamond + Inter | Zero layout shift, no CDN dep. |
| Icons | **lucide-react** | Strict subset listed in `08-design-system.md § 11`. |
| Class helpers | **clsx** + **tailwind-merge** | One `cn()` utility. |
| Carbon-free analytics (internal) | **Custom event bus** (`frontend/lib/analytics`) | Sends to pixels & a backend `/api/track` for CAPI dedup. |
| Linting | **ESLint 9** flat config + **@typescript-eslint** + **eslint-plugin-tailwindcss** | Enforces the rules in `17-coding-rules-and-conventions.md`. |
| Formatting | **Prettier 3** + `prettier-plugin-tailwindcss` | Imports first, then Tailwind sorted. |
| Tests | **Vitest** + **@testing-library/react** + **Playwright** | Vitest for unit, Playwright for e2e (cart → upsell → thank-you). |

### Versions to pin

```
next: ^15.0.0
react: ^19.0.0
react-dom: ^19.0.0
typescript: ^5.5.0
tailwindcss: ^4.0.0
zustand: ^5.0.0
@radix-ui/react-dialog: ^1.1.0
@radix-ui/react-accordion: ^1.2.0
framer-motion: ^11.5.0
react-hook-form: ^7.53.0
zod: ^3.23.0
libphonenumber-js: ^1.11.0
lucide-react: ^0.460.0
clsx: ^2.1.0
tailwind-merge: ^2.5.0
```

The AI coder runs `npm i` with the **latest** of each within these majors. Lockfile is committed.

## 2. Folder structure

```
frontend/
├── app/
│   ├── (legal)/
│   │   ├── shipping/page.tsx
│   │   ├── returns/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (marketing)/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── collection/page.tsx
│   │   └── thank-you/page.tsx
│   ├── p/
│   │   └── [slug]/page.tsx          # PDP / landing
│   ├── api/                          # Edge proxies only (NO business logic)
│   │   ├── track/route.ts            # forwards to FastAPI /track
│   │   └── orders/
│   │       └── route.ts              # forwards to FastAPI /orders (server-only headers)
│   ├── layout.tsx
│   ├── page.tsx                      # Home
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── opengraph-image.png
│   └── icon.png
│
├── components/
│   ├── ui/                           # Button, Field, Card, Badge, Modal, Drawer, Accordion, etc.
│   ├── layout/                       # Header, Footer, AnnouncementBar, MobileMenu
│   ├── product/                      # OfferTile, ProductCard, ProductGallery, StickyPdpBar
│   ├── cart/                         # CartDrawer, CartLine, CrossSellList
│   ├── checkout/                     # CheckoutModal, PhoneField, NameField
│   ├── upsell/                       # UpsellModal, CountdownBar
│   ├── reviews/                      # ReviewCard, ReviewsCarousel
│   ├── home/                         # Hero, Why3Cols, RitualSection, ProofBar, FounderNote, ClosingCta
│   ├── icons/                        # Custom inline SVG brand icons
│   └── seo/                          # JsonLd, MetaProduct, MetaPage
│
├── data/                             # Curated, static content (mirrors backend seed)
│   ├── products.ts                   # Type-safe product catalog (built from 05-products.md)
│   ├── reviews.ts                    # Curated reviews from 04 § C
│   ├── faqs.ts
│   └── copy.ts                       # Centralized AR strings from 04
│
├── lib/
│   ├── tokens.ts                     # Re-exports CSS-var tokens for JS
│   ├── cn.ts                         # clsx + tailwind-merge
│   ├── phone.ts                      # KSA validators, normalize for CAPI
│   ├── price.ts                      # SAR formatting + helpers
│   ├── analytics/
│   │   ├── index.ts                  # facade: trackPageView, trackAddToCart, trackPurchase, etc.
│   │   ├── meta.ts                   # web pixel (deferred loader)
│   │   ├── tiktok.ts
│   │   ├── snap.ts
│   │   └── ids.ts                    # event_id generator (UUID v4) + storage
│   ├── api.ts                        # Typed client to backend
│   └── seo.ts
│
├── store/
│   ├── cart.ts                       # Zustand: lines[], add(), remove(), upgrade(), downgrade()
│   ├── ui.ts                         # drawer open, modal open, mobile menu
│   └── toast.ts
│
├── public/
│   ├── images/                       # Hero + lifestyle placeholders
│   │   ├── home/
│   │   ├── about/
│   │   ├── collection/
│   │   └── products/
│   │       ├── habba-jathr/
│   │       ├── habba-layali/
│   │       └── habba-noura/
│   ├── icons/                        # Static SVGs (favicon variants, badges)
│   └── badges/                       # Static badge PNGs (GMP, Halal, Lab)
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── prettier.config.mjs
├── postcss.config.mjs
├── package.json
└── README.md
```

## 3. Cart store (Zustand) — contract

```ts
// store/cart.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartLine } from '@/lib/types';

type State = {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (idx: number) => void;
  setOfferTier: (idx: number, tier: 'T1' | 'T2' | 'T3') => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) =>
        set((s) => {
          const existing = s.lines.findIndex(
            (l) => l.sku === line.sku && l.offerCode === line.offerCode,
          );
          if (existing >= 0) return s; // do not duplicate same offer
          return { lines: [...s.lines, line] };
        }),
      removeLine: (idx) => set((s) => ({ lines: s.lines.filter((_, i) => i !== idx) })),
      setOfferTier: (idx, tier) => set((s) => ({
        lines: s.lines.map((l, i) => i === idx ? recomputeLineForTier(l, tier) : l),
      })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.unitPrice, 0),
      count: () => get().lines.length,
    }),
    { name: 'raheeq.cart.v1', storage: createJSONStorage(() => localStorage) },
  ),
);
```

`recomputeLineForTier` is a pure helper in `lib/price.ts` mapping `(sku, tier)` → `{unitPrice, quantity, offerLabelAr}`.

## 4. Routing & data fetching

- **All marketing pages are RSC** (server components). They can read static product data from `data/products.ts` (mirror of backend seed) **or** fetch from FastAPI (`/api/products`) — choose static for v1 to remove a network hop on first paint.
- The **PDP** is RSC for the static block (gallery, copy, JSON-LD) + a small client island for `OfferTile + AddToCart` (which needs the Zustand store).
- The Cart Drawer is **always client** and mounted at the root layout.
- API proxies in `app/api/*` exist only because some browsers strip `Referer` for cross-origin POSTs; the proxy keeps the `Origin` clean and lets us inject the backend `X-API-Key` server-side.

## 5. Performance budgets

| Metric | Budget |
|---|---|
| First Load JS (per route, shared+page) | ≤ 130 KB gzipped |
| Per-route extra JS (excluding shared) | ≤ 50 KB gzipped |
| LCP (mobile 4G) | ≤ 2.0 s |
| TTFB | ≤ 400 ms |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |

Tactics:

- **No third-party scripts in `<head>`.** Every pixel is loaded via the deferred loader (`13-pixels-tracking-capi.md § Deferral`).
- All `<Image>` uses `next/image` with explicit `width` / `height` (no CLS).
- Hero image is `priority`, others `loading="lazy"`.
- Fonts loaded via `next/font` with `display: swap` + `preload: true`.
- Reviews carousel does not import any JS lib (pure CSS scroll-snap).
- `framer-motion` is dynamically imported with `next/dynamic` from the few sections that use it (cart drawer, modals).
- No client-side data fetching on static pages.
- The Cart Drawer uses `vaul`-style mounting (Radix Dialog) and is only loaded when first toggled — wrap with `next/dynamic({ ssr: false })`.

## 6. SEO

- `lang="ar" dir="rtl"` on `<html>`.
- Each page exports `generateMetadata`:
  ```ts
  export const metadata = {
    title: '…',
    description: '…',
    alternates: { canonical: 'https://raheeqarabia.com/p/habba-jathr' },
    openGraph: { … },
    twitter: { card: 'summary_large_image' },
  } satisfies Metadata;
  ```
- PDP injects `<script type="application/ld+json">` with `Product` schema (see `05-products.md § 7`).
- Organization JSON-LD lives once in the root layout.
- `/sitemap.xml` generated by Next.js (`app/sitemap.ts`).
- `/robots.txt` allows all crawlers (`app/robots.ts`).
- `og-image` per product page generated statically into `public/og/{slug}.jpg` (the AI coder ships a placeholder; we replace with real renders later).

## 7. Internationalization

We are **single-locale** Arabic — no `next-intl` for v1. All strings live in `data/copy.ts`. The file's structure mirrors `04-copy-bank-arabic-ksa.md`. This makes future English/Khaleeji-dialect-specific tweaks a single-file edit.

## 8. Analytics façade

`frontend/lib/analytics/index.ts` exposes:

```ts
export type Identity = { phone?: string; firstName?: string };
export type LineItem = { sku: string; name: string; price: number; qty: number; offer: string };

export function trackPageView(path: string): void;
export function trackViewContent(sku: string): void;
export function trackAddToCart(line: LineItem): void;
export function trackInitiateCheckout(items: LineItem[], total: number): void;
export function trackPurchase(orderId: string, items: LineItem[], total: number, identity?: Identity): void;
export function trackUpsellAccept(orderId: string, sku: string, price: number): void;
```

Inside, the façade:

1. Generates / reads an `event_id` per logical event (stable across re-tries within 60s).
2. Calls the three web pixels (Meta `fbq`, TikTok `ttq`, Snap `snaptr`) with the **same** `event_id`.
3. POSTs `/api/track` with the same `event_id` so the backend can fan-out CAPI server-side without exposing IDs in the client bundle.

Details + payload shapes live in `13-pixels-tracking-capi.md`.

## 9. Error boundaries

- Root `app/error.tsx` — friendly Arabic copy from `04 § N`, "حاولي مرة ثانية" CTA.
- Each marketing route has a local `error.tsx` with the same look.
- `app/not-found.tsx` for 404s.

## 10. Image strategy

- All marketing images use `next/image` with sized `<Image fill priority sizes="…" />` for hero; sized explicitly for cards.
- Placeholder strategy: see `19-images-and-assets.md`.
- All `<Image src=...>` paths are stored in `data/products.ts` so swapping real product photography later is one file change.

## 11. Forms

- All forms use React Hook Form + Zod resolver.
- The checkout schema:

```ts
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'الرجاء كتابة اسمكِ.').max(80),
  phone: z.string()
    .transform((v) => v.replace(/\s|-/g, ''))
    .refine((v) => isValidKsaPhone(v), 'الرجاء إدخال رقم سعودي صحيح يبدأ بـ 05 أو +966.'),
  honeypot: z.string().max(0).optional(),
  idempotencyKey: z.string().uuid(),
});
```

- `isValidKsaPhone` calls `parsePhoneNumberFromString(v, 'SA')` and checks `.isValid()` and `.country === 'SA'`.

## 12. Testing strategy

- Unit (Vitest):
  - `lib/phone.ts` — KSA validator + normalizers for each pixel.
  - `lib/price.ts` — tier helpers.
  - `store/cart.ts` — add/remove/upgrade tiers.
- E2E (Playwright):
  - Land on `/p/habba-jathr` → click `أضيفي إلى السلّة` → cart drawer opens with Glow Kit → `أكملي الطلب` → modal → enter `0501234567` → submit → Upsell modal → accept → Thank-you page.
- Visual regression is **not** automated for v1.

## 13. Backend contract

The frontend never calls the public internet beyond the three pixel CDNs (which are deferred). All other calls go to:

```
https://api.raheeqarabia.com
```

(In dev: `http://localhost:8000`.)

Frontend env var: `NEXT_PUBLIC_API_BASE_URL` and a server-only `BACKEND_API_KEY` injected into the `app/api/*` proxy routes.

## 14. Build & run

```bash
# install
npm ci

# dev
npm run dev          # next dev --turbo, port 3000

# build
npm run build
npm start            # next start, port 3000

# lint / test
npm run lint
npm run typecheck
npm run test
npm run e2e
```

## 15. Don'ts

- Don't import any UI kit beyond Radix primitives.
- Don't use SWR / React Query for v1 (everything is RSC or local state).
- Don't add a state-management library other than Zustand.
- Don't write CSS modules; Tailwind only (+ `globals.css` for tokens).
- Don't put pixel IDs in the bundle as constants — always read from env at runtime.
