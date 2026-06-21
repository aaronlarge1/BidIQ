import { Outlet, Link } from "react-router-dom"
import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Nav */}
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to={ROUTES.home}>
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-navy-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-navy-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-navy-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.dashboard}>Log In</Link>
            </Button>
            <Button size="sm" asChild className="bg-navy-900 hover:bg-navy-800">
              <Link to={ROUTES.onboarding}>Start Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-navy-950 text-navy-400">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Logo size="sm" className="[&_span]:text-white [&_.text-muted-foreground]:text-navy-400" />
              <p className="text-sm">The AI Procurement Operating System for SMEs.</p>
              <p className="text-xs">© 2026 Civic Ladder Ltd. All rights reserved.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to={ROUTES.onboarding} className="hover:text-white transition-colors">Readiness Check</Link></li>
                <li><Link to={ROUTES.academy} className="hover:text-white transition-colors">Procurement Academy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Sectors</h4>
              <ul className="space-y-2 text-sm">
                <li>Highways & National Highways</li>
                <li>Local Authority</li>
                <li>NHS & Health</li>
                <li>Housing Associations</li>
                <li>Education</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Civic Ladder Ltd</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
