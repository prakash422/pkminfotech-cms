"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ToolPageHeader from "@/components/tools/ToolPageHeader"
import ToolHeaderHero, { FilterChip } from "@/components/tools/ToolHeaderHero"
import ToolSidebar from "@/components/tools/ToolSidebar"
import {
  Maximize2,
  Calculator,
  Compass,
  Coins,
  Share2,
  CheckCircle2,
  Info,
  Building,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react"

interface StandardPlot {
  gaj: number
  sqFt: number
  dimensions: string
  bestFor: string
}

const STANDARD_PLOTS: StandardPlot[] = [
  { gaj: 30, sqFt: 270, dimensions: "10 ft × 27 ft or 9 ft × 30 ft", bestFor: "Micro-plot, 1 Room / Studio setup" },
  { gaj: 50, sqFt: 450, dimensions: "15 ft × 30 ft", bestFor: "1 BHK Budget Home / Small Shop" },
  { gaj: 60, sqFt: 540, dimensions: "18 ft × 30 ft or 15 ft × 36 ft", bestFor: "Compact 2 BHK Ground Floor" },
  { gaj: 75, sqFt: 675, dimensions: "15 ft × 45 ft or 18 ft × 37.5 ft", bestFor: "Comfortable 2 BHK with Car Parking" },
  { gaj: 100, sqFt: 900, dimensions: "20 ft × 45 ft or 18 ft × 50 ft", bestFor: "Standard 3 BHK Duplex / Delhi-NCR Standard" },
  { gaj: 150, sqFt: 1350, dimensions: "25 ft × 54 ft or 30 ft × 45 ft", bestFor: "Spacious 3-4 BHK Independent Villa" },
  { gaj: 200, sqFt: 1800, dimensions: "30 ft × 60 ft", bestFor: "Luxury Duplex with Garden & Parking" },
  { gaj: 250, sqFt: 2250, dimensions: "30 ft × 75 ft", bestFor: "Large Multi-Story Residential Bungalow" },
  { gaj: 300, sqFt: 2700, dimensions: "36 ft × 75 ft or 40 ft × 67.5 ft", bestFor: "Commercial / Premium Villa" },
  { gaj: 500, sqFt: 4500, dimensions: "45 ft × 100 ft or 50 ft × 90 ft", bestFor: "Farmhouse / Warehouse / Mini-Resort" },
]

export default function GajToSquareFeetPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  // Mode selection: "converter" | "plot-dimension" | "cost-calculator"
  const [activeTab, setActiveTab] = useState<"converter" | "dimensions" | "cost">("converter")

  // Unit Converter State
  const [inputValue, setInputValue] = useState<string>("100")
  const [selectedUnit, setSelectedUnit] = useState<"gaj" | "sqFt" | "sqMeter">("gaj")

  // Plot Dimensions State
  const [frontWidth, setFrontWidth] = useState<string>("20")
  const [depthLength, setDepthLength] = useState<string>("45")

  // Cost Estimator State
  const [ratePerGaj, setRatePerGaj] = useState<string>("25000")
  const [stampDutyPercent, setStampDutyPercent] = useState<number>(6)
  const [copied, setCopied] = useState<boolean>(false)

  // Calculations for Unit Converter
  const conversions = useMemo(() => {
    const val = parseFloat(inputValue) || 0
    let gaj = 0

    if (selectedUnit === "gaj") {
      gaj = val
    } else if (selectedUnit === "sqFt") {
      gaj = val / 9
    } else if (selectedUnit === "sqMeter") {
      gaj = val / 0.836127
    }

    const sqFt = gaj * 9
    const sqMeter = sqFt * 0.092903
    const acre = sqFt / 43560
    const bighaPuHr = sqFt / 9000 // Punjab / Haryana standard
    const bighaUpBihar = sqFt / 27225 // Eastern UP / Bihar standard
    const biswaUp = sqFt / 1361.25 // UP Biswa

    return {
      gaj: Math.round(gaj * 100) / 100,
      sqFt: Math.round(sqFt * 100) / 100,
      sqMeter: Math.round(sqMeter * 100) / 100,
      acre: Math.round(acre * 10000) / 10000,
      bighaPuHr: Math.round(bighaPuHr * 1000) / 1000,
      bighaUpBihar: Math.round(bighaUpBihar * 1000) / 1000,
      biswaUp: Math.round(biswaUp * 100) / 100,
    }
  }, [inputValue, selectedUnit])

  // Plot Dimension Calculations
  const dimensionCalc = useMemo(() => {
    const w = parseFloat(frontWidth) || 0
    const l = parseFloat(depthLength) || 0
    const totalSqFt = w * l
    const totalGaj = totalSqFt / 9
    const totalSqMeter = totalSqFt * 0.092903
    const perimeter = 2 * (w + l)

    return {
      totalSqFt: Math.round(totalSqFt * 100) / 100,
      totalGaj: Math.round(totalGaj * 100) / 100,
      totalSqMeter: Math.round(totalSqMeter * 100) / 100,
      perimeter: Math.round(perimeter * 10) / 10,
    }
  }, [frontWidth, depthLength])

  // Cost Calculations
  const costCalc = useMemo(() => {
    const rate = parseFloat(ratePerGaj) || 0
    const gaj = conversions.gaj
    const baseCost = gaj * rate
    const stampDuty = (baseCost * stampDutyPercent) / 100
    const registrationFee = Math.min(baseCost * 0.01, 30000) // 1% or max state cap
    const totalCost = baseCost + stampDuty + registrationFee

    return {
      baseCost: Math.round(baseCost),
      stampDuty: Math.round(stampDuty),
      registrationFee: Math.round(registrationFee),
      totalCost: Math.round(totalCost),
      ratePerSqFt: gaj > 0 ? Math.round(rate / 9) : 0,
    }
  }, [conversions.gaj, ratePerGaj, stampDutyPercent])

  const copyResults = async () => {
    const text = `Plot Measurement (${conversions.gaj} Gaj):\n• Area: ${conversions.sqFt} Sq. Ft. (${conversions.sqMeter} Sq. Mtr)\n• Dimension: ${frontWidth} ft × ${depthLength} ft\n• Estimated Cost (@ ₹${ratePerGaj}/Gaj): ₹${costCalc.totalCost.toLocaleString("en-IN")}\nCalculate on: https://www.pkminfotech.com/tools/land-area/gaj-to-square-feet`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const shareText = `Plot Size: ${conversions.gaj} Gaj = ${conversions.sqFt} Sq Ft (${conversions.sqMeter} Sq Meter). Front × Depth: ${frontWidth}ft × ${depthLength}ft. Check plot cost & dimensions: https://www.pkminfotech.com/tools/land-area/gaj-to-square-feet`

  const chips: FilterChip[] = [
    { label: "Gaj to Sq Ft", active: activeTab === "converter", onClick: () => setActiveTab("converter") },
    { label: "Plot Dimensions", active: activeTab === "dimensions", onClick: () => setActiveTab("dimensions") },
    { label: "Cost & Registry", active: activeTab === "cost", onClick: () => setActiveTab("cost") },
    { label: "Bigha to Kattha", href: "/tools/land-area/bigha-to-kattha" },
    { label: "All land tools", href: "/tools/land-area" },
  ]

  return (
    <div className="gaj-to-sqft-page mb-5">
      <ToolHeaderHero
        title={title}
        description="Convert Gaj (Square Yard) to Square Feet instantly. Calculate exact plot dimensions, boundary wall length, and property registry costs with 100% precision."
        chips={chips}
        badgeText="Plot & Land Area · Instant"
      />

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-8">

      {/* Mode Switcher Tabs */}
      <div className="card border-0 shadow-sm rounded-4 p-1.5 p-sm-2 mb-4 bg-light">
        <div 
          className="d-flex gap-2 overflow-x-auto text-nowrap no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <button
            type="button"
            className={`btn py-2 px-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 flex-shrink-0 flex-md-fill ${
              activeTab === "converter" ? "btn-primary shadow-sm text-white" : "btn-white text-secondary"
            }`}
            style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
            onClick={() => setActiveTab("converter")}
          >
            <Maximize2 size={16} />
            <span>Gaj to Sq Ft Converter</span>
          </button>
          <button
            type="button"
            className={`btn py-2 px-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 flex-shrink-0 flex-md-fill ${
              activeTab === "dimensions" ? "btn-primary shadow-sm text-white" : "btn-white text-secondary"
            }`}
            style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
            onClick={() => setActiveTab("dimensions")}
          >
            <Compass size={16} />
            <span>Plot Dimension (L × W)</span>
          </button>
          <button
            type="button"
            className={`btn py-2 px-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 flex-shrink-0 flex-md-fill ${
              activeTab === "cost" ? "btn-primary shadow-sm text-white" : "btn-white text-secondary"
            }`}
            style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
            onClick={() => setActiveTab("cost")}
          >
            <Coins size={16} />
            <span>Plot Cost &amp; Registry Fee</span>
          </button>
        </div>
      </div>

      {/* Main Calculation Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-3 p-md-4">
          {activeTab === "converter" && (
            <div>
              <div className="row g-3 align-items-center mb-4">
                <div className="col-12 col-md-7">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Enter Land Area Value
                  </label>
                  <div className="input-group input-group-lg">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      inputMode="decimal"
                      className="form-control fw-bold fs-4 border-secondary-subtle"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g. 100"
                    />
                    <select
                      className="form-select border-secondary-subtle fw-semibold"
                      style={{ maxWidth: "160px" }}
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value as any)}
                    >
                      <option value="gaj">Gaj (वर्ग गज)</option>
                      <option value="sqFt">Square Feet (वर्ग फुट)</option>
                      <option value="sqMeter">Square Meter (वर्ग मीटर)</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Quick Preset Buttons
                  </label>
                  <div 
                    className="d-flex align-items-center gap-1.5 overflow-x-auto text-nowrap no-scrollbar"
                    style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                  >
                    {[50, 60, 100, 150, 200, 500].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`btn btn-sm flex-shrink-0 ${
                          conversions.gaj === num ? "btn-primary text-white" : "btn-outline-secondary"
                        }`}
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => {
                          setSelectedUnit("gaj")
                          setInputValue(String(num))
                        }}
                      >
                        {num} Gaj
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Converted Results Hero Box */}
              <div
                className="rounded-4 p-4 text-white shadow-sm mb-4"
                style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" }}
              >
                <div className="row align-items-center">
                  <div className="col-12 col-md-7 mb-3 mb-md-0">
                    <span className="text-white-50 text-uppercase small tracking-wide">
                      Equivalent Total Square Feet
                    </span>
                    <h2 className="display-4 fw-bold mb-0 text-white">
                      {conversions.sqFt.toLocaleString("en-IN")}{" "}
                      <span className="fs-5 fw-normal text-white-50">Sq. Ft.</span>
                    </h2>
                    <p className="mb-0 mt-2 text-white-75 small">
                      <strong>1 Gaj = 9 Square Feet</strong> (3 ft length × 3 ft breadth)
                    </p>
                  </div>

                  <div className="col-12 col-md-5">
                    <div className="rounded-3 p-3 text-white" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)" }}>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Square Yards:</span>
                        <strong>{conversions.gaj} Sq. Yards</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Square Meters:</span>
                        <strong>{conversions.sqMeter} m²</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Acre Fraction:</span>
                        <strong>{conversions.acre} Acre</strong>
                      </div>
                      <div className="d-flex justify-content-between pt-1 small">
                        <span>Standard Biswa (UP):</span>
                        <strong>{conversions.biswaUp} Biswa</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of Regional Units */}
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border h-100">
                    <span className="text-muted small d-block mb-1">Square Yards</span>
                    <h4 className="fw-bold mb-0 text-dark">{conversions.gaj}</h4>
                    <span className="small text-secondary" style={{ fontSize: "0.75rem" }}>
                      1 Gaj = 1 Sq Yard
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border h-100">
                    <span className="text-muted small d-block mb-1">Square Meters</span>
                    <h4 className="fw-bold mb-0 text-dark">{conversions.sqMeter}</h4>
                    <span className="small text-secondary" style={{ fontSize: "0.75rem" }}>
                      1 Gaj = 0.8361 m²
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border h-100">
                    <span className="text-muted small d-block mb-1">Punjab/HR Bigha</span>
                    <h4 className="fw-bold mb-0 text-dark">{conversions.bighaPuHr}</h4>
                    <span className="small text-secondary" style={{ fontSize: "0.75rem" }}>
                      1 Bigha = 1,000 Gaj
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border h-100">
                    <span className="text-muted small d-block mb-1">UP/Bihar Bigha</span>
                    <h4 className="fw-bold mb-0 text-dark">{conversions.bighaUpBihar}</h4>
                    <span className="small text-secondary" style={{ fontSize: "0.75rem" }}>
                      1 Bigha = 3,025 Gaj
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dimensions" && (
            <div>
              <p className="text-secondary small mb-3">
                Buying a plot? Enter the front width and depth length in feet to know exactly how many Gaj and Square Feet it measures.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Plot Front / Width (in Feet)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control form-control-lg border-secondary-subtle"
                      value={frontWidth}
                      onChange={(e) => setFrontWidth(e.target.value)}
                      placeholder="e.g. 20"
                    />
                    <span className="input-group-text bg-light">ft (feet)</span>
                  </div>
                  <span className="form-text small text-muted">Rasta / Road facing side</span>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Plot Depth / Length (in Feet)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control form-control-lg border-secondary-subtle"
                      value={depthLength}
                      onChange={(e) => setDepthLength(e.target.value)}
                      placeholder="e.g. 45"
                    />
                    <span className="input-group-text bg-light">ft (feet)</span>
                  </div>
                  <span className="form-text small text-muted">Front se piche ki lambai</span>
                </div>
              </div>

              {/* Dimension Result Box */}
              <div
                className="rounded-4 p-4 text-white shadow-sm mb-4"
                style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
              >
                <div className="row align-items-center">
                  <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <span className="text-white-50 text-uppercase small">Total Plot Area</span>
                    <h2 className="display-4 fw-bold text-white mb-0">
                      {dimensionCalc.totalGaj}{" "}
                      <span className="fs-5 fw-normal text-white-50">Gaj (वर्ग गज)</span>
                    </h2>
                    <span className="badge bg-warning text-dark px-3 py-1 rounded-pill mt-2 fw-semibold">
                      {dimensionCalc.totalSqFt.toLocaleString("en-IN")} Square Feet
                    </span>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="rounded-3 p-3 text-white" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)" }}>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Plot Dimensions:</span>
                        <strong>
                          {frontWidth} ft × {depthLength} ft
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Square Meters:</span>
                        <strong>{dimensionCalc.totalSqMeter} m²</strong>
                      </div>
                      <div className="d-flex justify-content-between pt-1 small">
                        <span>Boundary Wall Perimeter:</span>
                        <strong>{dimensionCalc.perimeter} Feet Total</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cost" && (
            <div>
              <p className="text-secondary small mb-3">
                Estimate the total purchase price, state stamp duty, and registry fees for your plot area based on current market rates.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Plot Area (in Gaj)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg border-secondary-subtle"
                    value={inputValue}
                    onChange={(e) => {
                      setSelectedUnit("gaj")
                      setInputValue(e.target.value)
                    }}
                    placeholder="e.g. 100"
                  />
                  <span className="form-text small text-muted">
                    Equivalent to {conversions.sqFt} Sq. Ft.
                  </span>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Rate per Gaj (₹ / वर्ग गज)
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light">₹</span>
                    <input
                      type="number"
                      className="form-control border-secondary-subtle"
                      value={ratePerGaj}
                      onChange={(e) => setRatePerGaj(e.target.value)}
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <span className="form-text small text-muted">
                    Approx ₹{costCalc.ratePerSqFt.toLocaleString("en-IN")} per Sq Ft
                  </span>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Stamp Duty &amp; Registration Rate (%)
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { label: "4% (Female Registry Discount)", val: 4 },
                      { label: "6% (General State Average)", val: 6 },
                      { label: "7% (Delhi / UP Male Registry)", val: 7 },
                      { label: "8% (Maharashtra / High Duty)", val: 8 },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        className={`btn btn-sm ${
                          stampDutyPercent === opt.val ? "btn-primary" : "btn-outline-secondary"
                        }`}
                        onClick={() => setStampDutyPercent(opt.val)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Cost Breakdown Box */}
              <div
                className="rounded-4 p-4 text-white shadow-sm mb-4"
                style={{ background: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)" }}
              >
                <div className="row align-items-center">
                  <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <span className="text-white-50 text-uppercase small">
                      Total Estimated Out-Of-Pocket Cost
                    </span>
                    <h2 className="display-4 fw-bold text-white mb-0">
                      ₹{costCalc.totalCost.toLocaleString("en-IN")}
                    </h2>
                    <span className="badge bg-light text-dark px-3 py-1 rounded-pill mt-2">
                      ~₹{((costCalc.totalCost) / 100000).toFixed(2)} Lakhs Total
                    </span>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="rounded-3 p-3 text-white" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)" }}>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Base Plot Cost:</span>
                        <strong>₹{costCalc.baseCost.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-white border-opacity-25 small">
                        <span>Stamp Duty ({stampDutyPercent}%):</span>
                        <strong>₹{costCalc.stampDuty.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="d-flex justify-content-between pt-1 small">
                        <span>Registration &amp; Paperwork (1%):</span>
                        <strong>₹{costCalc.registrationFee.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  title="Share Plot Details on WhatsApp"
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
                  onClick={copyResults}
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
                      <span className="text-nowrap">Copy Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Plot Sizes Reference Table */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Building className="text-primary" size={22} />
            <h3 className="h5 fw-bold mb-0">Popular Plot Sizes &amp; Dimensions in India</h3>
          </div>
          <p className="text-secondary small mb-3">
            Use this quick reference table to find standard residential plot dimensions, total square feet, and layout feasibility commonly used across Delhi-NCR, Haryana (HSVP/HUDA), UP, and Rajasthan.
          </p>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Plot Size (Gaj)</th>
                  <th className="fw-semibold">Square Feet</th>
                  <th className="fw-semibold">Common Dimensions (Front × Depth)</th>
                  <th className="fw-semibold">House Plan Feasibility</th>
                </tr>
              </thead>
              <tbody>
                {STANDARD_PLOTS.map((plot) => (
                  <tr key={plot.gaj}>
                    <td>
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                        {plot.gaj} Gaj
                      </span>
                    </td>
                    <td className="fw-bold">{plot.sqFt.toLocaleString("en-IN")} Sq. Ft.</td>
                    <td>{plot.dimensions}</td>
                    <td className="text-muted">{plot.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Educational & Practical Land Measurement Guide */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Info className="text-primary" size={22} />
            <h3 className="h5 fw-bold mb-0">How to Convert Gaj to Square Feet: Formula &amp; Rules</h3>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h4 className="h6 fw-bold text-dark">1. Mathematical Formula</h4>
              <p className="text-secondary small">
                In Indian real estate, <strong>1 Gaj (गज)</strong> is identical to <strong>1 Square Yard</strong>.
                Because 1 Yard equals 3 Linear Feet, the square area is:
              </p>
              <div className="bg-light p-3 rounded-3 border font-monospace text-primary fw-bold small mb-3">
                1 Gaj = 3 Feet × 3 Feet = 9 Square Feet
                <br />
                Total Square Feet = Area in Gaj × 9
                <br />
                Total Gaj = Area in Square Feet ÷ 9
              </div>
              <p className="text-secondary small">
                <strong>Example:</strong> For a 100 Gaj plot, the square feet area is 100 × 9 = <strong>900 Sq. Ft.</strong>
              </p>
            </div>

            <div className="col-12 col-md-6">
              <h4 className="h6 fw-bold text-dark">2. State-Wise Standards &amp; Bigha Relation</h4>
              <p className="text-secondary small">
                While Gaj to Square Feet is constant across India (always 9 Sq Ft), the number of Gaj in 1 Bigha varies significantly by state:
              </p>
              <ul className="text-secondary small ps-3 mb-0">
                <li className="mb-1.5">
                  <strong>Delhi, Haryana, Punjab:</strong> 1 Bigha = 1,000 Gaj = 9,000 Sq Ft.
                </li>
                <li className="mb-1.5">
                  <strong>Uttar Pradesh (UP) &amp; Bihar:</strong> 1 Pucca Bigha = 3,025 Gaj = 27,225 Sq Ft.
                </li>
                <li className="mb-1.5">
                  <strong>Rajasthan:</strong> 1 Pucca Bigha = 1,936 Gaj = 17,424 Sq Ft (or 27,225 Sq Ft in eastern districts).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right 4-Col Sticky Sidebar */}
    <div className="col-12 col-lg-4">
      <div className="sticky-lg-top" style={{ top: 90 }}>
        <ToolSidebar
          categorySlug="land-area"
          categoryName="Land Tools"
          currentPath="/tools/land-area/gaj-to-square-feet"
        />
      </div>
    </div>
  </div>
</div>
  )
}
