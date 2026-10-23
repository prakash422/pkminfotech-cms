"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Calendar, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserCheck
} from "lucide-react"

const REFERENCE_YEAR = new Date().getFullYear()
// Crucial cutoff date per official SSC notification is 1st August of the notification year
const CRUCIAL_DATE = new Date(REFERENCE_YEAR, 7, 1)

const CATEGORIES = [
  { value: "ur", label: "General (UR / EWS)", relaxation: 0 },
  { value: "obc", label: "OBC (NCL)", relaxation: 3 },
  { value: "sc", label: "SC / ST", relaxation: 5 },
  { value: "pwbd-gen", label: "PwBD (General)", relaxation: 10 },
  { value: "pwbd-obc", label: "PwBD (OBC)", relaxation: 13 },
  { value: "pwbd-sc", label: "PwBD (SC/ST)", relaxation: 15 },
  { value: "esm", label: "Ex-Servicemen (ESM)", relaxation: 3 },
]

const POST_GROUPS = [
  { id: "group-27", name: "18 to 27 Years Posts", baseMax: 27, examples: "Tax Assistant, Auditor, UDC, Sub-Inspector in CBI" },
  { id: "group-30", name: "18 to 30 Years Posts", baseMax: 30, examples: "Inspector (GST, Excise, IT), ASO (CSS, MEA, IB)" },
  { id: "group-32", name: "18 to 32 Years Posts", baseMax: 32, examples: "Junior Statistical Officer (JSO), Statistical Investigator" },
]

