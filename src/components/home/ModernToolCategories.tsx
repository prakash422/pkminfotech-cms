import React from "react"
import Link from "next/link"
import {
  Trophy,
  Boxes,
  Image as ImageIcon,
  Train,
  Heart,
  GraduationCap,
  ChevronRight,
  ArrowRight,
} from "lucide-react"

interface CategoryCardItem {
  id: string
  title: string
  subtitle: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  gradient: string
  iconColor: string
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: "ssc",
    title: "SSC & Govt Exams",
    subtitle: "CGL, CHSL, MTS and more.",
    href: "/tools/ssc",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    iconColor: "#ffffff",
  },
  {
    id: "land-area",
    title: "Land Area & Plots",
    subtitle: "Gaj, Sq Ft, Bigha, Katha, Biswa.",
    href: "/tools/land-area",
    icon: Boxes,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    iconColor: "#ffffff",
  },
  {
    id: "utility",
    title: "Utility & Image Tools",
    subtitle: "Photo resizer, compressor, GST.",
    href: "/tools/utility",
    icon: ImageIcon,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    iconColor: "#ffffff",
  },
  {
    id: "railway-banking",
    title: "Railway & Banking",
    subtitle: "RRB NTPC, bank calculators.",
    href: "/tools/railway",
    icon: Train,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    iconColor: "#ffffff",
  },
  {
    id: "eligibility",
    title: "Eligibility & Physical",
    subtitle: "Age, height, eligibility marks.",
    href: "/tools/eligibility",
    icon: Heart,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    iconColor: "#ffffff",
  },
  {
    id: "education",
    title: "Education & Degree",
    subtitle: "CGPA, percentage, date of birth.",
    href: "/tools/education",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    iconColor: "#ffffff",
  },
]

export default function ModernToolCategories() {
  return (
    <section className="modern-categories-section my-4">
      {/* Section Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="section-title h5 fw-bold text-dark mb-0">
          Explore Tool Categories
        </h2>
        <Link
          href="/tools"
          className="section-link text-primary fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid for Desktop, List for Mobile */}
      <div className="row g-2.5 g-md-3">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon
          return (
            <div key={cat.id} className="col-12 col-md-6 col-lg-4">
              <Link href={cat.href} className="text-decoration-none">
                <div className="category-item-card card border rounded-4 p-2.5 p-md-3 h-100 transition bg-white position-relative">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3 overflow-hidden">
                      {/* Gradient Icon Box */}
                      <div
                        className="cat-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 46,
                          height: 46,
                          background: cat.gradient,
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                        }}
                      >
                        <IconComp size={22} className="text-white" />
                      </div>

                      {/* Title & Subtitle */}
                      <div className="overflow-hidden">
                        <h3
                          className="cat-title fw-bold text-dark mb-0.5 text-truncate"
                          style={{ fontSize: "0.925rem" }}
                        >
                          {cat.title}
                        </h3>
                        <p
                          className="cat-sub text-secondary small mb-0 text-truncate"
                          style={{ fontSize: "0.785rem" }}
                        >
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Chevron Arrow on Right */}
                    <div className="cat-arrow-wrap flex-shrink-0 ms-2">
                      <div className="cat-arrow-circle d-flex align-items-center justify-content-center">
                        <ChevronRight size={16} className="text-secondary cat-chevron" />
                      </div>
                    </div>
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
        .section-title {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          letter-spacing: -0.015em;
        }
        .section-link {
          font-size: 0.84rem;
        }
        .section-link:hover {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
        }
        .category-item-card {
          min-height: 70px;
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-item-card:hover {
          transform: translateY(-2px);
          border-color: #bfdbfe !important;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.08) !important;
        }
        .cat-arrow-circle {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }
        .category-item-card:hover .cat-arrow-circle {
          background: #eff6ff;
        }
        .category-item-card:hover .cat-chevron {
          color: #2563eb !important;
          transform: translateX(2px);
        }
        .cat-chevron {
          transition: transform 0.2s ease, color 0.2s ease;
        }
      `,
        }}
      />
    </section>
  )
}
