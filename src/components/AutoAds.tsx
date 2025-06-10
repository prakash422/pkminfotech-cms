"use client"

import { useEffect, useState, useRef } from 'react'

interface AutoAdsProps {
  children?: React.ReactNode
  className?: string
  id?: string
  minHeight?: number
}

export default function AutoAds({ 
  children, 
  className = "", 
  id,
  minHeight = 200 
}: AutoAdsProps) {
  const [isClient, setIsClient] = useState(false)
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && adRef.current && typeof window !== 'undefined') {
      try {
        // Ensure adsbygoogle is available
        if (window.adsbygoogle && window.adsbygoogle.push) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            if (adRef.current && !adRef.current.hasChildNodes()) {
              window.adsbygoogle.push({})
              console.log(`✅ Ad unit pushed for ${id}`)
            }
          }, 100)
        } else {
          console.log(`⚠️ AdSense not ready for ${id}`)
        }
      } catch (e) {
        console.log(`AdSense error for ${id}:`, e)
      }
    }
  }, [isClient, id])

  // Only render on client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div 
        className={`${className}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    )
  }

  // Render proper AdSense ad unit
  return (
    <div 
      className={`${className}`}
      style={{ minHeight: `${minHeight}px` }}
      id={id}
    >
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          minHeight: `${minHeight}px`,
          width: '100%'
        }}
        data-ad-client="ca-pub-3361406010222956"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
} 