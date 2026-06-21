# BidIQ Pro

**The AI Procurement Operating System for SMEs**

BidIQ Pro helps UK small and medium enterprises find, bid for, and win public sector contracts. It covers the full procurement lifecycle: tender discovery, bid writing, compliance management, contract delivery, and buyer intelligence — all powered by AI.

Built by [Civic Ladder Ltd](https://civicladder.co.uk).

---

## What It Does

| Feature | Description |
|---|---|
| Tender Discovery | Aggregates UK public sector tenders from Contracts Finder, Find a Tender, and local authority portals |
| Procurement Readiness | Scores your business against buyer requirements (insurance, policies, accreditations) |
| AI Bid Workspace | AI-assisted bid writing, scoring, and submission tracking |
| Compliance Vault | Document store for certificates, policies, and insurance |
| Bid Pipeline | Kanban-style CRM for tracking bids from identification to award |
| Contract Delivery | Milestone tracking, KPIs, and payment schedules for live contracts |
| Evidence Vault | Photo, testimonial, and KPI evidence for future bids |
| Buyer Intelligence | Spending history, upcoming renewals, and supplier networks per buyer |
| Market Intelligence | Sector trends, CPV analysis, and framework opportunities |
| Finance Centre | Invoice management, cash flow, and pricing assistant |
| Consortium Builder | Find and match SME partners for larger opportunities |
| Procurement Academy | Training content on public sector bidding |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| PWA | vite-plugin-pwa (offline-capable) |
| Backend (planned) | Node.js, Express/Fastify, TypeScript |
| Database | PostgreSQL |
| AI | OpenAI GPT-4o + text-embedding-3-small |
| Search | MeiliSearch |
| Storage | S3-compatible (AWS / Cloudflare R2) |
| Email | Resend |
| Payments | Stripe |
| Deployment | Render |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-org/bidiq-pro.git
cd bidiq-pro

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.local.example .env.local

# 4. Start development server
npm run dev
```

The app runs on [http://localhost:5173](http://localhost:5173) and loads demo data automatically when `VITE_DEMO_MODE=true`.

See [SETUP.md](SETUP.md) for full local setup including backend and database.

---

## Seeded Demo Data

When `VITE_DEMO_MODE=true`, the frontend loads pre-built demo data from `src/lib/demo-data.ts`:

- **Company**: Greenfield Infrastructure Ltd (highways SME)
- **6 tenders** across National Highways, local councils, NHS, and education
- **5 bids** at various pipeline stages
- **Compliance documents** including expired/expiring items
- **Buyer intelligence** for National Highways and Stockport MBC

Run the seed script to load demo data into the backend database:

```bash
npm run seed:demo
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run check:env` | Validate environment variables |
| `npm run seed:demo` | Seed demo tender/company data |
| `npm run test:integrations` | Test all third-party API connections |
| `npm run setup` | Run full local setup wizard (Unix/Mac) |

---

## Running Tests

```bash
# Type check
npx tsc --noEmit

# Integration tests (requires env vars)
npm run test:integrations
```

---

## Deploying to Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full Render deployment guide.

Quick summary:
1. Push to GitHub
2. Create a new Render static site (frontend) and web service (backend)
3. Set environment variables from `.env.example`
4. Deploy

---

## API Integrations

See [API_INTEGRATIONS.md](API_INTEGRATIONS.md) for details on:
- Contracts Finder API
- Find a Tender API
- OpenAI
- MeiliSearch
- Stripe
- Resend
- S3 Storage

All integrations have demo/mock fallbacks — the app works without any API keys in development.

---

## Security

See [SECURITY.md](SECURITY.md) for the secrets policy, GDPR notes, file upload policy, and tenant isolation architecture.

---

## License

Proprietary — Civic Ladder Ltd. All rights reserved.
