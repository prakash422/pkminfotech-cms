"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BookOpenCheck, Train, Landmark, Shield, GraduationCap, MapPin, type LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpenCheck,
  Train,
  Landmark,
  Shield,
  GraduationCap,
  MapPin,
}

type ExamItem = {
  slug: string
  label: string
  href: string | null
  line: string
  icon: string
  tone: string
  status: string
}

export default function ExploreCoreFeatures() {
  const [items, setItems] = useState<ExamItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/choose-your-exam")
      .then((res) => res.json())
      .then((json: { data?: ExamItem[] }) => {
        setItems(Array.isArray(json.data) ? json.data : [])
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="figma-space-24 explore-core-features">
      <div className="core-features-header text-center mb-3">
        <h2 className="core-features-title">
          Choose Your Exam
        </h2>
        <p className="core-features-subtitle text-secondary small mb-0 mt-1">
          Start free practice today — dream job is a few tests away.
        </p>
      </div>

      <div className="row g-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-6 col-md-4 col-lg-4">
              <div className="card border figma-card core-feature-card">
                <div className="card-body d-flex flex-column align-items-center text-center py-2 px-2">
                  <div className="core-feature-icon mb-1 feature-tone-1 placeholder-glow">
                    <span className="placeholder" style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="placeholder placeholder-sm w-75" />
                  <p className="core-feature-line text-secondary mb-0 mt-1 placeholder placeholder-xs w-100" />
                </div>
              </div>
            </div>
          ))
        ) : (
          items.map((exam) => {
            const Icon = ICON_MAP[exam.icon] ?? MapPin
            const isActive = exam.status === "active" && exam.href
            const linkHref = exam.href ?? ""
            const line = isActive ? exam.line : "Coming soon — stay tuned."
            return (
              <div key={exam.slug} className="col-6 col-md-4 col-lg-4">
                {isActive && linkHref ? (
                  <Link
                    href={linkHref}
                    className="card border figma-card core-feature-card w-100 text-decoration-none text-dark d-block"
                  >
                    <div className="card-body d-flex flex-column align-items-center text-center py-2 px-2">
                      <div className={`core-feature-icon mb-1 ${exam.tone}`}>
                        <Icon size={18} className="text-primary" />
                      </div>
                      <span className="fw-semibold text-dark small">{exam.label}</span>
                      <p className="core-feature-line text-secondary mb-0 mt-1">{line}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="card border figma-card core-feature-card opacity-75">
                    <div className="card-body d-flex flex-column align-items-center text-center py-2 px-2">
                      <div className={`core-feature-icon mb-1 ${exam.tone}`}>
                        <Icon size={18} className="text-primary" />
                      </div>
                      <span className="fw-semibold text-dark small">{exam.label}</span>
                      <p className="core-feature-line text-secondary mb-0 mt-1">{line}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .explore-core-features .core-features-title {
          font-size: clamp(1.25rem, 1.8vw, 1.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.3;
        }
        .explore-core-features .core-features-subtitle {
          font-size: 0.8rem;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }
        .explore-core-features .core-feature-card {
          min-height: auto !important;
          border-radius: 0.6rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .explore-core-features .core-feature-card:hover {
          transform: translateY(-2px);
          border-color: #93c5fd !important;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.12);
        }
        .explore-core-features .core-feature-card .card-body {
          padding: 0.6rem 0.65rem !important;
          gap: 0;
        }
        .explore-core-features .core-feature-line {
          font-size: 0.7rem;
          line-height: 1.35;
          max-width: 140px;
        }
        .explore-core-features .core-feature-icon {
          width: 40px;
          height: 36px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dfeafb;
        }
        .explore-core-features .row.g-2 {
          --bs-gutter-x: 0.5rem;
          --bs-gutter-y: 0.5rem;
        }
        @media (max-width: 767px) {
          .explore-core-features .core-features-title { font-size: 1.2rem; }
          .explore-core-features .core-feature-icon {
            width: 36px;
            height: 32px;
          }
          .explore-core-features .core-feature-icon svg {
            width: 16px;
            height: 16px;
          }
        }
      `}} />
    </section>
  )
}
