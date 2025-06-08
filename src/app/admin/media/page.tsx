'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import ImageUpload from '@/components/admin/ImageUpload'
import ImageGallery from '@/components/admin/ImageGallery'

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery')
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const handleImageSelect = (image: any) => {
    setSelectedImage(image)
    console.log('Selected image:', image)
  }

  return (
    <AdminLayout title="Media Manager" description="Upload and manage your blog images">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <nav className="flex space-x-8 border-b pb-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'gallery'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📷 Image Gallery
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ⬆️ Upload Images
            </button>
          </nav>

          {/* Content */}
          <div className="mt-6">
            {activeTab === 'gallery' ? (
              <ImageGallery 
                onImageSelect={handleImageSelect}
                folder="blog-images"
                selectable={true}
              />
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload New Images</h2>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  folder="blog-images"
                  multiple={true}
                  maxFiles={10}
                />
              </div>
            )}
          </div>
        </div>

        {/* Selected Image Info */}
        {selectedImage && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Selected Image</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || 'Selected image'}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="text"
                    value={selectedImage.url}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Public ID</label>
                  <input
                    type="text"
                    value={selectedImage.publicId}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Width</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedImage.width}px</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedImage.height}px</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <p className="mt-1 text-sm text-gray-900 uppercase">{selectedImage.format}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {Math.round(selectedImage.size / 1024)}KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedImage.url)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 