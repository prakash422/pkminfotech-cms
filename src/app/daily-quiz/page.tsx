import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import BreadcrumbNav from "@/components/BreadcrumbNav"

const CANONICAL = "/daily-quiz"
export const metadata: Metadata = {
  title: "Daily Quiz Today | SSC, GK, Current Affairs | pkminfotech",
  description: "Attempt free daily quiz for govt exam preparation. Practice Reasoning, Quant, English, GK and Current Affairs every day. SSC, RRB, Banking exam ready.",
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Daily Quiz Today | SSC, GK, Current Affairs | pkminfotech",
    description: "Attempt free daily quiz for govt exam preparation. Practice Reasoning, Quant, English, GK and Current Affairs every day.",
    url: CANONICAL,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "Daily Quiz Today | pkminfotech", description: "Free daily quiz for SSC, RRB, Banking and govt exam preparation." },
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

        <section className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">Why take a daily quiz for government exams?</h2>
            <p className="text-secondary mb-3">
              Government exams like <Link href="/ssc" className="text-primary">SSC CGL</Link>, <Link href="/ssc" className="text-primary">SSC CHSL</Link>, <Link href="/rrb" className="text-primary">RRB NTPC</Link>, <Link href="/banking" className="text-primary">IBPS PO</Link>, and <Link href="/banking" className="text-primary">SBI Clerk</Link> test Reasoning, Quantitative Aptitude, English, General Knowledge, and Current Affairs. A short daily quiz keeps your concepts sharp and builds speed. Instead of cramming before the exam, 10–15 minutes every day helps you retain more and identify weak areas early.
            </p>
            <p className="text-secondary mb-0">
              Our daily quiz is free and covers mixed topics—GK, current affairs, reasoning, and quant—so you can practice in one place. Each quiz has a time limit and negative marking similar to real exams. Use the list above to pick today’s quiz or any past quiz you missed. For subject-wise practice, visit our <Link href="/ssc" className="text-primary">SSC</Link>, <Link href="/banking" className="text-primary">Banking</Link>, or <Link href="/rrb" className="text-primary">RRB</Link> exam pages and choose your exam type for practice sets and PYQ.
            </p>
          </div>
        </section>

        <section className="card border-0 shadow-sm mt-3">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">Daily quiz vs full mock test: when to use which</h2>
            <p className="text-secondary mb-3">
              <strong>Daily quiz</strong> is short (typically 10–20 questions) and ideal for everyday practice. It keeps you in touch with syllabus without taking hours. <strong>Full mock tests</strong> are timed, full-length papers that simulate the real exam. Use mocks once you have covered the syllabus—weekly or before the exam—to check your speed and accuracy under pressure. We offer both: try our <Link href="/mock-tests" className="text-primary">free mock tests</Link> for SSC, Banking, and Railway, and use this daily quiz page for regular bite-sized practice.
            </p>
            <p className="text-secondary mb-0">
              For current-affairs-only practice, use our <Link href="/current-affairs-quiz" className="text-primary">Daily Current Affairs Quiz</Link>, which is updated with date-wise sets. Combine daily quiz, current affairs quiz, and mock tests for a complete preparation routine. All quizzes and mocks are free; no signup is required to attempt.
            </p>
          </div>
        </section>

        <section className="card border-0 shadow-sm mt-3">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">Tips to get the most from daily quiz practice</h2>
            <p className="text-secondary mb-2">
              Fix a time each day—e.g. morning or after work—and attempt one quiz. After submitting, review the answers you got wrong and note the correct ones. Revise that list once a week. Over time you will build speed and reduce silly errors. Do not skip negative marking: attempt only when you are fairly sure, as wrong answers will deduct marks in real exams too. If you want to track your score and accuracy over time, create a free account and log in before attempting.
            </p>
            <p className="text-secondary mb-0">
              Bookmark this page and explore <Link href="/tools" className="text-primary">online tools</Link> like the SSC CGL marks calculator, IBPS score calculator, and cutoff predictor to plan your preparation. Good luck with your exam.
            </p>
          </div>
        </section>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-outline-primary btn-sm me-2">Home</Link>
          <Link href="/current-affairs-quiz" className="btn btn-outline-primary btn-sm me-2">Current Affairs Quiz</Link>
          <Link href="/mock-tests" className="btn btn-outline-primary btn-sm">Mock Tests</Link>
        </div>
      </div>
    </main>
  )
}
