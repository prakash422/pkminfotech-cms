import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { redirect } from "next/navigation"
import {
  filterQuizzesByMonth,
  getDateSlug,
  getQuizDateSlug,
  formatMonthLabel,
  type QuizForFilter,
} from "@/lib/current-affairs-quiz"
import { ArrowRight, BarChart3, LogIn } from "lucide-react"
import OptimizedImage from "@/components/OptimizedImage"
import CurrentAffairsDateFilter from "@/components/CurrentAffairsDateFilter"
import CurrentAffairsContentSection from "@/components/CurrentAffairsContentSection"

export const metadata: Metadata = {
  title: "Daily Current Affairs Quiz | SSC, RRB, Banking | PKMinfotech",
  description:
    "Practice daily current affairs with updated quiz questions for SSC, RRB, Banking, Railway and other government exams.",
}

type QuizItem = {
  id: string
  quizId: string
  title?: string | null
  totalQuestions?: number
  durationMinutes?: number
  quizDate?: string | null
  createdAt?: string | null
}

async function getQuizzes(): Promise<QuizItem[]> {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || "http"
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/daily-quiz`, { cache: "no-store" })
  if (!res.ok) return []
  const json = (await res.json()) as { data?: QuizItem[] }
  const list = json.data || []
  return list.map((q) => ({
    id: q.id,
    quizId: q.quizId,
    title: q.title,
    totalQuestions: q.totalQuestions ?? 10,
    durationMinutes: q.durationMinutes ?? 10,
    quizDate: (q as QuizItem).quizDate ?? null,
    createdAt: (q as QuizItem).createdAt ?? null,
  }))
}

const HERO_IMAGE = "/home/lalkila.png"
const QUIZ_CARD_IMAGE = "/home/indiagat.jpeg"

function formatQuizDate(quiz: QuizItem): string {
  const dateStr = quiz.quizDate ?? quiz.createdAt
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function formatDateTab(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
}

type PageProps = { searchParams: Promise<{ date?: string }> }

export default async function CurrentAffairsQuizPage({ searchParams }: PageProps) {
  const params = await searchParams
  const dateParam = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : null
  if (dateParam) redirect(`/current-affairs-quiz/${getDateSlug(dateParam)}`)

  const quizzes = await getQuizzes()
  const now = new Date()
  const currentMonthLabel = formatMonthLabel(now.getFullYear(), now.getMonth() + 1)
  const thisMonthQuizzes = filterQuizzesByMonth(quizzes, now.getFullYear(), now.getMonth() + 1)
  const displayQuizzes = thisMonthQuizzes.length > 0 ? thisMonthQuizzes : quizzes.slice(0, 20)

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Daily Current Affairs Quiz" },
          ]}
        />

        <div className="mb-4">
          <h1 className="fw-bold mb-2">Daily Current Affairs Quiz</h1>
          <p className="text-secondary mb-0">
            Practice daily current affairs with our updated quiz questions for SSC, RRB, Banking, Railway and other government exams.
          </p>
        </div>

        <CurrentAffairsDateFilter initialDate={null} />

        {/* Row: quiz section (left) + sidebar Quizzes This Month & Your Statistics (right, upper) */}
        <div className="row">
          <div className="col-lg-8">
            <section className="mb-4">
              <section className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="row g-0">
                  <div className="col-md-4 bg-light d-flex align-items-center justify-content-center p-0 overflow-hidden" style={{ minHeight: 180 }}>
                    <OptimizedImage
                      src={HERO_IMAGE}
                      alt="Lal Qila - Red Fort, Delhi"
                      width={280}
                      height={180}
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body p-4">
                      <span className="badge text-bg-warning mb-2">New</span>
                      <h2 className="h5 fw-bold mb-2">Daily Current Affairs Quiz</h2>
                      <p className="text-secondary small mb-0">
                        Practice daily current affairs with our updated quiz questions for SSC, RRB, Banking, Railway and other government exams.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <h3 className="h6 fw-semibold mb-3">
                Daily Current Affairs Quiz: {currentMonthLabel}
              </h3>

              {displayQuizzes.length === 0 ? (
                <div className="card border shadow-sm">
                  <div className="card-body p-4 text-secondary text-center">
                    No quizzes for this month yet. Check back soon or try another month from the filter.
                  </div>
                </div>
              ) : (
                <>
                  <div className="row g-3">
                    {displayQuizzes.slice(0, 12).map((quiz) => (
                      <div key={quiz.quizId} className="col-sm-6 col-lg-4">
                        <article className="card h-100 border shadow-sm">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-start gap-2 mb-2">
                              <span className="badge text-bg-warning small">New</span>
                              <div className="rounded overflow-hidden flex-shrink-0" style={{ width: 64, height: 48 }}>
                                <OptimizedImage
                                  src={QUIZ_CARD_IMAGE}
                                  alt=""
                                  width={64}
                                  height={48}
                                  className="w-100 h-100 object-cover"
                                />
                              </div>
                            </div>
                            <h4 className="h6 fw-semibold mb-1 line-clamp-2">
                              {quiz.title || `Daily Current Affairs Quiz: ${formatQuizDate(quiz)}`}
                            </h4>
                            <p className="small text-secondary mb-2">
                              {quiz.totalQuestions} Questions · Moderate
                            </p>
                            <p className="small text-secondary mb-3">Attempted: — times</p>
                            <Link
                              href={getQuizDateSlug(quiz) ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}` : "/current-affairs-quiz"}
                              className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2 rounded-2 fw-semibold text-decoration-none"
                              style={{ minHeight: 40 }}
                            >
                              Start Quiz
                              <ArrowRight size={16} aria-hidden />
                            </Link>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                    {displayQuizzes.slice(0, 7).map((quiz) => {
                      const dateStr = quiz.quizDate ?? quiz.createdAt
                      if (!dateStr) return null
                      return (
                        <Link
                          key={quiz.quizId}
                          href={getQuizDateSlug(quiz) ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}` : "/current-affairs-quiz"}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          {formatDateTab(dateStr)}
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="col-lg-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-3">
                <h4 className="h6 fw-semibold mb-2">Quizzes This Month</h4>
                <p className="small text-secondary mb-2">
                  {thisMonthQuizzes.length} quizzes posted in {currentMonthLabel}
                </p>
                <ul className="list-unstyled mb-0 small">
                  {displayQuizzes.slice(0, 5).map((quiz) => (
                    <li key={quiz.quizId} className="mb-2">
                      <Link
                        href={getQuizDateSlug(quiz) ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}` : "/current-affairs-quiz"}
                        className="text-decoration-none d-flex align-items-center justify-content-between"
                      >
                        <span>{formatQuizDate(quiz)} Quiz</span>
                        <ArrowRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/current-affairs-quiz"
                  className="small fw-semibold text-primary text-decoration-none mt-2 d-inline-block"
                >
                  Show All Quizzes
                </Link>
              </div>
            </div>

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
                <Link
                  href="/login"
                  className="btn btn-primary btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2 rounded-2 fw-semibold text-decoration-none"
                  style={{ minHeight: 40 }}
                >
                  <LogIn size={16} aria-hidden />
                  Login to Track
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <hr className="my-4 text-secondary opacity-25" aria-hidden />

        {/* Full-width content */}
        <div className="row">
          <div className="col-12">
            <CurrentAffairsContentSection title="Why current affairs matter for exams">
              <h3 className="h6 fw-bold mb-2">Why daily current affairs matter for government exams</h3>
                <p className="text-secondary mb-3">
                  Most aspirants leave current affairs for the last few weeks. That’s a mistake. Exams like SSC CGL, SSC CHSL, RRB NTPC, IBPS PO, and SBI Clerk dedicate a solid chunk of marks to recent events, schemes, and appointments. If you’re only cramming names and dates a month before the test, you’ll keep forgetting what you read. Spreading it over months with a small daily dose works better.
                </p>
                <p className="text-secondary mb-3">
                  Our daily current affairs quiz is built around that idea. Each set is short enough to finish in a few minutes—during a commute or a break. You pick a date from the calendar, attempt the quiz, and get your score right away. No signup is required to try. The questions cover national and international news, sports, awards, government policies, and banking updates that often show up in prelims and mains.
                </p>

                <h3 className="h6 fw-semibold mt-4 mb-2">Which exams need current affairs?</h3>
                <p className="text-secondary mb-3">
                  Almost every major recruitment in India does. SSC tier 1 has a general awareness section where a lot of questions come from the last six to twelve months. RRB NTPC and Group D both test general knowledge that includes current affairs. In banking, IBPS and SBI papers ask about RBI circulars, new schemes, and economic surveys. State PSCs and police exams also expect you to know recent appointments, new laws, and key events. So whether you’re aiming for a central or state-level job, staying updated pays off.
                </p>

                <h3 className="h6 fw-semibold mt-4 mb-2">How to use these quizzes without burning out</h3>
                <p className="text-secondary mb-3">
                  Don’t try to do five quizzes in one day. One quiz per day is enough. Fix a time—early morning or late evening—and stick to it. After you submit, go through the answers you got wrong and note the correct ones in a small notebook or a doc. Revise that list once a week. Over time you’ll build a personal “current affairs bank” that you can skim before the exam.
                </p>
                <p className="text-secondary mb-3">
                  Use the date filter on this page to pick any day you missed. If you were busy on a Tuesday, you can come back later and take that day’s quiz. The idea is to stay consistent, not perfect. Even 15–20 minutes every day adds up. Many toppers say they didn’t do anything special for current affairs except read one source and practice daily. This section is that practice.
                </p>

                <h3 className="h6 fw-semibold mt-4 mb-2">What we cover in the questions</h3>
                <p className="text-secondary mb-3">
                  The questions are framed the way they appear in real exams: multiple choice, one correct answer. Topics include Union and state government schemes, summits and treaties, sports events and winners, books and authors, science and tech in the news, appointments in important posts, and changes in banking or economic policy. We add new quizzes regularly so that the content stays relevant.
                </p>
                <p className="text-secondary mb-0">
                  You can combine this with our SSC practice sets, mock tests, and PYQ sections for a full preparation plan. A lot of students use the date-wise list to revise a particular week or month before their exam. Bookmark this page and visit whenever you have a few minutes. No login is needed to attempt the quizzes; only if you want to track your accuracy over time do you need an account. Good luck with your preparation.
                </p>
            </CurrentAffairsContentSection>
          </div>
        </div>
      </div>
    </main>
  )
}
