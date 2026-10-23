"use client"

import React, { useEffect, useState } from "react"
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
  HelpCircle, 
  Info,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  MapPin
} from "lucide-react"
import ToolHeaderHero, { FilterChip } from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { SidebarToolItem, UsefulLinkItem } from "@/components/tools/ToolSidebar"
import { LAND_STATE_PAGES, type LandStateKey } from "@/data/land-state-pages"

interface StateConfig {
  name: string
  shortName: string
  bighaToKattha: number
  bighaToSqFt: number
  bighaToBiswa: number
  note: string
  lagga: string
}

const STATE_CONFIGS: Record<LandStateKey, StateConfig> = {
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
    name: "Eastern Uttar Pradesh",
    shortName: "UP (East)",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Eastern UP, 1 Bigha equals 20 Biswa (Kattha) ≈ 27,225 sq ft.",
    lagga: "5.5 Hath"
  },
  up_west: {
    name: "Western Uttar Pradesh",
    shortName: "UP (West)",
    bighaToKattha: 20,
    bighaToSqFt: 27000,
    bighaToBiswa: 20,
    note: "In Western UP, 1 Bigha equals 20 Biswa ≈ 27,000 sq ft.",
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
}

const CLUSTER_CHIPS: FilterChip[] = [
  { label: "All states", href: "/tools/land-area/bigha-to-kattha" },
  { label: "Bihar", href: "/tools/land-area/bigha-to-square-feet-bihar" },
  { label: "Uttar Pradesh", mobileLabel: "UP", href: "/tools/land-area/bigha-to-kattha-up" },
  { label: "West Bengal", mobileLabel: "WB", href: "/tools/land-area/bigha-to-kattha-west-bengal" },
  { label: "All land tools", href: "/tools/land-area" },
]

const PRESET_VALUES = [0.5, 1, 2, 5, 10]

