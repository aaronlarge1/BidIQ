import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  PoundSterling,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Shield,
  Zap,
  Bot,
  BookmarkPlus,
  ThumbsDown,
  ExternalLink,
} from "lucide-react"
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DEMO_TENDERS } from "@/lib/demo-data"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import type { Tender } from "@/types"

// ─────────────────────────────────────────────────────────────────────────────
// Static intelligence data overlaid on top of the Tender record
// ─────────────────────────────────────────────────────────────────────────────

interface DocumentItem {
  label: string
  have: boolean
  note?: string
}

const REQUIRED_DOCUMENTS: DocumentItem[] = [
  { label: "PQQ / Selection Questionnaire", have: true },
  { label: "Public Liability Insurance £10m+", have: true },
  { label: "Employers Liability Insurance", have: true },
  { label: "ISO 9001", have: true },
  { label: "ISO 14001", have: true },
  { label: "Cyber Essentials", have: false, note: "MISSING — obtain before submission" },
  { label: "GDPR Policy 2024+", have: false, note: "EXPIRED — renew immediately" },
  { label: "Social Value Statement", have: true },
  { label: "Method Statement (highways)", have: true },
  { label: "Health & Safety Policy", have: true },
  { label: "Previous Contract References ×2", have: true },
  { label: "Financial Accounts (last 2 years)", have: true },
]

interface SimilarOpportunity {
  id: string
  title: string
  buyer: string
  value: string
  score: number
}

