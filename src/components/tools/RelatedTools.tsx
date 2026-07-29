import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getRelatedTools, type ToolItem } from "@/data/tools-data"

export default function RelatedTools({ current, limit = 4 }: { current: ToolItem; limit?: number }) {
  const related = getRelatedTools(current, limit)
  if (related.length === 0) return null

  return (
    <section className="mt-4 mb-2" aria-labelledby="related-tools-heading">
      <div className="flat-content-section border-top pt-3">
          <h2 id="related-tools-heading" className="h5 fw-bold mb-3">
            Related free tools
          </h2>
          <div className="row g-3">
            {related.map((tool) => (
              <div className="col-12 col-sm-6" key={tool.path}>
                <Link
                  href={tool.path}
                  className="d-block h-100 text-decoration-none border rounded-3 p-3 related-tool-card"
                >
                  <div className="small text-primary fw-semibold mb-1">{tool.category}</div>
                  <div className="fw-semibold text-dark mb-1">{tool.title}</div>
                  <p className="small text-secondary mb-2" style={{ lineHeight: 1.35 }}>
                    {tool.description.length > 90 ? `${tool.description.slice(0, 90)}…` : tool.description}
                  </p>
                  <span className="small fw-semibold text-primary d-inline-flex align-items-center gap-1">
                    Open tool <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/tools" className="small fw-semibold text-decoration-none">
              View all tools →
            </Link>
          </div>
      </div>
      <style>{`
        .related-tool-card {
          background: #fff;
          border-color: #e7ecf4 !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .related-tool-card:hover {
          border-color: #cfe0ff !important;
          box-shadow: 0 4px 14px rgba(13, 110, 253, 0.08);
        }
      `}</style>
    </section>
  )
}
