"use client"

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false
    
    // Check for relative paths (starting with /)
    if (url.startsWith('/')) return true
    
    // Check for data URLs
    if (url.startsWith('data:')) return true
    
    // Check for absolute URLs
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Auto-optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url: string, targetWidth?: number): string => {
    if (!isValidUrl(url)) return '/favicon-32x32.png'
    
    if (url.includes('res.cloudinary.com')) {
      // Add auto format, eco quality, and responsive width
      const parts = url.split('/upload/')
      if (parts.length === 2) {
        let rest = parts[1]
        // Strip any existing transformation segment if present
        if (/^(?:[a-z]_[a-zA-Z0-9_.:]+,?)+\//.test(rest)) {
          rest = rest.replace(/^(?:[a-z]_[a-zA-Z0-9_.:]+,?)+\//, '')
        }
        // Scale to 1.5x for mobile retina displays, capped reasonably
        const w = targetWidth ? Math.min(Math.round(targetWidth * 1.5), 1200) : 600
        return `${parts[0]}/upload/f_auto,q_auto:eco,c_limit,w_${w}/${rest}`
      }
    }
    return url
  }

  // Auto-optimize other URLs (add WebP/AVIF support)
  const optimizeImageUrl = (url: string, targetWidth?: number): string => {
    if (!isValidUrl(url)) return '/favicon-32x32.png'
    
    // First try Cloudinary optimization
    const cloudinaryOptimized = optimizeCloudinaryUrl(url, targetWidth)
    if (cloudinaryOptimized !== url) {
      return cloudinaryOptimized
    }

    // For other images, return as-is (Next.js will handle optimization)
    return url
  }

  // Handle invalid src
  if (!src || !isValidUrl(src)) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    )
  }

  const optimizedSrc = optimizeImageUrl(src, width)
  const isCloudinary = optimizedSrc.includes('res.cloudinary.com')
  // Bypass Next.js image optimizer for Cloudinary to avoid 500s; Cloudinary already serves optimized images
  const unoptimized = isCloudinary

  const handleError = () => {
    setImageError(true)
  }

  if (imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    )
  }

  const imageProps = {
    src: optimizedSrc,
    alt: alt || 'Image',
    className,
    priority,
    quality,
    onError: handleError,
    placeholder,
    unoptimized,
    ...(blurDataURL && { blurDataURL }),
    ...(sizes && !unoptimized && { sizes }),
    ...props,
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return (
    <Image
      {...imageProps}
      width={width || 800}
      height={height || 600}
    />
  )
} 