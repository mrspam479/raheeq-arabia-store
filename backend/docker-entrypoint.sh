#!/bin/sh
set -e

# ── Wait for Postgres (max 30 s) ─────────────────────────────────────────────
echo "[startup] waiting for database..."
python - <<'PYEOF'
import os, time, socket

url  = os.environ.get("DATABASE_URL", "")
host = "raheeqarabia_database"
port = 5432

if "@" in url:
    try:
        rest = url.split("@", 1)[1].split("/")[0]
        if ":" in rest:
            host, p = rest.split(":", 1)
            port = int(p)
        else:
            host = rest
    except Exception:
        pass

deadline = time.time() + 30
ok = False
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=2):
            print("[startup] database is reachable")
            ok = True
            break
    except OSError:
        print("[startup] database not ready, retrying...")
        time.sleep(2)

if not ok:
    print("[startup] database unreachable after 30s, continuing anyway")
PYEOF

# ── Run migrations ────────────────────────────────────────────────────────────
echo "[startup] running alembic migrations..."
alembic upgrade head 2>&1 || echo "[startup] migration failed, continuing anyway..."

# ── Start application ─────────────────────────────────────────────────────────
APP_PORT="${PORT:-8000}"
echo "[startup] starting gunicorn on 0.0.0.0:${APP_PORT}"

exec gunicorn app.main:app \
    --workers=2 \
    --worker-class=uvicorn.workers.UvicornWorker \
    --bind="0.0.0.0:${APP_PORT}" \
    --timeout=120 \
    --graceful-timeout=30 \
    --access-logfile=- \
    --error-logfile=-
