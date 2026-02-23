"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { HelpCircle, CheckCircle, XCircle, Info, ChevronDown, ChevronRight, Minus } from "lucide-react"

const DEFAULT_TOTAL = 100
const DEFAULT_CORRECT = 0
const DEFAULT_INCORRECT = 0
const MARKS_PER_CORRECT = 2
const NEGATIVE_MARKING = 0.5

function getScoreMessage(score: number, total: number): string {
  if (total <= 0) return "Enter your responses"
  const pct = total > 0 ? (score / (total * MARKS_PER_CORRECT)) * 100 : 0
  if (pct >= 80) return "Well done!"
  if (pct >= 60) return "Good attempt"
  if (pct >= 40) return "Keep practicing"
  return "Review and try again"
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/ssc-cgl"

export default function SscCglTier1CalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [totalStr, setTotalStr] = useState(String(DEFAULT_TOTAL))
  const [correctStr, setCorrectStr] = useState(String(DEFAULT_CORRECT))
  const [incorrectStr, setIncorrectStr] = useState(String(DEFAULT_INCORRECT))
  const [marksPerCorrect, setMarksPerCorrect] = useState(MARKS_PER_CORRECT)
  const [negativeMarking, setNegativeMarking] = useState(NEGATIVE_MARKING)
  const [expanded, setExpanded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const total = useMemo(() => Math.max(1, parseInt(totalStr, 10) || DEFAULT_TOTAL), [totalStr])
  const correct = useMemo(() => Math.max(0, Math.min(total, parseInt(correctStr, 10) || 0)), [correctStr, total])
  const incorrect = useMemo(() => Math.max(0, Math.min(total, parseInt(incorrectStr, 10) || 0)), [incorrectStr, total])

  const score = useMemo(() => {
    const gain = correct * marksPerCorrect
    const deduct = incorrect * negativeMarking
    const raw = gain - deduct
    return Math.max(0, Math.round(raw * 10) / 10)
  }, [correct, incorrect, marksPerCorrect, negativeMarking])

  const message = useMemo(() => getScoreMessage(score, total), [score, total])

  const step = (val: number, delta: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.round((val + delta) * 100) / 100))

  return (
    <div className="card border-0 shadow-sm ssc-cgl-calc-card">
      <div className="card-body p-2 p-md-4 ssc-cgl-calc-card-body">
        {/* Select Tier tabs */}
        <div className="d-flex align-items-center gap-1 gap-md-2 mb-2 mb-md-4">
          <span className="small fw-semibold text-secondary d-none d-md-inline">Select Tier</span>
          <div className="d-flex rounded overflow-hidden border border-secondary-subtle">
            <span className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-primary text-white">Tier 1</span>
            <Link
              href={`${basePath}/tier-2-marks-calculator`}
              className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-light text-secondary text-decoration-none"
            >
              Tier 2
            </Link>
            <Link
              href={`${basePath}/final-score-calculator`}
              className="px-2 py-1_5 px-md-3 py-md-2 small fw-semibold bg-light text-secondary text-decoration-none"
            >
              Final Score
            </Link>
          </div>
        </div>

        <div className="row g-2 g-md-4">
          {/* Left: Enter Your Responses */}
          <div className="col-md-6">
            <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Responses</h3>
            <div className="mb-2 mb-md-3">
              <label className="form-label small mb-0 mb-md-1">Total Questions</label>
              <div className="d-flex align-items-center gap-1 gap-md-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control form-control-sm"
                  min={1}
                  max={200}
                  value={totalStr}
                  onChange={(e) => setTotalStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary ssc-cgl-input-icon">
                  <HelpCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-2 mb-md-3">
              <label className="form-label small mb-0 mb-md-1">Correct Answers</label>
              <div className="d-flex align-items-center gap-1 gap-md-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control form-control-sm"
                  value={correctStr}
                  onChange={(e) => setCorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle text-success ssc-cgl-icon-green ssc-cgl-input-icon">
                  <CheckCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-2 mb-md-3">
              <label className="form-label small mb-0 mb-md-1">Incorrect Answers</label>
              <div className="d-flex align-items-center gap-1 gap-md-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control form-control-sm"
                  value={incorrectStr}
                  onChange={(e) => setIncorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle text-danger ssc-cgl-icon-red ssc-cgl-input-icon">
                  <XCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-2 mb-md-3">
              <label className="form-label small mb-0 mb-md-1">Marks Per Correct Answer</label>
              <div className="d-flex align-items-center gap-1 gap-md-2">
                <input
                  type="number"
                  className="form-control form-control-sm flex-grow-1"
                  step={0.25}
                  min={0.25}
                  max={10}
                  value={marksPerCorrect}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isNaN(v)) setMarksPerCorrect(step(v, 0, 0.25, 10))
                  }}
                />
                <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label small mb-0 mb-md-1">Negative Marking</label>
              <div className="d-flex align-items-center gap-1 gap-md-2">
                <input
                  type="number"
                  className="form-control form-control-sm flex-grow-1"
                  step={0.25}
                  min={0}
                  max={2}
                  value={negativeMarking}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isNaN(v)) setNegativeMarking(step(v, 0, 0, 2))
                  }}
                />
                <span className="ssc-cgl-input-icon flex-shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Right: Your Calculated Score – only after Calculate click */}
          <div className="col-md-6 d-flex flex-column justify-content-between">
            {!submitted ? (
              <>
                <p className="small text-secondary mb-3">Enter your correct and incorrect answers on the left, then click Calculate Score to see your Tier 1 raw marks.</p>
                <button
                  type="button"
                  className="btn btn-primary align-self-start ssc-cgl-calc-btn"
                  onClick={() => setSubmitted(true)}
                >
                  Calculate Score <ChevronRight size={12} className="ms-1" />
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="h6 fw-semibold mb-2 d-flex align-items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    Your Calculated Score
                  </h3>
                  <div className="rounded-3 p-3 mb-2 fw-semibold small ssc-cgl-result-msg">
                    {message}
                  </div>
                  <p className="small text-secondary mb-1">Marks Obtained:</p>
                  <p className="display-5 fw-bold text-dark mb-3">{score}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm align-self-start mb-2"
                  onClick={() => setSubmitted(false)}
                >
                  Recalculate
                </button>
                <div className="mt-3 pt-3 border-top border-secondary-subtle">
                  <p className="small fw-semibold text-secondary mb-2">Detailed Results:</p>
                  <div className="d-flex flex-wrap gap-3 small">
                    <span className="d-flex align-items-center gap-1">
                      <CheckCircle size={14} className="text-success" /> Correct Answers: <strong>{correct}</strong>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <XCircle size={14} className="text-danger" /> Incorrect Answers: <strong>{incorrect}</strong>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Minus size={14} className="text-secondary" /> Negative Marks: <strong>-{(incorrect * negativeMarking).toFixed(1)}</strong>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* How are marks calculated? Expand */}
        <div className="mt-4 pt-3 border-top border-secondary-subtle">
          <button
            type="button"
            className="btn btn-link p-0 text-primary text-decoration-none d-flex align-items-center gap-2 small fw-semibold"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <Info size={16} className="flex-shrink-0" />
            How are marks calculated?
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {expanded && (
            <div className="mt-3 small text-secondary ssc-cgl-calc-expanded">
              <p className="fw-semibold text-dark mb-2">Formula</p>
              <p className="mb-2">Marks = (Correct × {marksPerCorrect}) − (Incorrect × {negativeMarking})</p>
              <p className="fw-semibold text-dark mb-2">Negative marking</p>
              <ul className="mb-2">
                <li>Correct: +{marksPerCorrect} per question</li>
                <li>Wrong: −{negativeMarking} per question</li>
                <li>Unattempted: 0 (no negative)</li>
              </ul>
              <p className="fw-semibold text-dark mb-2">Example</p>
              <p className="mb-2">72 correct, 18 wrong → (72 × 2) − (18 × 0.5) = 144 − 9 = <strong>135</strong></p>
              <p className="fw-semibold text-dark mb-2">FAQ</p>
              <p className="mb-1"><strong>How many questions in Tier 1?</strong> 100 questions, 200 marks.</p>
              <p className="mb-1"><strong>Negative marking?</strong> 0.50 per wrong answer.</p>
              <p className="mb-0"><strong>Normalization?</strong> SSC may apply normalization; raw score is calculated as above.</p>
            </div>
          )}
        </div>
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
      `}} />
    </div>
  )
}
