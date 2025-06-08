import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Calendar, Home, Search, User } from "lucide-react"
import { formatDate, truncateText } from "@/lib/utils"
import AdSpace, { AdConfigs } from "@/components/AdSpace"
import MobileMenu from "@/components/MobileMenu"
import { Metadata } from "next"

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const selectedCategory = params.category || 'all'
  
  const pageTitle = currentPage > 1 
    ? `Latest Blogs - Page ${currentPage} | Pkminfotech`
    : 'Latest Tech News, Business Updates & Travel Guides | Pkminfotech'
  
  const pageDescription = currentPage > 1
    ? `Browse our latest blog posts on page ${currentPage}. Discover tech news, travel guides, and business insights.`
    : 'Your source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.'

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pkminfotech.com'
  const canonicalUrl = currentPage > 1 
    ? `${baseUrl}/page/${currentPage}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
    : `${baseUrl}${selectedCategory !== 'all' ? `/?category=${selectedCategory}` : ''}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: "tech news, business updates, travel guides India, technology news, digital trends, tourist places, daily news, Pkminfotech",
    authors: [{ name: "Pkminfotech Team" }],
    creator: "Pkminfotech",
    publisher: "Pkminfotech",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: currentPage === 1,
      follow: true,
      googleBot: {
        index: currentPage === 1,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: "Pkminfotech",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/favicon.ico",
          width: 32,
          height: 32,
          alt: "Pkminfotech Logo"
        },
        {
          url: "/og-home.jpg",
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/favicon.ico", "/og-home.jpg"],
      creator: "@pkminfotech"
    },
    verification: {
      google: "google-site-verification-code-here",
    }
  }
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  category: string
  status: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    name: string | null
    email: string | null
  }
}

// Server-side data fetching with pagination
async function getBlogs(category?: string, page: number = 1, limit: number = 15) {
  try {
    const where: { status: string; category?: string } = {
      status: 'published'
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    const skip = (page - 1) * limit

    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.blog.count({ where })
    ])

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return {
      blogs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }
}

