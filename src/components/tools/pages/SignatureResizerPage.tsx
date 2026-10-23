"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Upload,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Check,
  Sparkles,
  RotateCcw,
  Share2
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

interface PresetConfig {
  id: string
  name: string
  subtitle: string
  minKb: number
  maxKb: number
  targetWidth?: number
  targetHeight?: number
  keepAspectRatio: boolean
  tag: string
}

const PRESETS: PresetConfig[] = [
  {
    id: "ssc-sig",
    name: "SSC Signature",
    subtitle: "140 × 60 px, 10KB – 20KB",
    minKb: 10,
    maxKb: 20,
    targetWidth: 140,
    targetHeight: 60,
    keepAspectRatio: false,
    tag: "SSC CGL / CHSL / MTS",
  },
  {
    id: "ssc-photo",
    name: "SSC Photo",
    subtitle: "200 × 230 px, 20KB – 50KB",
    minKb: 20,
    maxKb: 50,
    targetWidth: 200,
    targetHeight: 230,
    keepAspectRatio: false,
    tag: "SSC 3.5cm × 4.5cm",
  },
  {
    id: "bank-thumb",
    name: "IBPS Thumb",
    subtitle: "240 × 240 px, 20KB – 50KB",
    minKb: 20,
    maxKb: 50,
    targetWidth: 240,
    targetHeight: 240,
    keepAspectRatio: true,
    tag: "IBPS / SBI Clerk / PO",
  },
  {
    id: "upsc-sig",
    name: "UPSC / PSC Sig",
    subtitle: "350 × 150 px, 20KB – 50KB",
    minKb: 20,
    maxKb: 50,
    targetWidth: 350,
    targetHeight: 150,
    keepAspectRatio: true,
    tag: "UPSC / State PCS",
  },
  {
    id: "custom",
    name: "Custom Size",
    subtitle: "Set your own limits",
    minKb: 10,
    maxKb: 20,
    keepAspectRatio: true,
    tag: "Custom",
  },
]

