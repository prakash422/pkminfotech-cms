"use client"

import { useState, useMemo } from "react"
import { 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  Award,
  HelpCircle
} from "lucide-react"

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General (UR)" },
  { value: "ews", label: "EWS" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "obc-ncl", label: "OBC (NCL)" },
]

// Official illustrative expected cutoff ranges by tier and category
const ESTIMATED_CUTOFF: Record<string, Record<string, number>> = {
  "tier-1": {
    general: 95.76,
    ews: 93.5,
    obc: 88.2,
    "obc-ncl": 88.2,
    sc: 82.5,
    st: 78.4,
  },
  "tier-2": {
    general: 285,
    ews: 278,
    obc: 265,
    "obc-ncl": 265,
    sc: 248,
    st: 235,
  },
}

function getEstimatedCutoff(tier: string, category: string): number {
  const t = tier === "tier-1" ? "tier-1" : "tier-2"
  const c = CATEGORIES.some((x) => x.value === category) ? category : "general"
  return ESTIMATED_CUTOFF[t]?.[c] ?? ESTIMATED_CUTOFF[t]?.general ?? 95.76
}

function getRankBand(diff: number): string {
  if (diff >= 30) return "Top 3% (Super Safe)"
  if (diff >= 20) return "Top 8% (Very Strong)"
  if (diff >= 10) return "Top 15% (Comfortable Safe)"
  if (diff >= 0) return "Top 25% (Safe Zone)"
  if (diff >= -5) return "Borderline (-5m)"
  return "Below Cutoff"
}

type Props = { basePath?: string }

