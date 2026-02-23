import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamInternalNav from "@/components/ExamInternalNav"
import { ArrowRight } from "lucide-react"

export type ExamNavItem = { label: string; href: string }

export type PracticeSetItem = {
  id: string
  title: string
  slug: string
  /** Slug to use in URL: shortSlug (e.g. mini-1) when set, else slug */
  urlSlug: string
  questionCount: number
}

type ExamTypeLandingProps = {
  categoryLabel: string
  categoryHref: string
  displayName: string
  fullName?: string
  base: string
  navItems: ExamNavItem[]
  practiceSets?: PracticeSetItem[]
  /** Optional SEO/content section rendered below practice sets */
  bottomContent?: React.ReactNode
}

export default function ExamTypeLanding({
  categoryLabel,
  categoryHref,
  displayName,
  fullName,
  base,
  navItems,
  practiceSets = [],
  bottomContent,
}: ExamTypeLandingProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryLabel, href: categoryHref },
    { label: displayName },
  ]

  const showPracticeSets = practiceSets.length > 0

  return (
    <main className="bg-light py-4">
      <div className="container exam-type-landing-container">
        <BreadcrumbNav items={breadcrumbItems} />
        <ExamInternalNav examName={displayName} items={navItems} variant="tabs" basePath={base} />

        <section className="card border-0 shadow-sm mb-3 exam-type-landing-hero">
          <div className="card-body p-3 p-md-4 exam-type-landing-hero-body">
            <h1 className="fw-bold mb-0 exam-type-landing-title">{displayName}</h1>
            {fullName && (
              <p className="text-secondary mb-1 mt-0 exam-type-landing-subtitle">{fullName}</p>
            )}
            <p className="text-secondary mb-0 small exam-type-landing-desc">
              {showPracticeSets
                ? `Question sets for ${displayName}. Start with any set.`
                : `Practice sets, mock tests, PYQ and syllabus for ${displayName}.`}
            </p>
          </div>
        </section>

        {showPracticeSets ? (
          <section className="row g-3" aria-label="Practice sets">
            {practiceSets.map((set) => (
              <div className="col-md-6 col-lg-4" key={set.id}>
                <article className="card h-100 border shadow-sm exam-type-landing-set-card">
                  <div className="card-body p-3 d-flex flex-column">
                    <h2 className="h6 fw-semibold mb-1 exam-type-landing-set-title">{set.title}</h2>
                    <p className="small text-secondary mb-3">{set.questionCount} questions</p>
                    <Link
                      href={`${base}/practice/${set.urlSlug}`}
                      className="btn btn-primary btn-sm mt-auto align-self-start exam-type-landing-cta"
                    >
                      Start Practice <ArrowRight size={14} className="ms-1" />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </section>
        ) : (
          <section className="card border shadow-sm" aria-label="Practice sets">
            <div className="card-body p-4 text-secondary text-center">
              No practice sets for {displayName} yet. Check back later or try Mock Test or PYQ from the tabs above.
            </div>
          </section>
        )}

        {bottomContent && <div className="mt-4">{bottomContent}</div>}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .exam-type-landing-container { max-width: 1120px; }
        .exam-type-landing-hero,
        .exam-type-landing-hero .card-body {
          border-radius: 10px;
          background: linear-gradient(145deg, #ffffff 0%, #f5f7fa 45%, #eef2f7 100%) !important;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }
        .exam-type-landing-hero-body { padding: 0.65rem 1rem !important; }
        @media (min-width: 768px) {
          .exam-type-landing-hero-body { padding: 0.85rem 1.25rem !important; }
        }
        .exam-type-landing-title { font-size: 1.25rem; line-height: 1.3; }
        .exam-type-landing-subtitle { font-size: 0.875rem; }
        .exam-type-landing-desc { max-width: 560px; font-size: 0.8rem !important; line-height: 1.4; }
        .exam-type-landing-card,
        .exam-type-landing-card .card-body {
          background: linear-gradient(145deg, #ffffff 0%, #f6f8fb 50%, #eef2f7 100%) !important;
        }
        .exam-type-landing-card {
          border-radius: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(226, 232, 240, 0.9) !important;
        }
        .exam-type-landing-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1) !important;
        }
        .exam-type-landing-card:hover,
        .exam-type-landing-card:hover .card-body {
          background: linear-gradient(145deg, #ffffff 0%, #eef2f7 50%, #e2e8f0 100%) !important;
        }
        .exam-type-landing-icon {
          width: 44px;
          height: 44px;
          background: #e0f2fe;
          flex-shrink: 0;
        }
        .exam-type-landing-card-title { font-size: 1rem; }
        .exam-type-landing-cta {
          background: #2563eb !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
          padding: 0 0.65rem;
          height: 28px;
          line-height: 1;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 8px;
        }
        .exam-type-landing-cta:hover {
          background: #1d4ed8 !important;
          color: #fff !important;
          transform: translateY(-1px);
        }
        .exam-type-landing-set-card,
        .exam-type-landing-set-card .card-body {
          background: linear-gradient(145deg, #ffffff 0%, #f6f8fb 50%, #eef2f7 100%) !important;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.9) !important;
        }
        .exam-type-landing-set-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .exam-type-landing-set-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1) !important;
        }
        .exam-type-landing-set-card:hover,
        .exam-type-landing-set-card:hover .card-body {
          background: linear-gradient(145deg, #ffffff 0%, #eef2f7 50%, #e2e8f0 100%) !important;
        }
        .exam-type-landing-set-title { font-size: 0.95rem; }
      `}} />
    </main>
  )
}
