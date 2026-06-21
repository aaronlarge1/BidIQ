# Deployment Guide — BidIQ Pro

BidIQ Pro deploys to [Render](https://render.com). The frontend is a static site; the backend (when scaffolded) is a web service. Both are defined in `render.yaml`.

---

## Architecture on Render

```
┌─────────────────────────────────────────────────────┐
│  Render                                              │
│                                                      │
│  ┌──────────────────┐    ┌─────────────────────┐   │
│  │  Static Site      │    │  Web Service         │   │
│  │  bidiq-frontend   │───▶│  bidiq-api           │   │
│  │  (Vite build)     │    │  (Node.js backend)   │   │
│  └──────────────────┘    └──────────┬──────────┘   │
│                                      │               │
│                           ┌──────────▼──────────┐   │
│                           │  PostgreSQL           │   │
│                           │  (Render managed)     │   │
│                           └─────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Step 1 — Push to GitHub

Render deploys from a GitHub repository.

```bash
git add .
git commit -m "initial setup"
git remote add origin https://github.com/your-org/bidiq-pro.git
git push -u origin main
```

---

## Step 2 — Create Render Services

You can use the `render.yaml` Blueprint (auto-creates all services) or create services manually.

### Blueprint (recommended)

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates all services automatically
5. Set the secret environment variables manually (see Step 3)

### Manual

Create two services:

**Frontend — Static Site**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Add redirect rule: `/* → /index.html` (for SPA routing)

**Backend — Web Service** (when backend is scaffolded)
- Build Command: `npm install && npm run build:server`
- Start Command: `node dist/server/index.js`
- Health Check Path: `/health`

**Database**
- New → PostgreSQL
- Name: `bidiq-db`
- Plan: Starter (free) or Standard

---

## Step 3 — Set Environment Variables in Render

After services are created, go to each service → **Environment** and add:

### Frontend Static Site

| Variable | Value |
|---|---|
| `VITE_APP_NAME` | `BidIQ Pro` |
| `VITE_APP_URL` | `https://your-app.onrender.com` |
| `VITE_API_URL` | `https://your-api.onrender.com` |
| `VITE_DEMO_MODE` | `false` (set `true` for soft launch) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |

### Backend Web Service

| Variable | Where to get it |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Render provides this automatically from your PostgreSQL instance |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Same as above (different value) |
| `SESSION_SECRET` | Same as above (different value) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) |
| `CONTRACTS_FINDER_API_KEY` | [contractsfinder.service.gov.uk](https://www.contractsfinder.service.gov.uk/) |
| `FIND_A_TENDER_API_KEY` | [findatender.service.gov.uk](https://www.findatender.service.gov.uk/) |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com/developers) |
| `STRIPE_WEBHOOK_SECRET` | Created when you set up Stripe webhook endpoint |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |
| `MEILISEARCH_HOST` | Your MeiliSearch Cloud URL or self-hosted |
| `MEILISEARCH_API_KEY` | From MeiliSearch dashboard |
| `S3_ENDPOINT` | Your S3 / R2 endpoint |
| `S3_BUCKET` | Your bucket name |
| `S3_ACCESS_KEY_ID` | From your storage provider |
| `S3_SECRET_ACCESS_KEY` | From your storage provider |
| `CLIENT_URL` | `https://your-app.onrender.com` |
| `ALLOWED_ORIGINS` | `https://your-app.onrender.com` |

> **Important**: Render marks variables as "Secret" — they are encrypted at rest and not shown after saving. Never add real secrets to `render.yaml` directly; always use the Render dashboard for secrets.

---

## Step 4 — Database Setup

After deploying, run migrations:

```bash
# Via Render shell (backend service → Shell tab)
npm run db:migrate

# Seed demo data for soft launch
npm run seed:demo
```

---

## Build Details

| | Frontend | Backend |
|---|---|---|
| Build command | `npm install && npm run build` | `npm install && npm run build:server` |
| Output | `dist/` | `dist/server/` |
| Start command | N/A (static) | `node dist/server/index.js` |
| Health check | N/A | `GET /health` |

---

## Health Check Endpoints

| Endpoint | Returns |
|---|---|
| `GET /health` | `{ status: "ok", uptime: 123 }` |
| `GET /api/system/status` | `{ database: "connected", ... }` |
| `GET /api/system/integrations` | Full integration status JSON |

Render uses `GET /health` for service health monitoring.

---

## Custom Domain

1. Render Dashboard → your static site → **Custom Domains**
2. Add your domain (e.g. `app.bidiqpro.com`)
3. Add the CNAME record shown to your DNS provider
4. SSL is provisioned automatically

---

## Stripe Webhooks (Production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-api.onrender.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in Render

---

## Monitoring

Render provides basic logging under each service → **Logs** tab.

For production monitoring consider:
- [Sentry](https://sentry.io) for error tracking
- [Uptime Robot](https://uptimerobot.com) for uptime monitoring
- Render's built-in metrics for CPU/memory

---

## Rolling Back

If a deployment breaks:

1. Render Dashboard → your service → **Deploys**
2. Find the last working deploy
3. Click **Redeploy** on that commit
