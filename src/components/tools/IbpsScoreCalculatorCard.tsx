"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Percent,
  Target,
  MinusCircle,
  HelpCircle,
  Sparkles,
  Building2,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react"

const EXAMS = [
  { value: "ibps-po", label: "IBPS PO Prelims (100 Qs / 100 M)", total: 100, pos: 1, neg: 0.25 },
  { value: "ibps-clerk", label: "IBPS Clerk Prelims (100 Qs / 100 M)", total: 100, pos: 1, neg: 0.25 },
  { value: "ibps-rrb-po", label: "IBPS RRB Officer Scale 1 (80 Qs / 80 M)", total: 80, pos: 1, neg: 0.25 },
  { value: "ibps-rrb-clerk", label: "IBPS RRB Office Assistant (80 Qs / 80 M)", total: 80, pos: 1, neg: 0.25 },
  { value: "ibps-so", label: "IBPS SO Prelims (150 Qs / 125 M)", total: 150, pos: 1, neg: 0.25 },
]

type Props = { basePath?: string }

export default function IbpsScoreCalculatorCard({ basePath = "/tools/banking" }: Props) {
  const [examValue, setExamValue] = useState<string>("ibps-po")
  const currentExam = useMemo(() => EXAMS.find(e => e.value === examValue) || EXAMS[0], [examValue])

  const [totalQuestions, setTotalQuestions] = useState<number>(currentExam.total)
  const [correct, setCorrect] = useState<number>(72)
  const [incorrect, setIncorrect] = useState<number>(14)
  const [copied, setCopied] = useState<boolean>(false)

  // Switch total questions when exam changes
  const handleExamChange = (val: string) => {
    setExamValue(val)
    const ex = EXAMS.find(e => e.value === val)
    if (ex) {
      setTotalQuestions(ex.total)
      if (val.includes("rrb")) {
        setCorrect(58)
        setIncorrect(10)
      } else {
        setCorrect(72)
        setIncorrect(14)
      }
    }
  }

  const marksPerQ = currentExam.pos
  const negPerQ = currentExam.neg

  // Clamp values
  const clampedCorrect = Math.min(totalQuestions, Math.max(0, correct))
  const clampedIncorrect = Math.min(totalQuestions - clampedCorrect, Math.max(0, incorrect))
  const unattempted = Math.max(0, totalQuestions - (clampedCorrect + clampedIncorrect))

  // Calculation
  const positiveMarks = Math.round(clampedCorrect * marksPerQ * 100) / 100
  const negativePenalty = Math.round(clampedIncorrect * negPerQ * 100) / 100
  const finalScore = Math.max(0, Math.round((positiveMarks - negativePenalty) * 100) / 100)
  const maxMarks = totalQuestions * marksPerQ

  const attemptedCount = clampedCorrect + clampedIncorrect
  const accuracy = attemptedCount > 0 ? Math.round((clampedCorrect / attemptedCount) * 100) : 0
  const attemptRate = totalQuestions > 0 ? Math.round((attemptedCount / totalQuestions) * 100) : 0
  const scorePercent = maxMarks > 0 ? Math.round((finalScore / maxMarks) * 100) : 0

  const performanceZone = useMemo(() => {
    if (scorePercent >= 75) return { label: "High Safe Zone", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
    if (scorePercent >= 60) return { label: "Competitive Zone", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" }
    if (scorePercent >= 45) return { label: "Borderline Range", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
    return { label: "Needs Practice", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }
  }, [scorePercent])

  const handleReset = () => {
    setCorrect(Math.round(totalQuestions * 0.7))
    setIncorrect(Math.round(totalQuestions * 0.12))
  }

  const handleCopySummary = () => {
    const text = `📊 *My ${currentExam.label} Score:*
• Net Raw Score: ${finalScore} / ${maxMarks} Marks
• Correct Answers: ${clampedCorrect} (+${positiveMarks} M)
• Incorrect: ${clampedIncorrect} (-${negativePenalty} M)
• Accuracy: ${accuracy}%
• Performance: ${performanceZone.label}
Calculated via: https://www.pkminfotech.com/tools/banking/ibps-score-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const correctPresets = useMemo(() => {
    const base = Math.round(totalQuestions * 0.5)
    return [base, base + 10, base + 20, base + 28, totalQuestions - 5].filter(v => v <= totalQuestions)
  }, [totalQuestions])

  const incorrectPresets = [4, 8, 12, 16, 20]

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0"
            style={{ width: 28, height: 28 }}
          >
            <Building2 size={14} className="text-primary" />
          </div>
          <span className="fw-semibold text-secondary small" style={{ fontSize: "0.78rem" }}>
            Banking Standard: <strong>Prelims (100 M) &amp; Mains (200 M) Scoring</strong>
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
            <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
            Live Calculation
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
            title="Reset to defaults"
          >
            <RotateCcw size={13} />
            <span className="small">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-3 p-md-4">
        {/* Exam Selector Dropdown */}
        <div className="mb-3.5 pb-3 border-bottom">
          <label className="form-label small fw-bold text-dark mb-1.5 d-flex align-items-center gap-1.5">
            <SlidersHorizontal size={15} className="text-primary" />
            <span>Select Banking Exam Target Pattern:</span>
          </label>
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-7">
              <select
                className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
                value={examValue}
                onChange={(e) => handleExamChange(e.target.value)}
                style={{ fontSize: "0.9rem" }}
              >
                {EXAMS.map((ex) => (
                  <option key={ex.value} value={ex.value}>
                    {ex.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-5">
              <div className="small text-secondary bg-light rounded-3 px-3 py-2 border">
                <strong>Marking Rule:</strong> +{marksPerQ} per correct, -{negPerQ} per wrong
              </div>
            </div>
          </div>
        </div>

        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Correct Responses Input */}
              <div className="mb-3.5">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Correct Answers (+{marksPerQ} Mark)
                  </label>
                  <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    +{positiveMarks} Marks
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    min={0}
                    max={totalQuestions}
                    inputMode="numeric"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedCorrect}
                    onChange={(e) => setCorrect(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-success-subtle text-success border-0 px-3 fw-bold small">
                    CORRECT
                  </span>
                </div>

                {/* Quick Preset Buttons */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                  {correctPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedCorrect === val ? "btn-success text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setCorrect(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incorrect Responses Input */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Incorrect Answers (-{negPerQ} Mark)
                  </label>
                  <span className="badge rounded-pill bg-danger-subtle text-danger fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    -{negativePenalty} Marks
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    min={0}
                    max={totalQuestions - clampedCorrect}
                    inputMode="numeric"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedIncorrect}
                    onChange={(e) => setIncorrect(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-danger-subtle text-danger border-0 px-3 fw-bold small">
                    WRONG
                  </span>
                </div>

                {/* Quick Preset Buttons */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                  {incorrectPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedIncorrect === val ? "btn-danger text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setIncorrect(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between">
              <span>Total Questions: <strong>{totalQuestions}</strong></span>
              <span>Attempted: <strong>{attemptedCount} / {totalQuestions}</strong></span>
              <span>Unattempted: <strong>{unattempted}</strong></span>
            </div>
          </div>

          {/* Right Column: Hero Gradient Result Box */}
          <div className="col-12 col-lg-6">
            <div
              className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                minHeight: 290
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                    CALCULATED RAW SCORE
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: performanceZone.bg, color: performanceZone.color, fontSize: "0.75rem" }}
                  >
                    ● {performanceZone.label}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>{finalScore}</span>
                  <span className="fs-6 fs-sm-5 opacity-75">/ {maxMarks} Marks</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">Positive: +{positiveMarks} M | Penalty: -{negativePenalty} M</span>
                </div>
              </div>

              {/* Real-time breakdown table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Correct Answers:</span>
                    <strong>{clampedCorrect} Qs (+{positiveMarks})</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Incorrect Penalty:</span>
                    <strong className="text-warning">-{negativePenalty} M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Unattempted:</span>
                    <strong>{unattempted} Qs (0 M)</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Net Accuracy:</span>
                    <strong className="text-info">{accuracy}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="row g-2 g-md-3 mt-3">
          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Attempt Rate</div>
              <div className="fs-4 fw-bold text-dark">{attemptRate}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {attemptedCount}/{totalQuestions} Questions
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Accuracy</div>
              <div className="fs-4 fw-bold text-success">{accuracy}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Of Attempted
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Score %</div>
              <div className="fs-4 fw-bold text-primary">{scorePercent}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Of {maxMarks} Total Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Negative Loss</div>
              <div className="fs-4 fw-bold text-danger">-{negativePenalty} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Penalty Deduction
              </div>
            </div>
          </div>
        </div>

        {/* Premium Action Toolbar */}
        <div className="pt-3 mt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
          <div className="row g-2">
            <div className="col-6">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `My ${currentExam.label} Score is ${finalScore}/${maxMarks} (${accuracy}% Accuracy). Check yours: https://www.pkminfotech.com/tools/banking/ibps-score-calculator`
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
  )
}
