"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Percent, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  HelpCircle,
  SlidersHorizontal,
  PiggyBank
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

export default function SipCalculatorPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000)
  const [expectedRate, setExpectedRate] = useState<number>(12)
  const [years, setYears] = useState<number>(10)
  const [copied, setCopied] = useState<boolean>(false)

  const stats = useMemo(() => {
    const P = monthlyInvestment
    const i = expectedRate / 12 / 100
    const n = years * 12

    if (P <= 0 || i <= 0 || n <= 0) {
      return {
        totalInvestment: 0,
        estReturns: 0,
        totalValue: 0,
        multiplier: 0,
        investmentRatio: 0,
        returnsRatio: 0,
      }
    }

    // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    const invested = P * n
    const returns = futureValue - invested
    const multiplier = invested > 0 ? (futureValue / invested).toFixed(2) : "1.00"

    const totalVal = Math.round(futureValue)
    const invRatio = totalVal > 0 ? (invested / totalVal) * 100 : 0
    const retRatio = totalVal > 0 ? (returns / totalVal) * 100 : 0

    return {
      totalInvestment: invested,
      estReturns: Math.round(returns),
      totalValue: totalVal,
      multiplier: multiplier,
      investmentRatio: invRatio,
      returnsRatio: retRatio,
    }
  }, [monthlyInvestment, expectedRate, years])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleReset = () => {
    setMonthlyInvestment(5000)
    setExpectedRate(12)
    setYears(10)
  }

  const handleCopySummary = () => {
    const text = `📈 *Mutual Fund SIP Projection:*
• Monthly Investment: ${formatCurrency(monthlyInvestment)}
• Expected Annual Return: ${expectedRate}%
• Investment Horizon: ${years} Years
• Total Invested Amount: ${formatCurrency(stats.totalInvestment)}
• Estimated Wealth Gains: ${formatCurrency(stats.estReturns)}
• Expected Maturity Value: ${formatCurrency(stats.totalValue)} (${stats.multiplier}x Growth)
Calculated via: https://www.pkminfotech.com/tools/utility/sip-calculator`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const monthlyPresets = [2000, 5000, 10000, 20000, 50000]
  const ratePresets = [10, 12, 14, 15, 18]
  const yearPresets = [3, 5, 10, 15, 20, 25]

  const usefulLinks: UsefulLinkItem[] = [
    { label: "SIP Compounding Formula Explained", href: "#sip-formula" },
    { label: "Equity Mutual Fund Return Slabs", href: "#fund-returns" },
    { label: "Mutual Fund Capital Gains Taxation", href: "#tax-rules" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="sip-calculator-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="SIP Wealth Planner"
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* Main Interactive Tool Console */}
          <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            {/* Top Console Bar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 28, height: 28, backgroundColor: "#eff6ff", color: "#2563eb" }}
                >
                  <PiggyBank size={15} />
                </div>
                <div className="d-flex flex-column">
                  <span className="fw-bold text-dark small" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>
                    Monthly SIP Calculator
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Compounding Growth Projection
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 7, height: 7 }} />
                  Live Calculation
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset to default"
                >
                  <RotateCcw size={12} />
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
                    {/* Monthly Investment */}
                    <div className="mb-3.5">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="monthlyInput" className="form-label small fw-bold text-dark mb-0">
                          Monthly Investment (₹)
                        </label>
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2.5 py-1" style={{ fontSize: "0.85rem" }}>
                          {formatCurrency(monthlyInvestment)} / mo
                        </span>
                      </div>
                      <input
                        id="monthlyRange"
                        type="range"
                        min="500"
                        max="100000"
                        step="500"
                        className="form-range"
                        value={monthlyInvestment}
                        onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
                      />

                      {/* Quick Presets */}
                      <div 
                        className="d-flex align-items-center gap-1.5 mt-1.5 overflow-x-auto text-nowrap no-scrollbar"
                        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                      >
                        <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                        {monthlyPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                              monthlyInvestment === val ? "btn-primary text-white" : "btn-light border text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => setMonthlyInvestment(val)}
                          >
                            ₹{val >= 1000 ? `${val / 1000}k` : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expected Return Rate */}
                    <div className="mb-3.5">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="rateRange" className="form-label small fw-bold text-dark mb-0">
                          Expected Return Rate (p.a.)
                        </label>
                        <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2.5 py-1" style={{ fontSize: "0.85rem" }}>
                          {expectedRate}% p.a.
                        </span>
                      </div>
                      <input
                        id="rateRange"
                        type="range"
                        min="5"
                        max="30"
                        step="0.5"
                        className="form-range"
                        value={expectedRate}
                        onChange={(e) => setExpectedRate(parseFloat(e.target.value))}
                      />

                      {/* Quick Presets */}
                      <div 
                        className="d-flex align-items-center gap-1.5 mt-1.5 overflow-x-auto text-nowrap no-scrollbar"
                        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                      >
                        <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                        {ratePresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                              expectedRate === val ? "btn-success text-white" : "btn-light border text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => setExpectedRate(val)}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Investment Duration */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="yearsRange" className="form-label small fw-bold text-dark mb-0">
                          Time Period (Years)
                        </label>
                        <span className="badge rounded-pill bg-info-subtle text-info fw-bold px-2.5 py-1" style={{ fontSize: "0.85rem" }}>
                          {years} Years ({years * 12} Installments)
                        </span>
                      </div>
                      <input
                        id="yearsRange"
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        className="form-range"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                      />

                      {/* Quick Presets */}
                      <div 
                        className="d-flex align-items-center gap-1.5 mt-1.5 overflow-x-auto text-nowrap no-scrollbar"
                        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                      >
                        <span className="small text-secondary me-1 flex-shrink-0" style={{ fontSize: "0.75rem" }}>Quick:</span>
                        {yearPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold flex-shrink-0 ${
                              years === val ? "btn-info text-white" : "btn-light border text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            onClick={() => setYears(val)}
                          >
                            {val}Y
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-3 bg-light border text-secondary small d-flex align-items-center justify-content-between">
                    <span>Tenure: <strong>{years * 12} Months</strong></span>
                    <span>Growth Multiplier: <strong className="text-success">{stats.multiplier}x</strong></span>
                  </div>
                </div>

                {/* Right Column: Hero Gradient Result Box */}
                <div className="col-12 col-lg-6">
                  <div
                    className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between shadow"
                    style={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                      minHeight: 290
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="small text-uppercase tracking-wider opacity-80 fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                          EXPECTED MATURITY WEALTH
                        </span>
                        <span
                          className="badge rounded-pill fw-bold px-2.5 py-1"
                          style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}
                        >
                          ● {stats.multiplier}x Multiplier
                        </span>
                      </div>

                      <div className="d-flex align-items-baseline gap-2 mb-2">
                        <span className="fw-bold lh-1 text-break" style={{ fontSize: "clamp(1.85rem, 6.5vw, 2.75rem)" }}>
                          {formatCurrency(stats.totalValue)}
                        </span>
                      </div>

                      <div
                        className="rounded-3 p-2 mb-3 small d-inline-flex align-items-center gap-1.5"
                        style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)" }}
                      >
                        <TrendingUp size={15} className="text-warning" />
                        <span className="small">
                          Est. Capital Returns: <strong>{formatCurrency(stats.estReturns)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Breakdown */}
                    <div>
                      <div className="progress mb-2" style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.2)" }}>
                        <div
                          className="progress-bar bg-white text-dark"
                          style={{ width: `${stats.investmentRatio}%` }}
                          title={`Invested: ${stats.investmentRatio.toFixed(0)}%`}
                        />
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: `${stats.returnsRatio}%` }}
                          title={`Returns: ${stats.returnsRatio.toFixed(0)}%`}
                        />
                      </div>

                      <div
                        className="rounded-3 p-2.5"
                        style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
                      >
                        <div className="row g-2 small">
                          <div className="col-6 d-flex justify-content-between">
                            <span className="opacity-75">Invested Principal:</span>
                            <strong>{formatCurrency(stats.totalInvestment)}</strong>
                          </div>
                          <div className="col-6 d-flex justify-content-between">
                            <span className="opacity-75">Wealth Gain:</span>
                            <strong className="text-warning">{formatCurrency(stats.estReturns)}</strong>
                          </div>
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
                    <div className="small text-secondary mb-1 fw-semibold">Total Maturity</div>
                    <div className="fs-5 fw-bold text-success mt-0.5 mb-0.5">{formatCurrency(stats.totalValue)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Expected Future Wealth
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Invested Amount</div>
                    <div className="fs-5 fw-bold text-dark mt-0.5 mb-0.5">{formatCurrency(stats.totalInvestment)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Your Monthly Principal
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Wealth Gain</div>
                    <div className="fs-5 fw-bold text-primary mt-0.5 mb-0.5">{formatCurrency(stats.estReturns)}</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Power of Compounding
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Multiplier</div>
                    <div className="fs-5 fw-bold text-info mt-0.5 mb-0.5">{stats.multiplier}x</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Capital Growth Factor
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
                        `My SIP of ${formatCurrency(monthlyInvestment)}/mo for ${years} years will yield ${formatCurrency(stats.totalValue)} (Gain: ${formatCurrency(stats.estReturns)}). Calculate yours: https://www.pkminfotech.com/tools/utility/sip-calculator`
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
                Official Reference Guide &amp; Wealth Compounding
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Systematic Investment Plan (SIP) Masterclass: The Power of Compounding
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Deep dive into SIP formulas, compound interest models, rupee cost averaging, and tax laws.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              Investing in Mutual Funds via a <strong>Systematic Investment Plan (SIP)</strong> allows individuals to build long-term wealth progressively. By automating monthly contributions, you benefit from rupee cost averaging and compounding interest.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="sip-formula">
              <Percent size={16} className="text-primary" /> 1. Mathematical Formula Behind SIP Calculations
            </h3>
            <div className="bg-light p-3 rounded-3 border font-monospace mb-3">
              M = P × [ ( (1 + i)^n - 1 ) ÷ i ] × (1 + i) <br /><br />
              • P = Monthly installment amount <br />
              • i = Monthly interest rate (Annual rate ÷ 12 ÷ 100) <br />
              • n = Total number of months (Years × 12)
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="fund-returns">2. Mutual Fund Categories &amp; Return Benchmarks</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>Fund Category</th>
                    <th>Risk Profile</th>
                    <th>Expected Return (p.a.)</th>
                    <th>Ideal Horizon</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Large-Cap Funds", risk: "Moderate", ret: "11% - 13%", time: "3 to 5 Years" },
                    { cat: "Flexi-Cap / Multi-Cap", risk: "Moderate-High", ret: "12% - 14%", time: "5+ Years" },
                    { cat: "Mid-Cap Funds", risk: "High", ret: "14% - 16%", time: "5 to 7 Years" },
                    { cat: "Small-Cap Funds", risk: "Very High", ret: "16% - 18%+", time: "7+ Years" },
                  ].map((row) => (
                    <tr key={row.cat}>
                      <td><strong>{row.cat}</strong></td>
                      <td>{row.risk}</td>
                      <td>{row.ret}</td>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="tax-rules">
              <ShieldCheck size={16} className="text-primary" /> 3. Mutual Fund Capital Gains Tax Rules
            </h3>
            <ul className="ps-3 mb-4">
              <li><strong>Equity Funds LTCG:</strong> Gains on units held over 12 months exceeding ₹1.25 Lakh per financial year are taxed at 12.5% (Budget 2024 revised).</li>
              <li><strong>Equity Funds STCG:</strong> Units redeemed within 12 months are taxed at 20%.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: Can I stop or pause my SIP anytime?</strong>
                <span className="text-muted">Yes. SIPs are completely flexible without penalty. Accumulated units continue to grow until you redeem.</span>
              </div>
              <div className="mb-3">
                <strong className="text-dark d-block">Q: What is a Step-Up / Top-Up SIP?</strong>
                <span className="text-muted">A Step-Up SIP automatically increases your monthly installment (e.g. 10% annually) in line with salary increments, doubling wealth creation.</span>
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
              currentPath="/tools/utility/sip-calculator"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
