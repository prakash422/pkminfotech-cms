'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageData {
  publicId: string
  url: string
  width: number
  height: number
  format: string
  size: number
  createdAt: string
  folder: string
  filename: string
}

interface ImageGalleryProps {
  onImageSelect?: (image: ImageData) => void
  folder?: string
  selectable?: boolean
  allowBulkDelete?: boolean
}

export default function ImageGallery({ 
  onImageSelect, 
  folder = 'blog-images',
  selectable = true,
  allowBulkDelete = true
}: ImageGalleryProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/images?folder=${folder}&limit=50`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from local state
      setImages(prev => prev.filter(img => img.publicId !== publicId))
      
      // Clear selection if deleted image was selected
      if (selectedImage === publicId) {
        setSelectedImage(null)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete image')
    }
  }

  const selectImage = (image: ImageData) => {
    setSelectedImage(image.publicId)
    if (onImageSelect) {
      onImageSelect(image)
    }
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  useEffect(() => {
    fetchImages()
  }, [folder])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading images...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchImages}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No images found</h3>
        <p className="text-gray-500">Upload some images to get started.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Image Gallery</h2>
        <button
          onClick={fetchImages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.publicId}
            className={`
              relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedImage === image.publicId 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
            onClick={() => selectable && selectImage(image)}
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>

            {/* Image Info */}
            <div className="p-2 bg-white">
              <p className="text-xs text-gray-600 truncate font-medium">
                {image.filename}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(image.size / 1024)}KB • {image.width}×{image.height}
              </p>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyImageUrl(image.url)
                  }}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                  title="Copy URL"
                >
                  Copy
                </button>
                
                {selectable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      selectImage(image)
                    }}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Select
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteImage(image.publicId)
                  }}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedImage === image.publicId && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 