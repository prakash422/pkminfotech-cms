import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import PracticeQuestionRunner from "@/components/practice/PracticeQuestionRunner"
import {
  parseMonthSlug,
  parseDateSlug,
  dateSlugToYyyyMmDd,
  filterQuizzesByMonth,
  filterQuizzesByDate,
  formatMonthLabel,
  getQuizDateSlug,
  type QuizForFilter,
} from "@/lib/current-affairs-quiz"
import { ArrowRight, BarChart3, LogIn } from "lucide-react"
import OptimizedImage from "@/components/OptimizedImage"
import CurrentAffairsDateFilter from "@/components/CurrentAffairsDateFilter"

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

type DailyQuizWithMeta = {
  quizId: string
  title?: string | null
  totalQuestions: number
  totalMarks: number
  negativeMarking: number
  durationMinutes: number
  language: string
  questionIds: string[]
  sections?: unknown
  orderedQuestions?: Array<{
    id: string
    questionText: string
    questionTextHi: string | null
    optionA: string
    optionAHi: string | null
    optionB: string
    optionBHi: string | null
    optionC: string
    optionCHi: string | null
    optionD: string
    optionDHi: string | null
    correctAnswer: string
  }>
}

async function getDailyQuiz(quizId: string): Promise<DailyQuizWithMeta | null> {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || "http"
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(
    `${baseUrl}/api/daily-quiz?quizId=${encodeURIComponent(quizId)}&withQuestions=1`,
    { cache: "no-store" }
  )
  if (!res.ok) return null
  const json = (await res.json()) as { data?: DailyQuizWithMeta }
  return json.data || null
}

