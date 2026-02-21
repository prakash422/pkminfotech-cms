import Link from "next/link"
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
    title: `${name} | Practice, Daily Quiz, Mock Test | PKMinfotech`,
    description: `Free ${name} practice sets, daily quiz, mock tests, PYQ and syllabus.`,
  }
}

export default async function TeachingExamTypeLandingPage({ params }: PageProps) {
  const { examType } = await params
  const config = getTeachingExamTypeBySlug(examType)
  if (!config) notFound()

  const displayName = config.shortName
  const base = `/teaching/${config.slug}`
  const navItems = [
    { label: "Practice", href: `${base}/practice` },
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
            { label: "Teaching", href: "/teaching" },
            { label: displayName },
          ]}
        />
        <ExamInternalNav examName={displayName} items={navItems} />

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">{displayName}</h1>
            <p className="text-secondary mb-0">
              {config.fullName && <span className="d-block small mb-1">{config.fullName}</span>}
              Practice (question sets), Daily Quiz and Mock Test for {displayName}.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {navItems.map((item) => (
            <div className="col-6 col-md-4" key={item.href}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <h2 className="h6 fw-semibold">{item.label}</h2>
                  <Link href={item.href} className="btn btn-primary btn-sm mt-2">
                    Open {item.label}
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
