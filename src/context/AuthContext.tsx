import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api, setToken, clearToken, ApiError } from "@/lib/api"

interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: AuthUser | null
  hasCompany: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hasCompany, setHasCompany] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refreshUser() {
    try {
      const data = await api.get<AuthUser & { company: { id: string } | null }>("/api/auth/me")
      setUser({ id: data.id, email: data.email, name: data.name })
      setHasCompany(!!data.company)
    } catch {
      setUser(null)
      setHasCompany(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("bidiq_token")
    if (token) {
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const data = await api.post<{ token: string; user: AuthUser; hasCompany: boolean }>(
      "/api/auth/login",
      { email, password }
    )
    setToken(data.token)
    setUser(data.user)
    setHasCompany(data.hasCompany)
  }

  async function register(name: string, email: string, password: string) {
    const data = await api.post<{ token: string; user: AuthUser }>(
      "/api/auth/register",
      { name, email, password }
    )
    setToken(data.token)
    setUser(data.user)
    setHasCompany(false)
  }

  function logout() {
    clearToken()
    setUser(null)
    setHasCompany(false)
  }

  return (
    <AuthContext.Provider value={{ user, hasCompany, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

export { ApiError }
