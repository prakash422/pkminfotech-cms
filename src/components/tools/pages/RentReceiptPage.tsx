"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Printer, 
  Download,
  Info,
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Receipt, 
  ShieldAlert, 
  Scale, 
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

function amountToWordsINR(num: number): string {
  if (!num || isNaN(num) || num <= 0) return ""
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const convertChunk = (n: number): string => {
    let current = ""
    if (n >= 100) {
      current += ones[Math.floor(n / 100)] + " Hundred "
      n %= 100
    }
    if (n >= 20) {
      current += tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")
    } else if (n > 0) {
      current += ones[n]
    }
    return current.trim()
  }

  let crore = Math.floor(num / 10000000)
  num %= 10000000
  let lakh = Math.floor(num / 100000)
  num %= 100000
  let thousand = Math.floor(num / 1000)
  num %= 1000
  let remaining = Math.floor(num)

  let result = ""
  if (crore > 0) result += convertChunk(crore) + " Crore "
  if (lakh > 0) result += convertChunk(lakh) + " Lakh "
  if (thousand > 0) result += convertChunk(thousand) + " Thousand "
  if (remaining > 0) result += convertChunk(remaining)

  const finalStr = result.trim()
  return finalStr ? `Rupees ${finalStr} Only` : ""
}

export default function RentReceiptPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [tenantName, setTenantName] = useState<string>("Rajesh Kumar")
  const [landlordName, setLandlordName] = useState<string>("Suresh Prasad")
  const [landlordPan, setLandlordPan] = useState<string>("")
  const [receiptNo, setReceiptNo] = useState<string>("REC-2026-01")
  const [amount, setAmount] = useState<string>("15000")
  const [address, setAddress] = useState<string>("Flat 302, Block B, Sector 62, Noida, UP")
  const [rentPeriod, setRentPeriod] = useState<string>("January 2026")
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split("T")[0])
  const [paymentMode, setPaymentMode] = useState<string>("Online Transfer")
  const [copied, setCopied] = useState<boolean>(false)
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false)

  const rentVal = parseFloat(amount) || 0
  const annualRent = rentVal * 12
  const amountInWords = useMemo(() => amountToWordsINR(rentVal), [rentVal])

  const panRequired = annualRent > 100000
  const revenueStampRequired = paymentMode === "Cash" && rentVal > 5000

  const handlePrint = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setTimeout(() => {
      window.print()
    }, 150)
  }

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true)
      const element = document.getElementById("rent-receipt-document")
      if (!element) {
        window.print()
        return
      }

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ])

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      const pdfWidth = 210
      const margin = 15
      const contentWidth = pdfWidth - margin * 2
      const contentHeight = (canvas.height * contentWidth) / canvas.width

      pdf.addImage(imgData, "PNG", margin, 20, contentWidth, contentHeight, undefined, "FAST")

      const safePeriod = (rentPeriod || "Receipt").replace(/[^a-zA-Z0-9_-]/g, "_")
      pdf.save(`Rent_Receipt_${safePeriod}.pdf`)
    } catch (err) {
      console.error("Direct PDF download fallback to print:", err)
      window.print()
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleReset = () => {
    setTenantName("Rajesh Kumar")
    setLandlordName("Suresh Prasad")
    setLandlordPan("")
    setReceiptNo("REC-2026-01")
    setAmount("15000")
    setAddress("Flat 302, Block B, Sector 62, Noida, UP")
    setRentPeriod("January 2026")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setPaymentMode("Online Transfer")
  }

  const handleCopySummary = () => {
    const text = `🏠 *HRA Rent Receipt Summary:*
• Tenant: ${tenantName}
• Landlord: ${landlordName}
• Monthly Rent: ₹${amount}
• Period: ${rentPeriod}
• Property: ${address}
• Payment Mode: ${paymentMode}
• Date: ${paymentDate}
Generated via: https://www.pkminfotech.com/tools/utility/rent-receipt`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usefulLinks: UsefulLinkItem[] = [
    { label: "HRA Exemption Legality Section 10(13A)", href: "#hra-legal" },
    { label: "The ₹1 Lakh Landlord PAN Rule", href: "#pan-rule" },
    { label: "Revenue Stamp Guidelines", href: "#revenue-stamp" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="rent-receipt-page">
      {/* 1. Unified Hero Header */}
      <div className="d-print-none">
        <ToolHeaderHero
          title={title}
          description={description}
          badgeText="HRA Exemption Proof"
        />
      </div>

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* Main Interactive Tool Console */}
          <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            {/* Top Console Bar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex align-items-center justify-content-between gap-2 d-print-none">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 28, height: 28, backgroundColor: "#eff6ff", color: "#2563eb" }}
                >
                  <FileText size={15} />
                </div>
                <div className="d-flex flex-column">
                  <span className="fw-bold text-dark small" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>
                    Standard HRA Rent Receipt
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Sec 10(13A) IT Act Format
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 7, height: 7 }} />
                  Live Preview
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset to sample data"
                >
                  <RotateCcw size={12} />
                  <span className="small">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 p-md-4">
              {/* Main Two-Column Split */}
              <div className="row g-3 g-md-4 align-items-stretch">
                {/* Left Column: Form Details (Hidden during print) */}
                <div className="col-12 col-lg-6 d-print-none d-flex flex-column justify-content-between">
                  <form onSubmit={handlePrint}>
                    <div className="row g-2 mb-2.5">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-bold text-dark mb-1">Tenant Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-control rounded-3"
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-bold text-dark mb-1">Landlord Name</label>
                        <input
                          type="text"
                          required
                          className="form-control rounded-3"
                          value={landlordName}
                          onChange={(e) => setLandlordName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-2.5">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-bold text-dark mb-1">
                          Landlord PAN {panRequired && <span className="text-danger small">* (&gt;₹1L/yr)</span>}
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          className="form-control rounded-3 text-uppercase"
                          placeholder="e.g. ABCDE1234F"
                          value={landlordPan}
                          onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-bold text-dark mb-1">Receipt Number</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          value={receiptNo}
                          onChange={(e) => setReceiptNo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-2.5">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-dark mb-1">Monthly Rent (₹)</label>
                        <input
                          type="number"
                          required
                          inputMode="decimal"
                          className="form-control rounded-3 fw-bold"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-dark mb-1">Payment Mode</label>
                        <select
                          className="form-select rounded-3"
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        >
                          <option value="Online Transfer">UPI / NetBanking</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-2 mb-2.5">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-dark mb-1">Rent Period</label>
                        <input
                          type="text"
                          required
                          className="form-control rounded-3"
                          placeholder="e.g. January 2026"
                          value={rentPeriod}
                          onChange={(e) => setRentPeriod(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-dark mb-1">Receipt Date</label>
                        <input
                          type="date"
                          required
                          className="form-control rounded-3"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-dark mb-1">Rented Property Address</label>
                      <textarea
                        rows={2}
                        required
                        className="form-control rounded-3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-7">
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          disabled={downloadingPdf}
                          className="btn w-100 text-white d-flex align-items-center justify-content-center gap-1.5 shadow-sm"
                          style={{
                            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "0.86rem",
                            fontWeight: 600,
                            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.22)"
                          }}
                        >
                          {downloadingPdf ? (
                            <>
                              <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" />
                              <span className="text-nowrap">Saving PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download size={15} className="flex-shrink-0" />
                              <span className="text-nowrap">Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="col-5">
                        <button
                          type="button"
                          onClick={() => handlePrint()}
                          className="btn w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            color: "#1e293b",
                            borderRadius: "10px",
                            padding: "10px 12px",
                            fontSize: "0.86rem",
                            fontWeight: 600
                          }}
                        >
                          <Printer size={15} className="flex-shrink-0 text-secondary" />
                          <span className="text-nowrap">Print</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Right Column: Visual Rent Receipt (Only this prints) */}
                <div className="col-12 col-lg-6 rent-receipt-print-col">
                  <div
                    id="rent-receipt-document"
                    className="p-3.5 p-md-4 rounded-4 border bg-white h-100 position-relative shadow-sm rent-receipt-card"
                    style={{
                      border: "2px solid #0f172a",
                      backgroundColor: "#ffffff"
                    }}
                  >
                    {/* Header */}
                    <div className="d-flex align-items-start justify-content-between border-bottom pb-2.5 mb-3">
                      <div>
                        <h2 className="h5 fw-bold text-dark mb-0 text-uppercase tracking-wider" style={{ letterSpacing: "0.04em" }}>
                          HOUSE RENT RECEIPT
                        </h2>
                        <span className="text-secondary small d-block" style={{ fontSize: "0.72rem" }}>
                          Issued under Section 10(13A) of the Income Tax Act, 1961
                        </span>
                        <div className="text-muted small mt-1" style={{ fontSize: "0.7rem" }}>
                          Receipt No: <strong>{receiptNo}</strong> | Date: <strong>{paymentDate}</strong>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fs-4 fw-bolder text-primary mb-0 lh-1">
                          ₹{Number(amount || 0).toLocaleString("en-IN")}
                        </div>
                        {amountInWords && (
                          <div className="text-muted text-capitalize fst-italic mt-1" style={{ fontSize: "0.68rem", maxWidth: 190 }}>
                            {amountInWords}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receipt Statement */}
                    <p className="small text-dark lh-base mb-2.5" style={{ fontSize: "0.85rem" }}>
                      Received with thanks a sum of <strong>₹{Number(amount || 0).toLocaleString("en-IN")}</strong>{" "}
                      {amountInWords ? `(${amountInWords})` : ""} from{" "}
                      <strong className="text-primary">{tenantName || "____________________"}</strong> towards rent of the residential property situated at:
                    </p>
                    <div className="p-2 rounded-2 bg-light border mb-3 small fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                      📍 {address || "________________________________________"}
                    </div>

                    {/* Details Table */}
                    <div className="row g-2 small border-top pt-2.5 mb-3">
                      <div className="col-6">
                        <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Landlord Name:</span>
                        <strong className="text-dark">{landlordName || "____________________"}</strong>
                      </div>
                      <div className="col-6 text-end">
                        <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Payment Mode:</span>
                        <strong className="text-primary">{paymentMode}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Landlord PAN:</span>
                        <strong className="text-dark">
                          {landlordPan || (panRequired ? "Declared (>₹1L/yr)" : "Not Required (<₹1L/yr)")}
                        </strong>
                      </div>
                      <div className="col-6 text-end">
                        <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Rent Period:</span>
                        <strong className="text-dark">{rentPeriod || "____________"}</strong>
                      </div>
                    </div>

                    {/* Stamp & Signature Section */}
                    <div className="d-flex justify-content-between align-items-end mt-3 pt-2.5 border-top">
                      <div>
                        {paymentMode === "Cash" && rentVal > 5000 ? (
                          <div 
                            className="border border-secondary rounded-2 d-flex flex-column align-items-center justify-content-center text-center p-1.5 text-muted"
                            style={{ width: 95, height: 95, borderStyle: "dashed" }}
                          >
                            <span className="fw-bold text-dark" style={{ fontSize: "0.62rem" }}>REVENUE STAMP</span>
                            <span style={{ fontSize: "0.55rem" }}>Affix ₹1 stamp &amp; sign across</span>
                          </div>
                        ) : (
                          <div className="small text-muted" style={{ fontSize: "0.68rem" }}>
                            <span className="d-block text-success fw-semibold">✔ Valid Payment Record</span>
                            <span>Valid proof for employer HRA submission</span>
                          </div>
                        )}
                      </div>

                      <div className="text-center" style={{ minWidth: 160 }}>
                        <div
                          className="border-bottom border-dark text-muted small px-3 py-1 mb-1"
                          style={{ minWidth: 150, borderStyle: "solid" }}
                        >
                          &nbsp;
                        </div>
                        <span className="fw-bold text-dark d-block" style={{ fontSize: "0.78rem" }}>
                          {landlordName || "Landlord Signature"}
                        </span>
                        <span className="text-muted" style={{ fontSize: "0.68rem" }}>
                          Signature of Landlord / Owner
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="row g-2 g-md-2.5 mt-3 d-print-none">
                <div className="col-6 col-md-3">
                  <div 
                    className="rounded-3 p-2.5 p-sm-3 text-center h-100"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #eef2f6" }}
                  >
                    <div className="text-secondary mb-1 fw-semibold" style={{ fontSize: "0.72rem" }}>Monthly Rent</div>
                    <div className="fs-6 fw-bold text-success mt-0.5 mb-0.5">₹{rentVal.toLocaleString()}</div>
                    <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                      Receipt Value
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div 
                    className="rounded-3 p-2.5 p-sm-3 text-center h-100"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #eef2f6" }}
                  >
                    <div className="text-secondary mb-1 fw-semibold" style={{ fontSize: "0.72rem" }}>Annual Rent</div>
                    <div className="fs-6 fw-bold text-dark mt-0.5 mb-0.5">₹{annualRent.toLocaleString()}</div>
                    <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                      12 Months Total
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div 
                    className="rounded-3 p-2.5 p-sm-3 text-center h-100"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #eef2f6" }}
                  >
                    <div className="text-secondary mb-1 fw-semibold" style={{ fontSize: "0.72rem" }}>Landlord PAN</div>
                    <div className={`fs-6 fw-bold mt-0.5 mb-0.5 ${panRequired ? "text-danger" : "text-success"}`}>
                      {panRequired ? "Required (>₹1L)" : "Optional"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                      Sec 10(13A) IT Rule
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div 
                    className="rounded-3 p-2.5 p-sm-3 text-center h-100"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #eef2f6" }}
                  >
                    <div className="text-secondary mb-1 fw-semibold" style={{ fontSize: "0.72rem" }}>Revenue Stamp</div>
                    <div className={`fs-6 fw-bold mt-0.5 mb-0.5 ${revenueStampRequired ? "text-warning" : "text-success"}`}>
                      {revenueStampRequired ? "₹1 Stamp" : "Not Required"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                      Indian Stamp Act
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Action Toolbar */}
              <div className="pt-3 mt-3 border-top d-print-none" style={{ borderColor: "#f1f5f9" }}>
                <div className="row g-2 align-items-center">
                  {/* Primary PDF & Print Actions */}
                  <div className="col-12 col-md-6">
                    <div className="row g-2">
                      <div className="col-7">
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          disabled={downloadingPdf}
                          className="btn w-100 text-white d-flex align-items-center justify-content-center gap-1.5 shadow-sm"
                          style={{
                            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "0.86rem",
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.22)"
                          }}
                        >
                          {downloadingPdf ? (
                            <>
                              <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" />
                              <span className="text-nowrap">Saving PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download size={15} className="flex-shrink-0" />
                              <span className="text-nowrap">Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="col-5">
                        <button
                          type="button"
                          onClick={() => handlePrint()}
                          className="btn w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            color: "#1e293b",
                            borderRadius: "10px",
                            padding: "10px 12px",
                            fontSize: "0.86rem",
                            fontWeight: 600
                          }}
                        >
                          <Printer size={15} className="flex-shrink-0 text-secondary" />
                          <span className="text-nowrap">Print</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Actions: WhatsApp & Copy */}
                  <div className="col-12 col-md-6">
                    <div className="row g-2">
                      <div className="col-6">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `Rent Receipt for ₹${amount}/month generated for ${tenantName}. Create yours: https://www.pkminfotech.com/tools/utility/rent-receipt`
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

                {/* Helpful Instruction Tip explaining Save as PDF on all platforms */}
                <div
                  className="mt-3 p-3 rounded-3 border d-flex align-items-start gap-2.5"
                  style={{
                    backgroundColor: "#f0fdf4",
                    borderColor: "#bbf7d0",
                    fontSize: "0.82rem",
                    color: "#166534"
                  }}
                >
                  <Info size={18} className="text-success flex-shrink-0 mt-0.5" />
                  <div className="w-100">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mb-1">
                      <strong className="text-success-emphasis">
                        💡 PDF फाइल सेव करने का तरीका:
                      </strong>
                      <span className="badge bg-success-subtle text-success border border-success-subtle small fw-medium">
                        बिना प्रिंटर के भी सेव करें
                      </span>
                    </div>
                    <ul className="mb-0 ps-3 text-secondary" style={{ fontSize: "0.79rem", lineHeight: 1.6 }}>
                      <li>
                        <strong>सीधा डाउनलोड (Direct Download):</strong> नीले <strong>"Download PDF"</strong> बटन पर क्लिक करें — रसीद सीधे आपके डिवाइस में PDF फाइल के रूप में सेव हो जाएगी।
                      </li>
                      <li>
                        <strong>अगर Print विंडो खुले:</strong>
                        <ul className="ps-3 mt-0.5">
                          <li><strong>Mac यूज़र्स:</strong> विंडो में नीचे बाईं ओर <strong>"PDF ⌄"</strong> ड्रॉपडाउन पर क्लिक करके <strong>"Save as PDF"</strong> चुनें।</li>
                          <li><strong>Windows / Chrome / Android:</strong> Printer / Destination में से <strong>"Save as PDF"</strong> चुनें।</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Boundary: Interactive Tool (Above) vs Reference Guide & Documentation (Below) */}
          <div className="tool-reference-section-header mt-5 mb-3 pt-3 border-top d-print-none" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span 
                className="badge rounded-pill bg-light text-primary border border-primary-subtle fw-bold px-3 py-1 text-uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
              >
                Official Reference Guide &amp; HRA Compliance
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Comprehensive Guide to HRA Tax Exemption &amp; Rent Receipt Verification
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Legal frameworks under Section 10(13A), PAN criteria, and safety checks to avoid IT department flags.
            </p>
          </div>

          <div className="text-secondary small lh-lg d-print-none">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              Claiming <strong>House Rent Allowance (HRA)</strong> exemption is one of the most effective ways for salaried employees to lower their taxable income in India. To claim HRA successfully, proper documentation in the form of verified rent receipts is mandatory.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="hra-legal">
              <Scale size={16} className="text-primary" /> 1. HRA Exemption Legality: Section 10(13A)
            </h3>
            <p>Under Section 10(13A) of the Income Tax Act, 1961, the HRA exemption is calculated as the minimum of:</p>
            <ol className="ps-3 mb-4">
              <li>Actual HRA component received from employer.</li>
              <li>50% of Basic + DA for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metros.</li>
              <li>Actual rent paid minus 10% of Basic Salary + DA.</li>
            </ol>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="pan-rule">
              <ShieldAlert size={16} className="text-primary" /> 2. Critical Compliance: The ₹1 Lakh PAN Rule
            </h3>
            <p>
              If total annual rent paid exceeds <strong>₹1,00,000</strong> (which is ₹8,333/month), the employee must declare the <strong>PAN of the landlord</strong> to the employer. If the landlord does not have a PAN, a signed declaration in Form 60 must be provided.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="revenue-stamp">
              <Receipt size={16} className="text-primary" /> 3. When is a Revenue Stamp Mandatory?
            </h3>
            <p>
              Under the Indian Stamp Act, if rent is paid in <strong>Cash</strong> and exceeds <strong>₹5,000 per receipt</strong>, a ₹1 revenue stamp must be affixed and signed across by the landlord. For online bank transfers, UPI, or cheques, a revenue stamp is standardly not mandatory.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: Can I pay rent to my parents and claim HRA?</strong>
                <span className="text-muted">Yes. The parents must be legal owners, you must transfer funds via bank account, and they must declare rental income in their ITR.</span>
              </div>
              <div className="mb-3">
                <strong className="text-dark d-block">Q: Can I claim HRA if I also have a home loan?</strong>
                <span className="text-muted">Yes, if your owned home is in a different city due to employment, or if it is let out and you reside in rented premises.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4 d-print-none">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="utility"
              categoryName="Utility & Finance Tools"
              currentPath="/tools/utility/rent-receipt"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .rent-receipt-page {
            padding: 0 !important;
            margin: 0 !important;
          }
          .rent-receipt-print-col {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
          }
          .rent-receipt-card {
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            padding: 24px 28px !important;
            width: 100% !important;
            max-width: 760px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
          }
        }
      `,
        }}
      />
    </div>
  )
}
