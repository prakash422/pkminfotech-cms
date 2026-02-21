import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import ExamTabHero from "@/components/ExamTabHero"
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
    title: `${name} Syllabus | PKMinfotech`,
    description: `${name} exam syllabus and pattern.`,
  }
}

export default async function SscExamSyllabusPage({ params }: PageProps) {
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
    { label: "Daily Quiz", href: `${base}/daily-quiz` },
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
            { label: "SSC", href: "/ssc" },
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
            Syllabus details for {displayName} will be added here soon. Use Practice, Daily Quiz and Mock Test to prepare.
          </div>
        </section>
      </div>
    </main>
  )
}
