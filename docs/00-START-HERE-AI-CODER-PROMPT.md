# 00 — START HERE · The Master Prompt for the AI Coder

Copy everything between the `BEGIN PROMPT` and `END PROMPT` lines below and paste it as the FIRST message to your AI coder (Cursor / Windsurf / Claude Code / Codex / etc.) in a fresh agent session at the repo root.

---

```
== BEGIN PROMPT ==

You are the engineering lead for "رحيق Raheeq Arabia" — a Saudi-Arabian, Arabic-first, DTC functional-gummy DTC store sold via paid social (Snapchat / TikTok / Meta) on a Cash-on-Delivery model.

Your job is to deliver TWO production-ready folders inside this repo:
  1) frontend/   — Next.js 15 + React 19 + TypeScript + Tailwind v4
  2) backend/    — Python 3.12 + FastAPI + SQLAlchemy 2 + Alembic + PostgreSQL

PLUS docker support, env.example files, and everything needed to deploy on EasyPanel
with these domains:
  - https://raheeqarabia.com         → Next.js frontend
  - https://api.raheeqarabia.com     → FastAPI backend

Database is already provisioned on EasyPanel as `raheeqarabia_database`.
Internal connection string (use it in the backend .env):
  postgres://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia?sslmode=disable
For SQLAlchemy 2 + psycopg 3 (async), translate that to:
  DATABASE_URL=postgresql+psycopg://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia
and pass sslmode=disable via connect_args.

============================================================
CRITICAL INSTRUCTIONS — DO NOT SKIP
============================================================

1) Before writing a single line of code, READ THE ENTIRE docs/ FOLDER, IN ORDER:
     - docs/README.md
     - docs/01-project-brief.md
     - docs/02-brand-identity.md
     - docs/03-icp-and-positioning.md
     - docs/04-copy-bank-arabic-ksa.md
     - docs/05-products.md
     - docs/06-offers-aov-funnel.md
     - docs/07-information-architecture.md
     - docs/08-design-system.md
     - docs/09-frontend-architecture.md
     - docs/10-backend-architecture.md
     - docs/11-database-schema.md
     - docs/12-api-contract.md
     - docs/13-pixels-tracking-capi.md
     - docs/14-google-sheet-webhook.md
     - docs/15-cro-trust-social-proof.md
     - docs/16-seo-performance-accessibility.md
     - docs/17-coding-rules-and-conventions.md
     - docs/18-env-and-deployment.md
     - docs/19-images-and-assets.md
     - docs/20-legal-policies-shipping.md
     - docs/21-qa-and-launch-checklist.md

   Then also read these templates:
     - docs/templates/orders-sheet-template.csv
     - docs/templates/upsell-attached-sheet-template.csv
     - docs/templates/google-apps-script-webhook.js
     - docs/templates/env.frontend.example
     - docs/templates/env.backend.example

2) Every Arabic string in the site MUST come verbatim from docs/04-copy-bank-arabic-ksa.md.
   Do NOT auto-translate, do NOT paraphrase, do NOT improvise copy. If something is
   missing, STOP and ask before guessing.

3) The "DO NOTs" lists at the end of each architecture doc are hard constraints —
   not suggestions.

4) If two docs ever conflict, the LOWER-NUMBERED doc wins, except this prompt always wins.

============================================================
WHAT YOU MUST BUILD
============================================================

A) The brand:
   - Name: رحيق (sub-line: "Raheeq Arabia").
   - Logo: ر inside a circle in Saffron Gold (#C9943F) + Arabic wordmark in Tajawal
     Bold + romanized sub-line in Cormorant Garamond italic.
     See docs/02-brand-identity.md § 3 for exact lockup.
   - Colors: Emerald primary (#0E4F3A), Saffron accent (#C9943F),
     Ivory background (#FBF7F0). Full tokens in docs/08-design-system.md.
   - Typography: Tajawal (Arabic), Cormorant Garamond (display), Inter (Latin UI),
     all via next/font/google.

B) Pages (Arabic-first, dir="rtl"):
   - /                  Home
   - /collection        Collection page (3 SKUs)
   - /p/habba-jathr     PDP / landing — حبّة جذر  (Hair gummy)
   - /p/habba-layali    PDP / landing — حبّة ليالي (Sleep gummy)
   - /p/habba-noura     PDP / landing — حبّة نورة  (Beauty gummy)
   - /about             About / Founder story
   - /contact           Contact
   - /thank-you?id=…    Order confirmation
   - /legal/shipping    Shipping policy
   - /legal/returns     Returns policy
   - /legal/privacy     Privacy policy
   - /legal/terms       Terms of service
   - Custom 404 + 500.

   Section-by-section structure (alternating image-right / image-left layouts on long
   pages) is fully specified in docs/07-information-architecture.md.

C) The 3 SKUs — full ingredient lists, science citations, stock labels, badges,
   curated reviews, FAQs — are locked in docs/05-products.md.

D) Pricing (LOCKED, no coupon system, no discount fields anywhere):
   - 1 box  = 199 SAR
   - 2 boxes = 279 SAR
   - 3 boxes = 349 SAR (default-selected on every PDP, labelled "Glow Kit (الأنصح)")
   The ONLY discount on the entire site is the post-checkout one-time upsell:
   another SKU at 99 SAR shown for 15 seconds AFTER the form is submitted.

E) Funnel (end-to-end):
   PDP/landing
     → Add to Cart (defaults T3 Glow Kit, 349 SAR)
     → Cart Drawer slides in from the right (RTL leading edge), shows cross-sells
       (the OTHER two SKUs)
     → "أكملي الطلب" CTA opens Checkout Modal
     → Order summary + scarcity micro-line + two fields ONLY:
         • Full name
         • KSA phone number (LIVE-validated; only accepts valid SA numbers)
     → Submit → POST /api/orders with Idempotency-Key header
     → On 201, open Upsell Modal (15-second countdown), the OTHER SKU at 99 SAR
       (mapping in docs/05-products.md § 6)
         • Accept → PATCH /api/orders/{id}/upsell → redirect to /thank-you
         • Decline or timeout → redirect to /thank-you
     → Thank-you page (no second checkout). Suggested SKUs strip.

   Cash on Delivery only. NO payment gateway. NO address collected on the site —
   address is captured BY PHONE by the call-center after lead capture
   (this is intentional; it lifts form-submission rate).

F) Orders flow:
   - Persisted in Postgres (full schema in docs/11-database-schema.md).
   - Mirrored to a Google Sheet via the Apps Script webhook in
     docs/templates/google-apps-script-webhook.js. The founder will paste it into
     their Sheet's Extensions → Apps Script, deploy as a Web App, copy the URL into
     SHEET_WEBHOOK_URL (backend env), and put a matching SHEET_WEBHOOK_SECRET in
     both Script Properties and backend env. Webhook payload shapes, sheet columns,
     and retries are in docs/14-google-sheet-webhook.md.

G) Pixels — Meta / TikTok / Snapchat:
   - WEB PIXELS: load DEFERRED — never in <head>. Lazy-loaded after first user
     interaction (scroll/pointerdown/keydown) OR window 'load' OR requestIdleCallback,
     whichever fires first. NO main-thread blocking.
   - CAPI (server-side) fan-out from the backend's /api/track endpoint AND from the
     order-creation path.
   - DEDUP via a shared event_id (UUID v4):
       • Meta: pass `eventID` to fbq AND `event_id` to CAPI.
       • TikTok: pass `event_id` to ttq AND CAPI.
       • Snapchat: pass `client_dedup_id` to snaptr AND `event_id` to CAPI.
   - HASHING (server side only — SHA-256 lowercase hex):
       • Meta phone   = digits only, country code, NO `+`  (e.g. "9665XXXXXXXX")
       • TikTok phone = E.164 WITH leading `+`              (e.g. "+9665XXXXXXXX")
       • Snap phone   = digits only, country code, NO `+`  (e.g. "9665XXXXXXXX")
     Web pixels DO NOT pre-hash (advanced matching is hashed by the platform).
     Never hash fbp/fbc/ttp/ttclid/sc_click_id/IP/UA.
   - Test event codes are passed via env vars during QA, then UNSET in prod.

   The full payload shapes for every event (PageView, ViewContent, AddToCart,
   InitiateCheckout, Purchase, Upsell as a 99-SAR Purchase) are in
   docs/13-pixels-tracking-capi.md — copy them verbatim into the implementation.

H) Stack (LOCKED — versions in docs/09 and docs/10):
   Frontend: Next.js 15 (App Router, RSC, output: 'standalone'), React 19,
             TypeScript 5 strict, Tailwind v4, Radix UI primitives,
             Framer Motion, Zustand, React Hook Form + Zod,
             libphonenumber-js (max build), lucide-react,
             next/font/google (Tajawal + Cormorant Garamond + Inter),
             clsx + tailwind-merge.
   Backend:  Python 3.12, FastAPI, Uvicorn + Gunicorn, SQLAlchemy 2 async,
             psycopg 3 (binary), Alembic, Pydantic v2 + pydantic-settings,
             httpx async, tenacity, structlog, phonenumbers, itsdangerous.

I) Migrations run automatically on backend container start via docker-entrypoint.sh
   which waits for the DB then runs `alembic upgrade head` before launching gunicorn.

J) Deliverables (folder layouts in docs/09 § 2 and docs/10 § 2):
   frontend/  with Dockerfile, .env.example, next.config.ts (output:'standalone'),
              package.json, tsconfig.json, tailwind.config.ts, eslint.config.mjs,
              prettier.config.mjs, postcss.config.mjs, README.md, full app/
              components/ data/ lib/ store/ public/ tests/.
   backend/   with Dockerfile, docker-entrypoint.sh, .env.example,
              alembic.ini, app/alembic/{env.py, versions/0001_initial_schema.py,
              versions/0002_seed_catalog.py}, app/* (config, db, models, routers,
              schemas, services, utils), requirements.txt, pyproject.toml,
              tests/, README.md.
   docker-compose.yml at repo root (dev only).
   docs/ is already authored — DO NOT EDIT IT unless you find a real bug; if so,
   propose a doc patch in the same diff and explain WHY.

============================================================
ACCEPTANCE CRITERIA (run docs/21-qa-and-launch-checklist.md end-to-end)
============================================================

The build is "done" when every checkbox in docs/21-qa-and-launch-checklist.md is
green, including:
  - 3 test orders placed end-to-end with founder's phone, each producing a row in
    Postgres + a row in the Google Sheet + a Purchase event in Meta/TikTok/Snap
    with dedup status Browser+Server.
  - LCP ≤ 2.0s mobile 4G; CLS ≤ 0.05; INP ≤ 200ms on the home and PDP routes.
  - No third-party pixel script in <head> on first paint.
  - Apps Script webhook deployed and tested.
  - All Arabic copy matches docs/04 verbatim.

============================================================
HOW TO WORK
============================================================

1) Confirm you have read every doc by replying with a short summary of the funnel
   + the locked pricing + the pixel dedup strategy, IN YOUR OWN WORDS. If you missed
   anything, re-read.

2) Scaffold the two folders. Start with the backend so the frontend can call real
   endpoints during development. Run migrations + seed; verify
   `GET /api/products` returns the 3 SKUs in the documented shape.

3) Build the frontend top-down: design system + Logo + Header/Footer first, then
   Home, Collection, then PDP (the most important page), then About / Contact /
   Legal / Thank-you, then the Cart Drawer, Checkout Modal, Upsell Modal.

4) Wire the pixel deferred-loader and CAPI fan-out LAST, after the funnel works
   without analytics. Verify dedup in the platform test event tools.

5) Deliver docker-compose up working locally end-to-end before any EasyPanel push.

6) Open ONE pull request titled "Initial implementation per docs/" with a checklist
   that mirrors docs/21. Tick every box before saying "ready to review".

If at any point a requirement in docs/ is ambiguous, STOP and ask the founder.
Never improvise on copy, pricing, payloads, or the order flow.

== END PROMPT ==
```

---

After pasting that prompt, the AI coder will work autonomously through the entire build. If you (the founder) need to nudge them, say:

- "Pull request the backend scaffold first — I want to verify `GET /api/products` returns the 3 SKUs before you start the frontend."
- "Show me the cart-drawer component and the checkout modal as static screenshots before wiring the order POST."
- "Run docs/21 checklist on staging and report which boxes aren't green yet."

Anything else — push back to the docs.
