import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Calendar, Home, Search, User } from "lucide-react"
import { formatDate, truncateText } from "@/lib/utils"
import MobileMenu from "@/components/MobileMenu"
import { Metadata } from "next"
import { Suspense } from 'react'
import ClientScripts from '@/components/ClientScripts'
import { db } from '@/lib/db'

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
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
    "url": "https://www.pkminfotech.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.pkminfotech.com/favicon.ico",
      "width": 32,
      "height": 32
    },
    "author": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pkminfotech.com/favicon.ico",
        "width": 32,
        "height": 32
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pkminfotech.com/favicon.ico"
      }
    },
    "blogPost": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt || blog.title,
      "url": `https://www.pkminfotech.com/${blog.slug}`,
      "datePublished": blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      "dateModified": blog.updatedAt.toISOString(),
      "author": {
        "@type": "Person",
        "name": blog.author.name || "Pkminfotech Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Pkminfotech"
      },
      "image": blog.coverImage || "/favicon.ico"
    }))
  }
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const selectedCategory = params.category || 'all'
  
  const blogsData = await getBlogs(selectedCategory === 'all' ? undefined : selectedCategory, currentPage)
  
  return (
    <>
      <ClientScripts />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(blogsData.blogs))
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3" aria-label="Pkminfotech Home">
                  <Image
                    src="/favicon-32x32.png"
                    alt="Pkminfotech Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Pkminfotech</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Latest Tech & Travel News</p>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
                <Link href="/" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
                <Link href="/latest" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">Latest Blog</Link>
                <Link href="/english" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">English Blog</Link>
                <Link href="/hindi" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">हिंदी Blog</Link>
                <Link href="/about-us" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">About</Link>
                <Link href="/contact-us">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Contact</Button>
                </Link>
              </nav>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 lg:py-12">
            {/* Main Content - Full Width */}
            <main role="main">
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

            {/* Bottom Section */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-gray-500 text-sm">
                    &copy; 2024 Pkminfotech. All rights reserved.
                  </p>
                  <div className="flex space-x-6 text-sm">
                    <Link href="/pages/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/pages/disclaimers" className="text-gray-500 hover:text-white transition-colors">Disclaimers</Link>
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
