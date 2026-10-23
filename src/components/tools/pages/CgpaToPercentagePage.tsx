"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Sparkles,
  Milestone,
  Percent,
  SlidersHorizontal,
  Award,
  CheckCircle2,
  BookOpen
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"

interface UniversityFormula {
  name: string
  formula: string
  calculate: (cgpa: number) => number
  description: string
  shortLabel: string
}

const FORMULA_REGISTRY: Record<string, UniversityFormula> = {
  cbse: {
    name: "CBSE / Standard (9.5x)",
    shortLabel: "CBSE (9.5x)",
    formula: "Percentage = CGPA × 9.5",
    calculate: (cgpa) => cgpa * 9.5,
    description: "Standard formula recommended by CBSE Board and major state school boards across India."
  },
  aktu: {
    name: "AKTU (Dr. APJ Abdul Kalam Tech Univ)",
    shortLabel: "AKTU (Engg)",
    formula: "Percentage = (CGPA - 0.75) × 10",
    calculate: (cgpa) => (cgpa - 0.75) * 10,
    description: "Official formula used for B.Tech, B.Arch, MCA and MBA courses in AKTU Uttar Pradesh."
  },
  vtu: {
    name: "VTU (Visvesvaraya Tech University)",
    shortLabel: "VTU (Engg)",
    formula: "Percentage = (CGPA - 0.75) × 10",
    calculate: (cgpa) => (cgpa - 0.75) * 10,
    description: "Standard calculation formula used by VTU Karnataka for engineering CGPA conversion."
  },
  mumbai: {
    name: "Mumbai University (CBCS Pattern)",
    shortLabel: "Mumbai Univ",
    formula: "Percentage = CGPA × 7.1 + 12 (4–7 CGPA) or CGPA × 10",
    calculate: (cgpa) => {
      if (cgpa >= 4 && cgpa <= 7) {
        return parseFloat((cgpa * 7.1 + 12).toFixed(2))
      }
      return cgpa * 10
    },
    description: "Official scale mapping conversion rule of Mumbai University for CBCS pattern."
  },
  standard_10x: {
    name: "IIT / NIT Standard 10x Scale",
    shortLabel: "IIT / NIT (10x)",
    formula: "Percentage = CGPA × 10",
    calculate: (cgpa) => cgpa * 10,
    description: "Standard multiplier used by IITs, NITs, and central universities where 10 equals 100%."
  }
}

