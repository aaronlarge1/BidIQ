import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import PublicLayout from "@/components/layout/PublicLayout"
import { RequireAuth, RequireCompany, RedirectIfAuthed } from "@/components/AuthGuard"

const LandingPage           = lazy(() => import("@/pages/landing/LandingPage"))
const AuthPage              = lazy(() => import("@/pages/auth/AuthPage"))
const ReadinessAssessment   = lazy(() => import("@/pages/onboarding/ReadinessAssessment"))
const Dashboard             = lazy(() => import("@/pages/dashboard/Dashboard"))
const TenderDiscovery       = lazy(() => import("@/pages/tenders/TenderDiscovery"))
const OpportunityIntelligence = lazy(() => import("@/pages/tenders/OpportunityIntelligence"))
const ReadinessCentre       = lazy(() => import("@/pages/readiness/ReadinessCentre"))
const ComplianceVault       = lazy(() => import("@/pages/compliance/ComplianceVault"))
const BidWorkspace          = lazy(() => import("@/pages/bids/BidWorkspace"))
const BidPipeline           = lazy(() => import("@/pages/bids/BidPipeline"))
const ContractDelivery      = lazy(() => import("@/pages/delivery/ContractDelivery"))
const EvidenceVault         = lazy(() => import("@/pages/delivery/EvidenceVault"))
const FinanceCentre         = lazy(() => import("@/pages/finance/FinanceCentre"))
const PricingAssistant      = lazy(() => import("@/pages/finance/PricingAssistant"))
const SocialValue           = lazy(() => import("@/pages/social/SocialValue"))
const ConsortiumBuilder     = lazy(() => import("@/pages/consortium/ConsortiumBuilder"))
const BuyerIntelligence     = lazy(() => import("@/pages/intelligence/BuyerIntelligence"))
const MarketIntelligence    = lazy(() => import("@/pages/intelligence/MarketIntelligence"))
const CalendarPage          = lazy(() => import("@/pages/calendar/CalendarPage"))
const ProcurementAcademy    = lazy(() => import("@/pages/academy/ProcurementAcademy"))
const Settings              = lazy(() => import("@/pages/settings/Settings"))

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public landing */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route element={<RedirectIfAuthed />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Route>

        {/* Onboarding — must be logged in but doesn't need a company yet */}
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<ReadinessAssessment />} />
        </Route>

        {/* App routes — must be logged in AND have a company profile */}
        <Route element={<RequireCompany />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenders" element={<TenderDiscovery />} />
            <Route path="/tenders/:id" element={<OpportunityIntelligence />} />
            <Route path="/readiness" element={<ReadinessCentre />} />
            <Route path="/compliance" element={<ComplianceVault />} />
            <Route path="/bids" element={<BidWorkspace />} />
            <Route path="/pipeline" element={<BidPipeline />} />
            <Route path="/delivery" element={<ContractDelivery />} />
            <Route path="/evidence" element={<EvidenceVault />} />
            <Route path="/finance" element={<FinanceCentre />} />
            <Route path="/pricing" element={<PricingAssistant />} />
            <Route path="/social-value" element={<SocialValue />} />
            <Route path="/consortium" element={<ConsortiumBuilder />} />
            <Route path="/buyer-intel" element={<BuyerIntelligence />} />
            <Route path="/market-intel" element={<MarketIntelligence />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/academy" element={<ProcurementAcademy />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
