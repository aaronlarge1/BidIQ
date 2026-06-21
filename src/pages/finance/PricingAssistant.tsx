import { useState } from "react"
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  PoundSterling,
  Info,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface BidResult {
  bidPrice: number
  profit: number
  netMarginPct: number
  riskAdjustedMarginPct: number
  returnOnCost: number
  totalCost: number
}

interface Scenario {
  label: string
  marginPct: number
  recommended: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CONTRACT_TYPES = [
  "Highways Maintenance",
  "Construction",
  "Facilities Management",
  "Cleaning",
  "IT Services",
]

const REGIONS = [
  "North West",
  "Yorkshire & Humber",
  "East Midlands",
  "West Midlands",
  "South West",
  "South East",
  "London",
  "Scotland",
  "Wales",
]

const SCENARIOS: Scenario[] = [
  { label: "Conservative", marginPct: 10, recommended: false },
  { label: "Target",       marginPct: 15, recommended: true  },
  { label: "Aggressive",   marginPct: 20, recommended: false },
]

const AI_INSIGHTS = [
  "Similar NHS and highways contracts in the North West achieved £295k–£330k in 2025.",
  "At this price, you'd rank 2nd–3rd on price if 5 bidders submit.",
  "Social value weighting of 20% means quality matters as much as price — don't race to the bottom.",
  "Consider reducing subcontractor cost by bringing drainage in-house (+£8k margin improvement).",
]

const ESTIMATED_RANKS: Record<string, string> = {
  Conservative: "1st–2nd",
  Target:       "2nd–3rd",
  Aggressive:   "3rd–4th",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function calcBid(
  labour: number,
  materials: number,
  subs: number,
  overheads: number,
  riskPct: number,
  marginPct: number,
): BidResult {
  const baseCost     = labour + materials + subs + overheads
  const riskAmount   = baseCost * (riskPct / 100)
  const totalCost    = baseCost + riskAmount
  const bidPrice     = totalCost / (1 - marginPct / 100)
  const profit       = bidPrice - totalCost
  const netMarginPct = totalCost > 0 ? (profit / bidPrice) * 100 : 0
  // Risk-adjusted: assume half the risk provision might be used
  const riskAdjustedMarginPct = totalCost > 0
    ? ((profit - riskAmount * 0.5) / bidPrice) * 100
    : 0
  const returnOnCost = totalCost > 0 ? (profit / totalCost) * 100 : 0

  return { bidPrice, profit, netMarginPct, riskAdjustedMarginPct, returnOnCost, totalCost }
}

function scenarioBidPrice(
  baseCost: number,
  riskPct: number,
  marginPct: number,
): number {
  const riskAmount = baseCost * (riskPct / 100)
  const totalCost  = baseCost + riskAmount
  return totalCost / (1 - marginPct / 100)
}

// ---------------------------------------------------------------------------
// Mini Donut (CSS-only for simplicity — avoids recharts dep in this file)
// ---------------------------------------------------------------------------
interface DonutSegment {
  label: string
  value: number
  colour: string
}

function CostDonut({ segments, total }: { segments: DonutSegment[]; total: number }) {
  // Build conic-gradient string
  let cumPct = 0
  const stops = segments
    .map((s) => {
      const pct    = total > 0 ? (s.value / total) * 100 : 0
      const start  = cumPct
      cumPct      += pct
      return `${s.colour} ${start.toFixed(1)}% ${cumPct.toFixed(1)}%`
    })
    .join(", ")

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-36 h-36 rounded-full"
        style={{
          background: `conic-gradient(${stops})`,
          mask: "radial-gradient(farthest-side,#0000 55%,#000 56%)",
          WebkitMask: "radial-gradient(farthest-side,#0000 55%,#000 56%)",
        }}
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: s.colour }}
            />
            <span className="text-xs text-slate-500 truncate">{s.label}</span>
            <span className="text-xs text-slate-400 ml-auto tabular-nums">
              {total > 0 ? ((s.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PricingAssistant() {
  // Inputs
  const [labour,       setLabour]       = useState("140000")
  const [materials,    setMaterials]    = useState("62000")
  const [subs,         setSubs]         = useState("20000")
  const [overheads,    setOverheads]    = useState("28000")
  const [riskPct,      setRiskPct]      = useState(5)
  const [marginPct,    setMarginPct]    = useState(15)
  const [contractType, setContractType] = useState(CONTRACT_TYPES[0])
  const [region,       setRegion]       = useState(REGIONS[0])

  const [result, setResult] = useState<BidResult | null>(null)

  const labourVal    = parseFloat(labour)    || 0
  const materialsVal = parseFloat(materials) || 0
  const subsVal      = parseFloat(subs)      || 0
  const overheadsVal = parseFloat(overheads) || 0
  const baseCost     = labourVal + materialsVal + subsVal + overheadsVal

  function handleCalculate() {
    setResult(
      calcBid(labourVal, materialsVal, subsVal, overheadsVal, riskPct, marginPct)
    )
  }

  // Margin status
  const nm = result?.netMarginPct ?? 0
  const marginStatus =
    nm < 10  ? "underpriced" :
    nm > 25  ? "uncompetitive" :
    "good"

  const donutSegments: DonutSegment[] = result
    ? [
        { label: "Labour",      value: labourVal,    colour: "#1e3a5f" },
        { label: "Materials",   value: materialsVal, colour: "#10b981" },
        { label: "Subs",        value: subsVal,      colour: "#6366f1" },
        { label: "Overheads",   value: overheadsVal, colour: "#f59e0b" },
        { label: "Risk",        value: baseCost * (riskPct / 100), colour: "#ef4444" },
        { label: "Profit",      value: result.profit, colour: "#0ea5e9" },
      ]
    : []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">AI Pricing Assistant</h1>
            <Badge className="bg-amber-100 text-amber-700 border border-amber-300 text-xs font-semibold">
              DEMO
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Build a defensible, market-competitive bid price using your real cost data.
          </p>
        </div>

        {/* Main layout — inputs left, results right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* ----------------------------------------------------------------
              LEFT PANEL — inputs (60%)
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            {/* Section A: Cost Build-Up */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#1e3a5f]" />
                  Section A — Cost Build-Up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-labour" className="text-sm">
                      Direct Labour (£)
                      <span className="block text-xs text-slate-400 font-normal">
                        Wages, NI, holiday pay
                      </span>
                    </Label>
                    <Input
                      id="pa-labour"
                      type="number"
                      placeholder="140000"
                      value={labour}
                      onChange={(e) => setLabour(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pa-mat" className="text-sm">Materials &amp; Plant (£)</Label>
                    <Input
                      id="pa-mat"
                      type="number"
                      placeholder="62000"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pa-subs" className="text-sm">Subcontractors (£)</Label>
                    <Input
                      id="pa-subs"
                      type="number"
                      placeholder="20000"
                      value={subs}
                      onChange={(e) => setSubs(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pa-oh" className="text-sm">
                      Overheads (£)
                      <span className="block text-xs text-slate-400 font-normal">
                        Indirect costs allocated
                      </span>
                    </Label>
                    <Input
                      id="pa-oh"
                      type="number"
                      placeholder="28000"
                      value={overheads}
                      onChange={(e) => setOverheads(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* Risk Allowance slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pa-risk" className="text-sm">Risk Allowance</Label>
                    <span className="text-sm font-semibold text-[#1e3a5f] tabular-nums">
                      {riskPct}% &nbsp;({formatCurrency(baseCost * riskPct / 100)})
                    </span>
                  </div>
                  <input
                    id="pa-risk"
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={riskPct}
                    onChange={(e) => setRiskPct(Number(e.target.value))}
                    className="w-full h-2 accent-[#1e3a5f] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Desired Margin slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pa-margin" className="text-sm">Desired Margin</Label>
                    <span className="text-sm font-semibold text-[#1e3a5f] tabular-nums">
                      {marginPct}%
                    </span>
                  </div>
                  <input
                    id="pa-margin"
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={marginPct}
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full h-2 accent-[#1e3a5f] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>20%</span>
                    <span>40%</span>
                  </div>
                </div>

                <Button
                  onClick={handleCalculate}
                  size="lg"
                  className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Bid Price
                </Button>
              </CardContent>
            </Card>

            {/* Section B: Market Intelligence */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Section B — Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-type" className="text-sm">Contract type</Label>
                    <select
                      id="pa-type"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {CONTRACT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pa-region" className="text-sm">Region</Label>
                    <select
                      id="pa-region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-md bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 p-3">
                  <Info className="h-4 w-4 text-[#1e3a5f] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#1e3a5f] leading-relaxed">
                    <strong>AI Pricing Suggests:</strong> £267,000 – £295,000 for similar{" "}
                    {contractType} contracts in {region}. Your inputs are within a competitive
                    range.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ----------------------------------------------------------------
              RIGHT PANEL — results (40%)
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            {result ? (
              <>
                {/* Bid Price Card */}
                <Card className="border-2 border-[#1e3a5f] shadow-md">
                  <CardContent className="pt-5 pb-5 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Suggested Bid Price
                    </p>
                    <p className="text-4xl font-extrabold text-[#1e3a5f]">
                      {formatCurrency(Math.round(result.bidPrice))}
                    </p>
                    <p className="text-xs text-slate-400">
                      Incl. {riskPct}% risk allowance + {marginPct}% target margin
                    </p>
                  </CardContent>
                </Card>

                {/* Margin warning / confirmation */}
                {marginStatus === "underpriced" && (
                  <Card className="border border-red-200 bg-red-50">
                    <CardContent className="pt-3 pb-3">
                      <p className="text-sm text-red-700 font-medium flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        Underpriced — risk of project loss at this margin
                      </p>
                    </CardContent>
                  </Card>
                )}
                {marginStatus === "uncompetitive" && (
                  <Card className="border border-amber-200 bg-amber-50">
                    <CardContent className="pt-3 pb-3">
                      <p className="text-sm text-amber-700 font-medium flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        Check market rates — price may be uncompetitive
                      </p>
                    </CardContent>
                  </Card>
                )}
                {marginStatus === "good" && (
                  <Card className="border border-emerald-200 bg-emerald-50">
                    <CardContent className="pt-3 pb-3">
                      <p className="text-sm text-emerald-700 font-medium flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                        Competitive pricing range
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Key metrics */}
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {[
                      { label: "Expected Profit",           value: formatCurrency(Math.round(result.profit)) },
                      { label: "Net Margin",                value: `${result.netMarginPct.toFixed(1)}%` },
                      { label: "Risk-Adjusted Margin",      value: `${result.riskAdjustedMarginPct.toFixed(1)}%` },
                      { label: "Return on Cost",            value: `${result.returnOnCost.toFixed(1)}%` },
                    ].map((m, i, arr) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{m.label}</span>
                          <span className="text-sm font-bold text-[#1e3a5f]">{m.value}</span>
                        </div>
                        {i < arr.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Cost breakdown donut */}
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CostDonut
                      segments={donutSegments}
                      total={result.bidPrice}
                    />
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="border border-[#1e3a5f]/30 bg-[#1e3a5f]/5 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {AI_INSIGHTS.map((insight, i) => (
                      <p
                        key={i}
                        className="text-xs text-[#1e3a5f]/80 leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="mt-1 shrink-0 inline-block w-1 h-1 rounded-full bg-[#1e3a5f]/50" />
                        {insight}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <PoundSterling className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Results appear here</p>
                <p className="text-xs mt-1">Enter costs and click Calculate</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Scenarios Table */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pricing Scenarios
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Compare conservative, target, and aggressive pricing at your current cost base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 pr-4 font-semibold text-slate-600">Scenario</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-600">Total Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-600">Profit</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-600">Margin</th>
                    <th className="text-right py-3 pl-4 font-semibold text-slate-600">Est. Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIOS.map((s) => {
                    const price  = scenarioBidPrice(baseCost, riskPct, s.marginPct)
                    const profit = price - baseCost * (1 + riskPct / 100)
                    const isRec  = s.recommended

                    return (
                      <tr
                        key={s.label}
                        className={
                          isRec
                            ? "bg-[#1e3a5f]/5 border-l-4 border-l-[#1e3a5f]"
                            : "border-l-4 border-l-transparent"
                        }
                      >
                        <td className="py-3 pr-4 font-medium text-slate-700">
                          <div className="flex items-center gap-2">
                            {s.label}
                            {isRec && (
                              <Badge className="bg-[#1e3a5f] text-white text-xs px-1.5 py-0.5">
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-semibold text-[#1e3a5f]">
                          {formatCurrency(Math.round(price))}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-emerald-600 font-medium">
                          {formatCurrency(Math.round(profit))}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <Badge
                            className={`text-xs border ${
                              s.marginPct >= 15
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : s.marginPct >= 10
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {s.marginPct}%
                          </Badge>
                        </td>
                        <td className="py-3 pl-4 text-right text-slate-500 tabular-nums">
                          {ESTIMATED_RANKS[s.label]}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 mt-4 flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Estimated rank assumes 5 bidders and typical market spread. AI insight based on
              comparable published contract awards. Not financial advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
