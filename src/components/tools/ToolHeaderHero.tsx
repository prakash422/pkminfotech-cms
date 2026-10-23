"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Sparkles, Share2, Check } from "lucide-react"

export interface FilterChip {
  label: string
  mobileLabel?: string
  href?: string
  active?: boolean
  onClick?: () => void
}

interface ToolHeaderHeroProps {
  title: string
  description: string
  chips?: FilterChip[]
  badgeText?: string
  shareTitle?: string
}

export default function ToolHeaderHero({
  title,
  description,
  chips,
  badgeText = "Free Online Tool",
  shareTitle
}: ToolHeaderHeroProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  React.useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const url = currentUrl || window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle || title,
          text: `Check out this free tool: ${title}`,
          url,
        })
        return
      } catch {
        // user cancelled or fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  // Sanitize badge text: avoid long text, duplicate titles, or technical jargon
  const cleanBadgeText = (badgeText || "Free Online Tool")
    .replace(/^[⚡✦*]\s*/g, "")
    .replace(/^Official\s+Official/gi, "Official")
    .replace(/Engine/gi, "")
    .replace(/·\s*100%\s*Client-Side/gi, "")
    .replace(/·\s*Instant\s*Calculation/gi, "· Instant")
    .trim()

  let displayBadge = cleanBadgeText
  if (displayBadge.length > 25) {
    if (/marking scheme|evaluation/i.test(displayBadge)) displayBadge = "Official Marking Scheme"
    else if (/salary|pay matrix/i.test(displayBadge)) displayBadge = "7th Pay Matrix (50% DA)"
    else if (/cutoff/i.test(displayBadge)) displayBadge = "Category Cutoff Predictor"
    else if (/normalization/i.test(displayBadge)) displayBadge = "Multi-Shift Normalization"
    else if (/qualifying/i.test(displayBadge)) displayBadge = "Official Qualifying Criteria"
    else if (/eligibility/i.test(displayBadge)) displayBadge = "Official Eligibility Criteria"
    else if (/pst|height/i.test(displayBadge)) displayBadge = "Official PST Measurement"
    else if (/hra|rent/i.test(displayBadge)) displayBadge = "HRA Exemption Proof"
    else if (/gst/i.test(displayBadge)) displayBadge = "GST Tax Calculator"
    else if (/sip/i.test(displayBadge)) displayBadge = "SIP Wealth Planner"
    else if (/photo|signature|compress/i.test(displayBadge)) displayBadge = "Exam Photo Compressor"
    else if (/age/i.test(displayBadge)) displayBadge = "Age Calculator Engine"
    else displayBadge = displayBadge.slice(0, 24) + "..."
  }

  // Filter out dummy chips that have href="#" or no action
  const validChips = (chips || []).filter(chip => (chip.href && chip.href !== "#") || Boolean(chip.onClick))

  return (
    <div className="tool-unified-header mb-2.5 mb-md-3">
      <div 
        className="card border-0 bg-white rounded-3 rounded-md-4 shadow-sm"
        style={{ 
          border: "1px solid #eef2f6", 
          padding: "0.75rem 1rem",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)"
        }}
      >
        {/* Top Meta Row: Badge & Social Share in a single tight line */}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-1.5">
          {/* Left: Category Badge */}
          <div className="d-flex align-items-center gap-1.5" style={{ minWidth: 0, flex: "1 1 auto" }}>
            <span 
              className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle fw-semibold px-2.5 py-1 d-inline-flex align-items-center gap-1 text-truncate"
              style={{ fontSize: "0.72rem", letterSpacing: "0.01em", maxWidth: "100%" }}
            >
              <Sparkles size={11} className="text-primary flex-shrink-0" />
              <span className="text-truncate">{displayBadge}</span>
            </span>
            <span 
              className="text-secondary small d-none d-sm-inline-flex align-items-center gap-1.5 fw-medium flex-shrink-0"
              style={{ fontSize: "0.72rem" }}
            >
              <span className="d-inline-block rounded-circle bg-success flex-shrink-0" style={{ width: 6, height: 6 }} />
              100% Free
            </span>
          </div>

          {/* Right: WhatsApp + Share */}
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0 ms-auto">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this free tool: ${title}${currentUrl ? ` -> ${currentUrl}` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm text-white d-inline-flex align-items-center gap-1 text-decoration-none shadow-xs"
              style={{ 
                backgroundColor: "#25D366", 
                fontSize: "0.72rem", 
                padding: "4px 10px", 
                borderRadius: "8px",
                border: "none",
                fontWeight: 600
              }}
              title="Share on WhatsApp"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <button
              onClick={handleShare}
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "8px" }}
              title="Share or Copy Link"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-success" />
                  <span className="text-success fw-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={12} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="fw-bold text-dark mb-1" 
          style={{ 
            letterSpacing: "-0.025em", 
            fontSize: "clamp(1.15rem, 3.2vw, 1.45rem)",
            lineHeight: 1.25 
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-secondary small mb-0" 
          style={{ fontSize: "0.8rem", lineHeight: 1.4, maxWidth: 720 }}
        >
          {description}
        </p>

        {/* Filter Pills / Navigation (Single Row Horizontal Swipe on Mobile) */}
        {validChips.length > 0 && (
          <div 
            className="d-flex align-items-center gap-1.5 overflow-x-auto text-nowrap no-scrollbar pt-2 mt-2 border-top"
            style={{ 
              borderColor: "#f1f5f9", 
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none" 
            }}
          >
            <span 
              className="text-muted fw-bold me-1 text-uppercase flex-shrink-0 d-none d-sm-inline"
              style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}
            >
              Tools:
            </span>
            <div className="d-flex align-items-center gap-1.5 flex-nowrap">
              {validChips.map((chip, idx) => {
                const isActive = Boolean(chip.active)
                const label = (
                  <>
                    <span className={chip.mobileLabel ? "d-none d-sm-inline" : ""}>{chip.label}</span>
                    {chip.mobileLabel && <span className="d-sm-none">{chip.mobileLabel}</span>}
                  </>
                )

                const pillStyle: React.CSSProperties = {
                  fontSize: "0.75rem",
                  padding: "4px 11px",
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  ...(isActive 
                    ? { backgroundColor: "#2563eb", borderColor: "#2563eb", color: "#ffffff", boxShadow: "0 1px 3px rgba(37,99,235,0.25)" }
                    : { backgroundColor: "#f8fafc", borderColor: "#e2e8f0", color: "#475569" }
                  )
                }

                if (chip.href) {
                  return (
                    <Link
                      key={idx}
                      href={chip.href}
                      className={`btn btn-sm rounded-pill text-decoration-none flex-shrink-0 ${isActive ? "btn-primary text-white" : "btn-light border"}`}
                      style={pillStyle}
                    >
                      {label}
                    </Link>
                  )
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={chip.onClick}
                    className={`btn btn-sm rounded-pill flex-shrink-0 ${isActive ? "btn-primary text-white" : "btn-light border"}`}
                    style={pillStyle}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

