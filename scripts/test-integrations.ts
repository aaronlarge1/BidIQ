/**
 * BidIQ Pro — Integration Tester
 * Run: npx tsx scripts/test-integrations.ts
 *
 * Tests live connections to all configured third-party services.
 * Skips integrations where keys are missing or placeholder values.
 */

import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env") })
config({ path: resolve(process.cwd(), ".env.local") })

const PLACEHOLDER_PATTERNS = [/your-.*key/i, /change-this/i, /placeholder/i, /sk-proj-your/i]
const isPlaceholder = (val?: string) =>
  !val || PLACEHOLDER_PATTERNS.some((p) => p.test(val))

type TestResult = {
  name: string
  status: "connected" | "not_configured" | "error"
  message: string
  latencyMs?: number
}

const results: TestResult[] = []

function log(result: TestResult) {
  const icon =
    result.status === "connected" ? "✅" : result.status === "not_configured" ? "⚠️ " : "❌"
  const latency = result.latencyMs ? ` (${result.latencyMs}ms)` : ""
  console.log(`  ${icon}  ${result.name}${latency}`)
  console.log(`       ${result.message}`)
  results.push(result)
}

// ── Database ──────────────────────────────────────────────────────────────────
async function testDatabase() {
  const url = process.env.DATABASE_URL
  if (isPlaceholder(url)) {
    log({ name: "Database (PostgreSQL)", status: "not_configured", message: "DATABASE_URL not set" })
    return
  }
  const start = Date.now()
  try {
    const { default: pg } = await import("pg" as any)
    const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 5000 })
    await client.connect()
    const { rows } = await client.query("SELECT version()")
    await client.end()
    log({
      name: "Database (PostgreSQL)",
      status: "connected",
      message: rows[0].version.split(" ").slice(0, 2).join(" "),
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "Database (PostgreSQL)", status: "error", message: err.message })
  }
}

// ── OpenAI ────────────────────────────────────────────────────────────────────
async function testOpenAI() {
  const key = process.env.OPENAI_API_KEY
  if (isPlaceholder(key)) {
    log({ name: "OpenAI", status: "not_configured", message: "OPENAI_API_KEY not set — AI features in demo mode" })
    return
  }
  const start = Date.now()
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    const data = await res.json() as any
    const model = process.env.OPENAI_MODEL ?? "gpt-4o"
    const found = data.data?.some((m: any) => m.id === model)
    log({
      name: "OpenAI",
      status: "connected",
      message: `Connected. Model "${model}" ${found ? "available" : "not found in account"}.`,
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "OpenAI", status: "error", message: err.message })
  }
}

// ── Contracts Finder ──────────────────────────────────────────────────────────
async function testContractsFinder() {
  const key = process.env.CONTRACTS_FINDER_API_KEY
  if (isPlaceholder(key)) {
    log({ name: "Contracts Finder API", status: "not_configured", message: "CONTRACTS_FINDER_API_KEY not set — using demo tenders" })
    return
  }
  const start = Date.now()
  try {
    const res = await fetch(
      "https://www.contractsfinder.service.gov.uk/Published/Notices/PublishedNotice/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "BidIQ-Pro/1.0" },
        body: JSON.stringify({ searchCriteria: { pageSize: 1, startIndex: 0 } }),
      }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    log({
      name: "Contracts Finder API",
      status: "connected",
      message: "API reachable",
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "Contracts Finder API", status: "error", message: err.message })
  }
}

// ── MeiliSearch ───────────────────────────────────────────────────────────────
async function testMeiliSearch() {
  const host = process.env.MEILISEARCH_HOST
  const key = process.env.MEILISEARCH_API_KEY
  if (isPlaceholder(host) || !host) {
    log({ name: "MeiliSearch", status: "not_configured", message: "MEILISEARCH_HOST not set — using in-memory search" })
    return
  }
  const start = Date.now()
  try {
    const res = await fetch(`${host}/health`, {
      headers: key ? { Authorization: `Bearer ${key}` } : {},
    })
    const data = await res.json() as any
    log({
      name: "MeiliSearch",
      status: data.status === "available" ? "connected" : "error",
      message: `Status: ${data.status ?? "unknown"}`,
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "MeiliSearch", status: "error", message: err.message })
  }
}

// ── Stripe ────────────────────────────────────────────────────────────────────
async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (isPlaceholder(key)) {
    log({ name: "Stripe", status: "not_configured", message: "STRIPE_SECRET_KEY not set — payments in demo mode" })
    return
  }
  const start = Date.now()
  try {
    const res = await fetch("https://api.stripe.com/v1/account", {
      headers: { Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    const data = await res.json() as any
    const mode = key!.startsWith("sk_live") ? "LIVE" : "TEST"
    log({
      name: "Stripe",
      status: "connected",
      message: `Connected (${mode} mode). Account: ${data.display_name ?? data.id}`,
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "Stripe", status: "error", message: err.message })
  }
}

// ── Resend ────────────────────────────────────────────────────────────────────
async function testResend() {
  const key = process.env.RESEND_API_KEY
  if (isPlaceholder(key)) {
    log({ name: "Resend (Email)", status: "not_configured", message: "RESEND_API_KEY not set — emails logged to console" })
    return
  }
  const start = Date.now()
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    const data = await res.json() as any
    log({
      name: "Resend (Email)",
      status: "connected",
      message: `Connected. Domains: ${data.data?.map((d: any) => d.name).join(", ") ?? "none configured"}`,
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "Resend (Email)", status: "error", message: err.message })
  }
}

// ── S3 Storage ────────────────────────────────────────────────────────────────
async function testS3() {
  const endpoint = process.env.S3_ENDPOINT
  const keyId = process.env.S3_ACCESS_KEY_ID
  if (isPlaceholder(endpoint) || isPlaceholder(keyId)) {
    log({ name: "S3 Storage", status: "not_configured", message: "S3_ENDPOINT or S3_ACCESS_KEY_ID not set — using local disk storage" })
    return
  }
  // Just check the endpoint is reachable — full auth test requires AWS SDK
  const start = Date.now()
  try {
    const url = new URL(endpoint!)
    const res = await fetch(url.origin, { method: "HEAD" })
    log({
      name: "S3 Storage",
      status: "connected",
      message: `Endpoint reachable: ${url.origin} (HTTP ${res.status})`,
      latencyMs: Date.now() - start,
    })
  } catch (err: any) {
    log({ name: "S3 Storage", status: "error", message: `Endpoint unreachable: ${err.message}` })
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n  BidIQ Pro — Integration Status Check\n")
  console.log("  Testing all configured integrations...\n")

  await testDatabase()
  await testOpenAI()
  await testContractsFinder()
  await testMeiliSearch()
  await testStripe()
  await testResend()
  await testS3()

  const connected = results.filter((r) => r.status === "connected").length
  const notConfigured = results.filter((r) => r.status === "not_configured").length
  const errors = results.filter((r) => r.status === "error").length

  console.log("\n  ──────────────────────────────────")
  console.log(`  ✅  ${connected} integrations connected`)
  console.log(`  ⚠️   ${notConfigured} not configured (demo fallback active)`)
  console.log(`  ❌  ${errors} errors`)
  console.log("  ──────────────────────────────────")

  if (errors > 0) {
    console.log("\n  Check the ❌ errors above — these indicate configuration problems.\n")
    process.exit(1)
  } else {
    console.log(`\n  The app will run with ${notConfigured > 0 ? "demo mode for unconfigured integrations" : "all integrations live"}.\n`)
  }
}

main()
