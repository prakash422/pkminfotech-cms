import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
import { resolveExamByCategoryAndSlug, getExamTypeSlug } from "@/lib/exam-categories"
import { getBankingExamTypeBySlug, BANKING_EXAM_TYPES } from "@/lib/banking/banking-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getBankingExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("banking", examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  return {
    title: `${name} Daily Quiz | pkminfotech`,
    description: `Daily quiz for ${name}.`,
  }
}

export default async function BankingExamDailyQuizPage({ params }: PageProps) {
  const { examType } = await params
  const config = getBankingExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("banking", examType)
  if (!config && !examRecord) notFound()

  const category = "banking"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? BANKING_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/banking/${canonicalTypeSlug}/daily-quiz`)

  const displayName = examRecord?.name ?? config?.shortName ?? examType
  const base = `/banking/${canonicalTypeSlug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || "http"
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
  const response = await fetch(`${baseUrl}/api/daily-quiz`, { cache: "no-store" })
  const json = response.ok ? ((await response.json()) as { data?: Array<{ id: string; quizId: string; title?: string }> }) : { data: [] }
  const quizzes = json.data || []

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Banking", href: "/banking" },
            { label: displayName, href: base },
            { label: "Daily Quiz" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} />
        <ExamTabHero
          title={`${displayName} Daily Quiz`}
          description={`Daily quiz for ${displayName}. Attempt and see instant result.`}
        />
        {quizzes.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              Daily quizzes for {displayName} will be added here soon.
            </div>
          </section>
        ) : (
          <section className="row g-3">
            {quizzes.map((quiz) => (
              <div className="col-md-6" key={quiz.id}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3">
                    <h2 className="h6 fw-semibold">{quiz.title || quiz.quizId}</h2>
                    <Link href={`/daily-quiz/${quiz.quizId}`} className="btn btn-primary btn-sm mt-2">
                      Attempt Quiz
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
