"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Shield, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Ruler,
  User
} from "lucide-react"

const POLICE_FORCES = [
  { value: "up-police", label: "UP Police Constable / SI", maleUR: 168, maleST: 160, femaleUR: 152, femaleST: 147 },
  { value: "delhi-police", label: "Delhi Police Constable / Executive", maleUR: 170, maleST: 165, femaleUR: 157, femaleST: 155 },
  { value: "ssc-gd", label: "SSC GD Constable (BSF, CISF, CRPF, ITBP)", maleUR: 170, maleST: 162.5, femaleUR: 157, femaleST: 150 },
  { value: "bihar-police", label: "Bihar Police Constable / Daroga (SI)", maleUR: 165, maleST: 160, femaleUR: 155, femaleST: 155 },
  { value: "rpf", label: "Railway Protection Force (RPF SI / Constable)", maleUR: 165, maleST: 160, femaleUR: 157, femaleST: 152 },
]

const CATEGORIES = [
  { value: "ur", label: "General / UR" },
  { value: "obc", label: "OBC (Other Backward Classes)" },
  { value: "ews", label: "EWS" },
  { value: "sc", label: "SC (Scheduled Caste)" },
  { value: "st", label: "ST / Hill Area Tribes (Relaxation Applied)" },
]

function cmToFeetInches(cm: number): string {
  const inches = cm / 2.54
  const feet = Math.floor(inches / 12)
  const remInches = Math.round(inches % 12)
  return `${feet} ft ${remInches} in`
}

type Props = { basePath?: string }

