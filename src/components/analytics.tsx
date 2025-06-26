'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default function Analytics() {
  const pathname = usePathname()
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
   
    if (GA_ID && typeof window !== 'undefined') {
      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      window.gtag = gtag
      
      // Configure Google Analytics
      gtag('js', new Date())
      gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
        debug_mode: true
      })
    }
  }, [GA_ID])

  useEffect(() => {
    if (GA_ID && window.gtag) {
      window.gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [pathname, GA_ID])

  if (!GA_ID) return null

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      onLoad={() => {
        console.log('GA Script loaded successfully')
      }}
      onError={(e) => {
        console.error('GA Script failed to load:', e)
      }}
    />
  )
} 