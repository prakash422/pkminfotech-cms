"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Calculator, Globe2, Smartphone, Zap, Sparkles } from "lucide-react"

export default function InteractiveHeroWidget() {
  const [activeTab, setActiveTab] = useState<"gaj" | "salary" | "signature">("gaj")

  // Gaj State
  const [gajInput, setGajInput] = useState<string>("100")
  const sqFtResult = useMemo(() => {
    const val = parseFloat(gajInput) || 0
    return Math.round(val * 9 * 100) / 100
  }, [gajInput])

  // Salary State
  const [selectedLevel, setSelectedLevel] = useState<number>(7)
  const [cityType, setCityType] = useState<"X" | "Y" | "Z">("X")
  const salaryResult = useMemo(() => {
    const basicMap: Record<number, number> = {
      1: 18000,
      2: 19900,
      4: 25500,
      7: 44900,
      8: 47600,
      10: 56100,
    }
    const basic = basicMap[selectedLevel] || 44900
    const da = Math.round((basic * 50) / 100)
    const hraRate = cityType === "X" ? 30 : cityType === "Y" ? 20 : 10
    const hra = Math.round((basic * hraRate) / 100)
    const ta = selectedLevel >= 7 ? (cityType === "X" ? 5400 : 2700) : (cityType === "X" ? 2700 : 1350)
    const gross = basic + da + hra + ta
    const nps = Math.round(((basic + da) * 10) / 100)
    const net = gross - nps - 700
    return { gross, net }
  }, [selectedLevel, cityType])

  return (
    <div className="interactive-hero-widget card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
      {/* Widget Tabs Header */}
      <div className="bg-light p-2 border-bottom d-flex gap-1.5">
        <button
          type="button"
          className={`btn btn-sm py-1.5 px-3 rounded-pill fw-semibold d-inline-flex align-items-center gap-1.5 transition ${
            activeTab === "gaj" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("gaj")}
        >
          <Globe2 size={14} />
          <span>Gaj ⇄ Sq Ft</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm py-1.5 px-3 rounded-pill fw-semibold d-inline-flex align-items-center gap-1.5 transition ${
            activeTab === "salary" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("salary")}
        >
          <Calculator size={14} />
          <span>7th Pay Salary</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm py-1.5 px-3 rounded-pill fw-semibold d-inline-flex align-items-center gap-1.5 transition ${
            activeTab === "signature" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("signature")}
        >
          <Smartphone size={14} />
          <span>10–20KB Resize</span>
        </button>
      </div>

      {/* Widget Body */}
      <div className="p-3 p-md-3.5">
        {activeTab === "gaj" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-semibold">Instant Plot Conversion</span>
              <span className="badge bg-success-subtle text-success small rounded-pill">1 Gaj = 9 Sq Ft</span>
            </div>

            <div className="row g-2 align-items-center mb-3">
              <div className="col-5">
                <label className="form-label small text-muted mb-0">Area (Gaj)</label>
                <input
                  type="number"
                  className="form-control form-control-lg fw-bold text-dark border-secondary-subtle rounded-3"
                  value={gajInput}
                  onChange={(e) => setGajInput(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="col-2 text-center text-muted fw-bold fs-5">
                =
              </div>
              <div className="col-5">
                <label className="form-label small text-muted mb-0">Square Feet</label>
                <div className="p-2 bg-light border rounded-3 fw-bold fs-5 text-primary text-center">
                  {sqFtResult.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <div className="d-flex gap-1">
                {[50, 100, 200].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="btn btn-outline-secondary btn-sm py-0.5 px-2 rounded-pill"
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => setGajInput(String(num))}
                  >
                    {num} Gaj
                  </button>
                ))}
              </div>
              <Link
                href="/tools/land-area/gaj-to-square-feet"
                className="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 fw-semibold"
              >
                <span>Full Plot Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "salary" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-semibold">7th CPC Monthly In-Hand (50% DA)</span>
              <span className="badge bg-primary-subtle text-primary small rounded-pill">Revised HRA</span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-7">
                <label className="form-label small text-muted mb-0">Pay Level / Post</label>
                <select
                  className="form-select form-select-sm border-secondary-subtle rounded-3 fw-semibold"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                >
                  <option value={7}>Level 7 (ASO / Inspector - ₹44.9k)</option>
                  <option value={8}>Level 8 (AAO Officer - ₹47.6k)</option>
                  <option value={4}>Level 4 (Tax Asst / DEO - ₹25.5k)</option>
                  <option value={2}>Level 2 (CHSL Clerk - ₹19.9k)</option>
                  <option value={1}>Level 1 (MTS / Group D - ₹18.0k)</option>
                  <option value={10}>Level 10 (Civil Services - ₹56.1k)</option>
                </select>
              </div>

              <div className="col-5">
                <label className="form-label small text-muted mb-0">City Class</label>
                <select
                  className="form-select form-select-sm border-secondary-subtle rounded-3 fw-semibold"
                  value={cityType}
                  onChange={(e) => setCityType(e.target.value as any)}
                >
                  <option value="X">X City (Delhi/Blr)</option>
                  <option value="Y">Y City (Tier 2)</option>
                  <option value="Z">Z City (Towns)</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light border mb-2">
              <span className="small text-muted">Estimated In-Hand:</span>
              <h4 className="fw-bold mb-0 text-success">
                ₹{salaryResult.net.toLocaleString("en-IN")}{" "}
                <small className="fs-6 fw-normal text-muted">/mo</small>
              </h4>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
                Gross: ₹{salaryResult.gross.toLocaleString("en-IN")}
              </span>
              <Link
                href="/tools/ssc/7th-pay-salary-calculator"
                className="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 fw-semibold"
              >
                <span>Full Breakdown</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "signature" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-semibold">Government Exam Image Specs</span>
              <span className="badge bg-success-subtle text-success small rounded-pill">100% Safe &amp; Private</span>
            </div>

            <div className="p-3 bg-light rounded-3 border mb-3">
              <div className="d-flex justify-content-between py-1 border-bottom small">
                <span className="text-secondary">SSC Signature:</span>
                <strong className="text-dark">10KB – 20KB (140×60 px)</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom small">
                <span className="text-secondary">SSC Photo:</span>
                <strong className="text-dark">20KB – 50KB (200×230 px)</strong>
              </div>
              <div className="d-flex justify-content-between pt-1 small">
                <span className="text-secondary">IBPS Thumb:</span>
                <strong className="text-dark">20KB – 50KB (240×240 px)</strong>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-1">
              <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
                Runs privately on your phone/PC
              </span>
              <Link
                href="/tools/utility/signature-resizer-10-to-20-kb"
                className="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 fw-semibold"
              >
                <span>Resize Image Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
