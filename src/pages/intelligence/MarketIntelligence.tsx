import { TrendingUp, Award, PoundSterling, BarChart3, Search, Globe, ChevronRight, ExternalLink, Bell, Trophy, MapPin, Zap, AlertCircle } from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

// ─── Market Overview Stats ────────────────────────────────────────────────────

const MARKET_STATS = [
  {
    label: "Total Highways Spend UK 2025–26",
    value: "£8.4bn",
    icon: <PoundSterling className="h-5 w-5 text-[#1e3055]" />,
    badge: "Verified",
    badgeClass: "bg-green-100 text-green-700",
    accent: "border-l-[#1e3055]",
  },
  {
    label: "Open SME Frameworks",
    value: "14",
    icon: <Award className="h-5 w-5 text-govgreen-600" />,
    badge: "Active now",
    badgeClass: "bg-green-100 text-green-700",
    accent: "border-l-green-500",
  },
  {
    label: "Contracts Closing This Month",
    value: "47",
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    badge: "June 2026",
    badgeClass: "bg-amber-100 text-amber-700",
    accent: "border-l-amber-400",
  },
  {
    label: "New Frameworks Opening Q3",
    value: "6",
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    badge: "Coming soon",
    badgeClass: "bg-blue-100 text-blue-700",
    accent: "border-l-blue-400",
  },
]

// ─── Competitor wins data ─────────────────────────────────────────────────────

const COMPETITOR_WINS = [
  {
    id: "cw-001",
    contract: "A1(M) Maintenance Bundle",
    buyer: "National Highways",
    winner: "Amey",
    value: 12_500_000,
    awardDate: "Apr 2026",
    category: "Highways",
    isOurs: false,
  },
  {
    id: "cw-002",
    contract: "Greater Manchester Highway Repairs",
    buyer: "TfGM",
    winner: "Kier",
    value: 4_200_000,
    awardDate: "Mar 2026",
    category: "Highways",
    isOurs: false,
  },
  {
    id: "cw-003",
    contract: "Leeds Street Lighting",
    buyer: "Leeds City Council",
    winner: "Amey",
    value: 8_100_000,
    awardDate: "Feb 2026",
    category: "Maintenance",
    isOurs: false,
  },
  {
    id: "cw-004",
    contract: "Manchester City Centre Cleaning",
    buyer: "Manchester CC",
    winner: "OCS Group",
    value: 2_300_000,
    awardDate: "Jan 2026",
    category: "Cleaning",
    isOurs: false,
  },
  {
    id: "cw-005",
    contract: "Stockport Winter Gritting 2023–26",
    buyer: "Stockport MBC",
    winner: "Greenfield Infrastructure Ltd",
    value: 340_000,
    awardDate: "Aug 2023",
    category: "Highways",
    isOurs: true,
  },
]

// ─── Framework openings ───────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    id: "fw-001",
    name: "Crown Commercial Service — FM Framework RM6232",
    description: "Multi-supplier framework covering facilities management, cleaning, and maintenance services across all UK public sector bodies. Major opportunity — SME lots available with low entry threshold.",
    value: "£5bn",
    status: "open" as const,
    statusLabel: "Open Now",
    deadline: "Closes 31 July 2026",
    sectors: ["Facilities Management", "Cleaning", "Maintenance", "Security"],
    highlight: true,
    cta: "Register Interest",
    link: "https://www.crowncommercial.gov.uk",
  },
  {
    id: "fw-002",
    name: "Highways England SME Works Framework",
    description: "Dedicated SME-only works framework for sub-£2m highway improvement and maintenance contracts across England. Your ideal framework route to National Highways work.",
    value: "£200m",
    status: "upcoming" as const,
    statusLabel: "Expected Q4 2026",
    deadline: "Watch — Expression of Interest expected Oct 2026",
    sectors: ["Highways", "Maintenance", "Drainage", "Line Marking"],
    highlight: false,
    cta: "Set Alert",
    link: "https://www.nationalhighways.co.uk",
  },
  {
    id: "fw-003",
    name: "NHS Shared Business Services — Cleaning & FM",
    description: "National framework for cleaning and FM services across NHS estates. Renewing 2027. Current framework closes March 2027.",
    value: "£1.8bn",
    status: "renewing" as const,
    statusLabel: "Renewing 2027",
    deadline: "Watch — New framework expected Jan 2027",
    sectors: ["Cleaning", "Facilities Management", "Estates"],
    highlight: false,
    cta: "Set Alert",
    link: "https://www.sbs.nhs.uk",
  },
  {
    id: "fw-004",
    name: "LGA Local Highways Maintenance Framework",
    description: "New framework developed by the Local Government Association for local authority highway maintenance. Expression of interest phase opens January 2027.",
    value: "£400m",
    status: "upcoming" as const,
    statusLabel: "EoI Jan 2027",
    deadline: "Expression of Interest: January 2027",
    sectors: ["Highways", "Maintenance", "Winter Services"],
    highlight: false,
    cta: "Set Alert",
    link: "https://www.local.gov.uk",
  },
]

