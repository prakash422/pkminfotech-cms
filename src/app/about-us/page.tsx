import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - PKMInfotech',
  description: 'Learn more about PKMInfotech - your source for tech news, travel guides, and business insights.',
  alternates: {
    canonical: '/about-us'
  }
}

// This will be populated from your database
async function getAboutUsContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/pages/slug/about-us`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.page
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export default async function AboutUsPage() {
  const page = await getAboutUsContent()

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
            <span className="text-gray-900 font-medium">About Us</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-12">
          <div className="bg-white rounded-2xl shadow-sm border p-8 lg:p-12">
            {page ? (
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {page.title}
                </h1>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>div]:my-6 [&>ul]:my-4 [&>ol]:my-4 [&>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  About Us
                </h1>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>Welcome to PKMInfotech - your trusted source for technology news, business insights, and travel guides.</p>
                  <p>We are passionate about delivering authentic, informative, and engaging content to keep you updated with the world around you.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
} 