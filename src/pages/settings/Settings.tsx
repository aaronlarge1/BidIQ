import { useState, useEffect } from "react"
import {
  Building2, User, Bell, CreditCard, Palette, Download,
  Plus, Trash2, Save,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCompany, useUpdateCompany } from "@/hooks/useApi"
import { PRICING } from "@/lib/constants"

// ─── Simple inline toggle (no Switch component available) ────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30 focus:ring-offset-2",
          checked ? "bg-[#1e3055]" : "bg-gray-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  )
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Admin: "Full access to all features, billing and user management.",
  "Bid Manager": "Can create and manage bids, tenders and compliance documents.",
  Viewer: "Read-only access to all sections. Cannot create or edit.",
}

// ─── Notification preferences ────────────────────────────────────────────────

type NotifPref = { id: string; label: string; description: string; default: boolean }

const NOTIF_PREFS: NotifPref[] = [
  { id: "n-new-tenders", label: "New matched tenders", description: "Alerts when new tenders match your company profile.", default: true },
  { id: "n-bid-deadline", label: "Bid deadline reminders", description: "7 days, 3 days and 1 day before each deadline.", default: true },
  { id: "n-doc-expiry", label: "Document expiry alerts", description: "90 days, 30 days and 7 days before document expiry.", default: true },
  { id: "n-renewal", label: "Contract renewal reminders", description: "Notified when contract renewal windows open.", default: true },
  { id: "n-framework", label: "Framework opening alerts", description: "Notifications when frameworks you follow reopen.", default: true },
  { id: "n-digest", label: "Weekly pipeline digest", description: "A summary email of your pipeline every Monday morning.", default: false },
  { id: "n-market", label: "Market intelligence updates", description: "News and intelligence relevant to your sectors.", default: false },
]

// ─── Export options ───────────────────────────────────────────────────────────

const EXPORT_OPTIONS = [
  { label: "Export bids (CSV)", icon: <Download className="h-4 w-4" /> },
  { label: "Export compliance data (CSV)", icon: <Download className="h-4 w-4" /> },
  { label: "Export evidence vault (ZIP)", icon: <Download className="h-4 w-4" /> },
  { label: "Export pipeline (CSV)", icon: <Download className="h-4 w-4" /> },
]

// ─── Settings ─────────────────────────────────────────────────────────────────

