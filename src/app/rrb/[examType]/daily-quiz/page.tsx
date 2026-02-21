import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import { getRrbExamTypeBySlug } from "@/lib/rrb/rrb-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  const name = config?.shortName ?? examType
  return {
    title: `${name} Daily Quiz | PKMinfotech`,
    description: `Daily quiz for ${name}.`,
  }
}

export default async function RrbExamDailyQuizPage({ params }: PageProps) {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  if (!config) notFound()

  const displayName = config.shortName
  const base = `/rrb/${config.slug}`
  const navItems = [
    { label: "Practice", href: `${base}/practice` },
    { label: "Daily Quiz", href: `${base}/daily-quiz` },
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
            { label: "RRB", href: "/rrb" },
            { label: displayName, href: base },
            { label: "Daily Quiz" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">{displayName} Daily Quiz</h1>
            <p className="text-secondary mb-0">Daily quiz for {displayName}.</p>
          </div>
        </section>
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
