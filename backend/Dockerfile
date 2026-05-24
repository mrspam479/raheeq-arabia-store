# syntax=docker/dockerfile:1.7
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Strip any Windows CRLF line endings so the script runs on Linux
RUN sed -i 's/\r//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# Default port — EasyPanel overrides PORT at runtime; we expose the same value
ENV PORT=8000

# IMPORTANT: do NOT hardcode EXPOSE here.
# EasyPanel injects PORT at runtime and sets its Traefik routing to match.
# We read ${PORT} in the entrypoint so gunicorn always listens on the same
# port that EasyPanel/Traefik expects.

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
