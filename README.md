# رحيق Raheeq Arabia — Frontend

Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS v4 · Arabic-first RTL

## Quick start

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL and pixel IDs
npm install
npm run dev
# → http://localhost:3000
```

## Tech stack

| Layer | Package |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand 5 (cart + UI) |
| Forms | React Hook Form + Zod |
| Fonts | Tajawal · Cormorant Garamond · Inter (next/font/google) |
| Phone | libphonenumber-js (KSA validation) |
| Pixels | Meta · TikTok · Snapchat (deferred, post-interaction) |

## Directory structure

```
frontend/
├── app/                    # Next.js App Router pages + API routes
│   ├── layout.tsx          # Root layout (fonts, chrome, global modals)
│   ├── page.tsx            # Home page
│   ├── collection/         # /collection
│   ├── p/[slug]/           # PDP pages (habba-jathr, habba-layali, habba-noura)
│   ├── about/
│   ├── contact/
│   ├── thank-you/
│   ├── legal/[policy]/
│   └── api/track/          # Server-side CAPI proxy
├── components/
│   ├── brand/              # Logo, JsonLd
│   ├── cart/               # CartDrawer
│   ├── checkout/           # CheckoutModal, UpsellModal
│   ├── layout/             # Header, Footer, AnnouncementBar, CookieBanner
│   ├── providers/          # PixelLoader (deferred)
│   └── ui/                 # Button, Input, Badge, StarRating, Toast, Skeleton
├── data/                   # Static content (mirrors backend seed)
│   ├── copy.ts             # All Arabic strings — verbatim from docs/04
│   ├── products.ts         # Product catalog
│   ├── reviews.ts          # Global reviews
│   └── faqs.ts             # Global FAQs
├── lib/
│   ├── analytics.ts        # Pixel façade + CAPI proxy
│   ├── api.ts              # Backend fetch helpers
│   ├── cn.ts               # clsx + tailwind-merge
│   ├── phone.ts            # KSA phone validation
│   ├── price.ts            # Tier pricing helpers
│   └── types.ts            # TypeScript interfaces
└── store/
    ├── cart.ts             # Zustand cart store
    └── ui.ts               # Zustand UI store (cookie banner, etc.)
```

## Environment variables

See `.env.example` for all required variables.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL (browser-visible) |
| `BACKEND_URL` | ✅ | Backend URL (server-side only, for /api/track proxy) |
| `BACKEND_API_KEY` | ✅ | Shared secret with backend |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⬜ | Meta Pixel ID |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | ⬜ | TikTok Pixel ID |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | ⬜ | Snapchat Pixel ID |

## Commands

```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run typecheck   # TypeScript check
npm run test        # Unit tests (Vitest)
npm run e2e         # E2E tests (Playwright)
```

## Docker

```bash
# From repo root
docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

## Pixel strategy

Web pixels (Meta, TikTok, Snap) are **never injected in `<head>`** on first paint.  
The `PixelLoader` component waits for the first user interaction (scroll, click, keydown) or an idle callback (3 s timeout) before injecting the pixel scripts.

Every event uses a shared `event_id` (UUID v4) sent to both the web pixel and the backend CAPI to enable deduplication (`Browser + Server` in platform event manager).

## Pricing (locked — do not modify)

| Tier | Quantity | Price |
|---|---|---|
| T1 | 1 box | 199 SAR |
| T2 | 2 boxes | 279 SAR |
| T3 | 3 boxes (Glow Kit) | 349 SAR |

T3 is always pre-selected. No coupon codes, no strike-through pricing, no discount fields.

## Deployment (EasyPanel)

1. Push to `main`
2. EasyPanel builds from `frontend/Dockerfile`
3. Set all env vars in EasyPanel dashboard
4. Domain: `raheeqarabia.com` → port 3000
