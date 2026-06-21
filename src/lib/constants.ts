export const APP_NAME = "BidIQ Pro"
export const TAGLINE = "The AI Procurement Operating System for SMEs"
export const COMPANY = "Civic Ladder Ltd"

export const ROUTES = {
  home: "/",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  tenders: "/tenders",
  tender: (id: string) => `/tenders/${id}`,
  readiness: "/readiness",
  compliance: "/compliance",
  bids: "/bids",
  pipeline: "/pipeline",
  delivery: "/delivery",
  evidence: "/evidence",
  finance: "/finance",
  pricing: "/pricing",
  socialValue: "/social-value",
  consortium: "/consortium",
  buyerIntel: "/buyer-intel",
  marketIntel: "/market-intel",
  calendar: "/calendar",
  academy: "/academy",
  settings: "/settings",
}

export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: ROUTES.dashboard, icon: "LayoutDashboard" },
      { label: "Calendar", path: ROUTES.calendar, icon: "Calendar" },
    ]
  },
  {
    label: "Opportunities",
    items: [
      { label: "Find Tenders", path: ROUTES.tenders, icon: "Search" },
      { label: "Bid Pipeline", path: ROUTES.pipeline, icon: "Kanban" },
    ]
  },
  {
    label: "Bid & Win",
    items: [
      { label: "AI Bid Workspace", path: ROUTES.bids, icon: "FileEdit" },
      { label: "Procurement Readiness", path: ROUTES.readiness, icon: "ShieldCheck" },
      { label: "Compliance Vault", path: ROUTES.compliance, icon: "FolderLock" },
    ]
  },
  {
    label: "Deliver & Grow",
    items: [
      { label: "Contract Delivery", path: ROUTES.delivery, icon: "ClipboardCheck" },
      { label: "Evidence Vault", path: ROUTES.evidence, icon: "Archive" },
      { label: "Social Value & ESG", path: ROUTES.socialValue, icon: "Leaf" },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { label: "Buyer Intelligence", path: ROUTES.buyerIntel, icon: "Building2" },
      { label: "Market Intelligence", path: ROUTES.marketIntel, icon: "TrendingUp" },
      { label: "Consortium Builder", path: ROUTES.consortium, icon: "Users" },
    ]
  },
  {
    label: "Finance",
    items: [
      { label: "Finance Centre", path: ROUTES.finance, icon: "PoundSterling" },
      { label: "AI Pricing", path: ROUTES.pricing, icon: "Calculator" },
    ]
  },
  {
    label: "Learn",
    items: [
      { label: "Procurement Academy", path: ROUTES.academy, icon: "GraduationCap" },
    ]
  },
  {
    label: "Account",
    items: [
      { label: "Settings", path: ROUTES.settings, icon: "Settings" },
    ]
  },
]

export const CONTRACT_CATEGORIES = [
  { value: "highways", label: "Highways & Roads" },
  { value: "construction", label: "Construction" },
  { value: "maintenance", label: "Maintenance & Repair" },
  { value: "facilities", label: "Facilities Management" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "waste", label: "Waste Management" },
  { value: "transport", label: "Transport" },
  { value: "security", label: "Security" },
  { value: "social-care", label: "Social Care" },
  { value: "it", label: "IT & Digital" },
  { value: "professional-services", label: "Professional Services" },
  { value: "nhs", label: "NHS / Health" },
  { value: "education", label: "Education" },
  { value: "housing", label: "Housing" },
]

export const UK_REGIONS = [
  "North West", "North East", "Yorkshire & Humber", "East Midlands",
  "West Midlands", "East of England", "Greater London", "South East",
  "South West", "Wales", "Scotland", "Northern Ireland"
]

export const PRICING = [
  {
    name: "Starter",
    price: 49,
    period: "month",
    features: [
      "10 tender alerts/month",
      "Readiness assessment",
      "Compliance vault (5 docs)",
      "AI bid assistant (5 questions/month)",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 149,
    period: "month",
    features: [
      "Unlimited tender alerts",
      "Full readiness centre",
      "Compliance vault (unlimited)",
      "AI bid workspace",
      "Pipeline CRM",
      "Buyer intelligence",
      "Finance tools",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: 349,
    period: "month",
    features: [
      "Everything in Growth",
      "Contract delivery hub",
      "Evidence vault",
      "Market intelligence",
      "Consortium builder",
      "Social value generator",
      "Procurement academy",
      "Dedicated account manager",
      "Custom branding",
    ],
    cta: "Book Demo",
    highlighted: false,
  },
]
