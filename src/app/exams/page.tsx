import Link from "next/link"
import type { Metadata } from "next"
import { examCategories } from "@/data/exam-platform"
import BreadcrumbNav from "@/components/BreadcrumbNav"

export const metadata: Metadata = {
  title: "Exam Practice Categories | PKMinfotech",
  description: "Browse exam practice categories including SSC, Banking, Railway, UPSC and more.",
}

export default function ExamsPage() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Exam Practice" },
          ]}
        />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Exam Practice Categories</h1>
            <p className="text-secondary mb-0">
              Choose your exam and start free practice sets with mock tests.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {examCategories.map((exam) => (
            <div className="col-sm-6 col-lg-4" key={exam.slug}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <h2 className="h5 fw-semibold">{exam.name}</h2>
                  <p className="text-secondary small mb-3">{exam.description}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="badge text-bg-primary-subtle text-primary-emphasis">
                      {exam.tests} tests
                    </span>
                    <Link href={`/exams/${exam.slug}`} className="btn btn-primary btn-sm">
                      Explore
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
