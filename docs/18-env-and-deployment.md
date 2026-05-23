# 18 — Environment Variables, Docker & EasyPanel Deployment

## 1. Env vars at a glance

The canonical lists live in `docs/templates/env.frontend.example` and `docs/templates/env.backend.example`. The AI coder copies them into `frontend/.env.example` and `backend/.env.example` at scaffold time.

### Frontend (`frontend/.env.example`)

```
NEXT_PUBLIC_API_BASE_URL=https://api.raheeqarabia.com
NEXT_PUBLIC_SITE_URL=https://raheeqarabia.com
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_CODE=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_SOCIAL_SNAP=
NEXT_PUBLIC_SOCIAL_TIKTOK=
NEXT_PUBLIC_SOCIAL_IG=
NEXT_PUBLIC_CONTACT_FORM_ENABLED=false
NEXT_PUBLIC_SFDA_BADGE_ENABLED=false
BACKEND_API_KEY=
ALLOW_DEV_TRACKING=false
```

### Backend (`backend/.env.example`)

```
APP_ENV=production
LOG_LEVEL=INFO
DATABASE_URL=postgresql+psycopg://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia
SECRET_KEY=
BACKEND_API_KEY=
ALLOWED_ORIGINS=https://raheeqarabia.com,http://localhost:3000
PROXY_TRUST_HOPS=1
SHEET_WEBHOOK_URL=
SHEET_WEBHOOK_SECRET=
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=
SNAP_TEST_EVENT_CODE=
SFDA_BADGE_ENABLED=false
```

## 2. Generating strong secrets

```
# 32-byte URL-safe base64 string (use for SECRET_KEY, BACKEND_API_KEY, SHEET_WEBHOOK_SECRET)
python -c "import secrets; print(secrets.token_urlsafe(32))"
# or
openssl rand -base64 32
```

## 3. Frontend Dockerfile

`frontend/Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1.7

# ---- base image ----
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ---- build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_CODE
ARG NEXT_PUBLIC_SNAP_PIXEL_ID
ARG NEXT_PUBLIC_SOCIAL_SNAP
ARG NEXT_PUBLIC_SOCIAL_TIKTOK
ARG NEXT_PUBLIC_SOCIAL_IG
ARG NEXT_PUBLIC_CONTACT_FORM_ENABLED
ARG NEXT_PUBLIC_SFDA_BADGE_ENABLED
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_TIKTOK_PIXEL_CODE=$NEXT_PUBLIC_TIKTOK_PIXEL_CODE \
    NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID \
    NEXT_PUBLIC_SOCIAL_SNAP=$NEXT_PUBLIC_SOCIAL_SNAP \
    NEXT_PUBLIC_SOCIAL_TIKTOK=$NEXT_PUBLIC_SOCIAL_TIKTOK \
    NEXT_PUBLIC_SOCIAL_IG=$NEXT_PUBLIC_SOCIAL_IG \
    NEXT_PUBLIC_CONTACT_FORM_ENABLED=$NEXT_PUBLIC_CONTACT_FORM_ENABLED \
    NEXT_PUBLIC_SFDA_BADGE_ENABLED=$NEXT_PUBLIC_SFDA_BADGE_ENABLED
RUN npm run build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

`frontend/next.config.ts` must set `output: 'standalone'`.

## 4. Backend Dockerfile

`backend/Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

# system deps for psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# non-root
RUN groupadd --system app && useradd --system --gid app --create-home app
RUN chmod +x ./docker-entrypoint.sh
USER app

ENV PORT=8000
EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["gunicorn", "app.main:app", \
     "--workers=2", \
     "--worker-class=uvicorn.workers.UvicornWorker", \
     "--bind=0.0.0.0:8000", \
     "--timeout=60", \
     "--access-logfile=-", "--error-logfile=-"]
```

`backend/docker-entrypoint.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Wait for the DB (up to 60s)
python - <<'PY'
import os, time, socket
url = os.environ.get("DATABASE_URL","")
host = "raheeqarabia_database"; port = 5432
if "@" in url and "/" in url:
    try:
        rest = url.split("@",1)[1]
        hp = rest.split("/",1)[0]
        if ":" in hp:
            host, p = hp.split(":",1); port = int(p)
        else:
            host = hp
    except Exception:
        pass
deadline = time.time() + 60
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=2):
            print("[entrypoint] DB reachable")
            break
    except OSError:
        print(f"[entrypoint] waiting for DB {host}:{port}")
        time.sleep(2)
