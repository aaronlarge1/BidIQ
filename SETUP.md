# Local Setup Guide — BidIQ Pro

This guide gets you from a fresh clone to a fully running local environment.

---

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | Any | `git --version` |
| PostgreSQL | 15+ | `psql --version` |
| Docker (optional) | Any | `docker --version` |

Install Node.js from [nodejs.org](https://nodejs.org) (use the LTS version).

---

## Step 1 — Clone and Install

```bash
git clone https://github.com/your-org/bidiq-pro.git
cd bidiq-pro
npm install
```

---

## Step 2 — Copy Environment Files

```bash
# Frontend env (safe public vars only)
cp .env.local.example .env.local

# Backend env (secrets go here — never commit this)
cp .env.example .env
```

Edit `.env.local`:
- Set `VITE_DEMO_MODE=true` to use built-in demo data (no API keys needed)
- Set `VITE_API_URL=http://localhost:3000` if running the backend locally

Edit `.env`:
- `DATABASE_URL` — your local PostgreSQL connection string
- `JWT_SECRET` — generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Everything else can stay as placeholder while developing the frontend

---

## Step 3 — Database Setup

### Option A: PostgreSQL directly

```bash
# Create database
psql -U postgres -c "CREATE USER bidiq WITH PASSWORD 'password';"
psql -U postgres -c "CREATE DATABASE bidiq_dev OWNER bidiq;"

# Run migrations (once backend is scaffolded)
npm run db:migrate
```

### Option B: Docker

```bash
# Start PostgreSQL + MeiliSearch via Docker Compose
docker-compose up -d db search

# Check it's running
docker-compose ps
```

The `docker-compose.yml` at the project root starts all backend services.

---

## Step 4 — Start the Frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

With `VITE_DEMO_MODE=true`, the app loads fully with demo company, tenders, bids, and documents — no backend required.

---

## Step 5 — Seed Demo Data (Optional)

Once the backend is running, load demo tenders and company data:

```bash
npm run seed:demo
```

This seeds:
- 8 demo tenders (National Highways, NHS, councils, education)
- Demo company profile (Greenfield Infrastructure Ltd)
- Bid pipeline records
- Compliance documents

Demo records are labelled with `isDemo: true` and shown with a demo banner in the UI.

---

## Step 6 — Validate Environment

```bash
npm run check:env
```

This prints:
- `✅` vars that are set and valid
- `⚠️` optional vars that are missing (won't break the app)
- `❌` required vars that are missing (will cause errors)

---

## Step 7 — Test Integrations

```bash
npm run test:integrations
```

Tests live connections to: database, OpenAI, MeiliSearch, Stripe, Resend, S3. Skips any integration where keys are placeholder values.

---

## Demo Mode vs Full Mode

| Feature | Demo Mode | Full Mode |
|---|---|---|
| Frontend | Works fully | Works fully |
| Tender data | Pre-seeded demo tenders | Live from Contracts Finder / Find a Tender |
| AI features | Mock responses | Live GPT-4o |
| Auth | Bypassed | JWT-based |
| Database | Not required | Required |
| Payments | Stripe test mode | Stripe live mode |

Switch modes by changing `VITE_DEMO_MODE` in `.env.local`.

---

## Common Issues

**Port 5173 already in use**
```bash
npx kill-port 5173
npm run dev
```

**TypeScript errors on start**
```bash
npx tsc --noEmit
```
Fix any type errors shown before running the dev server.

**`@` alias not resolving**
Ensure `vite.config.ts` has the path alias configured (it does by default).

**PostgreSQL connection refused**
Check `DATABASE_URL` in `.env` and that PostgreSQL is running:
```bash
pg_isready -h localhost -p 5432
```
