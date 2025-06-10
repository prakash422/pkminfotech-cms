"use client"

import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setIsClient(true)
    
    // Push to adsbygoogle queue when component mounts
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (e) {
        console.log('AdSense push:', e)
      }
    }
  }, [isClient])

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
        className="adsbygoogle"
        style={{ display: 'block', minHeight: `${minHeight}px` }}
        data-ad-client="ca-pub-3361406010222956"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
} 