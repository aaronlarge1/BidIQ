// ─── Company & Onboarding ────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
  sector: string
  services: string[]
  turnover: number
  employees: number
  regions: string[]
  insurance: InsuranceType[]
  policies: PolicyType[]
  accreditations: AccreditationType[]
  previousPublicSectorWork: boolean
  preferredContractValue: ContractValueRange
  interests: ContractCategory[]
  readinessScore: number
}

export type ContractValueRange = "under-100k" | "100k-500k" | "500k-1m" | "1m-5m" | "5m-plus"
export type ContractCategory =
  | "highways" | "construction" | "maintenance" | "facilities" | "cleaning"
  | "waste" | "transport" | "security" | "social-care" | "it"
  | "professional-services" | "nhs" | "education" | "housing"

export type InsuranceType =
  | "public-liability" | "employers-liability" | "professional-indemnity"
  | "product-liability" | "cyber" | "vehicle"

export type PolicyType =
  | "health-safety" | "equal-opportunities" | "environmental"
  | "gdpr-data-protection" | "modern-slavery" | "whistleblowing"
  | "safeguarding" | "social-value"

export type AccreditationType =
  | "iso-9001" | "iso-14001" | "iso-45001" | "iso-27001"
  | "cyber-essentials" | "cyber-essentials-plus" | "safe-contractor"
  | "chas" | "constructionline" | "achilles" | "ssip"

// ─── Readiness ───────────────────────────────────────────────────────────────

export type ReadinessStatus = "green" | "amber" | "red"

export interface ReadinessArea {
  id: string
  name: string
  status: ReadinessStatus
  score: number
  issues: string[]
  actions: string[]
}

export interface ReadinessProfile {
  overall: number
  areas: ReadinessArea[]
  lastChecked: string
  creditScore: number
}

// ─── Tenders ─────────────────────────────────────────────────────────────────

export type TenderStatus = "open" | "closing-soon" | "closed" | "awarded"
export type TenderRecommendation = "recommended" | "maybe" | "not-recommended"
export type TenderType = "contract" | "framework" | "grant" | "meet-the-buyer" | "dynamic-purchasing"

export interface Tender {
  id: string
  title: string
  buyer: string
  buyerType: "local-authority" | "nhs" | "central-government" | "housing" | "education" | "highways"
  location: string
  region: string
  value: number
  valueMax?: number
  deadline: string
  publishedDate: string
  category: ContractCategory
  type: TenderType
  status: TenderStatus
  recommendation: TenderRecommendation
  opportunityScore: number | null
  eligibilityScore: number | null
  smeFlag: boolean
  description: string
  cpvCode?: string
  reference?: string
  socialValueWeighting?: number
  framework?: string
  isDemo?: boolean
  source?: string
  sourceUrl?: string | null
  isHighwaysRelated?: boolean
  isNationalHighways?: boolean
  isInfrastructureRelated?: boolean
  isSMEFriendly?: boolean
  summary?: string | null
  keyRequirements?: string[]
  lastSyncedAt?: string | null
}

export interface OpportunityDetail extends Tender {
  winProbability: number | null
  requiredDocuments: string[]
  missingDocuments: string[]
  insuranceRequired: string[]
  accreditationsRequired: string[]
  socialValueRequirements: string | null
  deliveryRisk: string | null
  financialRisk: string | null
  bidEffort: string | null
  buyerNotes: string | null
  recommendedAction: string | null
  estimatedBidCost: number | null
}

// ─── Bids & Pipeline ─────────────────────────────────────────────────────────

export type BidStage =
  | "identified" | "qualified" | "bid-in-progress"
  | "submitted" | "clarification" | "awarded" | "lost" | "renewal-due"

export interface Bid {
  id: string
  tenderId: string
  tenderTitle: string
  buyer: string
  value: number
  deadline: string
  stage: BidStage
  score?: number
  submittedDate?: string
  awardedDate?: string
  notes: string
  assignedTo: string
  probability: number
  isDemo?: boolean
}

export interface BidQuestion {
  id: string
  section: string
  question: string
  wordLimit?: number
  answer: string
  aiScore?: number
  suggestions: string[]
  status: "draft" | "in-review" | "approved"
}

// ─── Contract Delivery ───────────────────────────────────────────────────────

export interface Contract {
  id: string
  title: string
  buyer: string
  value: number
  startDate: string
  endDate: string
  renewalDate: string
  milestones: Milestone[]
  kpis: KPI[]
  paymentSchedule: Payment[]
  risks: Risk[]
  isDemo?: boolean
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  status: "pending" | "in-progress" | "complete" | "overdue"
  value?: number
}

export interface KPI {
  id: string
  name: string
  target: number
  current: number
  unit: string
  status: "green" | "amber" | "red"
}

export interface Payment {
  id: string
  description: string
  amount: number
  dueDate: string
  status: "pending" | "invoiced" | "paid"
}

export interface Risk {
  id: string
  description: string
  likelihood: "low" | "medium" | "high"
  impact: "low" | "medium" | "high"
  mitigation: string
}

// ─── Documents ───────────────────────────────────────────────────────────────

export interface Document {
  id: string
  name: string
  category: DocumentCategory
  uploadedDate: string
  expiryDate?: string
  status: "valid" | "expiring-soon" | "expired" | "missing"
  url?: string
  isDemo?: boolean
}

export type DocumentCategory =
  | "insurance" | "policy" | "certification" | "financial"
  | "reference" | "case-study" | "method-statement"
  | "risk-assessment" | "social-value" | "esg" | "highways"

// ─── Evidence ────────────────────────────────────────────────────────────────

export interface Evidence {
  id: string
  title: string
  contractId?: string
  type: "photo" | "kpi-report" | "testimonial" | "completion-report" | "case-study"
  date: string
  description: string
  isDemo?: boolean
}

// ─── Finance ─────────────────────────────────────────────────────────────────

export interface PricingCalc {
  labour: number
  materials: number
  overheads: number
  riskAllowance: number
  desiredMargin: number
  suggestedPrice?: number
  expectedProfit?: number
  riskAdjustedMargin?: number
  isUnderpriced?: boolean
}

// ─── Partners / Consortium ───────────────────────────────────────────────────

export interface Partner {
  id: string
  name: string
  sector: string
  capabilities: string[]
  region: string
  accreditations: AccreditationType[]
  turnover: number
  combinedScore?: number
  isDemo?: boolean
}

// ─── Buyer Intelligence ──────────────────────────────────────────────────────

export interface Buyer {
  id: string
  name: string
  type: "local-authority" | "nhs" | "central-government" | "housing" | "education" | "highways"
  region: string
  annualSpend: number
  previousAwards: PreviousAward[]
  upcomingRenewals: string[]
  knownSuppliers: string[]
  nextTenderExpected?: string
  isDemo?: boolean
}

export interface PreviousAward {
  title: string
  supplier: string
  value: number
  awardedDate: string
  renewalDate: string
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "deadline" | "framework-opening" | "doc-expiry" | "renewal" | "meet-the-buyer" | "grant"
  tenderId?: string
  documentId?: string
  isDemo?: boolean
}

// ─── Dashboard Summary ───────────────────────────────────────────────────────

export interface DashboardStats {
  readinessScore: number
  matchedOpportunities: number
  activeBids: number
  upcomingDeadlines: number
  complianceGaps: number
  pipelineValue: number
  estimatedWinRate: number
  renewalsDue: number
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  path: string
  icon: string
  group?: string
}
