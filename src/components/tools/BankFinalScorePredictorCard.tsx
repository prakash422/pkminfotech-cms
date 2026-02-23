"use client"

import { useState, useMemo } from "react"
import { CheckCircle, ChevronDown, Info } from "lucide-react"

const EXAMS = [
  { value: "ibps-po", label: "IBPS PO" },
  { value: "ibps-clerk", label: "IBPS Clerk" },
  { value: "ibps-rrb-po", label: "IBPS RRB PO" },
  { value: "ibps-rrb-clerk", label: "IBPS RRB Clerk" },
  { value: "sbi-po", label: "SBI PO" },
  { value: "sbi-clerk", label: "SBI Clerk" },
]

// Illustrative: prelims scaled to 50, mains scaled to 192 in final merit (total 242). Actual weightage varies by notification.
const PRELIMS_WEIGHT = 50
const MAINS_WEIGHT = 192

function computeFinalScore(
  prelimsObtained: number,
  prelimsTotal: number,
  mainsObtained: number,
  mainsTotal: number
): { final: number; prelimsWeight: number; mainsWeight: number } {
  const pTotal = Math.max(1, prelimsTotal)
  const mTotal = Math.max(1, mainsTotal)
  const prelimsWeight = (prelimsObtained / pTotal) * PRELIMS_WEIGHT
  const mainsWeight = (mainsObtained / mTotal) * MAINS_WEIGHT
  const final = Math.round((prelimsWeight + mainsWeight) * 100) / 100
  return {
    final,
    prelimsWeight: Math.round(prelimsWeight * 100) / 100,
    mainsWeight: Math.round(mainsWeight * 100) / 100,
  }
}

// Illustrative threshold; actual cutoff varies by exam and year
const QUALIFY_THRESHOLD = 100

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/banking"

export default function BankFinalScorePredictorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [exam, setExam] = useState("ibps-po")
  const [prelimsObtained, setPrelimsObtained] = useState("65")
  const [prelimsTotal, setPrelimsTotal] = useState("100")
  const [mainsObtained, setMainsObtained] = useState("125")
  const [mainsTotal, setMainsTotal] = useState("200")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const pObtained = useMemo(() => parseFloat(prelimsObtained) || 0, [prelimsObtained])
  const pTotal = useMemo(() => parseFloat(prelimsTotal) || 100, [prelimsTotal])
  const mObtained = useMemo(() => parseFloat(mainsObtained) || 0, [mainsObtained])
  const mTotal = useMemo(() => parseFloat(mainsTotal) || 200, [mainsTotal])

  const { final, prelimsWeight, mainsWeight } = useMemo(
    () => computeFinalScore(pObtained, pTotal, mObtained, mTotal),
    [pObtained, pTotal, mObtained, mTotal]
  )
  const isLikelyQualify = useMemo(() => final >= QUALIFY_THRESHOLD, [final])

  const handlePredict = () => setSubmitted(true)

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-2 p-md-4">
          <div className="row g-2 g-md-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Marks</h3>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Select Exam <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                >
                  {EXAMS.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Prelims Score <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control form-control-sm"
                    value={prelimsObtained}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setPrelimsObtained(v.slice(0, 6))
                    }}
                    placeholder="65"
                  />
                  <span className="text-secondary small">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control form-control-sm"
                    style={{ width: 70 }}
                    value={prelimsTotal}
                    onChange={(e) => setPrelimsTotal(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                  />
                </div>
              </div>
              <div className="mb-2 mb-md-4">
                <label className="form-label small mb-0 mb-md-1">
                  Mains Score <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control form-control-sm"
                    value={mainsObtained}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setMainsObtained(v.slice(0, 6))
                    }}
                    placeholder="125"
                  />
                  <span className="text-secondary small">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control form-control-sm"
                    style={{ width: 70 }}
                    value={mainsTotal}
                    onChange={(e) => setMainsTotal(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handlePredict}
              >
                Predict Final Score <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Enter your prelims and mains marks (obtained / total), then click <strong>Predict Final Score</strong> to see your estimated final score and weightage.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <CheckCircle size={22} className="text-success flex-shrink-0" />
                      <span className="fw-semibold text-dark">Predicted Final Score</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <p className="fs-2 fw-bold text-dark mb-3 rounded-2 bg-light d-inline-block px-3 py-2">
                        {final.toFixed(2)}
                      </p>
                      <div className="d-flex justify-content-between small text-secondary mb-2">
                        <span>Prelims Weightage:</span>
                        <span>{prelimsWeight.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mb-3">
                        <span>Mains Weightage:</span>
                        <span>{mainsWeight.toFixed(2)}</span>
                      </div>
                      <div className={`rounded-2 p-3 small ${isLikelyQualify ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"}`}>
                        {isLikelyQualify
                          ? "You are likely to qualify for the next round!"
                          : "Keep preparing. Final cutoffs vary each year; check the official result for your exam."}
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
            <span className="flex-grow-1 fw-semibold">How is the final score calculated?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">Bank exams like IBPS PO/Clerk use a <strong>combined merit</strong> where Prelims and Mains marks are scaled and added. Typically, Prelims is given a lower weight (e.g. scaled to 50) and Mains a higher weight (e.g. scaled to 150–200) in the final score. This tool uses an <strong>illustrative formula</strong>—actual weightage and normalization are given in the official notification. Interview (if any) is usually a separate stage. Refer to the exam advertisement for the exact final merit calculation.</p>
                <p className="mb-0 mt-2">Always rely on the official result for final selection; this predictor is for estimation only.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
