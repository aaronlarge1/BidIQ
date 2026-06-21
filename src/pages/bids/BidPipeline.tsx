import { useState } from "react"
import {
  Plus,
  MoreHorizontal,
  PoundSterling,
  Calendar,
  User,
  TrendingUp,
  Kanban,
  List,
  Filter,
  Trophy,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ---------------------------------------------------------------------------
// Types (local fallback — replace with @/types import if available)
// ---------------------------------------------------------------------------

type BidStage =
  | "Identified"
  | "Qualified"
  | "Bid in Progress"
  | "Submitted"
  | "Clarification"
  | "Awarded"
  | "Lost"
  | "Renewal Due"

interface Bid {
  id: string
  title: string
  buyer: string
  value: number
  deadline: string // ISO date
  probability: number // 0–100
  assignedInitials: string
  stage: BidStage
}

// ---------------------------------------------------------------------------
// Demo data (inline fallback — replace with DEMO_BIDS import if available)
// ---------------------------------------------------------------------------

const DEMO_BIDS: Bid[] = [
  {
    id: "b-001",
    title: "A57 Road Resurfacing — National Highways",
    buyer: "National Highways",
    value: 1200000,
    deadline: "2026-07-04",
    probability: 65,
    assignedInitials: "JR",
    stage: "Bid in Progress",
  },
  {
    id: "b-002",
    title: "Winter Maintenance Stockport 2026/27",
    buyer: "Stockport Council",
    value: 480000,
    deadline: "2026-07-18",
    probability: 55,
    assignedInitials: "SW",
    stage: "Qualified",
  },
  {
    id: "b-003",
    title: "Street Lighting Maintenance Leeds",
    buyer: "Leeds City Council",
    value: 290000,
    deadline: "2026-08-01",
    probability: 45,
    assignedInitials: "AM",
    stage: "Identified",
  },
  {
    id: "b-004",
    title: "M62 Junction 12 Improvement Works",
    buyer: "National Highways",
    value: 950000,
    deadline: "2026-06-28",
    probability: 50,
    assignedInitials: "JR",
    stage: "Submitted",
  },
  {
    id: "b-005",
    title: "Trafford Highway Repairs Framework",
    buyer: "Trafford Council",
    value: 640000,
    deadline: "2026-05-30",
    probability: 100,
    assignedInitials: "SW",
    stage: "Awarded",
  },
  {
    id: "b-006",
    title: "Manchester Pothole Repair Rapid Response",
    buyer: "Manchester City Council",
    value: 185000,
    deadline: "2026-07-10",
    probability: 30,
    assignedInitials: "AM",
    stage: "Lost",
  },
  {
    id: "b-007",
    title: "Salford Bridge Inspection Services",
    buyer: "Salford City Council",
    value: 220000,
    deadline: "2026-09-15",
    probability: 40,
    assignedInitials: "JR",
    stage: "Clarification",
  },
  {
    id: "b-008",
    title: "A56 Corridor Maintenance — Renewal",
    buyer: "Transport for Greater Manchester",
    value: 310000,
    deadline: "2026-08-20",
    probability: 72,
    assignedInitials: "SW",
    stage: "Renewal Due",
  },
]

// ---------------------------------------------------------------------------
// Utility helpers (inline fallbacks)
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}m`
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}k`
  return `£${value.toLocaleString()}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysUntil(iso: string): number {
  const now = new Date()
  const target = new Date(iso)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAGE_ORDER: BidStage[] = [
  "Identified",
  "Qualified",
  "Bid in Progress",
  "Submitted",
  "Clarification",
  "Awarded",
  "Lost",
  "Renewal Due",
]

const STAGE_STYLES: Record<
  BidStage,
  { header: string; badge: string; won?: boolean }
> = {
  Identified: {
    header: "bg-slate-800 text-slate-300 border-slate-700",
    badge: "bg-slate-700 text-slate-300",
  },
  Qualified: {
    header: "bg-blue-900/40 text-blue-300 border-blue-800/50",
    badge: "bg-blue-900/60 text-blue-300",
  },
  "Bid in Progress": {
    header: "bg-[#0f2a4a] text-[#7ec8e3] border-[#1e4a7a]",
    badge: "bg-[#1e4a7a] text-[#7ec8e3]",
  },
  Submitted: {
    header: "bg-violet-900/40 text-violet-300 border-violet-800/50",
    badge: "bg-violet-900/60 text-violet-300",
  },
  Clarification: {
    header: "bg-amber-900/30 text-amber-300 border-amber-800/40",
    badge: "bg-amber-900/50 text-amber-300",
  },
  Awarded: {
    header: "bg-emerald-900/50 text-emerald-200 border-emerald-700/50",
    badge: "bg-emerald-800/60 text-emerald-200",
    won: true,
  },
  Lost: {
    header: "bg-red-900/30 text-red-300 border-red-800/40",
    badge: "bg-red-900/50 text-red-300",
  },
  "Renewal Due": {
    header: "bg-orange-900/30 text-orange-300 border-orange-800/40",
    badge: "bg-orange-900/50 text-orange-300",
  },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProbabilityBar({ value }: { value: number }) {
  const cls =
    value >= 70
      ? "bg-emerald-500"
      : value >= 40
      ? "bg-amber-400"
      : "bg-red-500"
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-slate-500">Win probability</span>
        <span className="text-xs font-semibold text-slate-400">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-700">
        <div
          className={`h-1.5 rounded-full ${cls} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e4a7a] text-xs font-bold text-emerald-300">
      {initials}
    </div>
  )
}

