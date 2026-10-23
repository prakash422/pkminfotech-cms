"use client"

import React, { useState, useMemo } from "react"
import { Calculator, ShieldCheck, CheckCircle2, TrendingUp, HelpCircle, Share2, Copy, Check } from "lucide-react"

interface PayLevelData {
  level: number
  gradePay: number
  defaultBasic: number
  postExamples: string
  taCategory: "low" | "mid" | "high"
}

const PAY_LEVELS: PayLevelData[] = [
  { level: 1, gradePay: 1800, defaultBasic: 18000, postExamples: "MTS, Railway Group D, Peon", taCategory: "low" },
  { level: 2, gradePay: 1900, defaultBasic: 19900, postExamples: "SSC CHSL LDC / JSA, Railway Junior Clerk", taCategory: "low" },
  { level: 3, gradePay: 2000, defaultBasic: 21700, postExamples: "SSC GD Constable, Delhi Police Constable", taCategory: "low" },
  { level: 4, gradePay: 2400, defaultBasic: 25500, postExamples: "SSC CGL Tax Assistant, CHSL DEO, UDC", taCategory: "mid" },
  { level: 5, gradePay: 2800, defaultBasic: 29200, postExamples: "SSC CGL Auditor, Accountant, Railway Senior Clerk", taCategory: "mid" },
  { level: 6, gradePay: 4200, defaultBasic: 35400, postExamples: "SSC CPO Sub-Inspector, Railway Station Master, Junior Engineer", taCategory: "mid" },
  { level: 7, gradePay: 4600, defaultBasic: 44900, postExamples: "SSC CGL ASO (MEA, CSS, IB), GST Inspector, Preventive Officer", taCategory: "mid" },
  { level: 8, gradePay: 4800, defaultBasic: 47600, postExamples: "Assistant Audit Officer (AAO), Assistant Accounts Officer", taCategory: "mid" },
  { level: 9, gradePay: 5400, defaultBasic: 53100, postExamples: "Section Officer, Senior AAO (Group B)", taCategory: "high" },
  { level: 10, gradePay: 5400, defaultBasic: 56100, postExamples: "UPSC Civil Services / State PSC Class 1 Officers", taCategory: "high" },
]

