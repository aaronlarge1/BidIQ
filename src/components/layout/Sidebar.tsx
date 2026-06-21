import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { NAV_GROUPS } from "@/lib/constants"
import { LogoWhite } from "@/components/Logo"
import {
  LayoutDashboard, Calendar, Search, Kanban, FileEdit, ShieldCheck,
  FolderLock, ClipboardCheck, Archive, Leaf, Building2, TrendingUp,
  Users, PoundSterling, Calculator, GraduationCap, Settings,
  ChevronRight,
} from "lucide-react"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calendar, Search, Kanban, FileEdit, ShieldCheck,
  FolderLock, ClipboardCheck, Archive, Leaf, Building2, TrendingUp,
  Users, PoundSterling, Calculator, GraduationCap, Settings,
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col bg-navy-950 scrollbar-thin">

      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-white/6 shrink-0">
        <LogoWhite size="sm" />
      </div>

      {/* Demo badge */}
      <div className="mx-3 mt-3 mb-1 rounded-lg bg-amber-500/15 border border-amber-400/25 px-3 py-1.5 text-center">
        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Demo Mode</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-navy-500 select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICON_MAP[item.icon]
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/" && pathname.startsWith(item.path))

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
                    {Icon && (
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-navy-400"
                      )} />
                    )}
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-3 w-3 opacity-50 shrink-0" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="shrink-0 p-3 border-t border-white/6">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-inner-sm">
            GL
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Greenfield Infra Ltd</p>
            <p className="text-[10px] text-navy-400 truncate">demo@bidiqpro.com</p>
          </div>
          <Settings className="h-3.5 w-3.5 text-navy-500 shrink-0" />
        </div>
      </div>
    </div>
  )
}
