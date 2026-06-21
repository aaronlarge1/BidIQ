import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  PoundSterling,
  Building2,
  Star,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DEMO_TENDERS } from "@/lib/demo-data"
import { formatCurrency, formatDate, daysUntil, cn } from "@/lib/utils"
import { CONTRACT_CATEGORIES, UK_REGIONS, ROUTES } from "@/lib/constants"
import type { Tender } from "@/types"

// ─── Types & constants ────────────────────────────────────────────────────────

type ValueRange = "any" | "under100k" | "100k-500k" | "500k-1m" | "1m-5m" | "5m+"
type DeadlineRange = "any" | "30" | "60" | "90"
type SocialValue = "any" | "10" | "15" | "20"

const VALUE_RANGES: { label: string; value: ValueRange }[] = [
  { label: "Any value", value: "any" },
  { label: "Under £100k", value: "under100k" },
  { label: "£100k – £500k", value: "100k-500k" },
  { label: "£500k – £1m", value: "500k-1m" },
  { label: "£1m – £5m", value: "1m-5m" },
  { label: "£5m+", value: "5m+" },
]

const BUYER_TYPES = [
  "Central Government",
  "Local Authority",
  "NHS",
  "Housing",
  "Education",
  "Highways",
] as const

const CATEGORY_COLORS: Record<string, string> = {
  highways: "bg-navy-700 text-white",
  nhs: "bg-blue-600 text-white",
  "local-authority": "bg-govgreen-600 text-white",
  education: "bg-purple-600 text-white",
  construction: "bg-orange-600 text-white",
  maintenance: "bg-teal-600 text-white",
  facilities: "bg-indigo-600 text-white",
  cleaning: "bg-sky-600 text-white",
  waste: "bg-lime-700 text-white",
  transport: "bg-cyan-700 text-white",
  security: "bg-rose-700 text-white",
  "social-care": "bg-pink-600 text-white",
  it: "bg-violet-600 text-white",
  "professional-services": "bg-slate-600 text-white",
  housing: "bg-amber-700 text-white",
}

function categoryLabel(value: string): string {
  return CONTRACT_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

function valueInRange(tender: Tender, range: ValueRange): boolean {
  if (range === "any") return true
  const v = tender.value
  if (range === "under100k") return v < 100_000
  if (range === "100k-500k") return v >= 100_000 && v <= 500_000
  if (range === "500k-1m") return v > 500_000 && v <= 1_000_000
  if (range === "1m-5m") return v > 1_000_000 && v <= 5_000_000
  if (range === "5m+") return v > 5_000_000
  return true
}

// ─── Opportunity Score Badge ──────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-govgreen-100 text-govgreen-700 border-govgreen-300"
      : score >= 40
      ? "bg-amber-100 text-amber-700 border-amber-300"
      : "bg-red-100 text-red-700 border-red-300"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        color
      )}
    >
      <TrendingUp className="h-3 w-3" />
      {score}% match
    </span>
  )
}

// ─── Recommendation Badge ─────────────────────────────────────────────────────

function RecommendationBadge({ rec }: { rec: Tender["recommendation"] }) {
  if (rec === "recommended")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-govgreen-100 px-2.5 py-0.5 text-xs font-medium text-govgreen-700">
        <CheckCircle2 className="h-3 w-3" />
        Recommended
      </span>
    )
  if (rec === "maybe")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <AlertCircle className="h-3 w-3" />
        Maybe
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
      <X className="h-3 w-3" />
      Not Recommended
    </span>
  )
}

// ─── Deadline chip ────────────────────────────────────────────────────────────

function DeadlineChip({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline)
  const urgent = days < 14
  const soon = days < 30
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        urgent ? "text-red-600" : soon ? "text-amber-600" : "text-gray-500"
      )}
    >
      <Calendar className="h-3.5 w-3.5" />
      {formatDate(deadline)}
      <span
        className={cn(
          "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
          urgent
            ? "bg-red-100 text-red-700"
            : soon
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {days}d left
      </span>
    </span>
  )
}

// ─── Tender Card ──────────────────────────────────────────────────────────────

