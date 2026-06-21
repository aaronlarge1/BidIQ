# Security Policy — BidIQ Pro

This document covers how BidIQ Pro handles secrets, user data, file uploads, and tenant isolation. It is intended for developers and anyone deploying or auditing the system.

---

## Secrets Policy

**Rule**: No secret ever touches git.

- All secrets go in `.env` (backend) or `.env.local` (frontend)
- Both files are in `.gitignore`
- Only `.env.example` and `.env.local.example` are committed — with placeholder values only
- Never put a real API key, password, or secret in `render.yaml`, any documentation file, or any source file

**Generating strong secrets**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use a different value for each of: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`.

**Key rotation**: If a secret is accidentally committed or exposed, rotate it immediately — revoke the old key at the provider, generate a new one, and update Render environment variables. Then remove the secret from git history using `git filter-repo` or contact GitHub support.

---

## Environment Variable Policy

| Variable Type | Where stored | Committed? |
|---|---|---|
| Backend secrets (DB password, JWT, Stripe secret, OpenAI key) | `.env` | Never |
| Frontend public vars (VITE_ prefix) | `.env.local` | Never (but safe to expose) |
| CI/CD secrets | GitHub Actions Secrets | Never in files |
| Production secrets | Render Environment (encrypted) | Never in files |
| Example/placeholder values | `.env.example`, `.env.local.example` | Yes — placeholders only |

The `VITE_` prefix makes Vite bundle the variable into the client bundle. **Never** put a secret in a `VITE_` variable — it will be visible in the browser.

Safe to expose (VITE_): `VITE_APP_NAME`, `VITE_APP_URL`, `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`.

Never expose (backend only): `STRIPE_SECRET_KEY`, `JWT_SECRET`, `OPENAI_API_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, `S3_SECRET_ACCESS_KEY`.

---

## File Upload Policy

- Maximum file size: 10 MB per file
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Files are scanned for malicious content before storage (ClamAV or similar)
- File names are sanitised and replaced with a UUID on upload
- Files are stored in S3 with private ACL (not public)
- Presigned URLs are used for download, expiring after 15 minutes
- Files are namespaced per tenant: `uploads/{tenantId}/{documentId}/{filename}`

---

## AI Data Warning

BidIQ Pro sends user data to OpenAI for AI features. Before sending any data:
- Strip personally identifiable information (PII) where possible
- Do not send bank account details, HMRC data, or full employee records
- OpenAI API requests are not used to train models (per the API terms)
- Users must consent to AI processing in the onboarding flow
- Consider offering an "AI off" mode for enterprise clients with strict data policies

OpenAI data processing agreement: [openai.com/policies/data-processing-addendum](https://openai.com/policies/data-processing-addendum)

---

## GDPR Notes

BidIQ Pro stores personal data (names, email addresses, company details) for UK-based SME users.

**Data controller**: Civic Ladder Ltd  
**Data processor**: Render (hosting), OpenAI (AI), Stripe (payments), Resend (email)

**Key obligations**:
- Maintain a record of processing activities (ROPA)
- Provide a privacy policy accessible from the app
- Allow users to export and delete their data (right of access, right to erasure)
- Report breaches to the ICO within 72 hours
- Do not retain data longer than necessary
- Use appropriate safeguards when data leaves the UK (Render's EU region or UK region preferred)

**Data deletion**: When a user closes their account, all personal data and uploaded documents must be deleted within 30 days. Anonymised aggregate analytics may be retained.

**Data residency**: Prefer Render's `eu-west` region and AWS `eu-west-2` for S3 to keep data within the UK/EEA.

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

| Endpoint group | Limit |
|---|---|
| Authentication (`/api/auth/*`) | 10 requests / 15 minutes per IP |
| AI endpoints (`/api/ai/*`) | 20 requests / minute per user |
| General API | 100 requests / 15 minutes per IP |
| File upload | 10 uploads / minute per user |

Configure via:
```
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Audit Logs

The backend maintains an audit log for:
- User login / logout
- Document uploads and deletions
- Bid submissions
- Subscription changes
- Admin actions

Audit log entries include: `timestamp`, `userId`, `tenantId`, `action`, `resource`, `ip`, `userAgent`.

Logs are retained for 12 months.

---

## Tenant Isolation

BidIQ Pro is a multi-tenant SaaS application. Each company (tenant) is isolated at the database level:

- Every table has a `tenant_id` column
- All queries are filtered by `tenant_id` from the authenticated JWT
- Middleware enforces tenant scoping on every request
- No cross-tenant data access is possible through the API
- Admin routes require a separate `ADMIN_JWT_SECRET` and are not accessible via the standard auth flow

**Never** query the database without a `tenant_id` filter outside of admin/migration scripts.

---

## Dependency Security

- Run `npm audit` regularly to check for known vulnerabilities
- Pin dependency versions in `package.json` (use exact versions for production)
- GitHub Dependabot is configured to auto-create PRs for security updates
- Never install packages from unverified or unofficial sources

---

## Reporting a Security Issue

If you discover a security vulnerability, do not open a public GitHub issue.

Email: **security@civicladder.co.uk**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your suggested fix (if any)

We aim to respond within 48 hours and patch critical issues within 7 days.
