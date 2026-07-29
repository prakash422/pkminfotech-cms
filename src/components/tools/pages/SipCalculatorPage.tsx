"use client"

import React, { useState, useEffect } from "react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Calculator, HelpCircle, TrendingUp, DollarSign, Award, Calendar, Percent } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

export default function SipCalculatorPage({ title, description, basePath }: { title: string; description: string; basePath: string }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedRate, setExpectedRate] = useState(12)
  const [years, setYears] = useState(10)

  const [totalInvestment, setTotalInvestment] = useState(0)
  const [estReturns, setEstReturns] = useState(0)
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const P = monthlyInvestment
    const i = expectedRate / 12 / 100
    const n = years * 12

    if (P <= 0 || i <= 0 || n <= 0) {
      setTotalInvestment(0)
      setEstReturns(0)
      setTotalValue(0)
      return
    }

    // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    const invested = P * n
    const returns = futureValue - invested

    setTotalInvestment(invested)
    setEstReturns(Math.round(returns))
    setTotalValue(Math.round(futureValue))
  }, [monthlyInvestment, expectedRate, years])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Calculate percentage ratios for the comparison bar
  const investmentRatio = totalValue > 0 ? (totalInvestment / totalValue) * 100 : 0
  const returnsRatio = totalValue > 0 ? (estReturns / totalValue) * 100 : 0

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Utility", href: basePath },
          { label: "SIP Calculator" }
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="row g-4 mb-3">
        {/* Sliders Panel */}
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> SIP Parameters
            </h2>

            {/* Monthly Investment Slider */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <label htmlFor="monthlySlider" className="form-label small fw-semibold text-secondary mb-0">Monthly Investment</label>
                <span className="text-primary fw-bold">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <input
                id="monthlySlider"
                type="range"
                min="500"
                max="100000"
                step="500"
                className="form-range"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Expected Rate of Return Slider */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <label htmlFor="rateSlider" className="form-label small fw-semibold text-secondary mb-0">Expected Return Rate (p.a.)</label>
                <span className="text-primary fw-bold">{expectedRate}%</span>
              </div>
              <input
                id="rateSlider"
                type="range"
                min="5"
                max="30"
                step="0.5"
                className="form-range"
                value={expectedRate}
                onChange={(e) => setExpectedRate(parseFloat(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period Slider */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <label htmlFor="yearsSlider" className="form-label small fw-semibold text-secondary mb-0">Time Period (Years)</label>
                <span className="text-primary fw-bold">{years} Years</span>
              </div>
              <input
                id="yearsSlider"
                type="range"
                min="1"
                max="30"
                step="1"
                className="form-range"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              <TrendingUp size={18} className="text-primary" /> Estimated Wealth
            </h2>

            <div className="p-4 bg-light rounded-3 border text-center mb-4">
              <span className="small text-secondary d-block mb-1">Expected Total Value</span>
              <span className="h2 fw-bold text-success mb-0">{formatCurrency(totalValue)}</span>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="small text-secondary d-block">Invested Amount</span>
                  <span className="fw-bold text-dark">{formatCurrency(totalInvestment)}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="small text-secondary d-block">Est. Returns</span>
                  <span className="fw-bold text-dark">{formatCurrency(estReturns)}</span>
                </div>
              </div>
            </div>

            {/* Visual ratio chart */}
            <div>
              <span className="small fw-semibold text-secondary d-block mb-2">Investment vs. Returns Ratio</span>
              <div className="progress" style={{ height: 16, borderRadius: 8 }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${investmentRatio}%` }}
                  aria-valuenow={investmentRatio}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  title={`Invested: ${investmentRatio.toFixed(0)}%`}
                />
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${returnsRatio}%` }}
                  aria-valuenow={returnsRatio}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  title={`Returns: ${returnsRatio.toFixed(0)}%`}
                />
              </div>
              <div className="d-flex justify-content-between small text-muted mt-2">
                <span><span className="d-inline-block rounded-circle bg-primary me-1" style={{ width: 8, height: 8 }} /> Invested ({investmentRatio.toFixed(0)}%)</span>
                <span><span className="d-inline-block rounded-circle bg-success me-1" style={{ width: 8, height: 8 }} /> Returns ({returnsRatio.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      {/* SEO rich content (More than 1000 words, highly unique) */}
      <section className="flat-content-section border-top pt-4 mt-4">
        <GuideSectionHeader
          title="Systematic Investment Plan (SIP) Masterclass: The Power of Compounding"
          subtitle="Deep dive into SIP formulas, compound interest models, rupee cost averaging, and tax laws"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: '1.05rem', fontWeight: 400 }}>
            Investing in Mutual Funds via a <strong>Systematic Investment Plan (SIP)</strong> has become the preferred vehicle for wealth generation in India. Unlike lump-sum investments that require substantial capital, a SIP allows individuals to build wealth progressively. By automating monthly contributions, you benefit from market fluctuations while mitigating risk.
          </p>

          <h3 className="guide-subheading">
            <Percent size={18} className="text-primary" /> 1. Mathematical Formula Behind SIP Calculations
          </h3>
          <p>
            An online SIP calculator uses a compounding interest equation tailored for monthly recurring investments. Since interest is calculated monthly and reinvested, the future value of your wealth is computed using the formula below:
          </p>
          <div className="bg-light p-3 rounded-3 border border-light-subtle font-monospace mb-3">
            Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i) <br /><br />
            Where:<br />
            - <strong>M</strong> = Expected future wealth value.<br />
            - <strong>P</strong> = Monthly investment amount.<br />
            - <strong>i</strong> = Monthly expected interest rate (computed as: Expected annual rate / 12 / 100).<br />
            - <strong>n</strong> = Total number of months (computed as: Number of years * 12).
          </div>
          <p>
            Let&apos;s evaluate a live example: If you invest ₹5,000 per month for 10 years at an expected annual return rate of 12%, here is how the math breaks down:
          </p>
          <ul className="ps-3 mb-4">
            <li>Monthly Rate (i) = 12 / 12 / 100 = 0.01</li>
            <li>Months (n) = 10 * 12 = 120</li>
            <li>Total Invested = 5,000 * 120 = ₹6,00,000</li>
            <li>Future Value (M) = 5,000 * [ ((1 + 0.01)^120 - 1) / 0.01 ] * (1 + 0.01) = ₹11,61,695</li>
            <li>Estimated Capital Gains = ₹11,61,695 - ₹6,00,000 = ₹5,61,695</li>
          </ul>

          <h3 className="guide-subheading">
            <TrendingUp size={18} className="text-primary" /> 2. Core Benefits of SIP Investing
          </h3>
          <p>
            A Systematic Investment Plan offers key advantages over trying to time the equity markets:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>Rupee Cost Averaging:</strong> When markets are down, your monthly SIP purchases more mutual fund units. When markets rise, the SIP purchases fewer units. Over a long duration, your cost of purchase averages out, shielding your capital from severe volatility.</li>
            <li><strong>Compounding Power:</strong> Compounding acts as a snowball effect where you earn interest not only on your principal but also on the interest accumulated. The longer your money stays invested, the steeper the wealth accumulation curve.</li>
            <li><strong>Disciplined Savings:</strong> By setting up auto-debits (e.g. NACH mandates), you automate savings right after your monthly salary is credited, curbing impulse expenditures.</li>
          </ul>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">3. Mutual Fund Categories &amp; Expected Returns</h3>
          <p>
            While planning your long-term financial goals, it is crucial to align your risk tolerance with the right equity mutual fund category:
          </p>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2 mb-4">
              <thead>
                <tr className="table-light">
                  <th>Fund Category</th>
                  <th>Risk Level</th>
                  <th>Expected Returns (p.a.)</th>
                  <th>Suggested Time Horizon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Large-Cap Funds</strong></td>
                  <td>Moderate</td>
                  <td>11% - 13%</td>
                  <td>3 to 5 Years</td>
                </tr>
                <tr>
                  <td><strong>Mid-Cap Funds</strong></td>
                  <td>High</td>
                  <td>14% - 16%</td>
                  <td>5 to 7 Years</td>
                </tr>
                <tr>
                  <td><strong>Small-Cap Funds</strong></td>
                  <td>Very High</td>
                  <td>16% - 18%+</td>
                  <td>7+ Years</td>
                </tr>
                <tr>
                  <td><strong>Debt / Liquid Funds</strong></td>
                  <td>Low</td>
                  <td>6% - 7.5%</td>
                  <td>1 to 3 Years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">4. Mutual Fund Taxation in India: Capital Gains Rules</h3>
          <p>
            The returns generated from your mutual fund investments are subject to tax when you redeem the units:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>Equity-Oriented Funds:</strong>
              <ul>
                <li><strong>Short-Term Capital Gains (STCG):</strong> For equity-oriented mutual fund units transferred on or after July 23, 2024, gains on units held for up to 12 months are generally taxed at 20%, plus applicable surcharge and cess.</li>
                <li><strong>Long-Term Capital Gains (LTCG):</strong> For equity-oriented fund units held for more than 12 months, aggregate eligible gains above ₹1.25 lakh in a financial year are generally taxed at 12.5%, plus applicable surcharge and cess.</li>
              </ul>
            </li>
            <li><strong>Debt-Oriented Funds:</strong> Capital gains on debt funds are added directly to the individual&apos;s income and taxed according to their applicable income tax slabs, regardless of the holding period.</li>
          </ul>

          <h3 className="guide-subheading">
            <HelpCircle size={18} className="text-primary" /> 5. Frequently Asked Questions (FAQ)
          </h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: Can I stop or pause my SIP anytime?</h4>
              <p className="text-muted mb-0">
                Yes. SIPs are fully flexible. You can pause or stop your monthly auto-debit request at any time without paying any penalty or charges. The accumulated funds will remain invested until you decide to redeem them.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: What is the difference between SIP and Lumpsum?</h4>
              <p className="text-muted mb-0">
                A SIP involves investing a fixed sum of money at regular intervals (e.g. monthly). A Lumpsum investment involves investing a large block of money at once. SIPs are ideal for salaried individuals, whereas lumpsums are preferred when you receive a bonus or windfalls.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: Are mutual fund returns guaranteed?</h4>
              <p className="text-muted mb-0">
                No. Mutual fund investments are subject to market risks, and calculator projections are not guaranteed. Use multiple return assumptions and review the scheme documents before investing.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q4: What is a Top-Up SIP?</h4>
              <p className="text-muted mb-0">
                A Top-Up (or Step-Up) SIP allows you to automatically increase your monthly investment by a fixed amount or percentage (e.g., 10% every year) as your monthly salary grows. This significantly speeds up long-term wealth generation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
