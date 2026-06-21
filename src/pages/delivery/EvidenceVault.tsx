import { useState } from "react"
import {
  Image, FileText, Star, MessageSquare, CheckCircle2,
  Upload, Plus, Search, Filter, Download, Eye, BarChart3,
  FolderOpen, ArrowRight, Lightbulb, Camera, ClipboardList,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { DEMO_EVIDENCE } from "@/lib/demo-data"
import { formatDate } from "@/lib/utils"
import type { Evidence } from "@/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function evidenceIcon(type: Evidence["type"]) {
  switch (type) {
    case "photo":
      return <Image className="h-5 w-5 text-blue-600" />
    case "kpi-report":
      return <BarChart3 className="h-5 w-5 text-purple-600" />
    case "testimonial":
      return <Star className="h-5 w-5 text-amber-500" />
    case "completion-report":
      return <ClipboardList className="h-5 w-5 text-green-600" />
    case "case-study":
      return <FileText className="h-5 w-5 text-[#1e3055]" />
    default:
      return <FileText className="h-5 w-5 text-gray-400" />
  }
}

function evidenceTypeBadge(type: Evidence["type"]) {
  const map: Record<Evidence["type"], { label: string; cls: string }> = {
    photo: { label: "Photo", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    "kpi-report": { label: "KPI Report", cls: "bg-purple-100 text-purple-700 border-purple-200" },
    testimonial: { label: "Testimonial", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    "completion-report": { label: "Completion Report", cls: "bg-green-100 text-green-700 border-green-200" },
    "case-study": { label: "Case Study", cls: "bg-gray-100 text-gray-700 border-gray-200" },
  }
  const meta = map[type] ?? { label: type, cls: "bg-gray-100 text-gray-600 border-gray-200" }
  return (
    <Badge className={`${meta.cls} text-xs hover:${meta.cls}`}>{meta.label}</Badge>
  )
}

function iconBg(type: Evidence["type"]) {
  switch (type) {
    case "photo": return "bg-blue-50"
    case "kpi-report": return "bg-purple-50"
    case "testimonial": return "bg-amber-50"
    case "completion-report": return "bg-green-50"
    case "case-study": return "bg-gray-50"
    default: return "bg-gray-50"
  }
}

// ─── Evidence Card ────────────────────────────────────────────────────────────

function EvidenceCard({
  evidence,
  onView,
}: {
  evidence: Evidence
  onView: (e: Evidence) => void
}) {
  const desc = evidence.description.length > 90
    ? evidence.description.slice(0, 89) + "…"
    : evidence.description

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Type icon + badge row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg(evidence.type)}`}>
            {evidenceIcon(evidence.type)}
          </div>
          {evidenceTypeBadge(evidence.type)}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
          {evidence.title}
        </h3>

        {/* Contract ref */}
        {evidence.contractId && (
          <p className="text-xs text-gray-400 mb-1">
            Contract: <span className="font-medium text-gray-600">{evidence.contractId}</span>
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-gray-400 mb-2">{formatDate(evidence.date)}</p>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-4">{desc}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1 bg-[#1e3055] text-white hover:bg-[#162540] text-xs gap-1"
          >
            <ArrowRight className="h-3.5 w-3.5" /> Use in Bid
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-gray-500 hover:text-[#1e3055]"
            title="View"
            onClick={() => onView(evidence)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-gray-500 hover:text-[#1e3055]"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Add Evidence Card ────────────────────────────────────────────────────────

function AddEvidenceCard() {
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-[#1e3055]/30 hover:bg-gray-50 transition-colors flex flex-col h-full">
      <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center min-h-[220px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-3">
          <Plus className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-1">Add Evidence</h3>
        <p className="text-xs text-gray-400 mb-4 max-w-[160px]">
          Add evidence from current contracts
        </p>
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:border-[#1e3055]/40 hover:text-[#1e3055]"
          >
            <Camera className="h-3.5 w-3.5" /> Upload Photo
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:border-[#1e3055]/40 hover:text-[#1e3055]"
          >
            <Upload className="h-3.5 w-3.5" /> Upload Report
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:border-[#1e3055]/40 hover:text-[#1e3055]"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Write Testimonial
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Case Study Builder ───────────────────────────────────────────────────────

const CASE_STUDY_STEPS = [
  { n: 1, label: "Select Contract", desc: "Choose the contract to build from" },
  { n: 2, label: "Select Evidence", desc: "Pick photos, KPIs and testimonials" },
  { n: 3, label: "Generate", desc: "AI drafts your case study" },
  { n: 4, label: "Review & Save", desc: "Edit and save to vault" },
]

function CaseStudyBuilder() {
  const [activeStep] = useState(1)

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Case Study Builder
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Generate a professional case study from your evidence
            </p>
          </div>
          <Badge variant="outline" className="text-xs">AI-Powered</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Steps */}
        <div className="flex items-start gap-0 mb-6 overflow-x-auto pb-1">
          {CASE_STUDY_STEPS.map((step, i) => (
            <div key={step.n} className="flex items-start">
              <div className="flex flex-col items-center text-center min-w-[100px]">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold mb-2 shrink-0 transition-colors
                    ${activeStep === step.n
                      ? "bg-[#1e3055] text-white"
                      : activeStep > step.n
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                    }`}
                >
                  {activeStep > step.n ? <CheckCircle2 className="h-4 w-4" /> : step.n}
                </div>
                <p className={`text-xs font-semibold ${activeStep >= step.n ? "text-gray-800" : "text-gray-400"}`}>
                  {step.label}
                </p>
                <p className={`text-xs mt-0.5 ${activeStep >= step.n ? "text-gray-500" : "text-gray-300"}`}>
                  {step.desc}
                </p>
              </div>
              {i < CASE_STUDY_STEPS.length - 1 && (
                <div className="mt-4 h-px w-8 bg-gray-200 shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 content */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Step 1: Select a contract</p>
          <div className="flex items-center justify-between rounded-lg border border-[#1e3055]/20 bg-white p-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Trafford Council Highway Repairs 2025
              </p>
              <p className="text-xs text-gray-400">£280,000 · Aug 2026 – Jul 2027</p>
            </div>
            <Badge className="bg-[#1e3055]/10 text-[#1e3055] border-[#1e3055]/20 hover:bg-[#1e3055]/10">
              Selected
            </Badge>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              className="bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5"
            >
              Next: Select Evidence <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400 italic">
          DEMO — Case study builder will use AI to produce a structured, bid-ready case study from your evidence.
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Evidence Detail Dialog ───────────────────────────────────────────────────

function EvidenceDialog({
  evidence,
  onClose,
}: {
  evidence: Evidence
  onClose: () => void
}) {
  return (
    <Dialog open={!!evidence} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {evidenceIcon(evidence.type)}
            <span>{evidence.title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            {evidenceTypeBadge(evidence.type)}
            <Badge variant="outline" className="text-xs">DEMO</Badge>
          </div>
          {evidence.contractId && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                Contract
              </p>
              <p className="text-sm text-gray-800">{evidence.contractId}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Date
            </p>
            <p className="text-sm text-gray-800">{formatDate(evidence.date)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{evidence.description}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-[#1e3055] text-white hover:bg-[#162540] gap-1.5">
              <ArrowRight className="h-4 w-4" /> Use in Bid
            </Button>
            <Button variant="outline" className="gap-1.5">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tab filter logic ─────────────────────────────────────────────────────────

const TAB_FILTERS: Record<string, Evidence["type"] | "all"> = {
  all: "all",
  photos: "photo",
  "kpi-reports": "kpi-report",
  testimonials: "testimonial",
  "completion-reports": "completion-report",
  "case-studies": "case-study",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EvidenceVault() {
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [viewingEvidence, setViewingEvidence] = useState<Evidence | null>(null)

  const filtered = DEMO_EVIDENCE.filter(e => {
    const typeMatch = TAB_FILTERS[activeTab] === "all" || e.type === TAB_FILTERS[activeTab]
    const searchMatch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    return typeMatch && searchMatch
  })

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
                  <h1 className="text-xl font-bold sm:text-2xl">Evidence Vault</h1>
                  <Badge className="border-blue-400/40 bg-blue-400/20 text-blue-100 hover:bg-blue-400/20">
                    DEMO
                  </Badge>
                </div>
                <p className="text-sm text-blue-200">
                  {DEMO_EVIDENCE.length} items &middot; Used in 0 bids &middot; 0 KB stored
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 gap-1.5"
                >
                  <Upload className="h-4 w-4" /> Upload Evidence
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-[#1e3055] hover:bg-blue-50 gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Search + Filter bar ───────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search evidence…"
              className="pl-9 bg-white border-gray-200"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-gray-600 border-gray-200 bg-white">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-white border border-gray-200 shadow-sm rounded-xl p-1.5">
            {[
              { value: "all", label: "All" },
              { value: "photos", label: "Photos" },
              { value: "kpi-reports", label: "KPI Reports" },
              { value: "testimonials", label: "Testimonials" },
              { value: "completion-reports", label: "Completion Reports" },
              { value: "case-studies", label: "Case Studies" },
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

          {/* All tabs share the same grid — filtered by state */}
          {Object.keys(TAB_FILTERS).map(tabVal => (
            <TabsContent key={tabVal} value={tabVal}>
              {filtered.length === 0 && tabVal === activeTab ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                  <FolderOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No evidence found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {search
                      ? `No results for "${search}"`
                      : "No items in this category yet — add evidence from your contracts"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map(e => (
                    <EvidenceCard key={e.id} evidence={e} onView={setViewingEvidence} />
                  ))}
                  <AddEvidenceCard />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* ─── How to Use ────────────────────────────────────────────────── */}
        <Card className="mt-8 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              How to use the Evidence Vault
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Evidence in your vault can be attached to any bid answer to strengthen your submission.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: <Camera className="h-5 w-5 text-blue-600" />,
                  title: "Collect during delivery",
                  desc: "Upload photos, KPI reports and testimonials as you complete work — don't wait until bid time.",
                  bg: "bg-blue-50",
                },
                {
                  icon: <FileText className="h-5 w-5 text-green-600" />,
                  title: "Link to bid sections",
                  desc: "Use the 'Use in Bid' button to attach evidence directly to specific question answers in the AI Bid Workspace.",
                  bg: "bg-green-50",
                },
                {
                  icon: <CheckCircle2 className="h-5 w-5 text-purple-600" />,
                  title: "Update regularly",
                  desc: "Buyers value recent evidence. Keep your vault current with the latest performance data and client feedback.",
                  bg: "bg-purple-50",
                },
              ].map((tip, i) => (
                <div key={i} className={`rounded-xl ${tip.bg} p-4`}>
                  <div className="mb-2">{tip.icon}</div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── Case Study Builder ────────────────────────────────────────── */}
        <div className="mt-6">
          <CaseStudyBuilder />
        </div>

        {/* ─── Demo footer ──────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-gray-400">
          All data shown is demo data for Greenfield Infrastructure Ltd ·{" "}
          Evidence Vault is available on the Pro plan
        </p>

      </div>

      {/* ─── Evidence Detail Dialog ────────────────────────────────────── */}
      {viewingEvidence && (
        <EvidenceDialog
          evidence={viewingEvidence}
          onClose={() => setViewingEvidence(null)}
        />
      )}
    </div>
  )
}
