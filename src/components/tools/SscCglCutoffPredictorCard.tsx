"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, ChevronDown, Info } from "lucide-react"

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General (UR)" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "obc-ncl", label: "OBC (NCL)" },
]

// Illustrative expected cutoff ranges by tier and category (for display only; actual cutoffs vary by cycle)
const ESTIMATED_CUTOFF: Record<string, Record<string, number>> = {
  "tier-1": {
    general: 95.76,
    ews: 93.5,
    obc: 88.2,
    "obc-ncl": 88.2,
    sc: 82.5,
    st: 78.4,
  },
  "tier-2": {
    general: 285,
    ews: 278,
    obc: 265,
    "obc-ncl": 265,
    sc: 248,
    st: 235,
  },
}

function getEstimatedCutoff(tier: string, category: string): number {
  const t = tier === "tier-1" ? "tier-1" : "tier-2"
  const c = CATEGORIES.some((x) => x.value === category) ? category : "general"
  return ESTIMATED_CUTOFF[t]?.[c] ?? ESTIMATED_CUTOFF[t]?.general ?? 95.76
}

function getRankBand(score: number, cutoff: number): string {
  const diff = score - cutoff
  if (diff >= 25) return "Top 5%"
  if (diff >= 15) return "Top 10%"
  if (diff >= 5) return "Top 20%"
  if (diff >= 0) return "Above cutoff"
  return "Below cutoff"
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/ssc-cgl"

export default function SscCglCutoffPredictorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [tier, setTier] = useState<"tier-1" | "tier-2">("tier-1")
  const [category, setCategory] = useState("general")
  const [score, setScore] = useState("110")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const scoreNum = useMemo(() => parseFloat(score) || 0, [score])
  const estimatedCutoff = useMemo(() => getEstimatedCutoff(tier, category), [tier, category])
  const isAboveCutoff = useMemo(() => scoreNum >= estimatedCutoff, [scoreNum, estimatedCutoff])
  const rankBand = useMemo(() => getRankBand(scoreNum, estimatedCutoff), [scoreNum, estimatedCutoff])
  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? "General (UR)"

  const handlePredict = () => setSubmitted(true)

  const formatCutoff = (n: number) => (tier === "tier-1" ? n.toFixed(2) : Math.round(n).toString())

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-2 p-md-4">
          <div className="row g-2 g-md-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Details</h3>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-1">
                  Select Tier <span className="text-danger">*</span>
                </label>
                <div className="d-flex rounded overflow-hidden border border-secondary-subtle">
                  <button
                    type="button"
                    className={`flex-grow-1 px-3 py-2 small fw-semibold border-0 ${tier === "tier-1" ? "bg-primary text-white" : "bg-light text-secondary"}`}
                    onClick={() => setTier("tier-1")}
                  >
                    Tier 1
                  </button>
                  <button
                    type="button"
                    className={`flex-grow-1 px-3 py-2 small fw-semibold border-0 ${tier === "tier-2" ? "bg-primary text-white" : "bg-light text-secondary"}`}
                    onClick={() => setTier("tier-2")}
                  >
                    Tier 2
                  </button>
                </div>
              </div>
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
                  placeholder={tier === "tier-1" ? "e.g. 110" : "e.g. 280"}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handlePredict}
              >
                Predict Cutoff <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Select tier, category and enter your score, then click <strong>Predict Cutoff</strong> to see the expected cutoff and your standing.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <CheckCircle size={22} className="text-success flex-shrink-0" />
                      <span className="fw-semibold text-dark">Expected Cutoff Marks</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <div className={`rounded-2 p-3 mb-3 small ${isAboveCutoff ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                        {isAboveCutoff ? "You are above the cutoff!" : "You are below the expected cutoff."}
                      </div>
                      <p className="text-secondary small mb-1">Expected Cutoff ({categoryLabel}):</p>
                      <p className="fs-2 fw-bold text-dark mb-2">{formatCutoff(estimatedCutoff)}</p>
                      <p className="small text-secondary mb-3">Your Rank: {rankBand}</p>
                      <div className={`rounded-2 p-3 small mb-0 ${isAboveCutoff ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"}`}>
                        {isAboveCutoff
                          ? "Great! You are likely to qualify for the next round."
                          : "Keep practicing. Cutoffs vary each cycle; check the official result for actual cut-off marks."}
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
            <span className="flex-grow-1 fw-semibold">How are cutoff marks predicted?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">Cutoff marks depend on the number of vacancies, candidates appeared, difficulty of the paper, and category. This tool uses <strong>illustrative estimates</strong> based on past trends—actual cutoffs are declared by SSC after the exam. Tier 1 cutoffs are usually in the range of 80–110 (out of 200) for General; Tier 2 cutoffs are higher as total marks are different.</p>
                <p className="mb-0 mt-2">Always refer to the official SSC CGL result and cut-off marks published on ssc.gov.in for your cycle.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
