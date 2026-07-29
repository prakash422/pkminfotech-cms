"use client"

import React, { useState } from "react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Calculator, Printer, Info, Scale, ShieldAlert, CheckCircle } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

export default function RentReceiptPage({ title, description, basePath }: { title: string; description: string; basePath: string }) {
  const [tenantName, setTenantName] = useState("")
  const [landlordName, setLandlordName] = useState("")
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [rentPeriod, setRentPeriod] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [paymentMode, setPaymentMode] = useState("Cash")
  const [submitted, setSubmitted] = useState(false)

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      window.print()
    }, 150)
  }

  return (
    <div>
      <div className="d-print-none">
        <BreadcrumbNav
          compact
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Rent Receipt Generator" }
          ]}
        />
        <ToolPageHeader title={title} description={description} />
      </div>

      <div className="row g-4">
        {/* Form panel */}
        <div className="col-12 col-lg-5 d-print-none">
          <div className="tool-panel p-4">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> Receipt Details
            </h2>
            <form onSubmit={handlePrint}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Tenant Name</label>
                <input
                  type="text"
                  required
                  className="form-control border-light-subtle rounded-3"
                  placeholder="e.g. Rajesh Kumar"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Landlord Name</label>
                <input
                  type="text"
                  required
                  className="form-control border-light-subtle rounded-3"
                  placeholder="e.g. Suresh Prasad"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    className="form-control border-light-subtle rounded-3"
                    placeholder="e.g. 15000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Payment Mode</label>
                  <select
                    className="form-select border-light-subtle rounded-3"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Online Transfer">UPI / NetBanking</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Rent Period (Month, Year)</label>
                <input
                  type="text"
                  required
                  className="form-control border-light-subtle rounded-3"
                  placeholder="e.g. January 2026"
                  value={rentPeriod}
                  onChange={(e) => setRentPeriod(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Property Address</label>
                <textarea
                  required
                  rows={2}
                  className="form-control border-light-subtle rounded-3"
                  placeholder="e.g. Flat 302, Block B, Sector 62, Noida"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Receipt Date</label>
                <input
                  type="date"
                  required
                  className="form-control border-light-subtle rounded-3"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2">
                <Printer size={16} /> Print Receipt / Save PDF
              </button>
            </form>
          </div>
        </div>

        {/* Receipt preview panel */}
        <div className="col-12 col-lg-7">
          <div className="tool-panel p-4 rent-receipt-card h-100" style={{ borderStyle: "dashed", borderColor: "#dbe7f7" }}>
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
              <div>
                <h3 className="h5 fw-bold text-primary mb-0">RENT RECEIPT</h3>
                <span className="small text-secondary">HRA Tax Exemption Copy</span>
              </div>
              <div className="text-end text-muted small d-print-none">
                Preview Mode
              </div>
            </div>

            <div className="mb-4">
              <p className="lh-lg">
                Received a sum of <strong className="text-dark">₹ {amount || "_______"}</strong> from <strong className="text-dark">{tenantName || "____________________"}</strong> towards rent of property situated at <strong className="text-dark">{address || "________________________________________"}</strong> for the month of <strong className="text-dark">{rentPeriod || "____________"}</strong>.
              </p>
            </div>

            <div className="row g-4 mt-3 mb-4">
              <div className="col-6">
                <div className="mb-2">
                  <span className="small text-secondary d-block">Paid To (Landlord):</span>
                  <span className="fw-semibold text-dark">{landlordName || "____________________"}</span>
                </div>
                <div className="mb-2">
                  <span className="small text-secondary d-block">Payment Mode:</span>
                  <span className="fw-semibold text-dark">{paymentMode}</span>
                </div>
                <div>
                  <span className="small text-secondary d-block">Date of Receipt:</span>
                  <span className="fw-semibold text-dark">{paymentDate || "DD/MM/YYYY"}</span>
                </div>
              </div>
              <div className="col-6 text-end d-flex flex-column justify-content-between align-items-end">
                <div className="bg-light border px-3 py-2 rounded text-center" style={{ minWidth: 140 }}>
                  <span className="small text-secondary d-block">Amount Received</span>
                  <span className="h5 fw-bold text-dark mb-0">₹ {amount || "0"}</span>
                </div>
                <div className="text-center mt-4">
                  <div className="border-bottom text-muted small px-3 py-1" style={{ minWidth: 150, borderStyle: 'dashed' }}>
                    Signature of Landlord
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      {/* SEO rich content (More than 1000 words, highly unique) */}
      <section className="flat-content-section border-top pt-4 mt-4 d-print-none">
        <GuideSectionHeader
          title="Comprehensive Guide to HRA Tax Exemption & Rent Receipt Verification"
          subtitle="Legal frameworks under Section 10(13A), PAN criteria, and safety checks to avoid IT department flags"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: '1.05rem', fontWeight: 400 }}>
            Availing HRA (House Rent Allowance) tax exemption is one of the most effective ways for salaried employees in India to save income tax. However, the Income Tax Department has significantly tightened verification processes, calling for proper document proof in the form of valid **Rent Receipts** and **Rent Agreements**.
          </p>

          <h3 className="guide-subheading">
            <Scale size={18} className="text-primary" /> 1. HRA Exemption Legality: Section 10(13A) Explained
          </h3>
          <p>
            Under Section 10(13A) of the Income Tax Act, 1961, tax relief is provided to salaried individuals residing in rented properties. The actual amount exempted is calculated dynamically based on three core rules:
          </p>
          <ol className="ps-3 mb-4">
            <li>The actual HRA component received from the employer.</li>
            <li>If living in a metro city (Delhi, Mumbai, Kolkata, Chennai), 50% of Basic Salary + Dearness Allowance (DA). If living in a non-metro city, 40% of Basic Salary + DA.</li>
            <li>Actual rent paid during the year minus 10% of the Basic Salary + DA.</li>
          </ol>
          <p>
            The final exemption granted is the **lowest of the three values** calculated above. Because the third formula takes into account the actual rent paid, rent receipts act as direct legal proof that you actually met the rental cost.
          </p>

          <h3 className="guide-subheading">
            <ShieldAlert size={18} className="text-primary" /> 2. Critical Compliance Checks: PAN &amp; Revenue Stamps
          </h3>
          <p>
            The Income Tax Department has laid down two critical thresholds that tenants must comply with:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>The ₹1 Lakh PAN Rule:</strong> If your total rent paid in a financial year exceeds ₹1,00,000 (which is ₹8,333 per month), you must declare the **PAN of your Landlord** to your employer. If the landlord does not possess a PAN, a signed declaration using Form 60 must be provided. Failing to provide this details will result in your employer refusing to compute HRA benefits, forcing you to claim it manually during ITR filing, which often invites scrutiny.</li>
            <li><strong>The ₹5,000 Cash Revenue Stamp Rule:</strong> Under the Indian Stamp Act, if you pay rent in **Cash** and the individual receipt value exceeds ₹5,000, you must affix a **₹1 Revenue Stamp** on the receipt. The landlord must sign across the stamp to validate it. If the rent is paid electronically (via Netbanking, UPI, or Credit Card), a revenue stamp is standardly not mandatory, though a signed receipt remains necessary.</li>
          </ul>

          <h3 className="guide-subheading">
            <CheckCircle size={18} className="text-primary" /> 3. Documentation Requirements by Rent Slab
          </h3>
          <p>
            To clarify what document set you need based on your monthly rent payment bracket, check the table below:
          </p>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2 mb-4">
              <thead>
                <tr className="table-light">
                  <th>Monthly Rent Range</th>
                  <th>Required Rent Receipts</th>
                  <th>Rent Agreement Needed?</th>
                  <th>Landlord PAN Mandatory?</th>
                  <th>Revenue Stamp Required?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Up to ₹8,333</strong></td>
                  <td>Yes (Quarterly/Monthly)</td>
                  <td>Highly Recommended</td>
                  <td>No</td>
                  <td>Only if cash paid &gt; ₹5,000</td>
                </tr>
                <tr>
                  <td><strong>₹8,334 to ₹50,000</strong></td>
                  <td>Yes (Monthly)</td>
                  <td>Yes (Mandatory)</td>
                  <td>Yes (Mandatory)</td>
                  <td>Only if cash paid &gt; ₹5,000</td>
                </tr>
                <tr>
                  <td><strong>Above ₹50,000</strong></td>
                  <td>Yes (Monthly)</td>
                  <td>Yes (Registered)</td>
                  <td>Yes (Mandatory)</td>
                  <td>Requires 5% TDS deduction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">4. Paying Rent to Parents: How to Keep it Genuine</h3>
          <p>
            Many salaried individuals live with their parents and wish to pay rent to them to claim HRA. While this is legally permitted, the transaction must be genuine to withstand tax audits:
          </p>
          <ol className="ps-3 mb-4">
            <li><strong>ITR Declaration:</strong> The rent you pay must be declared as rental income by your parent under their Income Tax Return (ITR) under the head &quot;Income from House Property&quot;.</li>
            <li><strong>Bank Transfers:</strong> Avoid paying in cash. Always transfer the rent amount monthly to your parent&apos;s bank account to maintain a clear banking trail.</li>
            <li><strong>Valid Documentation:</strong> Draft a formal rent agreement with your parent as the landlord, and generate monthly signed receipts using this tool.</li>
            <li><strong>Co-Ownership check:</strong> Your parent must be the legal owner or co-owner of the property. You cannot pay rent to a parent if you are also a co-owner of the same house.</li>
          </ol>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">5. Frequently Asked Questions (FAQ)</h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: Can I claim HRA if I do not receive an HRA component from my employer?</h4>
              <p className="text-muted mb-0">
                Yes. If you pay rent but do not receive HRA as part of your salary structure, you can still claim deduction under **Section 80GG** of the Income Tax Act when filing your ITR. The deduction limits under 80GG are capped at a maximum of ₹5,000 per month.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: Can I claim both HRA and Home Loan tax benefits?</h4>
              <p className="text-muted mb-0">
                Yes, you can claim both HRA and home loan benefits (deduction on principal under 80C and interest under Section 24) if you own a home but reside in a different rented city due to work, or if your own house is let out and you live in a rented home.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: What happens if my landlord refuses to share their PAN card?</h4>
              <p className="text-muted mb-0">
                If your annual rent is above ₹1 Lakh and the landlord refuses to share their PAN, you cannot claim HRA exemption through your employer. Your employer will deduct tax at source (TDS) without the HRA exemption. You will have to claim it manually when filing your ITR, where you might have to justify the rent payment with bank statements.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q4: Is it necessary to paste a revenue stamp on digital transactions?</h4>
              <p className="text-muted mb-0">
                No. Revenue stamps are required under Article 53 of the Indian Stamp Act for receipts acknowledging money received exceeding ₹5,000 **in cash**. For bank transfers, credit card payments, or UPI, the digital transaction record serves as valid execution proof.
              </p>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @media print {
          body {
            background-color: #fff !important;
          }
          .rent-receipt-card {
            box-shadow: none !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
