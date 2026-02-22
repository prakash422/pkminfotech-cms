"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const result = await signIn("credentials-user", {
        email: email.trim(),
        password,
        redirect: false,
      })
      if (result?.error) {
        setError("Invalid email or password")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card border shadow-sm">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="h4 fw-bold mb-1">Log in</h1>
              <p className="text-secondary small mb-0">Sign in to your pkminfotech account.</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <div className="text-center small text-secondary mb-3">— or —</div>
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <div>
                <label htmlFor="email" className="form-label small fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><Mail size={18} className="text-secondary" /></span>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><Lock size={18} className="text-secondary" /></span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger py-2 small mb-0">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Log in"}
              </button>
            </form>
            <p className="text-center small text-secondary mt-3 mb-0">
              Don&apos;t have an account? <Link href="/signup" className="fw-semibold">Sign up</Link>
            </p>
            <p className="text-center small text-secondary mt-1 mb-0">
              <Link href="/admin/login" className="text-decoration-none">Admin login</Link>
            </p>
          </div>
        </div>
        <p className="text-center small text-secondary mt-3">
          <Link href="/" className="text-decoration-none">Back to home</Link>
        </p>
      </div>
    </main>
  )
}
