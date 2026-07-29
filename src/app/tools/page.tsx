import Link from "next/link"
import type { Metadata } from "next"
import { toolItems } from "@/data/tools-data"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { ArrowRight, Calculator } from "lucide-react"
import ContentAdBand from "@/components/ContentAdBand"
import SideRailAds from "@/components/SideRailAds"

export const metadata: Metadata = {
  title: "Free Online Tools & Smart Calculators",
  description:
    "Convert land area measurements (Bigha to Kattha), generate printable rent receipts for HRA tax claims, convert CGPA to percentage, and compress form photos locally.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.pkminfotech.com/tools" },
  openGraph: {
    title: "Free Online Tools & Smart Calculators | pkminfotech",
    description:
      "Convert land area measurements (Bigha to Kattha), generate printable rent receipts for HRA tax claims, convert CGPA to percentage, and compress form photos locally.",
    url: "https://www.pkminfotech.com/tools",
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools & Smart Calculators | pkminfotech",
    description:
      "Convert land area measurements, generate HRA rent receipts, convert CGPA to percentage, and compress images.",
  },
}

export default function ToolsPage() {
  const categoryCounts = toolItems.reduce<Record<string, number>>((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1
    return acc
  }, {})

  return (
    <main className="page-surface tool-page-shell py-1 py-md-3">
      <SideRailAds />
      <div className="container tools-hub" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          compact
          items={[
            { label: "Home", href: "/" },
            { label: "Tools" },
          ]}
        />

        <header className="tools-hub-header">
          <div className="d-flex align-items-baseline justify-content-between gap-2">
            <h1 className="tools-hub-title mb-0">Free Online Tools</h1>
            <span className="tools-hub-count d-none d-sm-inline">{toolItems.length} tools</span>
          </div>
          <p className="tools-hub-desc">
            Land converters, CGPA tools, rent receipts, GST/SIP calculators, and exam photo compression — free, no login.
          </p>
          <div className="chip-row">
            {Object.entries(categoryCounts).map(([category, count]) => {
              const cat = toolItems.find((t) => t.category === category)
              const href = cat ? `/tools/${cat.examCategorySlug}` : "/tools"
              return (
                <Link key={category} href={href} className="chip">
                  {category} <span className="chip-count">{count}</span>
                </Link>
              )
            })}
          </div>
        </header>

        <ContentAdBand className="tools-top-ad mb-2" />

        <section className="row g-2 g-md-3 tools-hub-grid">
          {toolItems.flatMap((tool, index) => {
            const card = (
              <div className="col-12 col-md-6 col-lg-4" key={tool.slug}>
                <article className="tool-panel tools-card h-100">
                  <div className="tools-card-body d-flex flex-column h-100">
                    <div className="d-flex align-items-center gap-2 tools-card-head">
                      <span className="tools-card-icon">
                        <Calculator size={15} className="text-primary" />
                      </span>
                      <span className="tools-category-pill">{tool.category}</span>
                    </div>
                    <h2 className="tools-title">{tool.title}</h2>
                    <p className="tools-desc flex-grow-1 mb-0">{tool.description}</p>
                    <Link href={tool.path ?? `/tools/${tool.slug}`} className="tools-cta mt-2">
                      Open Tool <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              </div>
            )

            if (index !== 1) return [card]

            return [
              card,
              <div className="col-12" key="tools-mid-ad">
                <ContentAdBand className="tools-mid-ad my-1" />
              </div>,
            ]
          })}
        </section>
      </div>

      <style>{`
        .tools-hub-header {
          margin-bottom: 0.85rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eef2f7;
        }
        .tools-hub-title {
          color: #0f172a;
          font-size: clamp(1.28rem, 4.2vw, 1.65rem);
          font-weight: 750;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .tools-hub-count {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .tools-hub-desc {
          margin: 6px 0 10px;
          max-width: 36rem;
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.45;
        }
        .tools-card {
          border-radius: 12px;
        }
        .tools-card-body {
          padding: 12px 14px;
        }
        .tools-card-head {
          margin-bottom: 6px;
        }
        .tools-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          flex-shrink: 0;
        }
        .tools-category-pill {
          display: inline-flex;
          align-items: center;
          height: 22px;
          padding: 0 8px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
          font-size: 11px;
          font-weight: 700;
        }
        .tools-title {
          margin: 0 0 4px;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.015em;
          color: #0f172a;
        }
        .tools-desc {
          margin: 0;
          color: #64748b;
          font-size: 0.8125rem;
          line-height: 1.4;
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
          transition: all 0.15s ease;
        }
        .tools-cta:hover {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
        @media (max-width: 767px) {
          .tools-hub-desc {
            font-size: 0.8125rem;
            margin: 4px 0 8px;
          }
          .tools-hub-header {
            margin-bottom: 0.7rem;
            padding-bottom: 0.65rem;
          }
          .tools-cta {
            width: 100%;
          }
          .tools-hub-grid .tool-panel.h-100 {
            height: auto !important;
          }
          .tools-desc.flex-grow-1 {
            flex-grow: 0 !important;
          }
        }
      `}</style>
    </main>
  )
}
