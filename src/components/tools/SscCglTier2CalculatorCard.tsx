"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { 
  Calculator, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  Percent,
  TrendingUp,
  AlertCircle
} from "lucide-react"

const DEFAULT_TOTAL = 130
const DEFAULT_CORRECT = 95
const DEFAULT_INCORRECT = 18
const MARKS_PER_CORRECT_T2 = 3
const NEGATIVE_MARKING_T2 = 1

function getScorePerformance(score: number): { text: string; badgeVariant: string } {
  if (score >= 320) return { text: "Top 3% — Outstanding (4600 GP Inspector Safe)", badgeVariant: "success" }
  if (score >= 290) return { text: "High Competitive Zone (Likely 4600/2800 GP)", badgeVariant: "success" }
  if (score >= 265) return { text: "Safe Zone for 2400 GP Posts", badgeVariant: "primary" }
  if (score >= 240) return { text: "Borderline Score (Depends on Category)", badgeVariant: "warning" }
  return { text: "Below Expected Cutoff — Keep Practicing", badgeVariant: "danger" }
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/tools/ssc"

export default function SscCglTier2CalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [totalStr, setTotalStr] = useState(String(DEFAULT_TOTAL))
  const [correctStr, setCorrectStr] = useState(String(DEFAULT_CORRECT))
  const [incorrectStr, setIncorrectStr] = useState(String(DEFAULT_INCORRECT))
  const [marksPerCorrect, setMarksPerCorrect] = useState(MARKS_PER_CORRECT_T2)
  const [negativeMarking, setNegativeMarking] = useState(NEGATIVE_MARKING_T2)
  const [copied, setCopied] = useState(false)

  const total = useMemo(() => Math.max(1, parseInt(totalStr, 10) || DEFAULT_TOTAL), [totalStr])
  const correct = useMemo(() => Math.max(0, Math.min(total, parseInt(correctStr, 10) || 0)), [correctStr, total])
  const incorrect = useMemo(() => Math.max(0, Math.min(total - correct, parseInt(incorrectStr, 10) || 0)), [incorrectStr, total, correct])
  const unattempted = useMemo(() => Math.max(0, total - correct - incorrect), [total, correct, incorrect])

  const gain = useMemo(() => correct * marksPerCorrect, [correct, marksPerCorrect])
  const deduct = useMemo(() => incorrect * negativeMarking, [incorrect, negativeMarking])
  const score = useMemo(() => Math.max(0, Math.round((gain - deduct) * 10) / 10), [gain, deduct])

  const totalPossible = total * marksPerCorrect
  const attempted = correct + incorrect
  const attemptRate = total > 0 ? Math.round((attempted / total) * 100) : 0
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  const scorePct = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0

  const performance = useMemo(() => getScorePerformance(score), [score])

  const handleReset = () => {
    setTotalStr(String(DEFAULT_TOTAL))
    setCorrectStr(String(DEFAULT_CORRECT))
    setIncorrectStr(String(DEFAULT_INCORRECT))
  }

  const handleCopySummary = async () => {
    const text = `SSC CGL Tier 2 Score Summary:\n• Correct: ${correct} (+${gain} M)\n• Incorrect: ${incorrect} (-${deduct} M)\n• Unattempted: ${unattempted}\n• Net Score: ${score} / ${totalPossible} Marks (${scorePct}%)\n• Accuracy: ${accuracy}%\n• Standing: ${performance.text}\nCalculated at: https://www.pkminfotech.com/tools/ssc/ssc-cgl-tier-2-marks-calculator`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const correctPresets = [80, 95, 105, 115, 122]
  const incorrectPresets = [5, 10, 15, 20, 25]

  return (
    <div className="ssc-cgl-tier2-console-wrapper">
      {/* Main Calculation Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white tool-console-card" style={{ border: "1px solid #e2e8f0" }}>
        
        {/* Topbar */}
        <div className="p-2.5 p-md-3 bg-light border-bottom d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0"
              style={{ width: 28, height: 28 }}
            >
              <Trophy size={14} className="text-primary" />
            </div>
            <span className="fw-semibold text-secondary small" style={{ fontSize: "0.78rem" }}>
              Pattern: <strong>130 Qs · 390 Marks (+3 / -1.00)</strong>
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-0.5 small fw-semibold d-inline-flex align-items-center gap-1">
              <span className="spinner-grow spinner-grow-sm" style={{ width: 7, height: 7 }} />
              Live
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2.5 d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.75rem" }}
              title="Reset parameters to default"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-3.5 p-md-4">
          
          {/* Input Controls Row */}
          <div className="row g-3 mb-4">
            
            {/* Correct Answers Input */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-dark mb-1 d-flex align-items-center justify-content-between">
                <span>Correct Responses (+{marksPerCorrect} Marks) <span className="text-success">*</span></span>
                <span className="text-success fw-bold" style={{ fontSize: "0.75rem" }}>+{gain} M</span>
              </label>
              <div className="input-group input-group-lg mb-2">
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control fw-bold fs-4 border-secondary-subtle text-success"
                  value={correctStr}
                  onChange={(e) => setCorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                  placeholder="e.g. 95"
                />
                <span className="input-group-text bg-success bg-opacity-10 text-success fw-bold small px-3">
                  Correct
                </span>
              </div>
              <div 
                className="d-flex align-items-center gap-1 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                <span className="small text-muted me-1 flex-shrink-0" style={{ fontSize: "0.72rem" }}>Quick:</span>
                {correctPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`btn btn-sm rounded-pill py-0.5 px-2 flex-shrink-0 ${correct === val ? "btn-success text-white fw-bold" : "btn-light border text-secondary"}`}
                    style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                    onClick={() => setCorrectStr(String(val))}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Incorrect Answers Input */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-dark mb-1 d-flex align-items-center justify-content-between">
                <span>Incorrect Responses (-{negativeMarking} Mark) <span className="text-danger">*</span></span>
                <span className="text-danger fw-bold" style={{ fontSize: "0.75rem" }}>-{deduct} M</span>
              </label>
              <div className="input-group input-group-lg mb-2">
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control fw-bold fs-4 border-secondary-subtle text-danger"
                  value={incorrectStr}
                  onChange={(e) => setIncorrectStr(e.target.value.replace(/\D/g, "").slice(0, 3) || "")}
                  placeholder="e.g. 18"
                />
                <span className="input-group-text bg-danger bg-opacity-10 text-danger fw-bold small px-3">
                  Wrong
                </span>
              </div>
              <div 
                className="d-flex align-items-center gap-1 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                <span className="small text-muted me-1 flex-shrink-0" style={{ fontSize: "0.72rem" }}>Quick:</span>
                {incorrectPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`btn btn-sm rounded-pill py-0.5 px-2 flex-shrink-0 ${incorrect === val ? "btn-danger text-white fw-bold" : "btn-light border text-secondary"}`}
                    style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                    onClick={() => setIncorrectStr(String(val))}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 3. Converted Results Hero Box (Stunning Indigo/Blue Gradient) */}
          <div
            className="rounded-4 p-4 text-white shadow-sm mb-4"
            style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }}
          >
            <div className="row align-items-center">
              
              <div className="col-12 col-md-7 mb-3 mb-md-0">
                <span className="text-white-50 text-uppercase small tracking-wide fw-semibold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                  Calculated Tier 2 Raw Score
                </span>
                <h2 className="display-4 fw-bold mb-0 text-white" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", lineHeight: 1.1 }}>
                  {score}{" "}
                  <span className="fs-5 fw-normal text-white-50">/ {totalPossible} Marks</span>
                </h2>
                
                <div className="d-inline-flex align-items-center gap-1.5 mt-2.5 px-3 py-1 rounded-pill bg-white bg-opacity-20 text-white fw-semibold small">
                  <CheckCircle2 size={15} className="text-warning flex-shrink-0" />
                  <span>{performance.text}</span>
                </div>
                
                <p className="mb-0 mt-2 text-white-75 small" style={{ fontSize: "0.825rem" }}>
                  Positive Gain: <strong>+{gain} Marks</strong> | Negative Penalty: <strong>-{deduct} Marks</strong>
                </p>
              </div>

              <div className="col-12 col-md-5">
                <div 
                  className="rounded-3 p-3 text-white" 
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)" }}
                >
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-white border-opacity-25 small">
                    <span className="text-white-75">Correct Answers:</span>
                    <strong>{correct} Qs (+{gain} M)</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-white border-opacity-25 small">
                    <span className="text-white-75">Incorrect Penalty:</span>
                    <strong className="text-warning">{incorrect} Qs (-{deduct} M)</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-white border-opacity-25 small">
                    <span className="text-white-75">Unattempted:</span>
                    <strong>{unattempted} Qs (0 M)</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-1.5 small">
                    <span className="text-white-75">Net Accuracy:</span>
                    <strong className="text-white">{accuracy}%</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Grid of Performance Metric Cards (Same as Regional Units in GajToSqFt) */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <span className="text-muted small d-block mb-1" style={{ fontSize: "0.75rem" }}>Attempt Rate</span>
                <span className="fw-bold text-dark fs-5">{attemptRate}%</span>
                <span className="text-secondary small d-block" style={{ fontSize: "0.72rem" }}>{attempted}/{total} Questions</span>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <span className="text-muted small d-block mb-1" style={{ fontSize: "0.75rem" }}>Accuracy</span>
                <span className="fw-bold text-success fs-5">{accuracy}%</span>
                <span className="text-secondary small d-block" style={{ fontSize: "0.72rem" }}>Of Attempted</span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <span className="text-muted small d-block mb-1" style={{ fontSize: "0.75rem" }}>Score %</span>
                <span className="fw-bold text-primary fs-5">{scorePct}%</span>
                <span className="text-secondary small d-block" style={{ fontSize: "0.72rem" }}>Of 390 Total</span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <span className="text-muted small d-block mb-1" style={{ fontSize: "0.75rem" }}>Negative Loss</span>
                <span className="fw-bold text-danger fs-5">-{deduct} M</span>
                <span className="text-secondary small d-block" style={{ fontSize: "0.72rem" }}>Penalty deduction</span>
              </div>
            </div>
          </div>

          {/* 5. Action Buttons (Copy & Share) */}
          <div className="pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <div className="row g-2">
              <div className="col-6">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Mera SSC CGL Tier 2 Score: ${score}/390 ban raha hai (${correct} Correct, ${incorrect} Wrong). Accuracy: ${accuracy}%. Check your score here: https://www.pkminfotech.com/tools/ssc/ssc-cgl-tier-2-marks-calculator`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100 text-white d-flex align-items-center justify-content-center gap-1.5 text-decoration-none shadow-xs"
                  style={{
                    backgroundColor: "#25D366",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)"
                  }}
                  title="Share on WhatsApp"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span className="text-nowrap">WhatsApp</span>
                </a>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="btn w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#334155",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "0.82rem",
                    fontWeight: 600
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-success flex-shrink-0" />
                      <span className="text-success text-nowrap">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-secondary flex-shrink-0" />
                      <span className="text-nowrap">Copy Score</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
