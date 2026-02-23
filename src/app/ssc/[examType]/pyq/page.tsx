import Link from "next/link"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
import PyqSeoContent from "@/components/PyqSeoContent"
import { prisma } from "@/lib/prisma"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getSscExamTypeBySlug, SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  const config = getSscExamTypeBySlug(examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  const canonicalPath = `/ssc/${examType}/pyq`
  const title = `${name} PYQ | Previous Year Questions | pkminfotech`
  const description = `Free ${name} previous year question (PYQ) practice sets. Topic-wise and year-wise PYQ with timer and negative marking for exam preparation.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function SscExamPyqPage({ params }: PageProps) {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  if (!config && !examRecord) notFound()

  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? SSC_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/ssc/${canonicalTypeSlug}/pyq`)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/ssc/${canonicalTypeSlug}`
  const navItems = [
    { label: "Practice", href: base },
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
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} forceActiveHref={`${base}/pyq`} />
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

        <PyqSeoContent displayName={displayName} base={base} categoryLabel="SSC" categoryHref="/ssc" />
      </div>
    </main>
  )
}
