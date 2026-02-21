import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import PracticeQuestionRunner from "@/components/practice/PracticeQuestionRunner"
import { prisma } from "@/lib/prisma"

interface PracticeSetPageProps {
  params: Promise<{
    setSlug: string
  }>
}

async function getPracticeSetBySlug(setSlug: string) {
  return prisma.practiceSet.findFirst({
    where: { slug: setSlug, isActive: true },
    include: {
      exam: true,
      state: true,
      subject: true,
      topic: true,
      questions: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function generateMetadata({ params }: PracticeSetPageProps): Promise<Metadata> {
  const { setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)

  if (!set) {
    return {
      title: "Practice Set Not Found | PKMinfotech",
      description: "The requested practice set could not be found.",
    }
  }

  return {
    title: `${set.title} | Practice Set | PKMinfotech`,
    description:
      set.description ||
      `Practice ${set.title} with ${set.questions.length || set.totalQuestions} MCQs in English and Hindi.`,
  }
}

export default async function PracticeSetPage({ params }: PracticeSetPageProps) {
  const { setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)

  if (!set) notFound()

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Practice Sets", href: "/practice" },
            { label: set.title },
          ]}
        />

        <section className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <h1 className="h3 fw-bold mb-2">{set.title}</h1>
            <div className="d-flex flex-wrap gap-2 mb-2">
              <span className="badge text-bg-info-subtle text-info-emphasis">{set.exam?.name || "Exam"}</span>
              {set.subject?.name && (
                <span className="badge text-bg-light border text-secondary">{set.subject.name}</span>
              )}
              {set.topic?.name && (
                <span className="badge text-bg-light border text-secondary">{set.topic.name}</span>
              )}
              <span className="badge text-bg-light border text-secondary">
                {set.language === "hi" ? "Hindi" : set.language === "bilingual" ? "Bilingual" : "English"}
              </span>
            </div>
            <p className="mb-0 text-secondary small">
              {set.questions.length} questions available. Language toggle support: English / Hindi.
            </p>
          </div>
        </section>

        {set.questions.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              Questions abhi add nahi huye hain. Admin panel se question add karte hi yaha show honge.
            </div>
          </section>
        ) : (
          <PracticeQuestionRunner
            questions={set.questions.map((q:any) => ({
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
            defaultLanguage={set.language === "hi" ? "hi" : "en"}
          />
        )}
      </div>
    </main>
  )
}
