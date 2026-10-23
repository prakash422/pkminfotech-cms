"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Receipt, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Percent, 
  Landmark, 
  ShieldCheck, 
  HelpCircle,
  SlidersHorizontal,
  CreditCard
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

export default function GstCalculatorPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [amountInput, setAmountInput] = useState<string>("1000")
  const [gstRate, setGstRate] = useState<number>(18)
  const [isInclusive, setIsInclusive] = useState<boolean>(false) // false = Exclusive, true = Inclusive
  const [copied, setCopied] = useState<boolean>(false)

  const stats = useMemo(() => {
    const amount = parseFloat(amountInput) || 0
    const rate = gstRate

    if (amount <= 0 || rate < 0) {
      return {
        netAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        cgst: 0,
        sgst: 0,
      }
    }

    if (!isInclusive) {
      // Exclusive: Add GST
      const calculatedGst = amount * (rate / 100)
      const calculatedTotal = amount + calculatedGst
      return {
        netAmount: amount,
        gstAmount: calculatedGst,
        totalAmount: calculatedTotal,
        cgst: calculatedGst / 2,
        sgst: calculatedGst / 2,
      }
    } else {
      // Inclusive: Extract GST
      const calculatedNet = amount / (1 + rate / 100)
      const calculatedGst = amount - calculatedNet
      return {
        netAmount: calculatedNet,
        gstAmount: calculatedGst,
        totalAmount: amount,
        cgst: calculatedGst / 2,
        sgst: calculatedGst / 2,
      }
    }
  }, [amountInput, gstRate, isInclusive])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val)
  }

  const handleReset = () => {
    setAmountInput("1000")
    setGstRate(18)
    setIsInclusive(false)
  }

  const handleCopySummary = () => {
    const text = `🧾 *GST Calculation Breakdown:*
• Tax Mode: ${isInclusive ? "GST Inclusive (Tax Extracted)" : "GST Exclusive (Tax Added)"}
• GST Rate: ${gstRate}%
• Base / Net Price: ${formatCurrency(stats.netAmount)}
• Total GST Amount: ${formatCurrency(stats.gstAmount)} (CGST: ${formatCurrency(stats.cgst)} | SGST: ${formatCurrency(stats.sgst)})
• Final Transaction Value: ${formatCurrency(stats.totalAmount)}
Calculated via: https://www.pkminfotech.com/tools/utility/gst-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const amountPresets = [500, 1000, 2500, 5000, 10000, 50000]

  const usefulLinks: UsefulLinkItem[] = [
    { label: "GST Formula & Math Explained", href: "#gst-math" },
    { label: "Intra vs Inter-State CGST/SGST/IGST", href: "#tax-split" },
    { label: "Official Indian GST Slabs Table", href: "#gst-slabs" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="gst-calculator-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="Official GST Slabs (5%, 12%, 18%, 28%)"
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
                <button
                  type="button"
                  onClick={() => setIsInclusive(false)}
                  className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
                    !isInclusive ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                  }`}
                  style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                >
                  <CreditCard size={14} />
                  <span>Add GST (Exclusive)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInclusive(true)}
                  className={`btn btn-sm fw-semibold px-2.5 px-sm-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
                    isInclusive ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                  }`}
                  style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                >
                  <Receipt size={14} />
                  <span>Remove GST (Inclusive)</span>
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
                    {/* Amount Input */}
                    <div className="mb-3.5">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="amountInput" className="form-label small fw-bold text-dark mb-0">
                          {isInclusive ? "Total Amount (Inclusive of GST)" : "Net Amount (Exclusive of GST)"}
                        </label>
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2 py-0.5" style={{ fontSize: "0.75rem" }}>
                          INR (₹)
                        </span>
                      </div>
                      <div className="input-group input-group-lg rounded-3 overflow-hidden border border-secondary-subtle">
                        <span className="input-group-text bg-light text-dark fw-bold border-0 px-3">
                          ₹
                        </span>
                        <input
                          id="amountInput"
                          type="number"
                          step="any"
                          min="0"
                          inputMode="decimal"
                          className="form-control fw-bold fs-4 text-dark border-0 px-2"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          placeholder="e.g. 1000"
                        />
                      </div>

                      {/* Quick Amount Presets */}
                      <div 
                        className="d-flex align-items-center gap-1.5 mt-2 overflow-x-auto text-nowrap no-scrollbar"
                        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                      >
                        <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                        {amountPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                              parseFloat(amountInput) === val ? "btn-primary text-white" : "btn-light border text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => setAmountInput(val.toString())}
                          >
                            ₹{val.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GST Rate Slab Selector */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-dark mb-1.5 d-flex align-items-center gap-1.5">
                        <Percent size={15} className="text-primary" />
                        <span>Select GST Tax Rate:</span>
                      </label>
                      <div className="row g-2">
                        {[5, 12, 18, 28].map((rate) => (
                          <div key={rate} className="col-3">
                            <button
                              type="button"
                              className={`btn w-100 py-2 fw-bold rounded-3 ${
                                gstRate === rate ? "btn-primary shadow-sm" : "btn-light border text-dark"
                              }`}
                              onClick={() => setGstRate(rate)}
                              style={{ fontSize: "0.95rem" }}
                            >
                              {rate}%
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Formula callout */}
                  <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex flex-column gap-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-dark">Formula Applied:</span>
                      <code className="text-primary fw-bold">
                        {isInclusive ? "Base = Total ÷ (1 + Rate%)" : "Tax = Base × Rate%"}
                      </code>
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.76rem" }}>
                      {isInclusive 
                        ? "Reverse GST extracts original tax-free base price and taxes embedded in the retail price."
                        : "Forward GST adds sales tax on top of your tax-exclusive catalog base price."
                      }
                    </span>
                  </div>
                </div>

                {/* Right Column: Hero Gradient Result Box */}
                <div className="col-12 col-lg-6">
                  <div
                    className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
                    style={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                      minHeight: 280
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                          TOTAL TRANSACTION VALUE
                        </span>
                        <span
                          className="badge rounded-pill fw-bold px-2.5 py-1"
                          style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}
                        >
                          ● {gstRate}% GST {isInclusive ? "Inclusive" : "Added"}
                        </span>
                      </div>

                      <div className="d-flex align-items-baseline gap-2 mb-2">
                        <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(1.85rem, 6.5vw, 2.75rem)" }}>
                          {formatCurrency(stats.totalAmount)}
                        </span>
                      </div>

                      <div
                        className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                        style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                      >
                        <Receipt size={15} className="text-warning" />
                        <span className="small">
                          Total Tax: <strong>{formatCurrency(stats.gstAmount)}</strong> | Base: <strong>{formatCurrency(stats.netAmount)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Breakdown table */}
                    <div
                      className="rounded-3 p-3"
                      style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
                    >
                      <div className="row g-2 small">
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Base Price:</span>
                          <strong>{formatCurrency(stats.netAmount)}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">Total GST:</span>
                          <strong className="text-warning">{formatCurrency(stats.gstAmount)}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">CGST ({gstRate / 2}%):</span>
                          <strong>{formatCurrency(stats.cgst)}</strong>
                        </div>
                        <div className="col-6 d-flex justify-content-between">
                          <span className="opacity-75">SGST ({gstRate / 2}%):</span>
                          <strong className="text-info">{formatCurrency(stats.sgst)}</strong>
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
                    <div className="small text-secondary mb-1 fw-semibold">Total Price</div>
                    <div className="fs-5 fw-bold text-success mt-0.5 mb-0.5">{formatCurrency(stats.totalAmount)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Final Transaction Value
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Base Price</div>
                    <div className="fs-5 fw-bold text-dark mt-0.5 mb-0.5">{formatCurrency(stats.netAmount)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Net Tax-Free Price
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Total GST ({gstRate}%)</div>
                    <div className="fs-5 fw-bold text-primary mt-0.5 mb-0.5">{formatCurrency(stats.gstAmount)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Combined Indirect Tax
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">CGST / SGST Split</div>
                    <div className="fs-6 fw-bold text-info mt-1 mb-1">
                      {formatCurrency(stats.cgst)} each
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      50:50 Center &amp; State
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
                        `GST Calculation: Base ${formatCurrency(stats.netAmount)} + ${gstRate}% GST (${formatCurrency(stats.gstAmount)}) = Total ${formatCurrency(stats.totalAmount)}. Calculate yours: https://www.pkminfotech.com/tools/utility/gst-calculator`
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
                Official Reference Guide &amp; Tax Guidelines
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Indian GST System: Standard Formulas &amp; Calculations Guide
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Legal frameworks of CGST, SGST, IGST, reverse tax math, and business accounting guides.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              The <strong>Goods and Services Tax (GST)</strong> in India is a destination-based indirect tax replacing excise duty, VAT, and service tax. Computing GST correctly is critical for invoices, retail purchases, and filing GSTR returns.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="gst-math">
              <Percent size={16} className="text-primary" /> 1. GST Calculation Mathematics
            </h3>
            <p><strong>Exclusive Tax (Adding GST):</strong></p>
            <div className="bg-light p-3 rounded-3 border font-monospace mb-3">
              GST Amount = Base Price × (Rate ÷ 100) <br />
              Total Invoice = Base Price + GST Amount
            </div>
            <p><strong>Inclusive Tax (Removing GST):</strong></p>
            <div className="bg-light p-3 rounded-3 border font-monospace mb-3">
              Base Price = Total Retail Price ÷ (1 + (Rate ÷ 100)) <br />
              GST Amount = Total Retail Price - Base Price
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="tax-split">
              <Landmark size={16} className="text-primary" /> 2. CGST vs. SGST vs. IGST Split
            </h3>
            <ul className="ps-3 mb-4">
              <li><strong>Intra-State (Within Same State):</strong> Split equally 50:50 into CGST (Central Tax) and SGST (State Tax).</li>
              <li><strong>Inter-State (Across State Borders):</strong> Applied as 100% IGST (Integrated GST) without split.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="gst-slabs">3. Standard GST Slabs in India</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>Slab Rate</th>
                    <th>Common Goods &amp; Services</th>
                    <th>CGST</th>
                    <th>SGST</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rate: "5%", goods: "Packaged food items, domestic LPG, life-saving medicines", cgst: "2.5%", sgst: "2.5%" },
                    { rate: "12%", goods: "Computers, business class air travel, processed foods", cgst: "6.0%", sgst: "6.0%" },
                    { rate: "18%", goods: "IT services, restaurants, financial services, hair oil", cgst: "9.0%", sgst: "9.0%" },
                    { rate: "28%", goods: "Automobiles, air conditioners, luxury goods, cement", cgst: "14.0%", sgst: "14.0%" },
                  ].map((row) => (
                    <tr key={row.rate}>
                      <td><strong>{row.rate}</strong></td>
                      <td>{row.goods}</td>
                      <td>{row.cgst}</td>
                      <td>{row.sgst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: What is Input Tax Credit (ITC)?</strong>
                <span className="text-muted">ITC allows registered businesses to deduct tax paid on purchases from the tax collected on sales, preventing cascading tax on tax.</span>
              </div>
              <div className="mb-3">
                <strong className="text-dark d-block">Q: What is the threshold for GST registration?</strong>
                <span className="text-muted">Standardly ₹40 Lakhs turnover for goods suppliers and ₹20 Lakhs for service providers (₹10–20 Lakhs in special category states).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="utility"
              categoryName="Utility & Finance Tools"
              currentPath="/tools/utility/gst-calculator"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
