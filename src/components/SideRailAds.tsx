"use client"

import AdSenseAd from "@/components/AdSenseAd"

type SideRailAdsProps = {
  leftSlot?: string
  rightSlot?: string
}

/**
 * Desktop-only sticky side rails (both sides).
 * Hidden on tablet/mobile so UX stays clean.
 * Slots: pk-sidebar-left / pk-sidebar-right (160×600 fixed).
 */
export default function SideRailAds({
  leftSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT || "",
  rightSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT || "",
}: SideRailAdsProps) {
  if (!leftSlot && !rightSlot) return null

  return (
    <>
      {leftSlot ? (
        <aside className="side-rail-ad side-rail-ad--left" aria-label="Advertisement">
          <div className="side-rail-ad-card">
            <p className="side-rail-ad-label">AD</p>
            <AdSenseAd
              slot={leftSlot}
              width={160}
              height={600}
              className="side-rail-ins"
            />
          </div>
        </aside>
      ) : null}

      {rightSlot ? (
        <aside className="side-rail-ad side-rail-ad--right" aria-label="Advertisement">
          <div className="side-rail-ad-card">
            <p className="side-rail-ad-label">AD</p>
            <AdSenseAd
              slot={rightSlot}
              width={160}
              height={600}
              className="side-rail-ins"
            />
          </div>
        </aside>
      ) : null}
    </>
  )
}
