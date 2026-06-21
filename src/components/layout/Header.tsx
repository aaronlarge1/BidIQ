import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Menu, Bell, Bot, ChevronRight, Search } from "lucide-react"
import { NAV_GROUPS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Sidebar from "./Sidebar"

function getPageTitle(pathname: string): string {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))) {
        return item.label
      }
    }
  }
  if (pathname.startsWith("/tenders/")) return "Opportunity Intelligence"
  if (pathname === "/onboarding")       return "Procurement Readiness Check"
  return "BidIQ Pro"
}

interface HeaderProps {
  onAIOpen: () => void
}

export default function Header({ onAIOpen }: HeaderProps) {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = getPageTitle(pathname)

  return (
    <>
      <header className="flex h-16 items-center gap-3 border-b bg-white/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">

        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-navy-50"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-base font-bold text-navy-900 truncate">{title}</h1>
          <Badge className="demo-badge hidden sm:inline-flex">DEMO</Badge>
        </div>

        <div className="ml-auto flex items-center gap-1.5">

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-navy-50"
            asChild
          >
            <Link to="/calendar">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </Link>
          </Button>

          {/* AI Assistant — desktop */}
          <Button
            variant="outline"
            size="sm"
            onClick={onAIOpen}
            className="hidden sm:flex items-center gap-2 rounded-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:border-navy-300 text-sm font-semibold transition-all duration-150 h-9 px-4"
          >
            <Bot className="h-3.5 w-3.5 text-govgreen-600" />
            Ask AI
          </Button>

          {/* AI — mobile icon only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAIOpen}
            className="sm:hidden h-9 w-9 rounded-lg text-govgreen-600 hover:bg-govgreen-50"
          >
            <Bot className="h-4.5 w-4.5" />
          </Button>

          {/* User avatar */}
          <button className="h-9 w-9 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-[11px] font-black text-white cursor-pointer hover:from-navy-600 hover:to-navy-800 transition-all duration-150 shadow-sm ml-1">
            GL
          </button>
        </div>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
