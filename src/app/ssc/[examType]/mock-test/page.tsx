import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
import { prisma } from "@/lib/prisma"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getSscExamTypeBySlug } from "@/lib/ssc/ssc-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  const config = getSscExamTypeBySlug(examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  return {
    title: `${name} Mock Test | pkminfotech`,
    description: `Free ${name} mock tests with timer and result.`,
  }
}

export default async function SscExamMockTestPage({ params }: PageProps) {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  if (!config && !examRecord) notFound()

  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/ssc/${typeSlug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  const tests = examRecord
    ? await prisma.mockTest.findMany({
        where: { examId: examRecord.id, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : []

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "SSC", href: "/ssc" },
            { label: displayName, href: base },
            { label: "Mock Test" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} />
        <ExamTabHero
          title={`${displayName} Mock Test`}
          description="Full-length mock tests with timer and instant result."
        />

        {tests.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              Mock tests for {displayName} will be added here soon.
            </div>
          </section>
        ) : (
          <section className="row g-3">
            {tests.map((test: { id: string; mockId: string; title: string | null; totalQuestions: number; durationMinutes: number }) => (
              <div className="col-md-6" key={test.id}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge text-bg-primary-subtle text-primary-emphasis">{test.totalQuestions} Qs</span>
                      <span className="small text-secondary">{test.durationMinutes} min</span>
                    </div>
                    <h2 className="h6 fw-semibold">{test.title || test.mockId}</h2>
                    <Link href={`/mock-tests/${test.mockId}`} className="btn btn-primary btn-sm mt-2">
                      Start Test
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
