import { Navigate, Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ROUTES } from "@/lib/constants"

export function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3055]" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireCompany() {
  const { user, hasCompany, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3055]" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!hasCompany) return <Navigate to={ROUTES.onboarding} replace />
  return <Outlet />
}

export function RedirectIfAuthed() {
  const { user, hasCompany, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3055]" />
      </div>
    )
  }

  if (user) return <Navigate to={hasCompany ? ROUTES.dashboard : ROUTES.onboarding} replace />
  return <Outlet />
}
