import { useState } from "react"
import {
  Bot,
  FileText,
  Upload,
  ChevronRight,
  ChevronDown,
  Zap,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SectionStatus = "approved" | "in-review" | "needs-work" | "draft" | "not-started"

interface TenderSection {
  id: number
  title: string
  status: SectionStatus
}

interface ScoreBreakdown {
  label: string
  score: number
  max: number
}

interface AISuggestion {
  id: number
  text: string
  applied: boolean
}

interface MissingEvidence {
  id: number
  text: string
}

// ---------------------------------------------------------------------------
// Static demo data
// ---------------------------------------------------------------------------

const TENDER_SECTIONS: TenderSection[] = [
  { id: 1, title: "Company Overview", status: "approved" },
  { id: 2, title: "Technical Approach", status: "in-review" },
  { id: 3, title: "Experience & References", status: "approved" },
  { id: 4, title: "Social Value", status: "needs-work" },
  { id: 5, title: "Environmental Management", status: "draft" },
  { id: 6, title: "Health & Safety", status: "approved" },
  { id: 7, title: "Pricing Schedule", status: "not-started" },
  { id: 8, title: "Subcontracting", status: "not-started" },
]

const SCORE_BREAKDOWN: ScoreBreakdown[] = [
  { label: "Technical detail", score: 8, max: 10 },
  { label: "Compliance reference", score: 7, max: 10 },
  { label: "Evidence cited", score: 6, max: 10 },
  { label: "Clarity", score: 7, max: 10 },
  { label: "Differentiation", score: 3, max: 10 },
]

const DEMO_ANSWER =
  `Greenfield Infrastructure Ltd will employ a proven methodology for carriageway resurfacing that aligns fully with Highways England's Design Manual for Roads and Bridges (DMRB) and Manual of Contract Documents for Highway Works (MCHW). Our approach has been refined across over 40 National Highways schemes, delivering consistent quality outcomes within programme and budget.

Our technical approach encompasses four key phases: survey and investigation, preparation works, surfacing, and quality assurance sign-off.

Phase 1 — Survey & Investigation: Prior to mobilisation, our in-house survey team will conduct a comprehensive condition assessment using high-speed road survey (HSRS) data and visual inspection aligned to HD 29/08. Pavement cores will be taken at representative intervals to confirm existing composition and inform mix design.

Phase 2 — Preparation Works: All defective areas will be planed and patched in advance of bulk resurfacing. We will install temporary traffic management to Chapter 8 standards, minimising disruption and maintaining two-way flow wherever feasible. Our dedicated traffic management team holds NHSS 12 accreditation.

Phase 3 — Surfacing: Hot-rolled asphalt or Stone Mastic Asphalt (SMA) will be laid using our Vogele Super 1800-3i paver, achieving consistent mat thickness within +/-5mm tolerance. All materials will be sourced from our Highways England-approved supplier framework.

Phase 4 — Quality Assurance: Testing will follow MCHW Series 900 protocols, with cores taken at the frequency specified in the contract. Results will be reported in real-time via our site management platform, with all non-conformances escalated within two hours.`

const INITIAL_SUGGESTIONS: AISuggestion[] = [
  {
    id: 1,
    text: "Add specific reference to MCHW Series 900 for surfacing specification",
    applied: false,
  },
  {
    id: 2,
    text: "Include measurable quality KPIs (e.g. IRI targets <2.5 m/km, texture depth >1.5mm)",
    applied: false,
  },
  {
    id: 3,
    text: "Differentiate: mention your in-house plant fleet reducing programme risk and cost",
    applied: false,
  },
]

const MISSING_EVIDENCE: MissingEvidence[] = [
  { id: 1, text: "Link to case study: M60 resurfacing project" },
  { id: 2, text: "Add method statement reference document" },
]

// ---------------------------------------------------------------------------
// Helper sub-components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
    case "in-review":
      return <FileText className="h-4 w-4 text-blue-400 shrink-0" />
    case "needs-work":
      return <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
    case "draft":
      return <FileText className="h-4 w-4 text-slate-400 shrink-0" />
    case "not-started":
      return <FileText className="h-4 w-4 text-slate-600 shrink-0" />
  }
}

