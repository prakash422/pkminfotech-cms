"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
    __adsenseScriptLoaded?: boolean
  }
}

export default function ClientScripts() {
  useEffect(() => {
    // Only load script once
    if (typeof window !== 'undefined' && !window.__adsenseScriptLoaded) {
      console.log('🔄 Loading AdSense script...')
      
      // Set flag to prevent duplicate loads
      window.__adsenseScriptLoaded = true
      
      // Initialize adsbygoogle array
      window.adsbygoogle = window.adsbygoogle || []
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]')
      if (existingScript) {
        console.log('✅ AdSense script already exists')
        return
      }
      
      // Load AdSense script - Auto Ads will work automatically
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-3361406010222956'
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        console.log('✅ AdSense script loaded - Auto Ads will activate automatically')
      }
      
      script.onerror = () => {
        console.log('❌ AdSense script failed to load')
        window.__adsenseScriptLoaded = false // Reset flag on error
      }
      
      document.head.appendChild(script)
    } else {
      console.log('⚠️ AdSense script already loaded, skipping...')
    }
  }, [])

  return null
} 