import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// This will be populated from your database
async function getPageBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pages/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.page
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  
  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || `${page.title} - Pkminfotech`,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || `${page.title} - Pkminfotech`,
      type: 'website',
    },
    alternates: {
      canonical: `/pages/${slug}`
    }
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/favicon.ico"
                alt="Pkminfotech Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pkminfotech
              </span>
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 font-medium">{page.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            {page.title}
          </h1>

          {/* Page Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Page Meta Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
            <div>
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </div>
            {page.author && (
              <div>
                By: {page.author.name || page.author.email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Pkminfotech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 