import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import { getPoliceExamTypeBySlug } from "@/lib/police/police-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getPoliceExamTypeBySlug(examType)
  if (config && "externalLink" in config && config.externalLink)
    return { title: "Redirect | pkminfotech" }
  const name = config?.shortName ?? examType
  const canonicalPath = `/police/${examType}/mock-test`
  const title = `${name} Mock Test | pkminfotech`
  const description = `Free ${name} full-length mock tests with timer and instant result. Practice before the real police exam.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function PoliceExamMockTestPage({ params }: PageProps) {
  const { examType } = await params
  const config = getPoliceExamTypeBySlug(examType)
  if (!config) notFound()
  if ("externalLink" in config && config.externalLink) redirect(config.externalLink)

  const displayName = config.shortName
  const base = `/police/${config.slug}`
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
            { label: "Police", href: "/police" },
            { label: displayName, href: base },
            { label: "Mock Test" },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">{displayName} Mock Test</h1>
            <p className="text-secondary mb-0">Full-length mock tests for {displayName}.</p>
          </div>
        </section>
        <section className="card border shadow-sm">
          <div className="card-body p-4 text-secondary">
            Mock tests for {displayName} will be added here soon.
          </div>
        </section>
      </div>
    </main>
  )
}
