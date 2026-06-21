/**
 * BidIQ Pro — Environment Variable Checker
 * Run: npx tsx scripts/check-env.ts
 *
 * Checks that required env vars are set and warns about missing optional ones.
 * Reads from .env and .env.local automatically via dotenv.
 */

import { config } from "dotenv"
import { resolve } from "path"

// Load both env files
config({ path: resolve(process.cwd(), ".env") })
config({ path: resolve(process.cwd(), ".env.local") })

type Severity = "required" | "optional" | "secret"

interface EnvCheck {
  key: string
  description: string
  severity: Severity
  validate?: (value: string) => string | null // return error string or null
}

const PLACEHOLDER_PATTERNS = [
  /your-.*key/i,
  /change-this/i,
  /placeholder/i,
  /sk-proj-your/i,
  /pk_test_your/i,
  /re_your/i,
  /sk_test_your/i,
  /whsec_your/i,
  /price_.*id_here/i,
]

const isPlaceholder = (val: string): boolean =>
  PLACEHOLDER_PATTERNS.some((p) => p.test(val))

const isWeakSecret = (val: string): boolean =>
  val.length < 32 || val === "password" || val === "secret" || val === "changeme"

const isValidUrl = (val: string): boolean => {
  try {
    new URL(val)
    return true
  } catch {
    return false
  }
}