function calculateDetailedAge(dob: Date, refDate: Date) {
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

type Props = { basePath?: string }

export default function SscCglAgeLimitCalculatorCard({ basePath = "/tools/ssc" }: Props) {
  const [dob, setDob] = useState<string>("1998-05-15")
  const [categoryKey, setCategoryKey] = useState<string>("ur")
  const currentCategory = useMemo(() => CATEGORIES.find(c => c.value === categoryKey) || CATEGORIES[0], [categoryKey])
  const [copied, setCopied] = useState<boolean>(false)

  const parsedDob = useMemo(() => {
    if (!dob) return new Date(1998, 4, 15)
    const [y, m, d] = dob.split("-").map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
  }, [dob])

  const age = useMemo(() => calculateDetailedAge(parsedDob, CRUCIAL_DATE), [parsedDob])
  const ageDecimal = Math.round((age.years + age.months / 12) * 10) / 10

  // Post Group eligibility
  const groupResults = useMemo(() => {
    return POST_GROUPS.map(pg => {
      const maxAllowed = pg.baseMax + currentCategory.relaxation
      const isEligible = age.years < maxAllowed || (age.years === maxAllowed && age.months === 0 && age.days === 0)
      const isUnderAge = age.years < 18
      const status = isUnderAge ? "Underage (< 18)" : isEligible ? "Eligible" : "Overage"
      return { ...pg, maxAllowed, isEligible: isEligible && !isUnderAge, status }
    })
  }, [age, currentCategory])

  const eligibleCount = groupResults.filter(g => g.isEligible).length
  const isOverallEligible = eligibleCount > 0

  const handleReset = () => {
    setDob("1998-05-15")
    setCategoryKey("ur")
  }

  const handleCopy = () => {
    const text = `📅 *My SSC CGL Age Eligibility Check:*
• Date of Birth: ${dob}
• Crucial Date: 01-August-${REFERENCE_YEAR}
• Exact Age: ${age.years} Years, ${age.months} Months, ${age.days} Days
• Category: ${currentCategory.label} (+${currentCategory.relaxation} Yrs Relaxation)
• Eligible Post Groups: ${eligibleCount} / 3 Groups
Check your age eligibility: https://www.pkminfotech.com/tools/ssc/ssc-cgl-age-limit-calculator`
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
            <Calendar size={15} />
            <span>Age Limit Calculator</span>
          </span>
          <Link
            href="/tools/ssc/ssc-eligibility-checker"
            className="btn btn-sm btn-light text-secondary fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 hover:bg-light flex-shrink-0"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
          >
            <ShieldCheck size={15} />
            <span>Eligibility Checker</span>
          </Link>
          <Link
            href="/tools/ssc/7th-pay-salary-calculator"
            className="btn btn-sm btn-light text-secondary fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 hover:bg-light flex-shrink-0"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
          >
            <UserCheck size={15} />
            <span>7th Pay Salary</span>
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
        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: DOB + Category Selection */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* DOB Input */}
              <div className="mb-3.5">
                <label className="form-label small fw-bold text-dark mb-1.5 d-flex align-items-center justify-content-between">
                  <span>Enter Date of Birth (DOB):</span>
                  <span className="small text-muted">As per 10th Certificate</span>
                </label>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="date"
                    className="form-control fw-bold fs-5 text-dark border-0 px-3"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    DOB
                  </span>
                </div>

                {/* Quick Year Presets */}
                <div className="d-flex align-items-center gap-1.5 mt-2 flex-wrap">
                  <span className="small text-secondary me-1" style={{ fontSize: "0.75rem" }}>Birth Year:</span>
                  {[1996, 1998, 2000, 2002, 2004].map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold ${
                        dob.startsWith(String(year)) ? "btn-primary" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => setDob(`${year}-07-15`)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1.5">
                  Select Reservation Category (for Age Relaxation):
                </label>
                <select
                  className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
                  value={categoryKey}
                  onChange={(e) => setCategoryKey(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} {c.relaxation > 0 ? `(+${c.relaxation} Years Relaxation)` : "(No Relaxation)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Post Groups Breakdown */}
              <div className="border rounded-3 p-3 bg-light">
                <div className="small fw-bold text-dark mb-2">Post Group Eligibility Breakdown:</div>
                <div className="d-flex flex-column gap-2">
                  {groupResults.map(g => (
                    <div key={g.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-white border small">
                      <div>
                        <div className="fw-semibold text-dark">{g.name}</div>
                        <div className="text-secondary" style={{ fontSize: "0.72rem" }}>Max Age: {g.maxAllowed} Yrs ({g.examples.slice(0, 30)}...)</div>
                      </div>
                      <span className={`badge rounded-pill fw-bold ${g.isEligible ? "bg-success text-white" : "bg-danger text-white"}`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between mt-3">
              <span>Official Crucial Date: <strong>01 August {REFERENCE_YEAR}</strong></span>
              <span>Category Bonus: <strong>+{currentCategory.relaxation} Yrs</strong></span>
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
                    SSC CGL AGE EVALUATION
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: isOverallEligible ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.25)", color: "#ffffff", fontSize: "0.75rem" }}
                  >
                    ● {isOverallEligible ? `Eligible for ${eligibleCount}/3 Post Groups` : "Overage for General Posts"}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)" }}>{age.years} Yrs {age.months} Mo</span>
                </div>
                <div className="opacity-75 small mb-3">Exact age as on 01-Aug-{REFERENCE_YEAR} (Crucial Date)</div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">
                    Days: <strong>{age.days} Days</strong> | Category: <strong>{currentCategory.label}</strong>
                  </span>
                </div>
              </div>

              {/* Real-time detailed table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">18-27 Posts:</span>
                    <strong className={groupResults[0].isEligible ? "text-success" : "text-warning"}>{groupResults[0].status}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">18-30 Posts:</span>
                    <strong className={groupResults[1].isEligible ? "text-success" : "text-warning"}>{groupResults[1].status}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">18-32 (JSO):</span>
                    <strong className={groupResults[2].isEligible ? "text-success" : "text-warning"}>{groupResults[2].status}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Age Relaxation:</span>
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
              <div className="small text-secondary mb-1 fw-semibold">Your Exact Age</div>
              <div className="fs-4 fw-bold text-dark">{age.years} Yrs {age.months} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                And {age.days} Days
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Max Age (with Quota)</div>
              <div className="fs-4 fw-bold text-primary">{30 + currentCategory.relaxation} Yrs</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                For Inspector (4600 GP)
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Category Relaxation</div>
              <div className="fs-4 fw-bold text-success">+{currentCategory.relaxation} Yrs</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {currentCategory.label}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Eligible Posts</div>
              <div className={`fs-4 fw-bold ${isOverallEligible ? "text-success" : "text-danger"}`}>
                {eligibleCount} / 3 Groups
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Qualification verified
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
                  `My SSC CGL Age as on 01-Aug-${REFERENCE_YEAR} is ${age.years} Yrs ${age.months} M (Eligible: ${eligibleCount}/3 Post Groups). Check yours: https://www.pkminfotech.com/tools/ssc/ssc-cgl-age-limit-calculator`
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
                title="Share on WhatsApp"
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
                    <span className="text-nowrap">Copy Status</span>
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
