"""
Startup script — runs instead of docker-entrypoint.sh
Pure Python: no shell, no CRLF issues, no bash dependency.
"""
import os
import socket
import subprocess
import sys
import time


def wait_for_db(timeout: int = 30) -> None:
    db_url = os.environ.get("DATABASE_URL", "")
    host = "raheeqarabia_database"
    port = 5432

    if "@" in db_url:
        try:
            rest = db_url.split("@", 1)[1].split("?")[0].split("/")[0]
            if ":" in rest:
                host, p = rest.split(":", 1)
                port = int(p)
            else:
                host = rest
        except Exception:
            pass

    print(f"[startup] waiting for DB {host}:{port} (max {timeout}s) …", flush=True)
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=2):
                print("[startup] DB is ready", flush=True)
                return
        except OSError:
            time.sleep(2)
    print("[startup] DB not ready — continuing anyway", flush=True)


def run_migrations() -> None:
    print("[startup] running alembic upgrade head …", flush=True)
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        capture_output=False,
    )
    if result.returncode != 0:
        print("[startup] WARNING: migration failed — app will start anyway", flush=True)
    else:
        print("[startup] migrations OK", flush=True)


def start_gunicorn() -> None:
    port = os.environ.get("PORT", "8000")
    print(f"[startup] starting gunicorn on 0.0.0.0:{port}", flush=True)
    # os.execvp replaces this Python process with gunicorn (PID stays, signals work)
    os.execvp("gunicorn", [
        "gunicorn", "app.main:app",
        "--workers=2",
        "--worker-class=uvicorn.workers.UvicornWorker",
        f"--bind=0.0.0.0:{port}",
        "--timeout=120",
        "--graceful-timeout=30",
        "--access-logfile=-",
        "--error-logfile=-",
    ])


if __name__ == "__main__":
    wait_for_db()
    run_migrations()
    start_gunicorn()
