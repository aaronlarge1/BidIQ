import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react"
import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features",     href: "#features" },
  { label: "Pricing",      href: "#pricing" },
]

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_12px_rgba(0,0,0,0.08)] border-b border-gray-100"
          : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to={ROUTES.home} className="shrink-0">
            <Logo size="md" variant="full" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="hover:text-navy-900 transition-colors duration-150 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-govgreen-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-slate-600 hover:text-navy-900 hover:bg-navy-50 font-medium"
            >
              <Link to={ROUTES.login}>Log In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold px-5 shadow-navy transition-all duration-150 hover:scale-[1.02]"
            >
              <Link to={ROUTES.register}>
                Start Free
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-navy-50 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="x"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5 text-navy-900" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5 text-navy-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">

                {/* ── CTAs first so they're immediately visible ── */}
                <div className="space-y-2 mb-4">
                  <Button
                    className="w-full rounded-xl bg-govgreen-600 hover:bg-govgreen-500 active:bg-govgreen-700 text-white font-bold h-12 text-base shadow-sm transition-all"
                    asChild
                  >
                    <Link to={ROUTES.register} onClick={() => setMobileOpen(false)}>
                      Start Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-navy-200 text-navy-900 font-semibold h-11"
                    asChild
                  >
                    <Link to={ROUTES.login} onClick={() => setMobileOpen(false)}>Log In</Link>
                  </Button>
                </div>

                {/* ── Nav links ── */}
                <div className="border-t border-gray-100 pt-3 space-y-0.5">
                  {NAV_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                    >
                      {label}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop — closes menu when tapping outside */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
