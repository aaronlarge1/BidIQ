import { useState } from "react"
import { Upload, FileText, AlertTriangle, CheckCircle2, XCircle, Clock, Plus, Download, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDocuments } from "@/hooks/useApi"
import { formatDate, cn } from "@/lib/utils"
import type { Document, DocumentCategory } from "@/types"

const categoryLabel = (cat: DocumentCategory): string => {
  const labels: Record<DocumentCategory, string> = {
    insurance: "Insurance",
    policy: "Policy",
    certification: "Certification",
    financial: "Financial",
    reference: "Reference",
    "case-study": "Case Study",
    "method-statement": "Method Statement",
    "risk-assessment": "Risk Assessment",
    "social-value": "Social Value",
    esg: "ESG",
    highways: "Highways",
  }
  return labels[cat] ?? cat
}

const statusConfig = {
  valid: { label: "Valid", class: "bg-green-100 text-green-800 border-green-200" },
  "expiring-soon": { label: "Expiring Soon", class: "bg-amber-100 text-amber-800 border-amber-200" },
  expired: { label: "Expired", class: "bg-red-100 text-red-800 border-red-200" },
  missing: { label: "Missing", class: "bg-slate-100 text-slate-600 border-slate-200" },
}

const rowBg = (status: Document["status"]) => {
  if (status === "expired") return "bg-red-50"
  if (status === "expiring-soon") return "bg-amber-50"
  if (status === "missing") return "bg-slate-50"
  return ""
}

