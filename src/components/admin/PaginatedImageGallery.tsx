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

export default function PaginatedImageGallery({ 
  onImageSelect, 
  folder = 'blog-images',
  selectable = true,
  allowBulkDelete = true
}: ImageGalleryProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const imagesPerPage = 20

  const fetchImages = async (cursor?: string, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        folder,
        limit: imagesPerPage.toString()
      })
      
      if (cursor) {
        params.append('next_cursor', cursor)
      }
      
      const response = await fetch(`/api/images?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      
      if (append) {
        setImages(prev => [...prev, ...(data.images || [])])
      } else {
        setImages(data.images || [])
      }
      
      setNextCursor(data.nextCursor || null)
      setTotalCount(data.totalCount || 0)
      setHasMore(!!data.nextCursor)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load images')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchImages(nextCursor, true)
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

      setImages(prev => prev.filter(img => img.publicId !== publicId))
      setTotalCount(prev => prev - 1)
      
      if (selectedImage === publicId) {
        setSelectedImage(null)
      }
      
      setSelectedImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(publicId)
        return newSet
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete image')
    }
  }

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return

    const confirmMessage = `Are you sure you want to delete ${selectedImages.size} selected image${selectedImages.size > 1 ? 's' : ''}? This action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeleting(true)
    const errors: string[] = []

    try {
      await Promise.all(
        Array.from(selectedImages).map(async (publicId) => {
          try {
            const response = await fetch('/api/images', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ publicId }),
            })

            if (!response.ok) {
              throw new Error(`Failed to delete ${publicId}`)
            }
          } catch (error) {
            errors.push(error instanceof Error ? error.message : `Failed to delete ${publicId}`)
          }
        })
      )

      setImages(prev => prev.filter(img => !selectedImages.has(img.publicId)))
      setTotalCount(prev => prev - selectedImages.size)
      setSelectedImages(new Set())
      setBulkSelectMode(false)
      setSelectedImage(null)

      if (errors.length > 0) {
        setError(`Some images failed to delete: ${errors.join(', ')}`)
      }
    } catch (error) {
      setError('Failed to delete selected images')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleImageSelection = (publicId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(publicId)) {
        newSet.delete(publicId)
      } else {
        newSet.add(publicId)
      }
      return newSet
    })
  }

  const selectAllImages = () => {
    setSelectedImages(new Set(images.map(img => img.publicId)))
  }

  const clearAllSelections = () => {
    setSelectedImages(new Set())
  }

  const selectImage = (image: ImageData) => {
    if (bulkSelectMode) {
      toggleImageSelection(image.publicId)
    } else {
      setSelectedImage(image.publicId)
      if (onImageSelect) {
        onImageSelect(image)
      }
    }
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  useEffect(() => {
    fetchImages()
  }, [folder])

  useEffect(() => {
    setSelectedImages(new Set())
    setSelectedImage(null)
    setBulkSelectMode(false)
    setNextCursor(null)
    setHasMore(false)
  }, [folder])

  if (loading && images.length === 0) {
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
          onClick={() => fetchImages()}
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
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Image Gallery</h2>
          <span className="text-sm text-gray-500">
            Showing {images.length} of {totalCount} images
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {allowBulkDelete && (
            <button
              onClick={() => {
                setBulkSelectMode(!bulkSelectMode)
                if (!bulkSelectMode) {
                  setSelectedImages(new Set())
                }
              }}
              className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                bulkSelectMode 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {bulkSelectMode ? 'Exit Selection' : 'Select Multiple'}
            </button>
          )}
          
          <button
            onClick={() => fetchImages()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {bulkSelectMode && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-purple-700">
                {selectedImages.size} of {images.length} selected
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllImages}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
                >
                  Select All Visible
                </button>
                <button
                  onClick={clearAllSelections}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {selectedImages.size > 0 && (
              <button
                onClick={deleteSelectedImages}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected ({selectedImages.size})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.publicId}
            className={`
              relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all
              ${bulkSelectMode && selectedImages.has(image.publicId)
                ? 'border-purple-500 shadow-lg ring-2 ring-purple-200' 
                : selectedImage === image.publicId && !bulkSelectMode
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
            onClick={() => selectable && selectImage(image)}
          >
            {bulkSelectMode && (
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedImages.has(image.publicId)}
                  onChange={() => toggleImageSelection(image.publicId)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 text-purple-600 bg-white border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
              </div>
            )}

            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>

            <div className="p-2 bg-white">
              <p className="text-xs text-gray-600 truncate font-medium">
                {image.filename}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(image.size / 1024)}KB • {image.width}×{image.height}
              </p>
            </div>

            {!bulkSelectMode && (
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
            )}

            {!bulkSelectMode && selectedImage === image.publicId && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {bulkSelectMode && selectedImages.has(image.publicId) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More / Pagination */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading more images...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Load More Images ({totalCount - images.length} remaining)
              </>
            )}
          </button>
        </div>
      )}

      {bulkSelectMode && selectedImages.size > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>{selectedImages.size}</strong> image{selectedImages.size !== 1 ? 's' : ''} selected. 
            Use the "Delete Selected" button above to remove them permanently.
          </p>
        </div>
      )}
    </div>
  )
} 