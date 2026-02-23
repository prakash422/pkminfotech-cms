"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { User, Mail, Shield, ArrowLeft, BarChart3 } from "lucide-react"

type QuizAttemptItem = {
  id: string
  quizId: string
  quizTitle: string | null
  quizType: string
  score: number
  totalMarks: number
  correctCount: number
  totalQuestions: number
  attemptedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [attempts, setAttempts] = useState<QuizAttemptItem[]>([])
  const [attemptsLoading, setAttemptsLoading] = useState(true)
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptItem | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user) {
      router.replace("/login")
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (!session?.user) return
    fetch("/api/quiz-attempts", { credentials: "include" })
      .then((res) => res.json())
      .then((json: { data?: QuizAttemptItem[] }) => setAttempts(json.data || []))
      .catch(() => setAttempts([]))
      .finally(() => setAttemptsLoading(false))
  }, [session?.user])

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

        <div className="card border shadow-sm mt-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
              <BarChart3 size={22} />
              Quiz score tracking
            </h2>
            <p className="small text-secondary mb-3">
              Attempts from Daily Quiz, Current Affairs Quiz and Mock Tests when you are logged in.
            </p>
            {attemptsLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading…</span>
                </div>
              </div>
            ) : attempts.length === 0 ? (
              <p className="small text-secondary mb-0">No quiz attempts yet. Attempt any quiz while logged in to see scores here.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small">Quiz</th>
                      <th className="small text-end">Score</th>
                      <th className="small text-end">Correct</th>
                      <th className="small text-end">Accuracy</th>
                      <th className="small">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((a) => {
                      const accuracy = a.totalQuestions > 0 ? ((a.correctCount / a.totalQuestions) * 100).toFixed(1) : "0"
                      return (
                        <tr
                          key={a.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedAttempt(a)}
                          onKeyDown={(e) => e.key === "Enter" && setSelectedAttempt(a)}
                          className="cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          <td className="small">
                            <span className="fw-medium">{a.quizTitle || a.quizId}</span>
                            {a.quizType !== "daily-quiz" && (
                              <span className="badge bg-secondary-subtle text-secondary ms-1" style={{ fontSize: "0.65rem" }}>
                                {a.quizType === "current-affairs" ? "CA" : "Mock"}
                              </span>
                            )}
                          </td>
                          <td className="small text-end">
                            {a.score.toFixed(1)} / {a.totalMarks.toFixed(0)}
                          </td>
                          <td className="small text-end">{a.correctCount} / {a.totalQuestions}</td>
                          <td className="small text-end">{accuracy}%</td>
                          <td className="small text-secondary">
                            {new Date(a.attemptedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {selectedAttempt && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setSelectedAttempt(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="attempt-detail-title"
          >
            <div
              className="card shadow border-0"
              style={{ maxWidth: 420, width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h3 id="attempt-detail-title" className="h6 fw-bold mb-0">Score details</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-secondary text-decoration-none p-0"
                  onClick={() => setSelectedAttempt(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="card-body py-3">
                <dl className="row small mb-0">
                  <dt className="col-5 text-secondary">Quiz</dt>
                  <dd className="col-7 fw-medium">{selectedAttempt.quizTitle || selectedAttempt.quizId}</dd>

                  <dt className="col-5 text-secondary">Type</dt>
                  <dd className="col-7">
                    {selectedAttempt.quizType === "daily-quiz"
                      ? "Daily Quiz"
                      : selectedAttempt.quizType === "current-affairs"
                        ? "Current Affairs Quiz"
                        : "Mock Test"}
                  </dd>

                  <dt className="col-5 text-secondary">Date & time</dt>
                  <dd className="col-7">
                    {new Date(selectedAttempt.attemptedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>

                  <dt className="col-5 text-secondary">Score</dt>
                  <dd className="col-7 fw-semibold text-primary">
                    {selectedAttempt.score.toFixed(1)} / {selectedAttempt.totalMarks.toFixed(0)}
                  </dd>

                  <dt className="col-5 text-secondary">Correct answers</dt>
                  <dd className="col-7">
                    {selectedAttempt.correctCount} / {selectedAttempt.totalQuestions}
                  </dd>

                  <dt className="col-5 text-secondary">Incorrect</dt>
                  <dd className="col-7">
                    {selectedAttempt.totalQuestions - selectedAttempt.correctCount}
                  </dd>

                  <dt className="col-5 text-secondary">Accuracy</dt>
                  <dd className="col-7">
                    {selectedAttempt.totalQuestions > 0
                      ? ((selectedAttempt.correctCount / selectedAttempt.totalQuestions) * 100).toFixed(1)
                      : "0"}%
                  </dd>
                </dl>
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-3 w-100"
                  onClick={() => setSelectedAttempt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
