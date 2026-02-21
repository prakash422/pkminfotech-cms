import Link from "next/link"
import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { RRB_EXAM_TYPES } from "@/lib/rrb/rrb-exam-types"

export const metadata: Metadata = {
  title: "RRB Exam Preparation | NTPC, Group D, JE, ALP, Technician | PKMinfotech",
  description: "Free RRB exam practice, mock tests, daily quiz for NTPC, Group D, JE, ALP, Technician.",
}

export default async function RrbLandingPage() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "RRB" }]} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">RRB Exam Preparation</h1>
            <p className="text-secondary mb-0">
              Choose your exam type. Each has Practice (question sets), Daily Quiz and Mock Test.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {RRB_EXAM_TYPES.map((exam) => (
            <div className="col-md-6 col-lg-4" key={exam.slug}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <h2 className="h5 fw-semibold">{exam.shortName}</h2>
                  <p className="small text-secondary mb-3">{exam.fullName}</p>
                  <p className="small text-muted mb-2">Practice · Daily Quiz · Mock Test · PYQ · Syllabus</p>
                  <Link href={`/rrb/${exam.slug}`} className="btn btn-primary btn-sm">
                    Open {exam.shortName}
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
