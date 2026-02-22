import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// This will be populated from your database
async function getPageBySlug(slug: string) {
  try {
    // Use internal API URL for server-side rendering
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/pages/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch page: ${response.status} ${response.statusText}`)
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
    title: page.metaTitle || `${page.title} - pkminfotech`,
    description: page.metaDescription || `${page.title} - pkminfotech`,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle || `${page.title} - pkminfotech`,
      description: page.metaDescription || `${page.title} - pkminfotech`,
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
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="container py-3" style={{ maxWidth: 1120 }}>
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 font-medium">{page.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content with Ads */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Left Sidebar Ad - Hidden on mobile/tablet */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Ad Space 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6 border border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-blue-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">Advertisement</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 font-medium">Your Ad Here</p>
                  <p className="text-xs text-gray-500 mt-1">300x250 Banner</p>
                </div>
              </div>

              {/* Ad Space 2 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-sm">
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-green-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">Sponsored</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-medium">Premium Ad Space</p>
                  <p className="text-xs text-gray-500 mt-1">300x250 Banner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
              {/* Page Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                {page.title}
              </h1>

              {/* Page Content - Fixed styling */}
              <div 
                className="prose prose-xl max-w-none text-lg leading-relaxed
                  [&_p]:text-gray-900 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6
                  [&_h1]:text-gray-900 [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-4
                  [&_h2]:text-blue-700 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-blue-600 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                  [&_h4]:text-gray-900 [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
                  [&_h5]:text-gray-900 [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2
                  [&_h6]:text-gray-900 [&_h6]:font-semibold [&_h6]:mt-4 [&_h6]:mb-2
                  [&_a]:text-blue-600 [&_a]:font-medium [&_a]:underline hover:[&_a]:text-blue-700
                  [&_strong]:text-gray-900 [&_strong]:font-bold
                  [&_ul]:text-gray-900 [&_ul]:text-lg [&_ul]:my-6 [&_ul]:pl-7
                  [&_ol]:text-gray-900 [&_ol]:text-lg [&_ol]:my-6 [&_ol]:pl-7
                  [&_li]:text-gray-900 [&_li]:mb-3 [&_li]:leading-relaxed
                  [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 
                  [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg
                  [&_blockquote]:text-blue-800 [&_blockquote]:italic
                  [&_blockquote_p]:text-blue-800 [&_blockquote_p]:m-0
                  [&_hr]:border-0 [&_hr]:h-0.5 [&_hr]:bg-gradient-to-r [&_hr]:from-blue-500 [&_hr]:to-blue-600 
                  [&_hr]:rounded [&_hr]:my-8
                  [&_code]:bg-gray-100 [&_code]:text-gray-900 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm"
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

          {/* Right Sidebar Ad - Hidden on mobile/tablet */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Ad Space 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 mb-6 border border-purple-200 shadow-sm">
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-purple-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">Featured</p>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 font-medium">Featured Content</p>
                  <p className="text-xs text-gray-500 mt-1">300x250 Banner</p>
                </div>
              </div>

              {/* Ad Space 4 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200 shadow-sm">
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-orange-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">Recommended</p>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 font-medium">Related Products</p>
                  <p className="text-xs text-gray-500 mt-1">300x250 Banner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
} 