else:
    print("[entrypoint] DB not reachable; continuing anyway")
PY

# Run Alembic migrations
echo "[entrypoint] alembic upgrade head"
alembic upgrade head

# Start the app
exec "$@"
```

## 5. `docker-compose.yml` (dev only — optional)

`docker-compose.yml` at repo root (for local end-to-end testing):

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: raheeqarabia
      POSTGRES_USER: raheeqarabia
      POSTGRES_PASSWORD: raheeqarabia
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  backend:
    build: ./backend
    env_file: ./backend/.env
    environment:
      DATABASE_URL: postgresql+psycopg://raheeqarabia:raheeqarabia@db:5432/raheeqarabia
    depends_on: [db]
    ports: ["8000:8000"]

  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_BASE_URL: http://localhost:8000
        NEXT_PUBLIC_SITE_URL: http://localhost:3000
    env_file: ./frontend/.env.local
    depends_on: [backend]
    ports: ["3000:3000"]

volumes:
  pgdata:
```

## 6. EasyPanel deployment

The founder has EasyPanel + Postgres already running. Follow:

### 6.1 Backend service

1. EasyPanel → **Create service → App from GitHub**.
2. Repo: the project repo. Path: `backend`.
3. Build: Dockerfile (`backend/Dockerfile`).
4. Domain: `api.raheeqarabia.com`. EasyPanel manages HTTPS via Let's Encrypt.
5. Port: `8000`.
6. **Environment variables**: paste from `backend/.env` (no secrets in repo).
7. Health check: HTTP GET `/health` every 30 s.
8. After deploy: visit `https://api.raheeqarabia.com/health` → expect `{ok}`.
9. Visit `https://api.raheeqarabia.com/api/products` → expect 3 SKUs (seed migration ran).

### 6.2 Frontend service

1. EasyPanel → **Create service → App from GitHub**.
2. Path: `frontend`.
3. Build: Dockerfile.
4. **Build args** (Next.js needs them at build time, not run time): inject every `NEXT_PUBLIC_*` var (EasyPanel's build args form).
5. **Runtime env**: also inject `BACKEND_API_KEY`.
6. Domain: `raheeqarabia.com` + `www.raheeqarabia.com` (alias).
7. Port: `3000`.
8. Health check: HTTP GET `/` every 60 s.
9. After deploy: visit the homepage, then `/p/habba-jathr`.

### 6.3 DNS

- `A` record `raheeqarabia.com` → EasyPanel server IP.
- `A` record `api.raheeqarabia.com` → EasyPanel server IP.
- `CNAME` `www` → `raheeqarabia.com`.
- TTL 300 for the first 24h to ease changes.

### 6.4 First deploy order

1. Backend first. Verify `/health` + `/api/products`.
2. Set `NEXT_PUBLIC_API_BASE_URL=https://api.raheeqarabia.com` in the frontend build args.
3. Deploy frontend.
4. Smoke test: home → PDP → add to cart → checkout modal (do not submit a real order yet) → verify form validation.
5. Switch to `APP_ENV=production` on the backend, remove `META_TEST_EVENT_CODE`, `TIKTOK_TEST_EVENT_CODE`, `SNAP_TEST_EVENT_CODE`.

### 6.5 Logs

- EasyPanel → service → Logs tab.
- For deeper inspection, the AI coder can `ssh` into the host (founder-controlled), `docker logs -f <container>`.

### 6.6 Backups

- EasyPanel → Postgres → Backups → enable daily backups (7-day retention).
- Recommended: take a snapshot **before** any schema migration.

## 7. Domains & TLS

- Both `raheeqarabia.com` and `api.raheeqarabia.com` get auto-issued certs via Let's Encrypt in EasyPanel.
- Force HTTPS — EasyPanel handles redirects automatically.

## 8. Health & uptime

For v1, we rely on EasyPanel's built-in health checks. The founder can optionally add UptimeRobot on the two endpoints (`/` and `/api/health`) — out of repo scope.

## 9. Rollback

EasyPanel keeps previous container images. The founder can roll back via the UI to the previous tag.

## 10. Local development

### Frontend

```bash
cd frontend
cp ../docs/templates/env.frontend.example .env.local
npm i
npm run dev
```

### Backend

```bash
cd backend
cp ../docs/templates/env.backend.example .env
python -m venv .venv && source .venv/bin/activate  # or PowerShell equivalent
pip install -r requirements.txt
# Either start the docker-compose db or point DATABASE_URL at your local postgres
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
