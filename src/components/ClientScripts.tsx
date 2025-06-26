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
    // Check environment and debugging info
    const isProduction = process.env.NODE_ENV === 'production'
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server'
    const isLivesite = hostname !== 'localhost' && !hostname.includes('127.0.0.1')
    
    console.log('🌍 Environment:', process.env.NODE_ENV)
    console.log('🏠 Hostname:', hostname)
    console.log('🌐 Is Live Site:', isLivesite)

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
      
      // Load AdSense script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956'
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
       
        
        // Enhanced debugging for Auto Ads
        setTimeout(() => {
          
          if (!isLivesite) {
            console.log('⚠️ AdSense may not work on localhost - deploy to see ads')
          }
          
          // Check available space for Auto Ads
          const mainContent = document.querySelector('main')
          if (mainContent) {
            const rect = mainContent.getBoundingClientRect()
            const viewportWidth = window.innerWidth
            const sideSpace = (viewportWidth - rect.width) / 2
          }
        }, 2000)
      }
      
      script.onerror = () => {
        console.log('❌ AdSense script failed to load')
        console.log('🔍 Check: Ad blocker, network, or browser restrictions')
        window.__adsenseScriptLoaded = false
      }
      
      document.head.appendChild(script)
      
    } else {
      console.log('⚠️ AdSense script already loaded, skipping...')
    }
  }, [])

  return null
} 