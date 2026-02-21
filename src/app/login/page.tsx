"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
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
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })
      if (result?.error) {
        setError("Invalid email or password")
        return
      }
      const session = await getSession()
      const role = session?.user?.role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
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
              <p className="text-secondary small mb-0">Sign in to your PKMinfotech account.</p>
            </div>
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
