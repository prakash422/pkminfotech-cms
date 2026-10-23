"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Layers,
  Train
} from "lucide-react"

const DIFFICULTY_MAP: Record<string, { label: string; factor: number; note: string }> = {
  easy: { label: "Easy Shift", factor: 0.96, note: "High shift average, slight normalization adjustment" },
  moderate: { label: "Moderate Shift", factor: 1.02, note: "Standard baseline shift difficulty" },
  hard: { label: "Difficult Shift", factor: 1.12, note: "Hard shift gets significant positive normalization boost" },
}

type Props = { basePath?: string }

export default function RrbNtpcNormalizationCalculatorCard({ basePath = "/tools/railway" }: Props) {
  const [examStage, setExamStage] = useState<"cbt-1" | "cbt-2">("cbt-1")
  const maxMarks = examStage === "cbt-1" ? 100 : 120

  const [rawScore, setRawScore] = useState<number>(72)
  const [shiftDiff, setShiftDiff] = useState<string>("hard")
  const [copied, setCopied] = useState<boolean>(false)

  const clampedRaw = Math.min(maxMarks, Math.max(0, rawScore))
  const currentDiff = DIFFICULTY_MAP[shiftDiff] || DIFFICULTY_MAP.moderate

  // Compute normalized score
  const normalizedScore = useMemo(() => {
    const calculated = clampedRaw * currentDiff.factor
    return Math.min(maxMarks, Math.max(0, Math.round(calculated * 100) / 100))
  }, [clampedRaw, currentDiff, maxMarks])

  const delta = Math.round((normalizedScore - clampedRaw) * 100) / 100
  const scorePct = Math.round((normalizedScore / maxMarks) * 100)

  const statusZone = useMemo(() => {
    if (scorePct >= 75) return { label: "High Safe CBT Shortlist Zone", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
    if (scorePct >= 60) return { label: "Competitive Selection Zone", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" }
    if (scorePct >= 48) return { label: "Borderline Range (Shift Dependent)", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
    return { label: "Needs Improvement", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }
  }, [scorePct])

  const estimatedPercentile = useMemo(() => {
    if (scorePct >= 85) return 98
    if (scorePct >= 75) return 92
    if (scorePct >= 65) return 84
    if (scorePct >= 55) return 72
    return 55
  }, [scorePct])

  const handleReset = () => {
    setRawScore(72)
    setShiftDiff("hard")
  }

  const handleCopy = () => {
    const text = `🚆 *My RRB NTPC Normalized Marks Calculation:*
• Stage: ${examStage.toUpperCase()} (${maxMarks} Max Marks)
• Raw Score: ${clampedRaw} / ${maxMarks}
• Shift Difficulty: ${currentDiff.label} (${delta >= 0 ? `+${delta}` : delta} M benefit)
• Normalized Score: ${normalizedScore} / ${maxMarks} Marks
• Status: ${statusZone.label}
• Est. Percentile: Top ${100 - estimatedPercentile}%
Check yours at: https://www.pkminfotech.com/tools/railway/rrb-ntpc-normalization-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = examStage === "cbt-1" ? [55, 65, 72, 80, 88] : [65, 78, 88, 96, 108]

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div 
          className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <button
            type="button"
            className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              examStage === "cbt-1" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => { setExamStage("cbt-1"); setRawScore(72); }}
          >
            <Train size={15} />
            <span>CBT 1 (100 M)</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              examStage === "cbt-2" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => { setExamStage("cbt-2"); setRawScore(88); }}
          >
            <Layers size={15} />
            <span>CBT 2 (120 M)</span>
          </button>
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
        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Raw Score Input */}
              <div className="mb-3.5">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Your Raw Exam Score (out of {maxMarks})
                  </label>
                  <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    {Math.round((clampedRaw / maxMarks) * 100)}% Raw
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    min={0}
                    max={maxMarks}
                    inputMode="numeric"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedRaw}
                    onChange={(e) => setRawScore(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    RAW / {maxMarks}
                  </span>
                </div>

                {/* Quick Presets */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedRaw === val ? "btn-primary text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setRawScore(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift Difficulty Selector */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1.5 d-flex align-items-center justify-content-between">
                  <span>Shift Difficulty Level:</span>
                  <span className="small text-muted">{currentDiff.factor}x Factor</span>
                </label>
                <div className="row g-2">
                  {Object.entries(DIFFICULTY_MAP).map(([key, data]) => (
                    <div key={key} className="col-4">
                      <button
                        type="button"
                        className={`btn btn-sm w-100 py-2 rounded-3 text-center fw-semibold transition ${
                          shiftDiff === key
                            ? "btn-dark shadow-sm"
                            : "btn-light border text-secondary"
                        }`}
                        style={{ fontSize: "0.8125rem" }}
                        onClick={() => setShiftDiff(key)}
                      >
                        {data.label}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="small text-secondary bg-light rounded-3 p-2.5 border mt-2">
                  ℹ️ {currentDiff.note}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between">
              <span>Formula: <strong>RRB Shift Multi-Variance Standard</strong></span>
              <span>Stage: <strong>{examStage.toUpperCase()}</strong></span>
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
                    ESTIMATED NORMALIZED MARKS
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: statusZone.bg, color: statusZone.color, fontSize: "0.75rem" }}
                  >
                    ● {statusZone.label}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>{normalizedScore.toFixed(2)}</span>
                  <span className="fs-6 fs-sm-5 opacity-75">/ {maxMarks} Marks</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">
                    Shift Benefit: <strong>{delta >= 0 ? `+${delta.toFixed(2)} M` : `${delta.toFixed(2)} M`}</strong> ({currentDiff.label})
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
                    <span className="opacity-75">Raw Score:</span>
                    <strong>{clampedRaw} / {maxMarks} M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Multiplier:</span>
                    <strong className="text-warning">{currentDiff.factor}x</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Est. Percentile:</span>
                    <strong className="text-info">~{estimatedPercentile}th</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Normalization:</span>
                    <strong className="text-success">{delta >= 0 ? `+${delta}` : delta} Marks</strong>
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
              <div className="small text-secondary mb-1 fw-semibold">Raw Score</div>
              <div className="fs-4 fw-bold text-dark">{clampedRaw}</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Before Normalization
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Shift Benefit</div>
              <div className={`fs-4 fw-bold ${delta >= 0 ? "text-success" : "text-danger"}`}>
                {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {currentDiff.label}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Normalized Score</div>
              <div className="fs-4 fw-bold text-primary">{normalizedScore.toFixed(2)}</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Out of {maxMarks} Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Estimated Rank Band</div>
              <div className="fs-4 fw-bold text-dark">Top {100 - estimatedPercentile}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Based on score curve
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
                  `My RRB NTPC Normalized Score is ${normalizedScore.toFixed(2)}/${maxMarks} (Raw: ${clampedRaw}). Check yours: https://www.pkminfotech.com/tools/railway/rrb-ntpc-normalization-calculator`
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
                    <span className="text-nowrap">Copy Result</span>
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
