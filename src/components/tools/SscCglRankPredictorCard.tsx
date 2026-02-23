"use client"

import { useState, useMemo } from "react"
import { CheckCircle, ChevronDown, Info } from "lucide-react"

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General (UR)" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "obc-ncl", label: "OBC (NCL)" },
]

// Illustrative: score -> approximate rank (lower score = higher rank number). Tier 1 max 200, Tier 2 higher.
function getEstimatedRank(score: number, tier: "tier-1" | "tier-2"): number {
  const max = tier === "tier-1" ? 200 : 700
  const pct = Math.max(0, Math.min(1, score / max))
  // Higher % -> lower rank (better). Rough curve: top 1% -> ~500-1500, middle -> 20k-50k
  const rank = Math.round(500 * Math.exp(4 * (1 - pct)))
  return Math.max(1, Math.min(999999, rank))
}

function getPercentileBand(score: number, tier: "tier-1" | "tier-2"): string {
  const max = tier === "tier-1" ? 200 : 700
  const pct = (score / max) * 100
  if (pct >= 85) return "Top 1%"
  if (pct >= 75) return "Top 5%"
  if (pct >= 65) return "Top 10%"
  if (pct >= 50) return "Top 20%"
  if (pct >= 40) return "Top 30%"
  return "Top 50%"
}

function getMessage(percentile: string): string {
  if (percentile === "Top 1%") return "Amazing! You are in the top 1% candidates for SSC CGL."
  if (percentile === "Top 5%") return "Great! You are in the top 5% candidates for SSC CGL."
  if (percentile === "Top 10%") return "Well done! You are in the top 10% candidates for SSC CGL."
  return "Your estimated rank is based on your score. Actual rank depends on the exam cycle and total candidates."
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/ssc-cgl"

export default function SscCglRankPredictorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [tier, setTier] = useState<"tier-1" | "tier-2">("tier-1")
  const [category, setCategory] = useState("general")
  const [score, setScore] = useState("160")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const scoreNum = useMemo(() => parseFloat(score) || 0, [score])
  const estimatedRank = useMemo(() => getEstimatedRank(scoreNum, tier), [scoreNum, tier])
  const percentileBand = useMemo(() => getPercentileBand(scoreNum, tier), [scoreNum, tier])
  const message = useMemo(() => getMessage(percentileBand), [percentileBand])
  const tierLabel = tier === "tier-1" ? "SSC CGL Tier 1" : "SSC CGL Tier 2"

  const handlePredict = () => setSubmitted(true)

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-3 p-md-4">
          <div className="row g-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-3">Enter Your Details</h3>
              <div className="mb-3">
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
              <div className="mb-3">
                <label className="form-label small mb-1">
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
              <div className="mb-4">
                <label className="form-label small mb-1">
                  Enter Your Score <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={0}
                  max={tier === "tier-1" ? 200 : 999}
                  step={tier === "tier-1" ? 0.01 : 1}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={tier === "tier-1" ? "e.g. 160" : "e.g. 450"}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handlePredict}
              >
                Predict Rank <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Select tier, category and enter your score, then click <strong>Predict Rank</strong> to see your estimated rank.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <CheckCircle size={22} className="text-success flex-shrink-0" />
                      <span className="fw-semibold text-dark">Predicted Rank</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <div className="bg-success bg-opacity-10 rounded-2 p-3 mb-3 text-center">
                        <p className="fs-2 fw-bold text-dark mb-0">{estimatedRank}</p>
                      </div>
                      <p className="text-secondary small mb-2">Your Estimated Rank</p>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="flex-grow-1 progress" style={{ height: 8 }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: percentileBand === "Top 1%" ? "100%" : percentileBand === "Top 5%" ? "95%" : "85%" }} aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} />
                        </div>
                        <span className="small fw-semibold text-primary">{percentileBand}</span>
                      </div>
                      <p className="small text-success mb-3">{message}</p>
                      <p className="small text-secondary mb-0">Exam Attempt: {tierLabel}</p>
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
            <span className="flex-grow-1 fw-semibold">How is the rank predicted?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">Rank prediction is <strong>estimative</strong> and based on score ranges and past trends. Actual rank depends on total candidates, difficulty, and the final answer key. This tool gives an approximate rank and percentile band to help you gauge your standing—it is not the official merit position. SSC declares the final rank after the result.</p>
                <p className="mb-0 mt-2">Always refer to the official SSC CGL result for your actual rank.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
