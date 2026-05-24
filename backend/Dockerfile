# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN groupadd --system app && useradd --system --gid app --create-home app
RUN chmod +x ./docker-entrypoint.sh
USER app

# PORT default — EasyPanel overrides this at runtime with the service's configured port
ENV PORT=8000
EXPOSE 8000

# Entrypoint runs migrations then starts gunicorn on ${PORT}
# No CMD arguments needed — the entrypoint handles everything
ENTRYPOINT ["./docker-entrypoint.sh"]
