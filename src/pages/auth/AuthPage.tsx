import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth, ApiError } from "@/context/AuthContext"
import { ROUTES } from "@/lib/constants"
import Logo from "@/components/Logo"

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const [isLogin, setIsLogin] = useState(mode === "login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login, register, hasCompany } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
        navigate(ROUTES.dashboard)
      } else {
        if (!name.trim()) { setError("Name is required"); setLoading(false); return }
        await register(name, email, password)
        navigate(ROUTES.onboarding)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-[#1e3055] text-white rounded-t-xl px-6 pt-6 pb-5">
              <CardTitle className="text-xl font-bold">
                {isLogin ? "Sign in to BidIQ" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {isLogin
                  ? "Welcome back — sign in to continue"
                  : "Start your free trial — no credit card required"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      required={!isLogin}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.co.uk"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isLogin ? "Your password" : "At least 8 characters"}
                      required
                      minLength={8}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3055] hover:bg-[#162540] text-white"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="mt-5 text-center text-sm text-gray-500">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => { setIsLogin(false); setError(null) }}
                      className="font-medium text-[#1e3055] hover:underline"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => { setIsLogin(true); setError(null) }}
                      className="font-medium text-[#1e3055] hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center mt-4 text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link to="/" className="hover:underline">Terms of Service</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
