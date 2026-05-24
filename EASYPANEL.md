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
BACKEND_URL = https://api.raheeqarabia.com
NEXT_PUBLIC_SITE_URL = https://raheeqarabia.com
NEXT_PUBLIC_ENABLE_PIXELS = false
```

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
The `BACKEND_URL` variable is wrong or backend is not running.
Check: `https://api.raheeqarabia.com/health` in browser.

### Orders fail with 403 GEO_BLOCKED
MaxMind is not configured (expected — it will allow all orders by default).
If blocked: use whitelisted phone `0550000000`.
