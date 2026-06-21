import { useState } from "react"
import {
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  CheckCircle2,
  Star,
  Play,
  FileText,
  Search,
  Tag,
  Download,
  Award,
  TrendingUp,
  Shield,
  Truck,
  PoundSterling,
  Users,
  Scale,
  ListChecks,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// ─── Types ───────────────────────────────────────────────────────────────────

type Level = "Beginner" | "Intermediate" | "Advanced"
type GuideCategory =
  | "Getting Started"
  | "Frameworks"
  | "Highways"
  | "Social Value"
  | "Legal"
  | "Finance"
  | "Bid Writing"
  | "Compliance"

interface Guide {
  id: string
  title: string
  category: GuideCategory
  readTime: string
  level: Level
  description: string
  topics: string[]
  note?: string
  hasDownload?: boolean
  icon: React.ReactNode
}

interface Template {
  id: string
  title: string
  formats: string[]
  description: string
  icon: React.ReactNode
}

// ─── Data ────────────────────────────────────────────────────────────────────

const GUIDES: Guide[] = [
  {
    id: "how-public-procurement-works",
    title: "How Public Procurement Works",
    category: "Getting Started",
    readTime: "15 min read",
    level: "Beginner",
    description:
      "Learn the basics: public contracts notice, evaluation criteria, standstill periods and award.",
    topics: ["PCR 2015", "Procurement Act 2023", "Find a Tender Service", "Contracts Finder"],
    icon: <BookOpen className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "how-framework-contracts-work",
    title: "How Framework Contracts Work",
    category: "Frameworks",
    readTime: "20 min read",
    level: "Intermediate",
    description:
      "What is a framework, DPS and dynamic purchasing system? How to get onto one and use it.",
    topics: [
      "CCS frameworks",
      "NHS Shared Business Services",
      "regional bodies",
      "call-off contracts",
    ],
    icon: <TrendingUp className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "highways-contracts-explained",
    title: "Highways Contracts Explained",
    category: "Highways",
    readTime: "25 min read",
    level: "Intermediate",
    description:
      "National Highways, local authority highways, StreetWorks, NHSF framework and SME Gateway.",
    topics: ["DMRB", "MCHW", "NHSF", "A-road maintenance", "regional frameworks"],
    icon: <Truck className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "social-value-explained",
    title: "Social Value Explained",
    category: "Social Value",
    readTime: "15 min read",
    level: "Beginner",
    description:
      "What is social value, why it matters and how to use it to win contracts.",
    topics: ["Social Value Act 2012", "Social Value Model", "Themed Commitments", "PPN 06/20"],
    icon: <Users className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "tupe-basics",
    title: "TUPE Basics for Contract Transfers",
    category: "Legal",
    readTime: "20 min read",
    level: "Intermediate",
    description:
      "What is TUPE, when does it apply, and how to budget for it in your bid price.",
    topics: [],
    note: "Essential for FM, cleaning and care contracts",
    icon: <Scale className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "how-to-price-contracts",
    title: "How to Price Public Sector Contracts",
    category: "Finance",
    readTime: "20 min read",
    level: "Beginner",
    description:
      "Build-up pricing, risk allowances, overheads, profit margins and what buyers expect.",
    topics: ["Schedule of rates", "NRM2", "Tender Price Index", "market testing"],
    icon: <PoundSterling className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "bid-writing-basics",
    title: "Bid Writing Basics",
    category: "Bid Writing",
    readTime: "30 min read",
    level: "Beginner",
    description:
      "Win more bids: how to write quality responses, answer the question, use evidence and score higher.",
    topics: ["STAR method", "word limits", "evidence", "differentiators", "common mistakes"],
    icon: <Award className="h-5 w-5 text-[#1e3a5f]" />,
  },
  {
    id: "compliance-checklist",
    title: "Compliance Checklist for Bidding",
    category: "Compliance",
    readTime: "10 min read",
    level: "Beginner",
    description:
      "Everything you need in your compliance vault before bidding for different contract types.",
    topics: [],
    hasDownload: true,
    icon: <ListChecks className="h-5 w-5 text-[#1e3a5f]" />,
  },
]

const TEMPLATES: Template[] = [
  {
    id: "social-value-statement",
    title: "Social Value Statement Template",
    formats: ["Word", "PDF"],
    description: "Ready-to-use template covering all five themes of the Social Value Model.",
    icon: <Users className="h-5 w-5 text-[#2a7f4f]" />,
  },
  {
    id: "bid-qualification-checklist",
    title: "Bid Qualification Checklist",
    formats: ["Excel"],
    description:
      "Quickly assess whether an opportunity is worth pursuing before you invest time.",
    icon: <CheckCircle2 className="h-5 w-5 text-[#2a7f4f]" />,
  },
  {
    id: "risk-register",
    title: "Risk Register Template",
    formats: ["Excel"],
    description: "Identify, rate and mitigate delivery risks for inclusion in your bid.",
    icon: <Shield className="h-5 w-5 text-[#2a7f4f]" />,
  },
  {
    id: "hs-method-statement",
    title: "H&S Method Statement Template",
    formats: ["Word", "PDF"],
    description:
      "Comprehensive H&S method statement structure for construction and FM contracts.",
    icon: <FileText className="h-5 w-5 text-[#2a7f4f]" />,
  },
  {
    id: "pricing-build-up",
    title: "Pricing Build-up Spreadsheet",
    formats: ["Excel"],
    description: "Calculate your tender price with overheads, risk and profit built in.",
    icon: <PoundSterling className="h-5 w-5 text-[#2a7f4f]" />,
  },
  {
    id: "mobilisation-checklist",
    title: "Contract Mobilisation Checklist",
    formats: ["Word", "PDF"],
    description:
      "Step-by-step checklist to hit the ground running when you win a contract.",
    icon: <ListChecks className="h-5 w-5 text-[#2a7f4f]" />,
  },
]

const CATEGORY_TABS = [
  "All",
  "Getting Started",
  "Bid Writing",
  "Compliance",
  "Highways",
  "Finance",
  "Social Value",
  "Legal",
] as const

const LEVEL_COLORS: Record<Level, string> = {
  Beginner: "bg-green-100 text-green-800 border-green-200",
  Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
  Advanced: "bg-red-100 text-red-800 border-red-200",
}

const RECOMMENDED = [
  {
    id: "highways-contracts-explained",
    label: "Highways Readiness",
    reason: "Relevant to your profile",
    borderColor: "border-[#1e3a5f]/20",
    bg: "bg-[#f0f4f8]",
  },
  {
    id: "social-value-explained",
    label: "Social Value",
    reason: "High weighting on most contracts",
    borderColor: "border-[#2a7f4f]/20",
    bg: "bg-[#f0f9f4]",
  },
  {
    id: "tupe-basics",
    label: "TUPE Basics",
    reason: "Essential for FM contract bids",
    borderColor: "border-amber-200",
    bg: "bg-amber-50",
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-slate-600">
        {rating} ({count} ratings)
      </span>
    </div>
  )
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${LEVEL_COLORS[level]}`}
    >
      {level}
    </span>
  )
}

function GuideCard({
  guide,
  onOpen,
}: {
  guide: Guide
  onOpen: (id: string) => void
}) {
  return (
    <Card className="group flex flex-col border border-slate-200 hover:border-[#1e3a5f]/40 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#f0f4f8] p-2">{guide.icon}</div>
            <Badge
              variant="outline"
              className="text-xs border-[#1e3a5f]/30 text-[#1e3a5f] bg-[#f0f4f8]"
            >
              {guide.category}
            </Badge>
          </div>
          <LevelBadge level={guide.level} />
        </div>
        <CardTitle className="text-base text-[#1e3a5f] leading-snug mt-2 group-hover:text-[#2a7f4f] transition-colors">
          {guide.title}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{guide.readTime}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <p className="text-sm text-slate-600 leading-relaxed">{guide.description}</p>

        {guide.note && (
          <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            <strong>Note:</strong> {guide.note}
          </div>
        )}

        {guide.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {guide.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                <Tag className="h-2.5 w-2.5" />
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs"
            onClick={() => onOpen(guide.id)}
          >
            <Play className="h-3 w-3 mr-1" />
            Read Guide
          </Button>
          {guide.hasDownload && (
            <Button
              size="sm"
              variant="outline"
              className="border-[#2a7f4f] text-[#2a7f4f] hover:bg-[#f0f9f4] text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Checklist
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="group flex flex-col border border-slate-200 hover:border-[#2a7f4f]/40 hover:shadow-md transition-all duration-200">
      <CardContent className="pt-5 pb-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#f0f9f4] p-2">{template.icon}</div>
          <div className="flex gap-1.5">
            {template.formats.map((f) => (
              <span
                key={f}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-[#1e3a5f] text-sm leading-snug">{template.title}</p>
          <p className="text-xs text-slate-500 mt-1">{template.description}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-auto border-[#2a7f4f] text-[#2a7f4f] hover:bg-[#f0f9f4] text-xs w-full"
        >
          <Download className="h-3 w-3 mr-1.5" />
          Download Free
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Expanded Guide Reader ────────────────────────────────────────────────────

function ProcurementGuideReader({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-[#1e3a5f]/20 bg-white shadow-lg overflow-hidden">
      {/* Reader header */}
      <div className="flex items-center justify-between bg-[#1e3a5f] px-6 py-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">How Public Procurement Works</span>
          <Badge className="bg-white/20 text-white border-0 text-xs">Beginner · 15 min</Badge>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close guide"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress strip */}
      <div className="px-6 py-3 bg-[#f0f4f8] flex items-center gap-3">
        <span className="text-xs text-slate-500">Reading progress</span>
        <Progress value={0} className="h-1.5 flex-1" />
        <span className="text-xs font-medium text-slate-600">0 / 4 sections</span>
      </div>

      {/* Accordion content */}
      <div className="px-6 py-6">
        <Accordion type="single" collapsible className="space-y-3">

          {/* Section 1 */}
          <AccordionItem
            value="what-is-procurement"
            className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-[#1e3a5f]/40"
          >
            <AccordionTrigger className="text-[#1e3a5f] font-semibold hover:no-underline">
              1 · What is public procurement?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pt-2 pb-4 space-y-3 text-slate-700">
              <p>
                Public procurement is the process by which public bodies — central government
                departments, NHS trusts, local councils, schools, housing associations and more —
                purchase goods, works and services from the private sector. In the UK, public
                bodies spend over £300 billion per year this way, making it one of the most
                significant economic activities in the country.
              </p>
              <p>
                The rules governing how this spending must happen exist to ensure fairness,
                transparency and value for money. Historically, the main legislative framework
                was the <strong>Public Contracts Regulations 2015 (PCR 2015)</strong>, which
                implemented an EU directive. Since Brexit, the UK has legislated its own regime:
                the <strong>Procurement Act 2023</strong>, which came into force in February
                2025. The new Act simplifies some processes and introduces a greater emphasis
                on SME access, transparency registers and supplier debarment.
              </p>
              <p>
                For SMEs, the key takeaway is that contracting authorities are legally required
                to advertise contracts above certain financial thresholds (currently £30,000 for
                central government, £100,000 for other public bodies under the new Act) on
                official portals. Below those thresholds, authorities should still follow sound
                procurement principles but have more flexibility.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2 */}
          <AccordionItem
            value="where-to-find"
            className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-[#1e3a5f]/40"
          >
            <AccordionTrigger className="text-[#1e3a5f] font-semibold hover:no-underline">
              2 · Where to find contracts (Find a Tender, Contracts Finder)
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pt-2 pb-4 space-y-3 text-slate-700">
              <p>
                The two primary portals for finding UK public sector contracts are{" "}
                <strong>Find a Tender Service (FTS)</strong> and{" "}
                <strong>Contracts Finder</strong>. Understanding which to use — and when — will
                save you hours every week.
              </p>
              <p>
                <strong>Find a Tender Service</strong> (find-tender.service.gov.uk) replaced
                the EU's OJEU after Brexit. It is used for contracts that exceed the Procurement
                Act thresholds — typically works contracts above £5.3m and service/supply
                contracts above £213k for central government. You will see Prior Information
                Notices (PINs), Contract Notices and Contract Award Notices here.
              </p>
              <p>
                <strong>Contracts Finder</strong> (contractsfinder.service.gov.uk) covers
                below-threshold contracts for central government (above £10,000) and for other
                public bodies (above £25,000). It is the best daily starting point for SMEs
                because it captures a broader range of opportunities, including quick-win
                smaller contracts that larger suppliers ignore.
              </p>
              <p>
                Beyond these portals, many buyers publish to their own e-procurement portals
                (e.g. ProContract, Jaggaer, Atamis, Proactis) and regional portals such as{" "}
                <strong>The Chest</strong> (North West), <strong>YORtender</strong> (Yorkshire),
                and <strong>London Tenders Portal</strong>. Setting up alerts across all
                relevant portals — or using an aggregator like BidIQ — is essential to avoid
                missing opportunities.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Section 3 */}
          <AccordionItem
            value="evaluation"
            className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-[#1e3a5f]/40"
          >
            <AccordionTrigger className="text-[#1e3a5f] font-semibold hover:no-underline">
              3 · How contracts are evaluated (quality/price split, PQQ/ITT)
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pt-2 pb-4 space-y-3 text-slate-700">
              <p>
                Most public contracts are awarded on the basis of the{" "}
                <strong>Most Economically Advantageous Tender (MEAT)</strong> — meaning neither
                pure lowest price nor pure highest quality wins outright. Buyers define a
                quality/price weighting, such as 60% quality / 40% price, and evaluate each
                tender against both dimensions.
              </p>
              <p>
                The procurement process is typically split into two stages. The{" "}
                <strong>Pre-Qualification Questionnaire (PQQ)</strong> — now sometimes called a
                Selection Questionnaire (SQ) — filters in suppliers who meet minimum standards:
                financial standing, insurance, relevant experience, H&S policy, equalities
                compliance and more. Only those who pass the PQQ are invited to the next stage.
              </p>
              <p>
                The <strong>Invitation to Tender (ITT)</strong> is where the real bid is
                written. You will typically be asked to respond to quality questions
                (methodology, staffing, social value, mobilisation) and submit a priced
                schedule. Quality responses are scored by evaluators — often using a 0–4 or
                0–10 scale — and then combined with the price score using the published
                weighting.
              </p>
              <p>
                Under the Procurement Act 2023, buyers must also publish their evaluation
                criteria and award decision in the new{" "}
                <strong>Procurement Act Notices</strong> transparency framework, giving SMEs
                better insight into why they won or lost.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Section 4 */}
          <AccordionItem
            value="timeline"
            className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-[#1e3a5f]/40"
          >
            <AccordionTrigger className="text-[#1e3a5f] font-semibold hover:no-underline">
              4 · The procurement timeline
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pt-2 pb-4 text-slate-700">
              <p className="mb-4">
                A typical above-threshold procurement follows a predictable sequence of stages.
                Understanding these timelines helps you plan resource and avoid being caught
                unprepared.
              </p>
              <ol className="space-y-4 list-none pl-0">
                {[
                  {
                    stage: "Prior Information Notice (PIN)",
                    detail:
                      "Optional early-warning notice. Buyers publish a PIN to signal upcoming procurement, sometimes to reduce minimum tender periods later. Useful for market engagement.",
                  },
                  {
                    stage: "Contract Notice",
                    detail:
                      "Formal publication of the opportunity. The clock starts here. Minimum tender periods apply (typically 25–40 days for the Open procedure).",
                  },
                  {
                    stage: "PQQ / Selection Stage",
                    detail:
                      "Suppliers complete the pre-qualification questionnaire. Buyers evaluate and shortlist — usually 3–6 bidders — within 2–4 weeks of the PQQ deadline.",
                  },
                  {
                    stage: "ITT Issued",
                    detail:
                      "Shortlisted suppliers receive the full tender documents, pricing schedules and quality questions. Clarification periods allow Q&A with the buyer.",
                  },
                  {
                    stage: "Tender Submission",
                    detail:
                      "All responses must be submitted via the portal by the stated deadline. Late submissions are almost always rejected automatically.",
                  },
                  {
                    stage: "Evaluation",
                    detail:
                      "Buyer evaluators score quality responses and price. Moderation and consensus meetings resolve scoring disagreements. This often takes 3–6 weeks.",
                  },
                  {
                    stage: "Standstill Period",
                    detail:
                      "Before contract award, buyers must notify all bidders of the decision and observe a mandatory 8-working-day standstill (Alcatel period), allowing unsuccessful bidders to challenge.",
                  },
                  {
                    stage: "Contract Award",
                    detail:
                      "The contract is formally awarded and a Contract Award Notice published. Mobilisation begins — often with a 4–12 week period before service commencement.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[#1e3a5f]">{item.stage}</p>
                      <p className="mt-0.5 text-slate-600">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f0f9f4] border border-[#2a7f4f]/20 px-5 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#2a7f4f]" />
            <span className="text-sm font-medium text-[#1e3a5f]">
              Mark guide as complete to track your progress
            </span>
          </div>
          <Button className="bg-[#2a7f4f] hover:bg-[#236b42] text-white text-sm">
            Mark Complete
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProcurementAcademy() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [openGuideId, setOpenGuideId] = useState<string | null>(null)

  const completedCount = 2
  const totalCount = 8
  const progressPct = Math.round((completedCount / totalCount) * 100)

  const filteredGuides = GUIDES.filter((g) => {
    const matchesCategory =
      activeCategory === "All" || g.category === activeCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      !query ||
      g.title.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      g.topics.some((t) => t.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })

  function handleOpenGuide(id: string) {
    setOpenGuideId(id)
    setTimeout(() => {
      document.getElementById("guide-reader")?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  const showReader = openGuideId !== null && (activeCategory === "All" || activeCategory === "Getting Started")

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── 1. HEADER ──────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1e3a5f] p-2.5">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#1e3a5f]">Procurement Academy</h1>
                <Badge className="bg-[#2a7f4f] text-white border-0 text-xs px-2.5">DEMO</Badge>
              </div>
              <p className="text-slate-500 text-base max-w-2xl">
                Free guides, tools and templates to help SMEs find, bid for and win public
                sector contracts.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search guides, templates, topics..."
              className="pl-10 bg-white border-slate-200 focus-visible:ring-[#1e3a5f]/30 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── 2. PROGRESS CARD ───────────────────────────────────────────── */}
        <Card className="border border-[#1e3a5f]/20 bg-gradient-to-r from-[#1e3a5f] to-[#2a5f8f] text-white">
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                  <span className="font-semibold text-lg">Your Learning Progress</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">
                      {completedCount} of {totalCount} guides completed
                    </span>
                    <span className="font-bold text-white">{progressPct}%</span>
                  </div>
                  <Progress
                    value={progressPct}
                    className="h-2.5 bg-white/20 [&>div]:bg-[#2a7f4f]"
                  />
                </div>
                <p className="text-blue-200 text-sm">
                  Complete all guides to earn your{" "}
                  <strong className="text-white">SME Procurement Certification</strong>.
                </p>
              </div>
              <Button className="bg-white text-[#1e3a5f] hover:bg-slate-100 font-semibold shrink-0">
                Continue Learning
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── 3 + 4 + 5. CATEGORY TABS + FEATURED + GUIDE GRID ─────────── */}
        <Tabs
          value={activeCategory}
          onValueChange={(val) => {
            setActiveCategory(val)
            setOpenGuideId(null)
          }}
          className="space-y-6"
        >
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white border border-slate-200 p-1 rounded-xl w-full sm:w-auto">
            {CATEGORY_TABS.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORY_TABS.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-6 mt-0">
              {/* Featured guide — only on "All" and "Getting Started" */}
              {(cat === "All" || cat === "Getting Started") && !searchQuery && (
                <Card className="border-2 border-[#1e3a5f]/30 bg-gradient-to-br from-[#f0f4f8] to-white overflow-hidden">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#1e3a5f] text-white border-0 text-xs">
                            Featured Guide
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-[#2a7f4f] text-[#2a7f4f] text-xs"
                          >
                            Getting Started
                          </Badge>
                          <LevelBadge level="Beginner" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#1e3a5f] leading-tight">
                            Complete Guide to Public Sector Bidding for SMEs
                          </h2>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              45-minute read
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              12 sections
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Everything you need to know about finding, bidding for and winning
                          government contracts as an SME. Covers procurement law, framework
                          contracts, qualification criteria and bid writing best practice — from
                          first principles to submission.
                        </p>
                        <StarRating rating={4.9} count={127} />
                        <div className="flex items-center gap-3 pt-1 flex-wrap">
                          <Button
                            className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
                            onClick={() => handleOpenGuide("how-public-procurement-works")}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Guide
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button
                            variant="outline"
                            className="border-[#1e3a5f]/30 text-[#1e3a5f] hover:bg-[#f0f4f8]"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                      {/* Decorative panel */}
                      <div className="hidden lg:flex lg:w-56 flex-col items-center justify-center rounded-xl bg-[#1e3a5f] p-6 gap-3">
                        <GraduationCap className="h-14 w-14 text-white/25" />
                        <div className="text-center">
                          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                            Completion Award
                          </p>
                          <p className="text-white font-bold text-sm">
                            SME Procurement Fundamentals
                          </p>
                        </div>
                        <div className="w-full rounded-full bg-white/10 h-1.5 mt-2">
                          <div className="bg-[#2a7f4f] h-1.5 rounded-full w-0" />
                        </div>
                        <p className="text-white/40 text-xs">0% complete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inline guide reader */}
              {showReader && cat === activeCategory && (
                <div id="guide-reader">
                  <ProcurementGuideReader onClose={() => setOpenGuideId(null)} />
                </div>
              )}

              {/* Guide cards grid */}
              {filteredGuides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Search className="h-8 w-8" />
                  <p className="font-medium">No guides match your search.</p>
                  <p className="text-sm">Try a different keyword or clear your filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredGuides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} onOpen={handleOpenGuide} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* ── 6. TEMPLATES SECTION ───────────────────────────────────────── */}
        <section className="space-y-5">
          <Separator />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2a7f4f]" />
                Free Templates &amp; Downloads
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Ready-to-use documents to accelerate your next bid.
              </p>
            </div>
            <Badge className="bg-[#f0f9f4] text-[#2a7f4f] border border-[#2a7f4f]/30 text-xs">
              {TEMPLATES.length} templates
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>

        {/* ── 8. RECOMMENDED FOR YOU ─────────────────────────────────────── */}
        <section className="space-y-4">
          <Separator />
          <div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">Recommended for You</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Based on your profile: highways work, FM contracts and social value commitments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RECOMMENDED.map((rec) => {
              const guide = GUIDES.find((g) => g.id === rec.id)
              if (!guide) return null
              return (
                <Card
                  key={rec.id}
                  className={`border ${rec.borderColor} ${rec.bg} cursor-pointer hover:shadow-md transition-all duration-200`}
                  onClick={() => {
                    setActiveCategory("All")
                    handleOpenGuide(rec.id)
                  }}
                >
                  <CardContent className="pt-4 pb-4 flex items-start gap-3">
                    <div className="rounded-lg bg-white/80 p-2 shrink-0">{guide.icon}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1e3a5f] leading-snug">
                        {guide.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{rec.reason}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                        <span className="mx-0.5">·</span>
                        <LevelBadge level={guide.level} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── FOOTER CTA ─────────────────────────────────────────────────── */}
        <section>
          <Separator />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2">
            <div>
              <p className="font-semibold text-[#1e3a5f]">Want personalised bid support?</p>
              <p className="text-slate-500 text-sm">
                BidIQ Pro uses AI to match opportunities and draft responses tailored to your
                business.
              </p>
            </div>
            <Button className="bg-[#2a7f4f] hover:bg-[#236b42] text-white shrink-0">
              Upgrade to Pro
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
