# Raheeq Arabia — Backend

FastAPI 0.115 + SQLAlchemy 2 (async) + Alembic + PostgreSQL backend for [raheeqarabia.com](https://raheeqarabia.com).

See [`docs/`](../docs/README.md) for the full specification.

## Quick start (local)

```bash
cd backend
cp .env.example .env
# Edit .env: set SECRET_KEY, BACKEND_API_KEY with strong random values
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Start local Postgres (or use docker-compose at repo root)
# docker compose up db -d

alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/api/products` — expect 3 SKUs.

## Run tests

```bash
pytest -q
```

## Lint & type-check

```bash
ruff check .
ruff format --check .
mypy app
```

## Docker

```bash
docker build -t raheeq-backend .
docker run -p 8000:8000 --env-file .env raheeq-backend
```
