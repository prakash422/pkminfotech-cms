import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimers - PKMInfotech',
  description: 'Read our disclaimers regarding the content and information provided on PKMInfotech.',
  alternates: {
    canonical: '/disclaimers'
  }
}

// This will be populated from your database
async function getDisclaimersContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/pages/slug/disclaimers`, {
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
    console.error('Error fetching disclaimers page:', error)
    return null
  }
}

export default async function DisclaimersPage() {
  const page = await getDisclaimersContent()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="container py-3" style={{ maxWidth: 1120 }}>
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 font-medium">Disclaimers</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10">
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
                Disclaimers
              </h1>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">General Information</h2>
                <p className="mb-4 leading-relaxed">The information on PKMInfotech is provided for general informational purposes only. We make no warranties about the completeness, reliability, and accuracy of this information.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">External Links</h2>
                <p className="mb-4 leading-relaxed">PKMInfotech may contain links to external websites. We have no control over the content and practices of these sites and cannot accept responsibility for their content.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Advice</h2>
                <p className="mb-4 leading-relaxed">The content on this website is not intended to be a substitute for professional advice. Always seek the advice of qualified professionals for specific questions.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
                <p className="mb-4 leading-relaxed">PKMInfotech will not be liable for any loss or damage arising from the use of information on this website.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
                <p className="mb-4 leading-relaxed">If you have any questions about these disclaimers, please contact us at <a href="mailto:prakash@pkminfotech.com" className="text-blue-600 hover:text-blue-800 font-medium underline">prakash@pkminfotech.com</a></p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
} 