"use client"

import Link from "next/link"
import {
  Check,
  Search,
  BookOpenCheck,
  ClipboardList,
  Briefcase,
  Shield,
  Award,
  Wrench,
  FileText,
  ListChecks,
  Train,
  Users,
  Zap,
  Settings,
  Landmark,
  Building2,
  Wallet,
  CreditCard,
  Banknote,
  ShieldCheck,
  GraduationCap,
  School,
  BookOpen,
} from "lucide-react"
import { useState } from "react"

const FEATURES = [
  "Practice Questions",
  "Daily Quiz",
  "Previous Papers & PYQ",
  "Mock Test & Syllabus",
]

export type ExamTypeItem = {
  slug: string
  shortName: string
  fullName: string
  externalLink?: string
}

type IconComponent = React.ComponentType<{ size?: number; className?: string }>

const ICON_BY_SLUG: Record<string, IconComponent> = {
  "cgl": BookOpenCheck,
  "chsl": ClipboardList,
  "mts": Briefcase,
  "gd-constable": Shield,
  "cpo": Award,
  "je": Wrench,
  "stenographer": FileText,
  "selection-post": ListChecks,
  "ntpc": Train,
  "group-d": Users,
  "alp": Zap,
  "technician": Settings,
  "ibps-po": Landmark,
  "ibps-clerk": Building2,
  "ibps-rrb-po": Wallet,
  "ibps-rrb-clerk": CreditCard,
  "sbi-po": Banknote,
  "sbi-clerk": Building2,
  "rbi-grade-b": Briefcase,
  "rbi-assistant": Landmark,
  "ssc-gd": Shield,
  "capf": ShieldCheck,
  "cisf-crpf": Users,
  "ctet": GraduationCap,
  "kvs": School,
  "nvs": BookOpen,
  "dsssb": Building2,
  "default": BookOpenCheck,
}

type ExamTypeCardGridProps = {
  title: string
  subtitle: string
  exams: readonly ExamTypeItem[]
  basePath: string
  searchPlaceholder?: string
}

export default function ExamTypeCardGrid({
  title,
  subtitle,
  exams,
  basePath,
  searchPlaceholder = "Search exam...",
}: ExamTypeCardGridProps) {
  const [query, setQuery] = useState("")
  const filtered = query.trim()
    ? exams.filter(
        (e) =>
          e.shortName.toLowerCase().includes(query.toLowerCase()) ||
          e.fullName.toLowerCase().includes(query.toLowerCase())
      )
    : [...exams]

  return (
    <>
      <section className="card border-0 shadow-sm mb-3 exam-type-hero exam-type-hero-gradient">
        <div className="card-body p-3 p-md-4 text-center">
          <h1 className="exam-type-title fw-bold mb-1">{title}</h1>
          <p className="exam-type-subtitle small mb-0 mx-auto">{subtitle}</p>
          <div className="mt-2 mx-auto exam-type-search-wrap">
            <div className="input-group input-group-sm exam-type-search-inner">
              <span className="input-group-text border-end-0 py-1">
                <Search size={16} className="text-primary" />
              </span>
              <input
                type="search"
                className="form-control form-control-sm border-start-0 ps-0"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search exam type"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="row g-2">
        {filtered.map((exam) => {
          const Icon = ICON_BY_SLUG[exam.slug] ?? ICON_BY_SLUG["default"]
          const href = "externalLink" in exam && exam.externalLink ? exam.externalLink : `${basePath}/${exam.slug}`
          return (
            <div className="col-md-6 col-lg-4" key={exam.slug}>
              <article className="card h-100 border-0 shadow-sm exam-type-card">
                <div className="card-body p-2 p-sm-3 d-flex flex-column">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <span className="exam-type-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                      {Icon && <Icon size={18} className="text-primary" />}
                    </span>
                    <div className="min-w-0">
                      <h2 className="h6 fw-bold mb-0 text-dark exam-type-card-title">{exam.shortName}</h2>
                      <p className="small text-secondary mb-0 mt-0 lh-sm exam-type-card-subtitle">{exam.fullName}</p>
                    </div>
                  </div>
                  <ul className="list-unstyled mb-2 flex-grow-1 exam-type-features">
                    {FEATURES.map((label) => (
                      <li key={label} className="d-flex align-items-center gap-1 mb-1">
                        <Check size={12} className="text-primary flex-shrink-0" />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="exam-type-cta-wrap">
                    <Link
                      href={href}
                      className="btn btn-primary btn-sm fw-semibold text-uppercase exam-type-cta"
                    >
                      Start Preparation
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </section>
      {filtered.length === 0 && (
        <p className="text-center text-secondary small mb-0">No exam type matches your search.</p>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .exam-type-hero-gradient {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #2563eb 100%) !important;
          color: #fff;
        }
        .exam-type-hero-gradient .exam-type-title { font-size: 1.35rem; color: #fff; }
        .exam-type-hero-gradient .exam-type-subtitle { font-size: 0.8rem; max-width: 480px; color: rgba(255,255,255,0.88); }
        .exam-type-hero-gradient .exam-type-search-wrap { max-width: 280px; }
        .exam-type-hero-gradient .exam-type-search-inner .input-group-text {
          background: rgba(255,255,255,0.95); border-color: rgba(255,255,255,0.5);
        }
        .exam-type-hero-gradient .exam-type-search-inner .form-control {
          background: rgba(255,255,255,0.95); border-color: rgba(255,255,255,0.5);
        }
        .exam-type-hero-gradient .exam-type-search-inner .form-control::placeholder {
          color: #64748b;
        }
        .exam-type-card {
          border-radius: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%) !important;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .exam-type-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08) !important;
          background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%) !important;
        }
        .exam-type-icon { width: 40px; height: 40px; background: #e0f2fe; }
        .exam-type-card-title { font-size: 0.95rem; }
        .exam-type-card-subtitle { font-size: 0.75rem; }
        .exam-type-features { font-size: 0.75rem; }
        .exam-type-cta-wrap { margin-top: auto; }
        .exam-type-cta {
          border-radius: 8px;
          letter-spacing: 0.4px;
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          width: 100%;
        }
        @media (max-width: 767px) {
          .exam-type-cta-wrap { text-align: center; }
          .exam-type-cta {
            width: auto;
            max-width: 100%;
            padding: 0.5rem 1.25rem;
            min-height: 32px;
          }
        }
      `}} />
    </>
  )
}
