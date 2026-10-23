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
  Sparkles,
  Trophy,
  Layers,
  Calculator,
  Percent
} from "lucide-react"

type Props = { basePath?: string }

export default function SscCglFinalScoreCalculatorCard({ basePath = "/tools/ssc" }: Props) {
  // Tier 1: 100 Qs, +2 / -0.5
  const [t1Correct, setT1Correct] = useState<number>(76)
  const [t1Incorrect, setT1Incorrect] = useState<number>(12)

  // Tier 2: 130 Qs, +3 / -1
  const [t2Correct, setT2Correct] = useState<number>(98)
  const [t2Incorrect, setT2Incorrect] = useState<number>(16)

  const [copied, setCopied] = useState<boolean>(false)

  // Tier 1 calculation
  const t1ClampedC = Math.min(100, Math.max(0, t1Correct))
  const t1ClampedI = Math.min(100 - t1ClampedC, Math.max(0, t1Incorrect))
  const t1Positive = t1ClampedC * 2
  const t1Negative = Math.round(t1ClampedI * 0.5 * 100) / 100
  const tier1Score = Math.max(0, Math.round((t1Positive - t1Negative) * 100) / 100)

  // Tier 2 calculation
  const t2ClampedC = Math.min(130, Math.max(0, t2Correct))
  const t2ClampedI = Math.min(130 - t2ClampedC, Math.max(0, t2Incorrect))
  const t2Positive = t2ClampedC * 3
  const t2Negative = t2ClampedI * 1
  const tier2Score = Math.max(0, Math.round((t2Positive - t2Negative) * 100) / 100)

  // Final Combined Aggregate
  const finalScore = Math.round((tier1Score + tier2Score) * 100) / 100
  const maxAggregate = 590
  const totalPositive = t1Positive + t2Positive
  const totalNegative = Math.round((t1Negative + t2Negative) * 100) / 100
  const combinedPct = Math.round((finalScore / maxAggregate) * 100)

  const meritStatus = useMemo(() => {
    if (tier2Score >= 315) return { label: "Top Inspector Grade (4600 GP Safe)", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
    if (tier2Score >= 285) return { label: "Auditor / TA Grade Safe", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" }
    if (tier2Score >= 250) return { label: "Competitive Merit Band", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
    return { label: "Borderline Score", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }
  }, [tier2Score])

  const handleReset = () => {
    setT1Correct(76)
    setT1Incorrect(12)
    setT2Correct(98)
    setT2Incorrect(16)
  }

  const handleCopySummary = () => {
    const text = `🎯 *My SSC CGL Combined Merit Score:*
• Tier 1 Score: ${tier1Score} / 200 Marks
• Tier 2 Score: ${tier2Score} / 390 Marks
• Combined Aggregate: ${finalScore} / 590 Marks (${combinedPct}%)
• Post Assessment: ${meritStatus.label}
Calculate yours at: https://www.pkminfotech.com/tools/ssc/ssc-cgl-final-score-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0"
            style={{ width: 28, height: 28 }}
          >
            <Layers size={14} className="text-primary" />
          </div>
          <span className="fw-semibold text-secondary small" style={{ fontSize: "0.78rem" }}>
            Aggregate Merit: <strong>Tier 1 (Qualifying) + Tier 2 (390 Marks)</strong>
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
        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Tier 1 + Tier 2 Controls */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              {/* Tier 1 Box */}
              <div className="p-3 rounded-3 border bg-light-subtle">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                    <span className="badge bg-primary text-white rounded-pill px-2 py-0.5">Tier 1</span>
                    <span>100 Qs / 200 Max Marks (+2 / -0.5)</span>
                  </span>
                  <span className="fw-bold text-primary small">
                    Score: {tier1Score} M
                  </span>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary mb-1">Correct (+2M)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      inputMode="numeric"
                      className="form-control form-control-sm fw-bold border-secondary-subtle"
                      value={t1ClampedC}
                      onChange={(e) => setT1Correct(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary mb-1">Wrong (-0.5M)</label>
                    <input
                      type="number"
                      min={0}
                      max={100 - t1ClampedC}
                      inputMode="numeric"
                      className="form-control form-control-sm fw-bold border-secondary-subtle"
                      value={t1ClampedI}
                      onChange={(e) => setT1Incorrect(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary flex-shrink-0" style={{ fontSize: "0.72rem" }}>Presets:</span>
                  {[60, 72, 80, 88].map(v => (
                    <button
                      key={v}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2 py-0.2 small fw-semibold flex-shrink-0 ${t1ClampedC === v ? 'btn-primary' : 'btn-light border text-secondary'}`}
                      style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                      onClick={() => setT1Correct(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier 2 Box */}
              <div className="p-3 rounded-3 border bg-light-subtle">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                    <span className="badge bg-indigo text-white rounded-pill px-2 py-0.5" style={{ background: "#4f46e5" }}>Tier 2</span>
                    <span>130 Qs / 390 Max Marks (+3 / -1.0)</span>
                  </span>
                  <span className="fw-bold text-indigo small" style={{ color: "#4f46e5" }}>
                    Score: {tier2Score} M
                  </span>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary mb-1">Correct (+3M)</label>
                    <input
                      type="number"
                      min={0}
                      max={130}
                      inputMode="numeric"
                      className="form-control form-control-sm fw-bold border-secondary-subtle"
                      value={t2ClampedC}
                      onChange={(e) => setT2Correct(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary mb-1">Wrong (-1.0M)</label>
                    <input
                      type="number"
                      min={0}
                      max={130 - t2ClampedC}
                      inputMode="numeric"
                      className="form-control form-control-sm fw-bold border-secondary-subtle"
                      value={t2ClampedI}
                      onChange={(e) => setT2Incorrect(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary flex-shrink-0" style={{ fontSize: "0.72rem" }}>Presets:</span>
                  {[85, 95, 105, 115].map(v => (
                    <button
                      key={v}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2 py-0.2 small fw-semibold flex-shrink-0 ${t2ClampedC === v ? 'btn-dark text-white' : 'btn-light border text-secondary'}`}
                      style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                      onClick={() => setT2Correct(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between mt-3">
              <span>Final Merit Basis: <strong>Tier 2 (390 Marks)</strong></span>
              <span className="small text-muted">Tier 1 is qualifying for final rank</span>
            </div>
          </div>

          {/* Right Column: Hero Gradient Box */}
          <div className="col-12 col-lg-6">
            <div
              className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                minHeight: 310
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                    TOTAL COMBINED SCORE
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: meritStatus.bg, color: meritStatus.color, fontSize: "0.75rem" }}
                  >
                    ● {meritStatus.label}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>{finalScore}</span>
                  <span className="fs-6 fs-sm-5 opacity-75">/ {maxAggregate} Marks</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">Tier 2 Merit Score: <strong>{tier2Score} / 390 Marks</strong></span>
                </div>
              </div>

              {/* Real-time detailed table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Tier 1 Raw:</span>
                    <strong>{tier1Score} / 200 M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Tier 2 Raw:</span>
                    <strong>{tier2Score} / 390 M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Total Positive:</span>
                    <strong className="text-success">+{totalPositive} M</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Negative Penalty:</span>
                    <strong className="text-warning">-{totalNegative} M</strong>
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
              <div className="small text-secondary mb-1 fw-semibold">Tier 1 Score</div>
              <div className="fs-4 fw-bold text-dark">{tier1Score} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {Math.round((tier1Score/200)*100)}% of 200 Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Tier 2 Merit</div>
              <div className="fs-4 fw-bold text-primary">{tier2Score} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {Math.round((tier2Score/390)*100)}% of 390 Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Combined %</div>
              <div className="fs-4 fw-bold text-success">{combinedPct}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Of 590 Aggregate
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Total Penalty</div>
              <div className="fs-4 fw-bold text-danger">-{totalNegative} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Negative Marks Lost
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
                  `My SSC CGL Combined Score is ${finalScore}/590 (Tier 2: ${tier2Score}/390 M). Check yours: https://www.pkminfotech.com/tools/ssc/ssc-cgl-final-score-calculator`
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
