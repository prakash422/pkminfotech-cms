import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
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
    title: `${name} Syllabus | pkminfotech`,
    description: `${name} exam syllabus.`,
  }
}

export default async function RrbExamSyllabusPage({ params }: PageProps) {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("rrb", examType)
  if (!config && !examRecord) notFound()

  const category = "rrb"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? RRB_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/rrb/${canonicalTypeSlug}/syllabus`)
  const displayName = examRecord?.name ?? config?.shortName ?? examType
  const base = `/rrb/${canonicalTypeSlug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "RRB", href: "/rrb" },
            { label: displayName, href: base },
            { label: "Syllabus" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} />
        <ExamTabHero
          title={`${displayName} Syllabus`}
          description={`Syllabus and exam pattern for ${displayName}.`}
        />
        <section className="card border shadow-sm">
          <div className="card-body p-4 text-secondary">
            Syllabus for {displayName} will be added here soon.
          </div>
        </section>
      </div>
    </main>
  )
}