export default function CgpaToPercentagePage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [formulaKey, setFormulaKey] = useState<string>("cbse")
  const [scoreInput, setScoreInput] = useState<string>("8.5")
  const [copied, setCopied] = useState<boolean>(false)

  const currentFormula = FORMULA_REGISTRY[formulaKey] || FORMULA_REGISTRY.cbse

  const cgpaValue = parseFloat(scoreInput) || 0
  const clampedCgpa = Math.min(10, Math.max(0, cgpaValue))

  const percentage = useMemo(() => {
    if (clampedCgpa <= 0) return 0
    const raw = currentFormula.calculate(clampedCgpa)
    return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))))
  }, [currentFormula, clampedCgpa])

  const classDivision = useMemo(() => {
    if (clampedCgpa <= 0) return "N/A"
    if (percentage >= 75) return "First Class with Distinction"
    if (percentage >= 60) return "First Class"
    if (percentage >= 50) return "Second Class"
    if (percentage >= 35) return "Pass Class"
    return "Fail / Remand"
  }, [percentage, clampedCgpa])

  const performanceZone = useMemo(() => {
    if (percentage >= 75) return { label: "Distinction", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" }
    if (percentage >= 60) return { label: "First Division", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" }
    if (percentage >= 50) return { label: "Second Division", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" }
    return { label: "Passing Grade", color: "#64748b", bg: "rgba(100, 116, 139, 0.15)" }
  }, [percentage])

  const handleReset = () => {
    setFormulaKey("cbse")
    setScoreInput("8.5")
  }

  const handleCopySummary = () => {
    const text = `🎓 *CGPA to Percentage Conversion:*
• CGPA Score: ${clampedCgpa} / 10.0
• Board / Formula: ${currentFormula.name}
• Equivalent Percentage: ${percentage}%
• Grade Division: ${classDivision}
• Formula Used: ${currentFormula.formula}
Calculated via: https://www.pkminfotech.com/tools/education/cgpa-to-percentage`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5]

  const usefulLinks: UsefulLinkItem[] = [
    { label: "CBSE 9.5x Conversion Rule", href: "#cbse-guide" },
    { label: "Engineering AKTU & VTU Formulas", href: "#engg-formulas" },
    { label: "Quick CGPA Reference Table", href: "#reference-table" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="cgpa-to-percentage-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="University & Board Formulas"
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* Main Interactive Tool Console */}
          <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            {/* Top Mode Switcher Bar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
              <div 
                className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                {Object.entries(FORMULA_REGISTRY).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormulaKey(key)}
                    className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 d-inline-flex align-items-center gap-1 ${
                      formulaKey === key ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                  >
                    <span>{item.shortLabel}</span>
                  </button>
                ))}
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
                  title="Reset to default"
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
                    {/* Formula Selector Dropdown */}
                    <div className="mb-3">
                      <label htmlFor="formulaSelect" className="form-label small fw-bold text-dark mb-1 d-flex align-items-center gap-1.5">
                        <SlidersHorizontal size={15} className="text-primary" />
                        <span>Select Board / University Formula:</span>
                      </label>
                      <select
                        id="formulaSelect"
                        className="form-select border-secondary-subtle rounded-3 py-2 fw-semibold text-dark"
                        value={formulaKey}
                        onChange={(e) => setFormulaKey(e.target.value)}
                        style={{ fontSize: "0.875rem" }}
                      >
                        {Object.entries(FORMULA_REGISTRY).map(([key, item]) => (
                          <option key={key} value={key}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* CGPA / SGPA Number Input */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="cgpaInput" className="form-label small fw-bold text-dark mb-0">
                          Enter CGPA / SGPA (out of 10)
                        </label>
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2 py-0.5" style={{ fontSize: "0.75rem" }}>
                          Scale: 0.0 – 10.0
                        </span>
                      </div>
                      <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle">
                        <input
                          id="cgpaInput"
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          max="10"
                          className="form-control fw-bold fs-4 text-dark border-0 px-3"
                          value={scoreInput}
                          onChange={(e) => setScoreInput(e.target.value)}
                          placeholder="e.g. 8.5"
                        />
                        <span className="input-group-text bg-light text-secondary border-0 px-3 fw-bold small">
                          / 10.0
                        </span>
                      </div>

                      {/* Quick Presets */}
                      <div 
                        className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar py-0.5"
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Presets:</span>
                        {presets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                              parseFloat(scoreInput) === val ? "btn-primary text-white" : "btn-light border text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => setScoreInput(val.toString())}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Formula description alert */}
                  <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex flex-column gap-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-dark">Applied Rule:</span>
                      <code className="text-primary fw-bold">{currentFormula.formula}</code>
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.76rem" }}>
                      {currentFormula.description}
                    </span>
                  </div>
                </div>

                {/* Right Column: Hero Gradient Result Box */}
                <div className="col-12 col-lg-6">
                  <div
                    className="h-100 rounded-4 p-3.5 p-md-4 text-white d-flex flex-column justify-content-between shadow"
                    style={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                      minHeight: 280
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                          EQUIVALENT PERCENTAGE
                        </span>
                        <span
                          className="badge rounded-pill fw-bold px-2.5 py-1"
                          style={{ background: performanceZone.bg, color: performanceZone.color, fontSize: "0.75rem" }}
                        >
                          ● {performanceZone.label}
                        </span>
                      </div>

                      <div className="d-flex align-items-baseline gap-2 mb-2">
                        <span className="fw-bold lh-1" style={{ fontSize: "clamp(2.2rem, 7vw, 3.25rem)" }}>{percentage}%</span>
                        <span className="fs-6 opacity-75">Marks Equivalent</span>
                      </div>

                      <div
                        className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                        style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                      >
                        <GraduationCap size={15} className="text-warning" />
                        <span className="small fw-semibold">{classDivision}</span>
                      </div>
                    </div>

                    {/* Breakdown table */}
                    <div
                      className="rounded-3 p-3"
                      style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
                    >
                      <div className="row g-2 small">
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Input CGPA:</span>
                          <strong>{clampedCgpa} / 10.0</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Scale Range:</span>
                          <strong className="text-warning">10-Point</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">To 100% Gap:</span>
                          <strong>{(100 - percentage).toFixed(2)}%</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Status:</span>
                          <strong className="text-info">{percentage >= 35 ? "PASSED" : "FAIL"}</strong>
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
                    <div className="small text-secondary mb-1 fw-semibold">Percentage</div>
                    <div className="fs-4 fw-bold text-primary">{percentage}%</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Equivalent Marks
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Grade Division</div>
                    <div className="fs-6 fw-bold text-dark text-truncate mt-1 mb-1">{classDivision}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Academic Classification
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Formula Key</div>
                    <div className="fs-5 fw-bold text-success mt-0.5 mb-0.5">{currentFormula.shortLabel}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      University Standard
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Passing Status</div>
                    <div className={`fs-5 fw-bold ${percentage >= 35 ? "text-success" : "text-danger"}`}>
                      {percentage >= 35 ? "Qualified ✓" : "Failed ✕"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Min 35% Threshold
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
                        `My CGPA ${clampedCgpa} equals ${percentage}% (${classDivision}) using ${currentFormula.name}. Convert yours: https://www.pkminfotech.com/tools/education/cgpa-to-percentage`
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
                          <span className="text-nowrap">Copy Summary</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Boundary: Interactive Tool (Above) vs Reference Guide & Documentation (Below) */}
          <div className="tool-reference-section-header mt-5 mb-3 pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span 
                className="badge rounded-pill bg-light text-primary border border-primary-subtle fw-bold px-3 py-1 text-uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
              >
                Official Reference Guide &amp; University Rules
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Academic Score Mapping: The Complete CGPA to Percentage Conversion Guide
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Formula logic for CBSE, AKTU, VTU, Mumbai University, and standard global 10-point systems.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              Modern educational institutions across India have adopted grading systems based on <strong>CGPA (Cumulative Grade Point Average)</strong> or <strong>SGPA (Semester Grade Point Average)</strong>. However, competitive recruitment portals (SSC, UPSC, Banking, Railways) still require percentage marks. Our converter provides official formula accuracy.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="cbse-guide">
              <Milestone size={16} className="text-primary" /> 1. The CBSE 9.5x Conversion Factor Explained
            </h3>
            <p>
              When CBSE introduced the CGPA system for secondary board exams, it studied five-year result distributions. Statistically, the average percentage scored by candidates within a grade point band aligned closely with <strong>9.5 times their grade point average</strong>.
            </p>
            <div className="bg-light p-3 rounded-3 border font-monospace mb-3">
              Formula: Percentage = CGPA × 9.5 <br />
              Example: 8.5 CGPA × 9.5 = 80.75%
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="engg-formulas">
              <Percent size={16} className="text-primary" /> 2. Technical University Formulas (AKTU, VTU, Mumbai)
            </h3>
            <ul className="ps-3 mb-4">
              <li><strong>AKTU (Uttar Pradesh):</strong> Formula: <code>Percentage = (CGPA - 0.75) × 10</code>. If your CGPA is 8.2: <code>(8.2 - 0.75) × 10 = 74.5%</code>.</li>
              <li><strong>VTU (Karnataka):</strong> Same standard: <code>Percentage = (CGPA - 0.75) × 10</code>.</li>
              <li><strong>Mumbai University:</strong> Between 4.0 and 7.0 CGPA: <code>Percentage = CGPA × 7.1 + 12</code>. Above 7.0: <code>CGPA × 10</code>.</li>
              <li><strong>IITs &amp; NITs:</strong> Direct 10x multiplier: <code>Percentage = CGPA × 10</code>.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="reference-table">3. Quick Conversion Reference Chart</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>CGPA (out of 10)</th>
                    <th>CBSE % (9.5x)</th>
                    <th>AKTU / VTU %</th>
                    <th>Mumbai Univ %</th>
                    <th>IIT / NIT % (10x)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cgpa: "9.5", cbse: "90.25%", aktu: "87.50%", mu: "95.00%", iit: "95.00%" },
                    { cgpa: "9.0", cbse: "85.50%", aktu: "82.50%", mu: "90.00%", iit: "90.00%" },
                    { cgpa: "8.5", cbse: "80.75%", aktu: "77.50%", mu: "85.00%", iit: "85.00%" },
                    { cgpa: "8.0", cbse: "76.00%", aktu: "72.50%", mu: "80.00%", iit: "80.00%" },
                    { cgpa: "7.5", cbse: "71.25%", aktu: "67.50%", mu: "75.00%", iit: "75.00%" },
                    { cgpa: "7.0", cbse: "66.50%", aktu: "62.50%", mu: "61.70%", iit: "70.00%" },
                  ].map((row) => (
                    <tr key={row.cgpa}>
                      <td><strong>{row.cgpa}</strong></td>
                      <td>{row.cbse}</td>
                      <td>{row.aktu}</td>
                      <td>{row.mu}</td>
                      <td>{row.iit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: How do I convert percentage back to CGPA?</strong>
                <span className="text-muted">Under the CBSE system, divide your percentage by 9.5 (e.g. 76% ÷ 9.5 = 8.0 CGPA).</span>
              </div>
              <div className="mb-3">
                <strong className="text-dark d-block">Q: What is the difference between SGPA and CGPA?</strong>
                <span className="text-muted">SGPA is Semester Grade Point Average for a single term, while CGPA is Cumulative Grade Point Average across all semesters combined.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="education"
              categoryName="Education Calculators"
              currentPath="/tools/education/cgpa-to-percentage"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
