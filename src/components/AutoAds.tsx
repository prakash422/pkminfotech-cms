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
        className={`bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      >
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <div 
      className={`bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      id={id}
    >
      {children || (
        <div className="text-center p-4">
          <div className="text-gray-400 text-sm mb-2">
            📢 Google Auto Ads
          </div>
          <div className="text-xs text-gray-300">
            Automatic ad placement by Google AdSense
          </div>
        </div>
      )}
    </div>
  )
} 