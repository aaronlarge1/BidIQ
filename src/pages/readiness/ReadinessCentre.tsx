import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, ShieldCheck, FileText, Globe, CreditCard, ChevronRight, RefreshCw, Award } from "lucide-react"
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useReadiness, useCompany } from "@/hooks/useApi"
import { ROUTES } from "@/lib/constants"

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
})

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusIcon(status: "green" | "amber" | "red") {
  if (status === "green") return <CheckCircle2 className="h-5 w-5 text-green-600" />
  if (status === "amber") return <AlertCircle className="h-5 w-5 text-amber-500" />
  return <XCircle className="h-5 w-5 text-red-500" />
}

function statusCardClass(status: "green" | "amber" | "red"): string {
  if (status === "green") return "border-green-200 bg-green-50/30"
  if (status === "amber") return "border-amber-200 bg-amber-50/30"
  return "border-red-200 bg-red-50/30"
}

function statusBadge(status: "green" | "amber" | "red") {
  if (status === "green")
    return <Badge className="bg-green-100 text-green-700 border-green-200">Ready</Badge>
  if (status === "amber")
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Needs Work</Badge>
  return <Badge className="bg-red-100 text-red-700 border-red-200">Blocking</Badge>
}

function priorityBadge(status: "green" | "amber" | "red") {
  if (status === "red")
    return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">High</Badge>
  if (status === "amber")
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Medium</Badge>
  return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Low</Badge>
}

// ─── Estimated time map (per area) ───────────────────────────────────────────

const ESTIMATED_TIME: Record<string, string> = {
  insurance: "30 minutes",
  policies: "2–3 hours",
  accreditations: "1 week",
  cyber: "4–6 weeks",
  financials: "1 day",
  "social-value": "2–3 days",
  esg: "1 week",
  experience: "2–3 hours",
  highways: "1 week",
}

const SCORE_IMPACT: Record<string, number> = {
  insurance: 2,
  policies: 4,
  accreditations: 3,
  cyber: 8,
  financials: 2,
  "social-value": 5,
  esg: 4,
  experience: 2,
  highways: 3,
}

// ─── Monthly checklist items ──────────────────────────────────────────────────

const MONTHLY_CHECKLIST = [
  "Review insurance certificates for upcoming renewals",
  "Check all policies are current and correctly versioned",
  "Confirm all accreditation certificates are in date",
  "Review and update Cyber Essentials action log",
  "Pull latest management accounts for financial health check",
  "Update social value activity log with recent activities",
  "Record any ESG/environmental data for the period",
  "Ensure case studies and references are up to date",
]

const PREVIOUS_CHECKS = [
  { month: "May 2026", date: "21 May 2026" },
  { month: "April 2026", date: "21 April 2026" },
  { month: "March 2026", date: "21 March 2026" },
]

// ─── Roadmap stages ───────────────────────────────────────────────────────────

const ROADMAP_STAGES = [
  {
    id: "foundation",
    label: "Foundation",
    range: "0–40",
    tagline: "Get the basics in place",
    current: false,
    bullets: [
      "Public and employers liability insurance in place",
      "Health & safety policy documented",
      "Company registered and accounts filed",
      "Basic contact and capability information ready",
    ],
  },
  {
    id: "eligible",
    label: "Eligible",
    range: "40–70",
    tagline: "Meet minimum tender requirements",
    current: true,
    bullets: [
      "Key policies compliant and up to date (GDPR, Modern Slavery)",
      "At least one relevant accreditation (e.g. ISO 9001, SafeContractor)",
      "2–3 references or case studies prepared",
      "Basic social value commitments articulated",
    ],
  },
  {
    id: "competitive",
    label: "Competitive",
    range: "70–85",
    tagline: "Stand out in evaluations",
    current: false,
    bullets: [
      "Cyber Essentials or equivalent certificate",
      "Formal social value strategy and evidence",
      "Carbon reduction plan or net-zero roadmap",
      "Multiple strong references with measurable outcomes",
    ],
  },
  {
    id: "market-leader",
    label: "Market Leader",
    range: "85–100",
    tagline: "Win major frameworks",
    current: false,
    bullets: [
      "ISO 27001 or Cyber Essentials Plus",
      "Full ESG reporting with Scope 1, 2 & 3 emissions data",
      "Social value programme with apprenticeships/volunteering",
      "Framework agreements and major contract references",
    ],
  },
]

