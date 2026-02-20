import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search, AlertTriangle } from 'lucide-react'
import { Metadata } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Pkminfotech',
  description: 'The page you are looking for could not be found. Explore our latest tech news, business updates, and travel guides.',
  robots: {
    index: false,
    follow: false
  }
}

export default async function NotFound() {
  // Get the current path for intelligent suggestions
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Generate intelligent suggestions based on path
  const suggestions = getIntelligentSuggestions(pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          पेज नहीं मिला | Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          यह पेज उपलब्ध नहीं है। कृपया नीचे दिए गए विकल्पों में से चुनें।
        </p>

        {/* Intelligent Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">आपको ये पसंद आ सकते हैं:</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.url}
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-blue-700">{suggestion.title}</div>
                  <div className="text-sm text-blue-600">{suggestion.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Options */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            🏠 होम पेज जाएं
          </Link>
          
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/latest"
              className="bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
            >
              📱 Latest
            </Link>
            <Link
              href="/hindi"
              className="bg-orange-100 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              🇮🇳 Hindi
            </Link>
            <Link
              href="/english"
              className="bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              🇺🇸 English
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">कुछ खास खोज रहे हैं?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Technology</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Travel</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Business</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Life Tips</span>
          </div>
        </div>

        {/* Report Issue */}
        <div className="mt-6 text-xs text-gray-400">
          यदि आप यहाँ गलती से पहुंचे हैं, तो कृपया <Link href="/contact" className="text-blue-500 hover:underline">संपर्क करें</Link>
        </div>
      </div>
    </div>
  )
}

function getIntelligentSuggestions(pathname: string) {
  const suggestions = []
  const lower = pathname.toLowerCase()

  // Content-based suggestions
  if (lower.includes('microsoft') || lower.includes('tech') || lower.includes('software')) {
    suggestions.push({
      title: 'Latest Technology Posts',
      description: 'नवीनतम तकनीकी समाचार और गाइड',
      url: '/latest'
    })
  }

  if (lower.includes('hindi') || lower.includes('subsidy')) {
    suggestions.push({
      title: 'Hindi Content',
      description: 'हिंदी में उपयोगी जानकारी',
      url: '/hindi'
    })
  }

  if (lower.includes('english') || lower.includes('guide') || lower.includes('tutorial')) {
    suggestions.push({
      title: 'English Guides',
      description: 'Comprehensive English tutorials',
      url: '/english'
    })
  }

  if (lower.includes('travel') || lower.includes('diwali') || lower.includes('festival')) {
    suggestions.push({
      title: 'Travel & Lifestyle',
      description: 'यात्रा और जीवनशैली की जानकारी',
      url: '/latest'
    })
  }

  // Default suggestions if no matches
  if (suggestions.length === 0) {
    suggestions.push(
      {
        title: 'Popular Posts',
        description: 'सबसे लोकप्रिय लेख पढ़ें',
        url: '/latest'
      },
      {
        title: 'Categories',
        description: 'विषय के अनुसार ब्राउज़ करें',
        url: '/hindi'
      }
    )
  }

  return suggestions.slice(0, 3) // Max 3 suggestions
} 