export default function ComplianceVault() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [docName, setDocName] = useState("")

  const { data: documents = [] } = useDocuments()

  const filteredDocs =
    activeTab === "all"
      ? documents
      : documents.filter((d) => d.category === activeTab)

  const validCount = documents.filter((d) => d.status === "valid").length
  const expiredCount = documents.filter((d) => d.status === "expired").length
  const expiringSoonCount = documents.filter((d) => d.status === "expiring-soon").length
  const missingCount = documents.filter((d) => d.status === "missing").length
  const totalCount = documents.length
  const compliancePercent = totalCount > 0 ? Math.round((validCount / totalCount) * 100) : 0

  const docsWithExpiry = documents.filter((d) => d.expiryDate).sort(
    (a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
  )

  const StatusIcon = ({ status }: { status: Document["status"] }) => {
    if (status === "valid") return <CheckCircle2 className="h-3.5 w-3.5" />
    if (status === "expiring-soon") return <Clock className="h-3.5 w-3.5" />
    if (status === "expired") return <XCircle className="h-3.5 w-3.5" />
    return <AlertTriangle className="h-3.5 w-3.5" />
  }

  const categoryOptions: DocumentCategory[] = [
    "insurance",
    "policy",
    "certification",
    "financial",
    "reference",
    "case-study",
    "method-statement",
    "risk-assessment",
    "social-value",
    "esg",
    "highways",
  ]

  const tabKeys = ["all", "insurance", "policy", "certification", "financial", "reference", "case-study", "highways"]

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Compliance Vault</h1>
          </div>
          <p className="text-sm text-slate-500">
            Manage and monitor your compliance documents, certifications, and policies.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-xl font-bold text-green-700">{validCount}</p>
            <p className="text-xs text-green-600">Valid</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <XCircle className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-xl font-bold text-red-700">{expiredCount}</p>
            <p className="text-xs text-red-600">Expired</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <Clock className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-xl font-bold text-amber-700">{expiringSoonCount}</p>
            <p className="text-xs text-amber-600">Expiring Soon</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-slate-500" />
          <div>
            <p className="text-xl font-bold text-slate-700">{missingCount}</p>
            <p className="text-xs text-slate-500">Missing</p>
          </div>
        </div>
      </div>

      {/* HEALTH PROGRESS BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Overall Compliance Health</span>
          <span className="font-semibold text-slate-900">{compliancePercent}% Compliant</span>
        </div>
        <Progress value={compliancePercent} className="h-2.5" />
        <p className="text-xs text-slate-400">
          {validCount} of {totalCount} required documents are valid
        </p>
      </div>

      <Separator />

      {/* ALERT BANNERS */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="flex-1 text-sm text-red-800">
            <span className="font-semibold">GDPR Policy EXPIRED</span> — This is blocking NHS and local authority
            contracts. Update immediately.
          </p>
          <Button size="sm" variant="destructive" className="shrink-0">
            Fix Now
          </Button>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm text-amber-800">
            <span className="font-semibold">Professional Indemnity Insurance expiring 31 Dec 2026</span> — 193 days
            remaining.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100"
          >
            Set Reminder
          </Button>
        </div>
      </div>

      {/* TABS + DOCUMENT TABLE */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1 bg-slate-100 p-1">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="insurance" className="text-xs">Insurance</TabsTrigger>
          <TabsTrigger value="policy" className="text-xs">Policies</TabsTrigger>
          <TabsTrigger value="certification" className="text-xs">Certifications</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
          <TabsTrigger value="reference" className="text-xs">References</TabsTrigger>
          <TabsTrigger value="case-study" className="text-xs">Case Studies</TabsTrigger>
          <TabsTrigger value="highways" className="text-xs">Highways</TabsTrigger>
        </TabsList>

        {tabKeys.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Document Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700">Uploaded</TableHead>
                      <TableHead className="font-semibold text-slate-700">Expires</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-400">
                          {documents.length === 0
                            ? "No compliance documents yet — upload your certificates, policies and accreditations"
                            : "No documents in this category."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocs.map((doc) => (
                        <TableRow key={doc.id} className={cn(rowBg(doc.status))}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="font-medium text-slate-800">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs font-normal text-slate-600">
                              {categoryLabel(doc.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {formatDate(doc.uploadedDate)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {doc.expiryDate ? (
                              <span
                                className={cn(
                                  doc.status === "expired" && "font-medium text-red-600",
                                  doc.status === "expiring-soon" && "font-medium text-amber-600",
                                  doc.status !== "expired" &&
                                    doc.status !== "expiring-soon" &&
                                    "text-slate-600"
                                )}
                              >
                                {formatDate(doc.expiryDate)}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "flex w-fit items-center gap-1 text-xs",
                                statusConfig[doc.status].class
                              )}
                            >
                              <StatusIcon status={doc.status} />
                              {statusConfig[doc.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-slate-800"
                                title="View document"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-slate-800"
                                title="Download document"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-red-600"
                                title="Delete document"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* UPLOAD SECTION */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-800">Upload New Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-slate-400 hover:bg-slate-50">
                  <Upload className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">
                    Drag &amp; drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF, DOCX, XLSX, JPG, PNG — max 10MB
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {categoryLabel(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Document name…"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-1.5 h-4 w-4" />
                    Upload Document
                  </Button>
                  <p className="text-xs text-slate-400">PDF, DOCX, XLSX, JPG, PNG — max 10MB</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* MISSING DOCUMENTS PANEL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Required Documents — Action Needed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-800">Cyber Essentials Certification</p>
              <p className="text-xs text-slate-500">Required for public sector IT contracts</p>
              <p className="text-xs text-slate-400">Est. time to obtain: 2–4 weeks</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              Apply Online →
            </Button>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-800">GDPR Policy (Updated 2024+)</p>
              <p className="text-xs text-slate-500">Required for health &amp; local authority contracts</p>
              <p className="text-xs text-slate-400">Est. time to obtain: 2–3 hours</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              Download Template
            </Button>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-800">ISO 9001 Certificate</p>
              <p className="text-xs text-slate-500">Recommended for framework agreements</p>
              <p className="text-xs text-slate-400">Est. time to obtain: 3–6 months</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EXPIRY TIMELINE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Clock className="h-4 w-4 text-slate-500" />
            Expiry Timeline — Next 12 Months
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docsWithExpiry.length === 0 ? (
            <p className="text-sm text-slate-400">No documents with expiry dates.</p>
          ) : (
            docsWithExpiry.map((doc) => {
              const daysUntil = Math.ceil(
                (new Date(doc.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              const isExpired = daysUntil < 0
              const isImminent = daysUntil >= 0 && daysUntil <= 90
              const borderColor = isExpired
                ? "border-red-500"
                : isImminent
                ? "border-amber-500"
                : "border-green-500"
              const labelColor = isExpired
                ? "text-red-600 font-semibold"
                : isImminent
                ? "text-amber-600"
                : "text-green-600"

              return (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-4 rounded-md border-l-4 bg-slate-50 py-2.5 pl-3 pr-4",
                    borderColor
                  )}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(doc.expiryDate!)}</p>
                  </div>
                  <span className={cn("text-xs", labelColor)}>
                    {isExpired ? "EXPIRED" : `${daysUntil} days remaining`}
                  </span>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* UPLOAD DIALOG */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Upload Simulated
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-slate-600">
              In production, your document would be securely uploaded and scanned for compliance
              verification. All files are encrypted at rest and access-controlled by role.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setUploadDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
