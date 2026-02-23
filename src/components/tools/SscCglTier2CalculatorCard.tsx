"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { HelpCircle, CheckCircle, XCircle, Info, ChevronDown, ChevronRight, Minus } from "lucide-react"

// Tier 2: Paper 1 sections often 3 marks per correct; some sections −1, others −0.50 per wrong
const DEFAULT_TOTAL = 100
const DEFAULT_CORRECT = 0
const DEFAULT_INCORRECT = 0
const MARKS_PER_CORRECT_T2 = 3
const NEGATIVE_MARKING_T2 = 1 // −1 in certain sections; user can change to 0.5 for other sections

function getScoreMessage(score: number, total: number, marksPerCorrect: number): string {
  if (total <= 0) return "Enter your responses"
  const maxMarks = total * marksPerCorrect
  const pct = maxMarks > 0 ? (score / maxMarks) * 100 : 0
  if (pct >= 80) return "Well done!"
  if (pct >= 60) return "Good attempt"
  if (pct >= 40) return "Keep practicing"
  return "Review and try again"
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/ssc-cgl"

export default function SscCglTier2CalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [total, setTotal] = useState(DEFAULT_TOTAL)
  const [correct, setCorrect] = useState(DEFAULT_CORRECT)
  const [incorrect, setIncorrect] = useState(DEFAULT_INCORRECT)
  const [marksPerCorrect, setMarksPerCorrect] = useState(MARKS_PER_CORRECT_T2)
  const [negativeMarking, setNegativeMarking] = useState(NEGATIVE_MARKING_T2)
  const [expanded, setExpanded] = useState(false)

  const score = useMemo(() => {
    const gain = correct * marksPerCorrect
    const deduct = incorrect * negativeMarking
    const raw = gain - deduct
    return Math.max(0, Math.round(raw * 10) / 10)
  }, [correct, incorrect, marksPerCorrect, negativeMarking])

  const message = useMemo(
    () => getScoreMessage(score, total, marksPerCorrect),
    [score, total, marksPerCorrect]
  )

  const step = (val: number, delta: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.round((val + delta) * 100) / 100))

  return (
    <div className="card border-0 shadow-sm ssc-cgl-calc-card">
      <div className="card-body p-3 p-md-4">
        {/* Select Tier tabs */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <span className="small fw-semibold text-secondary">Select Tier</span>
          <div className="d-flex rounded overflow-hidden border border-secondary-subtle">
            <Link
              href={`${basePath}/tier-1-marks-calculator`}
              className="px-3 py-2 small fw-semibold bg-light text-secondary text-decoration-none"
            >
              Tier 1
            </Link>
            <span className="px-3 py-2 small fw-semibold bg-primary text-white">Tier 2</span>
            <Link
              href={`${basePath}/final-score-calculator`}
              className="px-3 py-2 small fw-semibold bg-light text-secondary text-decoration-none"
            >
              Final Score
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {/* Left: Enter Your Responses */}
          <div className="col-md-6">
            <h3 className="h6 fw-semibold mb-3">Enter Your Responses</h3>
            <div className="mb-3">
              <label className="form-label small mb-1">Total Questions</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={1}
                  max={300}
                  value={total}
                  onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value, 10) || 0))}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary" style={{ width: 24, height: 24 }}>
                  <HelpCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small mb-1">Correct Answers</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={0}
                  max={total}
                  value={correct}
                  onChange={(e) => setCorrect(Math.max(0, Math.min(total, parseInt(e.target.value, 10) || 0)))}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle text-success ssc-cgl-icon-green" style={{ width: 24, height: 24 }}>
                  <CheckCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small mb-1">Incorrect Answers</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={0}
                  max={total}
                  value={incorrect}
                  onChange={(e) => setIncorrect(Math.max(0, Math.min(total, parseInt(e.target.value, 10) || 0)))}
                />
                <span className="d-flex align-items-center justify-content-center rounded-circle text-danger ssc-cgl-icon-red" style={{ width: 24, height: 24 }}>
                  <XCircle size={14} />
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small mb-1">Marks Per Correct Answer</label>
              <div className="d-flex align-items-center gap-1">
                <input
                  type="number"
                  className="form-control form-control-sm text-center"
                  step={0.25}
                  min={0.25}
                  max={10}
                  value={marksPerCorrect}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isNaN(v)) setMarksPerCorrect(step(v, 0, 0.25, 10))
                  }}
                />
                <div className="d-flex flex-column border rounded">
                  <button
                    type="button"
                    className="btn btn-sm p-0 border-0 bg-light"
                    style={{ lineHeight: 1 }}
                    onClick={() => setMarksPerCorrect((v) => step(v, 0.25, 0.25, 10))}
                    aria-label="Increase"
                  >
                    <ChevronRight size={14} style={{ transform: "rotate(-90deg)" }} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm p-0 border-0 bg-light"
                    style={{ lineHeight: 1 }}
                    onClick={() => setMarksPerCorrect((v) => step(v, -0.25, 0.25, 10))}
                    aria-label="Decrease"
                  >
                    <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label small mb-1">Negative Marking (per wrong)</label>
              <div className="d-flex align-items-center gap-1">
                <input
                  type="number"
                  className="form-control form-control-sm text-center"
                  step={0.25}
                  min={0}
                  max={2}
                  value={negativeMarking}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isNaN(v)) setNegativeMarking(step(v, 0, 0, 2))
                  }}
                />
                <div className="d-flex flex-column border rounded">
                  <button
                    type="button"
                    className="btn btn-sm p-0 border-0 bg-light"
                    style={{ lineHeight: 1 }}
                    onClick={() => setNegativeMarking((v) => step(v, -0.25, 0, 2))}
                    aria-label="Decrease"
                  >
                    <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm p-0 border-0 bg-light"
                    style={{ lineHeight: 1 }}
                    onClick={() => setNegativeMarking((v) => step(v, 0.25, 0, 2))}
                    aria-label="Increase"
                  >
                    <ChevronRight size={14} style={{ transform: "rotate(-90deg)" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Your Calculated Score */}
          <div className="col-md-6 d-flex flex-column justify-content-between">
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
              className="btn btn-primary align-self-start ssc-cgl-calc-btn"
              onClick={() => {}}
            >
              Calculate Score <ChevronRight size={12} className="ms-1" />
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
              <p className="fw-semibold text-dark mb-2">Tier 2 negative marking (Paper 1)</p>
              <ul className="mb-2">
                <li><strong>Section I, II &amp; Module I of Section III:</strong> −1 mark per wrong answer</li>
                <li><strong>Other sections:</strong> −0.50 marks per wrong answer</li>
                <li>Paper 2 (Statistics) &amp; Paper 3: −0.50 per wrong. Unattempted: no negative.</li>
              </ul>
              <p className="fw-semibold text-dark mb-2">Example</p>
              <p className="mb-2">40 correct, 5 wrong (3 marks per correct, −1 per wrong) → (40 × 3) − (5 × 1) = 120 − 5 = <strong>115</strong></p>
              <p className="fw-semibold text-dark mb-2">FAQ</p>
              <p className="mb-1"><strong>Who appears for Tier 2?</strong> Candidates who clear Tier 1 cutoff.</p>
              <p className="mb-1"><strong>Paper 1 total?</strong> 850 marks (150 min). Use this calculator per section and add scores.</p>
              <p className="mb-0"><strong>Exact marks per question?</strong> Check the latest SSC CGL notification on ssc.gov.in.</p>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ssc-cgl-calc-card { border-radius: 12px; }
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
