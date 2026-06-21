import { useState } from "react"
import { Link } from "react-router-dom"
import {
  CheckCircle2, Clock, AlertTriangle, PoundSterling, Calendar,
  TrendingUp, FileText, Plus, ChevronRight, BarChart3, Target,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { useContracts } from "@/hooks/useApi"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import type { Milestone, KPI, Payment, Risk } from "@/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NAVY = "#1e3055"

function milestoneBadge(status: Milestone["status"]) {
  switch (status) {
    case "complete":
      return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Complete</Badge>
    case "in-progress":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">In Progress</Badge>
    case "overdue":
      return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Overdue</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">Pending</Badge>
  }
}

function paymentStatusBadge(status: Payment["status"]) {
  switch (status) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-3 w-3" /> Paid
        </span>
      )
    case "invoiced":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          <FileText className="h-3 w-3" /> Invoiced
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          <Clock className="h-3 w-3" /> Pending
        </span>
      )
  }
}

function levelBadge(level: "low" | "medium" | "high") {
  const map: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[level] ?? "bg-gray-100 text-gray-600"}`}>
      {level}
    </span>
  )
}

function kpiDot(status: KPI["status"]) {
  const map: Record<string, string> = {
    green: "bg-green-500",
    amber: "bg-amber-400",
    red: "bg-red-500",
  }
  return <span className={`inline-block h-3 w-3 rounded-full ${map[status] ?? "bg-gray-300"}`} />
}

function DaysUntilCell({ dateStr }: { dateStr: string }) {
  const d = daysUntil(dateStr)
  if (d < 0) return <span className="text-red-600 font-medium">{Math.abs(d)}d overdue</span>
  if (d === 0) return <span className="text-red-600 font-medium">Due today</span>
  return <span className="text-gray-600">in {d}d</span>
}

// ─── KPI Gauge Card ───────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KPI }) {
  const pct = kpi.target > 0 ? Math.min(100, (kpi.current / kpi.target) * 100) : 0
  const colorClass =
    kpi.status === "green" ? "[&>div]:bg-green-500" :
    kpi.status === "amber" ? "[&>div]:bg-amber-400" :
    "[&>div]:bg-red-500"

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-800 leading-snug">{kpi.name}</h3>
          {kpiDot(kpi.status)}
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">{kpi.current}</span>
          <span className="text-xs text-gray-400 mb-1">/ {kpi.target} {kpi.unit}</span>
        </div>
        <Progress value={pct} className={`h-2 ${colorClass}`} />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Current</span>
          <span>Target: {kpi.target} {kpi.unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Risk Matrix ──────────────────────────────────────────────────────────────

function RiskMatrix({ risks }: { risks: Risk[] }) {
  const quadrants = [
    {
      label: "High Impact / High Likelihood",
      cls: "bg-red-50 text-red-700",
      filter: (r: Risk) => r.impact === "high" && r.likelihood === "high",
    },
    {
      label: "High Impact / Low Likelihood",
      cls: "bg-amber-50 text-amber-700",
      filter: (r: Risk) => r.impact === "high" && r.likelihood === "low",
    },
    {
      label: "Low Impact / High Likelihood",
      cls: "bg-amber-50 text-amber-700",
      filter: (r: Risk) => r.impact === "low" && r.likelihood === "high",
    },
    {
      label: "Low Impact / Low Likelihood",
      cls: "bg-green-50 text-green-700",
      filter: (r: Risk) => r.impact === "low" && r.likelihood === "low",
    },
  ]

  return (
    <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-4 bg-gray-50">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
        <BarChart3 className="h-3.5 w-3.5" /> Risk Matrix
      </h4>
      <div className="grid grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden text-xs">
        {quadrants.map(q => {
          const matched = risks.filter(q.filter)
          return (
            <div key={q.label} className={`${q.cls} p-3 min-h-[72px]`}>
              <p className="font-medium mb-1">{q.label}</p>
              {matched.length === 0 ? (
                <p className="opacity-50">None</p>
              ) : (
                matched.map(r => (
                  <p key={r.id} className="opacity-80 truncate">{r.description}</p>
                ))
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-gray-400">Medium-rated risks not plotted — see table above.</p>
    </div>
  )
}

// ─── Payment chart data ───────────────────────────────────────────────────────

const PAYMENT_CHART_DATA = [
  { name: "Paid", value: 0 },
  { name: "Outstanding", value: 280_000 },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContractDelivery() {
  const [activeTab, setActiveTab] = useState("milestones")
  const { data: contracts = [] } = useContracts()
  const contract = contracts[0] ?? null

  const totalDays = contract ? Math.round(
    (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) /
    (1000 * 60 * 60 * 24),
  ) : 0
  const daysElapsed = contract ? Math.max(0, Math.round(
    (Date.now() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )) : 0
  const progressPct = totalDays > 0 ? Math.min(100, Math.round((daysElapsed / totalDays) * 100)) : 0
  const daysToRenewal = contract ? daysUntil(contract.renewalDate) : 0
  const completedMilestones = contract ? contract.milestones.filter(m => m.status === "complete").length : 0
  const totalPaid = contract
    ? contract.paymentSchedule.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#1e3055] px-6 py-7 text-white shadow-lg sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2a4a7f]/40 via-transparent to-transparent" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold sm:text-2xl">Contract Delivery Hub</h1>
                </div>
                <p className="text-sm text-blue-200">
                  Track milestones, KPIs, payments and risks for your active contracts
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
                  <p className="text-xs text-blue-200">Active Contracts</p>
                  <p className="text-2xl font-bold">{contracts.length}</p>
                </div>
                {contract && (
                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
                    <p className="text-xs text-blue-200">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(contract.value)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Empty state ──────────────────────────────────────────────── */}
        {!contract && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center mb-6">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No active contracts yet</p>
            <p className="text-xs text-gray-400 mt-1">
              No active contracts yet — they'll appear here when you win and record a contract
            </p>
          </div>
        )}

        {/* ─── Contract Overview Card ────────────────────────────────────── */}
        {contract && <Card className="mb-6 bg-white shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">{contract.title}</h2>
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    ACTIVE
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-5">Buyer: {contract.buyer}</p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      Contract Value
                    </p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(contract.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      Start Date
                    </p>
                    <p className="font-medium text-gray-800">{formatDate(contract.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      End Date
                    </p>
                    <p className="font-medium text-gray-800">{formatDate(contract.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      Renewal Date
                    </p>
                    <p className="font-medium text-gray-800">{formatDate(contract.renewalDate)}</p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                      Renewal in {daysToRenewal}d
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Contract term progress</span>
                    <span className="font-medium text-gray-700">
                      {progressPct}% elapsed · {daysElapsed}/{totalDays} days
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2.5 [&>div]:bg-[#1e3055]" />
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>{formatDate(contract.startDate)}</span>
                    <span>{formatDate(contract.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Quick-stat pills */}
              <div className="flex flex-row gap-3 lg:flex-col lg:items-end lg:shrink-0">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center min-w-[100px]">
                  <p className="text-xs text-gray-400 mb-0.5">Milestones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedMilestones}/{contract.milestones.length}
                  </p>
                  <p className="text-xs text-gray-400">complete</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center min-w-[100px]">
                  <p className="text-xs text-gray-400 mb-0.5">Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                  <p className="text-xs text-gray-400">of {formatCurrency(contract.value)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}

        {/* ─── Tabs ─────────────────────────────────────────────────────── */}
        {contract && <>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-white border border-gray-200 shadow-sm rounded-xl p-1.5">
            {[
              { value: "milestones", label: "Milestones" },
              { value: "kpis", label: "KPIs" },
              { value: "payments", label: "Payment Schedule" },
              { value: "risks", label: "Risk Register" },
              { value: "documents", label: "Documents" },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg text-sm data-[state=active]:bg-[#1e3055] data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── TAB 1: MILESTONES ─────────────────────────────────────────── */}
          <TabsContent value="milestones">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Milestones</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {completedMilestones} of {contract.milestones.length} complete
                  </p>
                </div>
                <Button size="sm" className="bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Milestone
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-5">
                  <Progress
                    value={(completedMilestones / contract.milestones.length) * 100}
                    className="h-2.5 [&>div]:bg-green-500"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {completedMilestones}/{contract.milestones.length} milestones complete
                    {completedMilestones === 0 && " — contract commences 1 Aug 2026"}
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Milestone</TableHead>
                      <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Value</TableHead>
                      <TableHead className="font-semibold text-gray-700">Days Until</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.milestones.map((m: Milestone) => (
                      <TableRow key={m.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{m.title}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(m.dueDate)}</TableCell>
                        <TableCell>{milestoneBadge(m.status)}</TableCell>
                        <TableCell className="text-right text-gray-700">
                          {m.value
                            ? formatCurrency(m.value)
                            : <span className="text-gray-300">—</span>}
                        </TableCell>
                        <TableCell>
                          <DaysUntilCell dateStr={m.dueDate} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="mt-4 text-xs text-gray-400 italic">
                  DEMO — All milestones are pending. Contract starts 1 August 2026.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 2: KPIs ───────────────────────────────────────────────── */}
          <TabsContent value="kpis">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Key Performance Indicators
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Contract starts 1 Aug 2026 — KPI tracking begins then
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Target className="h-3.5 w-3.5" /> Configure KPIs
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">KPI monitoring not yet active</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Tracking will begin automatically on 1 August 2026 when the contract commences.
                      All current values show 0 as pre-commencement baselines.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {contract.kpis.map((kpi: KPI) => (
                    <KpiCard key={kpi.id} kpi={kpi} />
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
                  <BarChart3 className="h-9 w-9 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">KPI Trend Chart</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Monthly performance data will populate here once delivery begins (1 Aug 2026)
                  </p>
                </div>

                <p className="mt-4 text-xs text-gray-400 italic">
                  DEMO — KPI targets are set by Trafford Council. Values will update monthly.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 3: PAYMENT SCHEDULE ────────────────────────────────────── */}
          <TabsContent value="payments">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Payment Schedule</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Total paid: {formatCurrency(totalPaid)} / {formatCurrency(contract.value)}
                  </p>
                </div>
                <Button size="sm" className="bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Raise Invoice
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Amount received progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Amount received</span>
                    <span className="font-medium text-gray-700">
                      {formatCurrency(totalPaid)} / {formatCurrency(contract.value)}
                    </span>
                  </div>
                  <Progress
                    value={(totalPaid / contract.value) * 100}
                    className="h-2.5 [&>div]:bg-green-500"
                  />
                </div>

                {/* Mini chart */}
                <div className="mb-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Payment Breakdown
                  </p>
                  <ResponsiveContainer width="100%" height={90}>
                    <BarChart
                      data={PAYMENT_CHART_DATA}
                      layout="vertical"
                      margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={v => `£${v / 1000}k`}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value)]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="value" fill={NAVY} radius={[0, 4, 4, 0]} maxBarSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.paymentSchedule.map((p: Payment) => (
                      <TableRow key={p.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{p.description}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-900">
                          {formatCurrency(p.amount)}
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDate(p.dueDate)}</TableCell>
                        <TableCell>{paymentStatusBadge(p.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-[#1e3055] hover:bg-blue-50"
                          >
                            <FileText className="h-3 w-3 mr-1" /> Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="mt-4 text-xs text-gray-400 italic">
                  DEMO — Full payment schedule of £280,000 to be agreed at contract mobilisation (Aug 2026).
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 4: RISK REGISTER ───────────────────────────────────────── */}
          <TabsContent value="risks">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Risk Register</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {contract.risks.length} risks identified
                  </p>
                </div>
                <Button size="sm" className="bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Risk
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700">Likelihood</TableHead>
                      <TableHead className="font-semibold text-gray-700">Impact</TableHead>
                      <TableHead className="font-semibold text-gray-700">Mitigation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.risks.map((r: Risk) => (
                      <TableRow key={r.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{r.description}</TableCell>
                        <TableCell>{levelBadge(r.likelihood)}</TableCell>
                        <TableCell>{levelBadge(r.impact)}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-[300px]">
                          {r.mitigation}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <RiskMatrix risks={contract.risks} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 5: DOCUMENTS ──────────────────────────────────────────── */}
          <TabsContent value="documents">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Contract Documents</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Key documents relevant to this contract
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: <FileText className="h-5 w-5 text-blue-600" />,
                      name: "Method Statement — Highway Repairs",
                      bg: "bg-blue-50",
                      border: "border-blue-100",
                    },
                    {
                      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
                      name: "Health & Safety Plan 2026",
                      bg: "bg-amber-50",
                      border: "border-amber-100",
                    },
                    {
                      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
                      name: "Public Liability Insurance — £10m",
                      bg: "bg-green-50",
                      border: "border-green-100",
                    },
                    {
                      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
                      name: "ISO 9001 Quality Certificate",
                      bg: "bg-green-50",
                      border: "border-green-100",
                    },
                    {
                      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
                      name: "ISO 14001 Environmental Certificate",
                      bg: "bg-green-50",
                      border: "border-green-100",
                    },
                    {
                      icon: <FileText className="h-5 w-5 text-blue-600" />,
                      name: "Contract Agreement — Trafford Council",
                      bg: "bg-blue-50",
                      border: "border-blue-100",
                    },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border ${doc.border} ${doc.bg} p-4`}
                    >
                      <div className="shrink-0">{doc.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug truncate">
                          {doc.name}
                        </p>
                        <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">
                          Valid
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 text-xs shrink-0 text-gray-500">
                        View
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Link to Compliance Vault */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <PoundSterling className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        More documents in Compliance Vault
                      </p>
                      <p className="text-xs text-gray-500">
                        View all policies, insurance and certifications
                      </p>
                    </div>
                  </div>
                  <Link to="/compliance">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs text-[#1e3055] border-[#1e3055]/30 hover:bg-[#1e3055] hover:text-white shrink-0"
                    >
                      Open Vault <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ─── Renewal Alert ─────────────────────────────────────────────── */}
        <Card className="mt-6 border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">
                    Renewal date: {formatDate(contract.renewalDate)}
                  </h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    Start renewal bid preparation 6 months early —{" "}
                    <strong>October 2026</strong>. You have{" "}
                    <strong>{daysToRenewal} days</strong> until renewal opens.
                  </p>
                  <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Early preparation typically increases renewal win rate by 20–35%
                  </p>
                </div>
              </div>
              <Link to="/bids" className="shrink-0">
                <Button className="bg-amber-600 text-white hover:bg-amber-700 gap-1.5">
                  Create Renewal Bid <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        </>}

      </div>
    </div>
  )
}
