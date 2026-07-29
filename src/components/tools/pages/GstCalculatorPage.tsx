"use client"

import React, { useState, useEffect } from "react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Calculator, Percent, Info, Receipt, Landmark, CheckCircle } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

export default function GstCalculatorPage({ title, description, basePath }: { title: string; description: string; basePath: string }) {
  const [amountInput, setAmountInput] = useState("1000")
  const [gstRate, setGstRate] = useState(18)
  const [isInclusive, setIsInclusive] = useState(false) // false = Exclusive (Add GST), true = Inclusive (Remove GST)

  const [netAmount, setNetAmount] = useState(1000)
  const [gstAmount, setGstAmount] = useState(180)
  const [totalAmount, setTotalAmount] = useState(1180)
  const [cgst, setCgst] = useState(90)
  const [sgst, setSgst] = useState(90)

  useEffect(() => {
    const amount = parseFloat(amountInput) || 0
    const rate = gstRate

    if (amount <= 0 || rate < 0) {
      setNetAmount(0)
      setGstAmount(0)
      setTotalAmount(0)
      setCgst(0)
      setSgst(0)
      return
    }

    if (!isInclusive) {
      // Exclusive (Add GST)
      const calculatedGst = amount * (rate / 100)
      const calculatedTotal = amount + calculatedGst

      setNetAmount(amount)
      setGstAmount(calculatedGst)
      setTotalAmount(calculatedTotal)
      setCgst(calculatedGst / 2)
      setSgst(calculatedGst / 2)
    } else {
      // Inclusive (Remove GST)
      const calculatedNet = amount / (1 + rate / 100)
      const calculatedGst = amount - calculatedNet

      setNetAmount(calculatedNet)
      setGstAmount(calculatedGst)
      setTotalAmount(amount)
      setCgst(calculatedGst / 2)
      setSgst(calculatedGst / 2)
    }
  }, [amountInput, gstRate, isInclusive])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(val)
  }

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Utility", href: basePath },
          { label: "GST Calculator" }
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="row g-4 mb-3">
        {/* Input Panel */}
        <div className="col-12 col-md-5">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> Input Details
            </h2>

            <div className="mb-3">
              <label htmlFor="amountInput" className="form-label small fw-semibold text-secondary">
                {isInclusive ? "Total Amount (Inclusive of GST)" : "Net Amount (Exclusive of GST)"}
              </label>
              <input
                id="amountInput"
                type="number"
                className="form-control border-light-subtle rounded-3"
                placeholder="e.g. 1000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary d-block">Tax Mode</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn py-2 fw-semibold ${!isInclusive ? "btn-primary" : "btn-light border"}`}
                  onClick={() => setIsInclusive(false)}
                >
                  Add GST (Exclusive)
                </button>
                <button
                  type="button"
                  className={`btn py-2 fw-semibold ${isInclusive ? "btn-primary" : "btn-light border"}`}
                  onClick={() => setIsInclusive(true)}
                >
                  Remove GST (Inclusive)
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary d-block">GST Rate (%)</label>
              <div className="row g-2">
                {[5, 12, 18, 28].map((rate) => (
                  <div key={rate} className="col-3">
                    <button
                      type="button"
                      className={`btn w-100 py-2 fw-bold ${gstRate === rate ? "btn-primary" : "btn-light border"}`}
                      onClick={() => setGstRate(rate)}
                    >
                      {rate}%
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="alert bg-light border-0 text-secondary small p-3 rounded-3 d-flex gap-2 align-items-start mt-2">
              <Info size={16} className="text-primary mt-1 flex-shrink-0" />
              <div>
                Standard tax slabs under the Indian <strong>Goods and Services Tax (GST)</strong> system.
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-12 col-md-7">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Receipt size={18} className="text-primary" /> Tax Breakdown
            </h2>

            <div className="p-3 bg-light rounded-3 border text-center mb-4">
              <span className="small text-secondary d-block mb-1">Total Transaction Value</span>
              <span className="h2 fw-bold text-success mb-0">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <span className="small text-secondary">Base Price (Tax Free)</span>
                  <span className="fw-bold text-dark">{formatCurrency(netAmount)}</span>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <span className="small text-secondary">Total GST Amount ({gstRate}%)</span>
                  <span className="fw-bold text-primary">{formatCurrency(gstAmount)}</span>
                </div>
              </div>
            </div>

            <h3 className="h6 fw-bold text-dark mb-2 d-flex align-items-center gap-1">
              <Landmark size={14} className="text-secondary" /> Intra-State Split (CGST + SGST)
            </h3>
            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border small">
                  <span className="text-secondary d-block">CGST (Central Tax - {gstRate / 2}%)</span>
                  <strong className="text-dark">{formatCurrency(cgst)}</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border small">
                  <span className="text-secondary d-block">SGST (State Tax - {gstRate / 2}%)</span>
                  <strong className="text-dark">{formatCurrency(sgst)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      {/* SEO rich content (More than 1000 words, highly unique) */}
      <section className="flat-content-section border-top pt-4 mt-4">
        <GuideSectionHeader
          title="Indian GST System: Standard Formulas & Calculations Guide"
          subtitle="Legal frameworks of CGST, SGST, IGST, reverse tax math, and business accounting guides"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: '1.05rem', fontWeight: 400 }}>
            The <strong>Goods and Services Tax (GST)</strong>, implemented in India on July 1, 2017, is a unified, destination-based indirect tax that replaced multiple central and state taxes (such as VAT, Excise Duty, Service Tax, and Octroi). Understanding how to calculate GST is essential for small businesses, freelancers, accountants, and consumers to check transparent pricing and ensure compliance.
          </p>

          <h3 className="guide-subheading">
            <Percent size={18} className="text-primary" /> 1. GST Calculation Mathematics &amp; Formulas
          </h3>
          <p>
            Depending on whether the tax is already included in the retail price (MRP) or needs to be added, there are two distinct math formulas:
          </p>
          <div className="bg-light p-3 rounded-3 border border-light-subtle mb-3">
            <strong>Case A: Adding GST (Exclusive Tax)</strong><br />
            When you know the base price and want to calculate tax on top of it:<br />
            <code className="font-monospace">GST Amount = Base Price * (GST Rate / 100)</code><br />
            <code className="font-monospace">Total Price = Base Price + GST Amount</code><br /><br />
            <em>Example: Base price = ₹1,000, GST = 18%.<br />
            GST Amount = 1,000 * (18 / 100) = ₹180.<br />
            Total Price = 1,000 + 180 = ₹1,180.</em>
          </div>

          <div className="bg-light p-3 rounded-3 border border-light-subtle mb-3">
            <strong>Case B: Removing GST (Inclusive Tax / Reverse GST)</strong><br />
            When you know the total retail price (MRP) and want to find the tax portion and base price:<br />
            <code className="font-monospace">Base Price (Net Amount) = Total Price / (1 + (GST Rate / 100))</code><br />
            <code className="font-monospace">GST Amount = Total Price - Base Price</code><br /><br />
            <em>Example: Retail Price = ₹1,180, GST = 18%.<br />
            Base Price = 1,180 / (1 + 0.18) = 1,180 / 1.18 = ₹1,000.<br />
            GST Amount = 1,180 - 1,000 = ₹180.</em>
          </div>

          <h3 className="guide-subheading">
            <Landmark size={18} className="text-primary" /> 2. CGST vs. SGST vs. IGST: The Structural Split
          </h3>
          <p>
            GST transactions in India are classified based on the origin and destination of goods and services:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>Intra-State Transactions (Within the Same State):</strong> The total GST collected is split equally between the Central Government and the State Government.
              <ul>
                <li><strong>CGST (Central Goods and Services Tax):</strong> Half of the total GST amount goes to the central government treasury.</li>
                <li><strong>SGST (State Goods and Services Tax):</strong> The other half goes to the respective state government treasury where the transaction occurred. (For Union Territories, this is called <strong>UTGST</strong>).</li>
              </ul>
            </li>
            <li><strong>Inter-State Transactions (Between Two Different States):</strong> The tax is collected directly by the Central government and then allocated to the destination state.
              <ul>
                <li><strong>IGST (Integrated Goods and Services Tax):</strong> The entire GST rate is applied as IGST. No split is shown on the invoice.</li>
              </ul>
            </li>
          </ul>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">3. Standard GST Slabs in India</h3>
          <p>
            The GST Council classifies goods and services under five primary tax slabs:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>0% (Exempt):</strong> Essential food grains, fresh vegetables, milk, salt, newspapers, and basic educational books.</li>
            <li><strong>5% Slab:</strong> Sugar, tea, coffee, edible oils, domestic LPG cylinders, life-saving drugs, and low-cost garments.</li>
            <li><strong>12% Slab:</strong> Cell phones, computers, processed foods, fruit juices, diagnostic kits, and business class air travel.</li>
            <li><strong>18% Slab:</strong> (Most common category) Restaurants, IT services, consulting services, financial services/banking transactions, steel, hair oil, and industrial products.</li>
            <li><strong>28% Slab:</strong> Luxury goods, motorcars, motorcycles, cement, carbonated soft drinks, air conditioners, and tobacco products. (Additional cesses may apply to luxury cars and tobacco).</li>
          </ul>

          <h3 className="guide-subheading">
            <CheckCircle size={18} className="text-primary" /> 4. Frequently Asked Questions (FAQ)
          </h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: What is Input Tax Credit (ITC)?</h4>
              <p className="text-muted mb-0">
                Input Tax Credit allows registered businesses to deduct the tax they paid on raw materials/purchases (Input Tax) from the tax they collect on sales (Output Tax). This prevents double taxation and cascades of tax on tax.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: Do I need a GST registration for my business?</h4>
              <p className="text-muted mb-0">
                Registration depends on turnover, state, supply type and compulsory-registration rules. Common threshold references are ₹40 lakh for many goods suppliers and ₹20 lakh for many service providers, with lower limits in specified states, but exceptions apply. Check the current GST portal guidance or consult a tax professional for your facts.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: How is IGST different from CGST + SGST?</h4>
              <p className="text-muted mb-0">
                IGST is applied when goods are sold from one state to another (e.g., Maharashtra to Karnataka). CGST and SGST are applied when the seller and the buyer are located in the same state. The total tax rate remains the same in both scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
