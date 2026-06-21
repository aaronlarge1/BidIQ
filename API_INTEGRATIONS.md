# API Integrations — BidIQ Pro

This document covers every third-party API used by BidIQ Pro: what it does, whether it is required for MVP, how to get the key, and what happens if it is missing.

---

## Summary Table

| Integration | Purpose | MVP Required | Fallback if Missing |
|---|---|---|---|
| PostgreSQL | Data persistence | Yes | None — app will not start |
| OpenAI | AI bid writing, scoring, embeddings | No | Mock AI responses |
| Contracts Finder | UK public sector tenders | No | Demo tenders |
| Find a Tender | Above-threshold UK tenders | No | Demo tenders |
| National Highways | Highways-specific tenders | No | Demo tenders |
| MeiliSearch | Full-text tender search | No | In-memory filter |
| Stripe | Subscription payments | No | Free/demo access |
| Resend | Transactional email | No | Console log emails |
| S3 Storage | Document/file uploads | No | Local disk storage |

---

## Database (PostgreSQL)

**What it does**: Stores all user, company, tender, bid, contract, and document data.

**Required for MVP**: Yes — the backend will not start without a valid `DATABASE_URL`.

**How to get it**:
- Local: Install PostgreSQL and create a database (see SETUP.md)
- Production: Render provides a managed PostgreSQL instance

**Env var**:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

**Fallback**: None. The API server requires a database connection.

---

## OpenAI

**What it does**:
- AI bid writing assistance (GPT-4o)
- Bid quality scoring (GPT-4o)
- Tender-company matching (text-embedding-3-small)
- Social value content generation
- Pricing suggestions

**Required for MVP**: No — AI features degrade gracefully with mock responses.

**How to get the key**:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and add billing details
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (shown once only)

**Cost estimate**: ~£10–50/month at typical SME usage. Set a spending limit in the OpenAI dashboard.

**Env vars**:
```
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-small
```

**Fallback**: When `OPENAI_API_KEY` is missing or set to placeholder, the backend returns mock AI responses with a notice: _"AI features are in demo mode."_

---

## Contracts Finder API

**What it does**: Fetches UK public sector contract notices published by government buyers under £118k (above that uses Find a Tender). Covers councils, NHS, housing associations, schools, and more.

**Required for MVP**: No — demo tenders cover the onboarding experience.

**How to get the key**:
1. Register at [contractsfinder.service.gov.uk](https://www.contractsfinder.service.gov.uk/)
2. Go to your account → **API Access**
3. The API key is free

**Env var**:
```
CONTRACTS_FINDER_API_KEY=your-key-here
```

**Fallback**: When missing, the tender discovery page loads the 8 seeded demo tenders with a banner: _"Demo mode — showing example tenders."_

**API docs**: [https://www.contractsfinder.service.gov.uk/apidocumentation](https://www.contractsfinder.service.gov.uk/apidocumentation)

---

## Find a Tender (FTS)

**What it does**: Official UK replacement for OJEU. Lists above-threshold public contracts (£118k+ for goods/services, £4.7m+ for works). Required for any contract above these thresholds under the Procurement Act 2023.

**Required for MVP**: No.

**How to get the key**:
1. Go to [findatender.service.gov.uk](https://www.findatender.service.gov.uk)
2. Register for a supplier account
3. API access is available via the developer portal

**Env var**:
```
FIND_A_TENDER_API_KEY=your-key-here
```

**Fallback**: Demo tenders. The app clearly labels live vs. demo tender data.

---

## National Highways Source

**What it does**: Scrapes or polls the National Highways procurement portal for highways-specific tender opportunities — the primary market for Greenfield Infrastructure-style SMEs.

**Required for MVP**: No.

**Setup**: This is a URL-based source, not a keyed API. Set the source URL and the backend polling job fetches it.

**Env var**:
```
NATIONAL_HIGHWAYS_SOURCE_URL=https://highwaysengland.co.uk/procurement/
```

**Fallback**: Demo tenders include National Highways-style opportunities.

---

## Local Authority Source URLs

**What it does**: Polls local authority procurement portals (e.g. YorTender, Due North, ProContract) for council contracts.

**Required for MVP**: No.

**Env var**:
```
LOCAL_AUTHORITY_SOURCE_URLS=https://www.yortender.co.uk,https://procontract.due-north.com
```

**Fallback**: Demo tenders include council-issued opportunities.

---

## MeiliSearch

**What it does**: Provides fast, typo-tolerant full-text search across tenders, documents, and buyers. Powers the tender search bar and filter system.

**Required for MVP**: No — falls back to in-memory array filtering.

**How to get it**:
- Local: `docker run -p 7700:7700 getmeili/meilisearch`
- Cloud: [cloud.meilisearch.com](https://cloud.meilisearch.com) (free tier available)

**Env vars**:
```
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-master-key
```

**Fallback**: When `MEILISEARCH_HOST` is unreachable, search falls back to in-memory JavaScript filtering on the returned dataset.

---

## Stripe

**What it does**: Handles subscription billing for Starter (£49/mo), Growth (£149/mo), and Pro (£349/mo) plans. Also handles usage-based billing for AI credits.

**Required for MVP**: No — demo mode grants full access without payment.

**How to get the keys**:
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Developers** → **API Keys** → copy Secret Key and Publishable Key
3. Create Products and Prices in the Stripe dashboard
4. Copy the price IDs (e.g. `price_xxx`) into your env vars
5. Set up a webhook endpoint pointing to `/api/stripe/webhook`

**Env vars**:
```
STRIPE_SECRET_KEY=sk_test_...         # Backend only
STRIPE_WEBHOOK_SECRET=whsec_...       # Backend only
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Frontend only
```

**Fallback**: When Stripe keys are missing or in test mode, the pricing page works but checkout redirects to a "Payment unavailable in demo mode" message.

**Test cards**: Use `4242 4242 4242 4242` with any future date and any CVC during testing.

---

## Resend (Email)

**What it does**: Sends transactional emails — welcome emails, password resets, tender alerts, bid deadline reminders, and document expiry warnings.

**Required for MVP**: No.

**How to get the key**:
1. Register at [resend.com](https://resend.com)
2. **API Keys** → **Create API Key**
3. Verify your sending domain

**Env vars**:
```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@bidiqpro.com
```

**Fallback**: When `RESEND_API_KEY` is missing, emails are logged to the server console instead of sent.

---

## S3-Compatible Storage

**What it does**: Stores uploaded compliance documents (PDFs, certificates), evidence photos, and company logos.

**Required for MVP**: No — can use local disk storage during development.

**Compatible providers**:
- **AWS S3** (eu-west-2 recommended for UK data residency)
- **Cloudflare R2** (no egress fees — recommended for cost)
- **MinIO** (self-hosted)
- **Supabase Storage**

**How to get keys**:
- AWS: IAM → Create User → Programmatic Access → attach S3 policy
- Cloudflare R2: R2 → Create Bucket → API Tokens

**Env vars**:
```
S3_ENDPOINT=https://...
S3_BUCKET=bidiq-uploads
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=eu-west-2
```

**Fallback**: Files saved to `./uploads/` on local disk. Not suitable for production or multi-instance deployments.

---

## Adding a New Integration

1. Add the env var to `.env.example` with a comment and placeholder value
2. Add it to `scripts/check-env.ts` with required/optional flag
3. Add a health check to `GET /api/system/integrations`
4. Add it to this document
5. Implement a demo fallback in the service layer
