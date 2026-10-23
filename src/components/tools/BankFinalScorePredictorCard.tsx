"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Building2, 
  TrendingUp, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Percent
} from "lucide-react"

const BANK_EXAMS = [
  { value: "ibps-po", label: "IBPS PO (Mains 225 M + Interview 100 M)", mainsMax: 225, interviewMax: 100, urCutoff: 47.5 },
  { value: "sbi-po", label: "SBI PO (Mains 250 M + Interview 50 M)", mainsMax: 250, interviewMax: 50, urCutoff: 53.0 },
  { value: "ibps-so", label: "IBPS SO (Mains 60 M + Interview 100 M)", mainsMax: 60, interviewMax: 100, urCutoff: 61.2 },
  { value: "ibps-rrb-po", label: "IBPS RRB Officer Scale 1 (Mains 200 M + Interview 100 M)", mainsMax: 200, interviewMax: 100, urCutoff: 52.8 },
]

const CATEGORIES = [
  { value: "ur", label: "General (UR)", cutoffDelta: 0 },
  { value: "obc", label: "OBC (NCL)", cutoffDelta: -3.5 },
  { value: "ews", label: "EWS", cutoffDelta: -3.8 },
  { value: "sc", label: "SC", cutoffDelta: -7.0 },
  { value: "st", label: "ST", cutoffDelta: -9.5 },
]

type Props = { basePath?: string }

