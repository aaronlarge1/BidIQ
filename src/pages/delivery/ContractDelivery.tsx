import { useState } from "react"
import { Link } from "react-router-dom"
import {
  CheckCircle2, Clock, AlertTriangle, PoundSterling, Calendar,
  TrendingUp, FileText, Plus, ChevronRight, BarChart3, Target,
  X, Loader2,
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
import { useContracts, useCreateContract } from "@/hooks/useApi"
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

// ─── Add Contract Modal ───────────────────────────────────────────────────────

interface AddContractForm {
  title: string
  buyer: string
  value: string
  startDate: string
  endDate: string
  renewalDate: string
}

function AddContractModal({ onClose }: { onClose: () => void }) {
  const createContract = useCreateContract()
  const [form, setForm] = useState<AddContractForm>({
    title: "",
    buyer: "",
    value: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
  })

  const set = (field: keyof AddContractForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createContract.mutateAsync({
      title: form.title,
      buyer: form.buyer,
      value: parseFloat(form.value),
      startDate: form.startDate,
      endDate: form.endDate,
      renewalDate: form.renewalDate,
      milestones: [],
      kpis: [],
      paymentSchedule: [],
      risks: [],
    } as Parameters<typeof createContract.mutateAsync>[0])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add Contract</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Contract Title</label>
              <input
                required
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Highway Maintenance — Manchester City Council"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Buyer / Client</label>
              <input
                required
                value={form.buyer}
                onChange={set("buyer")}
                placeholder="e.g. Manchester City Council"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Contract Value (£)</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.value}
                onChange={set("value")}
                placeholder="e.g. 185000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                required
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                required
                type="date"
                value={form.endDate}
                onChange={set("endDate")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Renewal / Rebid Date</label>
              <input
                required
                type="date"
                value={form.renewalDate}
                onChange={set("renewalDate")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30"
              />
              <p className="text-xs text-gray-400 mt-0.5">The date when rebidding begins — usually 6–12 months before end.</p>
            </div>
          </div>

          {createContract.isError && (
            <p className="text-sm text-red-600">Failed to create contract. Please try again.</p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createContract.isPending}
              className="bg-[#1e3055] text-white hover:bg-[#162540] text-sm gap-2"
            >
              {createContract.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {createContract.isPending ? "Creating…" : "Add Contract"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContractDelivery() {
  const [activeTab, setActiveTab] = useState("milestones")
  const [showAddModal, setShowAddModal] = useState(false)
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
  const totalOutstanding = contract
    ? contract.paymentSchedule.filter(p => p.status !== "paid").reduce((s, p) => s + p.amount, 0)
    : 0
  const paymentChartData = [
    { name: "Paid", value: totalPaid },
    { name: "Outstanding", value: totalOutstanding },
  ]

  // Compute renewal prep date (6 months before renewal)
  const renewalPrepDate = contract
    ? (() => {
        const d = new Date(contract.renewalDate)
        d.setMonth(d.getMonth() - 6)
        return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
      })()
    : ""

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {showAddModal && <AddContractModal onClose={() => setShowAddModal(false)} />}

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
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-white text-[#1e3055] hover:bg-blue-50 gap-1.5 font-semibold"
                >
                  <Plus className="h-4 w-4" /> Add Contract
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Empty state ──────────────────────────────────────────────── */}
        {!contract && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center mb-6">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500 mb-1">No active contracts yet</p>
            <p className="text-xs text-gray-400 mb-5">
              Add a contract once you've been awarded work and it will appear here
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Your First Contract
            </Button>
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
                {contract.milestones.length > 0 ? (
                  <>
                    <div className="mb-5">
                      <Progress
                        value={(completedMilestones / contract.milestones.length) * 100}
                        className="h-2.5 [&>div]:bg-green-500"
                      />
                      <p className="text-xs text-gray-400 mt-1.5">
                        {completedMilestones}/{contract.milestones.length} milestones complete
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
                              {m.value ? formatCurrency(m.value) : <span className="text-gray-300">—</span>}
                            </TableCell>
                            <TableCell>
                              <DaysUntilCell dateStr={m.dueDate} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <CheckCircle2 className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No milestones added yet</p>
                    <p className="text-xs text-gray-300 mt-0.5">Use "Add Milestone" to track contract deliverables</p>
                  </div>
                )}
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
                    {contract.kpis.length} KPI{contract.kpis.length !== 1 ? "s" : ""} configured
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Target className="h-3.5 w-3.5" /> Configure KPIs
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {contract.kpis.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {contract.kpis.map((kpi: KPI) => (
                      <KpiCard key={kpi.id} kpi={kpi} />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Target className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No KPIs configured yet</p>
                    <p className="text-xs text-gray-300 mt-0.5">KPIs will be added during contract mobilisation</p>
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
                  <BarChart3 className="h-9 w-9 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">KPI Trend Chart</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Monthly performance data will populate here once delivery begins
                  </p>
                </div>
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
                {contract.paymentSchedule.length > 0 ? (
                  <>
                    {/* Amount received progress */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Amount received</span>
                        <span className="font-medium text-gray-700">
                          {formatCurrency(totalPaid)} / {formatCurrency(contract.value)}
                        </span>
                      </div>
                      <Progress
                        value={contract.value > 0 ? (totalPaid / contract.value) * 100 : 0}
                        className="h-2.5 [&>div]:bg-green-500"
                      />
                    </div>

                    {/* Payment breakdown chart */}
                    <div className="mb-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Payment Breakdown
                      </p>
                      <ResponsiveContainer width="100%" height={90}>
                        <BarChart
                          data={paymentChartData}
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
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <PoundSterling className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No payment schedule set up yet</p>
                    <p className="text-xs text-gray-300 mt-0.5">Payment milestones will appear here once agreed with the buyer</p>
                  </div>
                )}
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
                {contract.risks.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <AlertTriangle className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No risks logged yet</p>
                    <p className="text-xs text-gray-300 mt-0.5">Use "Add Risk" to build your contract risk register</p>
                  </div>
                )}
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
                <div className="py-8 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50 mb-4">
                  <FileText className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No documents attached to this contract yet</p>
                  <p className="text-xs text-gray-300 mt-0.5">Upload via the Compliance Vault and link them here</p>
                </div>

                {/* Link to Compliance Vault */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
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
                    <strong>{renewalPrepDate}</strong>. You have{" "}
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
