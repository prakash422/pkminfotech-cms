import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/favicon-32x32.png"
                  alt="Pkminfotech Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 mr-2 lg:mr-3"
                />
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  Pkminfotech
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                <Home className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
              <Link href="/latest" className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                Latest Blog
              </Link>
              <Link href="/english" className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                English Blog
              </Link>
              <Link href="/hindi" className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                हिंदी Blog
              </Link>
              <div className="hidden lg:flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <Link href="/about-us" className="font-medium transition-colors px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
                  About
                </Link>
                <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Contact
                </Link>
              </div>
            </nav>

            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

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

      {/* Footer - Same as blog pages */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/favicon-32x32.png"
                  alt="Pkminfotech Logo"
                  width={32}
                  height={32}
                  className="mr-3"
                />
                <h3 className="text-2xl font-bold">Pkminfotech</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Pkminfotech is a dynamic blogging platform providing the latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-y-4 gap-x-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Get in Touch</h4>
              <ul className="space-y-3 lg:space-y-4">
                <li className="flex items-start">
                  <span className="text-sm lg:text-base text-gray-400 leading-relaxed">Gurgaon, Haryana, India</span>
                </li>
                <li className="flex items-start">
                  <a href="mailto:prakashkr806@gmail.com" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors leading-relaxed break-words">
                    prakashkr806@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-gray-500 text-sm">
                  &copy; 2024 Pkminfotech. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm">
                  <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/disclaimers" className="text-gray-500 hover:text-white transition-colors">Disclaimers</Link>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-500 text-sm">
                  Made with ❤️ in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 