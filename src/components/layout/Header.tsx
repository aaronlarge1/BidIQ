import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Menu, Bell, Bot, ChevronRight } from "lucide-react"
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
  if (pathname === "/onboarding") return "Procurement Readiness Check"
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
      <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6 sticky top-0 z-30">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title + breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-lg font-semibold text-navy-900 truncate">{title}</h1>
          <span className="demo-badge hidden sm:inline-flex">DEMO</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/calendar">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Link>
          </Button>

          {/* AI Assistant */}
          <Button
            variant="outline"
            size="sm"
            onClick={onAIOpen}
            className="hidden sm:flex items-center gap-2 border-navy-200 text-navy-700 hover:bg-navy-50"
          >
            <Bot className="h-4 w-4 text-govgreen-600" />
            <span>Ask AI</span>
          </Button>

          {/* Mobile AI */}
          <Button variant="ghost" size="icon" onClick={onAIOpen} className="sm:hidden">
            <Bot className="h-4 w-4 text-govgreen-600" />
          </Button>

          {/* User */}
          <div className="h-8 w-8 rounded-full bg-navy-800 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:bg-navy-700 transition-colors">
            GL
          </div>
        </div>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
