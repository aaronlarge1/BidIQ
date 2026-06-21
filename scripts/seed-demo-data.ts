/**
 * BidIQ Pro — Demo Data Seeder
 * Run: npx tsx scripts/seed-demo-data.ts
 *
 * Seeds the database with demo tenders, company profile, bids, and documents.
 * All seeded records have isDemo: true.
 * Safe to run multiple times — uses upsert logic.
 *
 * Requires: DATABASE_URL in .env
 */

import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env") })

// ── Demo Tenders ─────────────────────────────────────────────────────────────
// These mirror the frontend demo data in src/lib/demo-data.ts
// When the backend database is running, these get stored in the tenders table.

const DEMO_TENDERS = [
  {
    id: "demo-t-001",
    title: "A57 Road Resurfacing and Drainage Improvement — 3 Year Framework",
    buyer: "National Highways",
    buyerType: "highways",
    location: "Sheffield, South Yorkshire",
    region: "Yorkshire & Humber",
    value: 850000,
    valueMax: 1200000,
    deadline: "2026-07-18",
    publishedDate: "2026-06-01",
    category: "highways",
    type: "framework",
    status: "open",
    recommendation: "recommended",
    opportunityScore: 87,
    eligibilityScore: 82,
    smeFlag: true,
    description:
      "National Highways seeks an SME-capable contractor to deliver resurfacing, drainage and line marking works on the A57 corridor. Strong social value weighting.",
    cpvCode: "45233141-9",
    reference: "NH/YH/2026/0714",
    socialValueWeighting: 20,
    framework: "Regional Highways Maintenance Framework",
    isDemo: true,
  },
  {
    id: "demo-t-002",
    title: "Winter Maintenance Services — Gritting and Snow Clearance",
    buyer: "Stockport Metropolitan Borough Council",
    buyerType: "local-authority",
    location: "Stockport, Greater Manchester",
    region: "North West",
    value: 340000,
    deadline: "2026-07-25",
    publishedDate: "2026-06-10",
    category: "highways",
    type: "contract",
    status: "open",
    recommendation: "recommended",
    opportunityScore: 81,
    eligibilityScore: 90,
    smeFlag: true,
    description:
      "Three-year contract for winter gritting, snow clearance and reactive maintenance across the Stockport highway network.",
    isDemo: true,
  },
  {
    id: "demo-t-003",
    title: "Facilities Management — NHS Greater Manchester Estates",
    buyer: "NHS Greater Manchester ICB",
    buyerType: "nhs",
    location: "Manchester",
    region: "North West",
    value: 1200000,
    deadline: "2026-08-05",
    publishedDate: "2026-06-12",
    category: "facilities",
    type: "contract",
    status: "open",
    recommendation: "maybe",
    opportunityScore: 61,
    eligibilityScore: 55,
    smeFlag: false,
    description:
      "Hard FM services across 12 NHS estates sites including planned and reactive maintenance, grounds and cleaning.",
    socialValueWeighting: 15,
    isDemo: true,
  },
  {
    id: "demo-t-004",
    title: "Housing Association Repairs and Maintenance Framework",
    buyer: "Peaks & Plains Housing Trust",
    buyerType: "housing",
    location: "Macclesfield, Cheshire",
    region: "North West",
    value: 750000,
    valueMax: 1500000,
    deadline: "2026-08-10",
    publishedDate: "2026-06-14",
    category: "maintenance",
    type: "framework",
    status: "open",
    recommendation: "recommended",
    opportunityScore: 76,
    eligibilityScore: 80,
    smeFlag: true,
    description:
      "4-year DPS framework for reactive repairs, void works, and planned maintenance across 3,400 social housing properties.",
    isDemo: true,
  },
  {
    id: "demo-t-005",
    title: "Commercial Cleaning — Education Cluster Framework",
    buyer: "Academies Enterprise Trust",
    buyerType: "education",
    location: "East Midlands",
    region: "East Midlands",
    value: 180000,
    deadline: "2026-08-15",
    publishedDate: "2026-06-15",
    category: "cleaning",
    type: "framework",
    status: "open",
    recommendation: "maybe",
    opportunityScore: 58,
    eligibilityScore: 70,
    smeFlag: true,
    description:
      "Daily cleaning services across 8 academy schools in the East Midlands. Safeguarding clearance required for all staff.",
    isDemo: true,
  },
  {
    id: "demo-t-006",
    title: "Net Zero Construction Grant — SME Decarbonisation Fund",
    buyer: "UK Shared Prosperity Fund (UKSPF)",
    buyerType: "grant",
    location: "North West England",
    region: "North West",
    value: 50000,
    valueMax: 150000,
    deadline: "2026-08-01",
    publishedDate: "2026-06-20",
    category: "construction",
    type: "grant",
    status: "open",
    recommendation: "recommended",
    opportunityScore: 72,
    eligibilityScore: 65,
    smeFlag: true,
    description:
      "Capital grant for SME contractors to invest in plant, equipment, and training to support their net zero transition. Matched funding required.",
    isDemo: true,
  },
  {
    id: "demo-t-007",
    title: "Meet the Buyer — NHS Greater Manchester Supply Chain Event",
    buyer: "NHS Greater Manchester ICB",
    buyerType: "nhs",
    location: "Manchester Central Convention Complex",
    region: "North West",
    value: 0,
    deadline: "2026-07-10",
    publishedDate: "2026-06-18",
    category: "facilities",
    type: "meet-the-buyer",
    status: "open",
    recommendation: "recommended",
    opportunityScore: 80,
    eligibilityScore: 100,
    smeFlag: true,
    description:
      "Free supplier engagement event. Meet NHS procurement leads, understand upcoming contract pipelines, and register interest for 2026/27 opportunities.",
    isDemo: true,
  },
  {
    id: "demo-t-008",
    title: "M60 Smart Motorway Emergency Barrier Maintenance",
    buyer: "National Highways",
    buyerType: "highways",
    location: "Greater Manchester",
    region: "North West",
    value: 2100000,
    deadline: "2026-08-22",
    publishedDate: "2026-06-18",
    category: "highways",
    type: "contract",
    status: "open",
    recommendation: "not-recommended",
    opportunityScore: 38,
    eligibilityScore: 30,
    smeFlag: false,
    description:
      "Emergency and planned maintenance of Highways England safety barriers on the M60 ring road. Requires NHSS/RSTA accreditation.",
    isDemo: true,
  },
]