function TenderCard({
  tender,
  onSave,
  onReject,
}: {
  tender: Tender
  onSave: (id: string) => void
  onReject: (id: string) => void
}) {
  const navigate = useNavigate()

  const cardBorder =
    tender.recommendation === "recommended"
      ? "border-l-4 border-l-govgreen-500 bg-govgreen-50/20"
      : tender.recommendation === "maybe"
      ? "border-l-4 border-l-amber-400"
      : "border-l-4 border-l-gray-200 opacity-80"

  const catColor = CATEGORY_COLORS[tender.category] ?? "bg-gray-600 text-white"

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        cardBorder
      )}
      onClick={() => navigate(ROUTES.tender(tender.id))}
    >
      <CardContent className="p-5">
        {/* Top row: badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              catColor
            )}
          >
            {categoryLabel(tender.category)}
          </span>
          {tender.smeFlag && (
            <Badge
              variant="outline"
              className="border-govgreen-400 bg-govgreen-50 text-govgreen-700 text-[11px]"
            >
              SME Friendly
            </Badge>
          )}
          {tender.isDemo && (
            <Badge variant="secondary" className="text-[11px] opacity-70">
              DEMO
            </Badge>
          )}
          {tender.type === "framework" && (
            <Badge
              variant="outline"
              className="border-navy-400 bg-navy-50 text-navy-700 text-[11px]"
            >
              Framework
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-navy-700">
          {tender.title}
        </h3>

        {/* Buyer + location */}
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {tender.buyer}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {tender.location}
          </span>
        </div>

        {/* Value + deadline */}
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <PoundSterling className="h-3.5 w-3.5 text-gray-400" />
            {tender.valueMax
              ? `${formatCurrency(tender.value)} – ${formatCurrency(tender.valueMax)}`
              : formatCurrency(tender.value)}
          </span>
          <DeadlineChip deadline={tender.deadline} />
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {tender.description}
        </p>

        {/* Bottom row */}
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScoreBadge score={tender.opportunityScore} />
            <RecommendationBadge rec={tender.recommendation} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => onReject(tender.id)}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => onSave(tender.id)}
            >
              <Star className="mr-1 h-3 w-3" />
              Save
            </Button>
            <Button
              size="sm"
              className="h-8 bg-navy-700 px-3 text-xs text-white hover:bg-navy-800"
              onClick={() => navigate(ROUTES.tender(tender.id))}
            >
              View Opportunity
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Sidebar Filters ──────────────────────────────────────────────────────────

interface FilterState {
  sectors: string[]
  regions: string[]
  valueRange: ValueRange
  deadline: DeadlineRange
  buyerTypes: string[]
  smeOnly: boolean
  highwaysOnly: boolean
  frameworksOnly: boolean
  socialValue: SocialValue
}

const DEFAULT_FILTERS: FilterState = {
  sectors: [],
  regions: [],
  valueRange: "any",
  deadline: "any",
  buyerTypes: [],
  smeOnly: false,
  highwaysOnly: false,
  frameworksOnly: false,
  socialValue: "any",
}

function SidebarFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState
  onChange: (f: Partial<FilterState>) => void
  onClear: () => void
}) {
  const [showAllRegions, setShowAllRegions] = useState(false)
  const regionsToShow = showAllRegions ? UK_REGIONS : UK_REGIONS.slice(0, 6)

  function toggleList(key: "sectors" | "regions" | "buyerTypes", val: string) {
    const current = filters[key] as string[]
    onChange({
      [key]: current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val],
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onClear}
          className="text-xs text-navy-600 underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Sectors */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Sectors
        </p>
        <div className="flex flex-col gap-2">
          {CONTRACT_CATEGORIES.map((cat) => (
            <div key={cat.value} className="flex items-center gap-2">
              <Checkbox
                id={`sector-${cat.value}`}
                checked={filters.sectors.includes(cat.value)}
                onCheckedChange={() => toggleList("sectors", cat.value)}
              />
              <Label
                htmlFor={`sector-${cat.value}`}
                className="cursor-pointer text-sm text-gray-700"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Regions */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Regions
        </p>
        <div className="flex flex-col gap-2">
          {regionsToShow.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <Checkbox
                id={`region-${region}`}
                checked={filters.regions.includes(region)}
                onCheckedChange={() => toggleList("regions", region)}
              />
              <Label
                htmlFor={`region-${region}`}
                className="cursor-pointer text-sm text-gray-700"
              >
                {region}
              </Label>
            </div>
          ))}
        </div>
        {!showAllRegions && UK_REGIONS.length > 6 && (
          <button
            className="mt-2 text-xs text-navy-600 underline-offset-2 hover:underline"
            onClick={() => setShowAllRegions(true)}
          >
            Show {UK_REGIONS.length - 6} more…
          </button>
        )}
      </div>

      <Separator />

      {/* Contract Value */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Contract Value
        </p>
        <div className="flex flex-col gap-2">
          {VALUE_RANGES.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="valueRange"
                value={r.value}
                checked={filters.valueRange === r.value}
                onChange={() => onChange({ valueRange: r.value })}
                className="accent-navy-700"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Deadline */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Deadline
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              { label: "Any time", value: "any" },
              { label: "Next 30 days", value: "30" },
              { label: "Next 60 days", value: "60" },
              { label: "Next 90 days", value: "90" },
            ] as { label: string; value: DeadlineRange }[]
          ).map((d) => (
            <label
              key={d.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="deadline"
                value={d.value}
                checked={filters.deadline === d.value}
                onChange={() => onChange({ deadline: d.value })}
                className="accent-navy-700"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Buyer Type */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Buyer Type
        </p>
        <div className="flex flex-col gap-2">
          {BUYER_TYPES.map((bt) => (
            <div key={bt} className="flex items-center gap-2">
              <Checkbox
                id={`bt-${bt}`}
                checked={filters.buyerTypes.includes(bt)}
                onCheckedChange={() => toggleList("buyerTypes", bt)}
              />
              <Label htmlFor={`bt-${bt}`} className="cursor-pointer text-sm text-gray-700">
                {bt}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Special filters */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Special Filters
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sme-only"
              checked={filters.smeOnly}
              onCheckedChange={(v) => onChange({ smeOnly: !!v })}
            />
            <Label htmlFor="sme-only" className="cursor-pointer text-sm text-gray-700">
              SME Friendly only
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="highways-only"
              checked={filters.highwaysOnly}
              onCheckedChange={(v) => onChange({ highwaysOnly: !!v })}
            />
            <Label htmlFor="highways-only" className="cursor-pointer text-sm text-gray-700">
              Highways / Infrastructure
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="frameworks-only"
              checked={filters.frameworksOnly}
              onCheckedChange={(v) => onChange({ frameworksOnly: !!v })}
            />
            <Label htmlFor="frameworks-only" className="cursor-pointer text-sm text-gray-700">
              Framework contracts
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Social value weighting */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Social Value Weighting
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              { label: "Any", value: "any" },
              { label: "10%+", value: "10" },
              { label: "15%+", value: "15" },
              { label: "20%+", value: "20" },
            ] as { label: string; value: SocialValue }[]
          ).map((sv) => (
            <label
              key={sv.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="socialValue"
                value={sv.value}
                checked={filters.socialValue === sv.value}
                onChange={() => onChange({ socialValue: sv.value })}
                className="accent-navy-700"
              />
              {sv.label}
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-2 w-full" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}

// ─── Active filter chips ───────────────────────────────────────────────────────

function ActiveFilterChips({
  filters,
  searchQuery,
  onRemoveSearch,
  onChange,
}: {
  filters: FilterState
  searchQuery: string
  onRemoveSearch: () => void
  onChange: (f: Partial<FilterState>) => void
}) {
  const chips: { label: string; onRemove: () => void }[] = []

  if (searchQuery)
    chips.push({ label: `"${searchQuery}"`, onRemove: onRemoveSearch })

  filters.sectors.forEach((s) =>
    chips.push({
      label: categoryLabel(s),
      onRemove: () => onChange({ sectors: filters.sectors.filter((x) => x !== s) }),
    })
  )
  filters.regions.forEach((r) =>
    chips.push({
      label: r,
      onRemove: () => onChange({ regions: filters.regions.filter((x) => x !== r) }),
    })
  )
  if (filters.valueRange !== "any") {
    const vr = VALUE_RANGES.find((v) => v.value === filters.valueRange)
    if (vr) chips.push({ label: vr.label, onRemove: () => onChange({ valueRange: "any" }) })
  }
  if (filters.deadline !== "any")
    chips.push({
      label: `Next ${filters.deadline} days`,
      onRemove: () => onChange({ deadline: "any" }),
    })
  filters.buyerTypes.forEach((bt) =>
    chips.push({
      label: bt,
      onRemove: () =>
        onChange({ buyerTypes: filters.buyerTypes.filter((x) => x !== bt) }),
    })
  )
  if (filters.smeOnly)
    chips.push({ label: "SME Friendly", onRemove: () => onChange({ smeOnly: false }) })
  if (filters.highwaysOnly)
    chips.push({ label: "Highways", onRemove: () => onChange({ highwaysOnly: false }) })
  if (filters.frameworksOnly)
    chips.push({ label: "Frameworks", onRemove: () => onChange({ frameworksOnly: false }) })
  if (filters.socialValue !== "any")
    chips.push({
      label: `SV ${filters.socialValue}%+`,
      onRemove: () => onChange({ socialValue: "any" }),
    })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full hover:bg-navy-100"
            aria-label="Remove filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-gray-900">
        No tenders match your filters
      </h3>
      <p className="mb-4 max-w-xs text-sm text-gray-500">
        Try adjusting your search terms or removing some filters to see more opportunities.
      </p>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TenderDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set())

  function patchFilters(patch: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery("")
  }

  function handleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleReject(id: string) {
    setRejectedIds((prev) => new Set(prev).add(id))
  }

  // Core filtered set (tab logic applied separately below)
  const baseFiltered = useMemo(() => {
    return DEMO_TENDERS.filter((t) => {
      if (rejectedIds.has(t.id)) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const hit =
          t.title.toLowerCase().includes(q) ||
          t.buyer.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
        if (!hit) return false
      }

      if (filters.sectors.length > 0 && !filters.sectors.includes(t.category)) return false

      if (filters.regions.length > 0 && !filters.regions.includes(t.region)) return false

      if (!valueInRange(t, filters.valueRange)) return false

      if (filters.deadline !== "any") {
        const days = daysUntil(t.deadline)
        if (days > parseInt(filters.deadline, 10)) return false
      }

      if (filters.buyerTypes.length > 0) {
        const normalized = (t.buyerType ?? "").toLowerCase().replace(/-/g, " ")
        const match = filters.buyerTypes.some((bt) =>
          normalized.includes(bt.toLowerCase())
        )
        if (!match) return false
      }

      if (filters.smeOnly && !t.smeFlag) return false
      if (filters.highwaysOnly && t.category !== "highways") return false
      if (filters.frameworksOnly && t.type !== "framework") return false

      if (filters.socialValue !== "any") {
        const minSV = parseInt(filters.socialValue, 10)
        if (!t.socialValueWeighting || t.socialValueWeighting < minSV) return false
      }

      return true
    })
  }, [searchQuery, filters, rejectedIds])

  const tabSets = useMemo(
    () => ({
      all: baseFiltered,
      recommended: baseFiltered.filter((t) => t.recommendation === "recommended"),
      highways: baseFiltered.filter((t) => t.category === "highways"),
      frameworks: baseFiltered.filter((t) => t.type === "framework"),
      closing: baseFiltered.filter((t) => daysUntil(t.deadline) <= 30),
    }),
    [baseFiltered]
  )

  const currentTenders =
    activeTab === "recommended"
      ? tabSets.recommended
      : activeTab === "highways"
      ? tabSets.highways
      : activeTab === "frameworks"
      ? tabSets.frameworks
      : activeTab === "closing"
      ? tabSets.closing
      : tabSets.all

  const hasActiveFilters =
    !!searchQuery ||
    filters.sectors.length > 0 ||
    filters.regions.length > 0 ||
    filters.valueRange !== "any" ||
    filters.deadline !== "any" ||
    filters.buyerTypes.length > 0 ||
    filters.smeOnly ||
    filters.highwaysOnly ||
    filters.frameworksOnly ||
    filters.socialValue !== "any"

  // suppress unused warning — savedIds tracked for future "Saved" tab
  void savedIds

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Find Tenders</h1>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">DEMO</Badge>
              </div>
              <p className="text-sm text-gray-500">
                Discover matched government, local authority, NHS, highways and framework
                opportunities
              </p>
              <p className="mt-1 text-xs font-medium text-navy-700">
                {tabSets.all.length} opportunities matched for{" "}
                <span className="font-semibold">Greenfield Infrastructure Ltd</span>
              </p>
            </div>
          </div>

          {/* Search + quick filter chips */}
          <div className="mt-5 space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search contracts, buyers, keywords..."
                className="h-10 pl-9 pr-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick filter chips row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category select */}
              <Select
                value={filters.sectors[0] ?? "all"}
                onValueChange={(v) =>
                  patchFilters({ sectors: v === "all" ? [] : [v] })
                }
              >
                <SelectTrigger className="h-8 w-auto gap-1 border-gray-300 text-xs">
                  <Filter className="h-3 w-3" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CONTRACT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Region select */}
              <Select
                value={filters.regions[0] ?? "all"}
                onValueChange={(v) =>
                  patchFilters({ regions: v === "all" ? [] : [v] })
                }
              >
                <SelectTrigger className="h-8 w-auto gap-1 border-gray-300 text-xs">
                  <MapPin className="h-3 w-3" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {UK_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value select */}
              <Select
                value={filters.valueRange}
                onValueChange={(v) => patchFilters({ valueRange: v as ValueRange })}
              >
                <SelectTrigger className="h-8 w-auto gap-1 border-gray-300 text-xs">
                  <PoundSterling className="h-3 w-3" />
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent>
                  {VALUE_RANGES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Deadline select */}
              <Select
                value={filters.deadline}
                onValueChange={(v) => patchFilters({ deadline: v as DeadlineRange })}
              >
                <SelectTrigger className="h-8 w-auto gap-1 border-gray-300 text-xs">
                  <Calendar className="h-3 w-3" />
                  <SelectValue placeholder="Deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any deadline</SelectItem>
                  <SelectItem value="30">Next 30 days</SelectItem>
                  <SelectItem value="60">Next 60 days</SelectItem>
                  <SelectItem value="90">Next 90 days</SelectItem>
                </SelectContent>
              </Select>

              {/* SME toggle chip */}
              <button
                onClick={() => patchFilters({ smeOnly: !filters.smeOnly })}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
                  filters.smeOnly
                    ? "border-govgreen-500 bg-govgreen-50 text-govgreen-700"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <CheckCircle2 className="h-3 w-3" />
                SME Friendly
              </button>

              {/* Highways toggle chip */}
              <button
                onClick={() => patchFilters({ highwaysOnly: !filters.highwaysOnly })}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
                  filters.highwaysOnly
                    ? "border-navy-600 bg-navy-50 text-navy-700"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                Highways
              </button>

              {/* All types placeholder */}
              <Select>
                <SelectTrigger className="h-8 w-auto gap-1 border-gray-300 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="framework">Framework</SelectItem>
                  <SelectItem value="dynamic-purchasing">DPS</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced filters — mobile trigger */}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto flex h-8 items-center gap-1.5 text-xs lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Advanced Filters
                {hasActiveFilters && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy-700 text-[10px] text-white">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Active filter chips (dismissible) */}
            <ActiveFilterChips
              filters={filters}
              searchQuery={searchQuery}
              onRemoveSearch={() => setSearchQuery("")}
              onChange={patchFilters}
            />
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + main ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-6 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <SidebarFilters
                filters={filters}
                onChange={patchFilters}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Mobile Sheet */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Advanced Filters</SheetTitle>
              </SheetHeader>
              <SidebarFilters
                filters={filters}
                onChange={patchFilters}
                onClear={clearFilters}
              />
            </SheetContent>
          </Sheet>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Tab bar */}
              <div className="mb-4 overflow-x-auto">
                <TabsList className="inline-flex h-9 w-max min-w-full justify-start gap-1 rounded-lg bg-gray-100 p-1">
                  <TabsTrigger value="all" className="h-7 whitespace-nowrap text-xs">
                    All ({tabSets.all.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommended"
                    className="h-7 whitespace-nowrap text-xs"
                  >
                    Recommended ({tabSets.recommended.length})
                  </TabsTrigger>
                  <TabsTrigger value="highways" className="h-7 whitespace-nowrap text-xs">
                    Highways ({tabSets.highways.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="frameworks"
                    className="h-7 whitespace-nowrap text-xs"
                  >
                    Frameworks ({tabSets.frameworks.length})
                  </TabsTrigger>
                  <TabsTrigger value="closing" className="h-7 whitespace-nowrap text-xs">
                    Closing Soon ({tabSets.closing.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* All tab panels share the same filtered list (currentTenders) */}
              {(["all", "recommended", "highways", "frameworks", "closing"] as const).map(
                (tab) => (
                  <TabsContent
                    key={tab}
                    value={tab}
                    className="mt-0 focus-visible:outline-none"
                  >
                    {currentTenders.length === 0 ? (
                      <EmptyState onClear={clearFilters} />
                    ) : (
                      <div className="flex flex-col gap-4">
                        {currentTenders.map((tender) => (
                          <TenderCard
                            key={tender.id}
                            tender={tender}
                            onSave={handleSave}
                            onReject={handleReject}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
