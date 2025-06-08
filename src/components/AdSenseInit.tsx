"use client"

import { useEffect, useRef } from 'react'

// Global flag to prevent multiple initializations
let globalAdSenseInitialized = false

export default function AdSenseInit() {
  const localInitialized = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (localInitialized.current || globalAdSenseInitialized) {
      return
    }

    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    const initializeAdSense = () => {
      try {
        // Ensure adsbygoogle array exists
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }

        // Initialize only once
        if (!globalAdSenseInitialized) {
          (window.adsbygoogle as any[]).push({
            google_ad_client: "ca-pub-3361406010222956",
            enable_page_level_ads: true
          })
          
          globalAdSenseInitialized = true
          localInitialized.current = true
          console.log('AdSense Auto Ads initialized')
        }
      } catch (error) {
        console.error('AdSense initialization error:', error)
      }
    }

    // Wait for AdSense script to load
    const timer = setTimeout(initializeAdSense, 1500)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return null
} 