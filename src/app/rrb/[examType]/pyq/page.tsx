import Link from "next/link"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
import { prisma } from "@/lib/prisma"
import { resolveExamByCategoryAndSlug, getExamTypeSlug } from "@/lib/exam-categories"
import { getRrbExamTypeBySlug, RRB_EXAM_TYPES } from "@/lib/rrb/rrb-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const examRecord = await resolveExamByCategoryAndSlug("rrb", examType)
  const config = getRrbExamTypeBySlug(examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  return {
    title: `${name} PYQ | PKMinfotech`,
    description: `Free ${name} previous year questions.`,
  }
}

export default async function RrbExamPyqPage({ params }: PageProps) {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("rrb", examType)
  if (!config && !examRecord) notFound()

  const category = "rrb"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? RRB_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/rrb/${canonicalTypeSlug}/pyq`)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/rrb/${canonicalTypeSlug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Daily Quiz", href: `${base}/daily-quiz` },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  const sets = examRecord
    ? await prisma.practiceSet.findMany({
        where: {
          examId: examRecord.id,
          isActive: true,
          questions: { some: { year: { not: null }, isActive: true } },
        },
        include: { _count: { select: { questions: true } } },
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
            { label: "RRB", href: "/rrb" },
            { label: displayName, href: base },
            { label: "PYQ" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} />
        <ExamTabHero
          title={`${displayName} Previous Year Questions`}
          description="Topic-wise PYQ sets from previous papers."
        />
        {sets.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              PYQ sets for {displayName} will be added here soon.
            </div>
          </section>
        ) : (
          <section className="row g-3">
            {sets.map((set: { id: string; title: string; slug: string; shortSlug?: string | null; _count?: { questions: number } }) => (
              <div className="col-md-6 col-lg-4" key={set.id}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3">
                    <h2 className="h6 fw-semibold">{set.title}</h2>
                    <p className="small text-secondary mb-3">{set._count?.questions ?? 0} questions</p>
                    <Link href={`${base}/practice/${set.shortSlug ?? set.slug}`} className="btn btn-primary btn-sm">
                      Practice PYQ
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
