"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BookOpenCheck, Train, Landmark, Shield, GraduationCap, MapPin, ArrowRight, type LucideIcon } from "lucide-react"

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
  badge?: string | null
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
      <div className="core-features-header text-center mb-4">
        <h2 className="core-features-title">
          Choose Your Exam
        </h2>
        <p className="core-features-subtitle text-secondary mb-0 mt-2">
          Start practice, mock tests & <strong className="text-dark">daily quiz</strong> instantly.
        </p>
      </div>

      <div className="row g-3 g-md-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-6 col-lg-4">
              <div className="exam-card exam-card--loading">
                <div className="exam-card__top">
                  <span className="exam-card__icon placeholder placeholder-glow rounded" />
                  <span className="placeholder placeholder-sm flex-grow-1" style={{ height: 20, maxWidth: 60 }} />
                </div>
                <p className="placeholder placeholder-xs w-100 mt-2 mb-2" style={{ height: 18 }} />
                <span className="placeholder placeholder-sm rounded" style={{ width: 90, height: 30 }} />
              </div>
            </div>
          ))
        ) : (
          items.map((exam) => {
            const Icon = ICON_MAP[exam.icon] ?? MapPin
            const isActive = exam.status === "active" && exam.href
            const linkHref = exam.href ?? ""
            const line = isActive ? exam.line : "Coming soon — stay tuned."
            const cardContent = (
              <>
                <div className="exam-card__top">
                  <div className={`exam-card__icon ${exam.tone}`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="exam-card__title">{exam.label}</h3>
                  {exam.badge && (
                    <span className="exam-card__badge">{exam.badge}</span>
                  )}
                </div>
                <p className="exam-card__line text-secondary mb-0">{line}</p>
                {isActive && linkHref ? (
                  <span className="exam-card__btn">
                    Explore {exam.label} <ArrowRight size={14} />
                  </span>
                ) : (
                  <span className="exam-card__btn exam-card__btn--disabled">
                    Coming soon
                  </span>
                )}
              </>
            )
            return (
              <div key={exam.slug} className="col-6 col-lg-4">
                {isActive && linkHref ? (
                  <Link href={linkHref} className="exam-card exam-card--link">
                    {cardContent}
                  </Link>
                ) : (
                  <div className="exam-card">
                    {cardContent}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .explore-core-features .core-features-title {
          font-size: clamp(1.35rem, 2vw, 1.75rem);
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.3;
        }
        .explore-core-features .core-features-subtitle {
          font-size: 0.95rem;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
        }
        .exam-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.9rem 1rem 1rem;
          min-height: 142px;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .exam-card--link {
          text-decoration: none;
          color: inherit;
        }
        .exam-card--link:hover {
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        .exam-card--link:hover .exam-card__btn {
          background: #1d4ed8;
          color: #fff;
        }
        .exam-card--link:hover .exam-card__icon {
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .exam-card--link:hover .exam-card__icon.feature-tone-banking {
          background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
        .exam-card__top {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 0.6rem;
        }
        .exam-card__icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1d4ed8;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }
        .exam-card__icon.feature-tone-banking {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #047857;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
        }
        .exam-card__badge {
          font-size: 0.7rem;
          font-weight: 500;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        .exam-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.3;
          flex: 1;
          min-width: 0;
        }
        .exam-card__line {
          font-size: 0.875rem;
          line-height: 1.4;
          color: #475569;
          margin: 0.35rem 0 0.6rem;
          min-height: 2.8em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .exam-card__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
          background: #2563eb;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .exam-card__btn--disabled {
          background: #e2e8f0;
          color: #64748b;
          cursor: default;
          padding: 0.4rem 0.65rem;
          font-size: 0.75rem;
        }
        .explore-core-features .row.g-3 { --bs-gutter-x: 0.6rem; --bs-gutter-y: 0.6rem; }
        .explore-core-features .row.g-md-4 { --bs-gutter-x: 0.75rem; --bs-gutter-y: 0.75rem; }
        @media (min-width: 992px) {
          .explore-core-features .row .col-lg-4 { flex: 0 0 33.333%; max-width: 33.333%; }
        }
        @media (max-width: 575px) {
          .exam-card {
            padding: 0.75rem 0.85rem 0.85rem;
            min-height: 132px;
          }
          .exam-card__top { gap: 0.5rem; }
          .exam-card__icon { width: 38px; height: 38px; border-radius: 8px; }
          .exam-card__icon svg { width: 18px; height: 18px; }
          .exam-card__title { font-size: 0.95rem; }
          .exam-card__line {
            font-size: 0.8125rem;
            margin: 0.25rem 0 0.5rem;
            min-height: 2.6em;
          }
          .exam-card__btn { font-size: 0.75rem; padding: 0.35rem 0.6rem; }
          .exam-card__btn svg { width: 12px; height: 12px; }
        }
      `}} />
    </section>
  )
}
