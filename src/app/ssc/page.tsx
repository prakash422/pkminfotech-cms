import Link from "next/link"
import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

export const metadata: Metadata = {
  title: "SSC Exam Preparation | CGL, CHSL, MTS, GD, CPO, JE | PKMinfotech",
  description: "Free SSC exam practice, mock tests, daily quiz and PYQ for CGL, CHSL, MTS, GD Constable, CPO, JE, Stenographer, Selection Post.",
}

export default async function SscLandingPage() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "SSC" }]} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">SSC Exam Preparation</h1>
            <p className="text-secondary mb-0">
              Choose your exam type. Each has Practice (question sets), Daily Quiz and Mock Test.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {SSC_EXAM_TYPES.map((exam) => (
            <div className="col-md-6 col-lg-4" key={exam.slug}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <h2 className="h5 fw-semibold">{exam.shortName}</h2>
                  <p className="small text-secondary mb-3">{exam.fullName}</p>
                  <p className="small text-muted mb-2">Practice · Daily Quiz · Mock Test · PYQ · Syllabus</p>
                  <Link href={`/ssc/${exam.slug}`} className="btn btn-primary btn-sm">
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
