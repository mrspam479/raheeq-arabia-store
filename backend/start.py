"""
Minimal startup: run migrations then start uvicorn.
No DB wait loop — keeps startup fast so EasyPanel health checks pass.
"""
import os
import subprocess
import sys

# Run alembic migrations (non-fatal, 30-second hard timeout)
print("[startup] alembic upgrade head ...", flush=True)
try:
    r = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        timeout=30,
    )
    if r.returncode == 0:
        print("[startup] migrations OK", flush=True)
    else:
        print("[startup] migrations failed (continuing anyway)", flush=True)
except subprocess.TimeoutExpired:
    print("[startup] migrations timed out (continuing anyway)", flush=True)
except Exception as exc:
    print(f"[startup] migrations error: {exc} (continuing anyway)", flush=True)

# Start uvicorn — os.execvp replaces this process so signals are forwarded correctly
port = os.environ.get("PORT", "8000")
print(f"[startup] starting uvicorn on 0.0.0.0:{port}", flush=True)
os.execvp("uvicorn", [
    "uvicorn", "app.main:app",
    "--host", "0.0.0.0",
    "--port", str(port),
    "--workers", "1",
    "--log-level", "info",
])