export default function SscCglCutoffPredictorCard({ basePath = "/tools/ssc" }: Props) {
  const [tier, setTier] = useState<"tier-1" | "tier-2">("tier-1")
  const [category, setCategory] = useState("general")
  const [score, setScore] = useState("110")
  const [copied, setCopied] = useState(false)

  const scoreNum = useMemo(() => {
    const val = parseFloat(score)
    return isNaN(val) ? 0 : val
  }, [score])

  const maxTierScore = tier === "tier-1" ? 200 : 390
  const estimatedCutoff = useMemo(() => getEstimatedCutoff(tier, category), [tier, category])
  const diff = useMemo(() => Math.round((scoreNum - estimatedCutoff) * 100) / 100, [scoreNum, estimatedCutoff])
  const isAboveCutoff = diff >= 0
  const rankBand = useMemo(() => getRankBand(diff), [diff])
  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? "General (UR)"

  const formatCutoff = (n: number) => (tier === "tier-1" ? n.toFixed(2) : Math.round(n).toString())

  const handleReset = () => {
    setTier("tier-1")
    setCategory("general")
    setScore("110")
  }

  const handleCopySummary = async () => {
    const text = `SSC CGL ${tier === "tier-1" ? "Tier 1" : "Tier 2"} Cutoff Prediction:\n• Category: ${categoryLabel}\n• My Score: ${scoreNum}/${maxTierScore}\n• Expected Cutoff: ${formatCutoff(estimatedCutoff)}\n• Standing: ${isAboveCutoff ? "Above Cutoff" : "Below Cutoff"} (${diff > 0 ? "+" : ""}${diff})\n• Rank Band: ${rankBand}\nCalculated at: https://www.pkminfotech.com/tools/ssc/ssc-cgl-cutoff-predictor`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const tierPresets = tier === "tier-1" ? [90, 110, 130, 150, 170] : [240, 270, 295, 320, 345]

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white tool-console-card" style={{ border: "1px solid #e2e8f0" }}>
      
      {/* 1. Tool Console Control Topbar */}
      <div className="p-2.5 p-md-3 px-md-3.5 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0"
            style={{ width: 30, height: 30 }}
          >
            <Sliders size={15} className="text-primary" />
          </div>
          <div>
            <span className="fw-bold text-dark d-block small" style={{ fontSize: "0.85rem", lineHeight: 1.2 }}>
              Interactive Cutoff Prediction Engine
            </span>
            <span className="text-secondary small" style={{ fontSize: "0.72rem" }}>
              Live real-time qualification &amp; safe score simulator
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold">
            ⚡ Instant Live Calculation
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: "0.75rem" }}
            title="Reset parameters to default"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Console Body (2 Columns: Left = Inputs, Right = Live Output Dashboard) */}
      <div className="p-3.5 p-md-4">
        <div className="row g-4 align-items-stretch">
          
          {/* Left Column: Interactive Inputs Console */}
          <div className="col-12 col-md-6 col-lg-6 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-uppercase fw-bold text-secondary" style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                  1. Input Attempt Parameters
                </span>
                <span className="badge bg-primary text-white rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                  Step 1
                </span>
              </div>

              {/* Select Exam Tier */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark mb-1.5 d-flex align-items-center justify-content-between">
                  <span>Exam Tier Stage <span className="text-danger">*</span></span>
                  <span className="text-muted" style={{ fontSize: "0.72rem" }}>Max {maxTierScore} Marks</span>
                </label>
                <div className="d-flex rounded-3 overflow-hidden border p-1 bg-light">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 rounded-2 fw-semibold transition-all ${
                      tier === "tier-1" ? "btn-primary shadow-sm text-white" : "btn-light border-0 text-secondary"
                    }`}
                    style={{ fontSize: "0.825rem", padding: "6px 12px" }}
                    onClick={() => {
                      setTier("tier-1")
                      if (parseFloat(score) > 200) setScore("110")
                    }}
                  >
                    Tier 1 (200 M)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 rounded-2 fw-semibold transition-all ${
                      tier === "tier-2" ? "btn-primary shadow-sm text-white" : "btn-light border-0 text-secondary"
                    }`}
                    style={{ fontSize: "0.825rem", padding: "6px 12px" }}
                    onClick={() => {
                      setTier("tier-2")
                      if (parseFloat(score) < 200) setScore("280")
                    }}
                  >
                    Tier 2 (390 M)
                  </button>
                </div>
              </div>

              {/* Select Category */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark mb-1.5">
                  Your Reservation Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-md border rounded-3 fw-semibold text-dark"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ fontSize: "0.875rem", padding: "8px 14px", borderColor: "#cbd5e1" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enter Your Score */}
              <div className="mb-2">
                <label className="form-label small fw-semibold text-dark mb-1.5 d-flex align-items-center justify-content-between">
                  <span>Enter Your Raw / Normalized Score <span className="text-danger">*</span></span>
                  <span className="text-primary fw-bold" style={{ fontSize: "0.75rem" }}>
                    Limit: 0 - {maxTierScore}
                  </span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control form-control-lg fw-bold text-primary"
                    value={score}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^\d*\.?\d*$/.test(v)) setScore(v.slice(0, 6))
                    }}
                    placeholder={tier === "tier-1" ? "e.g. 110" : "e.g. 280"}
                    style={{ fontSize: "1.25rem", borderColor: "#cbd5e1" }}
                  />
                  <span className="input-group-text bg-light text-secondary fw-semibold small px-3">
                    Marks
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-3">
                <div 
                  className="d-flex align-items-center gap-1.5 mt-1 overflow-x-auto text-nowrap no-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <span className="small text-muted me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick Test:</span>
                  {tierPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScore(String(val))}
                      className={`btn btn-sm rounded-pill py-0.5 px-2.5 transition-all flex-shrink-0 ${
                        score === String(val) ? "btn-dark text-white fw-bold" : "btn-light border text-secondary small"
                      }`}
                      style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: "0.78rem" }}>
                <Sparkles size={14} className="text-primary flex-shrink-0" />
                <span>Change any value above — the output dashboard updates <strong>instantly</strong> in real time.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Output Result Dashboard */}
          <div className="col-12 col-md-6 col-lg-6">
            <div 
              className={`rounded-4 p-3.5 p-md-4 h-100 d-flex flex-column justify-content-between border shadow-sm ${
                isAboveCutoff 
                  ? "bg-success bg-opacity-10 border-success border-opacity-25" 
                  : "bg-warning bg-opacity-10 border-warning border-opacity-25"
              }`}
            >
              <div>
                {/* Header Status Bar */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <span className="text-uppercase fw-bold text-secondary" style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                    2. Live Prediction Dashboard
                  </span>
                  <span 
                    className={`badge rounded-pill fw-bold px-2.5 py-1 ${
                      isAboveCutoff ? "bg-success text-white" : "bg-danger text-white"
                    }`}
                    style={{ fontSize: "0.72rem" }}
                  >
                    {isAboveCutoff ? "QUALIFIED" : "AT RISK"}
                  </span>
                </div>

                {/* Qualification Hero Banner */}
                <div className={`p-3 rounded-3 mb-3 d-flex align-items-center gap-2.5 bg-white border ${
                  isAboveCutoff ? "border-success text-success" : "border-warning text-dark"
                }`}>
                  {isAboveCutoff ? (
                    <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                  ) : (
                    <AlertCircle size={24} className="text-warning flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="h6 fw-bold mb-0" style={{ fontSize: "0.95rem" }}>
                      {isAboveCutoff ? "You are comfortably Above Expected Cutoff!" : "Your score is Below Expected Cutoff."}
                    </h4>
                    <span className="small text-secondary" style={{ fontSize: "0.78rem" }}>
                      {isAboveCutoff 
                        ? `Great chance for clearing ${tier === "tier-1" ? "Tier 1 Screening" : "Tier 2 Final Selection"}.`
                        : "Requires score improvement based on previous year cutoff trends."
                      }
                    </span>
                  </div>
                </div>

                {/* Score vs Cutoff Dual Hero Tiles */}
                <div className="row g-2.5 mb-3">
                  <div className="col-6">
                    <div className="p-3 bg-white rounded-3 border h-100">
                      <span className="small text-secondary d-block mb-1" style={{ fontSize: "0.75rem" }}>
                        Your Entered Score
                      </span>
                      <div className="fw-bold text-dark" style={{ fontSize: "1.65rem", lineHeight: 1 }}>
                        {scoreNum}
                        <span className="small text-muted fw-normal ms-1" style={{ fontSize: "0.75rem" }}>
                          / {maxTierScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 bg-white rounded-3 border h-100">
                      <span className="small text-secondary d-block mb-1" style={{ fontSize: "0.75rem" }}>
                        Expected Cutoff ({categoryLabel})
                      </span>
                      <div className="fw-bold text-primary" style={{ fontSize: "1.65rem", lineHeight: 1 }}>
                        {formatCutoff(estimatedCutoff)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Analytics Grid */}
                <div className="p-3 bg-white rounded-3 border mb-3">
                  <div className="row g-2 text-center">
                    <div className="col-4 border-end">
                      <span className="small text-secondary d-block" style={{ fontSize: "0.72rem" }}>Margin</span>
                      <span className={`fw-bold small ${diff >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.875rem" }}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                    <div className="col-4 border-end">
                      <span className="small text-secondary d-block" style={{ fontSize: "0.72rem" }}>Percentile Band</span>
                      <span className="fw-bold text-dark small" style={{ fontSize: "0.85rem" }}>
                        {rankBand}
                      </span>
                    </div>
                    <div className="col-4">
                      <span className="small text-secondary d-block" style={{ fontSize: "0.72rem" }}>Category</span>
                      <span className="fw-bold text-primary small" style={{ fontSize: "0.85rem" }}>
                        {category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Action Toolbar */}
              <div className="pt-3 mt-2 border-top" style={{ borderColor: "#f1f5f9" }}>
                <div className="row g-2">
                  <div className="col-6">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `My SSC CGL ${tier === "tier-1" ? "Tier 1" : "Tier 2"} score is ${scoreNum}/${maxTierScore} (${categoryLabel}). Expected Cutoff: ${formatCutoff(estimatedCutoff)}. Check your status here: https://www.pkminfotech.com/tools/ssc/ssc-cgl-cutoff-predictor`
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
                      title="Share result on WhatsApp"
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
                          <span className="text-nowrap">Copy Result</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

