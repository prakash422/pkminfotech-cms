'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import { Image as ImageIcon, X } from 'lucide-react'

interface ImagePickerProps {
  onImageSelect: (imageUrl: string) => void
  trigger?: React.ReactNode
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

export default function ImagePicker({ onImageSelect, trigger }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')

  const handleImageSelect = (image: ImageData) => {
    onImageSelect(image.url)
    setIsOpen(false)
  }

  const defaultTrigger = (
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
      <ImageIcon className="h-4 w-4" />
      Insert Image
    </button>
  )

  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)}>
        {trigger || defaultTrigger}
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Select Image</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="border-b px-6">
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
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
      </div>
    </>
  )
} 