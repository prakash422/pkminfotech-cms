import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import { getTeachingExamTypeBySlug } from "@/lib/teaching/teaching-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getTeachingExamTypeBySlug(examType)
  const name = config?.shortName ?? examType
  return {
    title: `${name} PYQ | pkminfotech`,
    description: `Free ${name} previous year questions.`,
  }
}

export default async function TeachingExamPyqPage({ params }: PageProps) {
  const { examType } = await params
  const config = getTeachingExamTypeBySlug(examType)
  if (!config) notFound()

  const displayName = config.shortName
  const base = `/teaching/${config.slug}`
  const navItems = [
    { label: "Practice", href: `${base}/practice` },
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
            { label: "Teaching", href: "/teaching" },
            { label: displayName, href: base },
            { label: "PYQ" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">{displayName} Previous Year Questions</h1>
            <p className="text-secondary mb-0">PYQ sets for {displayName}.</p>
          </div>
        </section>
        <section className="card border shadow-sm">
          <div className="card-body p-4 text-secondary">
            PYQ sets for {displayName} will be added here soon.
          </div>
        </section>
      </div>
    </main>
  )
}