function StatusPill({ status }: { status: SectionStatus }) {
  const map: Record<SectionStatus, { label: string; cls: string }> = {
    approved: { label: "Approved", cls: "text-emerald-400" },
    "in-review": { label: "In Review", cls: "text-blue-400" },
    "needs-work": { label: "Needs Work", cls: "text-amber-400" },
    draft: { label: "Draft", cls: "text-slate-400" },
    "not-started": { label: "Not Started", cls: "text-slate-500" },
  }
  const { label, cls } = map[status]
  return <span className={`text-xs ${cls}`}>{label}</span>
}

function ScoreRing({ score }: { score: number }) {
  const ringCls =
    score >= 80
      ? "border-emerald-400"
      : score >= 60
      ? "border-amber-400"
      : "border-red-400"
  const textCls =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-amber-400"
      : "text-red-400"
  return (
    <div
      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 ${ringCls}`}
    >
      <span className={`text-2xl font-bold ${textCls}`}>{score}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function BidWorkspace() {
  const [activeSection, setActiveSection] = useState<number>(2)
  const [answerText, setAnswerText] = useState(DEMO_ANSWER)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(INITIAL_SUGGESTIONS)
  const [isImproving, setIsImproving] = useState(false)

  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length
  const wordLimit = 500
  const wordPct = Math.min((wordCount / wordLimit) * 100, 100)

  const approvedCount = TENDER_SECTIONS.filter((s) => s.status === "approved").length
  const currentSection = TENDER_SECTIONS.find((s) => s.id === activeSection)

  function applySuggestion(id: number) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: true } : s))
    )
  }

  function handleImprove() {
    setIsImproving(true)
    setTimeout(() => setIsImproving(false), 1800)
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* TOP BAR                                                             */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-emerald-400" />
          <span className="font-semibold text-slate-100">
            A57 Road Resurfacing — National Highways
          </span>
          <Badge className="border border-emerald-700/50 bg-emerald-900/60 text-xs text-emerald-300">
            DEMO
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Draft Bid
          </Button>
          <div className="group relative">
            <Button
              size="sm"
              disabled
              className="cursor-not-allowed bg-slate-700 text-slate-400"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit to Platform
            </Button>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
              Complete all sections first
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 3-COLUMN BODY                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== LEFT: Tender Sections ===== */}
        <aside className="flex w-[25%] min-w-[210px] shrink-0 flex-col border-r border-slate-800 bg-slate-900/60">
          <div className="shrink-0 px-4 pt-4 pb-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Tender Sections
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 px-3 pb-3">
              {TENDER_SECTIONS.map((section) => {
                const isActive = section.id === activeSection
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "border border-[#1e4a7a] bg-[#0f2a4a]"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 shrink-0 text-xs text-slate-600">
                        {section.id}
                      </span>
                      <span
                        className={`flex-1 text-sm leading-snug ${
                          isActive ? "font-medium text-white" : "text-slate-300"
                        }`}
                      >
                        {section.title}
                      </span>
                      <StatusIcon status={section.status} />
                    </div>
                    {isActive && (
                      <div className="ml-6 mt-0.5">
                        <StatusPill status={section.status} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>

          <div className="shrink-0 space-y-3 border-t border-slate-800 p-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">Overall progress</span>
                <span className="text-xs font-semibold text-emerald-400">65%</span>
              </div>
              <Progress value={65} className="h-1.5 bg-slate-800" />
              <p className="mt-1 text-xs text-slate-500">
                {approvedCount} of {TENDER_SECTIONS.length} sections approved
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Tender Pack
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
            >
              <Zap className="mr-2 h-4 w-4 text-amber-400" />
              Generate Checklist
            </Button>
          </div>
        </aside>

        {/* ===== MIDDLE: Answer Editor ===== */}
        <main className="flex w-[50%] flex-col border-r border-slate-800 overflow-hidden">
          {/* Section header */}
          <div className="shrink-0 border-b border-slate-800 px-6 py-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
              Section {activeSection} — {currentSection?.title}
            </p>
            <p className="max-w-xl text-sm font-medium leading-snug text-slate-200">
              Describe your technical methodology for carriageway resurfacing, including
              quality controls, traffic management and compliance with Highways England
              specifications.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Word limit: <span className="text-slate-400">500</span>
              </span>
              <Separator orientation="vertical" className="h-4 bg-slate-700" />
              <span
                className={`text-xs font-semibold ${
                  wordCount > wordLimit
                    ? "text-red-400"
                    : wordCount > wordLimit * 0.9
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {wordCount} / {wordLimit} words
              </span>
              <div className="flex-1">
                <Progress value={wordPct} className="h-1 bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Editor body */}
          <div className="flex-1 overflow-auto px-6 py-4">
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="min-h-[300px] resize-none border-slate-700 bg-slate-800/40 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-[#1e4a7a] focus:ring-1 focus:ring-[#1e4a7a]"
            />

            {/* Action bar */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={handleImprove}
                disabled={isImproving}
                className="border border-[#1e4a7a] bg-[#0f2a4a] text-emerald-300 hover:bg-[#1e4a7a] hover:text-white"
              >
                <Bot
                  className={`mr-2 h-4 w-4 ${isImproving ? "animate-spin" : ""}`}
                />
                {isImproving ? "Improving…" : "Improve with AI"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
              >
                <ChevronDown className="mr-1.5 h-4 w-4" />
                Expand
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
              >
                <ChevronRight className="mr-1.5 h-4 w-4" />
                Summarise
              </Button>
              <Button
                size="sm"
                className="ml-auto bg-emerald-700 text-white hover:bg-emerald-600"
              >
                Save
              </Button>
            </div>

            {/* Section checklist */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Section Checklist
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "Answer within word limit", done: wordCount <= wordLimit },
                  { label: "Technical methodology described", done: true },
                  { label: "Compliance references included", done: true },
                  { label: "Quality controls stated", done: true },
                  { label: "Traffic management approach covered", done: true },
                  { label: "Reviewed by bid manager", done: false },
                  { label: "Peer reviewed", done: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-600" />
                    )}
                    <span
                      className={`text-xs ${
                        item.done ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 border-t border-slate-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Sections approved:</span>
                <span className="text-sm font-bold text-emerald-400">
                  {approvedCount}
                </span>
                <span className="text-sm text-slate-500">
                  / {TENDER_SECTIONS.length}
                </span>
                <Progress
                  value={(approvedCount / TENDER_SECTIONS.length) * 100}
                  className="h-1.5 w-20 bg-slate-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Draft Bid
                </Button>
                <div className="group relative">
                  <Button
                    size="sm"
                    disabled
                    className="cursor-not-allowed bg-slate-700 text-slate-400"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit to Platform
                  </Button>
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Complete all sections first
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ===== RIGHT: AI Scoring & Suggestions ===== */}
        <aside className="flex w-[25%] min-w-[210px] shrink-0 flex-col bg-slate-900/60">
          <ScrollArea className="flex-1">
            <div className="space-y-5 p-4">
              {/* AI Score */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  AI Section Score
                </p>
                <div className="flex items-center gap-4">
                  <ScoreRing score={71} />
                  <div>
                    <p className="text-base font-bold text-amber-400">71 / 100</p>
                    <p className="text-xs text-slate-500">Amber — Good</p>
                    <p className="mt-1 text-xs text-slate-600">5 improvements found</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Score breakdown */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Score Breakdown
                </p>
                <div className="space-y-2.5">
                  {SCORE_BREAKDOWN.map((item) => {
                    const pct = (item.score / item.max) * 100
                    const textCls =
                      pct >= 80
                        ? "text-emerald-400"
                        : pct >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                    return (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-slate-400">{item.label}</span>
                          <span className={`text-xs font-semibold ${textCls}`}>
                            {item.score}/{item.max}
                          </span>
                        </div>
                        <Progress value={pct} className="h-1 bg-slate-800" />
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* AI Suggestions */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  AI Suggestions
                </p>
                <div className="space-y-2.5">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-lg border p-3 transition-colors ${
                        s.applied
                          ? "border-emerald-800/50 bg-emerald-900/20"
                          : "border-slate-700 bg-slate-800/40"
                      }`}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        {s.applied ? (
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        ) : (
                          <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                        )}
                        <p className="text-xs leading-snug text-slate-300">{s.text}</p>
                      </div>
                      {s.applied ? (
                        <p className="text-xs text-emerald-500">Applied</p>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(s.id)}
                          className="h-6 w-full border border-[#1e4a7a] bg-[#0f2a4a] text-xs text-emerald-300 hover:bg-[#1e4a7a] hover:text-white"
                        >
                          Apply Suggestion
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Missing evidence */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Missing Evidence
                </p>
                <div className="space-y-2">
                  {MISSING_EVIDENCE.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 rounded-lg border border-amber-800/40 bg-amber-900/10 p-2.5"
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <p className="text-xs leading-snug text-amber-300/80">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Clarification questions */}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-blue-400" />
                Generate Clarification Questions
              </Button>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  )
}
