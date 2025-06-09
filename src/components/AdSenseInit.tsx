"use client"

import Script from 'next/script'

export default function AdSenseInit() {
  return (
    <>
      {/* AdSense Script - Load in all environments */}
      <Script
        id="adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3361406010222956"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('✅ AdSense script loaded successfully')
        }}
        onError={(e) => {
          console.error('❌ AdSense script failed to load:', e)
        }}
      />
      
      {/* Auto Ads Configuration - Critical for Auto Ads */}
      <Script
        id="adsense-auto-ads-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.adsbygoogle = window.adsbygoogle || [];
              adsbygoogle.push({
                google_ad_client: "ca-pub-3361406010222956",
                enable_page_level_ads: true,
                overlays: {bottom: true}
              });
              console.log('✅ AdSense Auto Ads configured successfully');
            } catch (error) {
              console.error('❌ AdSense Auto Ads configuration failed:', error);
            }
          `
        }}
      />
      
      {/* Backup Auto Ads Initialization */}
      <Script
        id="adsense-auto-ads-fallback"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              setTimeout(function() {
                try {
                  if (window.adsbygoogle && !window.adsenseInitialized) {
                    window.adsbygoogle.push({
                      google_ad_client: "ca-pub-3361406010222956",
                      enable_page_level_ads: true
                    });
                    window.adsenseInitialized = true;
                    console.log('✅ AdSense Auto Ads fallback initialized');
                  }
                } catch (error) {
                  console.error('❌ AdSense fallback failed:', error);
                }
              }, 1000);
            }
          `
        }}
      />
    </>
  )
} 