export default function PoliceHeightEligibilityCard({ basePath = "/tools/eligibility" }: Props) {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [forceKey, setForceKey] = useState<string>("ssc-gd")
  const currentForce = useMemo(() => POLICE_FORCES.find(f => f.value === forceKey) || POLICE_FORCES[0], [forceKey])

  const [categoryKey, setCategoryKey] = useState<string>("ur")
  const isST = categoryKey === "st"

  const [heightCm, setHeightCm] = useState<number>(gender === "male" ? 172 : 158)
  const [copied, setCopied] = useState<boolean>(false)

  // Determine required height
  const minRequiredHeight = useMemo(() => {
    if (gender === "male") {
      return isST ? currentForce.maleST : currentForce.maleUR
    } else {
      return isST ? currentForce.femaleST : currentForce.femaleUR
    }
  }, [gender, isST, currentForce])

  const clampedHeight = Math.max(120, Math.min(220, heightCm))
  const margin = Math.round((clampedHeight - minRequiredHeight) * 10) / 10
  const isEligible = margin >= 0
  const feetInches = cmToFeetInches(clampedHeight)

  const handleGenderChange = (g: "male" | "female") => {
    setGender(g)
    setHeightCm(g === "male" ? 172 : 158)
  }

  const handleReset = () => {
    setGender("male")
    setForceKey("ssc-gd")
    setCategoryKey("ur")
    setHeightCm(172)
  }

  const handleCopy = () => {
    const text = `👮 *My Police Physical Height Eligibility Check:*
• Target Force: ${currentForce.label}
• Gender: ${gender.toUpperCase()} | Category: ${CATEGORIES.find(c => c.value === categoryKey)?.label}
• My Height: ${clampedHeight} cm (${feetInches})
• Minimum Required: ${minRequiredHeight} cm
• PST Verdict: ${isEligible ? "ELIGIBLE / QUALIFIED" : "SHORT OF HEIGHT"} (Margin: ${margin >= 0 ? `+${margin}` : margin} cm)
Check your eligibility: https://www.pkminfotech.com/tools/eligibility/police-height-eligibility`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = gender === "male" ? [162.5, 165, 168, 170, 175] : [150, 152, 155, 157, 162]

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
            className={`btn btn-sm fw-semibold px-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              gender === "male" ? "btn-primary shadow-sm" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => handleGenderChange("male")}
          >
            <User size={14} />
            <span>Male Physical (PST)</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm fw-semibold px-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
              gender === "female" ? "btn-primary shadow-sm" : "btn-light text-secondary"
            }`}
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => handleGenderChange("female")}
          >
            <User size={14} />
            <span>Female Physical (PST)</span>
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
        {/* Force & Category Selectors */}
        <div className="row g-2 mb-3.5 pb-3 border-bottom">
          <div className="col-12 col-md-7">
            <label className="form-label small fw-bold text-dark mb-1">Target Police Force / Defense Exam</label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
              value={forceKey}
              onChange={(e) => setForceKey(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              {POLICE_FORCES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label small fw-bold text-dark mb-1">Category (ST/Hill Quota)</label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Two-Column Split */}
        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              {/* Height Input */}
              <div className="mb-3.5">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <label className="form-label small fw-bold text-dark mb-0">
                    Enter Your Exact Height (in cm)
                  </label>
                  <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2.5 py-1" style={{ fontSize: "0.78rem" }}>
                    {feetInches}
                  </span>
                </div>
                <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle shadow-xs">
                  <input
                    type="number"
                    step="0.5"
                    min={120}
                    max={220}
                    inputMode="decimal"
                    className="form-control fw-bold fs-4 text-dark border-0 px-3"
                    value={clampedHeight}
                    onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                  />
                  <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                    CM
                  </span>
                </div>

                {/* Quick Presets */}
                <div 
                  className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Common:</span>
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                        clampedHeight === val ? "btn-primary" : "btn-light border text-secondary"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      onClick={() => setHeightCm(val)}
                    >
                      {val} cm
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Requirements Guideline Box */}
              <div className="p-3 rounded-3 bg-light border">
                <span className="small fw-bold text-dark d-block mb-1">
                  📏 Official PST Measurement Standard:
                </span>
                <p className="small text-secondary mb-0">
                  Minimum required for {gender.toUpperCase()} in {currentForce.label.split("(")[0]} is <strong>{minRequiredHeight} cm</strong>. Measurements are taken barefoot during the Physical Standard Test (PST).
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between mt-3">
              <span>Required Standard: <strong>{minRequiredHeight} cm</strong></span>
              <span>Category Rule: <strong>{isST ? "ST / Tribal Relaxation Applied" : "Standard UR / OBC Norms"}</strong></span>
            </div>
          </div>

          {/* Right Column: Hero Gradient Result Box */}
          <div className="col-12 col-lg-6">
            <div
              className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
              style={{
                background: isEligible ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" : "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
                minHeight: 290
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                    PHYSICAL STANDARD VERDICT (PST)
                  </span>
                  <span
                    className="badge rounded-pill fw-bold px-2.5 py-1"
                    style={{ background: isEligible ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.25)", color: "#ffffff", fontSize: "0.75rem" }}
                  >
                    ● {isEligible ? "HEIGHT ELIGIBILITY: QUALIFIED" : "HEIGHT CRITERIA NOT MET"}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="fw-bold lh-1" style={{ fontSize: "clamp(2.2rem, 7vw, 3.25rem)" }}>{clampedHeight}</span>
                  <span className="fs-5 opacity-75">CM ({feetInches})</span>
                </div>

                <div
                  className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                  style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="small">
                    Required: <strong>{minRequiredHeight} cm</strong> | Buffer: <strong>{margin >= 0 ? `+${margin} cm Safe` : `${margin} cm Short`}</strong>
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
                    <span className="opacity-75">Force Target:</span>
                    <strong>{currentForce.label.split("(")[0]}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Gender:</span>
                    <strong>{gender.toUpperCase()}</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Minimum Required:</span>
                    <strong>{minRequiredHeight} cm</strong>
                  </div>
                  <div className="col-6 d-flex justify-content-between">
                    <span className="opacity-75">Eligibility:</span>
                    <strong className={isEligible ? "text-success" : "text-warning"}>
                      {isEligible ? "ELIGIBLE" : "SHORT"}
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
              <div className="small text-secondary mb-1 fw-semibold">PST Verdict</div>
              <div className={`fs-5 fw-bold ${isEligible ? "text-success" : "text-danger"}`}>
                {isEligible ? "Qualified" : "Short"}
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                Physical measurement
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Your Height</div>
              <div className="fs-5 fw-bold text-dark">{clampedHeight} cm</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {feetInches}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Min Required</div>
              <div className="fs-5 fw-bold text-primary">{minRequiredHeight} cm</div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                For {gender.toUpperCase()} ({categoryKey.toUpperCase()})
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border rounded-3 p-3 bg-light text-center h-100">
              <div className="small text-secondary mb-1 fw-semibold">Height Buffer</div>
              <div className={`fs-5 fw-bold ${isEligible ? "text-success" : "text-danger"}`}>
                {margin >= 0 ? `+${margin}` : margin} cm
              </div>
              <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                {isEligible ? "Safe clearance" : "Deficit"}
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
                  `My Police Height Check for ${currentForce.label} is ${isEligible ? "ELIGIBLE" : "SHORT"} (${clampedHeight} cm vs ${minRequiredHeight} cm required). Check yours: https://www.pkminfotech.com/tools/eligibility/police-height-eligibility`
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
