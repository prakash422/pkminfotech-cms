import BreadcrumbNav from "@/components/BreadcrumbNav"
import PracticeQuestionRunner from "@/components/practice/PracticeQuestionRunner"

type BreadcrumbItem = { label: string; href?: string }

type SetWithRelations = {
  title: string
  description: string | null
  language: string | null
  totalQuestions: number | null
  exam: { name: string } | null
  subject: { name: string } | null
  topic: { name: string } | null
  questions: Array<{
    id: string
    questionText: string | null
    questionTextHi: string | null
    optionA: string | null
    optionAHi: string | null
    optionB: string | null
    optionBHi: string | null
    optionC: string | null
    optionCHi: string | null
    optionD: string | null
    optionDHi: string | null
    correctAnswer: string | null
  }>
}

type PracticeSetRunnerContentProps = {
  set: SetWithRelations
  breadcrumbItems: BreadcrumbItem[]
}

export default function PracticeSetRunnerContent({ set, breadcrumbItems }: PracticeSetRunnerContentProps) {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={breadcrumbItems} />

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
            questions={set.questions.map((q) => ({
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
