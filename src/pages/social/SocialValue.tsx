import { useState } from "react"
import { Leaf, Users, Briefcase, Heart, Building2, Recycle, CheckCircle2, Download, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// ─── Tracker demo data ────────────────────────────────────────────────────────

const TRACKER_DATA = [
  { commitment: "Local employment (Yorkshire)", target: "70% local workforce", current: "62%", status: "amber" as const },
  { commitment: "Apprenticeships created", target: "2 during contract", current: "1 in place", status: "amber" as const },
  { commitment: "Work experience placements", target: "4 placements", current: "2 completed", status: "amber" as const },
  { commitment: "Training hours delivered", target: "120 hours", current: "48 hours", status: "amber" as const },
  { commitment: "Mental health first aider", target: "Yes — on site", current: "Confirmed", status: "green" as const },
  { commitment: "Living wage paid", target: "Yes — all staff", current: "Confirmed", status: "green" as const },
  { commitment: "Community projects", target: "2 initiatives", current: "0 completed", status: "red" as const },
  { commitment: "Local SME supply chain", target: "60% within 25 miles", current: "54%", status: "amber" as const },
  { commitment: "Volunteer hours", target: "40 hours", current: "0 hours", status: "red" as const },
  { commitment: "Carbon reduction vs baseline", target: "15% reduction", current: "On track", status: "green" as const },
  { commitment: "EVs in fleet", target: "2 vehicles", current: "1 vehicle", status: "amber" as const },
  { commitment: "Waste to landfill", target: "< 5%", current: "3.2%", status: "green" as const },
]

const statusMeta = {
  green: { label: "On Track", className: "bg-green-100 text-green-700" },
  amber: { label: "In Progress", className: "bg-amber-100 text-amber-700" },
  red: { label: "Not Started", className: "bg-red-100 text-red-700" },
}

// ─── Generated response builder ───────────────────────────────────────────────

function buildResponse(ctx: {
  contractName: string
  buyerType: string
  svWeighting: string
  contractValue: string
  localPct: string
  localArea: string
  apprentices: string
  workExp: string
  trainingHrs: string
  mentalHealth: boolean
  livingWage: boolean
  flexWorking: boolean
  communityProjects: string
  localSMEPct: string
  localSMEMiles: string
  voluntaryHrs: string
  carbonPct: string
  evCount: string
  wastePct: string
  recycledPct: string
}): string {
  return `Greenfield Infrastructure Ltd is committed to delivering significant and measurable social value throughout the ${ctx.contractName || "contract"} — aligning with the Social Value Model and the requirements of ${ctx.buyerType || "the buyer"}.

**Employment & Skills:** We will employ a minimum of **${ctx.localPct}% of our contract workforce** from within the **${ctx.localArea}** area, directly supporting local livelihoods and reducing unemployment. We will create **${ctx.apprentices} apprenticeship(s)** during the contract period, providing structured career pathways for young people in the region. In addition, we will deliver **${ctx.workExp} work experience placement(s)** and **${ctx.trainingHrs} hours of upskilling** across our workforce, ensuring our people grow alongside the contract.

**Wellbeing:** ${ctx.mentalHealth ? "A qualified **Mental Health First Aider** will be present on site throughout delivery, actively supporting the psychological wellbeing of all operatives. " : ""}${ctx.livingWage ? "All staff engaged on this contract will be paid the **Real Living Wage** as a minimum, ensuring fair pay for every person involved. " : ""}${ctx.flexWorking ? "We operate flexible working practices to support work-life balance and retain diverse talent. " : ""}

**Community:** We will deliver **${ctx.communityProjects} community initiative(s)** in partnership with local charities and organisations during the contract, contributing positively to the communities in which we work. Our supply chain commitment requires a minimum of **${ctx.localSMEPct}% of subcontracted spend** to be sourced from SMEs within **${ctx.localSMEMiles} miles**, maximising local economic benefit. Our team will contribute **${ctx.voluntaryHrs} hours of volunteering** to local causes.

**Net Zero & Environment:** We will achieve a **${ctx.carbonPct}% reduction in carbon emissions** compared to our baseline, and will have **${ctx.evCount} electric vehicle(s)** operational in our fleet by contract end. Waste to landfill will be kept below **${ctx.wastePct}%**, and we will specify a minimum of **${ctx.recycledPct}% recycled content** in materials used on site.

These commitments will be tracked, evidenced, and reported to ${ctx.buyerType || "the buyer"} on a quarterly basis using our Social Value Tracker. All outcomes will be available for audit and will form part of our contract renewal evidence library.`
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SocialValue() {
  // Step 1 — context
  const [contractName, setContractName] = useState("A57 Road Resurfacing")
  const [buyerType, setBuyerType] = useState("National Highways")
  const [svWeighting, setSvWeighting] = useState("20")
  const [contractValue, setContractValue] = useState("950000")

  // Step 2 — Employment & Skills
  const [empChecked, setEmpChecked] = useState(true)
  const [localPct, setLocalPct] = useState("70")
  const [localArea, setLocalArea] = useState("Yorkshire")
  const [appChecked, setAppChecked] = useState(true)
  const [apprentices, setApprentices] = useState("2")
  const [weChecked, setWeChecked] = useState(true)
  const [workExp, setWorkExp] = useState("4")
  const [trainChecked, setTrainChecked] = useState(true)
  const [trainingHrs, setTrainingHrs] = useState("120")

  // Step 2 — Wellbeing
  const [mentalHealth, setMentalHealth] = useState(true)
  const [livingWage, setLivingWage] = useState(true)
  const [flexWorking, setFlexWorking] = useState(true)

  // Step 2 — Community
  const [commChecked, setCommChecked] = useState(true)
  const [communityProjects, setCommunityProjects] = useState("2")
  const [scChecked, setScChecked] = useState(true)
  const [localSMEPct, setLocalSMEPct] = useState("60")
  const [localSMEMiles, setLocalSMEMiles] = useState("25")
  const [volChecked, setVolChecked] = useState(true)
  const [voluntaryHrs, setVoluntaryHrs] = useState("40")

  // Step 2 — Environment
  const [carbonChecked, setCarbonChecked] = useState(true)
  const [carbonPct, setCarbonPct] = useState("15")
  const [evChecked, setEvChecked] = useState(true)
  const [evCount, setEvCount] = useState("2")
  const [wasteChecked, setWasteChecked] = useState(true)
  const [wastePct, setWastePct] = useState("5")
  const [recycleChecked, setRecycleChecked] = useState(true)
  const [recycledPct, setRecycledPct] = useState("30")

  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const generatedText = buildResponse({
    contractName,
    buyerType,
    svWeighting,
    contractValue,
    localPct,
    localArea,
    apprentices,
    workExp,
    trainingHrs,
    mentalHealth,
    livingWage,
    flexWorking,
    communityProjects,
    localSMEPct,
    localSMEMiles,
    voluntaryHrs,
    carbonPct,
    evCount,
    wastePct,
    recycledPct,
  })

  function handleCopy() {
    navigator.clipboard.writeText(generatedText.replace(/\*\*/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeCount = [
    empChecked, appChecked, weChecked, trainChecked,
    mentalHealth, livingWage, flexWorking,
    commChecked, scChecked, volChecked,
    carbonChecked, evChecked, wasteChecked, recycleChecked,
  ].filter(Boolean).length

  const wordCount = Math.round(280 + activeCount * 8)

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Social Value & ESG</h1>
            <Badge className="bg-[#1e3055] text-white text-xs">DEMO</Badge>
          </div>
          <p className="text-gray-500 text-sm">
            Generate tender-ready social value responses aligned with the Social Value Model (SVM)
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-2">
          <Leaf className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">SVM Aligned</span>
        </div>
      </div>

      {/* ── Intro cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-blue-100 bg-blue-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-semibold text-blue-900">What is Social Value?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 leading-relaxed">
              Public sector buyers are legally required to consider social value in procurement. Most weight it between{" "}
              <strong>10–20% of the total evaluation score</strong> — making it a significant differentiator between bids.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-purple-100 bg-purple-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-semibold text-purple-900">The Social Value Model</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">The Government's SVM has 5 themes:</p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" />Jobs &amp; skills recovery</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" />Workforce wellbeing</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" />Innovation &amp; growth</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" />Equal opportunity</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" />Net zero &amp; climate</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-green-100 bg-green-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-sm font-semibold text-green-900">How BidIQ Pro Helps</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />Generates measurable commitments in seconds</li>
              <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />Tracks delivery against promises on live contracts</li>
              <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />Builds an evidence library for renewals</li>
              <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />Aligns with buyer-specific SVM priorities</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* ── Generator tool ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Social Value Generator</h2>
        <p className="text-sm text-gray-500 mb-6">Complete the steps below to generate a tender-ready social value response.</p>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e3055] text-white text-xs font-bold shrink-0">1</div>
                <CardTitle className="text-base">Contract Context</CardTitle>
              </div>
              <CardDescription>Tell us about the tender you're responding to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contract-name" className="text-sm">Tender / contract name</Label>
                  <Input
                    id="contract-name"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    placeholder="e.g. A57 Road Resurfacing"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyer-type" className="text-sm">Buyer type</Label>
                  <Select value={buyerType} onValueChange={setBuyerType}>
                    <SelectTrigger id="buyer-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National Highways">National Highways</SelectItem>
                      <SelectItem value="Local Authority">Local Authority</SelectItem>
                      <SelectItem value="NHS Trust">NHS Trust</SelectItem>
                      <SelectItem value="Central Government">Central Government</SelectItem>
                      <SelectItem value="Housing Association">Housing Association</SelectItem>
                      <SelectItem value="Education / Academy Trust">Education / Academy Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sv-weighting" className="text-sm">Social value weighting</Label>
                  <Select value={svWeighting} onValueChange={setSvWeighting}>
                    <SelectTrigger id="sv-weighting">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="25">25%+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contract-value" className="text-sm">Contract value (£)</Label>
                  <Input
                    id="contract-value"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="950000"
                    type="number"
                  />
                </div>
              </div>
              {svWeighting === "25" && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                  25%+ weighting is high — this buyer places strong emphasis on social value. Ensure every commitment is specific, measurable, and deliverable.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e3055] text-white text-xs font-bold shrink-0">2</div>
                <CardTitle className="text-base">Your Commitments</CardTitle>
              </div>
              <CardDescription>Tick and configure the commitments you can genuinely deliver</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Employment & Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-[#1e3055]" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Employment & Skills</h3>
                </div>
                <div className="space-y-2.5">

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="emp" checked={empChecked} onCheckedChange={(v) => setEmpChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="emp" className="text-sm cursor-pointer">Local employment commitment</Label>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={localPct} onChange={(e) => setLocalPct(e.target.value)} disabled={!empChecked} type="number" min={0} max={100} />
                        <span>% of workforce from</span>
                        <Input className="w-28 h-7 text-sm" value={localArea} onChange={(e) => setLocalArea(e.target.value)} disabled={!empChecked} placeholder="region" />
                        <span>area</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="app" checked={appChecked} onCheckedChange={(v) => setAppChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="app" className="text-sm cursor-pointer">Apprenticeship creation</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={apprentices} onChange={(e) => setApprentices(e.target.value)} disabled={!appChecked} type="number" min={0} />
                        <span>apprenticeships during contract</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="we" checked={weChecked} onCheckedChange={(v) => setWeChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="we" className="text-sm cursor-pointer">Work experience placements</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={workExp} onChange={(e) => setWorkExp(e.target.value)} disabled={!weChecked} type="number" min={0} />
                        <span>placements during contract</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="train" checked={trainChecked} onCheckedChange={(v) => setTrainChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="train" className="text-sm cursor-pointer">Training hours</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={trainingHrs} onChange={(e) => setTrainingHrs(e.target.value)} disabled={!trainChecked} type="number" min={0} />
                        <span>hours of upskilling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Wellbeing */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Wellbeing</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "mhfa", label: "Mental health first aider on site", state: mentalHealth, setState: setMentalHealth },
                    { id: "lw",   label: "Real Living Wage commitment",        state: livingWage,   setState: setLivingWage },
                    { id: "flex", label: "Flexible working practices",          state: flexWorking,  setState: setFlexWorking },
                  ].map(({ id, label, state, setState }) => (
                    <div key={id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                      <Checkbox id={id} checked={state} onCheckedChange={(v) => setState(!!v)} />
                      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Community */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Community</h3>
                </div>
                <div className="space-y-2.5">

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="comm" checked={commChecked} onCheckedChange={(v) => setCommChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="comm" className="text-sm cursor-pointer">Community projects</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={communityProjects} onChange={(e) => setCommunityProjects(e.target.value)} disabled={!commChecked} type="number" min={0} />
                        <span>local charity / community initiatives</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="sc" checked={scChecked} onCheckedChange={(v) => setScChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="sc" className="text-sm cursor-pointer">Supply chain localisation</Label>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={localSMEPct} onChange={(e) => setLocalSMEPct(e.target.value)} disabled={!scChecked} type="number" min={0} max={100} />
                        <span>% from local SMEs within</span>
                        <Input className="w-16 h-7 text-sm" value={localSMEMiles} onChange={(e) => setLocalSMEMiles(e.target.value)} disabled={!scChecked} type="number" min={0} />
                        <span>miles</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="vol" checked={volChecked} onCheckedChange={(v) => setVolChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="vol" className="text-sm cursor-pointer">Voluntary days</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={voluntaryHrs} onChange={(e) => setVoluntaryHrs(e.target.value)} disabled={!volChecked} type="number" min={0} />
                        <span>hours of volunteering</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Environment */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Environment</h3>
                </div>
                <div className="space-y-2.5">

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="carbon" checked={carbonChecked} onCheckedChange={(v) => setCarbonChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="carbon" className="text-sm cursor-pointer">Carbon reduction target</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={carbonPct} onChange={(e) => setCarbonPct(e.target.value)} disabled={!carbonChecked} type="number" min={0} />
                        <span>% reduction vs baseline</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="ev" checked={evChecked} onCheckedChange={(v) => setEvChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="ev" className="text-sm cursor-pointer">Electric vehicles in fleet</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={evCount} onChange={(e) => setEvCount(e.target.value)} disabled={!evChecked} type="number" min={0} />
                        <span>EVs in fleet by contract end</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="waste" checked={wasteChecked} onCheckedChange={(v) => setWasteChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="waste" className="text-sm cursor-pointer">Waste to landfill</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span>Less than</span>
                        <Input className="w-16 h-7 text-sm" value={wastePct} onChange={(e) => setWastePct(e.target.value)} disabled={!wasteChecked} type="number" min={0} max={100} />
                        <span>%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Checkbox id="recycle" checked={recycleChecked} onCheckedChange={(v) => setRecycleChecked(!!v)} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="recycle" className="text-sm cursor-pointer">Recycled materials</Label>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Input className="w-16 h-7 text-sm" value={recycledPct} onChange={(e) => setRecycledPct(e.target.value)} disabled={!recycleChecked} type="number" min={0} max={100} />
                        <span>% recycled content in materials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate button */}
          <Button
            size="lg"
            className="w-full bg-[#1e3055] hover:bg-[#162540] text-white text-base font-semibold py-6"
            onClick={() => setGenerated(true)}
          >
            <Zap className="h-5 w-5 mr-2" />
            Generate Social Value Response
          </Button>

          {/* Step 3 — Generated response */}
          {generated && (
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold shrink-0">3</div>
                    <CardTitle className="text-base text-green-900">Generated Response</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span>~{wordCount} words</span>
                    <span>·</span>
                    <span>Tender-ready</span>
                  </div>
                </div>
                <CardDescription>
                  Professional response for {contractName || "your contract"} — aligned with the SVM and {svWeighting}% social value weighting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-green-200 bg-white p-5 text-sm text-gray-700 leading-relaxed space-y-3">
                  {generatedText.split("\n\n").map((para, i) => (
                    <p key={i}>
                      {para.split(/\*\*(.*?)\*\*/g).map((chunk, j) =>
                        j % 2 === 1
                          ? <strong key={j} className="font-semibold text-gray-900">{chunk}</strong>
                          : chunk
                      )}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => alert("PDF download coming soon")}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download as PDF
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#1e3055] text-white hover:bg-[#162540]"
                    onClick={() => { window.location.href = "/bids" }}
                  >
                    Insert into Bid Workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator />

      {/* ── Social value tracker ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Social Value Tracker</h2>
            <p className="text-sm text-gray-500">Track your social value delivery on live contracts</p>
          </div>
          <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Trafford Contract — Live</Badge>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="border border-green-100 bg-green-50/40">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-green-700">{TRACKER_DATA.filter(r => r.status === "green").length}</p>
              <p className="text-xs text-gray-600 mt-0.5">On Track</p>
            </CardContent>
          </Card>
          <Card className="border border-amber-100 bg-amber-50/40">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{TRACKER_DATA.filter(r => r.status === "amber").length}</p>
              <p className="text-xs text-gray-600 mt-0.5">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border border-red-100 bg-red-50/40">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-red-700">{TRACKER_DATA.filter(r => r.status === "red").length}</p>
              <p className="text-xs text-gray-600 mt-0.5">Not Started</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Commitment</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Target</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Current</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TRACKER_DATA.map((row, i) => {
                    const meta = statusMeta[row.status]
                    return (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{row.commitment}</td>
                        <td className="px-4 py-3 text-gray-600">{row.target}</td>
                        <td className="px-4 py-3 text-gray-600">{row.current}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${meta.className}`}>{meta.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
