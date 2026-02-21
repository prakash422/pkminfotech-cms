import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import BreadcrumbNav from "@/components/BreadcrumbNav"

export const metadata: Metadata = {
  title: "Daily Quiz Today | SSC, GK, Current Affairs | PKMinfotech",
  description:
    "Attempt free daily quiz for govt exam preparation. Practice Reasoning, Quant, English, GK and Current Affairs every day.",
}

type DailyQuizCard = {
  quizId: string
  title: string
  totalQuestions: number
  durationMinutes: number
  negativeMarking: number
  createdAt?: Date
}

async function getDailyQuizzes(): Promise<DailyQuizCard[]> {
  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") || h.get("host")
    const proto = h.get("x-forwarded-proto") || "http"
    const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/daily-quiz`, { cache: "no-store" })
    if (!response.ok) return []
    const json = (await response.json()) as {
      data?: Array<{
        quizId: string
        title?: string | null
        totalQuestions: number
        durationMinutes: number
        negativeMarking: number
        createdAt?: Date
      }>
    }
    const quizzes = json.data || []
    return quizzes.map((item) => ({
      quizId: item.quizId,
      title: item.title || item.quizId,
      totalQuestions: item.totalQuestions,
      durationMinutes: item.durationMinutes,
      negativeMarking: item.negativeMarking,
      createdAt: item.createdAt,
    }))
  } catch {
    return []
  }
}

export default async function DailyQuizListPage() {
  const quizzes = await getDailyQuizzes()
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Daily Quiz" },
          ]}
        />

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Daily Quiz For Govt Exams</h1>
            <p className="text-secondary mb-0">
              Search intent focused: SSC daily quiz today, free current affairs quiz, and mixed govt exam daily practice.
            </p>
          </div>
        </section>

        {quizzes.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">No daily quizzes found right now.</div>
          </section>
        ) : (
          <section className="row g-3">
            {quizzes.map((quiz) => (
              <div className="col-md-6" key={quiz.quizId}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge text-bg-primary-subtle text-primary-emphasis">Daily Quiz</span>
                      <span className="small text-secondary">{quiz.durationMinutes} min</span>
                    </div>
                    <h2 className="h5 fw-semibold">{quiz.title}</h2>
                    <p className="small text-secondary mb-3">
                      {quiz.totalQuestions} questions • Negative {quiz.negativeMarking}
                    </p>
                    <Link href={`/daily-quiz/${quiz.quizId}`} className="btn btn-primary btn-sm">
                      Attempt Now
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