export default function SignatureResizerPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [selectedPreset, setSelectedPreset] = useState<PresetConfig>(PRESETS[0])
  const [file, setFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)

  // Custom Controls
  const [customMinKb, setCustomMinKb] = useState<number>(10)
  const [customMaxKb, setCustomMaxKb] = useState<number>(20)
  const [customWidth, setCustomWidth] = useState<number>(140)
  const [customHeight, setCustomHeight] = useState<number>(60)

  // Processed Output
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [processedDimensions, setProcessedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [processedSizeKb, setProcessedSizeKb] = useState<number>(0)
  const [processing, setProcessing] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const effectiveMin = selectedPreset.id === "custom" ? customMinKb : selectedPreset.minKb
  const effectiveMax = selectedPreset.id === "custom" ? customMaxKb : selectedPreset.maxKb

  const applyPreset = (preset: PresetConfig) => {
    setSelectedPreset(preset)
    if (preset.id !== "custom") {
      setCustomMinKb(preset.minKb)
      setCustomMaxKb(preset.maxKb)
      if (preset.targetWidth) setCustomWidth(preset.targetWidth)
      if (preset.targetHeight) setCustomHeight(preset.targetHeight)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setOriginalSizeKb(Math.round(f.size / 1024))

    const url = URL.createObjectURL(f)
    setOriginalUrl(url)

    const img = new Image()
    img.src = url
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height })
    }
  }

  const processImage = useCallback(async () => {
    if (!file || !originalUrl) return
    setProcessing(true)

    const img = new Image()
    img.src = originalUrl
    await new Promise((resolve) => {
      img.onload = resolve
    })

    const targetMinBytes = effectiveMin * 1024
    const targetMaxBytes = effectiveMax * 1024

    let destW: number
    let destH: number

    if (selectedPreset.id === "custom") {
      destW = customWidth > 0 ? customWidth : img.width
      destH = customHeight > 0 ? customHeight : img.height
    } else if (selectedPreset.targetWidth && selectedPreset.targetHeight) {
      if (selectedPreset.keepAspectRatio) {
        const ratio = Math.min(selectedPreset.targetWidth / img.width, selectedPreset.targetHeight / img.height)
        destW = Math.round(img.width * ratio)
        destH = Math.round(img.height * ratio)
      } else {
        destW = selectedPreset.targetWidth
        destH = selectedPreset.targetHeight
      }
    } else {
      destW = img.width
      destH = img.height
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setProcessing(false)
      return
    }

    const testCompress = (scale: number, quality: number): Promise<Blob | null> => {
      const curW = Math.max(20, Math.round(destW * scale))
      const curH = Math.max(20, Math.round(destH * scale))
      canvas.width = curW
      canvas.height = curH

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, curW, curH)
      ctx.drawImage(img, 0, 0, curW, curH)

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality)
      })
    }

    let bestBlob: Blob | null = null
    let bestScale = 1.0

    let lowQ = 0.05
    let highQ = 0.98

    for (let iter = 0; iter < 8; iter++) {
      const midQ = (lowQ + highQ) / 2
      const blob = await testCompress(1.0, midQ)
      if (!blob) break

      bestBlob = blob
      bestScale = 1.0

      if (blob.size >= targetMinBytes && blob.size <= targetMaxBytes) {
        break
      }

      if (blob.size > targetMaxBytes) {
        highQ = midQ
      } else {
        lowQ = midQ
      }
    }

    if (bestBlob && bestBlob.size > targetMaxBytes) {
      let scale = 0.85
      while (scale >= 0.2) {
        const blob = await testCompress(scale, 0.45)
        if (blob) {
          bestBlob = blob
          bestScale = scale
          if (blob.size <= targetMaxBytes) break
        }
        scale -= 0.15
      }
    }

    if (bestBlob) {
      setProcessedBlob(bestBlob)
      const outUrl = URL.createObjectURL(bestBlob)
      setProcessedUrl(outUrl)
      setProcessedSizeKb(Math.round((bestBlob.size / 1024) * 10) / 10)
      setProcessedDimensions({
        width: Math.round(destW * bestScale),
        height: Math.round(destH * bestScale),
      })
    }

    setProcessing(false)
  }, [file, originalUrl, effectiveMin, effectiveMax, selectedPreset, customWidth, customHeight])

  useEffect(() => {
    if (file) {
      processImage()
    }
  }, [file, selectedPreset, customMinKb, customMaxKb, customWidth, customHeight, processImage])

  const handleDownload = () => {
    if (!processedUrl) return
    const link = document.createElement("a")
    link.href = processedUrl
    const prefix = selectedPreset.id === "ssc-sig" ? "ssc_signature" : selectedPreset.id === "ssc-photo" ? "ssc_photo" : "resized_govt_exam_image"
    link.download = `${prefix}_${Math.round(processedSizeKb)}kb.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isSizeValid = processedSizeKb >= effectiveMin && processedSizeKb <= effectiveMax

  const usefulLinks: UsefulLinkItem[] = [
    { label: "Official Photo & Sig Dimension Standards", href: "#dimensions-guide" },
    { label: "Client-Side Zero Server Upload Security", href: "#security-guarantee" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="signature-resizer-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="10KB–20KB Exam Sizing"
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
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                      selectedPreset.id === p.id ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                  >
                    {p.name} ({p.minKb}–{p.maxKb}KB)
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                  Live Resizer
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setOriginalUrl(null)
                    setProcessedBlob(null)
                    setProcessedUrl(null)
                  }}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset"
                >
                  <RotateCcw size={13} />
                  <span className="small">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 p-md-4">
              {/* Custom Settings Drawer (if selected) */}
              {selectedPreset.id === "custom" && (
                <div className="p-3 bg-light rounded-3 border mb-3.5">
                  <span className="small fw-bold text-dark d-block mb-2">Custom Dimensions &amp; Size Range:</span>
                  <div className="row g-2">
                    <div className="col-6 col-md-3">
                      <label className="form-label small text-secondary mb-0">Min KB</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={customMinKb}
                        onChange={(e) => setCustomMinKb(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small text-secondary mb-0">Max KB</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={customMaxKb}
                        onChange={(e) => setCustomMaxKb(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small text-secondary mb-0">Width (px)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small text-secondary mb-0">Height (px)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Drop Zone if no file */}
              {!file ? (
                <div
                  className="border border-2 border-dashed rounded-4 p-4 p-md-5 text-center bg-light cursor-pointer mb-3"
                  style={{ borderColor: "#93c5fd", cursor: "pointer" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                  <div className="d-inline-flex p-3 rounded-circle bg-primary-subtle text-primary mb-2.5">
                    <Upload size={32} />
                  </div>
                  <h4 className="h6 fw-bold mb-1">Click to Upload Signature or Photo</h4>
                  <p className="text-secondary small mb-3">
                    Target Preset: <strong>{selectedPreset.name}</strong> ({effectiveMin}KB – {effectiveMax}KB)
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary px-4 py-2 fw-semibold shadow-xs"
                    style={{ borderRadius: "10px", fontSize: "0.88rem" }}
                  >
                    Select Image File
                  </button>
                </div>
              ) : (
                /* Dual Preview Comparison */
                <div>
                  <div className="row g-3 align-items-center mb-3">
                    {/* Original Preview */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-light rounded-3 border text-center h-100">
                        <span className="small text-muted fw-bold d-block mb-1.5">Original Upload</span>
                        <div
                          className="d-flex align-items-center justify-content-center bg-white rounded-3 p-2 mb-2 border"
                          style={{ height: 140 }}
                        >
                          {originalUrl && (
                            <img
                              src={originalUrl}
                              alt="Original Signature"
                              className="img-fluid rounded"
                              style={{ maxHeight: 120, objectFit: "contain" }}
                            />
                          )}
                        </div>
                        <div className="small text-secondary">
                          Size: <strong className="text-danger">{originalSizeKb} KB</strong> • {originalDimensions.width}×{originalDimensions.height}px
                        </div>
                      </div>
                    </div>

                    {/* Resized Result Preview */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-light rounded-3 border border-primary border-opacity-50 text-center h-100 position-relative">
                        <span className="small text-primary fw-bold d-block mb-1.5">Resized for Portal</span>
                        <div
                          className="d-flex align-items-center justify-content-center bg-white rounded-3 p-2 mb-2 border"
                          style={{ height: 140 }}
                        >
                          {processing ? (
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Resizing...</span>
                            </div>
                          ) : processedUrl ? (
                            <img
                              src={processedUrl}
                              alt="Resized Signature"
                              className="img-fluid rounded border"
                              style={{ maxHeight: 120, objectFit: "contain" }}
                            />
                          ) : null}
                        </div>
                        <div className="small text-secondary">
                          Output: <strong className={isSizeValid ? "text-success fw-bold" : "text-warning fw-bold"}>
                            {processedSizeKb} KB
                          </strong> • {processedDimensions.width}×{processedDimensions.height}px
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Action */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="btn btn-primary w-100 w-sm-auto px-4 py-2.5 fw-bold shadow-sm d-inline-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: "10px", fontSize: "0.92rem" }}
                      onClick={handleDownload}
                      disabled={!processedUrl || processing}
                    >
                      <Download size={18} className="flex-shrink-0" />
                      <span className="text-nowrap">Download Resized Image ({processedSizeKb} KB)</span>
                    </button>
                    <span className="d-block text-muted small mt-1.5" style={{ fontSize: "0.75rem" }}>
                      Accepted by SSC, UPSC, IBPS, and State PCS online portals
                    </span>
                  </div>
                </div>
              )}

              {/* 4 KPI Metric Cards */}
              <div className="row g-2 g-md-3 mt-3">
                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Target Limits</div>
                    <div className="fs-6 fw-bold text-dark mt-1 mb-1">{effectiveMin}–{effectiveMax} KB</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Strict Exam Band
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Processed Size</div>
                    <div className={`fs-5 fw-bold mt-0.5 mb-0.5 ${isSizeValid ? "text-success" : "text-primary"}`}>
                      {processedSizeKb > 0 ? `${processedSizeKb} KB` : "Waiting"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Exact File Size
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Format</div>
                    <div className="fs-5 fw-bold text-dark mt-0.5 mb-0.5">JPEG / JPG</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      White Background
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Portal Verdict</div>
                    <div className={`fs-6 fw-bold mt-1 mb-1 ${isSizeValid ? "text-success" : "text-muted"}`}>
                      {isSizeValid ? "Accepted ✓" : "Pending Image"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Form Upload Safe
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Actions */}
              <div className="d-flex flex-wrap gap-2 pt-3 mt-3 border-top justify-content-between align-items-center">
                <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
                  100% Privacy Protected. Processed inside your device browser with zero uploads.
                </span>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Resize exam signatures to strictly 10KB–20KB and photos to 20KB–50KB directly in your browser: https://www.pkminfotech.com/tools/utility/signature-resizer-10-to-20-kb`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-white d-inline-flex align-items-center justify-content-center gap-1.5 text-decoration-none shadow-xs w-100 w-sm-auto"
                  style={{
                    backgroundColor: "#25D366",
                    borderRadius: "10px",
                    padding: "9px 16px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)"
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span className="text-nowrap">Share on WhatsApp</span>
                </a>
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
                Official Reference Guide &amp; Dimension Table
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Official Photo &amp; Signature Dimensions Guide for Govt Portals
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Standard pixel dimensions, resolution, and KB thresholds required by SSC, UPSC, and IBPS portals.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="dimensions-guide">1. Agency Specifications Reference Table</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>Agency / Exam</th>
                    <th>Document</th>
                    <th>File Size Limit</th>
                    <th>Pixel Dimensions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { agency: "SSC CGL / CHSL / MTS", doc: "Signature", size: "10.0 KB – 20.0 KB", px: "140 × 60 px" },
                    { agency: "SSC CGL / CHSL / MTS", doc: "Photo", size: "20.0 KB – 50.0 KB", px: "200 × 230 px" },
                    { agency: "UPSC Civil Services", doc: "Photo & Sig", size: "20.0 KB – 300.0 KB", px: "350 × 350 px min" },
                    { agency: "IBPS / SBI Clerk & PO", doc: "Thumb Impression", size: "20.0 KB – 50.0 KB", px: "240 × 240 px" },
                    { agency: "Banking Exams", doc: "Handwritten Dec.", size: "50.0 KB – 100.0 KB", px: "800 × 400 px" },
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.agency}</strong></td>
                      <td>{row.doc}</td>
                      <td><span className="badge bg-success-subtle text-success">{row.size}</span></td>
                      <td>{row.px}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="security-guarantee">
              <ShieldCheck size={16} className="text-primary" /> 2. Security Guarantee: 100% Client-Side
            </h3>
            <p>
              Your personal photographs and signatures are never sent to our servers. All operations happen in-memory via HTML5 canvas, protecting your sensitive biometric identity from data breaches.
            </p>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="utility"
              categoryName="Utility & Image Tools"
              currentPath="/tools/utility/signature-resizer-10-to-20-kb"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
