"use client"

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
    adsenseLoaded?: boolean
  }
}

export default function ClientScripts() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Only load AdSense once to prevent TagError
    if (typeof window !== 'undefined' && !window.adsenseLoaded) {
      // Mark as loading to prevent duplicate calls
      window.adsenseLoaded = true
      
      try {
        // Load AdSense script
        const script = document.createElement('script')
        script.async = true
        script.crossOrigin = 'anonymous'
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956'
        
        script.onload = () => {
          console.log('✅ AdSense script loaded successfully')
          
          // Initialize Auto Ads only once
          try {
            if (!window.adsbygoogle) {
              window.adsbygoogle = []
            }
            
            // Push auto ads configuration
            window.adsbygoogle.push({
              google_ad_client: "ca-pub-3361406010222956",
              enable_page_level_ads: true
            })
            
            console.log('✅ AdSense Auto Ads initialized')
          } catch (error) {
            console.warn('AdSense Auto Ads initialization error:', error)
          }
        }
        
        script.onerror = () => {
          console.warn('AdSense script failed to load')
          window.adsenseLoaded = false
        }
        
        document.head.appendChild(script)
        
      } catch (error) {
        console.warn('AdSense setup error:', error)
        window.adsenseLoaded = false
      }
    }
  }, [])

  if (!isClient) {
    return null
  }

  return null
}
