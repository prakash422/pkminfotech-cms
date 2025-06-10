"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function ClientScripts() {
  useEffect(() => {
    // Only run once
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      console.log('🔄 Initializing AdSense...')
      
      // Initialize adsbygoogle array
      window.adsbygoogle = window.adsbygoogle || []
      
      // Load AdSense script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-3361406010222956'
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        console.log('✅ AdSense script loaded')
        
        // Enable Auto Ads - only once
        try {
          window.adsbygoogle.push({
            google_ad_client: "pub-3361406010222956",
            enable_page_level_ads: true
          })
          console.log('✅ Auto Ads enabled')
        } catch (e) {
          console.log('❌ Auto Ads failed:', e)
        }
      }
      
      script.onerror = () => {
        console.log('❌ AdSense script failed to load')
      }
      
      document.head.appendChild(script)
    }
  }, []) // Empty dependency array - run only once

  return null
} 