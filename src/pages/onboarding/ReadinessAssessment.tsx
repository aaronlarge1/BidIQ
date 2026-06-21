import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useCreateCompany } from "@/hooks/useApi"
import { useAuth } from "@/context/AuthContext"
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  ShieldCheck,
  TrendingUp,
  Zap,
  Route,
  Wrench,
  Trash2,
  Truck,
  Lock,
  HeartPulse,
  GraduationCap,
  Home,
  Laptop,
  BriefcaseBusiness,
  Leaf,
  HardHat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONTRACT_CATEGORIES, UK_REGIONS, ROUTES } from "@/lib/constants"

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  companyName: string
  sector: string
  employees: string
  turnover: string
  regions: string[]
  // Step 2
  services: string[]
  // Step 3
  insurance: string[]
  policies: string[]
  // Step 4
  accreditations: string[]
  previousPublicSector: boolean | null
  publicSectorTypes: string[]
  preferredContractValue: string
  // Step 5
  contractInterests: string[]
}

const initialFormData: FormData = {
  companyName: "",
  sector: "",
  employees: "",
  turnover: "",
  regions: [],
  services: [],
  insurance: [],
  policies: [],
  accreditations: [],
  previousPublicSector: null,
  publicSectorTypes: [],
  preferredContractValue: "",
  contractInterests: [],
}

// ─── Static data ─────────────────────────────────────────────────────────────

const SERVICES = [
  "Highway maintenance",
  "Road resurfacing",
  "Drainage works",
  "Line marking",
  "Winter maintenance",
  "Traffic management",
  "Street lighting",
  "Facilities management",
  "Commercial cleaning",
  "Grounds maintenance",
  "Security services",
  "Waste collection",
  "IT support",
  "Social care",
  "Construction",
  "Groundworks",
  "Landscaping",
  "Transport",
]

const INSURANCE_OPTIONS = [
  "Public liability (£5m+)",
  "Employers liability",
  "Professional indemnity",
  "Product liability",
  "Cyber insurance",
  "Motor/fleet",
]

const POLICY_OPTIONS = [
  "Health & Safety",
  "Equal Opportunities",
  "GDPR/Data Protection",
  "Environmental",
  "Modern Slavery",
  "Whistleblowing",
  "Safeguarding",
  "Social Value",
]

const ACCREDITATIONS = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 27001",
  "Cyber Essentials",
  "Cyber Essentials Plus",
  "Safe Contractor",
  "CHAS",
  "Constructionline",
  "Achilles",
  "SSIP",
]

const PUBLIC_SECTOR_TYPES = [
  "Local Government",
  "NHS / Health",
  "Central Government",
  "Housing Associations",
  "Education",
  "Emergency Services",
  "Transport Authorities",
]

const CONTRACT_VALUE_OPTIONS = [
  "Under £10k",
  "£10k – £50k",
  "£50k – £250k",
  "£250k – £1m",
  "£1m – £5m",
  "£5m+",
]

// Map contract category values → lucide icon components
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  highways: Route,
  construction: HardHat,
  maintenance: Wrench,
  facilities: Building2,
  cleaning: Leaf,
  waste: Trash2,
  transport: Truck,
  security: Lock,
  "social-care": HeartPulse,
  it: Laptop,
  "professional-services": BriefcaseBusiness,
  nhs: HeartPulse,
  education: GraduationCap,
  housing: Home,
}

const STEP_NAMES = [
  "Company Basics",
  "Services Offered",
  "Insurance & Policies",
  "Accreditations & Experience",
  "Contract Interests",
  "Your Readiness Score",
]

// ─── Score calculation ────────────────────────────────────────────────────────

