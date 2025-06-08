'use client'

import { useState } from 'react'
import EnhancedImageUpload from './EnhancedImageUpload'
import PaginatedImageGallery from './PaginatedImageGallery'
import { IMAGE_FOLDERS, getFolderOptions } from '@/constants/imageFolders'
import { Image as ImageIcon, X } from 'lucide-react'

interface ImagePickerProps {
  onImageSelect: (imageUrl: string) => void
  onClose?: () => void
  trigger?: React.ReactNode
  title?: string
  sizeRecommendation?: string
  defaultFolder?: string
  recommendedFolders?: string[]
}

interface ImageData {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
  alt?: string
  title?: string
  folder?: string
}

export default function EnhancedImagePicker({ 
  onImageSelect, 
  onClose, 
  trigger,
  title = "Select Image",
  sizeRecommendation,
  defaultFolder = 'content-images',
  recommendedFolders = ['content-images', 'featured-images', 'thumbnails']
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(!onClose)
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolder)

  const handleImageSelect = (image: ImageData) => {
    onImageSelect(image.url)
    if (onClose) {
      onClose()
    } else {
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setIsOpen(false)
    }
  }

  const defaultTrigger = (
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
      <ImageIcon className="h-4 w-4" />
      Insert Image
    </button>
  )

  // Get folder options, prioritizing recommended folders
  const folderOptions = getFolderOptions()
  const sortedFolderOptions = [
    ...folderOptions.filter(option => recommendedFolders.includes(option.value)),
    ...folderOptions.filter(option => !recommendedFolders.includes(option.value))
  ]

  const currentFolderConfig = IMAGE_FOLDERS[selectedFolder]

  if (onClose || isOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={handleClose}
        />
        
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {sizeRecommendation && (
                  <p className="text-sm text-gray-600 mt-1">{sizeRecommendation}</p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b px-6 flex-shrink-0">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'gallery'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📷 Gallery
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'upload'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ⬆️ Upload
                </button>
              </nav>
            </div>

            {/* Folder Selector */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b flex-shrink-0">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  📁 Browse Category:
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm"
                >
                  {sortedFolderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* Current Folder Info */}
                {currentFolderConfig && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{currentFolderConfig.icon}</span>
                    <span>{currentFolderConfig.description}</span>
                    <span className="text-purple-600 font-medium">
                      (Suggested: {currentFolderConfig.suggestedSize})
                    </span>
                  </div>
                )}
              </div>
              
              {/* Recommended Folders Quick Select */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Quick Select:</span>
                {recommendedFolders.map((folderId) => {
                  const folder = IMAGE_FOLDERS[folderId]
                  return (
                    <button
                      key={folderId}
                      onClick={() => setSelectedFolder(folderId)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedFolder === folderId
                          ? 'bg-purple-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      {folder?.icon} {folder?.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {activeTab === 'gallery' ? (
                <PaginatedImageGallery 
                  onImageSelect={handleImageSelect}
                  folder={selectedFolder}
                  selectable={true}
                  allowBulkDelete={false}
                />
              ) : (
                <EnhancedImageUpload
                  onImageSelect={handleImageSelect}
                  initialFolder={selectedFolder}
                  multiple={false}
                  maxFiles={1}
                  allowFolderSelection={false}
                />
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div onClick={() => setIsOpen(true)}>
      {trigger || defaultTrigger}
    </div>
  )
} 