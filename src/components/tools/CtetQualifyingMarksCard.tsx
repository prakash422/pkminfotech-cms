"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, ChevronDown, Info } from "lucide-react"

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General (UR)" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "pwbd", label: "PwD" },
]

const LEVELS = [
  { value: "paper-1", label: "Paper 1" },
  { value: "paper-2", label: "Paper 2" },
]

// CTET: each paper 150 marks. General/EWS 60% = 90; SC/ST/OBC/PwD 55% = 82.5 (rounded 83 for display)
const QUALIFYING_MARKS: Record<string, number> = {
  general: 90,
  ews: 90,
  obc: 83,
  sc: 83,
  st: 83,
  pwbd: 83,
}

function getMinQualifyingMarks(category: string): number {
  return QUALIFYING_MARKS[category] ?? QUALIFYING_MARKS.general ?? 90
}

function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? "General (UR)"
}

function getLevelLabel(level: string): string {
  return LEVELS.find((l) => l.value === level)?.label ?? "Paper 1"
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/teaching"

export default function CtetQualifyingMarksCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [category, setCategory] = useState("general")
  const [level, setLevel] = useState("paper-1")
  const [score, setScore] = useState("80")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const scoreNum = useMemo(() => parseFloat(score) || 0, [score])
  const minRequired = useMemo(() => getMinQualifyingMarks(category), [category])
  const isEligible = useMemo(() => scoreNum >= minRequired, [scoreNum, minRequired])
  const categoryLabel = useMemo(() => getCategoryLabel(category), [category])
  const levelLabel = useMemo(() => getLevelLabel(level), [level])

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
                  Select Level <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2 mb-md-4">
                <label className="form-label small mb-0 mb-md-1">
                  Enter Your Score <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="form-control form-control-sm"
                  value={score}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === "" || /^\d*\.?\d*$/.test(v)) setScore(v.slice(0, 6))
                  }}
                  placeholder="80"
                />
                <small className="text-secondary">Out of 150 per paper</small>
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
                      Select category, paper (1 or 2) and enter your score, then click <strong>Check Eligibility</strong> to see if you meet the qualifying marks.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      {isEligible ? (
                        <CheckCircle size={22} className="text-success flex-shrink-0" />
                      ) : (
                        <XCircle size={22} className="text-danger flex-shrink-0" />
                      )}
                      <span className="fw-semibold text-dark">Qualifying Marks Result</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <div className={`rounded-2 p-3 mb-3 d-flex align-items-center gap-2 ${isEligible ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                        {isEligible ? (
                          <CheckCircle size={22} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={22} className="flex-shrink-0" />
                        )}
                        <span className="fw-semibold">
                          {isEligible ? "You meet the minimum qualifying marks." : "You do not meet the minimum requirement."}
                        </span>
                      </div>
                      <p className="small text-secondary mb-1">
                        Minimum Marks Required: {minRequired} ({categoryLabel} – {levelLabel})
                      </p>
                      <p className="small text-secondary mb-0">Your Marks: {scoreNum}</p>
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
            <span className="flex-grow-1 fw-semibold">What are the minimum qualifying marks for CTET?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">CTET has <strong>qualifying marks</strong> (not cutoff for selection): <strong>60%</strong> for General/EWS and <strong>55%</strong> for SC/ST/OBC/PwD. Each paper (Paper 1 and Paper 2) is of 150 marks, so General needs 90 and reserved categories need 82.5 (rounded to 83). You need to score at least the qualifying marks in each paper you appear for. This tool uses the official criteria—check the latest CTET notification for any updates.</p>
                <p className="mb-0 mt-2">Qualifying does not guarantee job; it is the minimum to get the CTET certificate. Refer to the official CTET website for the current exam cycle.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
