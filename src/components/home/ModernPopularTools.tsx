import React from "react"
import Link from "next/link"
import {
  Calculator,
  Boxes,
  Image as ImageIcon,
  Keyboard,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

interface PopularToolItem {
  id: string
  title: string
  subtitle: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  iconBg: string
  iconColor: string
}

const POPULAR_TOOLS: PopularToolItem[] = [
  {
    id: "7th-pay",
    title: "7th Pay Salary Calculator",
    subtitle: "Calculate in-hand salary with DA, HRA and deductions.",
    href: "/tools/ssc/7th-pay-salary-calculator",
    icon: Calculator,
    iconBg: "bg-blue-50",
    iconColor: "#2563eb",
  },
  {
    id: "gaj-sqft",
    title: "Gaj to Square Feet & Plot Cost",
    subtitle: "Convert Gaj to Sq Ft and estimate plot cost.",
    href: "/tools/land-area/gaj-to-square-feet",
    icon: Boxes,
    iconBg: "bg-blue-50",
    iconColor: "#2563eb",
  },
  {
    id: "photo-resizer",
    title: "Signature & Photo Resizer",
    subtitle: "Resize images to required KB and dimensions for SSC/UPSC.",
    href: "/tools/utility/signature-resizer-10-to-20-kb",
    icon: ImageIcon,
    iconBg: "bg-purple-50",
    iconColor: "#7c3aed",
  },
  {
    id: "typing-test",
    title: "SSC & Court Typing Speed Test",
    subtitle: "Practice typing tests with official WPM and accuracy.",
    href: "/tools/ssc/typing-speed-test",
    icon: Keyboard,
    iconBg: "bg-amber-50",
    iconColor: "#d97706",
  },
]

export default function ModernPopularTools() {
  return (
    <section className="modern-popular-tools my-4">
      {/* Section Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="section-title h5 fw-bold text-dark mb-0">
          Popular Tools
        </h2>
        <Link
          href="/tools"
          className="section-link text-primary fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
        >
          <span>View All Tools</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid for Desktop / Cards */}
      <div className="row g-2.5 g-md-3">
        {POPULAR_TOOLS.map((tool) => {
          const IconComp = tool.icon
          return (
            <div key={tool.id} className="col-12 col-sm-6 col-lg-3">
              <Link href={tool.href} className="text-decoration-none">
                <div className="popular-tool-card card border rounded-4 p-3 h-100 transition bg-white position-relative d-flex flex-column justify-content-between">
                  <div>
                    {/* Soft Icon Box */}
                    <div
                      className={`tool-icon-pill rounded-3 d-inline-flex align-items-center justify-content-center mb-3 ${tool.iconBg}`}
                      style={{ width: 44, height: 44 }}
                    >
                      <IconComp size={22} style={{ color: tool.iconColor }} />
                    </div>

                    {/* Title & Subtitle */}
                    <h3
                      className="tool-card-title fw-bold text-dark mb-1.5"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.3",
                        minHeight: "2.5em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={tool.title}
                    >
                      {tool.title}
                    </h3>
                    <p
                      className="tool-card-sub text-secondary small mb-3"
                      style={{
                        fontSize: "0.8125rem",
                        lineHeight: "1.4",
                        minHeight: "2.8em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {tool.subtitle}
                    </p>
                  </div>

                  {/* Clean "Use Now →" Light-Blue Pill Button */}
                  <div className="tool-cta-wrapper pt-1">
                    <span className="tool-use-btn btn w-100 rounded-pill py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5">
                      <span>Use Now</span>
                      <ArrowRight size={14} className="tool-btn-arrow" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .popular-tool-card {
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .popular-tool-card:hover {
          transform: translateY(-3px);
          border-color: #93c5fd !important;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1) !important;
        }
        .tool-use-btn {
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          font-size: 0.84rem;
          transition: all 0.2s ease;
        }
        .popular-tool-card:hover .tool-use-btn {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .popular-tool-card:hover .tool-btn-arrow {
          transform: translateX(3px);
        }
        .tool-btn-arrow {
          transition: transform 0.2s ease;
        }
      `,
        }}
      />
    </section>
  )
}
