import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Search, Home } from "lucide-react"
import { formatDate, truncateText } from "@/lib/utils"
import { Metadata } from "next"
import MobileMenu from "@/components/MobileMenu"
import AdSpace, { AdConfigs } from "@/components/AdSpace"

export const metadata: Metadata = {
  title: "Pkminfotech - Latest Tech News, Business Updates & Travel Guides",
  description: "Your source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.",
  keywords: "tech news, business updates, travel guides India, technology news, digital trends, tourist places, daily news, Pkminfotech",
  authors: [{ name: "Pkminfotech Team" }],
  creator: "Pkminfotech",
  publisher: "Pkminfotech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Pkminfotech - Latest Tech News, Business Updates & Travel Guides",
    description: "Your source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.",
    url: "https://pkminfotech.com",
    siteName: "Pkminfotech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Pkminfotech"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pkminfotech - Latest Tech News, Business Updates & Travel Guides",
    description: "Your source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.",
    images: ["/og-home.jpg"],
    creator: "@pkminfotech"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here",
  }
}

async function getBlogs(category?: string) {
  try {
    const params = new URLSearchParams({ status: 'published' })
    if (category && category !== 'all') {
      params.append('category', category)
    }
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs?${params}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  }
  return []
}

// JSON-LD Structured Data
function generateStructuredData(blogs: any[]) {
  const blogPosts = blogs.map(blog => ({
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.title,
    "image": blog.coverImage || "/default-blog-image.jpg",
    "author": {
      "@type": "Person",
      "name": "Pkminfotech Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt,
    "url": `https://pkminfotech.com/${blog.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pkminfotech.com/${blog.slug}`
    }
  }))

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Pkminfotech Blog",
    "description": "Latest tech news, business updates, travel guides and insights from Pkminfotech",
    "url": "https://pkminfotech.com",
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "blogPost": blogPosts
  }
}

