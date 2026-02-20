import Link from "next/link"
import type { Metadata } from "next"
import { practiceSets } from "@/data/exam-platform"
import BreadcrumbNav from "@/components/BreadcrumbNav"

export const metadata: Metadata = {
  title: "Topic-wise Practice Sets | PKMinfotech",
  description: "Practice topic-wise MCQs for SSC, Banking, Railway and UPSC exams.",
}

export default function PracticePage() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Practice Sets" },
          ]}
        />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Topic-wise Practice Sets</h1>
            <p className="text-secondary mb-0">
              Improve accuracy with focused question sets by subject and topic.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {practiceSets.map((set) => (
            <div className="col-sm-6 col-lg-4" key={set.slug}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge text-bg-info-subtle text-info-emphasis">{set.exam}</span>
                    <span className="small text-secondary">{set.questions} Qs</span>
                  </div>
                  <h2 className="h6 fw-semibold">{set.title}</h2>
                  <p className="small text-secondary mb-3">{set.topic}</p>
                  <Link href={`/practice/${set.slug}`} className="btn btn-primary btn-sm">
                    Practice Now
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
