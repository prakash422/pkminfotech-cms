"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { User, Mail, Shield, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user) {
      router.replace("/login")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-light d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 small text-secondary">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <main className="min-h-screen bg-light py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <Link href="/" className="d-inline-flex align-items-center gap-1 small text-secondary text-decoration-none mb-3">
          <ArrowLeft size={16} />
          Back to home
        </Link>
        <div className="card border shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h1 className="h4 fw-bold mb-4">My Profile</h1>
            <div className="d-flex align-items-center gap-3 mb-4">
              {user.image ? (
                <img src={user.image} alt="" className="rounded-circle" style={{ width: 64, height: 64, objectFit: "cover" }} />
              ) : (
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold" style={{ width: 64, height: 64, fontSize: 24 }}>
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h2 className="h5 fw-semibold mb-1">{user.name || "User"}</h2>
                <p className="small text-secondary mb-0">{user.email}</p>
                <span className="badge bg-primary-subtle text-primary small mt-1">
                  {user.role === "admin" ? "Admin" : "Member"}
                </span>
              </div>
            </div>
            <ul className="list-unstyled small mb-0">
              <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                <User size={18} className="text-secondary" />
                <span className="text-secondary">Name</span>
                <span className="ms-auto fw-medium">{user.name || "—"}</span>
              </li>
              <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                <Mail size={18} className="text-secondary" />
                <span className="text-secondary">Email</span>
                <span className="ms-auto fw-medium">{user.email || "—"}</span>
              </li>
              <li className="d-flex align-items-center gap-2 py-2">
                <Shield size={18} className="text-secondary" />
                <span className="text-secondary">Account type</span>
                <span className="ms-auto fw-medium">{user.role === "admin" ? "Admin" : "User"}</span>
              </li>
            </ul>
            {user.role === "admin" && (
              <Link href="/admin/dashboard" className="btn btn-outline-primary btn-sm mt-4">
                Go to Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
