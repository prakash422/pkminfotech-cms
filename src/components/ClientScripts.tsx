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
    
    if (typeof window !== 'undefined') {
      // Load AdSense script
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-3361406010222956'
      
      script.onload = () => {
        console.log('✅ Google AdSense script loaded')
        
        // Initialize AdSense
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }
        
        // Enable Auto Ads for general placement
        window.adsbygoogle.push({
          google_ad_client: "pub-3361406010222956",
          enable_page_level_ads: true
        })
        
        // Wait for containers to be available, then inject ads
        setTimeout(() => {
          const containers = document.querySelectorAll('.adsense-container')
          containers.forEach((container, index) => {
            // Create ad unit for each container
            const adDiv = document.createElement('ins')
            adDiv.className = 'adsbygoogle'
            adDiv.style.display = 'block'
            adDiv.setAttribute('data-ad-client', 'pub-3361406010222956')
            adDiv.setAttribute('data-ad-slot', '1234567890') // You'll need to create ad units in AdSense
            adDiv.setAttribute('data-ad-format', 'auto')
            adDiv.setAttribute('data-full-width-responsive', 'true')
            
            // Clear container and add ad
            container.innerHTML = ''
            container.appendChild(adDiv)
            
            // Push to AdSense
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({})
              console.log(`📍 Ad injected into container ${index + 1}`)
            } catch (e) {
              console.log(`❌ Ad injection failed for container ${index + 1}:`, e)
            }
          })
        }, 3000)
      }
      
      script.onerror = () => {
        console.log('❌ Failed to load AdSense script')
      }
      
      document.head.appendChild(script)
    }
  }, [])

  return null
} 