const checks: EnvCheck[] = [
  // ── General ──────────────────────────────────────────────────
  { key: "NODE_ENV", description: "Runtime environment", severity: "required" },
  { key: "APP_NAME", description: "Application name", severity: "optional" },
  {
    key: "APP_URL",
    description: "Public app URL",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
  {
    key: "CLIENT_URL",
    description: "Frontend URL (for CORS)",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
  {
    key: "SERVER_URL",
    description: "Backend URL",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
  { key: "PORT", description: "Server port", severity: "optional" },

  // ── Database ─────────────────────────────────────────────────
  {
    key: "DATABASE_URL",
    description: "PostgreSQL connection string",
    severity: "required",
    validate: (v) =>
      v.startsWith("postgresql://") || v.startsWith("postgres://")
        ? null
        : "Must start with postgresql:// or postgres://",
  },

  // ── Auth ─────────────────────────────────────────────────────
  {
    key: "JWT_SECRET",
    description: "JWT signing secret",
    severity: "secret",
    validate: (v) => (isWeakSecret(v) ? "Too short or weak — generate with crypto.randomBytes(64)" : null),
  },
  {
    key: "JWT_REFRESH_SECRET",
    description: "JWT refresh token secret",
    severity: "secret",
    validate: (v) => (isWeakSecret(v) ? "Too short or weak — generate with crypto.randomBytes(64)" : null),
  },
  {
    key: "SESSION_SECRET",
    description: "Session secret",
    severity: "secret",
    validate: (v) => (isWeakSecret(v) ? "Too short or weak — generate with crypto.randomBytes(64)" : null),
  },
  { key: "BCRYPT_ROUNDS", description: "bcrypt work factor (12 recommended)", severity: "optional" },

  // ── AI ───────────────────────────────────────────────────────
  { key: "OPENAI_API_KEY", description: "OpenAI API key (AI features)", severity: "optional" },
  { key: "OPENAI_MODEL", description: "OpenAI model name", severity: "optional" },
  { key: "EMBEDDING_MODEL", description: "OpenAI embedding model", severity: "optional" },

  // ── Tender Sources ───────────────────────────────────────────
  { key: "CONTRACTS_FINDER_API_KEY", description: "Contracts Finder API key", severity: "optional" },
  { key: "FIND_A_TENDER_API_KEY", description: "Find a Tender API key", severity: "optional" },
  { key: "NATIONAL_HIGHWAYS_SOURCE_URL", description: "National Highways source URL", severity: "optional" },
  { key: "LOCAL_AUTHORITY_SOURCE_URLS", description: "Comma-separated local authority portal URLs", severity: "optional" },

  // ── Search ───────────────────────────────────────────────────
  {
    key: "MEILISEARCH_HOST",
    description: "MeiliSearch host URL",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
  { key: "MEILISEARCH_API_KEY", description: "MeiliSearch master key", severity: "optional" },

  // ── Storage ──────────────────────────────────────────────────
  { key: "S3_ENDPOINT", description: "S3-compatible storage endpoint", severity: "optional" },
  { key: "S3_BUCKET", description: "S3 bucket name", severity: "optional" },
  { key: "S3_ACCESS_KEY_ID", description: "S3 access key ID", severity: "optional" },
  { key: "S3_SECRET_ACCESS_KEY", description: "S3 secret access key", severity: "optional" },
  { key: "S3_REGION", description: "S3 region", severity: "optional" },

  // ── Email ────────────────────────────────────────────────────
  { key: "RESEND_API_KEY", description: "Resend API key", severity: "optional" },
  { key: "EMAIL_FROM", description: "Sender email address", severity: "optional" },

  // ── Stripe ───────────────────────────────────────────────────
  { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", severity: "optional" },
  { key: "STRIPE_WEBHOOK_SECRET", description: "Stripe webhook signing secret", severity: "optional" },
  { key: "STRIPE_PRICE_STARTER", description: "Stripe Price ID — Starter plan", severity: "optional" },
  { key: "STRIPE_PRICE_GROWTH", description: "Stripe Price ID — Growth plan", severity: "optional" },
  { key: "STRIPE_PRICE_PROFESSIONAL", description: "Stripe Price ID — Professional plan", severity: "optional" },
  { key: "STRIPE_PRICE_ENTERPRISE", description: "Stripe Price ID — Enterprise plan", severity: "optional" },

  // ── Security ─────────────────────────────────────────────────
  { key: "ALLOWED_ORIGINS", description: "Comma-separated allowed CORS origins", severity: "optional" },
  { key: "RATE_LIMIT_WINDOW_MS", description: "Rate limit window in milliseconds", severity: "optional" },
  { key: "RATE_LIMIT_MAX_REQUESTS", description: "Max requests per rate limit window", severity: "optional" },

  // ── Frontend (Vite) ──────────────────────────────────────────
  { key: "VITE_APP_NAME", description: "Frontend app name", severity: "optional" },
  {
    key: "VITE_APP_URL",
    description: "Frontend public URL",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
  {
    key: "VITE_API_URL",
    description: "Backend API URL (used by frontend)",
    severity: "optional",
    validate: (v) => (isValidUrl(v) ? null : "Must be a valid URL"),
  },
]

// ── Run checks ───────────────────────────────────────────────────────────────
console.log("\n  BidIQ Pro — Environment Variable Check\n")

let blocking = 0
let warnings = 0
let passing = 0

for (const check of checks) {
  const value = process.env[check.key]

  if (!value || value.trim() === "") {
    if (check.severity === "required" || check.severity === "secret") {
      console.log(`  ❌  ${check.key}`)
      console.log(`       ${check.description}`)
      console.log(`       MISSING — this will cause errors\n`)
      blocking++
    } else {
      console.log(`  ⚠️   ${check.key}`)
      console.log(`       ${check.description}`)
      console.log(`       Not set — optional, using fallback/demo mode\n`)
      warnings++
    }
    continue
  }

  if (isPlaceholder(value)) {
    if (check.severity === "required" || check.severity === "secret") {
      console.log(`  ❌  ${check.key}`)
      console.log(`       ${check.description}`)
      console.log(`       Still set to placeholder value — replace before using this feature\n`)
      blocking++
    } else {
      console.log(`  ⚠️   ${check.key}`)
      console.log(`       ${check.description}`)
      console.log(`       Placeholder value — integration will use demo mode\n`)
      warnings++
    }
    continue
  }

  if (check.validate) {
    const error = check.validate(value)
    if (error) {
      console.log(`  ❌  ${check.key}`)
      console.log(`       ${check.description}`)
      console.log(`       Invalid: ${error}\n`)
      blocking++
      continue
    }
  }

  console.log(`  ✅  ${check.key}`)
  passing++
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log("\n  ──────────────────────────────────")
console.log(`  ✅  ${passing} variables OK`)
console.log(`  ⚠️   ${warnings} optional variables missing`)
console.log(`  ❌  ${blocking} blocking issues`)
console.log("  ──────────────────────────────────\n")

if (blocking > 0) {
  console.log("  Fix the ❌ issues above before starting the backend.\n")
  process.exit(1)
} else if (warnings > 0) {
  console.log("  App will run in demo/fallback mode for missing integrations.\n")
} else {
  console.log("  All environment variables are set. Ready to launch.\n")
}
