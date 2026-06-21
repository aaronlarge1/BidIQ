import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { NAV_GROUPS } from "@/lib/constants"
import { LogoWhite } from "@/components/Logo"
import {
  LayoutDashboard, Calendar, Search, Kanban, FileEdit, ShieldCheck,
  FolderLock, ClipboardCheck, Archive, Leaf, Building2, TrendingUp,
  Users, PoundSterling, Calculator, GraduationCap, Settings,
  ChevronRight
} from "lucide-react"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calendar, Search, Kanban, FileEdit, ShieldCheck,
  FolderLock, ClipboardCheck, Archive, Leaf, Building2, TrendingUp,
  Users, PoundSterling, Calculator, GraduationCap, Settings,
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col bg-navy-950">
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-navy-800">
        <LogoWhite size="sm" />
      </div>

      {/* Demo badge */}
      <div className="mx-4 mt-3 mb-1 rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-1 text-center">
        <span className="text-xs font-semibold text-amber-300">DEMO MODE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-navy-500">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICON_MAP[item.icon]
                const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "sidebar-link",
                      isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-navy-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-sm font-bold text-white">
            GL
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Greenfield Infra Ltd</p>
            <p className="text-[10px] text-navy-400 truncate">demo@bidiqpro.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