const SIMILAR_OPPORTUNITIES: SimilarOpportunity[] = [
  {
    id: "t-002",
    title: "Network Rail Track Renewal — East Midlands",
    buyer: "Network Rail",
    value: "£1.2m–£3.8m",
    score: 79,
  },
  {
    id: "t-003",
    title: "Highways Maintenance Framework — North West",
    buyer: "Transport for the North",
    value: "£800k–£2.4m",
    score: 74,
  },
  {
    id: "t-004",
    title: "Local Highway Works — Greater Manchester",
    buyer: "Transport for Greater Manchester",
    value: "£250k–£600k",
    score: 68,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ScoreDial({
  value,
  label,
  color,
}: {
  value: number
  label: string
  color: string
}) {
  const data = [
    { value, fill: color },
    { value: 100 - value, fill: "#1e293b" },
  ]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="100%"
            barSize={10}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={4} background={false}>
              {data.map((_entry, index) => (
                <Cell key={index} fill={data[index].fill} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  )
}

function DocumentRow({ doc }: { doc: DocumentItem }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        doc.have
          ? "bg-slate-800/50"
          : "bg-red-950/40 border border-red-800/40"
      }`}
    >
      {doc.have ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium ${
            doc.have ? "text-slate-200" : "text-red-200"
          }`}
        >
          {doc.label}
        </span>
        {doc.note && (
          <p className="text-xs text-red-400 mt-0.5">{doc.note}</p>
        )}
      </div>
    </div>
  )
}

function RiskRow({
  label,
  level,
  detail,
}: {
  label: string
  level: "low" | "medium" | "high"
  detail: string
}) {
  const colors = {
    low: {
      dot: "bg-emerald-400",
      badge:
        "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    },
    medium: {
      dot: "bg-amber-400",
      badge: "bg-amber-900/60 text-amber-300 border-amber-700",
    },
    high: {
      dot: "bg-red-400",
      badge: "bg-red-900/60 text-red-300 border-red-700",
    },
  }
  const c = colors[level]

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${c.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-200">
            {label}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${c.badge}`}
          >
            {level}
          </span>
        </div>
        <p className="text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  )
}

function SimilarCard({ opp }: { opp: SimilarOpportunity }) {
  return (
    <Link
      to={ROUTES.tender(opp.id)}
      className="block p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
    >
      <p className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug mb-1">
        {opp.title}
      </p>
      <p className="text-xs text-slate-500 mb-2">{opp.buyer}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{opp.value}</span>
        <span className="text-xs font-semibold text-indigo-400">
          {opp.score}% match
        </span>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function OpportunityIntelligence() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const tender: Tender | undefined =
    DEMO_TENDERS.find((t) => t.id === id) ??
    DEMO_TENDERS.find((t) => t.id === "t-001")

  const days = tender ? daysUntil(tender.deadline) : 0
  const isUrgent = days <= 14
  const missingDocs = REQUIRED_DOCUMENTS.filter((d) => !d.have)

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-semibold text-slate-200">
          Tender not found
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.tenders)}
        >
          Back to Tender Discovery
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Top Navigation ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(ROUTES.tenders)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tender Discovery
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {tender.reference && (
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                {tender.reference}
              </span>
            )}
            <Badge className="bg-amber-900/60 text-amber-300 border-amber-700 border text-xs">
              DEMO DATA
            </Badge>
            {tender.status === "closing-soon" ? (
              <Badge className="bg-red-900/60 text-red-300 border-red-700 border text-xs">
                Closing Soon
              </Badge>
            ) : (
              <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-700 border text-xs">
                Open
              </Badge>
            )}
            {tender.smeFlag && (
              <Badge className="bg-indigo-900/60 text-indigo-300 border-indigo-700 border text-xs">
                SME Friendly
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="flex gap-6 items-start">
          {/* ── Main column ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── Tender Header ──────────────────────────────────────────── */}
            <Card className="bg-slate-900 border-slate-700/60">
              <CardContent className="p-6 space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {tender.title}
                </h1>

                {/* Buyer meta */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 font-medium">
                      {tender.buyer}
                    </span>
                    {tender.buyerType && (
                      <span className="text-slate-500">
                        · {tender.buyerType.replace(/-/g, " ")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {tender.location}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Published: {formatDate(tender.publishedDate)}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Deadline: {formatDate(tender.deadline)}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${
                      isUrgent ? "text-red-400" : "text-slate-300"
                    }`}
                  >
                    {isUrgent && <AlertTriangle className="w-4 h-4" />}
                    {days > 0
                      ? `${days} days remaining`
                      : `${Math.abs(days)} days overdue`}
                  </div>
                </div>

                <Separator className="bg-slate-700/60" />

                {/* Value */}
                <div className="flex items-center gap-3">
                  <PoundSterling className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(tender.value)}
                    {tender.valueMax && (
                      <span className="text-slate-400">
                        {" "}– {formatCurrency(tender.valueMax)}
                      </span>
                    )}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {tender.cpvCode && (
                    <Badge className="bg-slate-800 text-slate-400 border-slate-700 border text-xs font-mono">
                      CPV: {tender.cpvCode}
                    </Badge>
                  )}
                  {tender.framework && (
                    <Badge className="bg-slate-800 text-indigo-300 border-indigo-800 border text-xs">
                      Framework: {tender.framework}
                    </Badge>
                  )}
                  <Badge className="bg-slate-800 text-slate-400 border-slate-700 border text-xs capitalize">
                    {tender.category.replace(/-/g, " ")}
                  </Badge>
                </div>

                {/* Description */}
                {tender.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {tender.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ── AI Analysis Panel ──────────────────────────────────────── */}
            <Card className="bg-slate-900 border-indigo-600/50 shadow-lg shadow-indigo-950/40">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  AI Opportunity Analysis
                  <span className="text-indigo-400 text-base">✦</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score dials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ScoreDial
                    value={65}
                    label="Win Probability"
                    color="#6366f1"
                  />
                  <ScoreDial
                    value={tender.eligibilityScore ?? 82}
                    label="Eligibility Score"
                    color="#10b981"
                  />
                  <ScoreDial
                    value={tender.opportunityScore ?? 87}
                    label="Opportunity Score"
                    color="#f59e0b"
                  />
                  {/* Bid Effort dial — not a %, show as icon badge */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-24 h-24 rounded-full border-4 border-amber-500/60 bg-slate-800/80 flex flex-col items-center justify-center gap-1">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-amber-300">
                        Medium
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 text-center leading-tight">
                      Bid Effort
                    </span>
                  </div>
                </div>

                {/* Score bars (supplemental readability) */}
                <div className="space-y-2 hidden sm:block">
                  {[
                    {
                      label: "Eligibility Score",
                      value: tender.eligibilityScore ?? 82,
                    },
                    {
                      label: "Opportunity Score",
                      value: tender.opportunityScore ?? 87,
                    },
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{bar.label}</span>
                        <span>{bar.value}%</span>
                      </div>
                      <Progress value={bar.value} className="h-1.5" />
                    </div>
                  ))}
                </div>

                {/* Recommended action */}
                <div className="rounded-lg bg-indigo-950/60 border border-indigo-700/50 p-4 flex items-start gap-3">
                  <Target className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-0.5">
                      Recommended Action
                    </p>
                    <p className="text-sm text-slate-200">
                      <strong className="text-indigo-300">START BID</strong>{" "}
                      — Strong match for your profile and track record. Address
                      the Social Value section carefully to maximise your
                      evaluation score. Resolve Cyber Essentials gap before
                      submission.
                    </p>
                  </div>
                </div>

                {/* AI quick buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40 hover:text-indigo-200 gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Ask AI about this contract
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40 hover:text-indigo-200 gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Compare with my profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40 hover:text-indigo-200 gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Find similar contracts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ── Intelligence Tabs ──────────────────────────────────────── */}
            <Tabs defaultValue="requirements" className="space-y-4">
              <TabsList className="bg-slate-800 border border-slate-700/60 p-1 h-auto flex-wrap gap-1">
                <TabsTrigger
                  value="requirements"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-sm"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Requirements
                </TabsTrigger>
                <TabsTrigger
                  value="risk"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-sm"
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  Risk Assessment
                </TabsTrigger>
                <TabsTrigger
                  value="buyer"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-sm"
                >
                  <Building2 className="w-4 h-4 mr-1.5" />
                  Buyer Intelligence
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-sm"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  Social Value
                </TabsTrigger>
              </TabsList>

              {/* ── TAB 1: Requirements ───────────────────────────────────── */}
              <TabsContent value="requirements" className="space-y-4">
                {missingDocs.length > 0 && (
                  <Card className="bg-red-950/40 border-red-800/60">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-300 mb-1">
                          {missingDocs.length} document
                          {missingDocs.length > 1 ? "s" : ""} missing or
                          expired
                        </p>
                        <ul className="text-sm text-red-400 space-y-0.5">
                          {missingDocs.map((d) => (
                            <li key={d.label}>
                              · {d.label}
                              {d.note ? ` — ${d.note}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {REQUIRED_DOCUMENTS.map((doc) => (
                      <DocumentRow key={doc.label} doc={doc} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── TAB 2: Risk Assessment ────────────────────────────────── */}
              <TabsContent value="risk" className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">
                      Risk Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <RiskRow
                      label="Delivery Risk"
                      level="low"
                      detail="You have the required capability, equipment, and staff resources for this scope of work."
                    />
                    <RiskRow
                      label="Financial Risk"
                      level="low"
                      detail="Contract value is approximately 30% of annual turnover — well within safe limits."
                    />
                    <RiskRow
                      label="Bid Effort"
                      level="medium"
                      detail="Estimated 40–60 hours of bid writing. Social value and method statement sections require careful drafting."
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Estimated Bid Cost",
                      value: "£3,200",
                      sub: "40–60 hrs bid writing",
                      color: "text-white",
                    },
                    {
                      label: "Est. Contract Margin",
                      value: "14–18%",
                      sub: "Based on similar contracts",
                      color: "text-emerald-400",
                    },
                    {
                      label: "ROI If Won",
                      value: "34×",
                      sub: "Bid cost recovery",
                      color: "text-indigo-400",
                    },
                  ].map((stat) => (
                    <Card
                      key={stat.label}
                      className="bg-slate-900 border-slate-700/60"
                    >
                      <CardContent className="p-5 text-center space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500">{stat.sub}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ── TAB 3: Buyer Intelligence ─────────────────────────────── */}
              <TabsContent value="buyer" className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      {tender.buyer}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Previous award */}
                    <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/50 p-4">
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                        Previous Award to You
                      </p>
                      <p className="text-sm text-slate-200 font-medium">
                        A57 Corridor Improvement Works 2024
                      </p>
                      <p className="text-sm text-slate-400">
                        Contract value: £850,000 · Successfully delivered
                      </p>
                    </div>

                    {/* Buyer notes */}
                    <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-4 space-y-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Buyer Notes
                      </p>
                      <p className="text-sm text-slate-300">
                        Strong existing relationship. They know your work and
                        quality standards. Bid team contact: TBC — check
                        Find-a-Tender for named officer.
                      </p>
                    </div>

                    <Separator className="bg-slate-700/60" />

                    {/* Scoring criteria */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-300">
                        Known Scoring Criteria
                      </p>
                      {[
                        {
                          label: "Quality / Technical",
                          weight: 60,
                          color: "bg-indigo-500",
                        },
                        {
                          label: "Price",
                          weight: 20,
                          color: "bg-slate-500",
                        },
                        {
                          label: "Social Value",
                          weight: 20,
                          color: "bg-emerald-500",
                        },
                      ].map((c) => (
                        <div key={c.label} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{c.label}</span>
                            <span className="font-semibold text-slate-200">
                              {c.weight}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${c.color} rounded-full`}
                              style={{ width: `${c.weight}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Framework & social value */}
                    <div className="space-y-2">
                      {tender.framework && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>Framework:</span>
                          <span className="text-indigo-300 font-medium">
                            {tender.framework}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Social Value Weighting:</span>
                        <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-700 border text-xs">
                          {tender.socialValueWeighting ?? 20}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── TAB 4: Social Value ───────────────────────────────────── */}
              <TabsContent value="social" className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Social Value Requirements
                      <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-700 border text-xs ml-auto">
                        {tender.socialValueWeighting ?? 20}% of evaluation
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        theme: "Local Employment",
                        detail:
                          "Commit to employing ≥30% of workforce from within the contract region.",
                        suggestion:
                          "Greenfield currently employs 28 staff in the North West — confirm local headcount for this submission.",
                      },
                      {
                        theme: "Apprenticeship Commitments",
                        detail:
                          "Minimum 1 apprenticeship per £1m contract value.",
                        suggestion:
                          "You currently have 2 apprentices. Offer 1 additional placement specifically for this contract.",
                      },
                      {
                        theme: "Carbon & Environmental",
                        detail:
                          "Net-zero delivery plan, material waste reduction targets, and EV fleet commitment.",
                        suggestion:
                          "Reference your ISO 14001 certification and carbon reduction roadmap in your response.",
                      },
                      {
                        theme: "Community Benefit",
                        detail:
                          "Volunteering hours, skills training for local residents, school STEM engagement.",
                        suggestion:
                          "Include 2 community engagement days per quarter as a standard offering.",
                      },
                      {
                        theme: "Supply Chain (Local SMEs)",
                        detail:
                          "Minimum 60% of subcontract spend directed to SMEs in the local area.",
                        suggestion:
                          "Document your existing supply chain — the majority are already Manchester-based SMEs.",
                      },
                    ].map((item) => (
                      <div
                        key={item.theme}
                        className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-4 space-y-1.5"
                      >
                        <p className="text-sm font-semibold text-emerald-300">
                          {item.theme}
                        </p>
                        <p className="text-sm text-slate-400">{item.detail}</p>
                        <div className="flex items-start gap-2 mt-1">
                          <Bot className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-indigo-300 italic">
                            {item.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white gap-2 mt-2">
                      <Zap className="w-4 h-4" />
                      Generate Social Value Response
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Sidebar (desktop only) ─────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            {/* Quick stats summary */}
            <Card className="bg-slate-900 border-slate-700/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    label: "Win Probability",
                    value: "65%",
                    color: "text-indigo-400",
                  },
                  {
                    label: "Eligibility",
                    value: `${tender.eligibilityScore ?? 82}%`,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Opportunity Score",
                    value: `${tender.opportunityScore ?? 87}%`,
                    color: "text-amber-400",
                  },
                  {
                    label: "Days Remaining",
                    value: `${days}d`,
                    color: isUrgent ? "text-red-400" : "text-slate-200",
                  },
                  {
                    label: "Social Value",
                    value: `${tender.socialValueWeighting ?? 20}%`,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Est. Bid Cost",
                    value: "£3,200",
                    color: "text-slate-200",
                  },
                  {
                    label: "Est. Margin",
                    value: "14–18%",
                    color: "text-emerald-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Similar opportunities */}
            <Card className="bg-slate-900 border-slate-700/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Similar Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SIMILAR_OPPORTUNITIES.map((opp) => (
                  <SimilarCard key={opp.id} opp={opp} />
                ))}
              </CardContent>
            </Card>

            {/* Action buttons — sidebar */}
            <div className="space-y-2">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                onClick={() => navigate(ROUTES.bids)}
              >
                <Zap className="w-4 h-4" />
                Start Bid
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 gap-2"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save to Pipeline
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 gap-2"
              >
                <Users className="w-4 h-4" />
                Find a Partner
              </Button>
              <Button
                variant="ghost"
                className="w-full text-red-400 hover:bg-red-950/40 hover:text-red-300 gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Reject Opportunity
              </Button>
            </div>
          </aside>
        </div>

        {/* ── Sticky bottom action bar (mobile / tablet) ─────────────────── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/98 border-t border-slate-800 px-4 py-3">
          <div className="flex gap-2 max-w-screen-xl mx-auto">
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
              onClick={() => navigate(ROUTES.bids)}
            >
              <Zap className="w-4 h-4" />
              Start Bid
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2 px-3"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2 px-3"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Partner</span>
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:bg-red-950/40 hover:text-red-300 px-3"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Spacer so mobile sticky bar doesn't overlap last content */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  )
}