export default function SeventhPaySalaryCalculatorCard({ basePath = "/tools/ssc" }: { basePath?: string }) {
  const [selectedLevel, setSelectedLevel] = useState(7) // Default Level 7 (ASO/Inspector - most searched)
  const [cityCategory, setCityCategory] = useState<"X" | "Y" | "Z">("X")
  const [daPercent, setDaPercent] = useState(50) // Currently 50% DA
  const [customBasic, setCustomBasic] = useState<string>("")

  const levelInfo = useMemo(() => {
    return PAY_LEVELS.find((l) => l.level === selectedLevel) || PAY_LEVELS[6]
  }, [selectedLevel])

  const basicPay = useMemo(() => {
    const parsed = parseInt(customBasic, 10)
    return isNaN(parsed) || parsed <= 0 ? levelInfo.defaultBasic : parsed
  }, [customBasic, levelInfo.defaultBasic])

  // Calculations
  const daAmount = useMemo(() => Math.round((basicPay * daPercent) / 100), [basicPay, daPercent])

  // HRA Rates: X City = 30%, Y City = 20%, Z City = 10% (revised after DA reached 50%)
  const hraRate = cityCategory === "X" ? 30 : cityCategory === "Y" ? 20 : 10
  const hraAmount = useMemo(() => Math.round((basicPay * hraRate) / 100), [basicPay, hraRate])

  // Transport Allowance (TA)
  const taBase = useMemo(() => {
    if (levelInfo.taCategory === "high") return cityCategory === "X" ? 7200 : 3600
    if (levelInfo.taCategory === "mid") return cityCategory === "X" ? 3600 : 1800
    return cityCategory === "X" ? 1350 : 900
  }, [levelInfo.taCategory, cityCategory])

  const taDaAmount = useMemo(() => Math.round((taBase * daPercent) / 100), [taBase, daPercent])
  const totalTa = taBase + taDaAmount

  // Gross Salary
  const grossSalary = basicPay + daAmount + hraAmount + totalTa

  // Deductions
  const npsDeduction = useMemo(() => Math.round(((basicPay + daAmount) * 10) / 100), [basicPay, daAmount])
  const cghsDeduction = levelInfo.level >= 7 ? 650 : levelInfo.level >= 4 ? 450 : 250
  const cgegisDeduction = levelInfo.level >= 7 ? 60 : 30
  const totalDeductions = npsDeduction + cghsDeduction + cgegisDeduction

  // Net In-Hand Salary
  const netInHand = grossSalary - totalDeductions

  const [copied, setCopied] = useState(false)

  const shareText = `7th Pay Commission Salary Check: Level ${levelInfo.level} (GP ₹${levelInfo.gradePay}) in ${cityCategory} City:\nGross Salary: ₹${grossSalary.toLocaleString("en-IN")}\nNet In-Hand: ₹${netInHand.toLocaleString("en-IN")}/month!\nCalculate yours: https://www.pkminfotech.com/tools/ssc/7th-pay-salary-calculator`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <span className="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1.5 rounded-pill small">
            7th CPC Salary Formula (50% DA Revised)
          </span>
          <span className="small text-secondary">Updated for 2024–2026</span>
        </div>

        <div className="row g-3 mb-4">
          {/* Select Pay Level / Grade Pay */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary mb-1">
              Select Pay Level / Grade Pay
            </label>
            <select
              className="form-select border-secondary-subtle rounded-3 py-2"
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(Number(e.target.value))
                setCustomBasic("")
              }}
            >
              {PAY_LEVELS.map((p) => (
                <option key={p.level} value={p.level}>
                  Level {p.level} (GP ₹{p.gradePay}) — {p.postExamples.slice(0, 32)}...
                </option>
              ))}
            </select>
            <span className="form-text small text-muted">
              <strong>Common Posts:</strong> {levelInfo.postExamples}
            </span>
          </div>

          {/* Select City Category */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary mb-1">
              Posting City Classification (HRA)
            </label>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm py-2 ${cityCategory === "X" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setCityCategory("X")}
              >
                <strong>X City (30%)</strong>
                <small className="d-block text-truncate" style={{ fontSize: "0.68rem" }}>Metro (Delhi/Mumbai/Blr)</small>
              </button>
              <button
                type="button"
                className={`btn btn-sm py-2 ${cityCategory === "Y" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setCityCategory("Y")}
              >
                <strong>Y City (20%)</strong>
                <small className="d-block text-truncate" style={{ fontSize: "0.68rem" }}>Tier 2 (Patna/Jaipur/Lko)</small>
              </button>
              <button
                type="button"
                className={`btn btn-sm py-2 ${cityCategory === "Z" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setCityCategory("Z")}
              >
                <strong>Z City (10%)</strong>
                <small className="d-block text-truncate" style={{ fontSize: "0.68rem" }}>Rural / Small Towns</small>
              </button>
            </div>
          </div>

          {/* Basic Pay & DA Rate */}
          <div className="col-6 col-md-6">
            <label className="form-label small fw-semibold text-secondary mb-1">
              Basic Pay (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              className="form-control border-secondary-subtle rounded-3 py-2"
              placeholder={String(levelInfo.defaultBasic)}
              value={customBasic}
              onChange={(e) => setCustomBasic(e.target.value)}
            />
            <span className="form-text small text-muted">Default entry: ₹{levelInfo.defaultBasic.toLocaleString("en-IN")}</span>
          </div>

          <div className="col-6 col-md-6">
            <label className="form-label small fw-semibold text-secondary mb-1">
              Dearness Allowance (DA) %
            </label>
            <div className="input-group">
              <input
                type="number"
                inputMode="numeric"
                className="form-control border-secondary-subtle rounded-3 py-2"
                value={daPercent}
                onChange={(e) => setDaPercent(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
              <span className="input-group-text bg-light">%</span>
            </div>
            <span className="form-text small text-muted">Govt central DA rate (50%)</span>
          </div>
        </div>

        {/* Results Highlight Banner */}
        <div
          className="rounded-4 p-3 p-md-4 shadow-sm mb-4"
          style={{
            background: "linear-gradient(135deg, #0b1f3a 0%, #1d4ed8 100%)",
            color: "#ffffff",
          }}
        >
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="small text-uppercase tracking-wider" style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                Estimated Monthly In-Hand Salary
              </span>
              <h2 className="fw-bold mb-0 text-white text-break" style={{ fontSize: "clamp(1.85rem, 6.5vw, 2.75rem)", letterSpacing: "-0.02em" }}>
                ₹{netInHand.toLocaleString("en-IN")}
                <span className="fs-6 fw-normal" style={{ color: "rgba(255, 255, 255, 0.75)" }}> / month</span>
              </h2>
              <div className="mt-2">
                <span className="badge rounded-pill px-2.5 py-1 text-white" style={{ backgroundColor: "#10b981", fontWeight: 600, fontSize: "0.75rem" }}>
                  Annual In-Hand Package: ~₹{((netInHand * 12) / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div
                className="d-flex justify-content-between p-2 rounded-3 mb-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <span className="small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Gross Salary:</span>
                <span className="small fw-bold text-white">₹{grossSalary.toLocaleString("en-IN")}</span>
              </div>
              <div
                className="d-flex justify-content-between p-2 rounded-3 mb-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <span className="small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Total Deductions (NPS+CGHS):</span>
                <span className="small fw-bold" style={{ color: "#fca5a5" }}>-₹{totalDeductions.toLocaleString("en-IN")}</span>
              </div>
              <div
                className="d-flex justify-content-between p-2 rounded-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <span className="small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>NPS Govt Contribution (14%):</span>
                <span className="small fw-bold" style={{ color: "#fde047" }}>+₹{Math.round(((basicPay + daAmount) * 14) / 100).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Earnings & Deductions Table */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="p-3 bg-light rounded-3 border h-100">
              <h3 className="h6 fw-bold text-success mb-3 d-flex align-items-center gap-1.5">
                <TrendingUp size={16} /> Monthly Earnings (Allowances)
              </h3>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>Basic Pay:</span>
                <strong>₹{basicPay.toLocaleString("en-IN")}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>Dearness Allowance ({daPercent}%):</span>
                <strong>₹{daAmount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>House Rent Allowance ({hraRate}%):</span>
                <strong>₹{hraAmount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>Transport Allowance (TA + DA):</span>
                <strong>₹{totalTa.toLocaleString("en-IN")}</strong>
              </div>
              <div className="d-flex justify-content-between pt-2 fw-bold text-dark small">
                <span>Gross Monthly Earnings:</span>
                <span className="text-primary">₹{grossSalary.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 bg-light rounded-3 border h-100">
              <h3 className="h6 fw-bold text-danger mb-3 d-flex align-items-center gap-1.5">
                <ShieldCheck size={16} /> Monthly Deductions (Savings & Health)
              </h3>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>NPS (Employee 10%):</span>
                <strong>₹{npsDeduction.toLocaleString("en-IN")}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>CGHS (Medical Facility):</span>
                <strong>₹{cghsDeduction}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small">
                <span>CGEGIS (Insurance Scheme):</span>
                <strong>₹{cgegisDeduction}</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle small text-muted">
                <span>Professional Tax (Approx):</span>
                <strong>₹200</strong>
              </div>
              <div className="d-flex justify-content-between pt-2 fw-bold text-dark small">
                <span>Total Monthly Deductions:</span>
                <span className="text-danger">₹{(totalDeductions + 200).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Action Toolbar */}
        <div className="pt-3 mt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
          <div className="row g-2">
            <div className="col-6">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
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
                    <span className="text-nowrap">Copy Salary</span>
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
