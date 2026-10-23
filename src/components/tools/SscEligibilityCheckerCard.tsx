"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Calendar,
  GraduationCap
} from "lucide-react"

const REFERENCE_YEAR = new Date().getFullYear()
const CRUCIAL_DATE = new Date(REFERENCE_YEAR, 7, 1)

const EXAMS = [
  { value: "ssc-cgl", label: "SSC CGL (Combined Graduate Level)", minAge: 18, maxAge: 30, minQual: 3, qualName: "Graduation (Bachelor Degree)" },
  { value: "ssc-chsl", label: "SSC CHSL (10+2 Combined Higher Secondary)", minAge: 18, maxAge: 27, minQual: 2, qualName: "12th Standard (10+2)" },
  { value: "ssc-mts", label: "SSC MTS & Havaldar", minAge: 18, maxAge: 25, minQual: 1, qualName: "10th Class (Matriculation)" },
  { value: "ssc-gd", label: "SSC GD Constable (CAPFs / SSF)", minAge: 18, maxAge: 23, minQual: 1, qualName: "10th Class (Matriculation)" },
  { value: "ssc-cpo", label: "SSC CPO (Sub-Inspector in Delhi Police / CAPFs)", minAge: 20, maxAge: 25, minQual: 3, qualName: "Graduation (Bachelor Degree)" },
]

const QUALIFICATIONS = [
  { value: 1, label: "10th Pass (Matriculation)" },
  { value: 2, label: "12th Pass (Intermediate / 10+2)" },
  { value: 3, label: "Graduate (Any Bachelor Degree)" },
  { value: 4, label: "Post Graduate (Master Degree / Higher)" },
]

const CATEGORIES = [
  { value: "ur", label: "General (UR / EWS)", relaxation: 0 },
  { value: "obc", label: "OBC (NCL)", relaxation: 3 },
  { value: "sc", label: "SC / ST", relaxation: 5 },
  { value: "pwbd", label: "PwBD (10 Years)", relaxation: 10 },
  { value: "esm", label: "Ex-Servicemen (ESM)", relaxation: 3 },
]

function calculateAge(dob: Date, refDate: Date) {
  let y = refDate.getFullYear() - dob.getFullYear()
  let m = refDate.getMonth() - dob.getMonth()
  let d = refDate.getDate() - dob.getDate()

  if (d < 0) {
    m--
    const prevMonthDays = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate()
    d += prevMonthDays
  }
  if (m < 0) {
    y--
    m += 12
  }
  return { years: Math.max(0, y), months: Math.max(0, m), days: Math.max(0, d) }
}

