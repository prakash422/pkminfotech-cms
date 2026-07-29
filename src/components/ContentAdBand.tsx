"use client"

import AdSenseAd from "@/components/AdSenseAd"

/**
 * Mid-content ad band.
 * Intentionally NOT styled like tool/category cards — AdSense requires
 * ads to be clearly distinguishable from site content.
 */
export default function ContentAdBand({
  className = "",
  slot,
}: {
  className?: string
  slot?: string
}) {
  const resolvedSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY || ""
  if (!resolvedSlot) return null

  return (
    <aside
      className={`content-ad-band ${className}`}
      aria-label="Advertisement"
      data-nosnippet
    >
      <div className="content-ad-shell">
        <div className="content-ad-label-row">
          <span className="content-ad-label">Advertisement</span>
        </div>
        <div className="content-ad-frame">
          <AdSenseAd slot={resolvedSlot} format="auto" minHeight={100} />
        </div>
      </div>
    </aside>
  )
}
