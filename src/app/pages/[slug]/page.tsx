import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'

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
    title: page.metaTitle || `${page.title} - Pkminfotech`,
    description: page.metaDescription || `${page.title} - Pkminfotech`,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle || `${page.title} - Pkminfotech`,
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
      {/* Header - Same as main site */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group" aria-label="Pkminfotech Homepage">
                <Image
                  src="/favicon-32x32.png"
                  alt="Pkminfotech Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 mr-2 lg:mr-3 group-hover:scale-105 transition-transform object-contain"
                  priority
                />
                <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Pkminfotech
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Main navigation">
              <Link 
                href="/" 
                className="font-medium transition-colors flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Home
              </Link>
              
              {/* Category Menu Buttons */}
              <Link 
                href="/?category=latest" 
                className="font-medium transition-colors px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Latest Blog
              </Link>
              
              <Link 
                href="/?category=english" 
                className="font-medium transition-colors px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                English Blog
              </Link>
              
              <Link 
                href="/?category=hindi" 
                className="font-medium transition-colors px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                हिंदी Blog
              </Link>
              
              <div className="hidden lg:flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <Link 
                  href="/about-us" 
                  className={`font-medium transition-colors px-3 py-2 rounded-lg ${
                    slug === 'about-us' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/contact-us" 
                  className={`font-medium transition-colors px-4 py-2 rounded-lg ${
                    slug === 'contact-us'
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Contact
                </Link>
              </div>
            </nav>

            {/* Mobile Menu */}
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
            <Link href="/">
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 text-sm lg:text-base py-2 lg:py-2.5 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

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

      {/* Footer - Same as main site */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/favicon-32x32.png"
                  alt="Pkminfotech Logo"
                  width={32}
                  height={32}
                  className="mr-3 object-contain"
                />
                <h3 className="text-2xl font-bold">Pkminfotech</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Pkminfotech is a dynamic blogging platform providing the latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="mailto:prakashkr806@gmail.com" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Email">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
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

            {/* Contact Info */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Get in Touch</h4>
              <ul className="space-y-3 lg:space-y-4">
                <li className="flex items-start">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm lg:text-base text-gray-400 leading-relaxed">Gurgaon, Haryana, India</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:prakashkr806@gmail.com" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors leading-relaxed break-words">
                    prakashkr806@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
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