// ─── Sector spending chart data ───────────────────────────────────────────────

const SECTOR_SPEND_DATA = [
  { sector: "Highways", spend: 8.4 },
  { sector: "Construction", spend: 12.1 },
  { sector: "FM", spend: 6.8 },
  { sector: "Cleaning", spend: 2.1 },
  { sector: "IT", spend: 15.2 },
  { sector: "Social Care", spend: 22.0 },
  { sector: "NHS", spend: 19.0 },
  { sector: "Education", spend: 9.0 },
]

// ─── Highways spend trend ─────────────────────────────────────────────────────

const HIGHWAYS_TREND = [
  { year: "2022", spend: 6.8 },
  { year: "2023", spend: 7.1 },
  { year: "2024", spend: 7.6 },
  { year: "2025", spend: 8.0 },
  { year: "2026", spend: 8.4 },
]

// ─── Pie chart for sector share ───────────────────────────────────────────────

const SECTOR_PIE = [
  { name: "Highways & Transport", value: 8.4 },
  { name: "Construction", value: 12.1 },
  { name: "FM & Cleaning", value: 8.9 },
  { name: "IT & Digital", value: 15.2 },
  { name: "Health & Social", value: 41.0 },
  { name: "Education", value: 9.0 },
]

const PIE_COLORS = ["#1e3055", "#2d6a4f", "#3a86ff", "#ff9f43", "#ee5a24", "#8e44ad"]

// ─── NH SME recent awards ─────────────────────────────────────────────────────

const NH_SME_AWARDS = [
  {
    title: "A628 Woodhead Pass Drainage Works",
    winner: "Peak Civil Engineering Ltd",
    value: 480_000,
    region: "Yorkshire & Humber",
    date: "Mar 2026",
  },
  {
    title: "M62 J22 Junction Resurfacing",
    winner: "Morrisons (Construction) Ltd",
    value: 760_000,
    region: "North West",
    date: "Jan 2026",
  },
  {
    title: "Stockport Winter Gritting 2023–26",
    winner: "Greenfield Infrastructure Ltd",
    value: 340_000,
    region: "North West",
    date: "Aug 2023",
    isOurs: true,
  },
  {
    title: "A57 Snake Pass Emergency Reinstatement",
    winner: "Northern Civils Ltd",
    value: 290_000,
    region: "Yorkshire & Humber",
    date: "Nov 2025",
  },
]

// ─── Framework status badge ───────────────────────────────────────────────────

