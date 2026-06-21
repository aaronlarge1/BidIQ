import { useState } from "react"
import {
  Building2, PoundSterling, Calendar, TrendingUp, Search,
  MapPin, Users, ChevronRight, ExternalLink,
  Bell, Plus, Star, Trophy, AlertCircle,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useBuyers, useCompany } from "@/hooks/useApi"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Buyer } from "@/types"

// ─── Buyer type badge config ──────────────────────────────────────────────────

const buyerTypeMeta: Record<string, { label: string; className: string }> = {
  "highways":         { label: "National Highways", className: "bg-[#1e3055] text-white" },
  "local-authority":  { label: "Local Authority",   className: "bg-blue-100 text-blue-800" },
  "nhs":              { label: "NHS",                className: "bg-teal-100 text-teal-800" },
  "housing":          { label: "Housing",            className: "bg-purple-100 text-purple-800" },
  "education":        { label: "Education",          className: "bg-amber-100 text-amber-800" },
  "central-government": { label: "Central Govt",    className: "bg-red-100 text-red-800" },
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: "all",              label: "All" },
  { key: "highways",         label: "National Highways" },
  { key: "local-authority",  label: "Local Authority" },
  { key: "nhs",              label: "NHS" },
  { key: "housing",          label: "Housing" },
  { key: "education",        label: "Education" },
] as const

// ─── Spend chart data for selected buyer ─────────────────────────────────────

const NH_SPEND_DATA = [
  { year: "2022", spend: 2.1 },
  { year: "2023", spend: 2.4 },
  { year: "2024", spend: 2.6 },
  { year: "2025", spend: 2.8 },
  { year: "2026*", spend: 3.1 },
]

// ─── Upcoming opportunities for NH ───────────────────────────────────────────

const NH_UPCOMING = [
  {
    id: "u-001",
    title: "Regional Highways Maintenance Framework",
    description: "Multi-supplier framework covering planned and reactive maintenance across North of England. SME lots available.",
    expected: "Q3 2026",
    expectedDate: "September 2026",
    status: "expected" as const,
    value: "£50m – £120m (framework)",
    sme: true,
  },
  {
    id: "u-002",
    title: "North West Drainage Framework 2027",
    description: "Drainage inspection, cleansing and repair works. Previous incumbent: consortium including Greenfield.",
    expected: "Q1 2027",
    expectedDate: "February 2027",
    status: "expected" as const,
    value: "£8m – £15m",
    sme: true,
  },
  {
    id: "u-003",
    title: "A57 Corridor Works — Renewal",
    description: "Direct renewal of your current 2024 contract. Renewal window opens July 2027.",
    expected: "Q2 2027",
    expectedDate: "July 2027",
    status: "renewal" as const,
    value: "~£850k",
    sme: false,
  },
]

// ─── Relationship score bar ───────────────────────────────────────────────────

function RelationshipBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 45 ? "bg-amber-400" : "bg-red-400"
  const label =
    score >= 70 ? "Strong" : score >= 45 ? "Developing" : "New"
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full bg-gray-100 h-3">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-800 w-8 text-right">{score}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        score >= 70
          ? "bg-green-100 text-green-700"
          : score >= 45
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700"
      }`}>{label}</span>
    </div>
  )
}

// ─── Buyer Card ───────────────────────────────────────────────────────────────

function BuyerCard({
  buyer,
  selected,
  onClick,
  companyName,
}: {
  buyer: Buyer
  selected: boolean
  onClick: () => void
  companyName: string
}) {
  const typeMeta = buyerTypeMeta[buyer.type] ?? { label: buyer.type, className: "bg-gray-100 text-gray-700" }
  const previousOwnAwards = companyName
    ? buyer.previousAwards.filter((a) => a.supplier === companyName)
    : []
  const avgValue =
    buyer.previousAwards.length > 0
      ? buyer.previousAwards.reduce((sum, a) => sum + a.value, 0) / buyer.previousAwards.length
      : 0

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        selected
          ? "border-[#1e3055] shadow-md ring-2 ring-[#1e3055]/10"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeMeta.className}`}>
              {typeMeta.label}
            </span>
            {previousOwnAwards.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                <Trophy className="h-3 w-3" /> Known to us
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">{buyer.name}</h3>
        </div>
        <ChevronRight className={`h-5 w-5 shrink-0 mt-1 transition-colors ${
          selected ? "text-[#1e3055]" : "text-gray-300"
        }`} />
      </div>

      {/* Region + spend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {buyer.region}
        </span>
        <span className="flex items-center gap-1">
          <PoundSterling className="h-3 w-3" /> Annual spend:{" "}
          <span className="font-semibold text-gray-700 ml-0.5">{formatCurrency(buyer.annualSpend)}</span>
        </span>
      </div>

      {previousOwnAwards.length > 0 && (
        <p className="text-xs text-green-700 font-medium mb-3">
          Known to us: {previousOwnAwards.length} previous award{previousOwnAwards.length > 1 ? "s" : ""}
        </p>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-[#1e3055]">{buyer.previousAwards.length}</div>
          <div className="text-xs text-gray-400 leading-tight">Previous awards</div>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="text-lg font-bold text-[#1e3055]">{buyer.upcomingRenewals.length}</div>
          <div className="text-xs text-gray-400 leading-tight">Upcoming renewals</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#1e3055]">
            {avgValue > 0 ? formatCurrency(avgValue) : "—"}
          </div>
          <div className="text-xs text-gray-400 leading-tight">Avg contract value</div>
        </div>
      </div>
    </button>
  )
}

// ─── Buyer Detail Panel ───────────────────────────────────────────────────────

function BuyerDetailPanel({ buyer, companyName }: { buyer: Buyer; companyName: string }) {
  const typeMeta = buyerTypeMeta[buyer.type] ?? { label: buyer.type, className: "bg-gray-100 text-gray-700" }
  const isNH = buyer.id === "by-001"

  return (
    <Card className="bg-white shadow-sm">
      {/* Profile header */}
      <CardHeader className="pb-0 border-b border-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1e3055]/10">
              <Building2 className="h-7 w-7 text-[#1e3055]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeMeta.className}`}>
                  {typeMeta.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{buyer.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {buyer.region}
                <span className="mx-2 text-gray-300">·</span>
                <PoundSterling className="h-3 w-3" /> Annual spend: <strong className="text-gray-700 ml-0.5">{formatCurrency(buyer.annualSpend)}</strong>
              </p>
            </div>
          </div>

          {/* Relationship score */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 min-w-[220px]">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Your relationship score</p>
            <RelationshipBar score={isNH ? 78 : 85} />
            <p className="text-xs text-gray-400 mt-2">
              {isNH
                ? "Based on 1 prior contract award and known supplier status"
                : "Current contract holder — strong relationship"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="awards" className="mt-5">
          <TabsList className="mb-5 bg-gray-100">
            <TabsTrigger value="awards">Previous Awards</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Opportunities</TabsTrigger>
            <TabsTrigger value="contacts">Buyer Contacts</TabsTrigger>
            <TabsTrigger value="position">Market Position</TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Previous Awards ── */}
          <TabsContent value="awards">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Award History</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {buyer.previousAwards.length} contracts awarded by this buyer on record
                </p>
              </div>
              <Badge variant="outline" className="text-xs gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" /> Your wins highlighted
              </Badge>
            </div>

            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-600">Contract Title</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600">Supplier</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 text-right">Value</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600">Awarded</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600">Renewal Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyer.previousAwards.map((award, i) => {
                    const isOurs = companyName ? award.supplier === companyName : false
                    return (
                      <TableRow
                        key={i}
                        className={isOurs ? "bg-green-50 border-l-4 border-l-green-500" : ""}
                      >
                        <TableCell className={`font-medium text-sm ${isOurs ? "text-green-800" : "text-gray-900"}`}>
                          {isOurs ? (
                            <span className="flex items-center gap-2">
                              <Trophy className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              {award.title}
                              <span className="text-xs font-bold text-green-700">— YOU</span>
                            </span>
                          ) : award.title}
                        </TableCell>
                        <TableCell className={`text-sm ${isOurs ? "text-green-700 font-semibold" : "text-gray-600"}`}>
                          {award.supplier}
                        </TableCell>
                        <TableCell className={`text-sm text-right font-semibold ${isOurs ? "text-green-700" : "text-gray-900"}`}>
                          {formatCurrency(award.value)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{formatDate(award.awardedDate)}</TableCell>
                        <TableCell className="text-sm text-gray-500">{formatDate(award.renewalDate)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Spend chart */}
            {isNH && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  National Highways Annual Spend — Historical Trend
                </h4>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={NH_SPEND_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `£${v}bn`}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <RechartsTooltip
                      formatter={(v: number) => [`£${v}bn`, "Annual Spend"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Bar dataKey="spend" fill="#1e3055" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-1">* 2026 estimated. Source: National Highways annual report / DEMO data.</p>
              </div>
            )}
          </TabsContent>

          {/* ── TAB 2: Upcoming Opportunities ── */}
          <TabsContent value="upcoming">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Upcoming Opportunities &amp; Renewals</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Expected tenders and known renewals from {buyer.name}
              </p>
            </div>

            <div className="space-y-4">
              {(isNH ? NH_UPCOMING : [
                {
                  id: "u-stk-001",
                  title: "Winter Maintenance Contract 2026–29",
                  description: "Renewal of your current gritting and snow clearance contract. You are the incumbent supplier — high probability of renewal.",
                  expected: "July 2026",
                  expectedDate: "25 July 2026",
                  status: "renewal" as const,
                  value: "~£340k",
                  sme: true,
                },
                {
                  id: "u-stk-002",
                  title: "Highway Reactive Maintenance 2027",
                  description: "Planned tender for reactive carriageway and footway maintenance across the Stockport network.",
                  expected: "Q1 2027",
                  expectedDate: "March 2027",
                  status: "expected" as const,
                  value: "£200k – £600k",
                  sme: true,
                },
              ]).map((opp) => (
                <div
                  key={opp.id}
                  className={`rounded-xl border p-5 ${
                    opp.status === "renewal"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-100 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          opp.status === "renewal"
                            ? "bg-green-600 text-white"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {opp.status === "renewal" ? "Renewal Opportunity" : "Expected Tender"}
                        </span>
                        {opp.sme && (
                          <span className="inline-flex items-center rounded-full bg-[#1e3055]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1e3055]">
                            SME Lot
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{opp.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opp.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Expected: <strong className="text-gray-700 ml-0.5">{opp.expectedDate}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <PoundSterling className="h-3 w-3" /> Est. value: <strong className="text-gray-700 ml-0.5">{opp.value}</strong>
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs shrink-0 border-[#1e3055]/30 text-[#1e3055] hover:bg-[#1e3055] hover:text-white"
                    >
                      <Bell className="h-3.5 w-3.5" /> Set Alert
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">
                BidIQ monitors Find a Tender and buyer portals and will alert you the moment this opportunity goes live.
              </p>
            </div>
          </TabsContent>

          {/* ── TAB 3: Buyer Contacts ── */}
          <TabsContent value="contacts">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Buyer Contacts</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Relationship contacts at {buyer.name}
                </p>
              </div>
              <Button size="sm" className="gap-1.5 bg-[#1e3055] text-white hover:bg-[#162540] text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Contact
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                No contacts added yet. Use the Add Contact button to record buyer contacts after meet-the-buyer events.
              </p>
              {([] as { id: string; name: string; role: string; org: string; source: string; email: string }[]).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3055]/10 text-[#1e3055] font-bold text-sm">
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900">{contact.name}</p>
                    </div>
                    <p className="text-xs text-gray-600">{contact.role}</p>
                    <p className="text-xs text-gray-400">{contact.org}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Via: {contact.source}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                      <ExternalLink className="h-3 w-3" /> Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Build your buyer relationships</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Meet-the-buyer events are your best route to adding real contacts. Check your calendar for upcoming events and add contacts after each one.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 4: Market Position ── */}
          <TabsContent value="position">
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">Your Position with {buyer.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                AI-assessed competitive standing based on your profile and known market data
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              {/* Relationship strength */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-800">Relationship Strength</span>
                </div>
                <RelationshipBar score={isNH ? 78 : 85} />
                <p className="text-xs text-gray-500 mt-3">
                  {isNH
                    ? "You hold a prior contract with this buyer. You are on their known supplier list. Strong starting position."
                    : "You are the current contract holder. Renewal probability is high given your KPI performance."}
                </p>
              </div>

              {/* Known competitors */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-[#1e3055]" />
                  <span className="text-sm font-semibold text-gray-800">Known Competitors</span>
                </div>
                <div className="space-y-2">
                  {buyer.knownSuppliers
                    .filter((s) => !companyName || s !== companyName)
                    .map((competitor) => (
                      <div key={competitor} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-medium">{competitor}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          ["Balfour Beatty", "Amey", "Kier"].includes(competitor)
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {["Balfour Beatty", "Amey", "Kier"].includes(competitor) ? "Major tier 1" : "Competitor"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Your differentiator */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Your Differentiator</span>
              </div>
              <p className="text-sm text-green-800 font-medium mb-3">
                {isNH
                  ? "Local SME, strong safety record, competitive on price, proven delivery with this buyer"
                  : "Incumbent with excellent KPI track record, local workforce, competitive price point"}
              </p>
              <Separator className="bg-green-200 mb-3" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "ISO Accreditations", value: "3", sub: "9001, 14001, 45001" },
                  { label: "Safety Record", value: "A+", sub: "No RIDDOR incidents" },
                  { label: "Local Workforce", value: "94%", sub: "North of England" },
                  { label: "SME Certified", value: "Yes", sub: "Constructionline Gold" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-green-700">{stat.value}</div>
                    <div className="text-xs font-medium text-green-800">{stat.label}</div>
                    <div className="text-xs text-green-600">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BuyerIntelligence() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)

  const { data: buyersData, isLoading: buyersLoading } = useBuyers()
  const { data: companyData } = useCompany()
  const companyName = companyData?.name ?? ""

  const buyers = buyersData ?? []

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      search === "" ||
      buyer.name.toLowerCase().includes(search.toLowerCase()) ||
      buyer.type.toLowerCase().includes(search.toLowerCase()) ||
      buyer.region.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === "all" || buyer.type === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ─── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#1e3055] px-6 py-7 text-white shadow-lg sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2a4a7f]/40 via-transparent to-transparent" />
            <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">Buyer Intelligence</h1>
                  <p className="mt-0.5 text-sm text-blue-200">
                    Know your buyers before you bid. Track history, preferences and upcoming renewals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Search + Filter ──────────────────────────────────────────── */}
        <div className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buyers by name, type, region..."
              className="pl-9 bg-white border-gray-200 h-10"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-[#1e3055] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e3055]/40 hover:text-[#1e3055]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            {buyersLoading
              ? "Loading buyers…"
              : buyers.length === 0
              ? "No buyers yet"
              : `Showing ${filteredBuyers.length} buyer${filteredBuyers.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* ─── Main content grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Buyer cards — left 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {buyersLoading ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <p className="text-sm text-gray-400">Loading buyers…</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <Building2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No buyer intelligence yet — buyers will appear here as you track opportunities</p>
              </div>
            ) : filteredBuyers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <Building2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No buyers match your search.</p>
              </div>
            ) : (
              filteredBuyers.map((buyer) => (
                <BuyerCard
                  key={buyer.id}
                  buyer={buyer}
                  selected={selectedBuyer?.id === buyer.id}
                  onClick={() => setSelectedBuyer(buyer)}
                  companyName={companyName}
                />
              ))
            )}
          </div>

          {/* Buyer detail — right 3 cols */}
          <div className="lg:col-span-3">
            {selectedBuyer ? (
              <BuyerDetailPanel buyer={selectedBuyer} companyName={companyName} />
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <Building2 className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select a buyer to view their full intelligence profile</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-400">
          BidIQ indexes Find a Tender, Contracts Finder and buyer portals to keep your intelligence up to date.
        </p>
      </div>
    </div>
  )
}
