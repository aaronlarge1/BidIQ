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
  Loader2,
} from "lucide-react"
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTender, useCompany } from "@/hooks/useApi"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ScoreDial({
  value,
  label,
  color,
}: {
  value: number | null | undefined
  label: string
  color: string
}) {
  const pct = value ?? 0
  const data = [
    { value: pct, fill: color },
    { value: 100 - pct, fill: "#1e293b" },
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
          <span className="text-xl font-bold text-white">
            {value != null ? `${value}%` : "—"}
          </span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  )
}

function DocumentRow({ label, have, note }: { label: string; have: boolean; note?: string }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        have ? "bg-slate-800/50" : "bg-red-950/40 border border-red-800/40"
      }`}
    >
      {have ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${have ? "text-slate-200" : "text-red-200"}`}>
          {label}
        </span>
        {note && <p className="text-xs text-red-400 mt-0.5">{note}</p>}
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
  level: "low" | "medium" | "high" | "unknown"
  detail: string
}) {
  const colors = {
    low: { dot: "bg-emerald-400", badge: "bg-emerald-900/60 text-emerald-300 border-emerald-700" },
    medium: { dot: "bg-amber-400", badge: "bg-amber-900/60 text-amber-300 border-amber-700" },
    high: { dot: "bg-red-400", badge: "bg-red-900/60 text-red-300 border-red-700" },
    unknown: { dot: "bg-slate-500", badge: "bg-slate-800/60 text-slate-400 border-slate-600" },
  }
  const c = colors[level]

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${c.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-200">{label}</span>
          <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${c.badge}`}>
            {level === "unknown" ? "not assessed" : level}
          </span>
        </div>
        <p className="text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  )
}

function parseRiskLevel(raw: string | null | undefined): "low" | "medium" | "high" | "unknown" {
  if (!raw) return "unknown"
  const lower = raw.toLowerCase()
  if (lower.includes("low")) return "low"
  if (lower.includes("high")) return "high"
  if (lower.includes("medium") || lower.includes("moderate")) return "medium"
  return "unknown"
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function OpportunityIntelligence() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: tender, isLoading, isError } = useTender(id ?? "")
  const { data: company } = useCompany()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    )
  }

  if (isError || !tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-semibold text-slate-200">Tender not found</h2>
        <Button variant="outline" onClick={() => navigate(ROUTES.tenders)}>
          Back to Tender Discovery
        </Button>
      </div>
    )
  }

  const days = daysUntil(tender.deadline)
  const isUrgent = days <= 14

  // Build document lists from API data
  const requiredDocs = (tender.requiredDocuments ?? []).map((label) => ({ label, have: true, note: undefined as string | undefined }))
  const missingDocs = (tender.missingDocuments ?? []).map((label) => ({ label, have: false, note: "MISSING — obtain before submission" }))
  const allDocs = [...requiredDocs, ...missingDocs]
  const hasDocData = allDocs.length > 0

  const companyName = company?.name ?? "Your company"

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

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 font-medium">{tender.buyer}</span>
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
                    {days > 0 ? `${days} days remaining` : `${Math.abs(days)} days overdue`}
                  </div>
                </div>

                <Separator className="bg-slate-700/60" />

                <div className="flex items-center gap-3">
                  <PoundSterling className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(tender.value)}
                    {tender.valueMax && (
                      <span className="text-slate-400"> – {formatCurrency(tender.valueMax)}</span>
                    )}
                  </span>
                </div>

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

                {tender.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{tender.description}</p>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ScoreDial
                    value={tender.winProbability != null ? Math.round(tender.winProbability) : null}
                    label="Win Probability"
                    color="#6366f1"
                  />
                  <ScoreDial
                    value={tender.eligibilityScore}
                    label="Eligibility Score"
                    color="#10b981"
                  />
                  <ScoreDial
                    value={tender.opportunityScore}
                    label="Opportunity Score"
                    color="#f59e0b"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-24 h-24 rounded-full border-4 border-amber-500/60 bg-slate-800/80 flex flex-col items-center justify-center gap-1">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-amber-300">
                        {tender.bidEffort ?? "TBC"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 text-center leading-tight">
                      Bid Effort
                    </span>
                  </div>
                </div>

                <div className="space-y-2 hidden sm:block">
                  {[
                    { label: "Eligibility Score", value: tender.eligibilityScore },
                    { label: "Opportunity Score", value: tender.opportunityScore },
                  ]
                    .filter((b) => b.value != null)
                    .map((bar) => (
                      <div key={bar.label} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{bar.label}</span>
                          <span>{bar.value}%</span>
                        </div>
                        <Progress value={bar.value!} className="h-1.5" />
                      </div>
                    ))}
                </div>

                <div className="rounded-lg bg-indigo-950/60 border border-indigo-700/50 p-4 flex items-start gap-3">
                  <Target className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-0.5">
                      Recommended Action
                    </p>
                    <p className="text-sm text-slate-200">
                      {tender.recommendedAction ?? (
                        <>
                          <strong className="text-indigo-300">REVIEW</strong> — Review the requirements
                          carefully and assess your eligibility before starting a bid.
                        </>
                      )}
                    </p>
                  </div>
                </div>

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
                          {missingDocs.length} document{missingDocs.length > 1 ? "s" : ""} missing
                        </p>
                        <ul className="text-sm text-red-400 space-y-0.5">
                          {missingDocs.map((d) => (
                            <li key={d.label}>· {d.label}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Required Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {hasDocData ? (
                      allDocs.map((doc) => (
                        <DocumentRow key={doc.label} label={doc.label} have={doc.have} note={doc.note} />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 py-4 text-center">
                        No document requirements specified for this tender.
                      </p>
                    )}

                    {/* Insurance requirements */}
                    {tender.insuranceRequired && tender.insuranceRequired.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/60">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Insurance Requirements
                        </p>
                        {tender.insuranceRequired.map((ins) => (
                          <DocumentRow key={ins} label={ins} have={true} />
                        ))}
                      </div>
                    )}

                    {/* Accreditations */}
                    {tender.accreditationsRequired && tender.accreditationsRequired.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/60">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Accreditations Required
                        </p>
                        {tender.accreditationsRequired.map((acc) => (
                          <DocumentRow key={acc} label={acc} have={true} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── TAB 2: Risk Assessment ────────────────────────────────── */}
              <TabsContent value="risk" className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Risk Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <RiskRow
                      label="Delivery Risk"
                      level={parseRiskLevel(tender.deliveryRisk)}
                      detail={tender.deliveryRisk ?? "Not yet assessed — review your capability and resource availability for this contract scope."}
                    />
                    <RiskRow
                      label="Financial Risk"
                      level={parseRiskLevel(tender.financialRisk)}
                      detail={tender.financialRisk ?? "Not yet assessed — consider contract value relative to your annual turnover."}
                    />
                    <RiskRow
                      label="Bid Effort"
                      level={
                        tender.bidEffort
                          ? tender.bidEffort.toLowerCase().includes("high")
                            ? "high"
                            : tender.bidEffort.toLowerCase().includes("low")
                            ? "low"
                            : "medium"
                          : "unknown"
                      }
                      detail={`Estimated bid preparation effort: ${tender.bidEffort ?? "Not assessed — check the ITT for mandatory sections and word limits."}`}
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Estimated Bid Cost",
                      value: tender.estimatedBidCost ? formatCurrency(tender.estimatedBidCost) : "TBC",
                      sub: "Bid preparation cost",
                      color: "text-white",
                    },
                    {
                      label: "Est. Contract Margin",
                      value: "14–18%",
                      sub: "Based on sector averages",
                      color: "text-emerald-400",
                    },
                    {
                      label: "Win Probability",
                      value: tender.winProbability != null ? `${Math.round(tender.winProbability)}%` : "TBC",
                      sub: "Based on profile match",
                      color: "text-indigo-400",
                    },
                  ].map((stat) => (
                    <Card key={stat.label} className="bg-slate-900 border-slate-700/60">
                      <CardContent className="p-5 text-center space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
                    {tender.buyerNotes ? (
                      <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-4 space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Buyer Notes
                        </p>
                        <p className="text-sm text-slate-300">{tender.buyerNotes}</p>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-4">
                        <p className="text-sm text-slate-500">
                          No buyer intelligence recorded for this organisation yet. Research their
                          procurement history on Find a Tender and Contracts Finder before submitting.
                        </p>
                      </div>
                    )}

                    <Separator className="bg-slate-700/60" />

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-300">Typical Scoring Criteria</p>
                      {[
                        { label: "Quality / Technical", weight: 60, color: "bg-indigo-500" },
                        { label: "Price", weight: 20, color: "bg-slate-500" },
                        { label: "Social Value", weight: tender.socialValueWeighting ?? 20, color: "bg-emerald-500" },
                      ].map((c) => (
                        <div key={c.label} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{c.label}</span>
                            <span className="font-semibold text-slate-200">{c.weight}%</span>
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

                    <div className="space-y-2">
                      {tender.framework && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>Framework:</span>
                          <span className="text-indigo-300 font-medium">{tender.framework}</span>
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
                    {tender.socialValueRequirements ? (
                      <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-4">
                        <p className="text-sm text-slate-300">{tender.socialValueRequirements}</p>
                      </div>
                    ) : null}

                    {[
                      {
                        theme: "Local Employment",
                        detail: "Commit to employing a percentage of workforce from within the contract region.",
                        suggestion: `Review ${companyName}'s existing local workforce data and quantify the proportion employed in the relevant region.`,
                      },
                      {
                        theme: "Apprenticeship Commitments",
                        detail: "Many public sector contracts require minimum 1 apprenticeship per £1m contract value.",
                        suggestion: "Document any existing apprentices and consider offering additional placements specifically tied to this contract.",
                      },
                      {
                        theme: "Carbon & Environmental",
                        detail: "Net-zero delivery plan, material waste reduction targets, and sustainable transport commitments.",
                        suggestion: "Reference any ISO 14001 certification, carbon reduction roadmap, or low-emission fleet in your response.",
                      },
                      {
                        theme: "Community Benefit",
                        detail: "Volunteering hours, skills training for local residents, school STEM or vocational engagement.",
                        suggestion: "Include at least 2 community engagement commitments per quarter as a standard offering in your bid.",
                      },
                      {
                        theme: "Supply Chain (Local SMEs)",
                        detail: "Minimum proportion of subcontract spend directed to SMEs in the local area.",
                        suggestion: "Document your existing supply chain and highlight any locally-based subcontractors or suppliers.",
                      },
                    ].map((item) => (
                      <div
                        key={item.theme}
                        className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-4 space-y-1.5"
                      >
                        <p className="text-sm font-semibold text-emerald-300">{item.theme}</p>
                        <p className="text-sm text-slate-400">{item.detail}</p>
                        <div className="flex items-start gap-2 mt-1">
                          <Bot className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-indigo-300 italic">{item.suggestion}</p>
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
                    value: tender.winProbability != null ? `${Math.round(tender.winProbability)}%` : "—",
                    color: "text-indigo-400",
                  },
                  {
                    label: "Eligibility",
                    value: tender.eligibilityScore != null ? `${tender.eligibilityScore}%` : "—",
                    color: "text-emerald-400",
                  },
                  {
                    label: "Opportunity Score",
                    value: tender.opportunityScore != null ? `${tender.opportunityScore}%` : "—",
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
                    value: tender.estimatedBidCost ? formatCurrency(tender.estimatedBidCost) : "TBC",
                    color: "text-slate-200",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  More Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  to={ROUTES.tenders}
                  className="block p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800 transition-all text-center"
                >
                  <p className="text-sm font-medium text-indigo-300">Browse all tenders</p>
                  <p className="text-xs text-slate-500 mt-0.5">Discover more opportunities</p>
                </Link>
              </CardContent>
            </Card>

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

        <div className="lg:hidden h-20" />
      </div>
    </div>
  )
}
