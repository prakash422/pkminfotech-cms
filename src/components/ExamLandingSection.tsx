import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { BookOpenCheck, ArrowRight, ClipboardList, FileQuestion, LayoutList } from "lucide-react"

type ExamItem = {
  slug: string
  shortName: string
  fullName: string
  href?: string
}

const CARD_TONES = ["exam-tone-1", "exam-tone-2", "exam-tone-3", "exam-tone-4"] as const

type Props = {
  categoryLabel: string
  title: string
  subtitle: string
  basePath: string
  exams: readonly ExamItem[]
}

export default function ExamLandingSection({ categoryLabel, title, subtitle, basePath, exams }: Props) {
  return (
    <main className="exam-landing-page py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: categoryLabel }]} />

        <section className="exam-landing-hero rounded-3 overflow-hidden mb-4">
          <div className="exam-landing-hero-inner p-4 p-md-5">
            <h1 className="exam-landing-title mb-2">{title}</h1>
            <p className="exam-landing-subtitle mb-0">{subtitle}</p>
          </div>
        </section>

        <section className="row g-3">
          {exams.map((exam, index) => {
            const tone = CARD_TONES[index % CARD_TONES.length]
            return (
              <div className="col-md-6 col-lg-4" key={exam.slug}>
                <Link
                  href={`${basePath}/${exam.slug}`}
                  className="exam-landing-card card h-100 border-0 text-decoration-none text-dark d-block"
                >
                  <div className="card-body p-4">
                    <div className={`exam-landing-card-icon rounded-3 mb-3 ${tone}`}>
                      <BookOpenCheck size={24} className="text-primary" />
                    </div>
                    <h2 className="h5 fw-bold mb-1">{exam.shortName}</h2>
                    <p className="small text-secondary mb-3">{exam.fullName}</p>
                    <ul className="exam-feature-list list-unstyled small text-muted mb-3">
                      <li><ClipboardList size={14} className="me-2" /> Practice</li>
                      <li><FileQuestion size={14} className="me-2" /> Daily Quiz</li>
                      <li><LayoutList size={14} className="me-2" /> Mock Test · PYQ · Syllabus</li>
                    </ul>
                    <span className="exam-landing-card-cta btn btn-primary btn-sm rounded-pill px-3">
                      Open {exam.shortName} <ArrowRight size={14} className="ms-1" />
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .exam-landing-page .exam-landing-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%);
          color: #fff;
        }
        .exam-landing-page .exam-landing-hero-inner {
          position: relative;
        }
        .exam-landing-page .exam-landing-title {
          font-size: clamp(1.5rem, 2.2vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0;
        }
        .exam-landing-page .exam-landing-subtitle {
          color: rgba(255,255,255,0.85);
          font-size: 0.95rem;
        }
        .exam-landing-page .exam-landing-card {
          border-radius: 1rem;
          background: #fff;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .exam-landing-page .exam-landing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1), 0 8px 16px rgba(37, 99, 235, 0.08);
        }
        .exam-landing-page .exam-landing-card-icon {
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .exam-landing-page .exam-tone-1 { background: #dbeafe; }
        .exam-landing-page .exam-tone-2 { background: #e0e7ff; }
        .exam-landing-page .exam-tone-3 { background: #d1fae5; }
        .exam-landing-page .exam-tone-4 { background: #fef3c7; }
        .exam-landing-page .exam-feature-list li {
          display: flex;
          align-items: center;
          margin-bottom: 0.35rem;
        }
        .exam-landing-page .exam-landing-card-cta {
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .exam-landing-page .exam-landing-card:hover .exam-landing-card-cta {
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      `}} />
    </main>
  )
}
