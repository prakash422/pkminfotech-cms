"use client"

import { useEffect } from 'react'

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
  useEffect(() => {
    // Enable Auto Ads when component mounts - Works in all environments
    if (typeof window !== 'undefined') {
      try {
        // Initialize adsbygoogle array if it doesn't exist
        if (!window.adsbygoogle) {
          window.adsbygoogle = []
        }
        
        // Enable Auto Ads
        (window.adsbygoogle as any[]).push({
          google_ad_client: "ca-pub-3361406010222956",
          enable_page_level_ads: true
        })
        
        console.log('✅ AutoAds component initialized for:', id || 'unnamed ad')
      } catch (error) {
        console.error('❌ Auto Ads error:', error)
      }
    }
  }, [id])

  // Always return the ad container - Auto Ads will work in production
  return (
    <div 
      id={id}
      className={`auto-ads-container ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      role="banner"
      aria-label="Advertisement"
    >
      {/* Auto Ads will automatically place ads here in production */}
      <div className="auto-ads-placeholder opacity-30 flex items-center justify-center">
        {children || (
          <div className="text-center text-gray-400 text-xs p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
              <span className="text-lg">🤖</span>
            </div>
            <p className="font-medium text-blue-700 mb-1">Google Auto Ads</p>
            <p className="text-xs text-blue-600 mb-2">Automatic Placement</p>
            <p className="text-xs text-gray-500">Loading...</p>
            <div className="mt-3 px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">
              Smart Ads Active
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Auto Ads Script Component (add to your layout)
export const AutoAdsScript = () => (
  <>
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956"
      crossOrigin="anonymous"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({
            google_ad_client: "ca-pub-3361406010222956",
            enable_page_level_ads: true
          });
        `
      }}
    />
  </>
) 