# syntax=docker/dockerfile:1.7
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Default port — EasyPanel overrides PORT at runtime.
# Gunicorn in start.py reads ${PORT} so it always matches EasyPanel's routing.
ENV PORT=8000

# Pure-Python startup: no shell script, no CRLF/bash issues
CMD ["python", "start.py"]
