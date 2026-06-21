import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { api, setToken } from "@/lib/api"
import type {
  Company, Tender, Bid, BidQuestion, Contract, Document, Evidence,
  Partner, Buyer, CalendarEvent, DashboardStats, ReadinessProfile,
  PricingCalc,
} from "@/types"

// ── Keys ──────────────────────────────────────────────────────────────────────

export const QK = {
  dashboard: ["dashboard"] as const,
  company: ["company"] as const,
  readiness: ["readiness"] as const,
  tenders: (params?: Record<string, string>) => ["tenders", params] as const,
  tender: (id: string) => ["tenders", id] as const,
  bids: ["bids"] as const,
  bid: (id: string) => ["bids", id] as const,
  bidQuestions: (bidId: string) => ["bids", bidId, "questions"] as const,
  contracts: ["contracts"] as const,
  contract: (id: string) => ["contracts", id] as const,
  documents: (params?: Record<string, string>) => ["documents", params] as const,
  evidence: ["evidence"] as const,
  partners: ["partners"] as const,
  buyers: (params?: Record<string, string>) => ["buyers", params] as const,
  buyer: (id: string) => ["buyers", id] as const,
  calendar: (params?: Record<string, string>) => ["calendar", params] as const,
  socialValue: ["social-value"] as const,
  marketIntel: ["market-intel"] as const,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toQuery(params?: Record<string, string | undefined>): string {
  if (!params) return ""
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string>
  ).toString()
  return q ? `?${q}` : ""
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: QK.dashboard,
    queryFn: () => api.get<DashboardStats>("/api/dashboard/stats"),
  })
}

// ── Company ───────────────────────────────────────────────────────────────────

export function useCompany() {
  return useQuery({
    queryKey: QK.company,
    queryFn: () => api.get<Company>("/api/company"),
    retry: false,
  })
}

export function useCreateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Company>) =>
      api.post<{ company: Company; token: string }>("/api/company", data),
    onSuccess: (result) => {
      setToken(result.token)
      qc.setQueryData(QK.company, result.company)
    },
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Company>) => api.put<Company>("/api/company", data),
    onSuccess: (company) => qc.setQueryData(QK.company, company),
  })
}

// ── Readiness ─────────────────────────────────────────────────────────────────

export function useReadiness() {
  return useQuery({
    queryKey: QK.readiness,
    queryFn: () => api.get<ReadinessProfile>("/api/readiness"),
  })
}

export function useUpdateReadiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { overall?: number; creditScore?: number }) =>
      api.put<ReadinessProfile>("/api/readiness", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.readiness }),
  })
}

