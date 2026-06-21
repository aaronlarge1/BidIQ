import { useState } from "react"
import {
  PoundSterling,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Banknote,
  FileText,
  ChevronRight,
  Info,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Static demo data
// ---------------------------------------------------------------------------
const CASHFLOW_MONTHS = ["Jul 26", "Aug 26", "Sep 26", "Oct 26", "Nov 26", "Dec 26"]
const INCOME_DATA     = [0, 80000, 80000, 130000, 130000, 150000]
const COSTS_DATA      = [25000, 65000, 70000, 85000, 90000, 95000]

const cashflowChartData = CASHFLOW_MONTHS.map((month, i) => ({
  month,
  Income: INCOME_DATA[i],
  Costs:  COSTS_DATA[i],
  Net:    INCOME_DATA[i] - COSTS_DATA[i],
}))

const totalIncome = INCOME_DATA.reduce((a, b) => a + b, 0)
const totalCosts  = COSTS_DATA.reduce((a, b) => a + b, 0)
const totalNet    = totalIncome - totalCosts

// ---------------------------------------------------------------------------
// Summary Cards
// ---------------------------------------------------------------------------
function SummaryCards() {
  const cards = [
    {
      title: "Total Pipeline Value",
      value: formatCurrency(4_200_000),
      icon:  <TrendingUp className="h-5 w-5 text-[#1e3a5f]" />,
      sub:   "Active bids & opportunities",
      extra: null,
    },
    {
      title: "Won Contracts Value",
      value: formatCurrency(280_000),
      icon:  <PoundSterling className="h-5 w-5 text-emerald-600" />,
      sub:   "Year to date",
      extra: "+12% vs last year",
    },
    {
      title: "Revenue This Year",
      value: formatCurrency(2_800_000),
      icon:  <Banknote className="h-5 w-5 text-[#1e3a5f]" />,
      sub:   "Projected to Dec 2026",
      extra: null,
    },
    {
      title: "Cashflow Status",
      value: "Positive",
      icon:  <TrendingUp className="h-5 w-5 text-emerald-600" />,
      sub:   "45-day average payment",
      extra: null,
      badge: "Healthy",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.title} className="border border-slate-200 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">{c.title}</p>
              <div className="p-1.5 bg-slate-50 rounded-md">{c.icon}</div>
            </div>
            <p className="text-2xl font-bold text-[#1e3a5f] mb-1">{c.value}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
            {c.extra && (
              <p className="text-xs text-emerald-600 font-medium mt-1">{c.extra}</p>
            )}
            {c.badge && (
              <Badge className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                {c.badge}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 1 — Contract Funding Calculator
// ---------------------------------------------------------------------------
interface FundingResult {
  fundingGap: number
  workingCapital: number
  breakEvenDay: number
}

function FundingCalculator() {
  const [contractValue,    setContractValue]    = useState("340000")
  const [paymentTerms,     setPaymentTerms]     = useState("45")
  const [mobilisationCost, setMobilisationCost] = useState("18000")
  const [labourWeekly,     setLabourWeekly]     = useState("6500")
  const [materialMonthly,  setMaterialMonthly]  = useState("12000")
  const [result,           setResult]           = useState<FundingResult | null>(null)

  function calculate() {
    // Demo figures close to the spec — in production these would be real calculations
    setResult({ fundingGap: 45_200, workingCapital: 78_500, breakEvenDay: 47 })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[#1e3a5f] mb-1">Contract Funding Calculator</h3>
        <p className="text-sm text-slate-500">
          Estimate funding needed to mobilise a new contract before your first invoice is paid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cf-cv" className="text-sm">Contract value (£)</Label>
              <Input
                id="cf-cv"
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cf-pt" className="text-sm">Payment terms (days)</Label>
              <select
                id="cf-pt"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="45">45 days</option>
                <option value="60">60 days</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cf-mob" className="text-sm">Mobilisation cost (£)</Label>
              <Input
                id="cf-mob"
                type="number"
                value={mobilisationCost}
                onChange={(e) => setMobilisationCost(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cf-lw" className="text-sm">Labour weekly cost (£)</Label>
              <Input
                id="cf-lw"
                type="number"
                value={labourWeekly}
                onChange={(e) => setLabourWeekly(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cf-mm" className="text-sm">Materials monthly (£)</Label>
              <Input
                id="cf-mm"
                type="number"
                value={materialMonthly}
                onChange={(e) => setMaterialMonthly(e.target.value)}
                className="font-mono"
              />
            </div>

            <Button
              onClick={calculate}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card className="border border-emerald-200 bg-emerald-50">
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Funding gap in first 60 days</span>
                    <span className="text-xl font-bold text-[#1e3a5f]">
                      {formatCurrency(result.fundingGap)}
                    </span>
                  </div>
                  <Separator className="bg-emerald-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Working capital needed</span>
                    <span className="text-xl font-bold text-[#1e3a5f]">
                      {formatCurrency(result.workingCapital)}
                    </span>
                  </div>
                  <Separator className="bg-emerald-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Revenue break-even</span>
                    <span className="text-xl font-bold text-emerald-700">
                      Day {result.breakEvenDay}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-slate-50">
                <CardContent className="pt-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">Funding Options</p>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                    asChild
                  >
                    <a href="#invoice-finance">
                      Explore Invoice Finance Options
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                    asChild
                  >
                    <a href="#working-capital">
                      Explore Working Capital
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center min-h-[280px] text-slate-400">
              <Calculator className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Enter contract details and click Calculate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 2 — Cashflow Forecast
// ---------------------------------------------------------------------------
function CashflowForecast() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1e3a5f]">Cashflow Forecast</h3>
          <p className="text-sm text-slate-500">
            Six-month projected cashflow — Jul to Dec 2026
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Forecast
        </Button>
      </div>

      {/* Chart */}
      <Card className="border border-slate-200">
        <CardContent className="pt-5 pb-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={cashflowChartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) =>
                  v === 0 ? "£0" : `£${(v / 1000).toFixed(0)}k`
                }
              />
              <RechartsTooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
              />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="#1e3a5f"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Costs"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Net"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex gap-6 justify-center mt-3 pb-2">
            {[
              { label: "Income", color: "#1e3a5f" },
              { label: "Costs",  color: "#ef4444" },
              { label: "Net",    color: "#10b981" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: l.color }}
                />
                <span className="text-xs text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly breakdown table */}
      <Card className="border border-slate-200">
        <CardContent className="pt-4 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Month</th>
                  <th className="text-right py-2 px-4 font-semibold text-[#1e3a5f]">Income</th>
                  <th className="text-right py-2 px-4 font-semibold text-red-500">Costs</th>
                  <th className="text-right py-2 pl-4 font-semibold text-emerald-600">Net</th>
                </tr>
              </thead>
              <tbody>
                {cashflowChartData.map((row, i) => (
                  <tr
                    key={row.month}
                    className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}
                  >
                    <td className="py-2 pr-4 font-medium text-slate-700">{row.month}</td>
                    <td className="py-2 px-4 text-right text-slate-600 tabular-nums">
                      {formatCurrency(row.Income)}
                    </td>
                    <td className="py-2 px-4 text-right text-slate-600 tabular-nums">
                      {formatCurrency(row.Costs)}
                    </td>
                    <td
                      className={`py-2 pl-4 text-right font-semibold tabular-nums ${
                        row.Net >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {row.Net < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(row.Net))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-bold">
                  <td className="py-2 pr-4 text-slate-700">Total</td>
                  <td className="py-2 px-4 text-right text-[#1e3a5f] tabular-nums">
                    {formatCurrency(totalIncome)}
                  </td>
                  <td className="py-2 px-4 text-right text-red-500 tabular-nums">
                    {formatCurrency(totalCosts)}
                  </td>
                  <td className="py-2 pl-4 text-right text-emerald-600 tabular-nums">
                    {formatCurrency(totalNet)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3 — Margin Calculator
// ---------------------------------------------------------------------------
function MarginCalculator() {
  const [contractValue,  setContractValue]  = useState("280000")
  const [directLabour,   setDirectLabour]   = useState("140000")
  const [materials,      setMaterials]      = useState("62000")
  const [subcontractors, setSubcontractors] = useState("20000")
  const [overheads,      setOverheads]      = useState("28000")

  const cv  = parseFloat(contractValue)  || 0
  const dl  = parseFloat(directLabour)   || 0
  const mat = parseFloat(materials)      || 0
  const sub = parseFloat(subcontractors) || 0
  const oh  = parseFloat(overheads)      || 0

  const grossMargin    = cv - (dl + mat + sub)
  const grossMarginPct = cv > 0 ? (grossMargin / cv) * 100 : 0
  const netMargin      = grossMargin - oh
  const netMarginPct   = cv > 0 ? (netMargin / cv) * 100 : 0
  const dayRate        = cv > 0 ? Math.round(cv / 250) : 0

  const isGood   = netMarginPct >= 15
  const isOk     = netMarginPct >= 10 && netMarginPct < 15
  const isBad    = netMarginPct < 10

  const marginColour  = isGood ? "text-emerald-600" : isOk ? "text-amber-600" : "text-red-500"
  const cardBorder    = isGood
    ? "border-emerald-200 bg-emerald-50"
    : isOk
    ? "border-amber-200 bg-amber-50"
    : "border-red-200 bg-red-50"
  const badgeClass    = isGood
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : isOk
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-700 border-red-200"
  const marginLabel   = isGood
    ? "Strong margin"
    : isOk
    ? "Acceptable — review costs"
    : "Low margin — risk of loss"

  const fields = [
    { id: "mc-cv",  label: "Contract value",       value: contractValue,  setter: setContractValue },
    { id: "mc-dl",  label: "Direct labour",         value: directLabour,   setter: setDirectLabour },
    { id: "mc-mat", label: "Materials & plant",     value: materials,      setter: setMaterials },
    { id: "mc-sub", label: "Subcontractors",        value: subcontractors, setter: setSubcontractors },
    { id: "mc-oh",  label: "Overheads allocated",   value: overheads,      setter: setOverheads },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[#1e3a5f] mb-1">Margin Calculator</h3>
        <p className="text-sm text-slate-500">
          Live margin calculation as you enter your cost build-up.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Cost Build-Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={f.id} className="text-sm">{f.label} (£)</Label>
                <Input
                  id={f.id}
                  type="number"
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  className="font-mono"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className={`border ${cardBorder}`}>
            <CardContent className="pt-5 space-y-3">
              {[
                {
                  label: "Gross margin",
                  value: `${formatCurrency(grossMargin)} (${grossMarginPct.toFixed(1)}%)`,
                },
                {
                  label: "Net margin",
                  value: `${formatCurrency(netMargin)} (${netMarginPct.toFixed(1)}%)`,
                },
                {
                  label: "Return on turnover",
                  value: `${netMarginPct.toFixed(1)}%`,
                },
                {
                  label: "Day rate equivalent",
                  value: formatCurrency(dayRate),
                  colourOverride: "text-[#1e3a5f]",
                },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span
                      className={`text-base font-bold ${
                        row.colourOverride ?? marginColour
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Margin health</span>
                <Badge className={`text-xs border ${badgeClass}`}>{marginLabel}</Badge>
              </div>
              <Progress
                value={Math.min(Math.max(netMarginPct, 0) / 30 * 100, 100)}
                className="h-2"
              />
              <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Highways contracts typically achieve 12–20% net margin. NHS/FM contracts 10–18%.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 4 — Invoice Finance & Working Capital
// ---------------------------------------------------------------------------
function InvoiceFinance() {
  const products = [
    {
      title:  "Invoice Finance",
      icon:   <FileText className="h-5 w-5 text-[#1e3a5f]" />,
      desc:   "Advance up to 90% of invoice value within 24 hours against verified public sector contracts.",
      detail: "Rates from 1.5% pcm. Available on contracts from £50k.",
      cta:    "Get a Quote (Partner Service)",
    },
    {
      title:  "Contract Bond / Surety",
      icon:   <PoundSterling className="h-5 w-5 text-[#1e3a5f]" />,
      desc:   "Performance bonds required for contracts over £500k. Demonstrates financial standing to buyers.",
      detail: "Surety bond from 0.5–1% of contract value. Same-day indicative terms.",
      cta:    "Find a Surety Provider",
    },
    {
      title:  "Working Capital Loan",
      icon:   <Banknote className="h-5 w-5 text-[#1e3a5f]" />,
      desc:   "Short-term finance to cover mobilisation costs, equipment, and early-stage staffing.",
      detail: "6–24 month terms. Decisions within 48 hrs. No security required under £250k.",
      cta:    "Find a Lender",
    },
  ]

  return (
    <div className="space-y-6" id="invoice-finance">
      <div>
        <h3 className="text-base font-semibold text-[#1e3a5f] mb-1">
          Invoice Finance &amp; Working Capital
        </h3>
        <p className="text-sm text-slate-500">
          Access funding against your public sector contracts through our partner network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.title} className="border border-slate-200 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-slate-50 rounded-md">{p.icon}</div>
                <CardTitle className="text-sm font-semibold text-[#1e3a5f]">{p.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-3">
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              <p className="text-xs text-slate-400 italic">{p.detail}</p>
              <div className="mt-auto pt-2">
                <Button className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm" asChild>
                  <a href="#">
                    {p.cta}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-amber-200 bg-amber-50" id="working-capital">
        <CardContent className="pt-3 pb-3">
          <p className="text-xs text-amber-700 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>Partner Referral Disclosure:</strong> These are partner referral services.
              BidIQ Pro earns a referral fee when you connect with a lender or surety provider.
              We do not provide financial advice. Always compare rates independently before committing.
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FinanceCentre() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[#1e3a5f]">Finance Centre</h1>
              <Badge className="bg-amber-100 text-amber-700 border border-amber-300 text-xs font-semibold">
                DEMO
              </Badge>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Financial data is illustrative for demo purposes
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <SummaryCards />

        {/* Tabs */}
        <Tabs defaultValue="funding" className="space-y-4">
          <TabsList className="bg-white border border-slate-200 shadow-sm h-auto p-1 flex flex-wrap gap-1">
            {[
              { value: "funding",   label: "Funding Calculator" },
              { value: "cashflow",  label: "Cashflow Forecast"  },
              { value: "margin",    label: "Margin Calculator"  },
              { value: "finance",   label: "Invoice Finance"    },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white text-sm px-4 py-2 rounded-md"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="pt-6 pb-6">
              <TabsContent value="funding"  className="mt-0"><FundingCalculator /></TabsContent>
              <TabsContent value="cashflow" className="mt-0"><CashflowForecast /></TabsContent>
              <TabsContent value="margin"   className="mt-0"><MarginCalculator /></TabsContent>
              <TabsContent value="finance"  className="mt-0"><InvoiceFinance /></TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