export default function SscEligibilityCheckerCard() {
  const [examKey, setExamKey] = useState<string>("ssc-cgl")
  const currentExam = useMemo(() => EXAMS.find(e => e.value === examKey) || EXAMS[0], [examKey])

  const [dob, setDob] = useState<string>("2000-08-15")
  const [qualLevel, setQualLevel] = useState<number>(3)
  const [categoryKey, setCategoryKey] = useState<string>("ur")
  const currentCategory = useMemo(() => CATEGORIES.find(c => c.value === categoryKey) || CATEGORIES[0], [categoryKey])
  const [copied, setCopied] = useState<boolean>(false)

  const parsedDob = useMemo(() => {
    if (!dob) return new Date(2000, 7, 15)
    const [y, m, d] = dob.split("-").map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
  }, [dob])

  const age = useMemo(() => calculateAge(parsedDob, CRUCIAL_DATE), [parsedDob])
  const effectiveMaxAge = currentExam.maxAge + currentCategory.relaxation

  // Eligibility evaluation
  const isQualEligible = qualLevel >= currentExam.minQual
  const isAgeMinEligible = age.years >= currentExam.minAge
  const isAgeMaxEligible = age.years < effectiveMaxAge || (age.years === effectiveMaxAge && age.months === 0 && age.days === 0)
  const isAgeEligible = isAgeMinEligible && isAgeMaxEligible

  const isOverallEligible = isQualEligible && isAgeEligible

  const handleReset = () => {
    setExamKey("ssc-cgl")
    setDob("2000-08-15")
    setQualLevel(3)
    setCategoryKey("ur")
  }

  const handleCopy = () => {
    const text = `🛡️ *My SSC Exam Eligibility Verdict:*
• Exam: ${currentExam.label}
• Qualification: ${QUALIFICATIONS.find(q => q.value === qualLevel)?.label} (${isQualEligible ? "Qualified" : "Not Met"})
• Age as on 01-Aug-${REFERENCE_YEAR}: ${age.years} Yrs ${age.months} M (${isAgeEligible ? "Age Met" : "Age Exceeded"})
• Verdict: ${isOverallEligible ? "ELIGIBLE TO APPLY" : "NOT ELIGIBLE"}
Check yours: https://www.pkminfotech.com/tools/ssc/ssc-eligibility-checker`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div 
          className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <span className="btn btn-sm btn-primary fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 shadow-sm flex-shrink-0" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
            <ShieldCheck size={15} />
            <span>Combined Eligibility Checker</span>
          </span>
          <Link
            href="/tools/ssc/ssc-cgl-age-limit-calculator"
            className="btn btn-sm btn-light text-secondary fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 hover:bg-light flex-shrink-0"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
          >
            <Calendar size={15} />
            <span>Age Limit Calculator</span>
          </Link>
          <Link
            href="/tools/ssc/typing-speed-test"
            className="btn btn-sm btn-light text-secondary fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 hover:bg-light flex-shrink-0"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
          >
            <GraduationCap size={15} />
            <span>Typing Speed Test</span>
          </Link>
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
            title="Reset to defaults"
          >
            <RotateCcw size={13} />
            <span className="small">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-3 p-md-4">
        {/* Exam Selector */}
        <div className="mb-3.5 pb-3 border-bottom">
          <label className="form-label small fw-bold text-dark mb-1.5 d-flex align-items-center gap-1.5">
            <SlidersHorizontal size={15} className="text-primary" />
            <span>Select Target Staff Selection Commission (SSC) Exam:</span>
          </label>
          <select
            className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
            value={examKey}
            onChange={(e) => setExamKey(e.target.value)}
            style={{ fontSize: "0.9rem" }}
          >
            {EXAMS.map((ex) => (
              <option key={ex.value} value={ex.value}>
                {ex.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Educational Qualification */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  Your Highest Educational Qualification:
                </label>
                <select
                  className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
                  value={qualLevel}
                  onChange={(e) => setQualLevel(Number(e.target.value))}
                  style={{ fontSize: "0.875rem" }}
                >
                  {QUALIFICATIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
                <div className="small text-secondary mt-1">
                  Required: <strong>{currentExam.qualName}</strong>
                </div>
              </div>

              {/* DOB Input */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  Date of Birth (DOB):
                </label>
                <input
                  type="date"
                  className="form-control fw-bold border-secondary-subtle rounded-3 py-2 text-dark"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <div className="d-flex align-items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="small text-secondary" style={{ fontSize: "0.72rem" }}>Birth Year:</span>
                  {[1998, 2000, 2002, 2004, 2006].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2 py-0.2 small fw-semibold ${dob.startsWith(String(yr)) ? 'btn-primary' : 'btn-light border text-secondary'}`}
                      style={{ fontSize: "0.72rem" }}
                      onClick={() => setDob(`${yr}-06-15`)}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  Category (Reservation Quota):
                </label>
                <select
                  className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
                  value={categoryKey}
                  onChange={(e) => setCategoryKey(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} {c.relaxation > 0 ? `(+${c.relaxation} Yrs Relaxation)` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between">
              <span>Standard Age Limit: <strong>{currentExam.minAge} – {currentExam.maxAge} Yrs</strong></span>
              <span>With Quota: <strong>Up to {effectiveMaxAge} Yrs</strong></span>
            </div>
          </div>

          {/* Right Column: Hero Gradient Result Box */}
          <div className="col-12 col-lg-6">
            <div
              className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
              style={{
                background: isOverallEligible ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" : "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
                minHeight: 290
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                    ELIGIBILITY VERDICT
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: isOverallEligible ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.25)", color: "#ffffff", fontSize: "0.75rem" }}
                  >
                    ● {isOverallEligible ? "ELIGIBLE TO APPLY" : "NOT ELIGIBLE"}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(1.25rem, 4.5vw, 1.85rem)" }}>{isOverallEligible ? "Full Eligibility Confirmed" : "Eligibility Criteria Not Met"}</span>
                </div>
                <div className="opacity-75 small mb-3">
                  {isOverallEligible 
                    ? `You satisfy both age (${age.years} Yrs) and academic requirements for ${currentExam.label.split("(")[0]}.` 
                    : !isQualEligible 
                      ? `Minimum qualification of ${currentExam.qualName} required.` 
                      : `Age limit (${currentExam.minAge}-${effectiveMaxAge} Yrs) exceeded or underage.`}
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">Crucial Date Age: <strong>{age.years} Yrs {age.months} Mo {age.days} D</strong></span>
                </div>
              </div>

              {/* Real-time detailed table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Education Check:</span>
                    <strong className={isQualEligible ? "text-success" : "text-warning"}>
                      {isQualEligible ? "Passed" : "Missing Degree"}
                    </strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Age Check:</span>
                    <strong className={isAgeEligible ? "text-success" : "text-warning"}>
                      {isAgeEligible ? "Within Limit" : "Age Barred"}
                    </strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Exam Bracket:</span>
                    <strong>{currentExam.minAge}-{effectiveMaxAge} Years</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Category Quota:</span>
                    <strong className="text-info">+{currentCategory.relaxation} Years</strong>
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
              <div className="small text-secondary mb-1 fw-semibold">Education Check</div>
              <div className={`fs-5 fw-bold ${isQualEligible ? "text-success" : "text-danger"}`}>
                {isQualEligible ? "Satisfied" : "Unsatisfied"}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {currentExam.qualName.slice(0, 24)}...
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Age Check</div>
              <div className={`fs-5 fw-bold ${isAgeEligible ? "text-success" : "text-danger"}`}>
                {isAgeEligible ? "In Age Limit" : "Exceeded / Under"}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Allowed: {currentExam.minAge}-{effectiveMaxAge} Yrs
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Calculated Age</div>
              <div className="fs-5 fw-bold text-dark">{age.years} Yrs {age.months} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                As on 01-Aug-{REFERENCE_YEAR}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Final Status</div>
              <div className={`fs-5 fw-bold ${isOverallEligible ? "text-success" : "text-danger"}`}>
                {isOverallEligible ? "Eligible" : "Ineligible"}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {currentExam.label.split("(")[0]}
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
                  `My ${currentExam.label} Eligibility Result is ${isOverallEligible ? "ELIGIBLE" : "NOT ELIGIBLE"} (Age: ${age.years} Yrs). Check yours: https://www.pkminfotech.com/tools/ssc/ssc-eligibility-checker`
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
                onClick={handleCopy}
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
                    <span className="text-nowrap">Copy Result</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
