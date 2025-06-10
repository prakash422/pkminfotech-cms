"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function TestAdsPage() {
  useEffect(() => {
    // Wait for AdSense script to load, then push manual ads
    const timer = setTimeout(() => {
      if (window.adsbygoogle) {
        try {
          // Push ads for all manual ad units
          const manualAds = document.querySelectorAll('.adsbygoogle')
          manualAds.forEach(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          })
          console.log('🎯 Manual ad push attempted for', manualAds.length, 'units')
        } catch (e) {
          console.log('❌ Ad push failed:', e)
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AdSense Test Page</h1>
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Loading...'}</div>
              <div>Cookie Support: {typeof navigator !== 'undefined' ? (navigator.cookieEnabled ? 'Yes' : 'No') : 'Loading...'}</div>
              <div>AdSense Ready: {typeof window !== 'undefined' && window.adsbygoogle ? 'Yes' : 'Loading...'}</div>
            </div>
          </div>

          {/* Manual Ad Unit Test 1 - Display Ad */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Manual Display Ad Test</h2>
            <p className="mb-4">This should show a manual display ad:</p>
            
            <ins 
              className="adsbygoogle block"
              style={{ 
                display: 'block',
                minHeight: '250px',
                width: '100%'
              }}
              data-ad-client="ca-pub-3361406010222956"
              data-ad-slot="auto"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>

          {/* Manual Ad Unit Test 2 - Rectangle Ad */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Manual Rectangle Ad Test</h2>
            <p className="mb-4">Medium rectangle ad unit:</p>
            
            <ins 
              className="adsbygoogle block"
              style={{ 
                display: 'inline-block',
                width: '300px',
                height: '250px'
              }}
              data-ad-client="ca-pub-3361406010222956"
              data-ad-slot="auto"
            ></ins>
          </div>

          {/* Auto Ads Container Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auto Ads Container Test</h2>
            <p className="mb-4">Auto Ads should appear here:</p>
            <div 
              className="adsense-container bg-gray-50 border border-gray-200 rounded-lg" 
              data-ad-format="auto" 
              style={{ 
                minHeight: '250px', 
                width: '100%',
                display: 'block'
              }}
            >
              <div className="flex items-center justify-center h-full text-gray-500">
                Auto Ads Placeholder
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">AdSense Status:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Script Status: ✅ Loaded</li>
              <li>• Account: ca-pub-3361406010222956</li>
              <li>• Site Status: ✅ Ready (verified in dashboard)</li>
              <li>• Ads.txt: ✅ Detected</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Expected Behavior:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• New sites may take 24-72 hours to show ads consistently</li>
              <li>• Manual ads (above) should work before Auto Ads</li>
              <li>• Auto Ads require content analysis and may take longer</li>
              <li>• Check back in a few hours if no ads are visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 