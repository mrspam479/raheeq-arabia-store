#!/usr/bin/env bash
# Strict mode but NOT -u (unset vars tolerated) and NOT pipefail on the alembic block
set -eo pipefail

# ── 1. Wait for Postgres (up to 60 s) ──────────────────────────────────────
python - <<'PY'
import os, time, socket
url = os.environ.get("DATABASE_URL", "")
host = "raheeqarabia_database"
port = 5432
if "@" in url and "/" in url:
    try:
        rest = url.split("@", 1)[1]
        hp   = rest.split("/", 1)[0]
        if ":" in hp:
            host, p = hp.split(":", 1)
            port = int(p)
        else:
            host = hp
    except Exception:
        pass

deadline = time.time() + 60
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"[entrypoint] DB reachable at {host}:{port}")
            break
    except OSError:
        print(f"[entrypoint] waiting for DB {host}:{port} …")
        time.sleep(2)
else:
    print(f"[entrypoint] DB not reachable after 60 s — continuing anyway")
PY

# ── 2. Run migrations (non-fatal) ──────────────────────────────────────────
echo "[entrypoint] running alembic upgrade head"
alembic upgrade head || echo "[entrypoint] WARNING: alembic failed — app will start anyway"

# ── 3. Start gunicorn on ${PORT} ───────────────────────────────────────────
BIND_PORT="${PORT:-8000}"
echo "[entrypoint] starting gunicorn on 0.0.0.0:${BIND_PORT}"

exec gunicorn app.main:app \
    --workers=1 \
    --worker-class=uvicorn.workers.UvicornWorker \
    --bind="0.0.0.0:${BIND_PORT}" \
    --timeout=120 \
    --access-logfile=- \
    --error-logfile=-
