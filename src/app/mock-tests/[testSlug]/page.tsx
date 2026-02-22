import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import PracticeQuestionRunner from "@/components/practice/PracticeQuestionRunner"
import { prisma } from "@/lib/prisma"

interface MockTestDetailPageProps {
  params: Promise<{
    testSlug: string
  }>
}

interface MockQuestionLite {
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

interface MockSectionLite {
  name: string
  questions: string[]
}

async function getMockTestBySlug(testSlug: string) {
  return prisma.mockTest.findFirst({
    where: { mockId: testSlug, isActive: true },
    include: {
      exam: true,
    },
  })
}

export async function generateMetadata({ params }: MockTestDetailPageProps): Promise<Metadata> {
  const { testSlug } = await params
  const test = await getMockTestBySlug(testSlug)

  if (!test) {
    return {
      title: "Mock Test Not Found | pkminfotech",
      description: "Requested mock test could not be found.",
    }
  }

  return {
    title: `${test.title} | Mock Test | pkminfotech`,
    description: `Take ${test.title} mock test with timer, navigation and instant result.`,
  }
}

export default async function MockTestDetailPage({ params }: MockTestDetailPageProps) {
  const { testSlug } = await params
  const test = await getMockTestBySlug(testSlug)

  if (!test) notFound()

  const questionIds = test.questionIds || []
  const dbQuestions = (await prisma.question.findMany({
    where: {
      id: { in: questionIds },
      isActive: true,
    },
  })) as MockQuestionLite[]
  const questionMap = new Map(dbQuestions.map((q: MockQuestionLite) => [q.id, q]))
  const orderedQuestions = questionIds
    .map((id: string) => questionMap.get(id))
    .filter(Boolean) as MockQuestionLite[]

  const questionCount = test.totalQuestions || orderedQuestions.length || 0
  const durationMinutes = test.durationMinutes || Math.max(questionCount, 10)
  const sections = (Array.isArray(test.sections) ? test.sections : []) as MockSectionLite[]

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Mock Tests", href: "/mock-tests" },
            { label: test.title },
          ]}
        />

        <section className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <h1 className="h3 fw-bold mb-2">{test.title}</h1>
            <div className="d-flex flex-wrap gap-2 mb-2">
              <span className="badge text-bg-primary-subtle text-primary-emphasis">
                {test.exam?.name || "Exam"}
              </span>
              <span className="badge text-bg-light border text-secondary">
                {questionCount} questions
              </span>
              <span className="badge text-bg-light border text-secondary">{durationMinutes} min</span>
              <span className="badge text-bg-light border text-secondary">Total Marks: {test.totalMarks}</span>
              <span className="badge text-bg-light border text-secondary">Negative: {test.negativeMarking}</span>
            </div>
            <p className="mb-0 text-secondary small">
              Timer enabled mock test flow with mark for review and instant submit result.
            </p>
          </div>
        </section>

        {orderedQuestions.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              Is mock test me abhi questions add nahi hue hain.
            </div>
          </section>
        ) : (
          <PracticeQuestionRunner
            questions={orderedQuestions.map((q: MockQuestionLite) => ({
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
            defaultLanguage={test.language === "hi" ? "hi" : "en"}
            durationMinutes={durationMinutes}
            sections={sections}
            mockMode
            positiveMarks={questionCount > 0 ? test.totalMarks / questionCount : 2}
            negativeMarks={test.negativeMarking}
            totalMarks={test.totalMarks}
            nextMockUrl="/mock-tests"
          />
        )}
      </div>
    </main>
  )
}
