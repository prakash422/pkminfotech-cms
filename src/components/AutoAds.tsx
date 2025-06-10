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
  }, [])

  // Only render on client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div 
        className={`${className}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    )
  }

  // Render ad space for Google to detect and fill
  return (
    <div 
      className={`${className}`}
      style={{ minHeight: `${minHeight}px` }}
      id={id}
      data-ad-client="ca-pub-3361406010222956"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    >
      {/* Google will automatically insert ads here */}
    </div>
  )
} 