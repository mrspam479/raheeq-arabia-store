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
    print("[entrypoint] DB not reachable after 60s; continuing anyway")
PY

echo "[entrypoint] alembic upgrade head"
alembic upgrade head

echo "[entrypoint] starting app"
exec "$@"
