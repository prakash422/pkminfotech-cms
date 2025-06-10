"use client"

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
    adsenseLoaded?: boolean
    autoAdsInitialized?: boolean
    googletag?: any
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
          initializeAutoAds()
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

  const initializeAutoAds = () => {
    if (window.autoAdsInitialized) return
    window.autoAdsInitialized = true

    try {
      if (!window.adsbygoogle) {
        window.adsbygoogle = []
      }
      
      // 1. Initialize Auto Ads with enhanced configuration
      window.adsbygoogle.push({
        google_ad_client: "ca-pub-3361406010222956",
        enable_page_level_ads: true,
        tag_origin: "auto"
      })
      
      console.log('✅ AdSense Auto Ads initialized with enhanced config')
      
      // 2. Create space detection and optimization system
      setTimeout(() => {
        optimizeAdSpaces()
      }, 1000)
      
      // 3. Set up continuous monitoring for new spaces
      setupSpaceMonitoring()
      
    } catch (error) {
      console.warn('AdSense Auto Ads initialization error:', error)
    }
  }

  const optimizeAdSpaces = () => {
    try {
      // Find all potential ad containers
      const adContainers = document.querySelectorAll('[data-auto-ads="true"], .auto-ads-container')
      
      console.log(`🔍 Found ${adContainers.length} potential ad spaces`)
      
      adContainers.forEach((container: any, index) => {
        if (container) {
          // Add visibility and positioning hints for Google
          enhanceAdContainer(container, index)
          
          // Trigger ad loading for each container
          setTimeout(() => {
            triggerAdForContainer(container)
          }, (index + 1) * 300) // Stagger the requests
        }
      })
      
      // Also look for empty sidebar spaces and add ad hints
      detectUnusedSpaces()
      
    } catch (error) {
      console.log('Space optimization error:', error)
    }
  }

  const enhanceAdContainer = (container: Element, index: number) => {
    // Add Google-friendly attributes
    container.setAttribute('data-google-ad-slot', 'auto')
    container.setAttribute('data-priority', (index === 0 ? 'high' : 'medium'))
    
    // Ensure visibility
    const style = (container as HTMLElement).style
    if (style.display === 'none') {
      style.display = 'block'
    }
    
    // Add positioning context
    if (!style.position) {
      style.position = 'relative'
    }
  }

  const triggerAdForContainer = (container: Element) => {
    try {
      const insElement = container.querySelector('ins.adsbygoogle')
      if (insElement && !insElement.hasAttribute('data-adsbygoogle-status')) {
        // Push to trigger ad loading
        window.adsbygoogle.push({})
        console.log(`📢 Ad triggered for container: ${container.id || 'unnamed'}`)
      }
    } catch (error) {
      console.log('Container trigger error:', error)
    }
  }

  const detectUnusedSpaces = () => {
    // Look for empty sidebar areas, wide content areas, etc.
    const potentialSpaces = [
      // Sidebar areas
      'aside:not(:has(ins.adsbygoogle))',
      '.sidebar:not(:has(ins.adsbygoogle))',
      // Content areas with enough space
      '.content-area:not(:has(ins.adsbygoogle))',
      // Empty divs with significant height
      'div[style*="height"]:not(:has(ins.adsbygoogle))'
    ]
    
    potentialSpaces.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element: Element) => {
          const rect = element.getBoundingClientRect()
          // If element is large enough for an ad
          if (rect.height > 200 && rect.width > 250) {
            addAutoAdHint(element as HTMLElement)
          }
        })
      } catch (error) {
        console.log(`Space detection error for ${selector}:`, error)
      }
    })
  }

  const addAutoAdHint = (element: HTMLElement) => {
    // Add subtle hints for Google Auto Ads to detect this as a potential space
    element.setAttribute('data-auto-ad-space', 'available')
    element.setAttribute('data-ad-friendly', 'true')
    
    // Add invisible marker that Google can detect
    const marker = document.createElement('div')
    marker.style.cssText = 'height:1px;width:1px;opacity:0;pointer-events:none;'
    marker.setAttribute('data-ad-placement-hint', 'true')
    element.appendChild(marker)
  }

  const setupSpaceMonitoring = () => {
    // Monitor for new content and spaces every 5 seconds
    setInterval(() => {
      const newContainers = document.querySelectorAll('[data-auto-ads="true"]:not([data-processed])')
      if (newContainers.length > 0) {
        console.log(`🆕 Found ${newContainers.length} new ad containers`)
        newContainers.forEach((container: any) => {
          container.setAttribute('data-processed', 'true')
          setTimeout(() => triggerAdForContainer(container), 500)
        })
      }
    }, 5000)
  }

  if (!isClient) {
    return null
  }

  return null
}
