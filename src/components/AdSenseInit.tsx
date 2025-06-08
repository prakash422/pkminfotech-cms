"use client"

import { useEffect } from 'react'

export default function AdSenseInit() {
  useEffect(() => {
    // Initialize AdSense only on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      try {
        // Initialize the adsbygoogle array
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }
        
        // Check if page-level ads are already enabled to prevent duplicate initialization
        if (!(window as any).adsensePageLevelInitialized) {
          // Enable auto ads after a small delay to ensure script is loaded
          const timer = setTimeout(() => {
            (window.adsbygoogle as any[]).push({
              google_ad_client: "ca-pub-3361406010222956",
              enable_page_level_ads: true
            })
            // Mark as initialized to prevent duplicate calls
            ;(window as any).adsensePageLevelInitialized = true
          }, 1000)

          return () => clearTimeout(timer)
        }
      } catch (error) {
        console.error('AdSense initialization error:', error)
      }
    }
  }, [])

  return null // This component doesn't render anything
} 