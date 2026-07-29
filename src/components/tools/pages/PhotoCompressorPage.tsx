"use client"

import React, { useState, useRef, useEffect } from "react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Image as ImageIcon, Sparkles, Download, RefreshCw, ShieldCheck, HelpCircle } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

const PRESETS = [
  { id: "20kb", label: "Exam photo 20KB", kb: 20 },
  { id: "passport", label: "Passport size 50KB", kb: 50 },
  { id: "signature", label: "Signature 15KB", kb: 15 },
  { id: "50kb", label: "Form photo 50KB", kb: 50 },
] as const

function resolvePresetKb(preset: string | null, fallback: number): number {
  const match = PRESETS.find((p) => p.id === preset)
  return match ? match.kb : fallback
}

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
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("preset")
    if (!preset) return
    setActivePreset(preset)
    setTargetKb(resolvePresetKb(preset, defaultTargetKb))
  }, [defaultTargetKb])

  const applyPreset = (id: string, kb: number) => {
    setActivePreset(id)
    setTargetKb(kb)
    const url = new URL(window.location.href)
    url.searchParams.set("preset", id)
    window.history.replaceState({}, "", url.toString())
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
      ctx.drawImage(img, 0, 0, w, h)

      let quality = 0.9
      let dataUrl = ""
      let size = 0

      for (let i = 0; i < 6; i++) {
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB"
    return (bytes / 1024).toFixed(1) + " KB"
  }

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Utility", href: basePath },
          { label: title },
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="mb-2 mb-md-3">
        <p className="small text-secondary mb-1 fw-semibold">Quick presets</p>
        <div className="chip-row mb-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`chip ${activePreset === preset.id ? "chip-active" : ""}`}
              onClick={() => applyPreset(preset.id, preset.kb)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4 mb-3">
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <ImageIcon size={18} className="text-primary" /> Upload Image
            </h2>
            <div
              className="border border-2 border-dashed rounded-3 p-4 text-center bg-light cursor-pointer mb-3"
              style={{ borderColor: "#dbe7f7", cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
              />
              <ImageIcon size={42} className="text-primary-emphasis opacity-50 mb-2" />
              <p className="small mb-1 text-dark fw-semibold">Click to select image file</p>
              <p className="small text-secondary mb-0">Supports JPG, JPEG, PNG formats</p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-secondary">File Name:</span>
                  <span className="fw-semibold text-dark">{selectedFile.name}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-secondary">Original Size:</span>
                  <span className="fw-semibold text-dark">{formatSize(originalSize)}</span>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="targetSize" className="form-label small fw-semibold text-secondary d-flex justify-content-between">
                <span>Target Max File Size</span>
                <span className="text-primary fw-bold">{targetKb} KB</span>
              </label>
              <input
                id="targetSize"
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
              <div className="d-flex justify-content-between small text-secondary">
                <span>10 KB (Form photos)</span>
                <span>200 KB</span>
              </div>
            </div>

            <button
              onClick={compressImage}
              disabled={!selectedFile || compressing}
              className="btn btn-primary w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            >
              {compressing ? (
                <>
                  <RefreshCw size={16} className="spinner-border spinner-border-sm" /> Compressing...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Compress Image
                </>
              )}
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Sparkles size={18} className="text-primary" /> Compressed Result
            </h2>
            {compressedUrl ? (
              <div className="text-center h-100 d-flex flex-column justify-content-between">
                <div className="bg-light border rounded-3 p-3 mb-3 d-inline-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                  <img
                    src={compressedUrl}
                    alt="Compressed output"
                    className="img-fluid rounded border bg-white"
                    style={{ maxHeight: 220, objectFit: "contain" }}
                  />
                </div>
                <div className="p-3 bg-light rounded-3 border mb-3 text-start">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-secondary">New File Size:</span>
                    <span className="fw-bold text-success">{formatSize(compressedSize)}</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-secondary">Reduction Ratio:</span>
                    <span className="fw-semibold text-dark">
                      {(((originalSize - compressedSize) / originalSize) * 100).toFixed(0)}% smaller
                    </span>
                  </div>
                </div>
                <a
                  href={compressedUrl}
                  download={`compressed-${selectedFile?.name || "image.jpg"}`}
                  className="btn btn-success w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                >
                  <Download size={16} /> Download Image
                </a>
              </div>
            ) : (
              <div className="text-center text-secondary h-100 d-flex flex-column justify-content-center align-items-center py-5">
                <ImageIcon size={42} className="opacity-25 mb-2" />
                <p className="small mb-0">Compressed preview will appear here after clicking &quot;Compress Image&quot;.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToolFocusAd />

      <section className="flat-content-section border-top pt-4 mt-4">
        <GuideSectionHeader
          title="The Ultimate Guide to Photo and Signature Compression for Indian Competitive Examinations"
          subtitle="Image processing logic, portal specifications, and step-by-step guidance to avoid form rejections"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: "1.05rem", fontWeight: 400 }}>
            Applying for government jobs in India—including boards like **SSC (Staff Selection Commission)**, **UPSC (Union Public Service Commission)**, **IBPS (Banking)**, and state-level exams—requires filling out long registration forms. A very common issue candidates face is when their scanned passport photograph or signature fails to upload because the file size exceeds the strict limits (standardly **20kb to 50kb** for photos, and **10kb to 20kb** for signatures).
          </p>

          <h3 className="guide-subheading">
            <ShieldCheck size={18} className="text-primary" /> 1. How Client-Side Browser Compression Works
          </h3>
          <p>
            When you use standard online compressors, your private passport photo is sent to a server over the internet. This poses security and privacy risks. Our tool uses **HTML5 Canvas technology** to process images entirely inside your browser.
          </p>
          <p>When you select a file:</p>
          <ol className="ps-3 mb-4">
            <li>The browser reads the image file locally without uploading it to any external server.</li>
            <li>The image is drawn on a virtual canvas, scaling its overall pixel boundaries to a web-friendly size (standardly keeping aspect ratios intact).</li>
            <li>The tool runs a fast loop that adjusts the compression quality factor (between 0.1 and 1.0) and generates temporary JPEGs until the estimated file size matches your requested target limit (e.g. 20kb or 50kb).</li>
            <li>Since the operations are completed client-side, the process is instantaneous and keeps your private data secure on your own device.</li>
          </ol>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">2. Official Exam Portal Photo &amp; Signature Criteria</h3>
          <p>To prevent form rejection, review the table below outlining specifications required by major government recruitment boards:</p>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2 mb-4">
              <thead>
                <tr className="table-light">
                  <th>Recruitment Board</th>
                  <th>Document Type</th>
                  <th>Allowed File Size</th>
                  <th>Allowed Dimensions (cm)</th>
                  <th>Resolution (Pixel Range)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SSC CGL / CHSL / MTS</strong></td>
                  <td>Photograph</td>
                  <td>20 KB - 50 KB</td>
                  <td>3.5 cm x 4.5 cm</td>
                  <td>350 x 450 px</td>
                </tr>
                <tr>
                  <td><strong>SSC CGL / CHSL / MTS</strong></td>
                  <td>Signature</td>
                  <td>10 KB - 20 KB</td>
                  <td>4.0 cm x 2.0 cm</td>
                  <td>400 x 200 px</td>
                </tr>
                <tr>
                  <td><strong>UPSC IAS / IPS</strong></td>
                  <td>Photo &amp; Signature</td>
                  <td>20 KB - 300 KB</td>
                  <td>3.5 cm x 3.5 cm</td>
                  <td>Minimum 350 x 350 px</td>
                </tr>
                <tr>
                  <td><strong>IBPS PO / Clerk</strong></td>
                  <td>Photograph</td>
                  <td>20 KB - 50 KB</td>
                  <td>4.5 cm x 3.5 cm</td>
                  <td>200 x 230 px</td>
                </tr>
                <tr>
                  <td><strong>IBPS PO / Clerk</strong></td>
                  <td>Signature</td>
                  <td>10 KB - 20 KB</td>
                  <td>3.0 cm x 1.5 cm</td>
                  <td>140 x 60 px</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">3. Crucial Rules to Avoid Application Rejections</h3>
          <p>An incorrect file size is not the only reason photographs get rejected. The automated image scanners used by portals check for several visual standards:</p>
          <ul className="ps-3 mb-4">
            <li><strong>Face Coverage:</strong> Your face must occupy at least 70% to 80% of the photograph area. The camera must look straight at your face. Avoid side profiles.</li>
            <li><strong>Background Contrast:</strong> Portals prefer a clean, light-colored background—white or light blue are standard. Avoid dark or textured backgrounds.</li>
            <li><strong>Spectacles &amp; Eyewear:</strong> In recent years, SSC has rejected photos showing candidates wearing spectacles due to flash reflections. Take off your glasses before taking the photo. Caps, hats, and headphones are strictly forbidden.</li>
            <li><strong>Recent Capture:</strong> The photograph must be captured recently, standardly not older than 3 months from the notification date. Some portals (like UPSC) require you to write the date of capture on the lower half of the photo.</li>
            <li><strong>Signature ink rules:</strong> Always sign on a clean white paper using a **black ink pen**. Blue ink signatures are sometimes flagged as low contrast by scanned readers.</li>
          </ul>

          <h3 className="guide-subheading">
            <HelpCircle size={18} className="text-primary" /> 4. Frequently Asked Questions (FAQ)
          </h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: Can I compress PNG images using this tool?</h4>
              <p className="text-muted mb-0">
                Yes, our tool supports PNG uploads. However, since PNG files use lossless compression, they are standardly much heavier. To hit target limits like 20kb, the tool automatically converts the output to JPEG format, which is the exact format required by official portals anyway.
              </p>
            </div>
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: Why does my photo look blurry after compression?</h4>
              <p className="text-muted mb-0">
                If the original photo is already low-resolution, compressing it down to 20kb can make it look blurry. For best results, upload a sharp, high-resolution photo from your phone or camera, and let the tool optimize it.
              </p>
            </div>
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: How do I scan my passport photo using my phone?</h4>
              <p className="text-muted mb-0">
                Place the physical photograph on a flat surface in good lighting. Take a photo from your phone, crop out any extra table space, and upload the cropped file directly to our compressor.
              </p>
            </div>
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q4: Is there a limit to how many images I can compress?</h4>
              <p className="text-muted mb-0">
                No. Since all operations run locally in your browser without utilizing our server bandwidth, you can compress as many photos and signatures as you need, completely free of charge.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
