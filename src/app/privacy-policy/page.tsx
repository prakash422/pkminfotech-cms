import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - PKMInfotech',
  description: 'Read our privacy policy to understand how PKMInfotech collects, uses, and protects your personal information.',
  alternates: {
    canonical: '/privacy-policy'
  }
}

export const dynamic = 'force-dynamic'

// This will be populated from your database
async function getPrivacyPolicyContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/pages/slug/privacy-policy`, {
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
    console.error('Error fetching privacy policy page:', error)
    return null
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicyContent()

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
            <span className="text-gray-900 font-medium">Privacy Policy</span>
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
                    Privacy Policy
                  </h1>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                    <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
                    <p className="mb-4 leading-relaxed">PKMInfotech collects information you provide directly to us, such as when you contact us via email.</p>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
                    <p className="mb-4 leading-relaxed">We use the information we collect to provide, maintain, and improve our services and content.</p>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
                    <p className="mb-4 leading-relaxed">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
                    <p className="mb-4 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:prakash@pkminfotech.com" className="text-blue-600 hover:text-blue-800 font-medium underline">prakash@pkminfotech.com</a></p>
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