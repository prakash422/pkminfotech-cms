"use client"

import { useEffect } from 'react'

interface AdSpaceProps {
  id: string
  className?: string
  adSlot?: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  width?: number
  height?: number
  children?: React.ReactNode
  isProduction?: boolean
}

export default function AdSpace({ 
  id, 
  className = "", 
  adSlot,
  adFormat = "auto",
  width,
  height,
  children,
  isProduction = true // Changed to true for production
}: AdSpaceProps) {
  useEffect(() => {
    // Load AdSense ads in production
    if (isProduction && typeof window !== 'undefined' && window.adsbygoogle && adSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [isProduction, adSlot])

  // Show real ads when adSlot is provided
  if (isProduction && adSlot) {
    return (
      <div 
        id={id}
        className={`${className} relative`}
        role="banner"
        aria-label="Advertisement"
      >
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : 'auto'
          }}
          data-ad-client="ca-pub-3361406010222956"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={adFormat === 'auto' ? 'true' : 'false'}
        />
      </div>
    )
  }

  // Development or fallback placeholder
  return (
    <div 
      id={id}
      className={`bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium min-h-[200px] transition-all duration-300 hover:border-gray-300 hover:bg-gray-100 ${className}`}
      role="banner"
      aria-label="Advertisement space"
    >
      {children || (
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
            <span className="text-lg">💰</span>
          </div>
          <p className="font-medium text-gray-600 mb-1">Google AdSense</p>
          <p className="text-xs text-gray-400 mb-2">
            {width && height ? `${width}x${height}` : 'Responsive Ad'}
          </p>
          <p className="text-xs text-gray-300">
            {adSlot ? `Slot: ${adSlot}` : 'Configure ad slot'}
          </p>
          <div className="mt-3 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
            Ready for Ads
          </div>
        </div>
      )}
    </div>
  )
}

// Pre-configured AdSense Ad Units (You'll need to create these in your AdSense account)
export const AdConfigs = {
  headerBanner: {
    width: 728,
    height: 90,
    adFormat: 'horizontal' as const,
    adSlot: '1234567890' // Replace with your actual ad slot ID
  },
  sidebarBanner: {
    width: 300,
    height: 600,
    adFormat: 'vertical' as const,
    adSlot: '1234567891' // Replace with your actual ad slot ID
  },
  squareAd: {
    width: 300,
    height: 300,
    adFormat: 'rectangle' as const,
    adSlot: '1234567892' // Replace with your actual ad slot ID
  },
  contentAd: {
    adFormat: 'auto' as const,
    adSlot: '1234567893' // Replace with your actual ad slot ID
  },
  footerBanner: {
    width: 728,
    height: 90,
    adFormat: 'horizontal' as const,
    adSlot: '1234567894' // Replace with your actual ad slot ID
  },
  mobileAd: {
    width: 320,
    height: 250,
    adFormat: 'rectangle' as const,
    adSlot: '1234567895' // Replace with your actual ad slot ID
  }
}

// Component for AdSense Script (use in _document.tsx or layout)
export const AdSenseScript = () => (
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956"
    crossOrigin="anonymous"
  />
) 