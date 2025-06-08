'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import { Image as ImageIcon, X } from 'lucide-react'

interface ImagePickerProps {
  onImageSelect: (imageUrl: string) => void
  onClose?: () => void
  trigger?: React.ReactNode
  title?: string
  sizeRecommendation?: string
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
}

export default function ImagePicker({ 
  onImageSelect, 
  onClose, 
  trigger,
  title = "Select Image",
  sizeRecommendation
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(!onClose) // If onClose provided, start open (modal mode)
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')

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

  // If onClose is provided, we're in modal-only mode (always open)
  if (onClose || isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[85vh] flex flex-col">
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

            {/* Content - This will be scrollable */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {activeTab === 'gallery' ? (
                <ImageGallery 
                  onImageSelect={handleImageSelect}
                  folder="blog-images"
                  selectable={true}
                />
              ) : (
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  folder="blog-images"
                  multiple={false}
                  maxFiles={1}
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