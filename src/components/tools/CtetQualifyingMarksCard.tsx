"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  BookOpen,
  School
} from "lucide-react"

const CATEGORIES = [
  { value: "ur", label: "General / UR", passingPct: 60, passingMarks: 90 },
  { value: "ews", label: "EWS (Economically Weaker Section)", passingPct: 60, passingMarks: 90 },
  { value: "obc", label: "OBC (Other Backward Classes)", passingPct: 55, passingMarks: 82.5 },
  { value: "sc", label: "SC (Scheduled Caste)", passingPct: 55, passingMarks: 82.5 },
  { value: "st", label: "ST (Scheduled Tribe)", passingPct: 55, passingMarks: 82.5 },
  { value: "pwbd", label: "PwBD / Differently Abled", passingPct: 55, passingMarks: 82.5 },
]

type Props = { basePath?: string }

export default function CtetQualifyingMarksCard({ basePath = "/tools/eligibility" }: Props) {
  const [paper, setPaper] = useState<"paper-1" | "paper-2">("paper-1")
  const [categoryKey, setCategoryKey] = useState<string>("ur")
  const currentCategory = useMemo(() => CATEGORIES.find(c => c.value === categoryKey) || CATEGORIES[0], [categoryKey])

  const [score, setScore] = useState<number>(94)
  const [copied, setCopied] = useState<boolean>(false)

  const maxMarks = 150
  const clampedScore = Math.min(maxMarks, Math.max(0, score))
  const scorePct = Math.round((clampedScore / maxMarks) * 1000) / 10

  const isQualified = clampedScore >= currentCategory.passingMarks
  const margin = Math.round((clampedScore - currentCategory.passingMarks) * 10) / 10

  const handleReset = () => {
    setScore(94)
    setCategoryKey("ur")
  }

  const handleCopy = () => {
    const text = `🎓 *My CTET Qualifying Status:*
• Exam: CTET ${paper === "paper-1" ? "Paper 1 (Class 1-5)" : "Paper 2 (Class 6-8)"}
• Category: ${currentCategory.label}
• Marks Scored: ${clampedScore} / 150 (${scorePct}%)
• Qualifying Cutoff: ${currentCategory.passingMarks} M (${currentCategory.passingPct}%)
• Result: ${isQualified ? "QUALIFIED (PASSED)" : "NOT QUALIFIED"} (Buffer: ${margin >= 0 ? `+${margin}` : margin} M)
• Validity: Lifetime (NCTE Norms)
Check yours: https://www.pkminfotech.com/tools/eligibility/ctet-qualifying-marks`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [75, 82.5, 90, 105, 120]

  return (
    <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      {/* Top Mode Switcher Bar */}
      {/* Top Mode Switcher Bar */}
      <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div 
          className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <button
            type="button"
            className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              paper === "paper-1" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => setPaper("paper-1")}
          >
            <BookOpen size={15} />
            <span>CTET Paper 1 (Class 1–5)</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              paper === "paper-2" ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => setPaper("paper-2")}
          >
            <School size={15} />
            <span>CTET Paper 2 (Class 6–8)</span>
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
        {/* Category & Paper Configuration */}
        <div className="row g-2 mb-3.5 pb-3 border-bottom">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-dark mb-1">Select Candidate Category</label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} — Requires {c.passingPct}% ({c.passingMarks} Marks)
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-dark mb-1">Standard Passing Criterion</label>
            <div className="form-control border-0 bg-light rounded-3 py-2 text-secondary small fw-semibold">
              General: 60% (90 M) | Reserved (OBC/SC/ST): 55% (82.5 M)
            </div>
          </div>
        </div>

        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Score Input */}
              <div className="mb-3.5">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Your CTET Score (out of 150 Marks)
                  </label>
                  <span className={`badge rounded-pill fw-bold px-2.5 py-1 ${isQualified ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`} style={{ fontSize: "0.78rem" }}>
                    {scorePct}% Marks
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={150}
                    inputMode="decimal"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedScore}
                    onChange={(e) => setScore(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    / 150 M
                  </span>
                </div>

                {/* Quick Presets */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Key Cutoffs:</span>
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedScore === val ? "btn-primary text-white" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setScore(val)}
                    >
                      {val} M
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificate Recognition Box */}
              <div className="p-3 rounded-3 bg-light border">
                <span className="small fw-bold text-dark d-block mb-1">
                  🏛️ Certificate Validity &amp; Scope:
                </span>
                <p className="small text-secondary mb-0">
                  CTET Certificate holds <strong>Lifetime Validity</strong> across KVS, NVS, Central Tibetan Schools, and State govt teacher recruitment (subject to state rules).
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between mt-3">
              <span>Exam Pattern: <strong>150 Questions • 150 Marks</strong></span>
              <span>Negative Marking: <strong>None (0 Penalty)</strong></span>
            </div>
          </div>

          {/* Right Column: Hero Gradient Result Box */}
          <div className="col-12 col-lg-6">
            <div
              className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
              style={{
                background: isQualified ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" : "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
                minHeight: 290
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                    CTET QUALIFYING STATUS
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: isQualified ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.25)", color: "#ffffff", fontSize: "0.75rem" }}
                  >
                    ● {isQualified ? "QUALIFIED (PASSED)" : "NOT QUALIFIED"}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>{clampedScore}</span>
                  <span className="fs-6 fs-sm-5 opacity-75">/ 150 Marks ({scorePct}%)</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">
                    Required Minimum: <strong>{currentCategory.passingMarks} M ({currentCategory.passingPct}%)</strong> | Buffer: <strong>{margin >= 0 ? `+${margin} M` : `${margin} M`}</strong>
                  </span>
                </div>
              </div>

              {/* Real-time breakdown table */}
              <div
                className="rounded-3 p-3"
                style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
              >
                <div className="row g-2 small">
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Paper:</span>
                    <strong>{paper === "paper-1" ? "Paper 1 (Class 1-5)" : "Paper 2 (Class 6-8)"}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Passing Standard:</span>
                    <strong>{currentCategory.passingMarks} Marks</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Category:</span>
                    <strong>{currentCategory.label.split("(")[0]}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Final Verdict:</span>
                    <strong className={isQualified ? "text-success" : "text-warning"}>
                      {isQualified ? "QUALIFIED" : "NOT QUALIFIED"}
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
              <div className="small text-secondary mb-1 fw-semibold">CTET Status</div>
              <div className={`fs-5 fw-bold ${isQualified ? "text-success" : "text-danger"}`}>
                {isQualified ? "Qualified" : "Failed"}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                CBSE Official Norms
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Your Score %</div>
              <div className="fs-5 fw-bold text-primary">{scorePct}%</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Of 150 Total Marks
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Cutoff Needed</div>
              <div className="fs-5 fw-bold text-dark">{currentCategory.passingMarks} M</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {currentCategory.passingPct}% Minimum
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Cutoff Margin</div>
              <div className={`fs-5 fw-bold ${isQualified ? "text-success" : "text-danger"}`}>
                {margin >= 0 ? `+${margin}` : margin} M
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {isQualified ? "Safe Buffer" : "Shortfall"}
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
                  `My CTET ${paper.toUpperCase()} Score is ${clampedScore}/150 (${scorePct}%) - Status: ${isQualified ? "QUALIFIED" : "NOT QUALIFIED"}. Check yours: https://www.pkminfotech.com/tools/eligibility/ctet-qualifying-marks`
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
                    <span className="text-nowrap">Copy Status</span>
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