// Generate structured data for SEO
function generateStructuredData(blogs: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Pkminfotech",
    "description": "Latest tech news, business updates & travel guides from India and worldwide",
    "url": "https://pkminfotech.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pkminfotech.com/favicon.ico",
      "width": 32,
      "height": 32
    },
    "author": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pkminfotech.com/favicon.ico",
        "width": 32,
        "height": 32
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pkminfotech.com/favicon.ico",
        "width": 32,
        "height": 32
      }
    },
    "blogPost": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt,
      "image": blog.coverImage,
      "datePublished": blog.publishedAt,
      "dateModified": blog.updatedAt,
      "author": {
        "@type": "Person",
        "name": blog.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Pkminfotech",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pkminfotech.com/favicon.ico",
          "width": 32,
          "height": 32
        }
      }
    }))
  }
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const params = await searchParams
  const selectedCategory = params.category || 'all'
  const currentPage = parseInt(params.page || '1', 10)
  const blogsData = await getBlogs(selectedCategory, currentPage)
  const structuredData = generateStructuredData(blogsData.blogs)

  // SEO Meta Data
  const pageTitle = currentPage > 1 
    ? `Latest Blogs - Page ${currentPage} | Pkminfotech`
    : 'Latest Tech News, Travel Guides & Business Updates | Pkminfotech'
  
  const pageDescription = currentPage > 1
    ? `Browse our latest blog posts on page ${currentPage}. Discover tech news, travel guides, and business insights.`
    : 'Discover latest tech news, business updates, travel guides for India and worldwide destinations. Your source for technology trends and digital insights.'

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Mobile-First Header */}
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
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation" aria-label="Main navigation">
                <Link href="/" className="text-blue-600 font-medium flex items-center" aria-current="page">
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Home
                </Link>
                
                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center">
                    Categories
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link 
                      href="/" 
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      All Blogs
                    </Link>
                    <Link 
                      href="/?category=latest" 
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCategory === 'latest' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      Latest Blog
                    </Link>
                    <Link 
                      href="/?category=english" 
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCategory === 'english' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      English Blog
                    </Link>
                    <Link 
                      href="/?category=hindi" 
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg transition-colors ${selectedCategory === 'hindi' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      हिंदी Blog
                    </Link>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center space-x-6">
                  <Link href="/pages/about-us" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    About
                  </Link>
                  <Link href="/pages/services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Services
                  </Link>
                  <Link href="/pages/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Contact
                  </Link>
                </div>
              </nav>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </header>

        {/* Top Banner Ad - Direct after header */}
        <section className="bg-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSpace 
              id="hero-banner-ad" 
              className="min-h-[90px] lg:min-h-[200px]"
              {...AdConfigs.headerBanner}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg">🚀</span>
                </div>
                <p className="font-medium text-gray-600 text-sm">Banner Ad Space</p>
                <p className="text-xs text-gray-400">High visibility placement</p>
              </div>
            </AdSpace>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 py-8 lg:py-12">
            
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Left Sidebar Ad 1 */}
                <AdSpace 
                  id="homepage-left-sidebar-ad-1" 
                  className="min-h-[600px]"
                  {...AdConfigs.sidebarBanner}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <p className="font-medium text-xs">Home Left Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x600</p>
                    <p className="text-xs text-gray-300">Skyscraper</p>
                  </div>
                </AdSpace>

                {/* Left Sidebar Ad 2 */}
                <AdSpace id="homepage-left-sidebar-ad-2" className="min-h-[300px]">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <p className="font-medium text-xs">Square Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x300</p>
                  </div>
                </AdSpace>
              </div>
            </aside>

            {/* Main Content - Centered */}
            <main className="lg:col-span-8" role="main">
              {/* Mobile Ad After Hero */}
              <div className="lg:hidden mb-8">
                <AdSpace
                  id="homepage-mobile-ad"
                  className="min-h-[250px]"
                  {...AdConfigs.contentAd}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="font-medium text-gray-600">Mobile Home Ad</p>
                    <p className="text-xs text-gray-400 mt-1">320x250 Mobile Banner</p>
                  </div>
                </AdSpace>
              </div>

              {/* Blog Content */}
              {blogsData.blogs.length === 0 ? (
                <section className="text-center py-16 lg:py-20" aria-labelledby="no-posts-heading">
                  <div className="mx-auto w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 lg:mb-8">
                    <Search className="h-12 w-12 lg:h-16 lg:w-16 text-blue-600" aria-hidden="true" />
                  </div>
                  <h2 id="no-posts-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                  <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto px-4">
                    We&apos;re working on exciting content including tech news, business updates, and travel guides. Check back soon for our latest articles.
                  </p>
                </section>
              ) : (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Blog posts">
                  {blogsData.blogs.map((blog: BlogPost) => (
                    <article key={blog.id} className="group" itemScope itemType="http://schema.org/BlogPosting">
                      <Card className="h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden">
                        {blog.coverImage && (
                          <div className="aspect-[16/10] w-full overflow-hidden">
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              itemProp="image"
                            />
                          </div>
                        )}
                        
                        <div className="flex flex-col flex-1 p-4">
                          {/* Category Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${blog.category === 'hindi'
                                ? 'bg-orange-100 text-orange-700'
                                : blog.category === 'english'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                              {blog.category === 'hindi' ? 'हिंदी' :
                                blog.category === 'english' ? 'English' : 'Latest'}
                            </span>
                            <div className="flex items-center text-gray-400 text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              <time
                                dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}
                                itemProp="datePublished"
                              >
                                {blog.publishedAt ? formatDate(blog.publishedAt) : formatDate(blog.createdAt)}
                              </time>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight" itemProp="headline">
                            <Link 
                              href={`/${blog.slug}`}
                              className="hover:text-blue-600 transition-colors"
                              itemProp="url"
                            >
                              {blog.title}
                            </Link>
                          </h3>

                          {/* Excerpt */}
                          {blog.excerpt && (
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed" itemProp="description">
                              {truncateText(blog.excerpt, 120)}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="mt-auto pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center text-xs text-gray-500" itemProp="author" itemScope itemType="http://schema.org/Person">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                  <User className="h-3 w-3 text-blue-600" />
                                </div>
                                <span itemProp="name">Pkminfotech Team</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                5 min read
                              </div>
                            </div>

                            <Link href={`/${blog.slug}`} className="block">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm py-2 rounded-md font-medium">
                                Read Article
                                <ArrowLeft className="h-3 w-3 ml-2 rotate-180" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </article>
                  ))}
                </section>
              )}

              {/* Pagination */}
              {blogsData.pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    {/* Previous Page */}
                    {blogsData.pagination.hasPrevPage ? (
                      <Link
                        href={blogsData.pagination.currentPage === 2 
                          ? `/${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
                          : `/page/${blogsData.pagination.currentPage - 1}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
                        }
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                        Previous
                      </span>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, blogsData.pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, blogsData.pagination.currentPage - 2);
                      const pageNumber = startPage + i;
                      
                      if (pageNumber > blogsData.pagination.totalPages) return null;
                      
                      const isCurrentPage = pageNumber === blogsData.pagination.currentPage;
                      
                      return (
                        <Link
                          key={pageNumber}
                          href={pageNumber === 1 
                            ? `/${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
                            : `/page/${pageNumber}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
                          }
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white border border-blue-600'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          aria-current={isCurrentPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </Link>
                      );
                    })}

                    {/* Next Page */}
                    {blogsData.pagination.hasNextPage ? (
                      <Link
                        href={`/page/${blogsData.pagination.currentPage + 1}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                        Next
                      </span>
                    )}
                  </nav>
                </div>
              )}
            </main>

            {/* Right Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Right Sidebar Ad 1 */}
                <AdSpace 
                  id="homepage-right-sidebar-ad-1" 
                  className="min-h-[600px]"
                  {...AdConfigs.sidebarBanner}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <p className="font-medium text-xs">Home Right Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x600</p>
                    <p className="text-xs text-gray-300">Skyscraper</p>
                  </div>
                </AdSpace>

                {/* Newsletter Signup - Compact */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Stay Updated</h3>
                  <p className="text-xs text-gray-600 mb-3">Get latest updates.</p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2">
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Right Sidebar Ad 2 */}
                <AdSpace
                  id="homepage-right-sidebar-ad-2"
                  className="min-h-[300px]"
                  {...AdConfigs.squareAd}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <p className="font-medium text-xs">Square Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x300</p>
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
                    <Link href="/pages/about-us" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/services" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/contact-us" className="text-gray-400 hover:text-white transition-colors flex items-center">
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
                    <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</Link>
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
