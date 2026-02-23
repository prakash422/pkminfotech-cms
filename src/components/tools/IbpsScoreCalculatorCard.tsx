"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, Minus, ChevronDown, Info, ListChecks } from "lucide-react"

const EXAMS = [
  { value: "ibps-po", label: "IBPS PO" },
  { value: "ibps-clerk", label: "IBPS Clerk" },
  { value: "ibps-rrb-po", label: "IBPS RRB PO" },
  { value: "ibps-rrb-clerk", label: "IBPS RRB Clerk" },
  { value: "ibps-so", label: "IBPS SO" },
]

function computeScore(
  correct: number,
  incorrect: number,
  marksPerQ: number,
  negativePerQ: number
): { final: number; correctMarks: number; negativeMarks: number } {
  const correctMarks = correct * marksPerQ
  const negativeMarks = incorrect * negativePerQ
  const final = Math.max(0, correctMarks - negativeMarks)
  return { final, correctMarks, negativeMarks }
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/banking"

export default function IbpsScoreCalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [exam, setExam] = useState("ibps-po")
  const [totalQuestions, setTotalQuestions] = useState("100")
  const [correctAnswers, setCorrectAnswers] = useState("70")
  const [incorrectAnswers, setIncorrectAnswers] = useState("20")
  const [marksPerQuestion, setMarksPerQuestion] = useState("1")
  const [negativeMarking, setNegativeMarking] = useState("0.25")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const total = useMemo(() => Math.max(0, parseInt(totalQuestions, 10) || 0), [totalQuestions])
  const correct = useMemo(() => Math.max(0, parseInt(correctAnswers, 10) || 0), [correctAnswers])
  const incorrect = useMemo(() => Math.max(0, parseInt(incorrectAnswers, 10) || 0), [incorrectAnswers])
  const marksPerQ = useMemo(() => Math.max(0, parseFloat(marksPerQuestion) || 0), [marksPerQuestion])
  const negPerQ = useMemo(() => Math.max(0, parseFloat(negativeMarking) || 0), [negativeMarking])

  const { final, correctMarks, negativeMarks } = useMemo(
    () => computeScore(correct, incorrect, marksPerQ, negPerQ),
    [correct, incorrect, marksPerQ, negPerQ]
  )

  const handleCalculate = () => setSubmitted(true)

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-2 p-md-4">
          <div className="row g-2 g-md-3">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-2">Enter Your Details</h3>
              <div className="row g-2">
                <div className="col-12">
                  <label className="form-label small mb-0">
                    Select Your Exam <span className="text-danger">*</span>
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
                <div className="col-6 col-md-4">
                  <label className="form-label small mb-0">Total Q</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control form-control-sm"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                    placeholder="100"
                  />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small mb-0">Correct</label>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-control"
                      value={correctAnswers}
                      onChange={(e) => setCorrectAnswers(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                      placeholder="70"
                    />
                    <span className="input-group-text bg-white px-1">
                      <CheckCircle size={14} className="text-success" />
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small mb-0">Incorrect</label>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-control"
                      value={incorrectAnswers}
                      onChange={(e) => setIncorrectAnswers(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                      placeholder="20"
                    />
                    <span className="input-group-text bg-white px-1">
                      <XCircle size={14} className="text-danger" />
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small mb-0">Marks/Q</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control form-control-sm"
                    value={marksPerQuestion}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setMarksPerQuestion(v.slice(0, 6))
                    }}
                    placeholder="1"
                  />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small mb-0">Negative</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control form-control-sm"
                    value={negativeMarking}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setNegativeMarking(v.slice(0, 6))
                    }}
                    placeholder="0.25"
                  />
                </div>
              </div>
              <small className="text-secondary d-block mt-1">e.g. 0.25 for ¼ deduction</small>
              <button
                type="button"
                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
                onClick={handleCalculate}
              >
                Calculate Score <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-3 small">
                    <p className="mb-0">
                      Enter details and click <strong>Calculate Score</strong> for total and breakdown.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-2 overflow-hidden align-self-start w-100">
                    <div className="px-2 py-1 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <CheckCircle size={18} className="text-success flex-shrink-0" />
                      <span className="fw-semibold text-dark small">Your Calculated Score</span>
                    </div>
                    <div className="card-body p-2">
                      <p className="text-secondary small mb-0">Final Marks Obtained</p>
                      <p className="fs-4 fw-bold text-dark mb-2 rounded-2 bg-success bg-opacity-10 d-inline-block px-2 py-1">
                        {final.toFixed(2)}
                      </p>
                      <p className="small fw-semibold text-dark mb-1 d-flex align-items-center gap-1">
                        <ListChecks size={14} className="text-primary" />
                        Detailed Results
                      </p>
                      <ul className="list-unstyled small mb-0">
                        <li className="d-flex align-items-center gap-2 py-0 border-bottom border-secondary-subtle">
                          <CheckCircle size={14} className="text-success flex-shrink-0" />
                          Correct: {correct} (+{correctMarks.toFixed(2)})
                        </li>
                        <li className="d-flex align-items-center gap-2 py-0 border-bottom border-secondary-subtle">
                          <XCircle size={14} className="text-danger flex-shrink-0" />
                          Incorrect: {incorrect} (-{negativeMarks.toFixed(2)})
                        </li>
                        <li className="d-flex align-items-center gap-2 py-0">
                          <Minus size={14} className="text-secondary flex-shrink-0" />
                          Negative: -{negativeMarks.toFixed(1)}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 shadow-sm mt-2 criteria-expand-card border-start border-primary border-3">
        <div className="card-body p-0 bg-primary bg-opacity-10">
          <button
            type="button"
            className="btn btn-link w-100 text-start d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark criteria-expand-btn small"
            onClick={() => setCriteriaExpanded((e) => !e)}
            aria-expanded={criteriaExpanded}
          >
            <span className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 flex-shrink-0" style={{ width: 28, height: 28 }}>
              <Info size={16} className="text-primary" />
            </span>
            <span className="flex-grow-1 fw-semibold">How is the IBPS score calculated?</span>
            {criteriaExpanded ? <ChevronDown size={18} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-3 pb-3 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-2 p-2 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-0">IBPS uses a <strong>negative marking</strong> scheme: for each correct answer you get the marks per question (e.g. +1), and for each wrong answer a fraction is deducted (e.g. -0.25). Unattempted questions usually have no effect. So: <strong>Final Score = (Correct × Marks per question) − (Incorrect × Negative marking per question)</strong>. This calculator uses the same formula. Section-wise cut-offs may apply; refer to the official IBPS notification for the exact pattern of your exam.</p>
                <p className="mb-0 mt-1 small">Always refer to the official IBPS answer key and result for your exam cycle.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
