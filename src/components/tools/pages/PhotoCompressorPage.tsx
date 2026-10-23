"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  RotateCcw,
  SlidersHorizontal,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Upload
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

const PRESETS = [
  { id: "20kb", label: "Exam photo 20KB", kb: 20 },
  { id: "passport", label: "Passport size 50KB", kb: 50 },
  { id: "signature", label: "Signature 15KB", kb: 15 },
  { id: "100kb", label: "Admit Card 100KB", kb: 100 },
] as const

export default function PhotoCompressorPage({
  title,
  description,
  basePath,
  defaultTargetKb = 50,
}: {
  title: string
  description: string
  basePath: string
  defaultTargetKb?: number
  focusLabel?: string
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [targetKb, setTargetKb] = useState<number>(defaultTargetKb)
  const [activePreset, setActivePreset] = useState<string | null>("passport")
  const [compressing, setCompressing] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("preset")
    if (!preset) return
    const match = PRESETS.find((p) => p.id === preset)
    if (match) {
      setActivePreset(preset)
      setTargetKb(match.kb)
    }
  }, [])

  const applyPreset = (id: string, kb: number) => {
    setActivePreset(id)
    setTargetKb(kb)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSize(file.size)
    setPreviewUrl(URL.createObjectURL(file))
    setCompressedUrl(null)
    setCompressedSize(0)
  }

  const compressImage = () => {
    if (!selectedFile || !previewUrl) return
    setCompressing(true)

    const img = new Image()
    img.src = previewUrl
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const maxW = 800
      let w = img.width
      let h = img.height

      if (w > maxW) {
        h = Math.round((h * maxW) / w)
        w = maxW
      }

      canvas.width = w
      canvas.height = h

      // Fill white background for PNG transparent support
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)

      let quality = 0.92
      let dataUrl = ""
      let size = 0

      for (let i = 0; i < 7; i++) {
        dataUrl = canvas.toDataURL("image/jpeg", quality)
        size = Math.round((dataUrl.length - 814) / 1.37)
        const sizeKb = size / 1024

        if (sizeKb <= targetKb) break
        quality -= 0.15
        if (quality < 0.1) quality = 0.1
      }

      setCompressedUrl(dataUrl)
      setCompressedSize(size)
      setCompressing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCompressedUrl(null)
    setOriginalSize(0)
    setCompressedSize(0)
    setTargetKb(defaultTargetKb)
    setActivePreset("passport")
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB"
    return (bytes / 1024).toFixed(1) + " KB"
  }

  const reductionPercent = originalSize > 0 && compressedSize > 0
    ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(0)
    : "0"

  const usefulLinks: UsefulLinkItem[] = [
    { label: "Client-Side Compression Privacy", href: "#compression-engine" },
    { label: "Govt Exam Photo Specifications", href: "#exam-specs" },
    { label: "Rules to Avoid Form Rejection", href: "#rules" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="photo-compressor-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="100% Client-Side Privacy"
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
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id, preset.kb)}
                    className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                      activePreset === preset.id ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                  Live Engine
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset"
                >
                  <RotateCcw size={13} />
                  <span className="small">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 p-md-4">
              {/* Main Two-Column Split */}
              <div className="row g-3 g-md-4 align-items-stretch">
                {/* Left Column: Image Upload & Target Size */}
                <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
                  <div>
                    {/* Drag & Drop Upload Zone */}
                    <div
                      className="border border-2 border-dashed rounded-3 p-3 p-sm-4 text-center bg-light cursor-pointer mb-3"
                      style={{ borderColor: "#93c5fd", cursor: "pointer" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="d-none"
                        accept="image/jpeg, image/png, image/jpg, image/webp"
                        onChange={handleFileChange}
                      />
                      <Upload size={32} className="text-primary opacity-75 mb-1.5" />
                      <p className="small mb-1 text-dark fw-bold">
                        {selectedFile ? selectedFile.name : "Click to select Photo or Signature"}
                      </p>
                      <span className="small text-muted" style={{ fontSize: "0.72rem" }}>
                        {selectedFile
                          ? `Original Size: ${formatSize(originalSize)}`
                          : "Supports JPG, JPEG, PNG, WEBP (Processed locally)"}
                      </span>
                    </div>

                    {/* Target File Size Slider */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label htmlFor="targetRange" className="form-label small fw-bold text-dark mb-0">
                          Target Max File Size:
                        </label>
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold px-2.5 py-1" style={{ fontSize: "0.85rem" }}>
                          {targetKb} KB
                        </span>
                      </div>
                      <input
                        id="targetRange"
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        className="form-range"
                        value={targetKb}
                        onChange={(e) => {
                          setActivePreset(null)
                          setTargetKb(parseInt(e.target.value, 10))
                        }}
                      />
                      <div className="d-flex justify-content-between small text-muted" style={{ fontSize: "0.72rem" }}>
                        <span>10 KB (Signatures)</span>
                        <span>50 KB (Photos)</span>
                        <span>200 KB</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={compressImage}
                    disabled={!selectedFile || compressing}
                    className="btn btn-primary w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  >
                    {compressing ? (
                      <>
                        <RefreshCw size={16} className="spinner-border spinner-border-sm" /> Compressing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Compress Image to {targetKb} KB
                      </>
                    )}
                  </button>
                </div>

                {/* Right Column: Hero Gradient Result Box / Preview */}
                <div className="col-12 col-lg-6">
                  {compressedUrl ? (
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
                            COMPRESSED OUTPUT
                          </span>
                          <span
                            className="badge rounded-pill fw-bold px-2.5 py-1"
                            style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}
                          >
                            ● {reductionPercent}% Smaller
                          </span>
                        </div>

                        <div className="text-center my-2">
                          <img
                            src={compressedUrl}
                            alt="Compressed result"
                            className="img-fluid rounded-3 border bg-white shadow-sm"
                            style={{ maxHeight: 130, objectFit: "contain" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div
                          className="rounded-3 p-2.5 mb-2.5"
                          style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(6px)" }}
                        >
                          <div className="row g-2 small">
                            <div className="col-6 d-flex justify-content-between">
                              <span className="opacity-75">New Size:</span>
                              <strong className="text-warning">{formatSize(compressedSize)}</strong>
                            </div>
                            <div className="col-6 d-flex justify-content-between">
                              <span className="opacity-75">Target:</span>
                              <strong>≤ {targetKb} KB</strong>
                            </div>
                          </div>
                        </div>

                        <a
                          href={compressedUrl}
                          download={`compressed-${targetKb}kb-${selectedFile?.name || "photo.jpg"}`}
                          className="btn btn-success w-100 rounded-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm text-decoration-none"
                        >
                          <Download size={16} /> Download Resized Image
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-center align-items-center text-center shadow"
                      style={{
                        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                        minHeight: 280
                      }}
                    >
                      <ImageIcon size={48} className="opacity-50 mb-3" />
                      <h4 className="h6 fw-bold mb-1">Instant Compressed Preview</h4>
                      <p className="small opacity-80 mb-0" style={{ maxWidth: 260 }}>
                        Select your image on the left and click Compress to download your exam-ready file.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="row g-2 g-md-3 mt-3">
                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Target Limit</div>
                    <div className="fs-5 fw-bold text-primary mt-0.5 mb-0.5">{targetKb} KB</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Max Allowed
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Compressed Size</div>
                    <div className="fs-5 fw-bold text-success mt-0.5 mb-0.5">
                      {compressedSize > 0 ? formatSize(compressedSize) : "Pending"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Output Result
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Reduction</div>
                    <div className="fs-5 fw-bold text-dark mt-0.5 mb-0.5">{reductionPercent}%</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Bandwidth Saved
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Privacy Safety</div>
                    <div className="fs-6 fw-bold text-success mt-1 mb-1">100% Private</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Zero Server Upload
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Actions */}
              <div className="d-flex flex-wrap gap-2 pt-3 mt-3 border-top justify-content-between align-items-center">
                <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
                  All image compression occurs 100% locally in your browser. Nothing is ever sent to any server.
                </span>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Compress exam photos and signatures to 20KB/50KB directly in your browser: https://www.pkminfotech.com/tools/utility/photo-compressor`
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
                Official Reference Guide &amp; Image Standards
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              The Ultimate Guide to Photo and Signature Compression for Indian Examinations
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Image processing logic, portal specifications, and step-by-step guidance to avoid form rejections.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <p className="lead text-dark mb-4" style={{ fontSize: '1.025rem', fontWeight: 400 }}>
              Applying for government recruitment in India (SSC, UPSC, IBPS, Railways) requires strict compliance with photograph and signature file limits (standardly <strong>20KB to 50KB</strong> for photos, and <strong>10KB to 20KB</strong> for signatures).
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-1.5" id="compression-engine">
              <ShieldCheck size={16} className="text-primary" /> 1. How Client-Side Browser Compression Works
            </h3>
            <p>
              Unlike conventional online compressors that upload your private photos to remote servers, our tool processes images client-side using the <strong>HTML5 Canvas API</strong>. The image is rendered and rescaled in local memory, keeping your documents secure and confidential.
            </p>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="exam-specs">2. Official Exam Portal Photo &amp; Signature Criteria</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-2 mb-4">
                <thead>
                  <tr className="table-light">
                    <th>Exam Agency</th>
                    <th>Document</th>
                    <th>Allowed Size</th>
                    <th>Dimensions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { agency: "SSC CGL / CHSL / MTS", doc: "Photograph", size: "20 KB - 50 KB", dim: "3.5 cm × 4.5 cm" },
                    { agency: "SSC CGL / CHSL / MTS", doc: "Signature", size: "10 KB - 20 KB", dim: "4.0 cm × 2.0 cm" },
                    { agency: "UPSC Civil Services", doc: "Photo & Sig", size: "20 KB - 300 KB", dim: "350 × 350 px min" },
                    { agency: "IBPS PO / Clerk", doc: "Thumb Impression", size: "20 KB - 50 KB", dim: "240 × 240 px" },
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.agency}</strong></td>
                      <td>{row.doc}</td>
                      <td>{row.size}</td>
                      <td>{row.dim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="rules">3. Important Rules to Avoid Rejections</h3>
            <ul className="ps-3 mb-4">
              <li><strong>Face Coverage:</strong> Ensure 70% to 80% face coverage with a plain white or light-colored background.</li>
              <li><strong>No Eyewear / Caps:</strong> Spectacles and caps cause flash reflections and lead to automatic photo rejections.</li>
              <li><strong>Signature Ink:</strong> Always sign using a black ink pen on clean white unruled paper for high contrast scanning.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">4. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: Does compression reduce photo clarity?</strong>
                <span className="text-muted">Our smart algorithm retains maximum facial sharpness while compressing file metadata and smooth color spaces to hit the required KB size.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="utility"
              categoryName="Utility & Image Tools"
              currentPath="/tools/utility/photo-compressor"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
