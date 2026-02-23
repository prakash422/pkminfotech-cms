"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { HelpCircle, CheckCircle, XCircle, Minus, Info, ChevronDown, ChevronRight } from "lucide-react"

// Tier 1 defaults
const T1_TOTAL = 100
const T1_MARKS = 2
const T1_NEG = 0.5
// Tier 2 defaults
const T2_TOTAL = 100
const T2_MARKS = 3
const T2_NEG = 1

const step = (val: number, delta: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round((val + delta) * 100) / 100))

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/ssc-cgl"

const clamp = (v: number, max: number) => Math.min(max, Math.max(0, v))

export default function SscCglFinalScoreCalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [t1TotalStr, setT1TotalStr] = useState(String(T1_TOTAL))
  const [t1CorrectStr, setT1CorrectStr] = useState("0")
  const [t1IncorrectStr, setT1IncorrectStr] = useState("0")
  const [t1Marks, setT1Marks] = useState(T1_MARKS)
  const [t1Neg, setT1Neg] = useState(T1_NEG)

  const [t2TotalStr, setT2TotalStr] = useState(String(T2_TOTAL))
  const [t2CorrectStr, setT2CorrectStr] = useState("0")
  const [t2IncorrectStr, setT2IncorrectStr] = useState("0")
  const [t2Marks, setT2Marks] = useState(T2_MARKS)
  const [t2Neg, setT2Neg] = useState(T2_NEG)

  const [expanded, setExpanded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const t1Total = useMemo(() => Math.max(1, parseInt(t1TotalStr, 10) || T1_TOTAL), [t1TotalStr])
  const t1Correct = useMemo(() => clamp(parseInt(t1CorrectStr, 10) || 0, t1Total), [t1CorrectStr, t1Total])
  const t1Incorrect = useMemo(() => clamp(parseInt(t1IncorrectStr, 10) || 0, t1Total), [t1IncorrectStr, t1Total])
  const t2Total = useMemo(() => Math.max(1, parseInt(t2TotalStr, 10) || T2_TOTAL), [t2TotalStr])
  const t2Correct = useMemo(() => clamp(parseInt(t2CorrectStr, 10) || 0, t2Total), [t2CorrectStr, t2Total])
  const t2Incorrect = useMemo(() => clamp(parseInt(t2IncorrectStr, 10) || 0, t2Total), [t2IncorrectStr, t2Total])

  const tier1Score = useMemo(() => {
    const g = t1Correct * t1Marks
    const d = t1Incorrect * t1Neg
    return Math.max(0, Math.round((g - d) * 10) / 10)
  }, [t1Correct, t1Incorrect, t1Marks, t1Neg])

  const tier2Score = useMemo(() => {
    const g = t2Correct * t2Marks
    const d = t2Incorrect * t2Neg
    return Math.max(0, Math.round((g - d) * 10) / 10)
  }, [t2Correct, t2Incorrect, t2Marks, t2Neg])

  const finalScore = useMemo(() => Math.round((tier1Score + tier2Score) * 10) / 10, [tier1Score, tier2Score])

  const hasScore = tier1Score > 0 || tier2Score > 0
  const negMarksT1 = t1Incorrect * t1Neg
  const negMarksT2 = t2Incorrect * t2Neg

  return (
    <div className="card border-0 shadow-sm ssc-cgl-calc-card">
      <div className="card-body p-2 p-md-4 ssc-cgl-calc-card-body">
        {/* Select Tier tabs */}
        <div className="d-flex align-items-center gap-1 gap-md-2 mb-2 mb-md-4">
          <span className="small fw-semibold text-secondary d-none d-md-inline">Select Tier</span>
          <div className="d-flex rounded overflow-hidden border border-secondary-subtle">
            <Link href={`${basePath}/tier-1-marks-calculator`} className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-light text-secondary text-decoration-none">
              Tier 1
            </Link>
            <Link href={`${basePath}/tier-2-marks-calculator`} className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-light text-secondary text-decoration-none">
              Tier 2
            </Link>
            <span className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-primary text-white">Final Score</span>
          </div>
        </div>

        <div className="row g-2 g-md-4 align-items-start">
          {/* Left: Enter Your Responses - Tier 1 & Tier 2 blocks (scrollable so score stays visible) */}
          <div className="col-md-6 ssc-cgl-final-left-col">
            <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Responses</h3>
            <div className="ssc-cgl-final-scroll">
            {/* Tier 1 block */}
            <div className="mb-3 mb-md-4">
              <span className="badge rounded-pill bg-primary mb-1 mb-md-2">Tier 1</span>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Total Questions</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t1TotalStr} onChange={(e) => setT1TotalStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary ssc-cgl-input-icon"><HelpCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Correct Answers</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t1CorrectStr} onChange={(e) => setT1CorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle text-success ssc-cgl-icon-green ssc-cgl-input-icon"><CheckCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Incorrect Answers</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t1IncorrectStr} onChange={(e) => setT1IncorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle text-danger ssc-cgl-icon-red ssc-cgl-input-icon"><XCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small mb-0 mb-md-1">Marks Per Correct Answer</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="number" className="form-control form-control-sm flex-grow-1" step={0.25} min={0.25} max={10} value={t1Marks} onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) setT1Marks(step(v, 0, 0.25, 10)) }} />
                  <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
              <div className="mb-0">
                <label className="form-label small mb-0 mb-md-1">Negative Marking</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="number" className="form-control form-control-sm flex-grow-1" step={0.25} min={0} max={2} value={t1Neg} onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) setT1Neg(step(v, 0, 0, 2)) }} />
                  <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Tier 2 block */}
            <div>
              <span className="badge rounded-pill bg-primary mb-1 mb-md-2">Tier 2</span>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Total Questions</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t2TotalStr} onChange={(e) => setT2TotalStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary ssc-cgl-input-icon"><HelpCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Correct Answers</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t2CorrectStr} onChange={(e) => setT2CorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle text-success ssc-cgl-icon-green ssc-cgl-input-icon"><CheckCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-1 mb-md-2">
                <label className="form-label small mb-0 mb-md-1">Incorrect Answers</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="form-control form-control-sm" value={t2IncorrectStr} onChange={(e) => setT2IncorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")} />
                  <span className="d-flex align-items-center justify-content-center rounded-circle text-danger ssc-cgl-icon-red ssc-cgl-input-icon"><XCircle size={14} /></span>
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small mb-0 mb-md-1">Marks Per Correct Answer</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="number" className="form-control form-control-sm flex-grow-1" step={0.25} min={0.25} max={10} value={t2Marks} onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) setT2Marks(step(v, 0, 0.25, 10)) }} />
                  <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
              <div className="mb-0">
                <label className="form-label small mb-0 mb-md-1">Negative Marking</label>
                <div className="d-flex align-items-center gap-1 gap-md-2">
                  <input type="number" className="form-control form-control-sm flex-grow-1" step={0.25} min={0} max={2} value={t2Neg} onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) setT2Neg(step(v, 0, 0, 2)) }} />
                  <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>
            </div>

            {/* How are marks calculated - outside scroll, always visible */}
            <div className="mt-3 pt-3 border-top border-secondary-subtle">
              <button type="button" className="btn btn-link p-0 text-primary text-decoration-none d-flex align-items-center gap-2 small fw-semibold" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                <Info size={16} className="flex-shrink-0" />
                How are marks calculated? {expanded ? <ChevronDown size={16} /> : "Expand >"}
              </button>
            </div>
          </div>

          {/* Right: Your Final Calculated Score – only after Calculate click */}
          <div className="col-md-6">
            {!submitted ? (
              <>
                <p className="small text-secondary mb-3">Enter Tier 1 and Tier 2 responses on the left, then click Calculate Score to see your combined marks.</p>
                <button
                  type="button"
                  className="btn btn-primary ssc-cgl-calc-btn"
                  onClick={() => setSubmitted(true)}
                >
                  Calculate Score <ChevronRight size={12} className="ms-1" />
                </button>
              </>
            ) : (
              <>
                <h3 className="h6 fw-semibold mb-2 d-flex align-items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  Your Final Calculated Score
                </h3>
                <div className="rounded-3 p-3 mb-2 fw-semibold small ssc-cgl-result-msg">
                  {hasScore ? "Congratulations!" : "Enter Tier 1 & Tier 2 responses"}
                </div>
                <p className="small text-secondary mb-1">Tier 1 + Tier 2 Marks</p>
                <p className="display-5 fw-bold text-dark mb-1">{finalScore}</p>
                <p className="small text-secondary mb-2">Tier 1 + Tier 2 Marks</p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mb-3"
                  onClick={() => setSubmitted(false)}
                >
                  Recalculate
                </button>
                <div className="pt-3 border-top border-secondary-subtle">
                  <p className="small fw-semibold text-secondary mb-2">Detailed Results:</p>
                  <table className="table table-sm small mb-0 ssc-cgl-detail-table">
                    <thead>
                      <tr>
                        <th className="border-0 py-1 pe-2 text-secondary fw-normal"></th>
                        <th className="border-0 py-1 text-end fw-semibold">Tier 1:</th>
                        <th className="border-0 py-1 text-end fw-semibold">Tier 2:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-0 py-1 pe-2 text-secondary">
                          <CheckCircle size={14} className="text-success me-1 align-middle" /> Correct Answers:
                        </td>
                        <td className="border-0 py-1 text-end"><strong>{t1Correct}</strong></td>
                        <td className="border-0 py-1 text-end"><strong>{t2Correct}</strong></td>
                      </tr>
                      <tr>
                        <td className="border-0 py-1 pe-2 text-secondary">
                          <XCircle size={14} className="text-danger me-1 align-middle" /> Incorrect Answers:
                        </td>
                        <td className="border-0 py-1 text-end"><strong>{t1Incorrect}</strong></td>
                        <td className="border-0 py-1 text-end"><strong>{t2Incorrect}</strong></td>
                      </tr>
                      <tr>
                        <td className="border-0 py-1 pe-2 text-secondary">
                          <Minus size={14} className="me-1 align-middle" /> Negative Marks:
                        </td>
                        <td className="border-0 py-1 text-end"><strong>-{negMarksT1.toFixed(1)}</strong></td>
                        <td className="border-0 py-1 text-end"><strong>-{negMarksT2.toFixed(1)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Expanded content - full width below */}
        {expanded && (
          <div className="mt-4 pt-3 border-top border-secondary-subtle small text-secondary ssc-cgl-calc-expanded">
            <p className="fw-semibold text-dark mb-2">Formula</p>
            <p className="mb-2">Tier 1: (Correct × {t1Marks}) − (Incorrect × {t1Neg}). Tier 2: (Correct × {t2Marks}) − (Incorrect × {t2Neg}). Final = Tier 1 score + Tier 2 score.</p>
            <p className="fw-semibold text-dark mb-2">Negative marking</p>
            <p className="mb-2">Tier 1: +{t1Marks} per correct, −{t1Neg} per wrong. Tier 2: +{t2Marks} per correct, −{t2Neg} per wrong. Unattempted: no negative.</p>
            <p className="fw-semibold text-dark mb-2">FAQ</p>
            <p className="mb-1"><strong>Final merit?</strong> SSC may use normalized scores and weightage (e.g. 1:3). Check notification.</p>
            <p className="mb-0"><strong>Exact formula?</strong> See SSC CGL notification on ssc.gov.in for that year.</p>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ssc-cgl-calc-card { border-radius: 12px; }
        .ssc-cgl-calc-card-body .px-2.py-1_5 { padding: 0.35rem 0.5rem !important; }
        @media (min-width: 768px) {
          .ssc-cgl-calc-card-body .px-2.py-1_5 { padding: 0.5rem 0.75rem !important; }
        }
        .ssc-cgl-input-icon { display: inline-block; width: 22px; height: 22px; min-width: 22px; flex-shrink: 0; }
        @media (min-width: 768px) {
          .ssc-cgl-input-icon { width: 24px; height: 24px; }
        }
        .ssc-cgl-calc-btn {
          background: #2563eb !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
          padding: 0 0.65rem;
          height: 28px;
          line-height: 1;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 8px;
        }
        .ssc-cgl-calc-btn:hover {
          background: #1d4ed8 !important;
          color: #fff !important;
          transform: translateY(-1px);
        }
        .ssc-cgl-calc-expanded { line-height: 1.6; }
        .ssc-cgl-result-msg { background: rgba(25, 135, 84, 0.12); color: #198754; }
        .ssc-cgl-icon-green { background: rgba(25, 135, 84, 0.15); }
        .ssc-cgl-icon-red { background: rgba(220, 53, 69, 0.15); }
        .ssc-cgl-detail-table { font-size: 0.875rem; }
        .ssc-cgl-final-left-col { display: flex; flex-direction: column; }
        .ssc-cgl-final-scroll { max-height: 70vh; overflow-y: auto; overflow-x: hidden; padding-right: 4px; }
        .ssc-cgl-final-scroll::-webkit-scrollbar { width: 6px; }
        .ssc-cgl-final-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .ssc-cgl-final-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}} />
    </div>
  )
}
