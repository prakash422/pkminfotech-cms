"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function ClientScripts() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Wait for AdSense script to load
      const checkAdSense = () => {
        if (window.adsbygoogle) {
          console.log('✅ AdSense script detected')
          
          // Enable Auto Ads
          try {
            window.adsbygoogle.push({
              google_ad_client: "pub-3361406010222956",
              enable_page_level_ads: true
            })
            console.log('✅ Auto Ads enabled')
          } catch (e) {
            console.log('❌ Auto Ads failed:', e)
          }
          
          // Inject ads into containers
          setTimeout(() => {
            const containers = document.querySelectorAll('.adsense-container')
            console.log(`📍 Found ${containers.length} ad containers`)
            
            containers.forEach((container, index) => {
              const adDiv = document.createElement('ins')
              adDiv.className = 'adsbygoogle'
              adDiv.style.display = 'block'
              adDiv.setAttribute('data-ad-client', 'pub-3361406010222956')
              adDiv.setAttribute('data-ad-slot', '1234567890')
              adDiv.setAttribute('data-ad-format', 'auto')
              adDiv.setAttribute('data-full-width-responsive', 'true')
              
              container.innerHTML = ''
              container.appendChild(adDiv)
              
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
                console.log(`📍 Ad ${index + 1} injected`)
              } catch (e) {
                console.log(`❌ Ad ${index + 1} failed:`, e)
              }
            })
          }, 2000)
        } else {
          console.log('⏳ Waiting for AdSense script...')
          setTimeout(checkAdSense, 1000)
        }
      }
      
      checkAdSense()
    }
  }, [])

  return null
} 