// ─── Benchmarking data ────────────────────────────────────────────────────────

const BENCHMARK_ROWS = [
  { area: "Insurance", yourScore: 90, industryAvg: 82, top10: 97 },
  { area: "Accreditations", yourScore: 80, industryAvg: 65, top10: 95 },
  { area: "Social Value", yourScore: 55, industryAvg: 58, top10: 89 },
  { area: "Cyber Security", yourScore: 50, industryAvg: 54, top10: 88 },
  { area: "ESG & Environment", yourScore: 60, industryAvg: 47, top10: 86 },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReadinessCentre() {
  const { data: readiness, isLoading, isError } = useReadiness()
  const { data: companyData } = useCompany()

  const companyName = companyData?.name ?? "Your Company"

  // Empty / loading / error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading readiness profile…</p>
      </div>
    )
  }

  if (isError || !readiness) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-2">
          <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-slate-700 font-semibold">Complete your company profile to see your readiness score</p>
          <p className="text-slate-400 text-sm">Once your profile is set up, your procurement readiness score will appear here.</p>
        </div>
      </div>
    )
  }

  const RADIAL_DATA = [{ name: "Score", value: readiness.overall, fill: "#16a34a" }]

  // Collect all actionable items across areas
  const allActions = readiness.areas.flatMap((area) =>
    area.actions.map((action, idx) => ({
      areaId: area.id,
      areaName: area.name,
      status: area.status,
      action,
      time: ESTIMATED_TIME[area.id] ?? "1–2 hours",
      impact: SCORE_IMPACT[area.id] ?? 2,
      key: `${area.id}-${idx}`,
    }))
  )

  // Sort: red first, amber second, green last
  const sortedActions = [...allActions].sort((a, b) => {
    const order = { red: 0, amber: 1, green: 2 }
    return order[a.status] - order[b.status]
  })

  const readyCount = readiness.areas.filter((a) => a.status === "green").length
  const amberCount = readiness.areas.filter((a) => a.status === "amber").length
  const redCount = readiness.areas.filter((a) => a.status === "red").length

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">

      {/* ── 1. PAGE HEADER ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-7 w-7 text-green-600" />
            <h1 className="text-2xl font-bold text-slate-900">Procurement Readiness Centre</h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">
            Overall score: <span className="font-semibold text-slate-700">{readiness.overall}/100</span>
            {readiness.lastChecked && (
              <>{" · "}Last checked <span className="font-semibold text-slate-700">{new Date(readiness.lastChecked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span></>
            )}
          </p>
          <div className="ml-10 mt-2 flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">
              Procurement Credit Score:{" "}
              <span className="font-semibold text-slate-800">68 — Good</span>
            </span>
            <Link
              to={ROUTES.readiness}
              className="text-green-700 underline underline-offset-2 hover:text-green-800 text-xs"
            >
              What is this?
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Monthly Health Check
          </Button>
        </div>
      </motion.div>

      {/* ── 2. OVERALL SCORE CARD ── */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Radial chart */}
              <div className="relative w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="60%"
                    outerRadius="80%"
                    startAngle={90}
                    endAngle={-270}
                    data={RADIAL_DATA}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={8}
                      background={{ fill: "#e5e7eb" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                {/* Centered number overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-extrabold text-slate-900 leading-none">{readiness.overall}</span>
                  <span className="text-sm text-slate-500 mt-0.5">/ 100</span>
                </div>
              </div>

              {/* Score details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Your Readiness Score</h2>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-semibold">DEVELOPING</Badge>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Your score has improved by 8 points since last month</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Award className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Fix 3 issues</span> to unlock{" "}
                    <span className="font-semibold">£2.1m in additional contract eligibility</span> — address Cyber &amp; Security,
                    Social Value and ESG to qualify for major frameworks.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{readyCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Areas ready</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-500">{amberCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Need attention</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{redCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Blocking</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 3. TRAFFIC LIGHT GRID ── */}
      <motion.div {...fadeUp(0.2)}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Readiness Areas</h2>
          <p className="text-sm text-slate-500">9 procurement readiness categories assessed against buyer requirements</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {readiness.areas.map((area, i) => (
            <motion.div key={area.id} {...fadeUp(0.2 + i * 0.04)}>
              <Card className={`border ${statusCardClass(area.status)} h-full`}>
                <CardContent className="pt-4 pb-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusIcon(area.status)}
                      <span className="font-semibold text-slate-800 text-sm">{area.name}</span>
                    </div>
                    {statusBadge(area.status)}
                  </div>

                  {/* Score bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Score</span>
                      <span className="font-semibold text-slate-800">{area.score}/100</span>
                    </div>
                    <Progress
                      value={area.score}
                      className="h-2"
                    />
                  </div>

                  {/* First issue */}
                  {area.issues.length > 0 && (
                    <p className="text-xs text-slate-500 leading-snug">
                      <span className="font-medium text-slate-600">Issue: </span>
                      {area.issues[0]}
                    </p>
                  )}

                  {/* First action */}
                  {area.actions.length > 0 && (
                    <p className="text-xs text-green-700 leading-snug">
                      <span className="font-medium">Action: </span>
                      {area.actions[0]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 4. TABS ── */}
      <motion.div {...fadeUp(0.3)}>
        <Tabs defaultValue="action-plan" className="space-y-4">
          <TabsList className="bg-white border border-slate-200 p-1 h-auto flex flex-wrap gap-1">
            <TabsTrigger value="action-plan" className="text-sm data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
              Action Plan
            </TabsTrigger>
            <TabsTrigger value="health-check" className="text-sm data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
              Monthly Health Check
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="text-sm data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
              Growth Roadmap
            </TabsTrigger>
            <TabsTrigger value="benchmarking" className="text-sm data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
              Benchmarking
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Action Plan ── */}
          <TabsContent value="action-plan">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Your Action Plan</CardTitle>
                <CardDescription>
                  {sortedActions.length} actions identified — completing these will raise your score and unlock new contract opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedActions.length === 0 && (
                  <p className="text-sm text-slate-500">No actions required — all areas are ready.</p>
                )}
                {sortedActions.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      {priorityBadge(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                        {item.areaName}
                      </p>
                      <p className="text-sm text-slate-800">{item.action}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <TrendingUp className="h-3 w-3" />
                        +{item.impact} pts
                      </span>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-slate-200">
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 2: Monthly Health Check ── */}
          <TabsContent value="health-check">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Monthly Health Check</CardTitle>
                    <CardDescription className="mt-1">
                      Next monthly check due:{" "}
                      <span className="font-semibold text-slate-700">21 July 2026</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-200 gap-2 shrink-0">
                    <Globe className="h-4 w-4" />
                    Schedule Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Checklist */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">This Month's Checklist</h3>
                  {MONTHLY_CHECKLIST.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="mt-0.5 h-4 w-4 rounded border-2 border-slate-300 shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Previous checks */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Previous Check History</h3>
                  <div className="space-y-2">
                    {PREVIOUS_CHECKS.map((check) => (
                      <div
                        key={check.month}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 border border-green-100"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-slate-700">{check.month}</span>
                          <span className="text-xs text-slate-500">Completed {check.date}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Completed</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 3: Growth Roadmap ── */}
          <TabsContent value="roadmap">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Procurement Growth Roadmap</CardTitle>
                <CardDescription>
                  Your journey from procurement-ready to market-leading supplier. Current score: {readiness.overall}/100.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  {ROADMAP_STAGES.map((stage, i) => (
                    <div key={stage.id} className="flex flex-col lg:flex-row items-stretch gap-0">
                      <div
                        className={`flex-1 rounded-xl border p-5 space-y-3 ${
                          stage.current
                            ? "border-green-300 bg-green-50 shadow-sm ring-2 ring-green-200"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold uppercase tracking-widest ${
                                  stage.current ? "text-green-700" : "text-slate-400"
                                }`}
                              >
                                Stage {i + 1}
                              </span>
                              {stage.current && (
                                <Badge className="bg-green-600 text-white text-xs">Current</Badge>
                              )}
                            </div>
                            <h3
                              className={`text-base font-bold mt-0.5 ${
                                stage.current ? "text-green-900" : "text-slate-700"
                              }`}
                            >
                              {stage.label}
                            </h3>
                            <p className="text-xs text-slate-500">Score {stage.range}</p>
                          </div>
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            stage.current ? "text-green-800" : "text-slate-600"
                          }`}
                        >
                          {stage.tagline}
                        </p>
                        <ul className="space-y-1.5">
                          {stage.bullets.map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2
                                className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                                  stage.current ? "text-green-500" : "text-slate-300"
                                }`}
                              />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        {stage.current && (
                          <div className="pt-2 space-y-1">
                            <div className="flex justify-between text-xs text-green-700">
                              <span>Progress within stage</span>
                              <span className="font-semibold">{readiness.overall}% / 70–85 target</span>
                            </div>
                            <Progress value={((readiness.overall - 40) / (70 - 40)) * 100} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      {i < ROADMAP_STAGES.length - 1 && (
                        <div className="hidden lg:flex items-center px-2 text-slate-300">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 4: Benchmarking ── */}
          <TabsContent value="benchmarking">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Benchmarking</CardTitle>
                <CardDescription>
                  How does{" "}
                  <span className="font-semibold text-slate-700">{companyName}</span>{" "}
                  compare to similar SMEs in highways and construction?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 pr-4 font-semibold text-slate-700">Area</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">Your Score</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-500">Industry Avg</th>
                        <th className="text-center py-3 pl-4 font-semibold text-slate-500">Top 10%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {BENCHMARK_ROWS.map((row) => {
                        const aboveAvg = row.yourScore >= row.industryAvg
                        return (
                          <tr key={row.area} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 pr-4 font-medium text-slate-800">{row.area}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold ${
                                  aboveAvg
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {row.yourScore}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-slate-500 font-medium">
                              {row.industryAvg}
                            </td>
                            <td className="py-3 pl-4 text-center text-slate-500 font-medium">
                              {row.top10}
                            </td>
                          </tr>
                        )
                      })}
                      <tr className="border-t-2 border-slate-200 bg-slate-50">
                        <td className="py-3 pr-4 font-bold text-slate-900">Overall</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold bg-green-100 text-green-700">
                            {readiness.overall}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-600">61</td>
                        <td className="py-3 pl-4 text-center font-bold text-slate-600">91</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-100 border border-green-300" />
                    Above industry average
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                    Below industry average
                  </div>
                  <span className="ml-auto italic">
                    Benchmarks based on 2,400+ SMEs in highways and construction sectors (June 2026)
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── 5. PROCUREMENT CREDIT SCORE CARD ── */}
      <motion.div {...fadeUp(0.4)}>
        <Card className="border-slate-200 bg-gradient-to-r from-[#1e3a5f] to-[#1e4a7f] text-white shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Score display */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-white/10 border-2 border-white/30">
                  <span className="text-3xl font-extrabold leading-none">{readiness.creditScore}</span>
                  <span className="text-xs text-white/70 mt-0.5">/ 100</span>
                </div>
                <div>
                  <Badge className="bg-green-400 text-green-900 font-bold border-0 mb-1">GOOD</Badge>
                  <p className="text-lg font-bold leading-tight">Procurement Credit Score</p>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-0.5">Coming Soon</p>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden md:block bg-white/20 h-16" />

              {/* Description */}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-white/90 leading-relaxed">
                  Your Procurement Credit Score helps public sector buyers assess your{" "}
                  <span className="font-semibold text-white">payment reliability and financial stability</span>{" "}
                  before awarding contracts. A higher score increases buyer confidence and can unlock
                  preferential framework positions.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    className="bg-green-500 hover:bg-green-400 text-white font-semibold gap-2 border-0"
                    size="sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pre-register for Early Access
                  </Button>
                  <Link
                    to={ROUTES.compliance}
                    className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                  >
                    View compliance vault
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <p className="text-xs text-white/50">
                  Join 847 SMEs already on the waitlist
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  )
}