export default function Settings() {
  const { data: companyData, isLoading: companyLoading } = useCompany()
  const updateCompany = useUpdateCompany()

  const [company, setCompany] = useState({
    name: "",
    companyNumber: "",
    vatNumber: "",
    website: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    sector: "",
    size: "26-50 employees",
    turnover: "",
  })

  useEffect(() => {
    if (companyData) {
      setCompany(prev => ({
        ...prev,
        name: companyData.name ?? prev.name,
        sector: companyData.sector ?? prev.sector,
      }))
    }
  }, [companyData])

  // Notification toggles
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((p) => [p.id, p.default])),
  )

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [showDeleteInput, setShowDeleteInput] = useState(false)

  const handleCompanyChange = (field: keyof typeof company, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }))
  }

  const growthPlan = PRICING.find((p) => p.name === "Growth")!
  const proPlan = PRICING.find((p) => p.name === "Pro")!

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, company profile, users and billing
          </p>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────────── */}
        <Tabs defaultValue="company">
          <TabsList className="mb-6 h-10 w-full justify-start rounded-lg bg-gray-100 p-1 overflow-x-auto">
            <TabsTrigger value="company" className="gap-1.5 rounded-md px-3 text-xs">
              <Building2 className="h-3.5 w-3.5" />
              Company Profile
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 rounded-md px-3 text-xs">
              <User className="h-3.5 w-3.5" />
              Users &amp; Roles
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 rounded-md px-3 text-xs">
              <Bell className="h-3.5 w-3.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5 rounded-md px-3 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 rounded-md px-3 text-xs">
              <Download className="h-3.5 w-3.5" />
              Data &amp; Export
            </TabsTrigger>
          </TabsList>

          {/* ══ TAB 1: COMPANY PROFILE ══════════════════════════════════════ */}
          <TabsContent value="company" className="mt-0">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Company Profile
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  This information is used to match you with relevant tenders and pre-fill bid submissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company identity */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Company Identity
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium text-gray-700">Company Name</Label>
                      <Input
                        className="mt-1"
                        value={company.name}
                        onChange={(e) => handleCompanyChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">
                        Registered Company Number
                      </Label>
                      <Input
                        className="mt-1"
                        value={company.companyNumber}
                        onChange={(e) => handleCompanyChange("companyNumber", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">VAT Number</Label>
                      <Input
                        className="mt-1"
                        value={company.vatNumber}
                        onChange={(e) => handleCompanyChange("vatNumber", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium text-gray-700">Website</Label>
                      <Input
                        className="mt-1"
                        value={company.website}
                        onChange={(e) => handleCompanyChange("website", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registered Address
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium text-gray-700">Address Line 1</Label>
                      <Input
                        className="mt-1"
                        value={company.address1}
                        onChange={(e) => handleCompanyChange("address1", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium text-gray-700">Address Line 2</Label>
                      <Input
                        className="mt-1"
                        value={company.address2}
                        onChange={(e) => handleCompanyChange("address2", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">City</Label>
                      <Input
                        className="mt-1"
                        value={company.city}
                        onChange={(e) => handleCompanyChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Postcode</Label>
                      <Input
                        className="mt-1"
                        value={company.postcode}
                        onChange={(e) => handleCompanyChange("postcode", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Business profile */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Business Profile
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Primary Sector</Label>
                      <Select value={company.sector} onValueChange={(v) => handleCompanyChange("sector", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Construction & Highways">Construction &amp; Highways</SelectItem>
                          <SelectItem value="Facilities Management">Facilities Management</SelectItem>
                          <SelectItem value="IT & Digital">IT &amp; Digital</SelectItem>
                          <SelectItem value="Professional Services">Professional Services</SelectItem>
                          <SelectItem value="Cleaning Services">Cleaning Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Company Size</Label>
                      <Select value={company.size} onValueChange={(v) => handleCompanyChange("size", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10 employees">1–10 employees</SelectItem>
                          <SelectItem value="11-25 employees">11–25 employees</SelectItem>
                          <SelectItem value="26-50 employees">26–50 employees</SelectItem>
                          <SelectItem value="51-100 employees">51–100 employees</SelectItem>
                          <SelectItem value="100+ employees">100+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Annual Turnover</Label>
                      <Input
                        className="mt-1"
                        value={company.turnover}
                        onChange={(e) => handleCompanyChange("turnover", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Save */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  {updateCompany.isSuccess && (
                    <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      Changes saved successfully.
                    </p>
                  )}
                  {updateCompany.isError && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      Failed to save. Please try again.
                    </p>
                  )}
                  <Button
                    onClick={() => updateCompany.mutate({ name: company.name, sector: company.sector })}
                    disabled={updateCompany.isPending || companyLoading}
                    className="gap-2 bg-[#1e3055] text-white hover:bg-[#162540]"
                  >
                    <Save className="h-4 w-4" />
                    {updateCompany.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 2: USERS & ROLES ════════════════════════════════════════ */}
          <TabsContent value="users" className="mt-0 space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Users &amp; Roles
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage team members and their access levels.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-[#1e3055] text-white hover:bg-[#162540] text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent>
                {/* User table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {companyData ? (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3055] text-xs font-bold text-white">
                                {companyData.name ? companyData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "?"}
                              </div>
                              <span className="font-medium text-gray-900">{companyData.name ?? "Account owner"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{companyData.name ?? "—"}</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-[#1e3055] text-white text-xs">Admin</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled>
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-xs text-gray-400">
                            {companyLoading ? "Loading…" : "No account data found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Roles explained */}
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role Permissions
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {Object.entries(ROLE_DESCRIPTIONS).map(([role, desc]) => (
                      <div
                        key={role}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <Badge
                          className={
                            role === "Admin"
                              ? "bg-[#1e3055] text-white text-xs mb-2"
                              : role === "Bid Manager"
                              ? "bg-blue-100 text-blue-700 border-blue-200 text-xs mb-2"
                              : "bg-gray-100 text-gray-700 border-gray-200 text-xs mb-2"
                          }
                        >
                          {role}
                        </Badge>
                        <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Team management coming soon — multi-user access and role management will be available in an upcoming release.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 3: NOTIFICATIONS ════════════════════════════════════════ */}
          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Choose which alerts and updates you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {NOTIF_PREFS.map((pref) => (
                    <Toggle
                      key={pref.id}
                      label={pref.label}
                      description={pref.description}
                      checked={notifs[pref.id]}
                      onChange={(v) =>
                        setNotifs((prev) => ({ ...prev, [pref.id]: v }))
                      }
                    />
                  ))}
                </div>

                <Separator className="my-5" />

                {/* Email preferences */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email Preferences
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">
                        Notification email address
                      </Label>
                      <Input
                        className="mt-1 max-w-sm"
                        defaultValue="debutwebconsultants@gmail.com"
                        type="email"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        All system notifications will be sent to this address.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cc-team" />
                      <Label htmlFor="cc-team" className="text-xs font-medium text-gray-700">
                        CC all bid managers on deadline reminders
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Demo mode — notification changes are not saved.
                  </p>
                  <Button
                    className="gap-2 bg-[#1e3055] text-white hover:bg-[#162540]"
                    disabled
                  >
                    <Save className="h-4 w-4" />
                    Save Notification Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 4: BILLING ══════════════════════════════════════════════ */}
          <TabsContent value="billing" className="mt-0 space-y-6">
            {/* Demo banner */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              DEMO MODE — No real billing is active. This is a demonstration of the billing interface.
            </div>

            {/* Current plan */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-[#1e3055]">Growth</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      £149<span className="text-gray-400 text-xs">/month</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Monthly billing — next charge 1 July 2026
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled
                  >
                    Change Plan
                  </Button>
                </div>

                <Separator className="my-4" />

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Included Features
                </h3>
                <ul className="space-y-2">
                  {growthPlan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Upgrade to Pro */}
            <Card className="border-[#1e3055]/20 bg-gradient-to-br from-[#1e3055] to-[#2a4a7f] text-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge className="mb-2 bg-white/20 text-white border-white/30 text-xs">
                      Upgrade Available
                    </Badge>
                    <h3 className="text-lg font-bold">Pro Plan — £349/month</h3>
                    <p className="mt-1 text-sm text-blue-200">
                      Everything in Growth, plus advanced tools for growing teams.
                    </p>
                  </div>
                  <Button
                    disabled
                    className="bg-white text-[#1e3055] hover:bg-gray-100 font-semibold text-sm opacity-80"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
                <Separator className="my-4 border-white/20" />
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {proPlan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Billing history */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">
                          No billing history available in demo mode.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">No payment method</p>
                      <p className="text-xs text-gray-400">Add a card to activate billing.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs" disabled>
                    Add Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TAB 5: DATA & EXPORT ════════════════════════════════════════ */}
          <TabsContent value="data" className="mt-0 space-y-6">

            {/* Export your data */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Export Your Data
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Download a copy of your procurement data at any time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {EXPORT_OPTIONS.map((opt) => (
                    <div
                      key={opt.label}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        {opt.icon}
                        {opt.label}
                      </div>
                      <Button variant="outline" size="sm" className="text-xs" disabled>
                        Export (Demo)
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Exports are disabled in demo mode. Connect a live account to download your data.
                </p>
              </CardContent>
            </Card>

            {/* GDPR data request */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  GDPR Data Request
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Under UK GDPR, you have the right to request a copy of all personal data we hold about you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Submitting a Subject Access Request (SAR) will trigger a review within 30 days. We will
                  email a full data export to your registered address.
                </p>
                <Button variant="outline" className="gap-2 text-xs" disabled>
                  <Palette className="h-3.5 w-3.5" />
                  Submit GDPR Data Request (Demo)
                </Button>
              </CardContent>
            </Card>

            {/* Delete account */}
            <Card className="border-red-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-red-700">
                  Delete Account
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Permanently delete your BidIQ Pro account and all associated data. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Warning — this is irreversible.</p>
                  <p className="mt-1 text-xs">
                    Deleting your account will permanently remove all bids, documents, compliance data and
                    calendar events. Your data cannot be recovered after deletion.
                  </p>
                </div>

                {!showDeleteInput ? (
                  <Button
                    variant="outline"
                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50 text-xs"
                    onClick={() => setShowDeleteInput(true)}
                    disabled
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Request Account Deletion (Demo — disabled)
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-gray-700">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      className="max-w-sm border-red-300 focus:border-red-400 focus:ring-red-200"
                      placeholder="Type DELETE"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        className="gap-2 bg-red-600 text-white hover:bg-red-700 text-xs"
                        disabled={deleteConfirm !== "DELETE"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Confirm Delete Account
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setShowDeleteInput(false)
                          setDeleteConfirm("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ─── Footer ───────────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-gray-400">
          BidIQ Pro — your company profile is used to match you with relevant public sector opportunities.
        </p>

      </div>
    </div>
  )
}
