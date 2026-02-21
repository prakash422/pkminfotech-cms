import Link from "next/link"
import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { POLICE_EXAM_TYPES } from "@/lib/police/police-exam-types"

export const metadata: Metadata = {
  title: "Police Exam Preparation | Central Level CAPF, CISF, CRPF | PKMinfotech",
  description: "Free Police exam practice for CAPF, CISF, CRPF. SSC GD under SSC.",
}

export default async function PoliceLandingPage() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Police" }]} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Police Exam Preparation (Central Level)</h1>
            <p className="text-secondary mb-0">
              Choose your exam type. Each has Practice, Daily Quiz and Mock Test.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {POLICE_EXAM_TYPES.map((exam) => {
            const href = "externalLink" in exam && exam.externalLink
              ? exam.externalLink
              : `/police/${exam.slug}`
            return (
              <div className="col-md-6 col-lg-4" key={exam.slug}>
                <article className="card h-100 border shadow-sm">
                  <div className="card-body p-3">
                    <h2 className="h5 fw-semibold">{exam.shortName}</h2>
                    <p className="small text-secondary mb-3">{exam.fullName}</p>
                    <p className="small text-muted mb-2">Practice · Daily Quiz · Mock Test · PYQ · Syllabus</p>
                    <Link href={href} className="btn btn-primary btn-sm">
                      Open {exam.shortName}
                    </Link>
                  </div>
                </article>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
