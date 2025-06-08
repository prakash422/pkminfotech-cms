'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { IMAGE_SIZES, type ImageSizeType } from '@/constants/imageSizes'

interface ImageUploadProps {
  onImageSelect?: (image: UploadedImage) => void
  folder?: string
  multiple?: boolean
  maxFiles?: number
  sizeType?: ImageSizeType
  generateVariants?: boolean
}

interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
  alt?: string
  title?: string
  sizeType?: string
  variants?: Record<string, any>
}

interface UploadResponse {
  success: boolean
  image?: UploadedImage
  error?: string
}

export default function ImageUpload({ 
  onImageSelect, 
  folder = 'blog-images',
  multiple = false,
  maxFiles = 5,
  sizeType = 'featured',
  generateVariants = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedSizeType, setSelectedSizeType] = useState<ImageSizeType>(sizeType)
  const [enableVariants, setEnableVariants] = useState(generateVariants)

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('alt', '')
    formData.append('title', file.name)
    formData.append('sizeType', selectedSizeType)
    formData.append('generateVariants', enableVariants.toString())

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = acceptedFiles.map(file => uploadImage(file))
      const results = await Promise.all(uploadPromises)

      const successfulUploads = results
        .filter(result => result.success && result.image)
        .map(result => result.image!)

      const failedUploads = results.filter(result => !result.success)

      if (failedUploads.length > 0) {
        setError(`${failedUploads.length} uploads failed`)
      }

      if (successfulUploads.length > 0) {
        setUploadedImages(prev => [...prev, ...successfulUploads])
        
        if (!multiple && successfulUploads[0] && onImageSelect) {
          onImageSelect(successfulUploads[0])
        }
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [folder, multiple, onImageSelect, selectedSizeType, enableVariants])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    disabled: uploading
  })

  const selectImage = (image: UploadedImage) => {
    if (onImageSelect) {
      onImageSelect(image)
    }
  }

  const removeImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.publicId !== publicId))
  }

  return (
    <div className="w-full">
      {/* Image Size Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📏 Automatic Resizing Options</h3>
        
        {/* Size Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Standard Size:
          </label>
          <select
            value={selectedSizeType}
            onChange={(e) => setSelectedSizeType(e.target.value as ImageSizeType)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(IMAGE_SIZES).map(([key, config]) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)} ({config.width}×{config.height}px)
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Your uploaded image will be automatically resized to: <strong>{IMAGE_SIZES[selectedSizeType].width}×{IMAGE_SIZES[selectedSizeType].height}px</strong>
          </p>
        </div>

        {/* Generate Variants Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="generateVariants"
            checked={enableVariants}
            onChange={(e) => setEnableVariants(e.target.checked)}
            className="mr-2 rounded"
          />
          <label htmlFor="generateVariants" className="text-sm text-gray-600">
            Generate all size variants (Featured, Content, Thumbnail, etc.)
          </label>
        </div>
        
        {enableVariants && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-600">
            ✨ This will create optimized versions for all standard sizes automatically!
          </div>
        )}
      </div>

      {/* Standard Sizes Preview */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">📐 Standard Image Sizes</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {Object.entries(IMAGE_SIZES).map(([key, config]) => (
            <div 
              key={key} 
              className={`p-2 bg-white rounded border ${selectedSizeType === key ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="text-gray-500">{config.width}×{config.height}px</div>
              <div className="text-gray-400">Quality: {config.quality}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {uploading ? (
            <div>
              <p className="text-gray-600 mb-2">🔄 Uploading & Auto-Resizing...</p>
              <p className="text-sm text-gray-500">Optimizing to {IMAGE_SIZES[selectedSizeType].width}×{IMAGE_SIZES[selectedSizeType].height}px</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                📤 Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Supports: JPEG, PNG, WebP, GIF (max 10MB each)
              </p>
              <p className="text-sm text-blue-600 font-medium">
                ⚡ Will auto-resize to {IMAGE_SIZES[selectedSizeType].width}×{IMAGE_SIZES[selectedSizeType].height}px
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">📸 Uploaded Images (Auto-Resized)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.publicId}
                className="relative group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Uploaded image'}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {image.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(image.size / 1024)}KB • {image.width}×{image.height}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    📏 {image.sizeType || 'Standard'}
                  </p>
                  {image.variants && (
                    <p className="text-xs text-green-600">
                      ✨ {Object.keys(image.variants).length} variants created
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => selectImage(image)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => removeImage(image.publicId)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 