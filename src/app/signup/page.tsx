"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Signup failed")
        return
      }
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })
      if (result?.error) {
        setError("Account created. Please log in.")
        router.push("/login")
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
              <h1 className="h4 fw-bold mb-1">Create account</h1>
              <p className="text-secondary small mb-0">Sign up to save progress and access more features.</p>
            </div>
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <div>
                <label htmlFor="name" className="form-label small fw-semibold">Name (optional)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><User size={18} className="text-secondary" /></span>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
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
                <label htmlFor="password" className="form-label small fw-semibold">Password (min 6 characters)</label>
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
                    minLength={6}
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
              <div>
                <label htmlFor="confirmPassword" className="form-label small fw-semibold">Confirm password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><Lock size={18} className="text-secondary" /></span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
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
                {isLoading ? "Creating account…" : "Sign up"}
              </button>
            </form>
            <p className="text-center small text-secondary mt-3 mb-0">
              Already have an account? <Link href="/login" className="fw-semibold">Log in</Link>
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
