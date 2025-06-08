'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect?: (image: UploadedImage) => void
  folder?: string
  multiple?: boolean
  maxFiles?: number
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
  maxFiles = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('alt', '')
    formData.append('title', file.name)

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
  }, [folder, multiple, onImageSelect])

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
            <p className="text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPEG, PNG, WebP, GIF (max 10MB each)
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
          <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
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