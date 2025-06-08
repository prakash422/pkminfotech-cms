'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { IMAGE_SIZES, type ImageSizeType } from '@/constants/imageSizes'
import { IMAGE_FOLDERS, getFolderOptions, type ImageFolder } from '@/constants/imageFolders'

interface ImageUploadProps {
  onImageSelect?: (image: UploadedImage) => void
  initialFolder?: string
  multiple?: boolean
  maxFiles?: number
  sizeType?: ImageSizeType
  generateVariants?: boolean
  allowFolderSelection?: boolean
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
  folder?: string
}

interface UploadResponse {
  success: boolean
  image?: UploadedImage
  error?: string
}

export default function EnhancedImageUpload({ 
  onImageSelect, 
  initialFolder = 'blog-images',
  multiple = false,
  maxFiles = 5,
  sizeType = 'featured',
  generateVariants = false,
  allowFolderSelection = true
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedSizeType, setSelectedSizeType] = useState<ImageSizeType>(sizeType)
  const [enableVariants, setEnableVariants] = useState(generateVariants)
  const [selectedFolder, setSelectedFolder] = useState<string>(initialFolder)

  const currentFolderConfig = IMAGE_FOLDERS[selectedFolder]
  const folderOptions = getFolderOptions()

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', selectedFolder)
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
        .map(result => ({
          ...result.image!,
          folder: selectedFolder
        }))

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
  }, [selectedFolder, multiple, onImageSelect, selectedSizeType, enableVariants])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': currentFolderConfig?.allowedTypes?.map(type => `.${type}`) || ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    disabled: uploading,
    maxSize: (currentFolderConfig?.maxSizeMB || 10) * 1024 * 1024
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
      {allowFolderSelection && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📁 Choose Upload Destination</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Folder Category:
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              {folderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {currentFolderConfig && (
            <div className="p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{currentFolderConfig.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{currentFolderConfig.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{currentFolderConfig.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <strong>Suggested Size:</strong> {currentFolderConfig.suggestedSize}
                    </div>
                    <div>
                      <strong>Max Size:</strong> {currentFolderConfig.maxSizeMB}MB
                    </div>
                    <div className="md:col-span-2">
                      <strong>Allowed Types:</strong> {currentFolderConfig.allowedTypes?.join(', ').toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📏 Automatic Resizing Options</h3>
        
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
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="generateVariants"
            checked={enableVariants}
            onChange={(e) => setEnableVariants(e.target.checked)}
            className="mr-2 rounded"
          />
          <label htmlFor="generateVariants" className="text-sm text-gray-600">
            Generate all size variants
          </label>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-4">
            {currentFolderConfig?.icon || '📤'}
          </div>
          
          {uploading ? (
            <div>
              <p className="text-gray-600 mb-2">🔄 Uploading to {currentFolderConfig?.name}...</p>
              <p className="text-sm text-gray-500">Optimizing to {IMAGE_SIZES[selectedSizeType].width}×{IMAGE_SIZES[selectedSizeType].height}px</p>
            </div>
          ) : isDragActive ? (
            <p className="text-purple-600">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                📤 Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Will upload to: <span className="font-medium text-purple-600">{currentFolderConfig?.name}</span>
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Supports: {currentFolderConfig?.allowedTypes?.join(', ').toUpperCase()} (max {currentFolderConfig?.maxSizeMB}MB each)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">📸 Uploaded Images</h3>
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
                  <p className="text-xs text-purple-600 font-medium">
                    📁 {IMAGE_FOLDERS[image.folder || selectedFolder]?.name || 'Unknown'}
                  </p>
                </div>

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