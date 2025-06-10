"use client"

import { useEffect, useState, useRef } from 'react'

interface AutoAdsProps {
  children?: React.ReactNode
  className?: string
  id?: string
  minHeight?: number
  position?: 'sidebar' | 'content' | 'header' | 'footer'
  priority?: 'high' | 'medium' | 'low'
}

export default function AutoAds({ 
  children, 
  className = "", 
  id,
  minHeight = 200,
  position = 'sidebar',
  priority = 'medium'
}: AutoAdsProps) {
  const [isClient, setIsClient] = useState(false)
  const [adProcessed, setAdProcessed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize ads when component mounts
  useEffect(() => {
    if (!isClient || adProcessed || !containerRef.current) return

    const initializeAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          
          // Method 1: Push empty object to trigger ad
          window.adsbygoogle.push({})
          
          // Method 2: Use specific configuration for better targeting
          setTimeout(() => {
            if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
              window.adsbygoogle.push({})
            }
          }, 500)
          
          // Method 3: Force refresh for stubborn containers
          setTimeout(() => {
            if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
              // Try pushing with specific configuration
              window.adsbygoogle.push({
                google_ad_client: "ca-pub-3361406010222956",
                enable_page_level_ads: true,
                tag_origin: "auto"
              })
            }
          }, 1000)
          
          setAdProcessed(true)
          console.log(`✅ Auto Ad initialized: ${id} (${position})`)
        }
      } catch (error) {
        console.log(`AdSense init error for ${id}:`, error)
      }
    }

    // Multiple initialization attempts with different timings
    const timeouts = [100, 500, 1000, 2000]
    timeouts.forEach(delay => {
      setTimeout(initializeAd, delay)
    })

    return () => {
      // Cleanup timeouts if component unmounts
      timeouts.forEach(delay => clearTimeout(delay))
    }
  }, [isClient, id, position, adProcessed])

  // Don't render on server to prevent hydration issues
  if (!isClient) {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    )
  }

  // Calculate responsive styles based on position
  const getAdStyles = () => {
    const baseStyles = {
      display: 'block',
      width: '100%',
      minHeight: `${minHeight}px`,
    }

    switch (position) {
      case 'sidebar':
        return { ...baseStyles, maxWidth: '300px' }
      case 'content':
        return { ...baseStyles, maxWidth: '728px', margin: '0 auto' }
      case 'header':
        return { ...baseStyles, maxWidth: '728px', height: '90px' }
      case 'footer':
        return { ...baseStyles, maxWidth: '728px', height: '250px' }
      default:
        return baseStyles
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`auto-ads-container ${className}`}
      style={{ 
        minHeight: `${minHeight}px`,
        position: 'relative',
        display: 'block',
        width: '100%'
      }}
      id={id}
      data-ad-position={position}
      data-ad-priority={priority}
      data-auto-ads="true"
    >
      {/* Primary Ad Element */}
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={getAdStyles()}
        data-ad-client="ca-pub-3361406010222956"
        data-ad-slot="auto"
        data-ad-format={position === 'sidebar' ? 'vertical' : 'auto'}
        data-full-width-responsive="true"
        data-ad-layout-key={position === 'sidebar' ? '+6a+1r+2c+5t' : undefined}
      />
      
      {/* Fallback/Secondary positioning hints */}
      <div 
        className="ad-hint" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          opacity: 0
        }}
        data-ad-region={position}
        data-ad-type="display"
      />
    </div>
  )
} 