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
 * Defers injection until after main-thread idle or first user interaction
 * so it never blocks initial paint, LCP, or hydration.
 */
export default function ClientScripts() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.__adsenseScriptLoaded) return

    const isAdminPage = window.location.pathname.startsWith("/admin")
    if (isAdminPage) return

    const loadAdSense = () => {
      cleanup()

      if (window.__adsenseScriptLoaded) return
      window.__adsenseScriptLoaded = true
      window.adsbygoogle = window.adsbygoogle || []

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
    }

    const events = ["scroll", "touchstart", "mousemove", "keydown"]
    const onUserInteraction = () => {
      loadAdSense()
    }

    const cleanup = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, onUserInteraction, { capture: true })
      })
    }

    events.forEach((evt) => {
      window.addEventListener(evt, onUserInteraction, { capture: true, once: true, passive: true })
    })

    let idleId: number | undefined
    let timerId: ReturnType<typeof setTimeout> | undefined

    if ("requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(loadAdSense, { timeout: 2500 })
    } else {
      timerId = setTimeout(loadAdSense, 1500)
    }

    return () => {
      cleanup()
      if (idleId && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId)
      }
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [])

  return null
}