export function useUpdateReadinessArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ areaId, data }: { areaId: string; data: { status?: string; score?: number; issues?: string[]; actions?: string[] } }) =>
      api.put(`/api/readiness/areas/${areaId}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.readiness }),
  })
}

// ── Tenders ───────────────────────────────────────────────────────────────────

interface TenderListResponse {
  tenders: Tender[]
  total: number
  page: number
  limit: number
}

interface TenderFilters {
  status?: string
  category?: string
  region?: string
  recommendation?: string
  search?: string
  page?: string
  limit?: string
}

export function useTenders(filters?: TenderFilters) {
  return useQuery({
    queryKey: QK.tenders(filters as Record<string, string>),
    queryFn: () =>
      api.get<TenderListResponse>(`/api/tenders${toQuery(filters as Record<string, string>)}`),
  })
}

export function useTender(id: string, options?: UseQueryOptions<Tender>) {
  return useQuery({
    queryKey: QK.tender(id),
    queryFn: () => api.get<Tender>(`/api/tenders/${id}`),
    enabled: !!id,
    ...options,
  })
}

// ── Bids ──────────────────────────────────────────────────────────────────────

export function useBids() {
  return useQuery({
    queryKey: QK.bids,
    queryFn: () => api.get<Bid[]>("/api/bids"),
  })
}

export function useBid(id: string) {
  return useQuery({
    queryKey: QK.bid(id),
    queryFn: () => api.get<Bid & { questions: BidQuestion[] }>(`/api/bids/${id}`),
    enabled: !!id,
  })
}

export function useCreateBid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Bid, "id" | "isDemo">) => api.post<Bid>("/api/bids", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.bids }),
  })
}

export function useUpdateBid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bid> }) =>
      api.put<Bid>(`/api/bids/${id}`, data),
    onSuccess: (bid) => {
      qc.setQueryData(QK.bid(bid.id), (old: Bid & { questions: BidQuestion[] }) =>
        old ? { ...old, ...bid } : bid
      )
      qc.invalidateQueries({ queryKey: QK.bids })
    },
  })
}

export function useDeleteBid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/bids/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.bids }),
  })
}

// ── Bid Questions ─────────────────────────────────────────────────────────────

export function useBidQuestions(bidId: string) {
  return useQuery({
    queryKey: QK.bidQuestions(bidId),
    queryFn: () => api.get<BidQuestion[]>(`/api/bids/${bidId}/questions`),
    enabled: !!bidId,
  })
}

export function useCreateBidQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bidId, data }: { bidId: string; data: Omit<BidQuestion, "id"> }) =>
      api.post<BidQuestion>(`/api/bids/${bidId}/questions`, data),
    onSuccess: (_q, { bidId }) => qc.invalidateQueries({ queryKey: QK.bidQuestions(bidId) }),
  })
}

export function useUpdateBidQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bidId, questionId, data }: { bidId: string; questionId: string; data: Partial<BidQuestion> }) =>
      api.put<BidQuestion>(`/api/bids/${bidId}/questions/${questionId}`, data),
    onSuccess: (_q, { bidId }) => qc.invalidateQueries({ queryKey: QK.bidQuestions(bidId) }),
  })
}

// ── Contracts ─────────────────────────────────────────────────────────────────

export function useContracts() {
  return useQuery({
    queryKey: QK.contracts,
    queryFn: () => api.get<Contract[]>("/api/contracts"),
  })
}

export function useContract(id: string) {
  return useQuery({
    queryKey: QK.contract(id),
    queryFn: () => api.get<Contract>(`/api/contracts/${id}`),
    enabled: !!id,
  })
}

export function useCreateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Contract, "id" | "isDemo">) => api.post<Contract>("/api/contracts", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.contracts }),
  })
}

export function useUpdateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) =>
      api.put<Contract>(`/api/contracts/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.contracts }),
  })
}

export function useUpdateMilestone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, milestoneId, status }: { contractId: string; milestoneId: string; status: string }) =>
      api.put(`/api/contracts/${contractId}/milestones/${milestoneId}`, { status }),
    onSuccess: (_r, { contractId }) => qc.invalidateQueries({ queryKey: QK.contract(contractId) }),
  })
}

export function useUpdateKPI() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, kpiId, current, status }: { contractId: string; kpiId: string; current?: number; status?: string }) =>
      api.put(`/api/contracts/${contractId}/kpis/${kpiId}`, { current, status }),
    onSuccess: (_r, { contractId }) => qc.invalidateQueries({ queryKey: QK.contract(contractId) }),
  })
}

export function useUpdatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, paymentId, status }: { contractId: string; paymentId: string; status: string }) =>
      api.put(`/api/contracts/${contractId}/payments/${paymentId}`, { status }),
    onSuccess: (_r, { contractId }) => qc.invalidateQueries({ queryKey: QK.contract(contractId) }),
  })
}

// ── Documents ─────────────────────────────────────────────────────────────────

export function useDocuments(filters?: { category?: string; status?: string }) {
  return useQuery({
    queryKey: QK.documents(filters as Record<string, string>),
    queryFn: () => api.get<Document[]>(`/api/documents${toQuery(filters as Record<string, string>)}`),
  })
}

export function useCreateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Document, "id" | "isDemo" | "uploadedDate">) =>
      api.post<Document>("/api/documents", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  })
}

