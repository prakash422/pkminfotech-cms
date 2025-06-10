"use client"

import { useEffect } from 'react'

export default function TestAdsPage() {
  useEffect(() => {
    // Wait for AdSense script to load, then push an ad
    const timer = setTimeout(() => {
      if (window.adsbygoogle) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
          console.log('🎯 Manual ad push attempted')
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
            <h2 className="text-xl font-semibold mb-4">Auto Ads Test</h2>
            <p>This page tests if AdSense Auto Ads are working correctly.</p>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-900">AdSense Status Check:</h3>
              <div className="mt-2 text-sm">
                <div>Environment: {process.env.NODE_ENV}</div>
                <div>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Loading...'}</div>
                <div>Cookie Support: {typeof navigator !== 'undefined' ? (navigator.cookieEnabled ? 'Yes' : 'No') : 'Loading...'}</div>
              </div>
            </div>
          </div>

          {/* Manual Ad Unit Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Manual Ad Unit Test</h2>
            <p className="mb-4">This should show a manual ad unit:</p>
            
            <ins 
              className="adsbygoogle block"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-3361406010222956"
              data-ad-slot="auto"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>

          {/* Auto Ads Container */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auto Ads Container</h2>
            <div className="adsense-container" data-ad-format="auto" style={{ minHeight: '250px', width: '100%' }}>
              <p className="text-gray-500 text-center py-8">Auto Ads should appear here when ready</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• AdSense may take 24-72 hours to start showing ads on new sites</li>
              <li>• Ads don't work on localhost - test on live domain</li>
              <li>• Modern browsers block some ads due to privacy settings</li>
              <li>• Ad blockers will prevent ads from showing</li>
              <li>• Check console for detailed debugging information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 