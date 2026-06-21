/**
 * BidIQ Pro — Documentation Generator
 * Run: npx tsx scripts/create-docs.ts
 *
 * Generates a summary of the project structure, env vars, and integration status.
 * Output goes to docs/project-status.md (gitignored — contains runtime info).
 */

import { config } from "dotenv"
import { resolve, join } from "path"
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs"

config({ path: resolve(process.cwd(), ".env") })
config({ path: resolve(process.cwd(), ".env.local") })

const PLACEHOLDER = /your-.*key|change-this|placeholder|sk-proj-your|pk_test_your/i
const isSet = (key: string) => {
  const v = process.env[key]
  return v && v.trim() !== "" && !PLACEHOLDER.test(v)
}

function countFiles(dir: string, ext = ".tsx"): number {
  if (!existsSync(dir)) return 0
  let count = 0
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const full = join(d, f)
      if (f === "node_modules") continue
      if (statSync(full).isDirectory()) walk(full)
      else if (f.endsWith(ext)) count++
    }
  }
  walk(dir)
  return count
}

const integrations = [
  { name: "PostgreSQL", key: "DATABASE_URL", required: true },
  { name: "OpenAI", key: "OPENAI_API_KEY", required: false },
  { name: "Contracts Finder", key: "CONTRACTS_FINDER_API_KEY", required: false },
  { name: "Find a Tender", key: "FIND_A_TENDER_API_KEY", required: false },
  { name: "MeiliSearch", key: "MEILISEARCH_HOST", required: false },
  { name: "Stripe", key: "STRIPE_SECRET_KEY", required: false },
  { name: "Resend Email", key: "RESEND_API_KEY", required: false },
  { name: "S3 Storage", key: "S3_ACCESS_KEY_ID", required: false },
]

const tsxCount = countFiles("src", ".tsx")
const tsCount = countFiles("src", ".ts")
const now = new Date().toISOString()

const lines: string[] = [
  "# BidIQ Pro — Project Status",
  "",
  `Generated: ${now}`,
  "",
  "## Source Files",
  "",
  `- \`.tsx\` component files: **${tsxCount}**`,
  `- \`.ts\` utility files: **${tsCount}**`,
  "",
  "## Integration Status",
  "",
  "| Integration | Configured | Required |",
  "|---|---|---|",
]

for (const i of integrations) {
  const configured = isSet(i.key) ? "✅ Yes" : "❌ No"
  const required = i.required ? "Yes" : "No (demo fallback)"
  lines.push(`| ${i.name} | ${configured} | ${required} |`)
}

lines.push(
  "",
  "## Environment Files",
  "",
)

const envFiles = [".env", ".env.local", ".env.example", ".env.local.example"]
for (const f of envFiles) {
  const exists = existsSync(join(process.cwd(), f))
  lines.push(`- \`${f}\`: ${exists ? "✅ exists" : "❌ missing"}`)
}

lines.push(
  "",
  "## Key Documentation",
  "",
  "- [README.md](../README.md) — Project overview",
  "- [SETUP.md](../SETUP.md) — Local setup guide",
  "- [DEPLOYMENT.md](../DEPLOYMENT.md) — Render deployment guide",
  "- [API_INTEGRATIONS.md](../API_INTEGRATIONS.md) — API reference",
  "- [SECURITY.md](../SECURITY.md) — Security policy",
  "",
  "## Scripts",
  "",
  "| Script | Command |",
  "|---|---|",
  "| Check env vars | `npx tsx scripts/check-env.ts` |",
  "| Seed demo data | `npx tsx scripts/seed-demo-data.ts` |",
  "| Test integrations | `npx tsx scripts/test-integrations.ts` |",
  "| Local setup | `bash scripts/setup-local.sh` |",
  "| Generate this doc | `npx tsx scripts/create-docs.ts` |",
  "",
  "> This file is auto-generated and gitignored. Re-run to refresh.",
)

const outDir = join(process.cwd(), "docs")
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const outPath = join(outDir, "project-status.md")
writeFileSync(outPath, lines.join("\n"), "utf8")

console.log(`\n  ✅  Project status written to docs/project-status.md\n`)
console.log(`  ${tsxCount} component files, ${tsCount} utility files`)
console.log(
  `  ${integrations.filter((i) => isSet(i.key)).length}/${integrations.length} integrations configured\n`
)