const DEMO_COMPANY = {
  id: "demo-company-001",
  name: "Greenfield Infrastructure Ltd",
  sector: "Construction & Highways",
  turnover: 2800000,
  employees: 42,
  regions: ["North West", "Yorkshire & Humber", "East Midlands"],
  readinessScore: 72,
  isDemo: true,
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seedDemoData() {
  console.log("\n  BidIQ Pro — Demo Data Seeder\n")

  if (!process.env.DATABASE_URL) {
    console.log("  ❌  DATABASE_URL not set in .env")
    console.log("      Either set up a database or run the frontend with VITE_DEMO_MODE=true")
    console.log("      to use the built-in demo data without a database.\n")
    process.exit(0)
  }

  // Dynamic import so the file doesn't fail when database drivers aren't installed
  let client: any
  try {
    const { default: pg } = await import("pg" as any)
    client = new pg.Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()
    console.log("  ✅  Connected to database\n")
  } catch (err: any) {
    console.log("  ❌  Could not connect to database:", err.message)
    console.log("      Run: docker-compose up -d db  or check your DATABASE_URL\n")
    process.exit(1)
  }

  try {
    // Insert demo tenders (upsert by id)
    console.log(`  Seeding ${DEMO_TENDERS.length} demo tenders...`)
    for (const tender of DEMO_TENDERS) {
      await client.query(
        `INSERT INTO tenders (
          id, title, buyer, buyer_type, location, region,
          value, value_max, deadline, published_date,
          category, type, status, recommendation,
          opportunity_score, eligibility_score, sme_flag,
          description, cpv_code, reference, social_value_weighting,
          framework, is_demo
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          updated_at = NOW()`,
        [
          tender.id, tender.title, tender.buyer, tender.buyerType,
          tender.location, tender.region, tender.value,
          (tender as any).valueMax ?? null, tender.deadline,
          tender.publishedDate, tender.category, tender.type,
          tender.status, tender.recommendation, tender.opportunityScore,
          tender.eligibilityScore, tender.smeFlag, tender.description,
          (tender as any).cpvCode ?? null,
          (tender as any).reference ?? null,
          (tender as any).socialValueWeighting ?? null,
          (tender as any).framework ?? null,
          tender.isDemo,
        ]
      )
      console.log(`    ✅  ${tender.title.substring(0, 60)}...`)
    }

    // Insert demo company
    console.log(`\n  Seeding demo company...`)
    await client.query(
      `INSERT INTO companies (id, name, sector, turnover, employees, readiness_score, is_demo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
      [
        DEMO_COMPANY.id, DEMO_COMPANY.name, DEMO_COMPANY.sector,
        DEMO_COMPANY.turnover, DEMO_COMPANY.employees,
        DEMO_COMPANY.readinessScore, DEMO_COMPANY.isDemo,
      ]
    )
    console.log(`    ✅  ${DEMO_COMPANY.name}`)

    console.log("\n  ──────────────────────────────────")
    console.log(`  ✅  Seeded ${DEMO_TENDERS.length} tenders`)
    console.log(`  ✅  Seeded 1 demo company`)
    console.log("  ──────────────────────────────────")
    console.log("\n  Demo data is live. Start the app with: npm run dev\n")

  } catch (err: any) {
    console.log("\n  ❌  Seed failed:", err.message)
    console.log("      Have you run the database migrations yet?")
    console.log("      Run: npm run db:migrate  then try seeding again.\n")
  } finally {
    await client.end()
  }
}

seedDemoData()