export function useUpdateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
      api.put<Document>(`/api/documents/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  })
}

export function useDeleteDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  })
}

// ── Evidence ──────────────────────────────────────────────────────────────────

export function useEvidence() {
  return useQuery({
    queryKey: QK.evidence,
    queryFn: () => api.get<Evidence[]>("/api/evidence"),
  })
}

export function useCreateEvidence() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Evidence, "id" | "isDemo">) => api.post<Evidence>("/api/evidence", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.evidence }),
  })
}

export function useDeleteEvidence() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/evidence/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.evidence }),
  })
}

// ── Partners ──────────────────────────────────────────────────────────────────

export function usePartners() {
  return useQuery({
    queryKey: QK.partners,
    queryFn: () => api.get<Partner[]>("/api/partners"),
  })
}

export function useCreatePartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Partner, "id" | "isDemo">) => api.post<Partner>("/api/partners", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.partners }),
  })
}

export function useDeletePartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/partners/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.partners }),
  })
}

// ── Buyers ────────────────────────────────────────────────────────────────────

export function useBuyers(filters?: { type?: string; region?: string; search?: string }) {
  return useQuery({
    queryKey: QK.buyers(filters as Record<string, string>),
    queryFn: () => api.get<Buyer[]>(`/api/buyers${toQuery(filters as Record<string, string>)}`),
  })
}

export function useBuyer(id: string) {
  return useQuery({
    queryKey: QK.buyer(id),
    queryFn: () => api.get<Buyer>(`/api/buyers/${id}`),
    enabled: !!id,
  })
}

// ── Calendar ──────────────────────────────────────────────────────────────────

export function useCalendarEvents(filters?: { from?: string; to?: string; type?: string }) {
  return useQuery({
    queryKey: QK.calendar(filters as Record<string, string>),
    queryFn: () => api.get<CalendarEvent[]>(`/api/calendar${toQuery(filters as Record<string, string>)}`),
  })
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, "id" | "isDemo">) =>
      api.post<CalendarEvent>("/api/calendar", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  })
}

export function useDeleteCalendarEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/calendar/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  })
}

// ── Finance / Pricing ─────────────────────────────────────────────────────────

export function useCalculatePricing() {
  return useMutation({
    mutationFn: (data: Pick<PricingCalc, "labour" | "materials" | "overheads" | "riskAllowance" | "desiredMargin">) =>
      api.post<Required<PricingCalc>>("/api/finance/pricing/calculate", data),
  })
}

// ── Social Value ──────────────────────────────────────────────────────────────

interface SocialValueActivity {
  id: string
  companyId: string
  type: string
  description: string
  date: string
  value?: number
  unit?: string
  contractId?: string
}

interface SocialValueResponse {
  activities: SocialValueActivity[]
  summary: { type: string; _count: { id: number }; _sum: { value: number | null } }[]
}

export function useSocialValue() {
  return useQuery({
    queryKey: QK.socialValue,
    queryFn: () => api.get<SocialValueResponse>("/api/social-value"),
  })
}

export function useCreateSocialValueActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<SocialValueActivity, "id" | "companyId">) =>
      api.post<SocialValueActivity>("/api/social-value", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.socialValue }),
  })
}

export function useDeleteSocialValueActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/social-value/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.socialValue }),
  })
}

// ── Market Intelligence ───────────────────────────────────────────────────────

interface MarketIntelData {
  overview: {
    totalActiveOpportunities: number
    totalMarketValue: number
    averageContractValue: number
    openTenders: number
    closingSoon: number
  }
  byCategory: { category: string; count: number; totalValue: number }[]
  byBuyerType: { type: string; count: number; totalValue: number }[]
  byRegion: { region: string; count: number; totalValue: number }[]
}

export function useMarketIntel() {
  return useQuery({
    queryKey: QK.marketIntel,
    queryFn: () => api.get<MarketIntelData>("/api/market-intel"),
    staleTime: 5 * 60 * 1000,
  })
}

// ── AI Assist ─────────────────────────────────────────────────────────────────

interface AiScoreResult {
  score: number
  scoreLabel: string
  strengths: string[]
  improvements: string[]
  rewrittenOpening: string
}

interface AiMatchResult {
  opportunityScore: number
  eligibilityScore: number
  recommendation: string
  reasons: string[]
  gaps: string[]
  winProbability: number
  estimatedBidCost: number
}

export function useAiScoreAnswer() {
  return useMutation({
    mutationFn: (data: { question: string; answer: string; wordLimit?: number; tenderTitle?: string; buyerType?: string }) =>
      api.post<AiScoreResult>("/api/ai/score-answer", data),
  })
}

export function useAiGenerateAnswer() {
  return useMutation({
    mutationFn: (data: { question: string; wordLimit?: number; tenderTitle?: string; buyerType?: string; bidId?: string }) =>
      api.post<{ answer: string }>("/api/ai/generate-answer", data),
  })
}

export function useAiMatchScore() {
  return useMutation({
    mutationFn: (tenderId: string) => api.post<AiMatchResult>("/api/ai/match-score", { tenderId }),
  })
}
