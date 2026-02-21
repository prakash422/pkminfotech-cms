import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
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
    title: `${name} PYQ | Previous Year Questions | PKMinfotech`,
    description: `Free ${name} previous year question practice sets.`,
  }
}

export default async function SscExamPyqPage({ params }: PageProps) {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  if (!config && !examRecord) notFound()

  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/ssc/${typeSlug}`
  const navItems = [
    { label: "Practice", href: `${base}/practice` },
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
            { label: "SSC", href: "/ssc" },
            { label: displayName, href: base },
            { label: "PYQ" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">{displayName} Previous Year Questions</h1>
            <p className="text-secondary mb-0">Topic-wise PYQ sets from previous papers.</p>
          </div>
        </section>

        {sets.length === 0 ? (
          <section className="card border shadow-sm">
            <div className="card-body p-4 text-secondary">
              PYQ sets for {displayName} will be added here soon.
            </div>
          </section>
        ) : (
          <section className="row g-3">
            {sets.map((set: { id: string; title: string; slug: string; _count?: { questions: number } }) => (
              <div className="col-md-6 col-lg-4" key={set.id}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3">
                    <h2 className="h6 fw-semibold">{set.title}</h2>
                    <p className="small text-secondary mb-3">{set._count?.questions ?? 0} questions</p>
                    <Link href={`/practice/${set.slug}`} className="btn btn-primary btn-sm">
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