export default async function HomePage({ searchParams }: { searchParams: { category?: string } }) {
  const selectedCategory = searchParams.category || 'all'
  const blogs = await getBlogs(selectedCategory)
  const structuredData = generateStructuredData(blogs)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Mobile-First Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center group" aria-label="Pkminfotech Homepage">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-2 lg:mr-3 group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-sm lg:text-lg">P</span>
                  </div>
                  <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Pkminfotech
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation" aria-label="Main navigation">
                <Link href="/" className="text-blue-600 font-medium flex items-center" aria-current="page">
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Home
                </Link>
                <div className="hidden lg:flex items-center space-x-6">
                  <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    About
                  </a>
                  <a href="#services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Services
                  </a>
                  <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Contact
                  </a>
                </div>
              </nav>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </header>

        {/* Header Ad Space - Desktop Only */}
        <div className="hidden lg:block bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSpace
              id="homepage-header-ad"
              className="min-h-[120px]"
              {...AdConfigs.headerBanner}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-8 lg:py-12">

            {/* Main Content */}
            <main className="lg:col-span-8" role="main">
              {/* Hero Section */}
              <section className="text-center mb-8 lg:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Welcome to <span className="text-blue-600">Pkminfotech</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 mb-8 lg:mb-12">
                  Your go-to source for latest tech news, business updates, travel guides, and insights from India and around the world. Stay informed with daily updates on technology and digital trends.
                </p>
              </section>

              {/* Mobile Ad After Hero */}
              <div className="lg:hidden mb-8">
                <AdSpace
                  id="homepage-mobile-ad"
                  className="min-h-[250px]"
                  {...AdConfigs.contentAd}
                />
              </div>

              {/* Category Navigation */}
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-8">
                <Link
                  href="/"
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  All Blogs
                </Link>
                <Link
                  href="/?category=latest"
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${selectedCategory === 'latest'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  Latest Blog
                </Link>
                <Link
                  href="/?category=english"
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${selectedCategory === 'english'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  English Blog
                </Link>
                <Link
                  href="/?category=hindi"
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${selectedCategory === 'hindi'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  हिंदी Blog
                </Link>
              </div>

              {/* Blog Content */}
              {blogs.length === 0 ? (
                <section className="text-center py-16 lg:py-20" aria-labelledby="no-posts-heading">
                  <div className="mx-auto w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 lg:mb-8">
                    <Search className="h-12 w-12 lg:h-16 lg:w-16 text-blue-600" aria-hidden="true" />
                  </div>
                  <h2 id="no-posts-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                  <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto px-4">
                    We're working on exciting content including tech news, business updates, and travel guides. Check back soon for our latest articles.
                  </p>
                  <Link href="/admin">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 lg:px-8 py-3 text-base lg:text-lg">
                      <Home className="h-4 w-4 lg:h-5 lg:w-5 mr-2" aria-hidden="true" />
                      Admin Panel
                    </Button>
                  </Link>
                </section>
              ) : (
                <>
                  <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 lg:mb-12 gap-4" aria-labelledby="articles-heading">
                    <div>
                      <h2 id="articles-heading" className="text-xl lg:text-2xl font-semibold text-gray-900">
                        {selectedCategory === 'all' && 'All Articles'}
                        {selectedCategory === 'latest' && 'Latest Articles'}
                        {selectedCategory === 'english' && 'English Articles'}
                        {selectedCategory === 'hindi' && 'हिंदी Articles'}
                      </h2>
                      <p className="text-gray-600 text-sm lg:text-base">
                        {blogs.length} article{blogs.length !== 1 ? 's' : ''} {selectedCategory !== 'all' ? `in ${selectedCategory}` : 'published'}
                      </p>
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" aria-label="Blog posts">
                    {blogs.map((blog: any) => (
                      <article key={blog.id} className="group" itemScope itemType="http://schema.org/BlogPosting">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                          {blog.coverImage && (
                            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                              <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                itemProp="image"
                              />
                            </div>
                          )}
                          <CardHeader className="p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.category === 'hindi'
                                  ? 'bg-orange-100 text-orange-800'
                                  : blog.category === 'english'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                {blog.category === 'hindi' ? 'हिंदी' :
                                  blog.category === 'english' ? 'English' : 'Latest'}
                              </span>
                            </div>
                            <CardTitle className="line-clamp-2 text-lg lg:text-xl" itemProp="headline">
                              <Link
                                href={`/${blog.slug}`}
                                className="hover:text-blue-600 transition-colors group-hover:text-blue-600"
                                itemProp="url"
                              >
                                {blog.title}
                              </Link>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col p-4 lg:p-6 pt-0">
                            {blog.excerpt && (
                              <p className="text-gray-600 mb-4 lg:mb-6 line-clamp-3 flex-1 text-sm lg:text-base" itemProp="description">
                                {truncateText(blog.excerpt, 120)}
                              </p>
                            )}

                            <div className="mt-auto">
                              <div className="flex items-center text-xs lg:text-sm text-gray-500 mb-4">
                                <div className="flex items-center mr-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                                  <User className="h-3 w-3 lg:h-4 lg:w-4 mr-1" aria-hidden="true" />
                                  <span className="font-medium" itemProp="name">Pkminfotech Team</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1" aria-hidden="true" />
                                  <time
                                    dateTime={blog.publishedAt || blog.createdAt}
                                    itemProp="datePublished"
                                  >
                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                  </time>
                                </div>
                              </div>

                              <Link href={`/${blog.slug}`}>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm lg:text-base py-2 lg:py-3">
                                  Read Article
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </article>
                    ))}
                  </section>
                </>
              )}
            </main>

            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-4" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Sidebar Ad */}
                <AdSpace
                  id="homepage-sidebar-ad"
                  className="min-h-[600px]"
                  {...AdConfigs.sidebarBanner}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="font-medium">Sidebar Ad</p>
                    <p className="text-xs text-gray-300 mt-1">300x600 Banner</p>
                    <p className="text-xs text-gray-300">Google AdSense</p>
                  </div>
                </AdSpace>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the latest tech news and updates delivered to your inbox.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Second Sidebar Ad */}
                <AdSpace
                  id="homepage-sidebar-ad-2"
                  className="min-h-[300px]"
                  {...AdConfigs.squareAd}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <p className="font-medium">Square Ad</p>
                    <p className="text-xs text-gray-300 mt-1">300x300 Banner</p>
                  </div>
                </AdSpace>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer Ad Section */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSpace
              id="homepage-footer-ad"
              className="min-h-[200px] bg-white"
              {...AdConfigs.footerBanner}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <p className="font-medium text-gray-600">Footer Banner Ad</p>
                <p className="text-xs text-gray-400 mt-1">728x90 Leaderboard</p>
              </div>
            </AdSpace>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Company Info */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
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
                    <a href="#about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Contact
                    </a>
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
                    <a href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                    <a href="/cookies" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
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
    </>
  )
}
