"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    adsbygoogle: any[]
    __adsenseScriptLoaded?: boolean
  }
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_ADSENSE_ID ||
  "ca-pub-3361406010222956"

/**
 * Loads AdSense for MANUAL units only.
 * Auto / page-level ads are explicitly disabled in code.
 * Also turn Auto ads OFF in AdSense dashboard (Ads → By site → Auto ads),
 * especially Vignette + Anchor formats — those cause the most drop-offs.
 */
export default function ClientScripts() {
  useEffect(() => {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "server"
    const isAdminPage = typeof window !== "undefined" && window.location.pathname.startsWith("/admin")

    if (isAdminPage) return
    if (typeof window === "undefined") return
    if (window.__adsenseScriptLoaded) return

    window.__adsenseScriptLoaded = true
    window.adsbygoogle = window.adsbygoogle || []

    // Disable page-level / Auto ads injection from this site code path
    try {
      window.adsbygoogle.push({
        google_ad_client: ADSENSE_CLIENT,
        enable_page_level_ads: false,
        overlays: { bottom: false },
      })
    } catch {
      // ignore
    }

    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]')
    if (existingScript) return

    const script = document.createElement("script")
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
    script.crossOrigin = "anonymous"
    script.onerror = () => {
      window.__adsenseScriptLoaded = false
    }
    document.head.appendChild(script)
  }, [])

  return null
}
