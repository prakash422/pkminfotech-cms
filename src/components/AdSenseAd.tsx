"use client"

import { useEffect, useRef } from "react"

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_ADSENSE_ID ||
  "ca-pub-3361406010222956"

type AdSenseAdProps = {
  /** AdSense Display ad unit slot ID from AdSense → Ad units */
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  /** full width responsive — turn off for fixed 160x600 rails */
  responsive?: boolean
  className?: string
  minHeight?: number
  /** Fixed pixel size (matches AdSense fixed units like 160x600) */
  width?: number
  height?: number
}

/**
 * Manual AdSense unit only — use fixed placements.
 * Do not rely on Auto ads (they inject randomly and hurt UX).
 */
export default function AdSenseAd({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  minHeight = 90,
  width,
  height,
}: AdSenseAdProps) {
  const pushed = useRef(false)
  const isFixed = Boolean(width && height)

  useEffect(() => {
    if (!slot || pushed.current) return
    if (typeof window === "undefined") return
    // Skip on localhost to avoid invalid traffic / layout noise while developing
    const host = window.location.hostname
    if (host === "localhost" || host.includes("127.0.0.1")) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // AdSense may throw if script not ready; ignore
    }
  }, [slot])

  if (!slot) return null

  return (
    <div
      className={`adsense-manual-slot ${className}`}
      style={{
        minHeight: height || minHeight,
        width: width || undefined,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {isFixed ? (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  )
}
