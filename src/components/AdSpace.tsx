"use client"

import { useEffect } from 'react'

interface AdSpaceProps {
  id: string
  className?: string
  adSlot?: string
  adFormat?: 'auto' | 'fluid' | 'fixed'
  width?: number
  height?: number
  children?: React.ReactNode
  isProduction?: boolean
}

export default function AdSpace({ 
  id, 
  className = "", 
  adSlot = "",
  adFormat = "auto",
  width,
  height,
  children,
  isProduction = false
}: AdSpaceProps) {
  useEffect(() => {
    // Only load ads in production
    if (isProduction && window.adsbygoogle && adSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [isProduction, adSlot])

  // In development or when no ad slot is provided, show placeholder
  if (!isProduction || !adSlot) {
    return (
      <div 
        id={id}
        className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium min-h-[200px] transition-all duration-300 hover:border-gray-300 hover:bg-gray-100 ${className}`}
        role="banner"
        aria-label="Advertisement space"
      >
        {children || (
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
              <span className="text-lg">📢</span>
            </div>
            <p className="font-medium text-gray-600 mb-1">Google Ad Space</p>
            <p className="text-xs text-gray-400 mb-2">
              {width && height ? `${width}x${height}` : 'Responsive'}
            </p>
            <p className="text-xs text-gray-300">
              Insert your AdSense code here
            </p>
            <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              ID: {id}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Production AdSense implementation
  return (
    <div 
      id={id}
      className={`${className} relative`}
      role="banner"
      aria-label="Advertisement"
    >
      <ins 
        className="adsbygoogle block"
        style={{ 
          display: 'block',
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto'
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={adFormat === 'auto' ? 'true' : 'false'}
      />
    </div>
  )
}

// Common Ad Configurations
export const AdConfigs = {
  headerBanner: {
    width: 728,
    height: 90,
    adFormat: 'fixed' as const
  },
  sidebarBanner: {
    width: 300,
    height: 600,
    adFormat: 'fixed' as const
  },
  squareAd: {
    width: 300,
    height: 300,
    adFormat: 'fixed' as const
  },
  contentAd: {
    adFormat: 'fluid' as const
  },
  footerBanner: {
    width: 728,
    height: 90,
    adFormat: 'fixed' as const
  }
}

// Add this to your _document.tsx or layout to load AdSense
export const AdSenseScript = () => (
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
    crossOrigin="anonymous"
  />
) 