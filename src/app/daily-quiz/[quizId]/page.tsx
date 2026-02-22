import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import PracticeQuestionRunner from "@/components/practice/PracticeQuestionRunner"
import { getDateSlug } from "@/lib/current-affairs-quiz"

interface DailyQuizPageProps {
  params: Promise<{ quizId: string }>
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
  orderedQuestions?: QuizQuestion[]
}

type QuizQuestion = {
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
}

const getAttemptedUsersToday = (quizId: string) => {
  const seed = quizId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return 1200 + (seed % 1800)
}

async function getDailyQuiz(quizId: string): Promise<DailyQuizWithMeta | null> {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || "http"
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
  const response = await fetch(
    `${baseUrl}/api/daily-quiz?quizId=${encodeURIComponent(quizId)}&withQuestions=1`,
    { cache: "no-store" }
  )
  if (!response.ok) return null
  const json = (await response.json()) as { data?: DailyQuizWithMeta }
  return json.data || null
}

export async function generateMetadata({ params }: DailyQuizPageProps): Promise<Metadata> {
  const { quizId } = await params
  const quiz = await getDailyQuiz(quizId)
  if (!quiz) {
    return { title: "Daily Quiz Not Found | pkminfotech" }
  }
  return {
    title: `${quiz.title || quiz.quizId} | Free Daily Quiz | pkminfotech`,
    description:
      "Free daily quiz for govt exam aspirants. Mixed sections with instant result and shareable score.",
    keywords:
      "SSC daily quiz today, free daily current affairs quiz, daily quiz for govt exam, reasoning quiz today",
  }
}

export default async function DailyQuizDetailPage({ params }: DailyQuizPageProps) {
  const { quizId } = await params
  const datePart = quizId.startsWith("daily-quiz-") ? quizId.slice("daily-quiz-".length) : ""
  if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    redirect(`/current-affairs-quiz/${getDateSlug(datePart)}`)
  }
  const quiz = await getDailyQuiz(quizId)
  if (!quiz) notFound()
  const orderedQuestions = (quiz.orderedQuestions || []) as QuizQuestion[]

  const sections = (Array.isArray(quiz.sections) ? quiz.sections : []) as Array<{
    name: string
    questions: string[]
  }>

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Daily Quiz", href: "/daily-quiz" },
            { label: quiz.title || quiz.quizId },
          ]}
        />

        <section className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <h1 className="h3 fw-bold mb-2">{quiz.title || quiz.quizId}</h1>
            <p className="mb-0 text-secondary small">
              Attempted by {getAttemptedUsersToday(quiz.quizId).toLocaleString("en-IN")} users today.
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
            defaultLanguage={quiz.language === "hi" ? "hi" : "en"}
            durationMinutes={quiz.durationMinutes}
            sections={sections}
            mockMode
            positiveMarks={quiz.totalQuestions > 0 ? quiz.totalMarks / quiz.totalQuestions : 2}
            negativeMarks={quiz.negativeMarking}
            totalMarks={quiz.totalMarks}
            nextMockUrl="/daily-quiz"
            showGrowthBadges
            attemptedUsersToday={getAttemptedUsersToday(quiz.quizId)}
          />
        )}
      </div>
    </main>
  )
}
