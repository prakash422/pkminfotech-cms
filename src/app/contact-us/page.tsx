import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us - PKMInfotech | Get in Touch for Queries & Advertisements',
  description: 'Have a question about PKMInfotech? Contact us at prakash@pkminfotech.com for inquiries, advertising, technical issues, or feedback. We\'re here to help!',
  alternates: {
    canonical: '/contact-us'
  }
}

// This will be populated from your database
async function getContactUsContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/pages/slug/contact-us`, {
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
    console.error('Error fetching contact page:', error)
    return null
  }
}

export default async function ContactUsPage() {
  const page = await getContactUsContent()

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
            <span className="text-gray-900 font-medium">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Left Sidebar Ad */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="adsense-container" data-ad-format="auto"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
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
                    Contact Us
                  </h1>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>Get in touch with PKMInfotech for any queries, feedback, or collaboration opportunities.</p>
                    <p>Email us at: <a href="mailto:prakash@pkminfotech.com" className="text-blue-600 hover:text-blue-800">prakash@pkminfotech.com</a></p>
                    <p>We're here to help with your questions about technology, business, or our content.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Ad */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="adsense-container" data-ad-format="auto"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
} 