function calculateScore(data: FormData): {
  score: number
  missing: string[]
  bestCategories: string[]
  recommendations: string[]
} {
  let score = 0
  const missing: string[] = []

  // Insurance (20%)
  const insuranceScore = Math.min(data.insurance.length / INSURANCE_OPTIONS.length, 1) * 20
  score += insuranceScore
  if (data.insurance.length === 0) missing.push("No insurance policies recorded")
  else if (data.insurance.length < 3) missing.push("Consider adding more insurance cover (public sector typically requires PL, EL, PI as a minimum)")

  // Policies (15%)
  const policyScore = Math.min(data.policies.length / POLICY_OPTIONS.length, 1) * 15
  score += policyScore
  if (data.policies.length === 0) missing.push("No company policies recorded")
  else if (data.policies.length < 4) missing.push("Additional policies needed — Modern Slavery and GDPR are commonly required")

  // Accreditations (20%)
  const accredScore = Math.min(data.accreditations.length / 5, 1) * 20
  score += accredScore
  if (data.accreditations.length === 0) missing.push("No accreditations held — CHAS or Safe Contractor is a good starting point")
  else if (data.accreditations.length < 2) missing.push("Additional accreditations would strengthen your bids (ISO 9001 is widely valued)")

  // Experience (15%)
  if (data.previousPublicSector === true) {
    score += 15
  } else if (data.previousPublicSector === null) {
    missing.push("Public sector experience not confirmed")
  } else {
    missing.push("No previous public sector experience — consider subcontracting to build a track record")
  }

  // Services completeness (15%)
  const serviceScore = data.services.length > 0 ? Math.min(data.services.length / 5, 1) * 15 : 0
  score += serviceScore
  if (data.services.length === 0) missing.push("No services selected")

  // Profile completeness (15%)
  let completenessPoints = 0
  if (data.companyName) completenessPoints += 3
  if (data.sector) completenessPoints += 3
  if (data.employees) completenessPoints += 2
  if (data.turnover) completenessPoints += 2
  if (data.regions.length > 0) completenessPoints += 3
  if (data.contractInterests.length > 0) completenessPoints += 2
  score += Math.min(completenessPoints / 15, 1) * 15
  if (!data.companyName || !data.sector) missing.push("Complete your company profile")
  if (data.regions.length === 0) missing.push("Add the regions you operate in")

  const finalScore = Math.round(Math.min(Math.max(score, 0), 100))

  // Best matching categories based on services
  const serviceToCategory: Record<string, string> = {
    "Highway maintenance": "highways",
    "Road resurfacing": "highways",
    "Drainage works": "highways",
    "Line marking": "highways",
    "Winter maintenance": "highways",
    "Traffic management": "highways",
    "Street lighting": "maintenance",
    "Facilities management": "facilities",
    "Commercial cleaning": "cleaning",
    "Grounds maintenance": "maintenance",
    "Security services": "security",
    "Waste collection": "waste",
    "IT support": "it",
    "Social care": "social-care",
    Construction: "construction",
    Groundworks: "construction",
    Landscaping: "maintenance",
    Transport: "transport",
  }

  const categoryCount: Record<string, number> = {}
  data.services.forEach((s) => {
    const cat = serviceToCategory[s]
    if (cat) categoryCount[cat] = (categoryCount[cat] ?? 0) + 1
  })

  const bestCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => CONTRACT_CATEGORIES.find((c) => c.value === cat)?.label ?? cat)

  // Recommendations
  const recommendations: string[] = []
  if (data.accreditations.length === 0) {
    recommendations.push("Register with CHAS or Safe Contractor — most public sector frameworks require an SSIP accreditation as a minimum.")
  } else if (!data.accreditations.includes("ISO 9001")) {
    recommendations.push("Pursue ISO 9001 certification to significantly strengthen quality scoring in tender evaluations.")
  }
  if (!data.insurance.includes("Professional indemnity")) {
    recommendations.push("Add Professional Indemnity insurance — required for most professional services and IT contracts.")
  }
  if (!data.policies.includes("Modern Slavery")) {
    recommendations.push("Create a Modern Slavery Statement — a legal requirement for turnover over £36m and expected in all public sector bids.")
  }
  if (data.previousPublicSector !== true) {
    recommendations.push("Build your public sector track record by subcontracting or winning smaller Lot A contracts first.")
  }
  if (!data.policies.includes("Social Value")) {
    recommendations.push("Develop a Social Value Policy — the Public Services (Social Value) Act means this is scored in most public contracts.")
  }
  if (recommendations.length > 3) recommendations.length = 3
  while (recommendations.length < 3) {
    recommendations.push("Upload your company documents to the Compliance Vault so they're ready when you need them.")
  }

  return { score: finalScore, missing: [...new Set(missing)], bestCategories, recommendations }
}

