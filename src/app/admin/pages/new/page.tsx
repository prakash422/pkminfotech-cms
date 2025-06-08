'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/admin-layout'
import RichTextEditor from '@/components/editor/rich-text-editor'

interface PageFormData {
  title: string
  slug: string
  content: string
  metaTitle: string
  metaDescription: string
  keywords: string
  status: 'draft' | 'published'
  showInMenu: boolean
  menuOrder: number
  pageType: 'static' | 'about' | 'services' | 'contact' | 'privacy' | 'terms'
}

export default function NewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'published',
    showInMenu: true,
    menuOrder: 0,
    pageType: 'static'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setFormData(prev => ({
      ...prev,
      title,
      slug,
      metaTitle: title || prev.metaTitle
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/pages')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Error creating page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Create New Page" description="Add a new page to your website">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Page Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Page Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white px-3 py-2"
                  placeholder="e.g., About Us"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /pages/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white px-3 py-2"
                    placeholder="about-us"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pageType" className="block text-sm font-medium text-gray-700">
                    Page Type
                  </label>
                  <select
                    name="pageType"
                    id="pageType"
                    value={formData.pageType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white px-3 py-2"
                  >
                    <option value="static">Static Page</option>
                    <option value="about">About Us</option>
                    <option value="services">Services</option>
                    <option value="contact">Contact Page</option>
                    <option value="privacy">Privacy Policy</option>
                    <option value="terms">Terms of Service</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white px-3 py-2"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    id="showInMenu"
                    name="showInMenu"
                    type="checkbox"
                    checked={formData.showInMenu}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showInMenu" className="ml-2 block text-sm text-gray-900">
                    Show in navigation menu
                  </label>
                </div>

                <div>
                  <label htmlFor="menuOrder" className="block text-sm font-medium text-gray-700">
                    Menu Order
                  </label>
                  <input
                    type="number"
                    name="menuOrder"
                    id="menuOrder"
                    value={formData.menuOrder}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Page Content</h2>
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your page content here..."
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SEO title for search engines"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  id="metaDescription"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description for search engines"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  id="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/pages')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 