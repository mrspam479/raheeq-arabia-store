# EasyPanel Deployment — Complete Setup from Scratch

## Step 1 — Delete old project (if exists)

In EasyPanel:
1. Go to the `raheeqarabia` project
2. Click **Settings** → **Danger Zone** → **Delete Project**
3. Confirm deletion

---

## Step 2 — Create new project

1. Click **+ New Project**
2. Name: `raheeqarabia`

---

## Step 3 — Add Postgres database

Inside the project, click **+ New Service** → **Postgres**

| Field | Value |
|---|---|
| Service Name | `database` |
| Image | `postgres:16` |
| User | `raheeqarabia` |
| Password | `raheeqarabia` |
| Database | `raheeqarabia` |

Click **Deploy**.

Wait for it to show **Running** (green).

---

## Step 4 — Deploy the Backend

Click **+ New Service** → **App**

### Source
| Field | Value |
|---|---|
| Owner | `mrspam479` |
| Repository | `raheeq-arabia-backend` |
| Branch | `master` |
| Build Path | `/` |

### Build
| Field | Value |
|---|---|
| Build Method | `Dockerfile` |

### Domains
| Field | Value |
|---|---|
| Domain | `api.raheeqarabia.com` |
| HTTPS | ✅ enabled |

### Ports
| Field | Value |
|---|---|
| Port | `8000` |

### Environment Variables (set these as **Runtime** env vars)

Click **+ Add Variable** for each:

```
APP_ENV = production
DATABASE_URL = postgresql+psycopg://raheeqarabia:raheeqarabia@raheeqarabia_database:5432/raheeqarabia
SECRET_KEY = replace-with-any-long-random-string-64chars
BACKEND_API_KEY = replace-with-any-long-random-string-64chars
CORS_ORIGINS = https://raheeqarabia.com,http://localhost:3000
PROXY_TRUST_HOPS = 1
LOG_LEVEL = INFO
```

Click **Deploy**.

Wait for it to show **Running** (green). Check logs — you should see:
```
[entrypoint] DB reachable
[entrypoint] alembic upgrade head
[entrypoint] starting app
```

---

## Step 5 — Deploy the Frontend

Click **+ New Service** → **App**

### Source
| Field | Value |
|---|---|
| Owner | `mrspam479` |
| Repository | `raheeq-arabia-frontend` |
| Branch | `master` |
| Build Path | `/` |

### Build
| Field | Value |
|---|---|
| Build Method | `Dockerfile` |

### Domains
| Field | Value |
|---|---|
| Domain | `raheeqarabia.com` |
| HTTPS | ✅ enabled |

### Ports
| Field | Value |
|---|---|
| Port | `3000` |

### Environment Variables (set as **Build** AND **Runtime** vars)

```
BACKEND_URL = http://raheeqarabia_backend:8000
NEXT_PUBLIC_SITE_URL = https://raheeqarabia.com
NEXT_PUBLIC_ENABLE_PIXELS = false
```

> **Why `http://raheeqarabia_backend:8000` and not the public URL?**
>
> The Next.js container calls the backend on every order submission. If `BACKEND_URL` is set to
> the public `https://api.raheeqarabia.com`, that request leaves the server, goes through
> Cloudflare, and comes back in — Cloudflare often blocks or rate-limits this hairpin traffic,
> causing a 9-second timeout and showing users **"تعذّر الاتصال بالخادم"**.
>
> Using the EasyPanel-internal hostname (`http://raheeqarabia_backend:8000`) keeps traffic inside
> the Docker network: it is faster (~1 ms vs ~200 ms+), never touches Cloudflare, and bypasses
> any WAF rules that would otherwise block the server-to-server call.
>
> **Finding your backend's internal hostname in EasyPanel:**
> Go to your project → click on the backend service → **Domains** tab → copy the
> **"Internal domain"** shown there (format: `<project>_<service>:<port>`).
> If your backend service is named `backend` inside the `raheeqarabia` project, it will be
> `raheeqarabia_backend:8000`.

Click **Deploy**.

---

## Step 6 — Verify everything works

1. Open `https://api.raheeqarabia.com/health` — should return `{"status":"ok"}`
2. Open `https://raheeqarabia.com` — should load the store
3. Try adding a product and placing a test order

---

## Testing Orders

Use phone number `0550000000` or `0500000070` — these are whitelisted and bypass the IP geo-check.

---

## Troubleshooting

### Backend logs show "DB not reachable"
The Postgres service is not ready yet or the hostname is wrong.
Check: `DATABASE_URL` hostname must be `raheeqarabia_database` (project name + `_database`).

### Frontend shows "تعذّر الاتصال بالخادم"
This means the Next.js API route could not reach the Python backend at all (TCP-level failure,
not an application error). Follow these steps in order:

1. **Check `BACKEND_URL` is the internal hostname** — it must be
   `http://raheeqarabia_backend:8000` (or whatever EasyPanel shows as the internal domain for
   your backend service). If it is still set to `https://api.raheeqarabia.com`, Cloudflare is
   almost certainly blocking the hairpin request. Change it and redeploy the frontend.

2. **Confirm the backend is running** — open `https://api.raheeqarabia.com/health` in a browser.
   It must return `{"status":"ok"}`. If it is down, check the backend service logs in EasyPanel.

3. **Read the frontend logs for the exact error** — in EasyPanel, open the frontend service logs
   and search for `[api/orders] backend fetch failed`. The line will show either:
   - `AbortError: The operation was aborted` → 9-second timeout hit (wrong `BACKEND_URL`).
   - `ECONNREFUSED` → backend container is down or the hostname is wrong.
   - `ENOTFOUND` → DNS cannot resolve the hostname (wrong service name in EasyPanel).

4. **Check the CORS_ORIGINS on the backend** — the backend's `CORS_ORIGINS` env var only needs
   to include the public frontend URL (`https://raheeqarabia.com`), not the internal hostname.

### Orders fail with 403 GEO_BLOCKED
MaxMind is not configured (expected — it will allow all orders by default).
If blocked: use whitelisted phone `0550000000`.
