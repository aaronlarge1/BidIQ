import { useState } from "react"
import {
  Calendar, Clock, AlertTriangle, CheckCircle2,
  ChevronLeft, ChevronRight, Bell, Filter, Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatDate, daysUntil } from "@/lib/utils"
import type { CalendarEvent } from "@/types"
import { useCalendarEvents } from "@/hooks/useApi"

// ─── Event colour config ──────────────────────────────────────────────────────

type EventCfg = {
  dot: string
  border: string
  badge: string
  label: string
}

const EVENT_COLORS: Record<CalendarEvent["type"], EventCfg> = {
  deadline: {
    dot: "bg-red-500",
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-700 border-red-200",
    label: "Bid Deadline",
  },
  "doc-expiry": {
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Document Expiry",
  },
  renewal: {
    dot: "bg-purple-500",
    border: "border-l-purple-500",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    label: "Renewal",
  },
  "meet-the-buyer": {
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Meet the Buyer",
  },
  grant: {
    dot: "bg-green-500",
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
    label: "Grant",
  },
  "framework-opening": {
    dot: "bg-teal-500",
    border: "border-l-teal-500",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
    label: "Framework Opening",
  },
}

// ─── July 2026 calendar helpers ───────────────────────────────────────────────

// July 2026 starts on Wednesday (index 3, Sun=0)
const JULY_START_DOW = 3
const JULY_DAYS = 31
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getJulyEventsByDay(events: CalendarEvent[]): Record<number, CalendarEvent[]> {
  const map: Record<number, CalendarEvent[]> = {}
  events.forEach((evt) => {
    const d = new Date(evt.date)
    if (d.getFullYear() === 2026 && d.getMonth() === 6) {
      const day = d.getDate()
      if (!map[day]) map[day] = []
      map[day].push(evt)
    }
  })
  return map
}

// ─── Alert summary cards ──────────────────────────────────────────────────────

const ALERT_CARDS = [
  {
    icon: <Clock className="h-5 w-5 text-red-500" />,
    accent: "border-l-red-500",
    bg: "bg-red-50",
    title: "Next Deadline",
    value: "A57 Bid — 18 Jul 2026",
    sub: "27 days remaining",
    subColor: "text-red-600",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    accent: "border-l-amber-500",
    bg: "bg-amber-50",
    title: "Documents Expiring",
    value: "2 documents",
    sub: "GDPR Policy, PI Insurance",
    subColor: "text-amber-600",
  },
  {
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
    accent: "border-l-blue-500",
    bg: "bg-blue-50",
    title: "Meet the Buyer Events",
    value: "1 upcoming",
    sub: "NHS Greater Manchester — 10 Jul",
    subColor: "text-blue-600",
  },
]

// ─── Tab filter map ───────────────────────────────────────────────────────────

const TAB_FILTERS: Record<string, Array<CalendarEvent["type"]> | null> = {
  all: null,
  deadlines: ["deadline"],
  "doc-expiry": ["doc-expiry"],
  renewals: ["renewal", "framework-opening"],
  events: ["meet-the-buyer", "grant"],
}

