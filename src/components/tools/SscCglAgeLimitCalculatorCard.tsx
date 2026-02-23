"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, ChevronDown, Calendar, Info } from "lucide-react"

const REFERENCE_YEAR = new Date().getFullYear()
const REFERENCE_DATE = new Date(REFERENCE_YEAR, 0, 1) // 1 Jan of current year

const CATEGORIES: { value: string; label: string; defaultUpperAge: number }[] = [
  { value: "general", label: "General (UR)", defaultUpperAge: 30 },
  { value: "obc", label: "OBC", defaultUpperAge: 33 },
  { value: "sc", label: "SC", defaultUpperAge: 35 },
  { value: "st", label: "ST", defaultUpperAge: 35 },
  { value: "ews", label: "EWS", defaultUpperAge: 30 },
  { value: "obc-ncl", label: "OBC (NCL)", defaultUpperAge: 33 },
  { value: "pwbd", label: "PwBD (with relaxation)", defaultUpperAge: 35 },
]

const UPPER_AGE_OPTIONS = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 40]

function getAgeAsOnDate(dob: Date, refDate: Date): number {
  let age = refDate.getFullYear() - dob.getFullYear()
  const m = refDate.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && refDate.getDate() < dob.getDate())) age--
  return Math.max(0, age)
}

function formatDateForInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

type Props = { basePath?: string }

export default function SscCglAgeLimitCalculatorCard({ basePath }: Props) {
  const [category, setCategory] = useState("general")
  const [dobInput, setDobInput] = useState("1998-12-31")
  const [upperAgeLimit, setUpperAgeLimit] = useState(30)
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const dobDate = useMemo(() => {
    const [y, m, d] = dobInput.split("-").map(Number)
    if (!y || !m || !d) return null
    const date = new Date(y, m - 1, d)
    if (isNaN(date.getTime())) return null
    return date
  }, [dobInput])

  const ageAsOnRef = useMemo(() => (dobDate ? getAgeAsOnDate(dobDate, REFERENCE_DATE) : null), [dobDate])

  const isEligible = useMemo(() => {
    if (ageAsOnRef === null) return null
    return ageAsOnRef >= 18 && ageAsOnRef <= upperAgeLimit
  }, [ageAsOnRef, upperAgeLimit])

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    const cat = CATEGORIES.find((c) => c.value === val)
    if (cat) setUpperAgeLimit(cat.defaultUpperAge)
  }

  const handleCheck = () => setSubmitted(true)

  return (
    <>
    <div className="card border-0 shadow-sm ssc-cgl-calc-card">
      <div className="card-body p-3 p-md-4">
        <div className="row g-4">
          <div className="col-md-6 col-lg-5">
            <h3 className="h6 fw-semibold mb-3">Enter Your Details</h3>
            <div className="mb-3">
              <label className="form-label small mb-1">
                Select Your Category <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small mb-1">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white">
                  <Calendar size={16} className="text-secondary" />
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  max={formatDateForInput(new Date())}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small mb-1">Upper Age Limit for SSC CGL ({REFERENCE_YEAR})</label>
              <select
                className="form-select form-select-sm"
                value={upperAgeLimit}
                onChange={(e) => setUpperAgeLimit(Number(e.target.value))}
              >
                {UPPER_AGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} years
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleCheck}>
              Check Eligibility <span aria-hidden>→</span>
            </button>
          </div>
          <div className="col-md-6 col-lg-7">
            <div className="h-100 d-flex flex-column justify-content-center">
              {!submitted ? (
                <div className="text-center text-secondary py-4">
                  <p className="mb-0 small">Enter your details and click <strong>Check Eligibility</strong> to see if you meet the age limit for SSC CGL.</p>
                </div>
              ) : ageAsOnRef === null ? (
                <div className="text-center text-warning py-4">
                  <p className="mb-0 small">Please enter a valid date of birth.</p>
                </div>
              ) : (
                <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                  <div className={`px-3 py-2 d-flex align-items-center gap-2 ${isEligible ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}>
                    {isEligible ? (
                      <>
                        <CheckCircle size={22} className="text-success flex-shrink-0" />
                        <span className="fw-semibold text-dark">You are Eligible!</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={22} className="text-danger flex-shrink-0" />
                        <span className="fw-semibold text-dark">You are not eligible by age</span>
                      </>
                    )}
                  </div>
                  <div className="card-body p-3 p-md-4">
                    <p className="text-secondary small mb-1">Age as of January 1, {REFERENCE_YEAR}:</p>
                    <p className="fs-2 fw-bold text-dark mb-1">{ageAsOnRef} Years</p>
                    <p className="small text-secondary mb-3">Tier 1 + Tier 2 Marks</p>
                    <div className={`rounded-2 p-3 small mb-0 ${isEligible ? "bg-success text-white" : "bg-danger bg-opacity-10 text-danger"}`}>
                      {isEligible
                        ? "Congrats! You meet the age limit criteria for SSC CGL."
                        : `Your age (${ageAsOnRef} years) is outside the allowed range (18 – ${upperAgeLimit} years). Check the official notification for relaxations.`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <section className="card border-0 shadow-sm mt-3 criteria-expand-card border-start border-primary border-3">
      <div className="card-body p-0 bg-primary bg-opacity-10">
        <button
          type="button"
          className="btn btn-link w-100 text-start d-flex align-items-center gap-2 px-4 py-3 text-decoration-none text-dark criteria-expand-btn"
          onClick={() => setCriteriaExpanded((e) => !e)}
          aria-expanded={criteriaExpanded}
        >
          <span className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 flex-shrink-0" style={{ width: 36, height: 36 }}>
            <Info size={20} className="text-primary" />
          </span>
          <span className="flex-grow-1 fw-semibold">What are the age criteria for SSC CGL?</span>
          {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
        </button>
        {criteriaExpanded && (
          <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
            <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
              <p className="mb-1">Age is calculated as on <strong>1st January {REFERENCE_YEAR}</strong>. Minimum age is usually 18 years. Upper age limit varies by category and post:</p>
              <ul className="mb-0 ps-3">
                <li>General (UR) / EWS: 18–30 years</li>
                <li>OBC: 18–33 years</li>
                <li>SC / ST: 18–35 years</li>
                <li>PwBD may get relaxation as per notification.</li>
              </ul>
              <p className="mt-2 mb-0">Always refer to the official SSC CGL notification on ssc.gov.in for the exact criteria for your year and post.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  </>
  )
}