export default function StateLandConverterPage({
  title,
  description,
  basePath,
  pageKey,
}: {
  title: string
  description: string
  basePath: string
  pageKey: string
}) {
  const page = LAND_STATE_PAGES[pageKey]
  const initialState = page?.stateKey ?? "bihar"
  const allowed = page?.allowedStates ?? [initialState]

  const [stateKey, setStateKey] = useState<LandStateKey>(initialState)
  const [bighaInput, setBighaInput] = useState("1")
  const [targetUnit, setTargetUnit] = useState<"kattha" | "biswa" | "sqft" | "sqgaj" | "acre">("kattha")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const [results, setResults] = useState({
    kattha: "20",
    biswa: "20",
    sqFt: "27,225",
    sqGaj: "3,025",
    sqMeter: "2,529.28",
    acre: "0.625",
    primaryValue: "20",
    primaryLabel: "Kattha"
  })

  useEffect(() => {
    const config = STATE_CONFIGS[stateKey]
    const bigha = parseFloat(bighaInput) || 0
    if (bigha <= 0) {
      setResults({
        kattha: "0",
        biswa: "0",
        sqFt: "0",
        sqGaj: "0",
        sqMeter: "0",
        acre: "0",
        primaryValue: "0",
        primaryLabel: targetUnit === "kattha" ? "Kattha" : targetUnit === "biswa" ? "Biswa" : targetUnit === "sqft" ? "Square Feet" : targetUnit === "sqgaj" ? "Square Gaj" : "Acres"
      })
      return
    }
    const sqFt = bigha * config.bighaToSqFt
    const formatNum = (v: number) => {
      if (v >= 1000) return v.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      return v % 1 === 0 ? v.toString() : v.toFixed(3).replace(/\.?0+$/, "")
    }

    const katthaVal = formatNum(bigha * config.bighaToKattha)
    const biswaVal = formatNum(bigha * config.bighaToBiswa)
    const sqFtVal = formatNum(sqFt)
    const sqGajVal = formatNum(sqFt / 9)
    const sqMeterVal = formatNum(sqFt / 10.7639)
    const acreVal = formatNum(sqFt / 43560)

    let primaryVal = katthaVal
    let primaryLbl = "Kattha"

    if (targetUnit === "kattha") {
      primaryVal = katthaVal
      primaryLbl = "Kattha"
    } else if (targetUnit === "biswa") {
      primaryVal = biswaVal
      primaryLbl = "Biswa"
    } else if (targetUnit === "sqft") {
      primaryVal = sqFtVal
      primaryLbl = "Square Feet"
    } else if (targetUnit === "sqgaj") {
      primaryVal = sqGajVal
      primaryLbl = "Square Gaj"
    } else if (targetUnit === "acre") {
      primaryVal = acreVal
      primaryLbl = "Acres"
    }

    setResults({
      kattha: katthaVal,
      biswa: biswaVal,
      sqFt: sqFtVal,
      sqGaj: sqGajVal,
      sqMeter: sqMeterVal,
      acre: acreVal,
      primaryValue: primaryVal,
      primaryLabel: primaryLbl
    })
  }, [stateKey, bighaInput, targetUnit])

  if (!page) {
    return (
      <div className="alert alert-warning">
        Land page config missing. <Link href="/tools/land-area/bigha-to-kattha">Open main converter</Link>
      </div>
    )
  }

  const currentState = STATE_CONFIGS[stateKey]
  const katthaSqFt = (currentState.bighaToSqFt / currentState.bighaToKattha).toLocaleString("en-IN")
  const biswaSqFt = (currentState.bighaToSqFt / currentState.bighaToBiswa).toLocaleString("en-IN")

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  const chipsWithActive = CLUSTER_CHIPS.map(c => ({
    ...c,
    active: title.toLowerCase().includes(c.label.toLowerCase()) || 
            (c.label === "Bihar" && pageKey.includes("bihar")) ||
            (c.label === "Uttar Pradesh" && pageKey.includes("up")) ||
            (c.label === "West Bengal" && pageKey.includes("west-bengal"))
  }))

  const usefulLinks: UsefulLinkItem[] = [
    { label: `${currentState.name} Land Revenue Standards`, href: "#state-guide" },
    { label: "Regional Calculation Table", href: "#table" },
    { label: "Local Real Estate Practices", href: "#practice" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="state-land-converter-page">
      {/* 1. Tool Header Hero */}
      <ToolHeaderHero
        title={title}
        description={description || page.intro}
        chips={chipsWithActive}
        badgeText={`${currentState.name} Land Standard · Official`}
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">

          {/* MAIN INTERACTIVE CALCULATOR CONSOLE */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white tool-console-card">
            
            {/* Console Control Topbar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
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
                <span className="small fw-bold text-dark flex-shrink-0">Region:</span>
                {allowed.length > 1 ? (
                  <select
                    id="stateSelect"
                    className="form-select form-select-sm border rounded-pill py-1 px-3 fw-bold text-primary bg-white flex-shrink-0"
                    value={stateKey}
                    onChange={(e) => setStateKey(e.target.value as LandStateKey)}
                    style={{ width: "auto", fontSize: "0.825rem", borderColor: "#93c5fd" }}
                  >
                    {allowed.map((key) => (
                      <option key={key} value={key}>
                        {STATE_CONFIGS[key].name} ({STATE_CONFIGS[key].bighaToKattha} Kattha = {STATE_CONFIGS[key].bighaToSqFt.toLocaleString("en-IN")} sq ft)
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="fw-bold text-primary small flex-shrink-0">
                    {currentState.name} ({currentState.bighaToKattha} Kattha / Biswa)
                  </span>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold">
                  Lagga: {currentState.lagga}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBighaInput("1")
                    setTargetUnit("kattha")
                  }}
                  className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2.5 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.75rem" }}
                  title="Reset to 1 Bigha"
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
                        Enter Value
                      </span>
                      <span className="badge bg-light text-secondary rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                        Bigha
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
                        value={bighaInput}
                        onChange={(e) => setBighaInput(e.target.value)}
                        placeholder="0"
                        style={{ fontSize: "1.85rem", boxShadow: "none", backgroundColor: "transparent" }}
                      />
                      <span className="badge bg-primary text-white rounded-3 px-3 py-2 fw-bold" style={{ fontSize: "0.85rem" }}>
                        Bigha
                      </span>
                    </div>
                  </div>
                </div>

                {/* SWAP / ARROW ICON */}
                <div className="col-12 col-md-2 text-center py-1 py-md-0">
                  <div className="btn btn-primary rounded-circle p-2.5 shadow-sm converter-swap-btn" style={{ width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRightLeft size={18} />
                  </div>
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
                        onClick={() => handleCopy(`${bighaInput} Bigha = ${results.primaryValue} ${results.primaryLabel} in ${currentState.name}`, "primary")}
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
                        id="targetUnitSelect"
                        className="form-select border rounded-3 py-1.5 px-2.5 fw-bold text-primary bg-white"
                        value={targetUnit}
                        onChange={(e) => setTargetUnit(e.target.value as any)}
                        style={{ width: "auto", fontSize: "0.85rem", borderColor: "#93c5fd" }}
                      >
                        <option value="kattha">Kattha</option>
                        <option value="biswa">Biswa</option>
                        <option value="sqft">Square Feet</option>
                        <option value="sqgaj">Square Gaj</option>
                        <option value="acre">Acres</option>
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
                    onClick={() => setBighaInput(preset.toString())}
                    className={`btn btn-sm rounded-pill py-0.5 px-2.5 fw-semibold flex-shrink-0 ${bighaInput === preset.toString() ? "btn-primary text-white" : "btn-light border"}`}
                    style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  >
                    {preset} Bigha
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBighaInput((prev) => (Math.max(0, (parseFloat(prev) || 0) + 1)).toString())}
                  className="btn btn-sm btn-light border rounded-pill py-0.5 px-2.5 fw-bold flex-shrink-0"
                  style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  title="Add 1"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setBighaInput((prev) => (Math.max(0, (parseFloat(prev) || 0) - 1)).toString())}
                  className="btn btn-sm btn-light border rounded-pill py-0.5 px-2.5 fw-bold flex-shrink-0"
                  style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  title="Minus 1"
                >
                  -1
                </button>
              </div>

              {/* LIVE MULTI-UNIT DASHBOARD GRID */}
              <div className="pt-3 mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2.5">
                  <div className="d-flex align-items-center gap-1.5">
                    <Sparkles size={15} className="text-primary" />
                    <span className="small fw-bold text-dark text-uppercase tracking-wider" style={{ fontSize: "0.78rem" }}>
                      Equivalent Units in {currentState.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`Land Conversion (${bighaInput} Bigha in ${currentState.name}):\n• Kattha: ${results.kattha}\n• Biswa: ${results.biswa}\n• Sq Ft: ${results.sqFt}\n• Sq Gaj: ${results.sqGaj}\n• Sq Meter: ${results.sqMeter}\n• Acres: ${results.acre}`, "all")}
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
                        <span className="small text-secondary text-truncate" style={{ fontSize: "0.72rem" }}>Square Gaj</span>
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
                  <strong>{currentState.name} Standard:</strong> {currentState.note} (Lagga: {currentState.lagga}). Computed directly in your browser.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Conversion Reference Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white" style={{ border: "1px solid #eef2f6" }} id="table">
            <div className="px-3.5 py-3 border-bottom d-flex align-items-center justify-content-between bg-light-subtle">
              <div className="d-flex align-items-center gap-2">
                <Table2 size={17} className="text-primary" />
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
                  Quick Reference ({currentState.shortName} Standard)
                </h3>
              </div>
              <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-0.5" style={{ fontSize: "0.7rem" }}>
                1 Bigha Standard
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered mb-0 text-center">
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

          {/* Guide & History */}
          <section className="guide-editorial-section pt-2" id="state-guide">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.75rem" }}>
                <BookOpen size={13} />
                <span>STATE GUIDE</span>
              </span>
            </div>

            <h2 className="h4 fw-bold text-dark mb-3" style={{ fontSize: "1.35rem" }}>
              {page.historyTitle}
            </h2>
            <div
              className="text-secondary small lh-lg mb-4"
              dangerouslySetInnerHTML={{ __html: page.historyHtml }}
              style={{ fontSize: "0.9125rem", lineHeight: 1.75 }}
            />

            <h3 className="h5 fw-bold text-dark mt-4 mb-3" id="practice">
              {page.practiceTitle}
            </h3>
            <div
              className="text-secondary small lh-lg mb-4"
              dangerouslySetInnerHTML={{ __html: page.practiceHtml }}
              style={{ fontSize: "0.9125rem", lineHeight: 1.75 }}
            />

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2" id="faq">
              <HelpCircle size={17} className="text-primary" /> FAQ — {page.h1Suffix}
            </h3>
            <div className="accordion accordion-flush mt-2 mb-4" id="stateFaqAccordion">
              {page.faq.map((item, idx) => (
                <div className="accordion-item border rounded-3 mb-2 overflow-hidden" key={idx}>
                  <h4 className="accordion-header">
                    <button
                      className="accordion-button collapsed py-2.5 px-3 fw-semibold text-dark small"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#stateFaq${idx}`}
                    >
                      {item.q}
                    </button>
                  </h4>
                  <div id={`stateFaq${idx}`} className="accordion-collapse collapse" data-bs-parent="#stateFaqAccordion">
                    <div className="accordion-body py-2 px-3 small text-secondary">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="land-area"
              categoryName="Land Tools"
              currentPath={`/tools/land-area/${pageKey}`}
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
        .dashboard-tile {
          border-color: #eef2f6 !important;
          transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
        }
        .dashboard-tile:hover {
          border-color: #93c5fd !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }
      `}</style>
    </div>
  )
}
