"use client"

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function ClientScripts() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Enhanced AdSense loading with better ad space detection
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956'
      
      script.onload = () => {
        // Initialize AdSense
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }
        
        // Enable Auto Ads with enhanced settings
        window.adsbygoogle.push({
          google_ad_client: "ca-pub-3361406010222956",
          enable_page_level_ads: true,
          google_ad_slot: "auto",
          google_ad_format: "auto",
          google_full_width_responsive: "true"
        })
        
        console.log('✅ Google AdSense Auto Ads loaded with enhanced settings')
        
        // Help AdSense find our ad spaces
        setTimeout(() => {
          const adSpaces = document.querySelectorAll('.ad-space')
          adSpaces.forEach((space, index) => {
            console.log(`📍 Ad space detected: ${space.getAttribute('data-ad-slot')}`)
          })
          
          // Trigger AdSense to scan for new ad spaces
          if (window.adsbygoogle && window.adsbygoogle.push) {
            window.adsbygoogle.push({})
          }
        }, 2000)
      }
      
      document.head.appendChild(script)
    }
  }, [])

  return null
} 