const getAttemptedUsersToday = (quizId: string) => {
  const seed = quizId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return 1200 + (seed % 1800)
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

interface PageProps {
  params: Promise<{ month: string }>
  searchParams: Promise<{ quiz?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month } = await params
  const dateParsed = parseDateSlug(month)
  const monthParsed = parseMonthSlug(month)
  const label = dateParsed
    ? new Date(dateParsed.year, dateParsed.month - 1, dateParsed.day).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : monthParsed
      ? formatMonthLabel(monthParsed.year, monthParsed.month)
      : month
  return {
    title: `Daily Current Affairs Quiz - ${label} | pkminfotech`,
    description: `Practice daily current affairs quiz for ${label}. SSC, RRB, Banking and govt exam preparation.`,
  }
}

export default async function CurrentAffairsQuizMonthPage({ params, searchParams }: PageProps) {
  const { month } = await params
  const { quiz: quizIdParam } = await searchParams

  const dateParsed = parseDateSlug(month)
  const monthParsed = parseMonthSlug(month)

  if (dateParsed) {
    const quizzes = await getQuizzes()
    const dateStr = dateSlugToYyyyMmDd(dateParsed)
    const displayQuizzes = filterQuizzesByDate(quizzes, dateStr)
    const dateLabel = new Date(dateParsed.year, dateParsed.month - 1, dateParsed.day).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

    const runQuizId = quizIdParam ?? (displayQuizzes.length === 1 ? displayQuizzes[0].quizId : null)
    if (runQuizId) {
      const fullQuiz = await getDailyQuiz(runQuizId)
      if (fullQuiz) {
        const orderedQuestions: NonNullable<DailyQuizWithMeta["orderedQuestions"]> = fullQuiz.orderedQuestions ?? []
        const sections = (Array.isArray(fullQuiz.sections) ? fullQuiz.sections : []) as Array<{ name: string; questions: string[] }>
        return (
          <main className="bg-light py-4">
            <div className="container" style={{ maxWidth: 1120 }}>
              <BreadcrumbNav
                items={[
                  { label: "Home", href: "/" },
                  { label: "Current Affairs Quiz", href: "/current-affairs-quiz" },
                  { label: fullQuiz.title || dateLabel },
                ]}
              />
              <section className="card border-0 shadow-sm mb-3">
                <div className="card-body p-3 p-md-4">
                  <h1 className="h3 fw-bold mb-2">{fullQuiz.title || dateLabel}</h1>
                  <p className="mb-0 text-secondary small">
                    Attempted by {getAttemptedUsersToday(fullQuiz.quizId).toLocaleString("en-IN")} users today.
                  </p>
                </div>
              </section>
              {orderedQuestions.length === 0 ? (
                <section className="card border shadow-sm">
                  <div className="card-body p-4 text-secondary">Questions not available for this quiz yet.</div>
                </section>
              ) : (
                <PracticeQuestionRunner
                  questions={orderedQuestions.map((q) => ({
                    id: q.id,
                    questionText: q.questionText,
                    questionTextHi: q.questionTextHi,
                    optionA: q.optionA,
                    optionAHi: q.optionAHi,
                    optionB: q.optionB,
                    optionBHi: q.optionBHi,
                    optionC: q.optionC,
                    optionCHi: q.optionCHi,
                    optionD: q.optionD,
                    optionDHi: q.optionDHi,
                    correctAnswer: q.correctAnswer,
                  }))}
                  defaultLanguage={fullQuiz.language === "hi" ? "hi" : "en"}
                  durationMinutes={fullQuiz.durationMinutes}
                  sections={sections}
                  mockMode
                  positiveMarks={fullQuiz.totalQuestions > 0 ? fullQuiz.totalMarks / fullQuiz.totalQuestions : 2}
                  negativeMarks={fullQuiz.negativeMarking}
                  totalMarks={fullQuiz.totalMarks}
                  nextMockUrl="/current-affairs-quiz"
                  showGrowthBadges
                  attemptedUsersToday={getAttemptedUsersToday(fullQuiz.quizId)}
                />
              )}
            </div>
          </main>
        )
      }
    }

    return (
      <CurrentAffairsQuizSlugContent
        slugType="date"
        monthLabel={dateLabel}
        displayQuizzes={displayQuizzes}
        initialDateStr={dateStr}
        breadcrumbLabel={dateLabel}
        dateSlug={month}
      />
    )
  }

  if (!monthParsed) notFound()

  // Slug is e.g. february-2026 → month view
  const quizzes = await getQuizzes()
  const monthQuizzes = filterQuizzesByMonth(quizzes, monthParsed.year, monthParsed.month)
  const monthLabel = formatMonthLabel(monthParsed.year, monthParsed.month)
  return (
    <CurrentAffairsQuizSlugContent
      slugType="month"
      monthLabel={monthLabel}
      displayQuizzes={monthQuizzes}
      initialDateStr={null}
      breadcrumbLabel={monthLabel}
    />
  )
}

type SlugContentProps = {
  slugType: "date" | "month"
  monthLabel: string
  displayQuizzes: QuizItem[]
  initialDateStr: string | null
  breadcrumbLabel: string
  /** When slugType is "date", use this for links so multi-quiz days can use ?quiz=id */
  dateSlug?: string
}

async function CurrentAffairsQuizSlugContent({ slugType, monthLabel, displayQuizzes, initialDateStr, breadcrumbLabel, dateSlug }: SlugContentProps) {

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Daily Current Affairs Quiz", href: "/current-affairs-quiz" },
            { label: breadcrumbLabel },
          ]}
        />

        <div className="mb-4">
          <h1 className="fw-bold mb-2">Daily Current Affairs Quiz</h1>
          <p className="text-secondary mb-0">
            Practice daily current affairs with our updated quiz questions for SSC, RRB, Banking, Railway and other government exams.
          </p>
        </div>

        <CurrentAffairsDateFilter initialDate={initialDateStr} />

        {/* Full-width section: hero + quiz cards (3 per row) */}
        <section className="mb-4">
          <section className="card border-0 shadow-sm mb-4 overflow-hidden">
            <div className="row g-0">
              <div className="col-md-4 bg-light p-0 overflow-hidden" style={{ minHeight: 180 }}>
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
                    Quizzes for {monthLabel}. Practice daily current affairs for SSC, RRB, Banking and other government exams.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <h3 className="h6 fw-semibold mb-3">
            Daily Current Affairs Quiz: {monthLabel}
          </h3>

          {displayQuizzes.length === 0 ? (
            <div className="card border shadow-sm">
              <div className="card-body p-4 text-secondary text-center">
                No quizzes for {monthLabel}. Try another month from the filter above.
              </div>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {displayQuizzes.map((quiz) => (
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
                          href={
                            slugType === "date" && dateSlug && displayQuizzes.length > 1
                              ? `/current-affairs-quiz/${dateSlug}?quiz=${encodeURIComponent(quiz.quizId)}`
                              : getQuizDateSlug(quiz)
                                ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}`
                                : "/current-affairs-quiz"
                          }
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
                      href={
                        slugType === "date" && dateSlug && displayQuizzes.length > 1
                          ? `/current-affairs-quiz/${dateSlug}?quiz=${encodeURIComponent(quiz.quizId)}`
                          : getQuizDateSlug(quiz)
                            ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}`
                            : "/current-affairs-quiz"
                      }
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

        <div className="row">
          <div className="col-lg-8" />

          <aside className="col-lg-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-3">
                <h4 className="h6 fw-semibold mb-2">Quizzes This Month</h4>
                <p className="small text-secondary mb-2">
                  {displayQuizzes.length} quizzes posted in {monthLabel}
                </p>
                <ul className="list-unstyled mb-0 small">
                  {displayQuizzes.slice(0, 5).map((quiz) => (
                    <li key={quiz.quizId} className="mb-2">
                      <Link
                        href={
                          slugType === "date" && dateSlug && displayQuizzes.length > 1
                            ? `/current-affairs-quiz/${dateSlug}?quiz=${encodeURIComponent(quiz.quizId)}`
                            : getQuizDateSlug(quiz)
                              ? `/current-affairs-quiz/${getQuizDateSlug(quiz)}`
                              : "/current-affairs-quiz"
                        }
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
      </div>
    </main>
  )
}