export default function BankFinalScorePredictorCard({ basePath = "/tools/banking" }: Props) {
  const [examKey, setExamKey] = useState<string>("ibps-po")
  const currentExam = useMemo(() => BANK_EXAMS.find(e => e.value === examKey) || BANK_EXAMS[0], [examKey])

  const [categoryKey, setCategoryKey] = useState<string>("ur")
  const currentCategory = useMemo(() => CATEGORIES.find(c => c.value === categoryKey) || CATEGORIES[0], [categoryKey])

  const [mainsScore, setMainsScore] = useState<number>(95)
  const [interviewScore, setInterviewScore] = useState<number>(75)
  const [copied, setCopied] = useState<boolean>(false)

  // Exam change handler
  const handleExamChange = (val: string) => {
    setExamKey(val)
    if (val === "sbi-po") {
      setMainsScore(112)
      setInterviewScore(38)
    } else if (val === "ibps-so") {
      setMainsScore(36)
      setInterviewScore(75)
    } else if (val === "ibps-rrb-po") {
      setMainsScore(105)
      setInterviewScore(72)
    } else {
      setMainsScore(95)
      setInterviewScore(75)
    }
  }

  // 80:20 formula:
  // Mains weighted: (mainsScore / mainsMax) * 80
  // Interview weighted: (interviewScore / interviewMax) * 20
  const clampedMains = Math.min(currentExam.mainsMax, Math.max(0, mainsScore))
  const clampedInterview = Math.min(currentExam.interviewMax, Math.max(0, interviewScore))

  const mainsWeighted = Math.round((clampedMains / currentExam.mainsMax) * 80 * 100) / 100
  const interviewWeighted = Math.round((clampedInterview / currentExam.interviewMax) * 20 * 100) / 100
  const finalScore = Math.round((mainsWeighted + interviewWeighted) * 100) / 100

  const expectedCutoff = Math.round((currentExam.urCutoff + currentCategory.cutoffDelta) * 10) / 10
  const margin = Math.round((finalScore - expectedCutoff) * 100) / 100
  const isQualified = margin >= 0

  const statusZone = useMemo(() => {
    if (margin >= 6) return { label: "High Final Selection Chance", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
    if (margin >= 0) return { label: "Borderline Safe for Final List", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" }
    if (margin >= -4) return { label: "Waiting List / Reserve Potential", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
    return { label: "Below Expected Cutoff", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }
  }, [margin])

  const handleReset = () => {
    handleExamChange("ibps-po")
    setCategoryKey("ur")
  }

  const handleCopy = () => {
    const text = `🏦 *My Bank Final Merit (80:20) Calculation:*
• Exam: ${currentExam.label}
• Category: ${currentCategory.label}
• Mains Weighted (80%): ${mainsWeighted} / 80
• Interview Weighted (20%): ${interviewWeighted} / 20
• Total Merit Score: ${finalScore} / 100 Marks
• Expected Cutoff: ${expectedCutoff} Marks (Margin: ${margin >= 0 ? `+${margin}` : margin} M)
• Status: ${statusZone.label}
Calculate yours at: https://www.pkminfotech.com/tools/banking/bank-final-score-predictor`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mainsPresets = useMemo(() => {
    const base = Math.round(currentExam.mainsMax * 0.4)
    return [base, base + 15, base + 30, base + 45].filter(v => v <= currentExam.mainsMax)
  }, [currentExam])

  const interviewPresets = useMemo(() => {
    const base = Math.round(currentExam.interviewMax * 0.6)
    return [base - 10, base, base + 10, base + 20].filter(v => v <= currentExam.interviewMax)
  }, [currentExam])

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0"
            style={{ width: 28, height: 28 }}
          >
            <TrendingUp size={14} className="text-primary" />
          </div>
          <span className="fw-semibold text-secondary small" style={{ fontSize: "0.78rem" }}>
            Merit Formula: <strong>80% Mains Weightage + 20% Interview Weightage</strong>
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
        {/* Exam & Category Selectors */}
        <div className="row g-2 mb-3.5 pb-3 border-bottom">
          <div className="col-12 col-md-7">
            <label className="form-label small fw-bold text-dark mb-1">Target Banking Exam</label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
              value={examKey}
              onChange={(e) => handleExamChange(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              {BANK_EXAMS.map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label small fw-bold text-dark mb-1">Reservation Category</label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} (Cutoff ~{Math.round((currentExam.urCutoff + c.cutoffDelta) * 10) / 10} M)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Mains + Interview Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Mains Score Input */}
              <div className="mb-3.5">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Mains Written Score (out of {currentExam.mainsMax} M)
                  </label>
                  <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    Weights to {mainsWeighted} / 80 M
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    min={0}
                    max={currentExam.mainsMax}
                    inputMode="numeric"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedMains}
                    onChange={(e) => setMainsScore(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    / {currentExam.mainsMax}
                  </span>
                </div>

                {/* Quick Preset Buttons */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Presets:</span>
                  {mainsPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedMains === val ? "btn-primary text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setMainsScore(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Score Input */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Interview Marks (out of {currentExam.interviewMax} M)
                  </label>
                  <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    Weights to {interviewWeighted} / 20 M
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    min={0}
                    max={currentExam.interviewMax}
                    inputMode="numeric"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedInterview}
                    onChange={(e) => setInterviewScore(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    / {currentExam.interviewMax}
                  </span>
                </div>

                {/* Quick Preset Buttons */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Presets:</span>
                  {interviewPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedInterview === val ? "btn-success text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setInterviewScore(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between">
              <span>Standard Merit Scale: <strong>100.00 Marks</strong></span>
              <span>Official Ratio: <strong>80% Mains : 20% Interview</strong></span>
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
                    COMBINED 80:20 MERIT SCORE
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: statusZone.bg, color: statusZone.color, fontSize: "0.75rem" }}
                  >
                    ● {statusZone.label}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>{finalScore.toFixed(2)}</span>
                  <span className="fs-6 fs-sm-5 opacity-75">/ 100 Marks</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">
                    Expected Cutoff: <strong>{expectedCutoff} M</strong> ({margin >= 0 ? `+${margin.toFixed(2)} Buffer` : `${margin.toFixed(2)} Gap`})
                  </span>
                </div>
              </div>

              {/* Real-time detailed table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Mains (80%):</span>
                    <strong>{mainsWeighted.toFixed(2)} / 80 M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Interview (20%):</span>
                    <strong>{interviewWeighted.toFixed(2)} / 20 M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Category:</span>
                    <strong>{currentCategory.label}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Cutoff Status:</span>
                    <strong className={isQualified ? "text-success" : "text-warning"}>
                      {isQualified ? "QUALIFIED" : "AT RISK"}
                    </strong>
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
              <div className="small text-secondary mb-1 fw-semibold">Mains Weight</div>
              <div className="fs-4 fw-bold text-dark">{mainsWeighted.toFixed(2)}</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Out of 80 Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Interview Weight</div>
              <div className="fs-4 fw-bold text-success">{interviewWeighted.toFixed(2)}</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Out of 20 Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Total Aggregate</div>
              <div className="fs-4 fw-bold text-primary">{finalScore.toFixed(2)}</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Out of 100 Scale
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Cutoff Buffer</div>
              <div className={`fs-4 fw-bold ${isQualified ? "text-success" : "text-danger"}`}>
                {margin >= 0 ? `+${margin.toFixed(2)}` : margin.toFixed(2)}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Vs {expectedCutoff} M Cutoff
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
                  `My ${currentExam.label} 80:20 Final Score is ${finalScore.toFixed(2)}/100 (Expected Cutoff: ${expectedCutoff} M). Calculate yours: https://www.pkminfotech.com/tools/banking/bank-final-score-predictor`
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
                onClick={handleCopy}
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
                    <span className="text-nowrap">Copy Merit</span>
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
