import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
import { resolveExamByCategoryAndSlug, getExamTypeSlug } from "@/lib/exam-categories"
import { getSscExamTypeBySlug, SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  const canonicalPath = `/ssc/${examType}/daily-quiz`
  const title = `${name} Daily Quiz | pkminfotech`
  const description = `Free daily quiz for ${name}. Mixed topics with timer and instant result for SSC exam preparation.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function SscExamDailyQuizPage({ params }: PageProps) {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  if (!config && !examRecord) notFound()

  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? SSC_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/ssc/${canonicalTypeSlug}/daily-quiz`)

  const displayName = examRecord?.name ?? config?.shortName ?? examType
  const base = `/ssc/${canonicalTypeSlug}`
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
      <div className="container exam-tab-container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "SSC", href: "/ssc" },
            { label: displayName, href: base },
            { label: "Daily Quiz" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} forceActiveHref={`${base}/daily-quiz`} />
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
