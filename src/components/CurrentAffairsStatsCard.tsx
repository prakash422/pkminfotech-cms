"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { BarChart3, LogIn } from "lucide-react"

export default function CurrentAffairsStatsCard() {
  const { data: session, status } = useSession()

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-3">
        <h4 className="h6 fw-semibold mb-2 d-flex align-items-center gap-1">
          <BarChart3 size={18} /> Your Statistics
        </h4>
        <ul className="list-unstyled small text-secondary mb-3">
          <li>Quizzes Played: 0</li>
          <li>Correct Answers: 0</li>
          <li>Your Accuracy: 0.0%</li>
          <li>Rank: Not Ranked</li>
        </ul>
        {status !== "loading" && !session?.user && (
          <Link
            href="/login"
            className="btn btn-primary btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2 rounded-2 fw-semibold text-decoration-none"
            style={{ minHeight: 40 }}
          >
            <LogIn size={16} aria-hidden />
            Login to Track
          </Link>
        )}
      </div>
    </div>
  )
}
