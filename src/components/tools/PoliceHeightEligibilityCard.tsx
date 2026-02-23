"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, ChevronDown, Info } from "lucide-react"

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General (UR)" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
]

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

// Illustrative minimum height (cm) by gender and category; many state police use similar norms with SC/ST relaxation
const MIN_HEIGHT_CM: Record<string, Record<string, number>> = {
  male: { general: 170, ews: 170, obc: 168, sc: 165, st: 165 },
  female: { general: 157, ews: 157, obc: 155, sc: 152, st: 152 },
}

function getMinHeight(gender: string, category: string): number {
  const g = gender === "female" ? "female" : "male"
  const c = CATEGORIES.some((x) => x.value === category) ? category : "general"
  return MIN_HEIGHT_CM[g]?.[c] ?? MIN_HEIGHT_CM[g]?.general ?? (g === "female" ? 157 : 170)
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/police"

export default function PoliceHeightEligibilityCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [category, setCategory] = useState("general")
  const [gender, setGender] = useState("male")
  const [heightCm, setHeightCm] = useState("165")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const height = useMemo(() => parseFloat(heightCm) || 0, [heightCm])
  const minRequired = useMemo(() => getMinHeight(gender, category), [gender, category])
  const isEligible = useMemo(() => height >= minRequired, [height, minRequired])

  const handleCheck = () => setSubmitted(true)

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-2 p-md-4">
          <div className="row g-2 g-md-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Details</h3>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Select Your Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Gender <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2 mb-md-4">
                <label className="form-label small mb-0 mb-md-1">
                  Enter Your Height <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control"
                    value={heightCm}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setHeightCm(v.slice(0, 5))
                    }}
                    placeholder="165"
                  />
                  <span className="input-group-text bg-white">cm</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCheck}
              >
                Check Eligibility <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Select category, gender and enter your height in cm, then click <strong>Check Eligibility</strong> to see if you meet the minimum height requirement.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <span className="fw-semibold text-dark">Height Eligibility Result</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <div className={`rounded-2 p-3 mb-3 d-flex align-items-center gap-2 ${isEligible ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                        {isEligible ? (
                          <CheckCircle size={22} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={22} className="flex-shrink-0" />
                        )}
                        <span className="fw-semibold">
                          {isEligible ? "You meet the height criteria." : "You do not meet the height criteria."}
                        </span>
                      </div>
                      <p className="small text-secondary mb-1">Minimum Required Height: {minRequired} cm</p>
                      <p className="small text-secondary mb-0">Your Height: {height} cm</p>
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
            <span className="flex-grow-1 fw-semibold">What is the minimum height requirement?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">Police and constable recruitment notifications specify <strong>minimum height</strong> by gender and sometimes by category. Male candidates often need 170 cm (General) and female candidates 157 cm; many states allow <strong>relaxation for SC/ST</strong> (e.g. 5 cm). This tool uses illustrative values—actual requirements vary by state and post. Check the official advertisement for your exam.</p>
                <p className="mb-0 mt-2">Chest measurement and other physical criteria may also apply; refer to the official notification for complete eligibility.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