function FrameworkStatusBadge({ status, label }: { status: string; label: string }) {
  const cls =
    status === "open"
      ? "bg-green-600 text-white"
      : status === "renewing"
      ? "bg-amber-500 text-white"
      : "bg-blue-100 text-blue-700"
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

// ─── Category tag ─────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const cls =
    category === "Highways"
      ? "bg-[#1e3055]/10 text-[#1e3055]"
      : category === "Maintenance"
      ? "bg-blue-50 text-blue-700"
      : category === "Cleaning"
      ? "bg-teal-50 text-teal-700"
      : "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {category}
    </span>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketIntelligence() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ─── Page Header ───────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#1e3055] px-6 py-7 text-white shadow-lg sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2a4a7f]/40 via-transparent to-transparent" />
            <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">Market Intelligence</h1>
                  <p className="mt-0.5 text-sm text-blue-200">
                    Track competitor wins, framework openings, sector trends and infrastructure spending
                  </p>
                </div>
              </div>
              <Badge className="border-blue-400/40 bg-blue-400/20 text-blue-100 hover:bg-blue-400/20 mt-3 sm:mt-0 w-fit">
                DEMO MODE
              </Badge>
            </div>
          </div>
        </div>

        {/* ─── Market Overview Stats ──────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {MARKET_STATS.map((stat) => (
            <Card
              key={stat.label}
              className={`border-l-4 bg-white shadow-sm ${stat.accent}`}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="rounded-lg bg-gray-50 p-2">{stat.icon}</div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stat.badgeClass}`}>
                    {stat.badge}
                  </span>
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</div>
                <div className="mt-0.5 text-xs text-gray-500 leading-snug">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Main Tabs ─────────────────────────────────────────────────── */}
        <Tabs defaultValue="competitor-wins">
          <TabsList className="mb-6 bg-white border border-gray-200 p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="competitor-wins" className="gap-1.5 data-[state=active]:bg-[#1e3055] data-[state=active]:text-white">
              <Trophy className="h-3.5 w-3.5" /> Competitor Wins
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="gap-1.5 data-[state=active]:bg-[#1e3055] data-[state=active]:text-white">
              <Award className="h-3.5 w-3.5" /> Framework Openings
            </TabsTrigger>
            <TabsTrigger value="sector-spending" className="gap-1.5 data-[state=active]:bg-[#1e3055] data-[state=active]:text-white">
              <BarChart3 className="h-3.5 w-3.5" /> Sector Spending
            </TabsTrigger>
            <TabsTrigger value="highways" className="gap-1.5 data-[state=active]:bg-[#1e3055] data-[state=active]:text-white">
              <Globe className="h-3.5 w-3.5" /> Highways Specific
            </TabsTrigger>
          </TabsList>

          {/* ══ TAB 1: COMPETITOR WINS ══════════════════════════════════════ */}
          <TabsContent value="competitor-wins">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Recent Award Intelligence
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs text-gray-500">
                      Highways &amp; Construction — North of England — Last 36 months
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                      Your wins highlighted
                    </Badge>
                    <Badge variant="outline" className="text-xs">DEMO</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contract</th>
                        <th className="py-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer</th>
                        <th className="py-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Winner</th>
                        <th className="py-3 pr-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Value</th>
                        <th className="py-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Awarded</th>
                        <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {COMPETITOR_WINS.map((win) => (
                        <tr
                          key={win.id}
                          className={win.isOurs ? "bg-green-50 border-l-4 border-l-green-500" : "hover:bg-gray-50/50"}
                        >
                          <td className={`py-3.5 pr-4 font-medium ${win.isOurs ? "text-green-800" : "text-gray-900"}`}>
                            {win.isOurs ? (
                              <span className="flex items-center gap-2">
                                <Trophy className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                {win.contract}
                              </span>
                            ) : win.contract}
                          </td>
                          <td className={`py-3.5 pr-4 ${win.isOurs ? "text-green-700" : "text-gray-600"}`}>
                            {win.buyer}
                          </td>
                          <td className={`py-3.5 pr-4 ${win.isOurs ? "text-green-700 font-semibold" : "text-gray-700"}`}>
                            {win.isOurs ? (
                              <span className="flex items-center gap-1.5">
                                {win.winner}
                                <span className="text-xs font-bold text-green-600 bg-green-100 rounded px-1.5 py-0.5">YOU!</span>
                              </span>
                            ) : win.winner}
                          </td>
                          <td className={`py-3.5 pr-4 text-right font-semibold ${win.isOurs ? "text-green-700" : "text-gray-900"}`}>
                            {formatCurrency(win.value)}
                          </td>
                          <td className={`py-3.5 pr-4 ${win.isOurs ? "text-green-600" : "text-gray-500"}`}>
                            {win.awardDate}
                          </td>
                          <td className="py-3.5">
                            <CategoryBadge category={win.category} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <Search className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Live award intelligence in the full version</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        BidIQ Pro monitors Contracts Finder and Find a Tender daily, extracting award notices and building your competitive landscape automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 2: FRAMEWORK OPENINGS ═══════════════════════════════════ */}
          <TabsContent value="frameworks">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Current &amp; Upcoming Frameworks</h2>
                <p className="text-xs text-gray-500 mt-0.5">Frameworks relevant to your sector and profile</p>
              </div>
              <Badge variant="outline" className="text-xs">DEMO</Badge>
            </div>

            <div className="space-y-4">
              {FRAMEWORKS.map((fw) => (
                <Card
                  key={fw.id}
                  className={`bg-white shadow-sm transition-shadow hover:shadow-md ${
                    fw.highlight ? "border-2 border-green-500 ring-1 ring-green-200" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <FrameworkStatusBadge status={fw.status} label={fw.statusLabel} />
                          {fw.highlight && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              <Zap className="h-3 w-3" /> Massive opportunity
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">DEMO</Badge>
                        </div>

                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">{fw.name}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-3">{fw.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <PoundSterling className="h-3 w-3" /> Framework value: <strong className="text-gray-700 ml-0.5">{fw.value}</strong>
                          </span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="h-3 w-3" /> {fw.deadline}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {fw.sectors.map((s) => (
                            <span key={s} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          className={`gap-1.5 text-xs ${
                            fw.status === "open"
                              ? "bg-[#1e3055] text-white hover:bg-[#162540]"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                          }`}
                        >
                          {fw.status === "open" ? (
                            <><ChevronRight className="h-3.5 w-3.5" /> {fw.cta}</>
                          ) : (
                            <><Bell className="h-3.5 w-3.5" /> {fw.cta}</>
                          )}
                        </Button>
                        {fw.status === "open" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" /> Find a Tender
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ══ TAB 3: SECTOR SPENDING ══════════════════════════════════════ */}
          <TabsContent value="sector-spending">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">

              {/* Bar chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Public Sector Spend by Category 2025–26
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    UK government procurement — estimated annual spend (£bn)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={SECTOR_SPEND_DATA}
                      layout="vertical"
                      margin={{ top: 4, right: 24, left: 60, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => `£${v}bn`}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="sector"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={58}
                      />
                      <RechartsTooltip
                        formatter={(v: number) => [`£${v}bn`, "Annual Spend"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                      />
                      <Bar
                        dataKey="spend"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={20}
                        fill="#1e3055"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-400 mt-1">Source: Cabinet Office Procurement Data / DEMO figures</p>
                </CardContent>
              </Card>

              {/* Pie chart + key insight */}
              <div className="space-y-4">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900">Sector Share of Procurement</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Proportion of total UK public procurement by broad category</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={SECTOR_PIE}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          fontSize={10}
                        >
                          {SECTOR_PIE.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(v: number) => [`£${v}bn`, "Spend"]}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                          iconType="circle"
                          iconSize={8}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Key insight banner */}
                <div className="rounded-xl border border-[#1e3055]/20 bg-[#1e3055]/5 p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-[#1e3055] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#1e3055]">Infrastructure commitment</p>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        UK government committed to <strong>£24bn infrastructure investment 2025–2030</strong>, with highways and transport maintenance a priority. SMEs targeted to receive 33% of all procurement by value by 2027.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highways trend line chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Highways Spend Trend 2022–2026
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  UK public sector highways procurement — total annual spend (£bn)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={HIGHWAYS_TREND} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
                      width={52}
                      domain={[6, 9]}
                    />
                    <RechartsTooltip
                      formatter={(v: number) => [`£${v}bn`, "Highways Spend"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="spend"
                      stroke="#1e3055"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#1e3055", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-2">
                  Highways spend has grown 23.5% since 2022. Spring Budget 2026 added a further £1.2bn for maintenance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 4: HIGHWAYS SPECIFIC ════════════════════════════════════ */}
          <TabsContent value="highways">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* Left col — 2/3 */}
              <div className="space-y-5 lg:col-span-2">

                {/* SME Gateway */}
                <Card className="bg-white shadow-sm border-2 border-[#1e3055]/20">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e3055]">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900">
                          National Highways SME Gateway
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          Your route to M/A road contracts
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 mb-5 sm:grid-cols-3">
                      {[
                        { label: "Framework value", value: "£200m+" },
                        { label: "Max contract size", value: "£2m" },
                        { label: "SME threshold", value: "£36m t/o" },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-gray-50 p-3 text-center">
                          <div className="text-lg font-bold text-[#1e3055]">{stat.value}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Categories covered</h4>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {[
                        "Highway Maintenance", "Road Resurfacing", "Drainage",
                        "Line Marking", "Barrier Maintenance", "Winter Maintenance",
                        "Street Lighting", "Vegetation Management",
                      ].map((cat) => (
                        <span key={cat} className="rounded-full bg-[#1e3055]/10 px-2.5 py-0.5 text-xs text-[#1e3055] font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">How to apply</h4>
                    <ol className="space-y-1.5 text-xs text-gray-600">
                      {[
                        "Register on the National Highways Supplier Portal",
                        "Complete PQQ — ensure ISO 9001, 14001 & 45001 are current",
                        "Submit Expression of Interest when framework opens (expected Q4 2026)",
                        "Attend SME briefing day (register via portal)",
                        "Submit tender response — value/price weighted 60%, quality 40%",
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1e3055] text-white text-[10px] font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="gap-1.5 bg-[#1e3055] text-white hover:bg-[#162540] text-xs">
                        <Bell className="h-3.5 w-3.5" /> Alert me when it opens
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        <ExternalLink className="h-3.5 w-3.5" /> NH Supplier Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent SME wins */}
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        Recent National Highways SME Awards
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">DEMO</Badge>
                    </div>
                    <CardDescription className="text-xs text-gray-500">
                      Contracts under £2m awarded to SME suppliers — proof the gateway works
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {NH_SME_AWARDS.map((award, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-xl p-3 ${
                          award.isOurs ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        {award.isOurs ? (
                          <Trophy className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <Award className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-snug ${award.isOurs ? "text-green-800" : "text-gray-900"}`}>
                            {award.title}
                            {award.isOurs && <span className="ml-2 text-green-600 font-bold">(YOU!)</span>}
                          </p>
                          <p className={`text-xs mt-0.5 ${award.isOurs ? "text-green-700" : "text-gray-500"}`}>
                            {award.winner} · <MapPin className="h-3 w-3 inline" /> {award.region}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-xs font-bold ${award.isOurs ? "text-green-700" : "text-gray-700"}`}>
                            {formatCurrency(award.value)}
                          </div>
                          <div className="text-xs text-gray-400">{award.date}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right col — 1/3 */}
              <div className="space-y-4">

                {/* Spring Budget alert */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Spring Budget 2026</span>
                  </div>
                  <p className="text-xs text-green-700 leading-relaxed">
                    <strong>£1.2bn additional highway maintenance funding</strong> announced March 2026. Ringfenced for pothole and carriageway repair via local authorities and National Highways. Expect increased tendering activity Q3–Q4 2026.
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 text-xs w-full gap-1.5 border-green-300 text-green-700 hover:bg-green-100">
                    <ExternalLink className="h-3.5 w-3.5" /> Read budget detail
                  </Button>
                </div>

                {/* Regional map placeholder */}
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Regional Infrastructure Investment
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Investment heat map by region
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                      <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-500">Regional Investment Heat Map</p>
                      <p className="text-xs text-gray-400 mt-1">Coming in full version — visual map of infrastructure spend by region with your coverage areas highlighted</p>
                    </div>

                    {/* Simple regional breakdown instead */}
                    <div className="mt-4 space-y-2.5">
                      {[
                        { region: "North West", spend: "£1.8bn", rank: 2, yours: true },
                        { region: "Yorkshire & Humber", spend: "£1.4bn", rank: 3, yours: true },
                        { region: "East Midlands", spend: "£890m", rank: 5, yours: true },
                        { region: "London", spend: "£2.1bn", rank: 1, yours: false },
                        { region: "South East", spend: "£1.2bn", rank: 4, yours: false },
                      ].map((r) => (
                        <div key={r.region} className="flex items-center gap-2 text-xs">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            r.yours ? "bg-[#1e3055] text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            {r.rank}
                          </span>
                          <span className={`flex-1 font-medium ${r.yours ? "text-gray-900" : "text-gray-500"}`}>
                            {r.region} {r.yours && <span className="text-green-600 text-[10px]">(your region)</span>}
                          </span>
                          <span className={`font-semibold ${r.yours ? "text-[#1e3055]" : "text-gray-400"}`}>
                            {r.spend}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key stat */}
                <div className="rounded-xl border border-[#1e3055]/20 bg-[#1e3055]/5 p-4">
                  <div className="text-2xl font-bold text-[#1e3055]">67%</div>
                  <div className="text-xs font-medium text-[#1e3055] mt-0.5">of highway maintenance</div>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    Is now delivered by SMEs and tier-2 subcontractors — up from 48% in 2020. You are in the right sector.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-400">
          All market data shown is illustrative demo data. Live version sources from Find a Tender, Contracts Finder, Cabinet Office spend data and ONS public procurement statistics.
        </p>

      </div>
    </div>
  )
}
