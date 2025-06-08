'use client'

import { useEffect } from 'react'

export default function AutoAds() {
  useEffect(() => {
    // Initialize Auto Ads
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: 'ca-pub-3361406010222956',
          enable_page_level_ads: true
        })
      } catch (error) {
        console.error('Auto Ads initialization error:', error)
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Alternative: Manual Auto Ads activation script
export const AutoAdsScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-3361406010222956",
          enable_page_level_ads: true
        });
      `
    }}
  />
) 