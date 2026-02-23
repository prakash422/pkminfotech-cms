import Link from "next/link"
import type { Metadata } from "next"
import { toolItems } from "@/data/exam-platform"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { ArrowRight, Calculator, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Online Tools & Calculators | pkminfotech",
  description: "SSC CGL marks calculator, age limit checker, RRB NTPC normalization, IBPS score calculator, cutoff and rank predictors, and more exam tools.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Online Tools & Calculators | pkminfotech",
    description: "SSC CGL marks calculator, age limit checker, RRB NTPC normalization, IBPS score calculator, cutoff and rank predictors, and more exam tools.",
    url: "/tools",
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "Online Tools & Calculators | pkminfotech", description: "SSC CGL marks calculator, age limit checker, RRB NTPC normalization, IBPS score calculator, and more exam tools." },
}

export default function ToolsPage() {
  const categoryCounts = toolItems.reduce<Record<string, number>>((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1
    return acc
  }, {})

  const iconBySlug: Record<string, React.ReactNode> = {}

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Online Tools" },
          ]}
        />
        <section className="card border-0 shadow-sm mb-3 mb-md-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex align-items-start justify-content-between gap-3">
              <div>
                <h1 className="fw-bold mb-2">Free Online Tools</h1>
                <p className="text-secondary mb-0">
                  SSC, RRB, Banking, Police and Teaching exam calculators and predictors.
                </p>
              </div>
              <span className="d-none d-md-inline-flex align-items-center gap-1 badge rounded-pill text-bg-primary-subtle text-primary-emphasis">
                <Sparkles size={14} /> {toolItems.length}+ tools
              </span>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <span key={category} className="badge rounded-pill text-bg-light border text-secondary-emphasis">
                  {category} ({count})
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="row g-3">
          {toolItems.map((tool) => (
            <div className="col-12 col-md-6 col-lg-4" key={tool.slug}>
              <article className="card h-100 border-0 shadow-sm tools-card">
                <div className="card-body p-3 p-md-4 d-flex flex-column tools-card-body">
                  <div className="d-flex align-items-center gap-2 mb-2 tools-card-head">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle tools-card-icon"
                      style={{ width: 34, height: 34 }}
                    >
                      {iconBySlug[tool.slug] || <Calculator size={18} className="text-primary" />}
                    </span>
                    <div className="small text-primary fw-semibold tools-category-pill">{tool.category}</div>
                  </div>
                  <h2 className="h5 fw-semibold mb-2 tools-title">{tool.title}</h2>
                  <p className="small text-secondary mb-3 flex-grow-1 tools-desc">{tool.description}</p>
                  <Link href={tool.path ?? `/tools/${tool.slug}`} className="align-self-start tools-cta">
                    Open Tool <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </section>
      </div>
      <style>{`
        .tools-card {
          border-radius: 14px;
        }
        .tools-category-pill {
          display: inline-flex;
          align-items: center;
          height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
        }
        .tools-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #cfe0ff;
          background: #eaf2ff;
          color: #0d6efd;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tools-cta:hover {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #ffffff;
          transform: translateY(-1px);
        }
        @media (max-width: 767px) {
          .tools-card {
            border: 1px solid #e7ecf4 !important;
            box-shadow: 0 1px 6px rgba(15, 23, 42, 0.06) !important;
          }
          .tools-card-body {
            padding: 12px !important;
          }
          .tools-card-icon {
            width: 30px !important;
            height: 30px !important;
          }
          .tools-title {
            font-size: 1.15rem;
            margin-bottom: 6px !important;
          }
          .tools-desc {
            font-size: 12px !important;
            line-height: 1.35;
            margin-bottom: 10px !important;
          }
          .tools-cta {
            width: 100%;
            height: 33px;
            font-size: 12px;
            justify-content: center;
          }
          .tools-card-head {
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </main>
  )
}