function BidCard({ bid }: { bid: Bid }) {
  const days = daysUntil(bid.deadline)
  const isUrgent = days <= 14
  const style = STAGE_STYLES[bid.stage]

  return (
    <Card className="border border-slate-700 bg-slate-800/60 hover:border-slate-600 transition-colors cursor-pointer">
      <CardContent className="p-3">
        {/* Title */}
        <p className="mb-0.5 line-clamp-2 text-xs font-semibold leading-snug text-slate-100">
          {bid.title}
        </p>
        {/* Buyer */}
        <p className="mb-2 text-xs text-slate-500">{bid.buyer}</p>

        {/* Value */}
        <p className="mb-1.5 text-sm font-bold text-emerald-400">
          {formatCurrency(bid.value)}
        </p>

        {/* Deadline */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0 text-slate-500" />
          <span
            className={`text-xs ${
              isUrgent ? "font-semibold text-red-400" : "text-slate-400"
            }`}
          >
            {formatDate(bid.deadline)}
            {isUrgent && days > 0 && (
              <span className="ml-1 text-red-400">({days}d)</span>
            )}
            {days <= 0 && <span className="ml-1 text-red-500">(overdue)</span>}
          </span>
        </div>

        {/* Probability bar */}
        <ProbabilityBar value={bid.probability} />

        {/* Footer row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <InitialsAvatar initials={bid.assignedInitials} />
            {bid.stage === "Awarded" && (
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-slate-700 bg-slate-800 text-slate-200"
            >
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                Move Stage
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                View Tender
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer text-red-400">
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// List view table row
// ---------------------------------------------------------------------------

function ListRow({ bid }: { bid: Bid }) {
  const days = daysUntil(bid.deadline)
  const isUrgent = days <= 14
  const style = STAGE_STYLES[bid.stage]

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-100 line-clamp-1">{bid.title}</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{bid.buyer}</td>
      <td className="px-4 py-3 text-sm font-bold text-emerald-400">
        {formatCurrency(bid.value)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${style.badge} border-transparent`}
        >
          {bid.stage === "Awarded" && <Trophy className="h-3 w-3 text-amber-300" />}
          {bid.stage}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs ${isUrgent ? "font-semibold text-red-400" : "text-slate-400"}`}
        >
          {formatDate(bid.deadline)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="h-1.5 w-16 rounded-full bg-slate-700">
            <div
              className={`h-1.5 rounded-full ${
                bid.probability >= 70
                  ? "bg-emerald-500"
                  : bid.probability >= 40
                  ? "bg-amber-400"
                  : "bg-red-500"
              }`}
              style={{ width: `${bid.probability}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">{bid.probability}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <InitialsAvatar initials={bid.assignedInitials} />
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-slate-700 bg-slate-800 text-slate-200"
          >
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
              Move Stage
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer text-red-400">
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Pipeline health summary card
// ---------------------------------------------------------------------------

function PipelineHealth({ bids }: { bids: Bid[] }) {
  const totalValue = bids.reduce((sum, b) => sum + b.value, 0)
  const winRate = 0.34
  const expectedWins = totalValue * winRate
  const dueThisMonth = bids.filter((b) => {
    const d = new Date(b.deadline)
    const now = new Date()
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      b.stage !== "Awarded" &&
      b.stage !== "Lost"
    )
  }).length

  const stageValues = STAGE_ORDER.map((stage) => ({
    stage,
    value: bids.filter((b) => b.stage === stage).reduce((s, b) => s + b.value, 0),
  })).filter((s) => s.value > 0)

  const maxVal = Math.max(...stageValues.map((s) => s.value), 1)

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-slate-100">Pipeline Health</span>
        </div>
        <Badge className="border border-emerald-700/50 bg-emerald-900/60 text-xs text-emerald-300">
          DEMO
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Total pipeline</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalValue)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Win rate</p>
          <p className="text-xl font-bold text-slate-100">34%</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Expected wins</p>
          <p className="text-xl font-bold text-amber-400">{formatCurrency(expectedWins)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Due this month</p>
          <p className="text-xl font-bold text-red-400">{dueThisMonth}</p>
        </div>
      </div>

      <Separator className="my-4 bg-slate-800" />

      {/* Stage mini bar chart */}
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
        By Stage
      </p>
      <div className="space-y-2">
        {stageValues.map(({ stage, value }) => {
          const style = STAGE_STYLES[stage]
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-slate-400">{stage}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-emerald-600/70 transition-all"
                  style={{ width: `${(value / maxVal) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-slate-300">
                {formatCurrency(value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ViewMode = "kanban" | "list"
type SortField = "title" | "value" | "deadline" | "probability"
type SortDir = "asc" | "desc"

export default function BidPipeline() {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [sortField, setSortField] = useState<SortField>("deadline")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const bids = DEMO_BIDS

  const totalPipelineValue = bids.reduce((s, b) => s + b.value, 0)
  const activeBids = bids.filter(
    (b) => b.stage !== "Awarded" && b.stage !== "Lost"
  ).length

  // Sort for list view
  const sortedBids = [...bids].sort((a, b) => {
    let cmp = 0
    if (sortField === "title") cmp = a.title.localeCompare(b.title)
    else if (sortField === "value") cmp = a.value - b.value
    else if (sortField === "deadline")
      cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    else if (sortField === "probability") cmp = a.probability - b.probability
    return sortDir === "asc" ? cmp : -cmp
  })

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3 ml-0.5" />
    ) : (
      <ChevronDown className="inline h-3 w-3 ml-0.5" />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">Bid Pipeline</h1>
              <Badge className="border border-emerald-700/50 bg-emerald-900/60 text-xs text-emerald-300">
                DEMO
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              <span className="font-semibold text-emerald-400">
                {formatCurrency(totalPipelineValue)}
              </span>{" "}
              total pipeline &nbsp;|&nbsp;{" "}
              <span className="font-semibold text-slate-200">{activeBids}</span> active
              bids &nbsp;|&nbsp;{" "}
              <span className="font-semibold text-slate-200">34%</span> win rate
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/60 p-0.5">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors ${
                  viewMode === "kanban"
                    ? "bg-[#1e4a7a] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors ${
                  viewMode === "list"
                    ? "bg-[#1e4a7a] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              size="sm"
              className="bg-emerald-700 text-white hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Bid
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* KANBAN VIEW                                                       */}
        {/* ---------------------------------------------------------------- */}
        {viewMode === "kanban" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: "1400px" }}>
              {STAGE_ORDER.map((stage) => {
                const stageBids = bids.filter((b) => b.stage === stage)
                const stageValue = stageBids.reduce((s, b) => s + b.value, 0)
                const style = STAGE_STYLES[stage]

                return (
                  <div
                    key={stage}
                    className="flex w-[220px] shrink-0 flex-col rounded-xl border border-slate-700/60 bg-slate-900/50"
                  >
                    {/* Column header */}
                    <div
                      className={`flex items-center justify-between rounded-t-xl border-b border-slate-700/60 px-3 py-2.5 ${style.header}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {style.won && <Trophy className="h-3.5 w-3.5 text-amber-300" />}
                        <span className="text-xs font-semibold">{stage}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${style.badge}`}
                        >
                          {stageBids.length}
                        </span>
                      </div>
                      {stageValue > 0 && (
                        <span className="text-xs font-medium opacity-80">
                          {formatCurrency(stageValue)}
                        </span>
                      )}
                    </div>

                    {/* Cards */}
                    <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                      {stageBids.length === 0 && (
                        <p className="py-4 text-center text-xs text-slate-600">
                          No bids
                        </p>
                      )}
                      {stageBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} />
                      ))}

                      {/* Add button */}
                      <button className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2 text-xs text-slate-600 hover:border-slate-500 hover:text-slate-400 transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* LIST VIEW                                                         */}
        {/* ---------------------------------------------------------------- */}
        {viewMode === "list" && (
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60">
                    {(
                      [
                        { label: "Tender", field: "title" as SortField },
                        { label: "Buyer", field: null },
                        { label: "Value", field: "value" as SortField },
                        { label: "Stage", field: null },
                        { label: "Deadline", field: "deadline" as SortField },
                        { label: "Probability", field: "probability" as SortField },
                        { label: "Assigned", field: null },
                        { label: "", field: null },
                      ] as { label: string; field: SortField | null }[]
                    ).map(({ label, field }) => (
                      <th
                        key={label}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                          field ? "cursor-pointer hover:text-slate-200" : ""
                        }`}
                        onClick={() => field && toggleSort(field)}
                      >
                        {label}
                        {field && <SortIcon field={field} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedBids.map((bid) => (
                    <ListRow key={bid.id} bid={bid} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* PIPELINE HEALTH                                                   */}
        {/* ---------------------------------------------------------------- */}
        <PipelineHealth bids={bids} />
      </div>
    </div>
  )
}
