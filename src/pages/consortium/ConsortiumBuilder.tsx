import { useState } from "react"
import { Users, Plus, Search, Star, MapPin, CheckCircle2, AlertCircle, Zap, Building2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { DEMO_PARTNERS, DEMO_COMPANY } from "@/lib/demo-data"
import { formatCurrency } from "@/lib/utils"
import type { Partner } from "@/types"

// ─── Capability gaps ──────────────────────────────────────────────────────────

const CAPABILITY_GAPS = [
  { label: "Street lighting / LED", icon: "⚡", unlocks: "£620k" },
  { label: "IT & cyber",            icon: "💻", unlocks: "£450k" },
  { label: "Social care",           icon: "🏥", unlocks: "£680k" },
  { label: "Cleaning services",     icon: "🧹", unlocks: "£350k" },
]

// ─── Partner fills map ────────────────────────────────────────────────────────

const PARTNER_FILLS: Record<string, { gaps: string[]; score: number; maxValue: string }> = {
  "p-001": {
    gaps: ["Street lighting", "LED upgrade", "EV charging"],
    score: 84,
    maxValue: "£2.1m",
  },
  "p-002": {
    gaps: ["Commercial cleaning", "Grounds maintenance"],
    score: 78,
    maxValue: "£1.4m",
  },
  "p-003": {
    gaps: ["IT & cyber security", "Network infrastructure", "Managed services"],
    score: 91,
    maxValue: "£2.8m",
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScorePill({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color =
    score >= 85
      ? "bg-green-100 text-green-800 border-green-200"
      : score >= 70
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-gray-100 text-gray-700 border-gray-200"
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${color} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {score}/100
    </span>
  )
}

function AccrBadge({ label }: { label: string }) {
  const display: Record<string, string> = {
    "iso-9001": "ISO 9001",
    "iso-14001": "ISO 14001",
    "iso-27001": "ISO 27001",
    "safe-contractor": "Safe Contractor",
    "cyber-essentials-plus": "Cyber Essentials+",
    chas: "CHAS",
  }
  return (
    <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
      {display[label] ?? label}
    </span>
  )
}

function PartnerCard({
  partner,
  selected,
  onSelect,
  onInvite,
}: {
  partner: Partner
  selected: boolean
  onSelect: () => void
  onInvite: () => void
}) {
  const fills = PARTNER_FILLS[partner.id]
  return (
    <Card
      className={`cursor-pointer transition-all duration-150 ${
        selected
          ? "border-2 border-[#1e3055] shadow-md"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{partner.name}</h3>
              <Badge className="bg-[#1e3055]/10 text-[#1e3055] text-[10px] font-medium shrink-0">DEMO</Badge>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium text-gray-600 border-gray-200">
              {partner.sector}
            </Badge>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 mb-1">Combined score</p>
            <ScorePill score={partner.combinedScore ?? 0} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3" />
          <span>{partner.region}</span>
          <span className="mx-1">·</span>
          <span className="font-medium text-gray-700">{formatCurrency(partner.turnover)} turnover</span>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {partner.capabilities.slice(0, 4).map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700"
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Accreditations */}
        <div className="flex flex-wrap gap-1 mb-4">
          {partner.accreditations.map((a) => (
            <AccrBadge key={a} label={a} />
          ))}
        </div>

        {/* Gap fill summary */}
        {fills && selected && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 mb-3 text-xs text-green-800">
            <p className="font-semibold mb-1">Adding {partner.name} fills:</p>
            <ul className="space-y-0.5">
              {fills.gaps.map((g) => (
                <li key={g} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-medium">Together you could bid for contracts up to {fills.maxValue}</p>
          </div>
        )}

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-gray-200 hover:bg-gray-50"
            onClick={onSelect}
          >
            {selected ? "Selected" : "View Profile"}
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs bg-[#1e3055] hover:bg-[#162540] text-white"
            onClick={onInvite}
          >
            <Mail className="h-3 w-3 mr-1.5" />
            Invite to Consortium
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConsortiumBuilder() {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [invitedId, setInvitedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("find")

  const filteredPartners = DEMO_PARTNERS.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      p.capabilities.some((c) => c.toLowerCase().includes(q)) ||
      p.accreditations.some((a) => a.toLowerCase().includes(q))
    )
  })

  const selectedPartner = DEMO_PARTNERS.find((p) => p.id === selectedId) ?? null
  const selectedFills = selectedId ? PARTNER_FILLS[selectedId] : null

  function handleInvite(partnerId: string) {
    setInvitedId(partnerId)
    setTimeout(() => setInvitedId(null), 3000)
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Consortium Builder</h1>
            <Badge className="bg-[#1e3055] text-white text-xs">DEMO</Badge>
          </div>
          <p className="text-gray-500 text-sm">
            Find partners to bid for larger contracts or fill capability gaps
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">3 suggested partners</span>
        </div>
      </div>

      {/* ── Capability gaps banner ──────────────────────────────────────── */}
      <Card className="border border-amber-200 bg-amber-50/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-sm font-semibold text-amber-900">
                Based on your profile, you may need partners for:
              </CardTitle>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-3 py-1">
              These gaps are limiting £2.1m in opportunities
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CAPABILITY_GAPS.map((gap) => (
              <div
                key={gap.label}
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2.5"
              >
                <span className="text-base">{gap.icon}</span>
                <div>
                  <p className="text-xs font-medium text-gray-800">{gap.label}</p>
                  <p className="text-[10px] text-gray-500">Unlocks ~{gap.unlocks}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find">Find Partners</TabsTrigger>
          <TabsTrigger value="active">Active Consortiums</TabsTrigger>
          <TabsTrigger value="how">How It Works</TabsTrigger>
        </TabsList>

        {/* ── Find partners tab ─────────────────────────────────────────── */}
        <TabsContent value="find" className="space-y-5 pt-4">
          {/* Search & filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search by capability, sector, location, accreditation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Capability", "Region", "Accreditation", "Turnover", "Rating"].map((f) => (
              <button
                key={f}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:border-[#1e3055] hover:text-[#1e3055] transition-colors"
              >
                {f}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Showing {filteredPartners.length} suggested partner{filteredPartners.length !== 1 ? "s" : ""}{" "}
            <span className="font-medium">(DEMO)</span>
          </p>

          {/* Partner cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                selected={selectedId === partner.id}
                onSelect={() => setSelectedId(selectedId === partner.id ? null : partner.id)}
                onInvite={() => handleInvite(partner.id)}
              />
            ))}
            {filteredPartners.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No partners found matching "{search}"</p>
                <button
                  className="mt-2 text-xs text-[#1e3055] underline"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Invite toast */}
          {invitedId && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-[#1e3055] text-white px-5 py-3 shadow-xl text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Invitation sent to {DEMO_PARTNERS.find(p => p.id === invitedId)?.name}
            </div>
          )}

          {/* Capability coverage panel */}
          {selectedPartner && selectedFills && (
            <Card className="border-2 border-[#1e3055]/20 bg-[#1e3055]/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1e3055] text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      Capability Coverage — {DEMO_COMPANY.name} + {selectedPartner.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Adding {selectedPartner.name} fills: {selectedFills.gaps.join(", ")}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Combined score</p>
                        <ScorePill score={selectedFills.score} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Max contract value</p>
                        <span className="text-sm font-semibold text-[#1e3055]">{selectedFills.maxValue}</span>
                      </div>
                      <div className="flex-1 min-w-[160px]">
                        <p className="text-xs text-gray-500 mb-1">Score improvement</p>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedFills.score} className="flex-1 h-2 [&>div]:bg-[#1e3055]" />
                          <span className="text-xs font-medium text-[#1e3055]">{selectedFills.score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Active consortiums tab ────────────────────────────────────── */}
        <TabsContent value="active" className="pt-4">
          <Card className="border border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="py-16 text-center">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-gray-100 mb-4">
                <Users className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No active consortium agreements</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Once you invite a partner and agree on contract scope, your active consortium will appear here. Consortium agreements are a great way to unlock larger contract opportunities.
              </p>
              <Button
                className="bg-[#1e3055] hover:bg-[#162540] text-white"
                onClick={() => setActiveTab("find")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Partner
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">About Consortium Bidding</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              A consortium allows two or more businesses to submit a joint bid for a contract that neither could deliver alone.
              Each party typically takes responsibility for their scope of work. The lead party signs the contract with the buyer
              and sub-contracts the other party. This is fully permitted under UK procurement rules and is actively encouraged
              for SMEs bidding on larger public sector contracts.
            </p>
          </div>
        </TabsContent>

        {/* ── How it works tab ─────────────────────────────────────────── */}
        <TabsContent value="how" className="pt-4">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">How Consortium Bidding Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Find a Partner",
                  description:
                    "Use BidIQ Pro's partner search to find businesses with the capabilities you need. Filter by sector, region, accreditations, and turnover to find the right fit.",
                  icon: <Search className="h-5 w-5 text-[#1e3055]" />,
                },
                {
                  step: "2",
                  title: "Agree Scope",
                  description:
                    "Define who delivers what. Set out the commercial arrangement — who leads the bid, who invoices the buyer, and what each party's responsibilities are. Use a Teaming Agreement.",
                  icon: <Building2 className="h-5 w-5 text-[#1e3055]" />,
                },
                {
                  step: "3",
                  title: "Submit Joint Bid",
                  description:
                    "Submit a single bid naming both organisations. Buyers expect this for complex contracts. Your combined capability and capacity strengthens the submission significantly.",
                  icon: <CheckCircle2 className="h-5 w-5 text-[#1e3055]" />,
                },
              ].map((item) => (
                <Card key={item.step} className="border border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e3055] text-white text-xs font-bold">
                        {item.step}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3055]/10">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Want to learn more?</h4>
                <p className="text-xs text-gray-500">
                  The BidIQ Pro Academy has a full guide on consortium bidding, Teaming Agreements, and how to approach buyers.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-[#1e3055] text-[#1e3055] hover:bg-[#1e3055]/5"
                onClick={() => { window.location.href = "/academy" }}
              >
                View Academy Guide
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-green-100 bg-green-50/40">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Benefits of consortiums
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Bid for contracts above your individual capacity</li>
                    <li>Fill capability gaps without hiring</li>
                    <li>Share bid costs and resource</li>
                    <li>Build trusted supply chain relationships</li>
                    <li>Access larger frameworks and DPS lots</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border border-amber-100 bg-amber-50/40">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Things to consider
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Agree roles and responsibilities upfront</li>
                    <li>Use a formal Teaming Agreement</li>
                    <li>Check buyer rules on subcontracting limits</li>
                    <li>Lead partner takes on contract liability</li>
                    <li>Agree a clear payment schedule</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
