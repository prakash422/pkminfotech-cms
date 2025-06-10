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
    
    // Simple AdSense loading - let Google handle everything
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956'
      
      script.onload = () => {
        // Just initialize Auto Ads - nothing else
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }
        
        window.adsbygoogle.push({
          google_ad_client: "ca-pub-3361406010222956",
          enable_page_level_ads: true
        })
        
        console.log('✅ Google AdSense Auto Ads loaded')
      }
      
      document.head.appendChild(script)
    }
  }, [])

  return null
}