// ─── CalendarPage ─────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const { data: calendarData } = useCalendarEvents()
  const events: CalendarEvent[] = calendarData ?? []

  const julyEvents = getJulyEventsByDay(events)

  // All events sorted ascending
  const allSorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Timeline: events within the next 90 days (allow overdue ones too if < 90 past)
  const typeFilter = TAB_FILTERS[activeTab]
  const timelineEvents = allSorted.filter((evt) => {
    const days = daysUntil(evt.date)
    if (days > 90) return false
    if (typeFilter && !typeFilter.includes(evt.type)) return false
    return true
  })

  // Selected day events for July
  const selectedDayEvents = selectedDay ? (julyEvents[selectedDay] ?? []) : []

  // Build grid cells: nulls for blank prefix + day numbers
  const gridCells: Array<number | null> = [
    ...Array<null>(JULY_START_DOW).fill(null),
    ...Array.from({ length: JULY_DAYS }, (_, i) => i + 1),
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Procurement Calendar</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Never miss a deadline, renewal or opportunity again
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-[#1e3055] text-white hover:bg-[#162540] text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Event
            </Button>
          </div>
        </div>

        {/* ─── Alert Summary Cards ───────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ALERT_CARDS.map((card) => (
            <Card
              key={card.title}
              className={`border-l-4 shadow-sm ${card.accent} ${card.bg}`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="mt-0.5 shrink-0">{card.icon}</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-900">{card.value}</p>
                  <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Calendar grid + sidebar ───────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* July 2026 calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    July 2026
                  </CardTitle>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className="bg-[#1e3055]/10 text-[#1e3055] border-[#1e3055]/20 text-xs">
                  {Object.values(julyEvents).flat().length} events this month
                </Badge>
              </CardHeader>
              <CardContent>
                {/* Day-of-week header row */}
                <div className="mb-1 grid grid-cols-7 gap-1">
                  {DAY_LABELS.map((d) => (
                    <div
                      key={d}
                      className="py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {gridCells.map((day, idx) => {
                    if (day === null) {
                      return <div key={`blank-${idx}`} className="h-14 rounded-lg" />
                    }
                    const dayEvts = julyEvents[day] ?? []
                    const isSelected = selectedDay === day
                    const hasEvents = dayEvts.length > 0

                    return (
                      <button
                        key={day}
                        onClick={() =>
                          setSelectedDay(isSelected ? null : day)
                        }
                        className={[
                          "relative flex h-14 flex-col items-center rounded-lg border p-1 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3055]/30",
                          isSelected
                            ? "border-[#1e3055] bg-[#1e3055] text-white shadow-md"
                            : hasEvents
                            ? "border-gray-200 bg-white hover:border-[#1e3055]/40 hover:bg-blue-50 cursor-pointer"
                            : "border-transparent bg-white text-gray-400 cursor-default",
                        ].join(" ")}
                      >
                        <span className="mt-1 font-medium leading-none">{day}</span>
                        {hasEvents && (
                          <div className="mt-auto mb-1 flex flex-wrap justify-center gap-0.5">
                            {dayEvts.slice(0, 3).map((e) => (
                              <span
                                key={e.id}
                                className={[
                                  "h-1.5 w-1.5 rounded-full",
                                  isSelected
                                    ? "bg-white/80"
                                    : EVENT_COLORS[e.type].dot,
                                ].join(" ")}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Selected day detail panel */}
                {selectedDay !== null && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">
                      {selectedDayEvents.length > 0
                        ? `Events on ${selectedDay} July 2026`
                        : `No events on ${selectedDay} July 2026`}
                    </h3>
                    {selectedDayEvents.length === 0 ? (
                      <p className="text-xs text-gray-400">
                        No procurement events scheduled for this day.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDayEvents.map((evt) => {
                          const cfg = EVENT_COLORS[evt.type]
                          return (
                            <div
                              key={evt.id}
                              className={`flex items-center justify-between rounded-lg border border-l-4 bg-white p-3 ${cfg.border}`}
                            >
                              <div>
                                <span
                                  className={`mb-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.badge}`}
                                >
                                  {cfg.label}
                                </span>
                                <p className="text-sm font-medium text-gray-900">{evt.title}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-3 shrink-0 gap-1 text-xs"
                              >
                                <Bell className="h-3 w-3" />
                                Remind me
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: legend + coming up */}
          <div className="space-y-4">
            {/* Event key */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">Event Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {(Object.values(EVENT_COLORS) as EventCfg[])
                  .filter((v, i, a) => a.findIndex((x) => x.label === v.label) === i)
                  .map((cfg) => (
                    <div key={cfg.label} className="flex items-center gap-3">
                      <span className={`h-3 w-3 shrink-0 rounded-full ${cfg.dot}`} />
                      <span className="text-sm text-gray-700">{cfg.label}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* June empty notice */}
            <Card className="border-blue-100 bg-blue-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800">June 2026</p>
                    <p className="mt-0.5 text-xs text-blue-600">
                      No events in this period. Tender deadlines and renewals will appear here automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coming up next */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">Coming Up Next</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {(() => {
                  const upcoming = [...events]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .filter((e) => daysUntil(e.date) >= 0)
                    .slice(0, 5)
                  if (upcoming.length === 0) {
                    return (
                      <p className="text-xs text-gray-400">
                        No upcoming events. They'll appear here when you create bids.
                      </p>
                    )
                  }
                  return upcoming.map((evt) => {
                    const days = daysUntil(evt.date)
                    const cfg = EVENT_COLORS[evt.type]
                    return (
                      <div key={evt.id} className="flex items-start gap-2">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-gray-800">{evt.title}</p>
                          <p className="text-xs text-gray-400">{formatDate(evt.date)}</p>
                        </div>
                        <span
                          className={`shrink-0 text-xs font-medium ${
                            days <= 14 ? "text-red-600" : "text-gray-400"
                          }`}
                        >
                          {days}d
                        </span>
                      </div>
                    )
                  })
                })()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ─── Timeline Event List ───────────────────────────────────────── */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Upcoming Events — Next 90 Days
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-5 h-9 rounded-lg bg-gray-100 p-1">
                <TabsTrigger value="all" className="rounded-md px-3 text-xs">All</TabsTrigger>
                <TabsTrigger value="deadlines" className="rounded-md px-3 text-xs">Bid Deadlines</TabsTrigger>
                <TabsTrigger value="doc-expiry" className="rounded-md px-3 text-xs">Document Expiry</TabsTrigger>
                <TabsTrigger value="renewals" className="rounded-md px-3 text-xs">Renewals</TabsTrigger>
                <TabsTrigger value="events" className="rounded-md px-3 text-xs">Events &amp; Grants</TabsTrigger>
              </TabsList>

              {/* Single shared content block — tabs update timelineEvents via state */}
              {["all", "deadlines", "doc-expiry", "renewals", "events"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  {timelineEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-14 text-center">
                      <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">
                        No deadlines yet
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        They'll appear here when you create bids
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timelineEvents.map((evt) => {
                        const days = daysUntil(evt.date)
                        const cfg = EVENT_COLORS[evt.type]
                        const isOverdue = days < 0
                        const isUrgent = !isOverdue && days < 14

                        return (
                          <div
                            key={evt.id}
                            className={`rounded-xl border border-l-4 bg-white p-4 transition-shadow hover:shadow-sm ${cfg.border}`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              {/* Event info */}
                              <div className="min-w-0 flex-1">
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                  <span
                                    className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.badge}`}
                                  >
                                    {cfg.label}
                                  </span>
                                  {evt.tenderId && (
                                    <span className="text-xs text-gray-400">
                                      Tender: {evt.tenderId.toUpperCase()}
                                    </span>
                                  )}
                                  {evt.documentId && (
                                    <span className="text-xs text-gray-400">
                                      Doc: {evt.documentId.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-sm font-semibold leading-snug text-gray-900">
                                  {evt.title}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(evt.date)}
                                  </span>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span
                                    className={`text-xs font-semibold ${
                                      isOverdue
                                        ? "text-red-600"
                                        : isUrgent
                                        ? "text-amber-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {isOverdue
                                      ? `${Math.abs(days)} days overdue`
                                      : days === 0
                                      ? "Today"
                                      : `${days} days remaining`}
                                  </span>
                                  {isUrgent && (
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                  )}
                                  {isOverdue && (
                                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                  )}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex shrink-0 flex-wrap items-center gap-2">
                                {evt.tenderId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  >
                                    View Tender
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 gap-1 px-2 text-xs"
                                >
                                  <Bell className="h-3 w-3" />
                                  Set Reminder
                                </Button>
                                {evt.tenderId && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2 text-xs bg-[#1e3055] text-white hover:bg-[#162540]"
                                  >
                                    Add to Bid Workspace
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
