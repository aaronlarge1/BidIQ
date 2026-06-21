import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  TrendingUp, FileText, Clock, AlertTriangle, PoundSterling, Target,
  RefreshCw, Search, ArrowRight, CheckCircle2, XCircle, AlertCircle,
  Bot, LayoutGrid, Zap,
} from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DEMO_STATS, DEMO_BIDS, DEMO_TENDERS, DEMO_CALENDAR, DEMO_READINESS,
} from "@/lib/demo-data"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
})

// ─── Pipeline chart data ──────────────────────────────────────────────────────

const PIPELINE_DATA = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 280_000 },
  { month: "Mar", value: 620_000 },
  { month: "Apr", value: 1_800_000 },
  { month: "May", value: 2_600_000 },
  { month: "Jun", value: 4_200_000 },
]

// ─── Readiness donut data ─────────────────────────────────────────────────────

const READINESS_DONUT = [
  { name: "Score", value: 72 },
  { name: "Gap", value: 28 },
]
const DONUT_COLORS = ["#1e3055", "#e5e7eb"]

// ─── Stage badge config ───────────────────────────────────────────────────────

const stageMeta: Record<string, { label: string; className: string }> = {
  "bid-in-progress": {
    label: "In Progress",
    className: "bg-navy-900 text-white",
  },
  qualified: {
    label: "Qualified",
    className: "bg-blue-600 text-white",
  },
  identified: {
    label: "Identified",
    className: "bg-gray-200 text-gray-700",
  },
  submitted: {
    label: "Submitted",
    className: "bg-purple-100 text-purple-700",
  },
  awarded: {
    label: "Awarded",
    className: "bg-green-100 text-green-700",
  },
}

// ─── Calendar dot config ──────────────────────────────────────────────────────

const calendarDotClass: Record<string, string> = {
  deadline: "bg-red-500",
  "doc-expiry": "bg-amber-500",
  renewal: "bg-amber-500",
  "meet-the-buyer": "bg-blue-500",
  grant: "bg-blue-500",
  "framework-opening": "bg-govgreen-600",
}

// ─── Opportunity score badge ──────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-800 border-green-200"
      : score >= 55
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-red-100 text-red-800 border-red-200"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}% match
    </span>
  )
}

// ─── AI Assistant Modal placeholder ──────────────────────────────────────────

function AiModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <XCircle className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e3055]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Ask the AI Procurement Assistant</h2>
            <p className="text-sm text-gray-500">Powered by BidIQ Pro</p>
          </div>
        </div>
        <div className="mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            AI Assistant coming soon. You'll be able to ask questions like:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            <li>"What's our strongest bid right now?"</li>
            <li>"Which compliance gaps should I fix first?"</li>
            <li>"Draft a social value section for the A57 bid"</li>
          </ul>
        </div>
        <Button onClick={onClose} className="w-full bg-[#1e3055] text-white hover:bg-[#162540]">
          Got it
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const activeBids = DEMO_BIDS.filter((b) =>
    ["bid-in-progress", "qualified", "identified"].includes(b.stage),
  )

  const upcomingCalendar = DEMO_CALENDAR.filter((e) => {
    const days = daysUntil(e.date)
    return days >= -30 && days <= 180
  })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)

  const recommendedTenders = DEMO_TENDERS.filter(
    (t) => t.recommendation === "recommended",
  ).slice(0, 3)

  const topReadinessAreas = DEMO_READINESS.areas
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // ─── Stats card definitions ────────────────────────────────────────────

  const statsCards = [
    {
      title: "Procurement Readiness",
      value: `${DEMO_STATS.readinessScore}%`,
      sub: "Overall score",
      icon: <Target className="h-5 w-5 text-amber-500" />,
      accent: "border-l-amber-400",
      extra: (
        <div className="mt-2">
          <Progress value={DEMO_STATS.readinessScore} className="h-1.5 [&>div]:bg-amber-400" />
        </div>
      ),
      href: ROUTES.readiness,
      badge: (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          Developing
        </span>
      ),
    },
    {
      title: "Matched Opportunities",
      value: DEMO_STATS.matchedOpportunities,
      sub: "Active tenders matching your profile",
      icon: <Search className="h-5 w-5 text-govgreen-600" />,
      accent: "border-l-govgreen-500",
      href: ROUTES.tenders,
      badge: (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          New matches
        </span>
      ),
    },
    {
      title: "Active Bids",
      value: DEMO_STATS.activeBids,
      sub: "In your pipeline",
      icon: <FileText className="h-5 w-5 text-[#1e3055]" />,
      accent: "border-l-[#1e3055]",
      href: ROUTES.pipeline,
      badge: (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-[#1e3055]">
          Live
        </span>
      ),
    },
    {
      title: "Upcoming Deadlines",
      value: DEMO_STATS.upcomingDeadlines,
      sub: "Next 30 days",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      accent: "border-l-amber-400",
      href: ROUTES.calendar,
      badge: (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          Next 30 days
        </span>
      ),
    },
    {
      title: "Compliance Gaps",
      value: DEMO_STATS.complianceGaps,
      sub: "Documents need attention",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      accent: "border-l-red-400",
      href: ROUTES.compliance,
      badge: (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          Needs attention
        </span>
      ),
    },
    {
      title: "Pipeline Value",
      value: formatCurrency(DEMO_STATS.pipelineValue),
      sub: "Total active bid value",
      icon: <PoundSterling className="h-5 w-5 text-govgreen-600" />,
      accent: "border-l-govgreen-500",
      href: ROUTES.pipeline,
      badge: (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          YTD
        </span>
      ),
    },
    {
      title: "Estimated Win Rate",
      value: `${DEMO_STATS.estimatedWinRate}%`,
      sub: "Based on current pipeline",
      icon: <TrendingUp className="h-5 w-5 text-[#1e3055]" />,
      accent: "border-l-[#1e3055]",
      href: ROUTES.pipeline,
      badge: (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-[#1e3055]">
          Benchmark: 28%
        </span>
      ),
    },
    {
      title: "Renewals Due",
      value: DEMO_STATS.renewalsDue,
      sub: "In next 6 months",
      icon: <RefreshCw className="h-5 w-5 text-purple-500" />,
      accent: "border-l-purple-400",
      href: ROUTES.compliance,
      badge: (
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
          6 months
        </span>
      ),
    },
  ]

  return (
    <>
      {aiModalOpen && <AiModal onClose={() => setAiModalOpen(false)} />}

      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

          {/* ─── Welcome Banner ─────────────────────────────────────────── */}
          <motion.div {...fadeUp(0)} className="mb-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#1e3055] px-6 py-7 text-white shadow-lg sm:px-8">
              {/* Background gradient shimmer */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2a4a7f]/40 via-transparent to-transparent" />
              <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">
                    Good morning, Greenfield Infrastructure Ltd 👋
                  </h1>
                  <p className="mt-1 text-sm text-blue-200 sm:text-base">
                    Here's your procurement snapshot for today — 21 June 2026
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3 sm:mt-0">
                  <Badge className="border-blue-400/40 bg-blue-400/20 text-blue-100 hover:bg-blue-400/20">
                    DEMO MODE
                  </Badge>
                  <Badge className="border-amber-400/40 bg-amber-400/20 text-amber-100 hover:bg-amber-400/20">
                    Growth Plan
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Stats Cards (2×4 grid) ─────────────────────────────────── */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {statsCards.map((card, i) => (
              <motion.div key={card.title} {...fadeUp(i * 0.05)}>
                <Link to={card.href} className="block h-full">
                  <Card
                    className={`h-full cursor-pointer border-l-4 bg-white shadow-sm transition-shadow hover:shadow-md ${card.accent}`}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="rounded-lg bg-gray-50 p-2">{card.icon}</div>
                        {card.badge}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {card.value}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{card.title}</div>
                      {card.extra}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ─── Main Content: 2/3 + 1/3 ───────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ── LEFT (2/3) ─────────────────────────────────────────────── */}
            <div className="space-y-6 lg:col-span-2">

              {/* Active Bids */}
              <motion.div {...fadeUp(0.25)}>
                <Card className="bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">
                        Active Bids
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Opportunities in your pipeline
                      </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                      <Link to={ROUTES.pipeline}>
                        View Pipeline <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {activeBids.map((bid) => {
                      const meta = stageMeta[bid.stage] ?? {
                        label: bid.stage,
                        className: "bg-gray-100 text-gray-700",
                      }
                      const days = daysUntil(bid.deadline)
                      const daysLabel =
                        days < 0
                          ? `${Math.abs(days)}d overdue`
                          : days === 0
                          ? "Due today"
                          : `${days}d left`
                      const daysColor =
                        days < 0
                          ? "text-red-600"
                          : days <= 7
                          ? "text-amber-600"
                          : "text-gray-500"

                      return (
                        <div
                          key={bid.id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-200 hover:bg-white"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${meta.className}`}
                                >
                                  {meta.label}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  DEMO
                                </Badge>
                              </div>
                              <h3 className="mt-1 font-medium text-gray-900 text-sm leading-snug">
                                {bid.tenderTitle}
                              </h3>
                              <p className="text-xs text-gray-500">{bid.buyer}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-semibold text-gray-900 text-sm">
                                {formatCurrency(bid.value)}
                              </div>
                              <div className={`text-xs font-medium ${daysColor}`}>
                                {daysLabel}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                              <span>Win probability</span>
                              <span className="font-medium text-gray-700">{bid.probability}%</span>
                            </div>
                            <Progress
                              value={bid.probability}
                              className={`h-1.5 ${
                                bid.probability >= 60
                                  ? "[&>div]:bg-green-500"
                                  : bid.probability >= 40
                                  ? "[&>div]:bg-amber-400"
                                  : "[&>div]:bg-red-400"
                              }`}
                            />
                          </div>
                          {bid.assignedTo !== "Unassigned" && (
                            <p className="mt-2 text-xs text-gray-400">
                              Assigned to: {bid.assignedTo}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pipeline Chart */}
              <motion.div {...fadeUp(0.3)}>
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Pipeline Growth — Last 6 Months
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Cumulative value of bids added to your pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={PIPELINE_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={(v) => (v >= 1_000_000 ? `£${v / 1_000_000}m` : v >= 1000 ? `£${v / 1000}k` : `£${v}`)}
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                          axisLine={false}
                          tickLine={false}
                          width={52}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [formatCurrency(value), "Pipeline Value"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: 12,
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#1e3055"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={56}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* ── RIGHT (1/3) ────────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Deadlines & Events */}
              <motion.div {...fadeUp(0.28)}>
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Deadlines &amp; Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {upcomingCalendar.map((event) => {
                      const days = daysUntil(event.date)
                      const dotClass = calendarDotClass[event.type] ?? "bg-gray-400"
                      const daysStr =
                        days < 0
                          ? `${Math.abs(days)}d overdue`
                          : days === 0
                          ? "Today"
                          : `in ${days}d`
                      const daysColor =
                        days < 0
                          ? "text-red-600 font-semibold"
                          : days <= 14
                          ? "text-amber-600 font-medium"
                          : "text-gray-400"

                      return (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                          </div>
                          <span className={`shrink-0 text-xs ${daysColor}`}>{daysStr}</span>
                        </div>
                      )
                    })}
                    <Separator className="my-1" />
                    <Link
                      to={ROUTES.calendar}
                      className="flex items-center gap-1 text-xs font-medium text-[#1e3055] hover:underline"
                    >
                      View full calendar <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Compliance Alert */}
              <motion.div {...fadeUp(0.33)}>
                <Card className="border-red-200 bg-red-50 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <CardTitle className="text-sm font-semibold text-red-800">
                        5 Compliance Gaps
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-red-600">
                      Unresolved issues may exclude you from bids
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    {[
                      { label: "GDPR Policy expired", icon: <XCircle className="h-3.5 w-3.5 text-red-500" /> },
                      { label: "Cyber Essentials missing", icon: <XCircle className="h-3.5 w-3.5 text-red-500" /> },
                      {
                        label: "Professional Indemnity expiring Dec 2026",
                        icon: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs text-red-700">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    ))}
                    <Button
                      asChild
                      size="sm"
                      className="mt-2 w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <Link to={ROUTES.compliance}>
                        Fix Now <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Readiness Score Breakdown */}
              <motion.div {...fadeUp(0.37)}>
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Readiness Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Mini donut */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative shrink-0">
                        <PieChart width={80} height={80}>
                          <Pie
                            data={READINESS_DONUT}
                            cx={35}
                            cy={35}
                            innerRadius={26}
                            outerRadius={36}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {READINESS_DONUT.map((_, idx) => (
                              <Cell key={idx} fill={DONUT_COLORS[idx]} />
                            ))}
                          </Pie>
                        </PieChart>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#1e3055]">72%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Developing</p>
                        <p className="text-xs text-gray-500">5 areas need improvement</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {topReadinessAreas.map((area) => {
                        const isGreen = area.status === "green"
                        const isAmber = area.status === "amber"
                        return (
                          <div key={area.id}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                {isGreen ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                <span className="font-medium text-gray-700">{area.name}</span>
                              </div>
                              <span
                                className={`font-semibold ${
                                  isGreen
                                    ? "text-green-600"
                                    : isAmber
                                    ? "text-amber-600"
                                    : "text-red-600"
                                }`}
                              >
                                {area.score}%
                              </span>
                            </div>
                            <Progress
                              value={area.score}
                              className={`h-1.5 ${
                                isGreen
                                  ? "[&>div]:bg-green-500"
                                  : isAmber
                                  ? "[&>div]:bg-amber-400"
                                  : "[&>div]:bg-red-400"
                              }`}
                            />
                          </div>
                        )
                      })}
                    </div>

                    <Separator className="my-3" />
                    <Link
                      to={ROUTES.readiness}
                      className="flex items-center gap-1 text-xs font-medium text-[#1e3055] hover:underline"
                    >
                      View Full Report <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>

          {/* ─── Quick Actions ──────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.42)} className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1e3055]" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Button
                asChild
                variant="outline"
                className="h-14 flex-col gap-1 border-[#1e3055]/20 bg-white text-xs font-medium text-[#1e3055] hover:bg-[#1e3055] hover:text-white transition-colors"
              >
                <Link to={ROUTES.tenders}>
                  <Search className="h-4 w-4" />
                  Find Tenders
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 flex-col gap-1 border-[#1e3055]/20 bg-white text-xs font-medium text-[#1e3055] hover:bg-[#1e3055] hover:text-white transition-colors"
              >
                <Link to={ROUTES.bids}>
                  <FileText className="h-4 w-4" />
                  Write a Bid
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 flex-col gap-1 border-[#1e3055]/20 bg-white text-xs font-medium text-[#1e3055] hover:bg-[#1e3055] hover:text-white transition-colors"
              >
                <Link to={ROUTES.compliance}>
                  <AlertTriangle className="h-4 w-4" />
                  Check Compliance
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setAiModalOpen(true)}
                className="h-14 flex-col gap-1 border-[#1e3055]/20 bg-white text-xs font-medium text-[#1e3055] hover:bg-[#1e3055] hover:text-white transition-colors"
              >
                <Bot className="h-4 w-4" />
                Ask AI Assistant
              </Button>
            </div>
          </motion.div>

          {/* ─── Recommended Opportunities Strip ───────────────────────── */}
          <motion.div {...fadeUp(0.48)} className="mt-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-[#1e3055]" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Recommended for You
                </h2>
                <Badge variant="outline" className="text-xs">
                  DEMO
                </Badge>
              </div>
              <Link
                to={ROUTES.tenders}
                className="flex items-center gap-1 text-xs font-medium text-[#1e3055] hover:underline"
              >
                Browse all tenders <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedTenders.map((tender, i) => {
                const days = daysUntil(tender.deadline)
                const daysLabel =
                  days < 0
                    ? `${Math.abs(days)}d overdue`
                    : days === 0
                    ? "Closes today"
                    : `Closes in ${days}d`
                const daysColor =
                  days < 0
                    ? "text-red-600 font-semibold"
                    : days <= 14
                    ? "text-amber-600 font-medium"
                    : "text-gray-500"

                return (
                  <motion.div key={tender.id} {...fadeUp(0.48 + i * 0.06)}>
                    <Card className="h-full bg-white shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <ScoreBadge score={tender.opportunityScore} />
                          {tender.smeFlag && (
                            <span className="rounded-full bg-[#1e3055]/10 px-2 py-0.5 text-xs font-medium text-[#1e3055]">
                              SME-friendly
                            </span>
                          )}
                        </div>

                        <h3 className="mb-1 text-sm font-semibold text-gray-900 leading-snug">
                          {tender.title}
                        </h3>
                        <p className="mb-3 text-xs text-gray-500">{tender.buyer}</p>

                        <div className="mb-4 flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(tender.value)}
                            {tender.valueMax && (
                              <span className="font-normal text-gray-400">
                                {" "}–{" "}{formatCurrency(tender.valueMax)}
                              </span>
                            )}
                          </span>
                          <span className={daysColor}>{daysLabel}</span>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="w-full bg-[#1e3055] text-white hover:bg-[#162540]"
                        >
                          <Link to={ROUTES.tender(tender.id)}>
                            View Opportunity <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* ─── Demo data footer notice ────────────────────────────────── */}
          <motion.p {...fadeUp(0.55)} className="mt-10 text-center text-xs text-gray-400">
            All data shown is demo data for Greenfield Infrastructure Ltd. Connect your account to see live procurement intelligence.
          </motion.p>

        </div>
      </div>
    </>
  )
}
