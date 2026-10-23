"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { 
  Calendar, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Gift, 
  ShieldCheck, 
  HelpCircle,
  SlidersHorizontal,
  Heart
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

export default function AgeCalculatorPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [dob, setDob] = useState<string>("1998-06-15")
  const [targetDate, setTargetDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [copied, setCopied] = useState<boolean>(false)

  const targetPreset = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const today = new Date().toISOString().split("T")[0]
    if (targetDate === today) return "today"
    if (targetDate === `${currentYear}-08-01`) return "ssc_aug"
    if (targetDate === `${currentYear}-01-01`) return "rrb_jan"
    return "custom"
  }, [targetDate])

  // Calculations
  const stats = useMemo(() => {
    if (!dob || !targetDate) {
      return {
        years: 0,
        months: 0,
        days: 0,
        nextBdayMonths: 0,
        nextBdayDays: 0,
        totalDays: 0,
        totalWeeks: 0,
        totalMonths: 0,
        totalHours: 0,
        isValid: false,
      }
    }

    const birth = new Date(dob)
    const target = new Date(targetDate)

    if (target < birth) {
      return {
        years: 0,
        months: 0,
        days: 0,
        nextBdayMonths: 0,
        nextBdayDays: 0,
        totalDays: 0,
        totalWeeks: 0,
        totalMonths: 0,
        totalHours: 0,
        isValid: false,
      }
    }

    let yrs = target.getFullYear() - birth.getFullYear()
    let mths = target.getMonth() - birth.getMonth()
    let dys = target.getDate() - birth.getDate()

    if (dys < 0) {
      mths -= 1
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      dys += prevMonth.getDate()
    }

    if (mths < 0) {
      yrs -= 1
      mths += 12
    }

    // Next Birthday Countdown
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1)
    }

    const diffMs = nextBday.getTime() - target.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    let nxtMths = Math.floor(diffDays / 30.43)
    let nxtDays = Math.round(diffDays % 30.43)
    if (nxtDays >= 30) {
      nxtMths += 1
      nxtDays = 0
    }

    const totalDiffMs = target.getTime() - birth.getTime()
    const diffDaysTotal = Math.floor(totalDiffMs / (1000 * 60 * 60 * 24))

    return {
      years: yrs,
      months: mths,
      days: dys,
      nextBdayMonths: nxtMths,
      nextBdayDays: nxtDays,
      totalDays: diffDaysTotal,
      totalWeeks: Math.floor(diffDaysTotal / 7),
      totalMonths: yrs * 12 + mths,
      totalHours: diffDaysTotal * 24,
      isValid: true,
    }
  }, [dob, targetDate])

  const handleReset = () => {
    setDob("1998-06-15")
    const today = new Date().toISOString().split("T")[0]
    setTargetDate(today)
  }

  const setTargetPreset = (type: "today" | "ssc_aug" | "rrb_jan") => {
    const currentYear = new Date().getFullYear()
    if (type === "today") {
      setTargetDate(new Date().toISOString().split("T")[0])
    } else if (type === "ssc_aug") {
      setTargetDate(`${currentYear}-08-01`)
    } else if (type === "rrb_jan") {
      setTargetDate(`${currentYear}-01-01`)
    }
  }

  const handleCopySummary = () => {
    const text = `📅 *Calculated Age Summary:*
• Age: ${stats.years} Years, ${stats.months} Months, ${stats.days} Days
• Date of Birth: ${dob}
• As on Date: ${targetDate}
• Next Birthday in: ${stats.nextBdayMonths} Months, ${stats.nextBdayDays} Days
• Lifetime: ${stats.totalDays.toLocaleString()} Days (${stats.totalHours.toLocaleString()} Hours)
Calculated via: https://www.pkminfotech.com/tools/education/age-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usefulLinks: UsefulLinkItem[] = [
    { label: "Date Math Engine Rules", href: "#date-math" },
    { label: "Govt Exam Age Limits Table", href: "#exam-limits" },
    { label: "Category Age Relaxation", href: "#relaxation" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="age-calculator-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="Exact Calendar Math Engine"
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* Main Interactive Tool Console */}
          <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            {/* Top Mode Switcher Bar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
              <div 
                className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                <button
                  type="button"
                  onClick={() => setTargetPreset("today")}
                  className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                    targetPreset === "today" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                  }`}
                  style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                >
                  As of Today
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPreset("ssc_aug")}
                  className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                    targetPreset === "ssc_aug" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                  }`}
                  style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                >
                  SSC Crucial (01-Aug)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPreset("rrb_jan")}
                  className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                    targetPreset === "rrb_jan" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                  }`}
                  style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                >
                  RRB / Bank (01-Jan)
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                  Live Calculation
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset dates"
                >
                  <RotateCcw size={13} />
                  <span className="small">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 p-md-4">
              {/* Main Two-Column Split */}
              <div className="row g-3 g-md-4 align-items-stretch">
                {/* Left Column: Interactive Inputs */}
                <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
                  <div>
                    {/* Date of Birth Picker */}
                    <div className="mb-3.5">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="dobInput" className="form-label small fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                          <Calendar size={15} className="text-primary" />
                          <span>Date of Birth (DOB):</span>
                        </label>
                        <span className="badge rounded-pill bg-light text-secondary border px-2 py-0.5" style={{ fontSize: "0.75rem" }}>
                          Birth Record
                        </span>
                      </div>
                      <input
                        id="dobInput"
                        type="date"
                        className="form-control form-control-lg border-secondary-subtle rounded-3 fw-bold text-dark px-3 py-2"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        style={{ fontSize: "1.05rem" }}
                      />
                    </div>

                    {/* Target Date Picker */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="targetInput" className="form-label small fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                          <Clock size={15} className="text-primary" />
                          <span>Calculate Age As Of Date:</span>
                        </label>
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2 py-0.5" style={{ fontSize: "0.75rem" }}>
                          Cutoff Date
                        </span>
                      </div>
                      <input
                        id="targetInput"
                        type="date"
                        className="form-control form-control-lg border-secondary-subtle rounded-3 fw-bold text-dark px-3 py-2"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        style={{ fontSize: "1.05rem" }}
                      />
                    </div>
                  </div>

                  {/* Cutoff advice alert */}
                  <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-start gap-2">
                    <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Standard government exams (SSC, UPSC) use <strong>01 August</strong> or <strong>01 January</strong> as the crucial eligibility cutoff.
                    </span>
                  </div>
                </div>

                {/* Right Column: Hero Gradient Result Box */}
                <div className="col-12 col-lg-6">
                  <div
                    className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
                    style={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                      minHeight: 280
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                          EXACT CALCULATED AGE
                        </span>
                        <span
                          className="badge rounded-pill fw-bold px-2.5 py-1"
                          style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}
                        >
                          ● Exact Calendar Math
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-baseline gap-2 flex-wrap">
                          <span className="fw-bold lh-1" style={{ fontSize: "clamp(2rem, 7vw, 2.75rem)" }}>{stats.years}</span>
                          <span className="fs-6 fs-sm-5 opacity-90 me-1 me-sm-2">Years</span>
                          <span className="fw-bold lh-1" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>{stats.months}</span>
                          <span className="small opacity-90 me-1 me-sm-2">Months</span>
                          <span className="fw-bold lh-1" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>{stats.days}</span>
                          <span className="small opacity-90">Days</span>
                        </div>
                      </div>

                      <div
                        className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                        style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                      >
                        <Gift size={15} className="text-warning" />
                        <span className="small">
                          Next Birthday: <strong>{stats.nextBdayMonths} Months, {stats.nextBdayDays} Days</strong>
                        </span>
                      </div>
                    </div>

                    {/* Fun Stats Breakdown */}
                    <div
                      className="rounded-3 p-3"
                      style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
                    >
                      <div className="row g-2 small">
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Total Days:</span>
                          <strong>{stats.totalDays.toLocaleString()}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Total Weeks:</span>
                          <strong className="text-warning">{stats.totalWeeks.toLocaleString()}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Total Months:</span>
                          <strong>{stats.totalMonths}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Total Hours:</span>
                          <strong className="text-info">{stats.totalHours.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="row g-2 g-md-3 mt-3">
                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Years Completed</div>
                    <div className="fs-3 fw-bold text-primary">{stats.years}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Full Solar Years
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Next Birthday</div>
                    <div className="fs-6 fw-bold text-dark mt-1 mb-1">
                      {stats.nextBdayMonths}M, {stats.nextBdayDays}D
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Countdown Remaining
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Days Lived</div>
                    <div className="fs-4 fw-bold text-success mt-0.5 mb-0.5">
                      {stats.totalDays.toLocaleString()}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Total Solar Days
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Hours Lived</div>
                    <div className="fs-4 fw-bold text-info mt-0.5 mb-0.5">
                      {stats.totalHours.toLocaleString()}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Lifetime Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Action Toolbar */}
              <div className="pt-3 mt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
                <div className="row g-2">
                  <div className="col-6">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `My exact age is ${stats.years} Years, ${stats.months} Months, ${stats.days} Days as on ${targetDate}. Calculate yours: https://www.pkminfotech.com/tools/education/age-calculator`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 text-white d-flex align-items-center justify-content-center gap-1.5 text-decoration-none shadow-xs"
                      style={{
                        backgroundColor: "#25D366",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "none",
                        boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)"
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span className="text-nowrap">WhatsApp</span>
                    </a>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="btn w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#334155",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                        fontWeight: 600
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-success flex-shrink-0" />
                          <span className="text-success text-nowrap">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-secondary flex-shrink-0" />
                          <span className="text-nowrap">Copy Summary</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Boundary: Interactive Tool (Above) vs Reference Guide & Documentation (Below) */}
          <div className="tool-reference-section-header mt-5 mb-3 pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span 
                className="badge rounded-pill bg-light text-primary border border-primary-subtle fw-bold px-3 py-1 text-uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
              >
                Official Reference Guide &amp; Eligibility Cutoffs
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Calculating Age for Exams &amp; Eligibility: The Complete Guide
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Date mathematics rules, age criteria cutoffs for SSC/UPSC, relaxation limits, and manuals.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              Whether applying for government recruitment examinations (SSC, UPSC, Banking), validating eligibility for school admission, or preparing documents for official verification, knowing your exact chronological age as of a specific cutoff date is mandatory.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="date-math">
              <Clock size={16} className="text-primary" /> 1. How Date Math Engine Computes Age
            </h3>
            <p>
              Computing chronological age takes into account varying month lengths (28, 29, 30, or 31 days) and leap years. If target days are fewer than birth days, days from the preceding month are borrowed dynamically.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="exam-limits">2. Standard Age Limits for Indian Exams</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>Exam</th>
                    <th>Min Age</th>
                    <th>Max Age (General)</th>
                    <th>Standard Cutoff Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { exam: "SSC CGL", min: "18 / 20 Yrs", max: "27 / 30 / 32 Yrs", date: "1st August of exam year" },
                    { exam: "UPSC Civil Services", min: "21 Yrs", max: "32 Yrs", date: "1st August of exam year" },
                    { exam: "IBPS PO / Clerk", min: "20 Yrs", max: "28 Yrs (Clerk) / 30 Yrs (PO)", date: "1st day of notification month" },
                    { exam: "SSC GD Constable", min: "18 Yrs", max: "23 Yrs", date: "1st January of exam year" },
                  ].map((row) => (
                    <tr key={row.exam}>
                      <td><strong>{row.exam}</strong></td>
                      <td>{row.min}</td>
                      <td>{row.max}</td>
                      <td>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="relaxation">
              <ShieldCheck size={16} className="text-primary" /> 3. Official Age Relaxation Quotas
            </h3>
            <ul className="ps-3 mb-4">
              <li><strong>OBC (Non-Creamy Layer):</strong> +3 Years upper age relaxation.</li>
              <li><strong>SC / ST:</strong> +5 Years upper age relaxation.</li>
              <li><strong>PwBD (General):</strong> +10 Years relaxation (+13 for OBC, +15 for SC/ST).</li>
              <li><strong>Ex-Servicemen:</strong> 3 years deduction after military service subtraction.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: What document is official proof of date of birth?</strong>
                <span className="text-muted">The Matriculation (Class 10) Certificate is standardly the primary date-of-birth proof accepted by UPSC, SSC, and state commissions.</span>
              </div>
              <div className="mb-3">
                <strong className="text-dark d-block">Q: How do leap years affect my calculated age?</strong>
                <span className="text-muted">The engine dynamically validates whether February had 29 days in a leap year (divisible by 4, not 100 unless 400), ensuring exact precision.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="education"
              categoryName="Education Calculators"
              currentPath="/tools/education/age-calculator"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
