"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Calculator, 
  Layers, 
  LayoutGrid, 
  Maximize2, 
  Compass, 
  Expand, 
  Leaf, 
  Table2, 
  BookOpen, 
  Scale, 
  Award, 
  HelpCircle, 
  Info,
  ArrowRightLeft,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  MapPin
} from "lucide-react"
import ToolHeaderHero, { FilterChip } from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { SidebarToolItem, UsefulLinkItem } from "@/components/tools/ToolSidebar"

interface StateConfig {
  name: string
  shortName: string
  bighaToKattha: number
  bighaToSqFt: number
  bighaToBiswa: number
  note: string
  lagga: string
}

const STATE_CONFIGS: Record<string, StateConfig> = {
  bihar: {
    name: "Bihar",
    shortName: "Bihar",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Bihar, 1 Bigha is standardly 20 Kattha, and 1 Kattha equals 1,361.25 sq ft.",
    lagga: "5.5 Hath"
  },
  up_east: {
    name: "Uttar Pradesh (Eastern)",
    shortName: "UP (East)",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Eastern UP, 1 Bigha equals 20 Biswa (Kattha) which matches 27,225 sq ft.",
    lagga: "5.5 Hath"
  },
  up_west: {
    name: "Uttar Pradesh (Western)",
    shortName: "UP (West)",
    bighaToKattha: 20,
    bighaToSqFt: 27000,
    bighaToBiswa: 20,
    note: "In Western UP, 1 Bigha equals 20 Biswa (Kattha) which equals 27,000 sq ft.",
    lagga: "5.47 Hath"
  },
  west_bengal: {
    name: "West Bengal",
    shortName: "West Bengal",
    bighaToKattha: 20,
    bighaToSqFt: 14400,
    bighaToBiswa: 20,
    note: "In West Bengal, 1 Bigha equals 20 Kattha, where 1 Kattha is 720 sq ft.",
    lagga: "4.0 Hath"
  },
  jharkhand: {
    name: "Jharkhand",
    shortName: "Jharkhand",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Jharkhand, standard 1 Bigha equals 20 Kattha (27,225 sq ft).",
    lagga: "5.5 Hath"
  },
  assam: {
    name: "Assam",
    shortName: "Assam",
    bighaToKattha: 5,
    bighaToSqFt: 14400,
    bighaToBiswa: 5,
    note: "In Assam, 1 Bigha is divided into 5 Kattha, totaling 14,400 sq ft.",
    lagga: "4.0 Hath"
  },
  punjab_haryana: {
    name: "Punjab & Haryana",
    shortName: "Punjab & Haryana",
    bighaToKattha: 20,
    bighaToSqFt: 9000,
    bighaToBiswa: 20,
    note: "In Punjab & Haryana, 1 Bigha is standardly 9,000 sq ft.",
    lagga: "3.16 Hath"
  },
  rajasthan: {
    name: "Rajasthan",
    shortName: "Rajasthan",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Rajasthan, standard Pucca Bigha equals 27,225 sq ft (or 165x165 ft).",
    lagga: "5.5 Hath"
  }
}

const PRESET_VALUES = [0.5, 1, 2, 5, 10]

