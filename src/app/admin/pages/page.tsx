'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/admin-layout'

interface Page {
  id: string
  title: string
  slug: string
  status: string
  pageType: string
  showInMenu: boolean
  updatedAt: string
  author: {
    name: string | null
    email: string
  }
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    setDeleting(pageId)
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setPages(pages.filter(page => page.id !== pageId))
      } else {
        alert('Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Page Management" description="Loading page data...">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Page Management" description="Manage your website pages (About, Contact, Privacy Policy, etc.)">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your website pages (About, Contact, Privacy Policy, etc.)
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + New Page
        </Link>
      </div>
      
      {pages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first page.</p>
              <Link
                href="/admin/pages/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <li key={page.id}>
                    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${
                            page.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {page.title}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              page.pageType === 'about' ? 'bg-blue-100 text-blue-800' :
                              page.pageType === 'services' ? 'bg-green-100 text-green-800' :
                              page.pageType === 'contact' ? 'bg-purple-100 text-purple-800' :
                              page.pageType === 'privacy' ? 'bg-red-100 text-red-800' :
                              page.pageType === 'disclaimers' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {page.pageType}
                            </span>
                            {page.showInMenu && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                In Menu
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>/pages/{page.slug}</span>
                            <span>•</span>
                            <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>by {page.author.name || page.author.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/pages/${page.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/pages/${page.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          disabled={deleting === page.id}
                          className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                        >
                          {deleting === page.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
    </AdminLayout>
  )
} 