# رحيق Raheeq Arabia — Documentation Hub

> The single source of truth for building a number-one branded DTC supplement (functional gummies) store in **Saudi Arabia**, Arabic-first, COD-only, optimized for **paid social (Snap / TikTok)** traffic, max **AOV**, max **confirmation rate**, max **delivery rate**.

This folder is the **only** brief the AI coder needs. Every architectural, design, copy, marketing and ops decision is documented here. Read top-to-bottom in order before writing a single line of code.

---

## How to use this documentation

1. The AI coder **must** read every numbered doc top to bottom **before** scaffolding anything.
2. `00-START-HERE-AI-CODER-PROMPT.md` is the master prompt the founder will hand to the AI coder. It compiles every constraint and acceptance criterion in one place.
3. Numbered docs (`01` → `21`) are the deep references.
4. `templates/` contains drop-in artifacts: CSV column list for the Google Sheet, Apps Script webhook code, `.env.example` files.
5. If two documents ever conflict, the **lower-numbered** doc wins, except for `00-START-HERE-AI-CODER-PROMPT.md`, which **always** wins.

---

## Reading order

| # | File | What it locks down |
|---|------|--------------------|
| 00 | `00-START-HERE-AI-CODER-PROMPT.md` | The master prompt + acceptance criteria the AI coder must satisfy. |
| 01 | `01-project-brief.md` | Business model, goals, KPIs, scope, non-goals. |
| 02 | `02-brand-identity.md` | Brand story, logo, color tokens, typography, motion, tone. |
| 03 | `03-icp-and-positioning.md` | KSA-women ICP, pains, desires, JTBD, positioning statement, objections. |
| 04 | `04-copy-bank-arabic-ksa.md` | Production-ready KSA-dialect copy for every section, page, button and badge. |
| 05 | `05-products.md` | Full spec for the three SKUs: ingredients, dosage, science, claims, FAQs, certifications. |
| 06 | `06-offers-aov-funnel.md` | Pricing tiers, bundles, cross-sells, upsells, AOV math, COD rules. |
| 07 | `07-information-architecture.md` | Sitemap + section-by-section layout for every page (desktop + mobile). |
| 08 | `08-design-system.md` | Tokens, components, RTL rules, motion, breakpoints, accessibility. |
| 09 | `09-frontend-architecture.md` | Next.js 15 / React 19 / Tailwind v4 stack, folder structure, libraries, state, perf. |
| 10 | `10-backend-architecture.md` | FastAPI structure, modules, security, migrations-on-boot, CAPI workers. |
| 11 | `11-database-schema.md` | PostgreSQL schema for `raheeqarabia` DB + Alembic strategy. |
| 12 | `12-api-contract.md` | All HTTP endpoints with request/response shapes. |
| 13 | `13-pixels-tracking-capi.md` | Meta + TikTok + Snap (Web + CAPI), dedup, deferral, hashing rules, payloads. |
| 14 | `14-google-sheet-webhook.md` | Sheet columns + Apps Script + env wiring + retries. |
| 15 | `15-cro-trust-social-proof.md` | CRO checklist + trust stack + proof matrix + scarcity rules. |
| 16 | `16-seo-performance-accessibility.md` | Arabic SEO, schema.org, Core Web Vitals, RTL, a11y. |
| 17 | `17-coding-rules-and-conventions.md` | TypeScript / Python style, lint, commits, file naming. |
| 18 | `18-env-and-deployment.md` | All env vars, Docker, EasyPanel setup, domain wiring. |
| 19 | `19-images-and-assets.md` | Placeholder strategy, dimensions, alt-text rules, naming. |
| 20 | `20-legal-policies-shipping.md` | Shipping / returns / privacy / terms tailored to KSA + supplements. |
| 21 | `21-qa-and-launch-checklist.md` | Final go-live checklist before the founder switches DNS. |

`templates/`:

- `orders-sheet-template.csv` — header row to paste into the Google Sheet.
- `google-apps-script-webhook.js` — Apps Script the founder pastes into the Sheet's Extensions → Apps Script.
- `env.frontend.example` — copy into `frontend/.env.example`.
- `env.backend.example` — copy into `backend/.env.example`.

---

## Non-negotiable principles (read twice)

1. **Arabic-first, KSA-dialect** copy. English appears only inside the wordmark and for product science citations. `<html lang="ar" dir="rtl">`.
2. **Looks like the brand owns the product** — premium photography placeholders, lab-grade authority, certifications, founder story. Nothing on the site may hint at dropshipping.
3. **Speed is part of trust** — LCP ≤ 2.0 s on 4G mobile, CLS ≤ 0.05, INP ≤ 200 ms. Pixels are **deferred** behind user interaction or `requestIdleCallback`.
4. **Every claim is backed.** Each ingredient bullet links to a source (study, monograph, or known traditional use). See `05-products.md`.
5. **Maximize AOV.** Default selection in cart is **3 boxes (349 SAR)**. Cross-sells in the cart drawer. Post-form upsell (99 SAR) is the **only** place a discount appears.
6. **Confirmation rate is sacred.** Phone must be a valid KSA number; the input refuses anything else. Order summary is shown again right before submission.
7. **One row per order in the Google Sheet** — the operations team should be able to call without ever opening the dashboard.
8. **Pixels: dedup or die.** Every conversion event has a single `event_id` shared between Web Pixel and Server CAPI. Web pixel never blocks the main thread.
9. **No payment integration.** COD only.
10. **Zero placeholders shipped to prod.** All `lorem` and stock placeholders are caught by `21-qa-and-launch-checklist.md` before launch.

---

## Tech stack at a glance

- **Frontend** — Next.js 15 (App Router, RSC), React 19, TypeScript 5, Tailwind CSS v4, Zustand, React Hook Form + Zod, Framer Motion, Radix UI primitives, `libphonenumber-js`, `lucide-react`, `next/font` (Tajawal + Cormorant Garamond + Inter).
- **Backend** — Python 3.12, FastAPI, SQLAlchemy 2 (async), Alembic, `psycopg[binary]` (async), Pydantic v2, `httpx`, `tenacity`, `structlog`.
- **Database** — PostgreSQL (already provisioned on EasyPanel as `raheeqarabia_database`).
- **Deployment** — Docker + EasyPanel, `raheeqarabia.com` (frontend) and `api.raheeqarabia.com` (backend).
- **Ops** — Orders mirrored to Google Sheet via Apps Script webhook for the call-center team.

---

## Domain map

- `https://raheeqarabia.com` → Next.js frontend.
- `https://api.raheeqarabia.com` → FastAPI backend.
- DB internal connection (EasyPanel): `postgres://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia?sslmode=disable`.

If anything is unclear, the AI coder **must** stop and ask — never improvise on copy, pricing, payloads, or the order flow.