export default function BighaToKatthaPage({ 
  title, 
  description, 
  basePath 
}: { 
  title: string
  description: string
  basePath: string 
}) {
  const [stateKey, setStateKey] = useState<string>("bihar")
  const [fromUnit, setFromUnit] = useState<string>("bigha")
  const [toUnit, setToUnit] = useState<string>("kattha")
  const [inputValue, setInputValue] = useState<string>("1")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const resultsRef = useRef<HTMLDivElement>(null)

  const [results, setResults] = useState({
    kattha: "20",
    biswa: "20",
    sqFt: "27,225",
    sqGaj: "3,025",
    sqMeter: "2,529.29",
    acre: "0.625",
    primaryValue: "20",
    primaryUnit: "Kattha"
  })

  const currentState = STATE_CONFIGS[stateKey] || STATE_CONFIGS.bihar

  const calculateConversions = () => {
    const config = STATE_CONFIGS[stateKey] || STATE_CONFIGS.bihar
    const num = parseFloat(inputValue) || 0

    if (num <= 0) {
      setResults({
        kattha: "0",
        biswa: "0",
        sqFt: "0",
        sqGaj: "0",
        sqMeter: "0",
        acre: "0",
        primaryValue: "0",
        primaryUnit: toUnit === "all" ? "Kattha" : toUnit
      })
      return
    }

    // Convert from selected unit to base square feet
    let baseSqFt = 0
    const oneKatthaSqFt = config.bighaToSqFt / config.bighaToKattha
    const oneBiswaSqFt = config.bighaToSqFt / config.bighaToBiswa

    switch (fromUnit) {
      case "bigha":
        baseSqFt = num * config.bighaToSqFt
        break
      case "kattha":
        baseSqFt = num * oneKatthaSqFt
        break
      case "biswa":
        baseSqFt = num * oneBiswaSqFt
        break
      case "sqft":
        baseSqFt = num
        break
      case "sqgaj":
        baseSqFt = num * 9
        break
      case "acre":
        baseSqFt = num * 43560
        break
      default:
        baseSqFt = num * config.bighaToSqFt
    }

    const formatNum = (v: number) => {
      if (v >= 1000) {
        return v.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      }
      return v % 1 === 0 ? v.toString() : v.toFixed(3).replace(/\.?0+$/, "")
    }

    const katthaVal = formatNum(baseSqFt / oneKatthaSqFt)
    const biswaVal = formatNum(baseSqFt / oneBiswaSqFt)
    const sqFtVal = formatNum(baseSqFt)
    const sqGajVal = formatNum(baseSqFt / 9)
    const sqMeterVal = formatNum(baseSqFt / 10.7639)
    const acreVal = formatNum(baseSqFt / 43560)

    let primaryVal = katthaVal
    let primaryLabel = "Kattha"

    if (toUnit === "kattha") {
      primaryVal = katthaVal
      primaryLabel = "Kattha"
    } else if (toUnit === "biswa") {
      primaryVal = biswaVal
      primaryLabel = "Biswa"
    } else if (toUnit === "sqft") {
      primaryVal = sqFtVal
      primaryLabel = "Square Feet"
    } else if (toUnit === "sqgaj") {
      primaryVal = sqGajVal
      primaryLabel = "Square Gaj"
    } else if (toUnit === "acre") {
      primaryVal = acreVal
      primaryLabel = "Acres"
    } else if (toUnit === "bigha") {
      primaryVal = formatNum(baseSqFt / config.bighaToSqFt)
      primaryLabel = "Bigha"
    }

    setResults({
      kattha: katthaVal,
      biswa: biswaVal,
      sqFt: sqFtVal,
      sqGaj: sqGajVal,
      sqMeter: sqMeterVal,
      acre: acreVal,
      primaryValue: primaryVal,
      primaryUnit: primaryLabel
    })
  }

  useEffect(() => {
    calculateConversions()
  }, [stateKey, fromUnit, toUnit, inputValue])

  const handleSwapUnits = () => {
    const prevFrom = fromUnit
    const prevTo = toUnit === "all" ? "kattha" : toUnit
    setFromUnit(prevTo)
    setToUnit(prevFrom)
  }

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  const handlePresetClick = (val: number) => {
    setInputValue(val.toString())
  }

  const handleReset = () => {
    setInputValue("1")
    setFromUnit("bigha")
    setToUnit("kattha")
    setStateKey("bihar")
    setActiveFilter("all")
  }

  // Quick table reference figures
  const katthaSqFt = (currentState.bighaToSqFt / currentState.bighaToKattha).toLocaleString("en-IN")
  const biswaSqFt = (currentState.bighaToSqFt / currentState.bighaToBiswa).toLocaleString("en-IN")

  const chips: FilterChip[] = [
    {
      label: "All states",
      active: activeFilter === "all",
      onClick: () => {
        setActiveFilter("all")
        setStateKey("bihar")
        setFromUnit("bigha")
        setToUnit("kattha")
      }
    },
    {
      label: "Bihar",
      active: activeFilter === "bihar",
      onClick: () => {
        setActiveFilter("bihar")
        setStateKey("bihar")
      }
    },
    {
      label: "Uttar Pradesh",
      mobileLabel: "UP",
      active: activeFilter === "up",
      onClick: () => {
        setActiveFilter("up")
        setStateKey("up_east")
      }
    },
    {
      label: "West Bengal",
      mobileLabel: "WB",
      active: activeFilter === "wb",
      onClick: () => {
        setActiveFilter("wb")
        setStateKey("west_bengal")
      }
    },
    {
      label: "Jharkhand",
      active: activeFilter === "jharkhand",
      onClick: () => {
        setActiveFilter("jharkhand")
        setStateKey("jharkhand")
      }
    },
    {
      label: "All land tools",
      href: "/tools/land-area"
    }
  ]

  const customRelatedTools: SidebarToolItem[] = [
    {
      title: "Gaj to Square Feet",
      subtitle: "Convert Gaj to Sq Ft",
      href: "/tools/land-area/gaj-to-square-feet",
      icon: Compass,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "Square Feet to Bigha",
      subtitle: "Convert Sq Ft to Bigha",
      href: "/tools/land-area/bigha-to-square-feet-bihar",
      icon: Maximize2,
      color: "#0891b2",
      bg: "#ecfeff"
    },
    {
      title: "Bigha to Acre",
      subtitle: "Convert Bigha to Acre",
      href: "/tools/land-area/bigha-to-kattha-up",
      icon: Leaf,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "Kattha to Decimal",
      subtitle: "Convert Kattha to Decimal",
      href: "/tools/land-area/bigha-to-kattha-west-bengal",
      icon: Scale,
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
    {
      title: "Decimal to Bigha",
      subtitle: "Convert Decimal to Bigha",
      href: "/tools/land-area/bigha-to-square-feet-bihar",
      icon: Layers,
      color: "#2563eb",
      bg: "#eff6ff"
    }
  ]

  const usefulLinks: UsefulLinkItem[] = [
    { label: "Land Measurement Units in India", href: "#origin" },
    { label: "State-wise Bigha Conversion", href: "#regional-table" },
    { label: "Bigha vs Kattha vs Decimal", href: "#mathematics" },
    { label: "Frequently Asked Questions", href: "#faqs" }
  ]

  return (
    <div className="bigha-to-kattha-page">
      {/* 1. Header (No breadcrumbs, no decorative image, tool-focused) */}
      <ToolHeaderHero
        title={title || "Bigha to Kattha Converter"}
        description={description || "Convert regional land units like Bigha, Kattha, Biswa, and Gaj to Square Feet and Acre with state-wise standards."}
        chips={chips}
        badgeText="State-wise Land Units · Instant"
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Column Zone */}
        <div className="col-12 col-lg-8">

          {/* MAIN INTERACTIVE CALCULATOR CONSOLE */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white tool-console-card">
            
            {/* Console Control Topbar */}
            <div className="p-2.5 p-md-3 px-md-3.5 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
              <div 
                className="d-flex align-items-center gap-2 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 28, height: 28, backgroundColor: "#eff6ff" }}
                >
                  <MapPin size={15} className="text-primary" />
                </div>
                <span className="small fw-bold text-dark flex-shrink-0">State Standard:</span>
                <select
                  id="stateSelect"
                  className="form-select form-select-sm border rounded-pill py-1 px-3 fw-bold text-primary bg-white flex-shrink-0"
                  value={stateKey}
                  onChange={(e) => {
                    setStateKey(e.target.value)
                    setActiveFilter(e.target.value === "bihar" ? "bihar" : e.target.value.includes("up") ? "up" : e.target.value === "west_bengal" ? "wb" : e.target.value === "jharkhand" ? "jharkhand" : "custom")
                  }}
                  style={{ width: "auto", fontSize: "0.825rem", borderColor: "#93c5fd" }}
                >
                  {Object.entries(STATE_CONFIGS).map(([key, config]) => (
                    <option key={key} value={key}>{config.name} ({config.bighaToKattha} Kattha = {config.bighaToSqFt.toLocaleString("en-IN")} sq ft)</option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold">
                  Lagga: {currentState.lagga}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2.5 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.75rem" }}
                  title="Reset to defaults"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* DUAL INTERACTIVE CONVERTER ENGINE */}
            <div className="p-3.5 p-md-4">
              <div className="row g-3 align-items-center mb-3">
                
                {/* FROM BOX */}
                <div className="col-12 col-md-5">
                  <div className="p-3 rounded-4 border bg-white converter-input-box">
                    <div className="d-flex align-items-center justify-content-between mb-1.5">
                      <span className="small fw-bold text-secondary text-uppercase tracking-wide" style={{ fontSize: "0.72rem" }}>
                        You Convert
                      </span>
                      <span className="badge bg-light text-secondary rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                        Input Value
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <input
                        id="bighaInput"
                        type="number"
                        step="any"
                        min="0"
                        inputMode="decimal"
                        className="form-control border-0 p-0 fw-bolder text-dark converter-huge-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="0"
                        style={{ fontSize: "1.85rem", boxShadow: "none", backgroundColor: "transparent" }}
                      />
                      <select
                        id="fromUnitSelect"
                        className="form-select border rounded-3 py-1.5 px-2.5 fw-bold text-dark bg-light"
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        style={{ width: "auto", fontSize: "0.85rem", borderColor: "#cbd5e1" }}
                      >
                        <option value="bigha">Bigha</option>
                        <option value="kattha">Kattha</option>
                        <option value="biswa">Biswa</option>
                        <option value="sqgaj">Gaj (Yards)</option>
                        <option value="sqft">Sq Feet</option>
                        <option value="acre">Acre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SWAP BUTTON */}
                <div className="col-12 col-md-2 text-center py-1 py-md-0">
                  <button
                    type="button"
                    onClick={handleSwapUnits}
                    className="btn btn-primary rounded-circle p-2.5 shadow-sm converter-swap-btn"
                    title="Swap Units"
                    style={{ width: 44, height: 44 }}
                  >
                    <ArrowRightLeft size={18} />
                  </button>
                </div>

                {/* TO / PRIMARY RESULT BOX */}
                <div className="col-12 col-md-5">
                  <div className="p-3 rounded-4 border converter-result-box" style={{ backgroundColor: "#f0f7ff", borderColor: "#bfdbfe" }}>
                    <div className="d-flex align-items-center justify-content-between mb-1.5">
                      <span className="small fw-bold text-primary text-uppercase tracking-wide" style={{ fontSize: "0.72rem" }}>
                        Converted Output
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${inputValue} ${fromUnit} = ${results.primaryValue} ${results.primaryUnit} (${currentState.name} Standard)`, "primary")}
                        className="btn btn-sm p-0 text-primary d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "0.72rem" }}
                        title="Copy converted value"
                      >
                        {copiedKey === "primary" ? (
                          <>
                            <Check size={12} className="text-success" />
                            <span className="text-success fw-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="fw-bolder text-primary text-truncate converter-huge-result" style={{ fontSize: "1.85rem", lineHeight: 1.1 }}>
                        {results.primaryValue}
                      </div>
                      <select
                        id="toUnitSelect"
                        className="form-select border rounded-3 py-1.5 px-2.5 fw-bold text-primary bg-white"
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        style={{ width: "auto", fontSize: "0.85rem", borderColor: "#93c5fd" }}
                      >
                        <option value="kattha">Kattha</option>
                        <option value="biswa">Biswa</option>
                        <option value="sqft">Square Feet</option>
                        <option value="sqgaj">Square Gaj</option>
                        <option value="acre">Acres</option>
                        <option value="bigha">Bigha</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* QUICK ONE-CLICK PRESET BUTTONS */}
              <div 
                className="d-flex align-items-center gap-1.5 pt-1 pb-3 border-bottom overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                <span className="small text-secondary me-1 fw-semibold flex-shrink-0" style={{ fontSize: "0.75rem" }}>
                  Quick Value:
                </span>
                {PRESET_VALUES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`btn btn-sm rounded-pill py-0.5 px-2.5 fw-semibold flex-shrink-0 ${inputValue === preset.toString() ? "btn-primary text-white" : "btn-light border"}`}
                    style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  >
                    {preset} {fromUnit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setInputValue((prev) => (Math.max(0, (parseFloat(prev) || 0) + 1)).toString())}
                  className="btn btn-sm btn-light border rounded-pill py-0.5 px-2.5 fw-bold flex-shrink-0"
                  style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  title="Add 1"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setInputValue((prev) => (Math.max(0, (parseFloat(prev) || 0) - 1)).toString())}
                  className="btn btn-sm btn-light border rounded-pill py-0.5 px-2.5 fw-bold flex-shrink-0"
                  style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  title="Minus 1"
                >
                  -1
                </button>
              </div>

              {/* LIVE MULTI-UNIT DASHBOARD GRID (ALL 6 UNITS) */}
              <div className="pt-3 mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2.5">
                  <div className="d-flex align-items-center gap-1.5">
                    <Sparkles size={15} className="text-primary" />
                    <span className="small fw-bold text-dark text-uppercase tracking-wider" style={{ fontSize: "0.78rem" }}>
                      Equivalent Real Estate Units in {currentState.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`Land Conversion (${inputValue} ${fromUnit} in ${currentState.name}):\n• Kattha: ${results.kattha}\n• Biswa: ${results.biswa}\n• Sq Ft: ${results.sqFt}\n• Sq Gaj: ${results.sqGaj}\n• Sq Meter: ${results.sqMeter}\n• Acres: ${results.acre}`, "all")}
                    className="btn btn-sm btn-outline-primary rounded-pill py-0.5 px-2.5 d-inline-flex align-items-center gap-1"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {copiedKey === "all" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    <span>{copiedKey === "all" ? "All Copied!" : "Copy Summary"}</span>
                  </button>
                </div>

                <div className="row g-2.5">
                  {/* Kattha */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Kattha</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#eff6ff" }}>
                          <Layers size={13} style={{ color: "#2563eb" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.kattha}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>kattha</div>
                    </div>
                  </div>

                  {/* Biswa */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Biswa</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#ecfdf5" }}>
                          <LayoutGrid size={13} style={{ color: "#059669" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.biswa}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>biswa</div>
                    </div>
                  </div>

                  {/* Square Feet */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Square Feet</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#fff7ed" }}>
                          <Maximize2 size={13} style={{ color: "#ea580c" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.sqFt}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>sq ft</div>
                    </div>
                  </div>

                  {/* Square Gaj */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Square Gaj (Yards)</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#f5f3ff" }}>
                          <Compass size={13} style={{ color: "#7c3aed" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.sqGaj}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>sq gaj</div>
                    </div>
                  </div>

                  {/* Square Meters */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Square Meters</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#fdf2f8" }}>
                          <Expand size={13} style={{ color: "#db2777" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.sqMeter}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>sq m</div>
                    </div>
                  </div>

                  {/* Acres */}
                  <div className="col-6 col-md-4">
                    <div className="p-2.5 rounded-3 border bg-white dashboard-tile">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Acres</span>
                        <div className="rounded-2 p-1" style={{ backgroundColor: "#f0fdf4" }}>
                          <Leaf size={13} style={{ color: "#16a34a" }} />
                        </div>
                      </div>
                      <div className="fw-bolder text-dark text-truncate" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {results.acre}
                      </div>
                      <div className="text-secondary small" style={{ fontSize: "0.68rem" }}>acres</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* State Formula Notice Callout */}
              <div className="rounded-3 p-2.5 d-flex align-items-start gap-2 bg-light border" style={{ fontSize: "0.785rem", lineHeight: 1.4 }}>
                <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary">
                  <strong>{currentState.name} Standard:</strong> {currentState.note} (Lagga: {currentState.lagga}). Conversions are instant and computed directly in your browser.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Conversion Reference Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white quick-table-card">
            <div className="px-3.5 py-3 border-bottom d-flex align-items-center justify-content-between bg-light-subtle">
              <div className="d-flex align-items-center gap-2">
                <Table2 size={17} className="text-primary" />
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
                  Quick Conversion Reference ({currentState.shortName} Standard)
                </h3>
              </div>
              <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-0.5" style={{ fontSize: "0.7rem" }}>
                1 Bigha Standard
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered mb-0 text-center quick-ref-table">
                <thead className="table-light">
                  <tr>
                    <th className="py-2.5 fw-semibold text-secondary" style={{ fontSize: "0.8125rem", width: "25%" }}>1 Bigha</th>
                    <th className="py-2.5 fw-semibold text-secondary" style={{ fontSize: "0.8125rem", width: "25%" }}>1 Kattha</th>
                    <th className="py-2.5 fw-semibold text-secondary" style={{ fontSize: "0.8125rem", width: "25%" }}>1 Biswa</th>
                    <th className="py-2.5 fw-semibold text-secondary" style={{ fontSize: "0.8125rem", width: "25%" }}>1 Gaj (Sq Yard)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 fw-bold text-dark" style={{ fontSize: "0.925rem" }}>{currentState.bighaToKattha} Kattha</td>
                    <td className="py-3 fw-bold text-dark" style={{ fontSize: "0.925rem" }}>{katthaSqFt} sq ft</td>
                    <td className="py-3 fw-bold text-dark" style={{ fontSize: "0.925rem" }}>{biswaSqFt} sq ft</td>
                    <td className="py-3 fw-bold text-dark" style={{ fontSize: "0.925rem" }}>9 sq ft</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Editorial Guide Article & FAQs (Placed below tool for SEO) */}
          <section className="guide-editorial-section pt-2" id="origin">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.75rem" }}>
                <BookOpen size={13} />
                <span>STATE REVENUE GUIDE</span>
              </span>
            </div>

            <h2 className="h4 fw-bold text-dark mb-1" style={{ fontSize: "1.35rem", letterSpacing: "-0.015em" }}>
              The Ultimate Guide to Bigha &amp; Kattha Conversion in Indian Real Estate
            </h2>
            <p className="text-secondary small mb-4" style={{ fontSize: "0.875rem" }}>
              Deep historical analysis, state-wise calculations, and mathematical formulations.
            </p>

            <div className="guide-content-body text-secondary" style={{ fontSize: "0.9125rem", lineHeight: 1.75 }}>
              <p>
                If you are buying agricultural land, checking ancestry registry maps (Khesra/Khata books), or dealing with local property transactions in Northern, Eastern, and Western India, you will immediately face traditional units like <strong>Bigha</strong>, <strong>Kattha</strong>, and <strong>Biswa</strong>. Understanding these units is challenging because a Bigha in Bihar is completely different from a Bigha in Uttar Pradesh or West Bengal.
              </p>

              <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2" id="mathematics">
                <Scale size={17} className="text-primary" />
                1. The Origin of Bigha and Kattha: A Historical Legacy
              </h3>
              <p>
                The concept of Bigha dates back to pre-colonial India. During Emperor Akbar&apos;s Mughal administration, his finance minister, <strong>Raja Todar Mal</strong>, revolutionized revenue collection by introducing a standard measurement rod called the <strong>Jarib</strong> (made of bamboo joined by iron rings) and the <strong>Lagga</strong> (measurement pole).
              </p>
              <p>
                Historically, 1 Bigha represented the area of land that could be cultivated by a single farmer with a pair of bullocks in a single day. As local administration and nawab rules evolved across different princely states, the physical length of the local Lagga varied. Since a Bigha and its sub-divisions (Kattha, Biswa, Dhur) are direct mathematical squares of the local Lagga size, the absolute size of 1 Bigha varied between districts.
              </p>

              <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2">
                <Calculator size={17} className="text-primary" />
                2. Mathematical Formulations: How Lagga Determines Square Feet
              </h3>
              <p>
                To understand the calculations used in Bihar, Jharkhand, and Uttar Pradesh, you must understand the <strong>Lagga</strong> (measured in cubits or <em>Hath</em>, where 1 Hath is roughly 1.5 feet or 18 inches):
              </p>
              <div className="p-3 rounded-3 bg-light border font-monospace small mb-3">
                • 1 Hath = 1.5 feet (18 inches) <br />
                • Standard Lagga = 5.5 Hath = 5.5 × 1.5 = 8.25 feet <br />
                • 1 Dhur = (8.25)² = 68.0625 sq ft <br />
                • 1 Kattha = 20 Dhur = 20 × 68.0625 = 1,361.25 sq ft <br />
                • 1 Bigha = 20 Kattha = 20 × 1,361.25 = 27,225 sq ft
              </div>

              <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2" id="regional-table">
                <Award size={17} className="text-primary" />
                3. Regional Classification Table: How Indian States Compare
              </h3>
              <div className="table-responsive my-3">
                <table className="table table-bordered table-striped small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">State / Region</th>
                      <th className="fw-semibold">Standard Lagga</th>
                      <th className="fw-semibold">1 Bigha (Sq Ft)</th>
                      <th className="fw-semibold">1 Bigha in Kattha/Biswa</th>
                      <th className="fw-semibold">1 Kattha (Sq Ft)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Bihar</strong></td>
                      <td>5.5 Hath</td>
                      <td>27,225 sq ft</td>
                      <td>20 Kattha</td>
                      <td>1,361.25 sq ft</td>
                    </tr>
                    <tr>
                      <td><strong>UP (East)</strong></td>
                      <td>5.5 Hath</td>
                      <td>27,225 sq ft</td>
                      <td>20 Biswa</td>
                      <td>1,361.25 sq ft</td>
                    </tr>
                    <tr>
                      <td><strong>UP (West)</strong></td>
                      <td>5.47 Hath</td>
                      <td>27,000 sq ft</td>
                      <td>20 Biswa</td>
                      <td>1,350 sq ft</td>
                    </tr>
                    <tr>
                      <td><strong>West Bengal</strong></td>
                      <td>4.0 Hath</td>
                      <td>14,400 sq ft</td>
                      <td>20 Kattha</td>
                      <td>720 sq ft</td>
                    </tr>
                    <tr>
                      <td><strong>Assam</strong></td>
                      <td>4.0 Hath</td>
                      <td>14,400 sq ft</td>
                      <td>5 Kattha</td>
                      <td>2,880 sq ft</td>
                    </tr>
                    <tr>
                      <td><strong>Punjab &amp; Haryana</strong></td>
                      <td>3.16 Hath</td>
                      <td>9,000 sq ft</td>
                      <td>20 Biswa</td>
                      <td>450 sq ft</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2" id="faqs">
                <HelpCircle size={17} className="text-primary" />
                4. Frequently Asked Questions
              </h3>
              <div className="accordion accordion-flush mt-2" id="bighaFaqAccordion">
                <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                  <h4 className="accordion-header">
                    <button 
                      className="accordion-button collapsed py-2.5 px-3 fw-semibold text-dark small" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq1"
                    >
                      How many Kattha make 1 Bigha in Bihar?
                    </button>
                  </h4>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#bighaFaqAccordion">
                    <div className="accordion-body py-2 px-3 small text-secondary">
                      In Bihar, exactly 20 Kattha make 1 Bigha. With 1 Kattha measuring 1,361.25 sq ft under standard 5.5 Hath Lagga, 1 Bigha equals 27,225 sq ft (equivalent to 0.625 Acres).
                    </div>
                  </div>
                </div>

                <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                  <h4 className="accordion-header">
                    <button 
                      className="accordion-button collapsed py-2.5 px-3 fw-semibold text-dark small" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq2"
                    >
                      What is the difference between Pucca Bigha and Kaccha Bigha?
                    </button>
                  </h4>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#bighaFaqAccordion">
                    <div className="accordion-body py-2 px-3 small text-secondary">
                      Pucca Bigha is the state-registered standard unit (usually 27,225 or 27,000 sq ft in UP/Rajasthan). Kaccha Bigha is an informal village tenant-farming measurement, typically equal to one-third (1/3rd) of a Pucca Bigha (~9,075 sq ft).
                    </div>
                  </div>
                </div>

                <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                  <h4 className="accordion-header">
                    <button 
                      className="accordion-button collapsed py-2.5 px-3 fw-semibold text-dark small" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq3"
                    >
                      How many Gaj are in 1 Bigha?
                    </button>
                  </h4>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#bighaFaqAccordion">
                    <div className="accordion-body py-2 px-3 small text-secondary">
                      Since 1 Gaj (Square Yard) equals 9 square feet, dividing 27,225 sq ft by 9 gives exactly 3,025 Square Gaj per Bigha in Bihar and Eastern Uttar Pradesh.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right 4-Column Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="land-area"
              categoryName="Land Tools"
              currentPath="/tools/land-area/bigha-to-kattha"
              customRelatedTools={customRelatedTools}
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .tool-console-card {
          border: 1px solid #dbeafe !important;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.06) !important;
        }
        .converter-input-box {
          border-color: #cbd5e1 !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .converter-input-box:focus-within {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .converter-huge-input:focus {
          outline: none;
        }
        .converter-swap-btn {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
          transition: transform 0.2s ease, background-color 0.15s ease;
        }
        .converter-swap-btn:hover {
          background-color: #1d4ed8 !important;
          transform: rotate(180deg);
        }
        .dashboard-tile {
          border-color: #eef2f6 !important;
          transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
        }
        .dashboard-tile:hover {
          border-color: #93c5fd !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }
        .quick-table-card {
          border: 1px solid #eef2f6 !important;
        }
        .quick-ref-table th {
          background-color: #f8fafc !important;
          border-color: #e2e8f0;
        }
        .quick-ref-table td {
          border-color: #e2e8f0;
        }
      `}</style>
    </div>
  )
}