// ─── Reusable helpers ─────────────────────────────────────────────────────────

function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (updated: string[]) => void
  columns?: number
}

function CheckboxGroup({ options, selected, onChange, columns = 2 }: CheckboxGroupProps) {
  return (
    <div className={`grid gap-3 ${columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((option) => {
        const checked = selected.includes(option)
        return (
          <label
            key={option}
            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-150 ${
              checked
                ? "border-[#1e3a5f] bg-[#1e3a5f]/5"
                : "border-border hover:border-[#1e3a5f]/40"
            }`}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => onChange(toggleItem(selected, option))}
              className="data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
            />
            <span className="text-sm font-medium leading-snug">{option}</span>
          </label>
        )
      })}
    </div>
  )
}

// ─── Circular score indicator ────────────────────────────────────────────────

interface CircleScoreProps {
  score: number
}

function CircleScore({ score }: CircleScoreProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const color =
    score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626"
  const label =
    score >= 70 ? "Strong" : score >= 40 ? "Developing" : "Early Stage"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium">out of 100</span>
        </div>
      </div>
      <Badge
        className="text-sm px-4 py-1 font-semibold"
        style={{ backgroundColor: color, color: "#fff", border: "none" }}
      >
        {label}
      </Badge>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          placeholder="e.g. Acme Highways Ltd"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sector</Label>
          <Select value={data.sector} onValueChange={(v) => onChange({ sector: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {["Construction", "Highways", "FM", "Cleaning", "IT", "Healthcare", "Professional Services", "Other"].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Number of employees</Label>
          <Select value={data.employees} onValueChange={(v) => onChange({ employees: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {["1-10", "11-25", "26-50", "51-100", "100+"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Annual turnover</Label>
          <Select value={data.turnover} onValueChange={(v) => onChange({ turnover: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {["Under £500k", "£500k-£1m", "£1m-£3m", "£3m-£10m", "£10m+"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Regions covered</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {UK_REGIONS.map((region) => {
            const checked = data.regions.includes(region)
            return (
              <label
                key={region}
                className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-all duration-150 text-sm ${
                  checked ? "border-[#1e3a5f] bg-[#1e3a5f]/5 font-medium" : "border-border hover:border-[#1e3a5f]/40"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onChange({ regions: toggleItem(data.regions, region) })}
                  className="data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
                />
                <span className="leading-tight">{region}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Step2({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select all services your company can deliver. This helps match you to relevant contract opportunities.
      </p>
      <CheckboxGroup
        options={SERVICES}
        selected={data.services}
        onChange={(services) => onChange({ services })}
      />
    </div>
  )
}

function Step3({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-semibold text-[#1e3a5f] flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Insurance held
        </h3>
        <CheckboxGroup
          options={INSURANCE_OPTIONS}
          selected={data.insurance}
          onChange={(insurance) => onChange({ insurance })}
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#1e3a5f] flex items-center gap-2">
          <FileText className="h-4 w-4" /> Policies held
        </h3>
        <CheckboxGroup
          options={POLICY_OPTIONS}
          selected={data.policies}
          onChange={(policies) => onChange({ policies })}
        />
      </div>
    </div>
  )
}

function Step4({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-semibold text-[#1e3a5f]">Accreditations held</h3>
        <CheckboxGroup
          options={ACCREDITATIONS}
          selected={data.accreditations}
          onChange={(accreditations) => onChange({ accreditations })}
          columns={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#1e3a5f]">Previous public sector work</h3>
        <div className="flex gap-3">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange({ previousPublicSector: value })}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all duration-150 ${
                data.previousPublicSector === value
                  ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                  : "border-border hover:border-[#1e3a5f]/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {data.previousPublicSector === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">Which public sector areas have you worked in?</p>
                <CheckboxGroup
                  options={PUBLIC_SECTOR_TYPES}
                  selected={data.publicSectorTypes}
                  onChange={(publicSectorTypes) => onChange({ publicSectorTypes })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#1e3a5f]">Preferred contract value</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONTRACT_VALUE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ preferredContractValue: opt })}
              className={`rounded-lg border py-2 px-3 text-sm font-medium transition-all duration-150 ${
                data.preferredContractValue === opt
                  ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                  : "border-border hover:border-[#1e3a5f]/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step5({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the contract categories you want to pursue. We'll use this to personalise your tender alerts and recommendations.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CONTRACT_CATEGORIES.map((cat) => {
          const selected = data.contractInterests.includes(cat.value)
          const Icon = CATEGORY_ICONS[cat.value] ?? FileText
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange({ contractInterests: toggleItem(data.contractInterests, cat.value) })}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-150 ${
                selected
                  ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-md"
                  : "border-border hover:border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/5"
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </span>
              )}
              <Icon className={`h-6 w-6 ${selected ? "text-white" : "text-[#1e3a5f]"}`} />
              <span className="text-xs font-semibold leading-tight">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step6Results({ data }: { data: FormData }) {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const createCompany = useCreateCompany()
  const { score, missing, bestCategories, recommendations } = calculateScore(data)

  async function handleGoToDashboard() {
    try {
      const turnoverMap: Record<string, number> = {
        "Under £500k": 250_000,
        "£500k-£1m": 750_000,
        "£1m-£3m": 2_000_000,
        "£3m-£10m": 6_500_000,
        "£10m+": 15_000_000,
      }
      const employeeMap: Record<string, number> = {
        "1-10": 5, "11-25": 18, "26-50": 38, "51-100": 75, "100+": 150,
      }
      const contractValueMap: Record<string, string> = {
        "Under £10k": "under-100k",
        "£10k – £50k": "under-100k",
        "£50k – £250k": "under-100k",
        "£250k – £1m": "500k-1m",
        "£1m – £5m": "1m-5m",
        "£5m+": "5m-plus",
      }
      await createCompany.mutateAsync({
        name: data.companyName,
        sector: data.sector,
        services: data.services,
        turnover: turnoverMap[data.turnover] ?? 0,
        employees: employeeMap[data.employees] ?? 0,
        regions: data.regions,
        insurance: data.insurance.map((i) => i.toLowerCase().replace(/[^a-z-]/g, "").replace(/\s+/g, "-")),
        policies: data.policies.map((p) => p.toLowerCase().replace(/[^a-z-]/g, "").replace(/\s+/g, "-")),
        accreditations: data.accreditations.map((a) => a.toLowerCase().replace(/\s+/g, "-")),
        previousPublicSectorWork: data.previousPublicSector === true,
        preferredContractValue: contractValueMap[data.preferredContractValue] ?? "100k-500k",
        interests: data.contractInterests,
        readinessScore: score,
      } as Parameters<typeof createCompany.mutateAsync>[0])
      await refreshUser()
      navigate(ROUTES.dashboard)
    } catch {
      navigate(ROUTES.dashboard)
    }
  }

  return (
    <div className="space-y-8">
      {/* Score reveal */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-muted-foreground mb-2">Your Procurement Readiness Score</p>
        <CircleScore score={score} />
        <motion.p
          className="text-center text-sm text-muted-foreground max-w-xs mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {score >= 70
            ? "You're well-positioned to compete for public sector contracts."
            : score >= 40
            ? "You have a solid foundation — a few improvements will significantly increase your win rate."
            : "You're at the start of your public sector journey. Use the recommendations below to build your readiness."}
        </motion.p>
      </div>

      {/* Missing items */}
      {missing.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2"
        >
          <h3 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" /> Areas to address
          </h3>
          <ul className="space-y-1">
            {missing.map((item) => (
              <li key={item} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Best contract categories */}
      {bestCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-2"
        >
          <h3 className="font-semibold text-[#1e3a5f] text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Best-matched contract categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {bestCategories.map((cat) => (
              <Badge
                key={cat}
                className="bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90 px-3 py-1 text-sm"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="space-y-3"
      >
        <h3 className="font-semibold text-[#1e3a5f] text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" /> Recommended next actions
        </h3>
        <ol className="space-y-3">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-[#1e3a5f]/20 bg-[#1e3a5f]/3 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-white text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-foreground leading-snug">{rec}</p>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <Button
          className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white"
          onClick={handleGoToDashboard}
          disabled={createCompany.isPending}
        >
          {createCompany.isPending
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            : <>Go to Your Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5"
          onClick={() => navigate(ROUTES.readiness)}
        >
          View Readiness Centre
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Step icons for header ────────────────────────────────────────────────────

const STEP_ICONS = [Building2, FileText, ShieldCheck, TrendingUp, Zap, CheckCircle2]

// ─── Main wizard ─────────────────────────────────────────────────────────────

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const totalSteps = STEP_NAMES.length
  const progressPct = ((currentStep + 1) / totalSteps) * 100
  const StepIcon = STEP_ICONS[currentStep]

  function handleChange(updates: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function goNext() {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }

  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Top progress bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>
              Step {currentStep + 1} of {totalSteps} — {STEP_NAMES[currentStep]}
            </span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <Progress value={progressPct} className="h-2 bg-slate-200 [&>div]:bg-[#1e3a5f]" />
        </div>
      </div>

      {/* Wizard card */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl border-0 overflow-hidden">
            {/* Card header */}
            <CardHeader className="bg-[#1e3a5f] text-white px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <StepIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">{STEP_NAMES[currentStep]}</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    {currentStep === 0 && "Tell us about your business"}
                    {currentStep === 1 && "What services do you deliver?"}
                    {currentStep === 2 && "Insurance and company policies"}
                    {currentStep === 3 && "Certifications and track record"}
                    {currentStep === 4 && "Which contract types interest you?"}
                    {currentStep === 5 && "Based on your answers, here's how you score"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-6 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {currentStep === 0 && <Step1 data={formData} onChange={handleChange} />}
                  {currentStep === 1 && <Step2 data={formData} onChange={handleChange} />}
                  {currentStep === 2 && <Step3 data={formData} onChange={handleChange} />}
                  {currentStep === 3 && <Step4 data={formData} onChange={handleChange} />}
                  {currentStep === 4 && <Step5 data={formData} onChange={handleChange} />}
                  {currentStep === 5 && <Step6Results data={formData} />}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* Nav buttons (hidden on results step where CTAs are inline) */}
            {!isLastStep && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-slate-50">
                <Button
                  variant="ghost"
                  onClick={goBack}
                  disabled={currentStep === 0}
                  className="gap-2 text-[#1e3a5f] hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? "w-5 h-2 bg-[#1e3a5f]"
                          : i < currentStep
                          ? "w-2 h-2 bg-[#1e3a5f]/50"
                          : "w-2 h-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={goNext}
                  className="gap-2 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white"
                >
                  {currentStep === totalSteps - 2 ? "See my score" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Skip link */}
          {!isLastStep && (
            <p className="text-center mt-4 text-xs text-muted-foreground">
              Already have an account?{" "}
              <a href={ROUTES.dashboard} className="text-[#1e3a5f] font-medium hover:underline">
                Go to dashboard
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
