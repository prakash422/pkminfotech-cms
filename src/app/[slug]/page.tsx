import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Home, Share2, Eye, Clock, Bookmark, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import MobileMenu from "@/components/MobileMenu"
import AdSpace, { AdConfigs } from "@/components/AdSpace"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  category: string
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  author: {
    id: string
    name: string | null
    email: string | null
  }
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs`)
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    
    // Check if the response is an error object
    if (data.error) {
      console.error('API returned error:', data.error)
      return null
    }
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('API did not return an array:', data)
      return null
    }
    
    const blogs: Blog[] = data
    return blogs.find((blog: Blog) => blog.slug === slug && blog.status === 'published') || null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

// Enhanced SEO metadata
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Pkminfotech',
      description: 'The requested blog post could not be found.',
    }
  }

  const publishedTime = blog.publishedAt || blog.createdAt
  const modifiedTime = blog.updatedAt || blog.createdAt

  return {
    title: `${blog.title} | Pkminfotech - Latest Tech News & Updates`,
    description: blog.excerpt || `Read ${blog.title} on Pkminfotech. Latest tech news, business updates, and digital insights.`,
    keywords: `tech news, ${blog.category}, business updates, technology, digital trends, India`,
    authors: [{ name: 'Pkminfotech Team' }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on Pkminfotech`,
      url: `https://pkminfotech.com/${blog.slug}`,
      siteName: 'Pkminfotech',
      images: blog.coverImage ? [{
        url: blog.coverImage,
        width: 1200,
        height: 630,
        alt: blog.title,
      }] : [],
      type: 'article',
      publishedTime,
      modifiedTime,
      section: blog.category,
      authors: ['Pkminfotech Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on Pkminfotech`,
      images: blog.coverImage ? [blog.coverImage] : [],
      creator: '@pkminfotech',
    },
    alternates: {
      canonical: `https://pkminfotech.com/${blog.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.title,
    "image": blog.coverImage || "/default-blog-image.jpg",
    "author": {
      "@type": "Person",
      "name": "Pkminfotech Team",
      "url": "https://pkminfotech.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pkminfotech.com/favicon-32x32.png",
        "width": 32,
        "height": 32
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "url": `https://pkminfotech.com/${blog.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pkminfotech.com/${blog.slug}`
    },
    "articleSection": blog.category,
    "wordCount": blog.content.replace(/<[^>]*>/g, '').split(' ').length,
    "inLanguage": "en-US"
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'hindi': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'english': return 'bg-green-100 text-green-800 border-green-200'
      case 'latest': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hindi': return 'हिंदी ब्लॉग'
      case 'english': return 'English Blog'
      case 'latest': return 'Latest Blog'
      default: return category
    }
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
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
                <Link href="/" className="text-blue-600 font-medium flex items-center">
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Home
                </Link>
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

        {/* Header Ad Space - Only shown on desktop to avoid mobile irritation */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AdSpace 
              id="header-ad" 
              className="min-h-[120px]" 
              {...AdConfigs.headerBanner}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 py-8 lg:py-12">
            
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Left Sidebar Ad 1 */}
                <AdSpace 
                  id="left-sidebar-ad-1" 
                  className="min-h-[600px]"
                  {...AdConfigs.sidebarBanner}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg">📰</span>
                    </div>
                    <p className="font-medium text-xs">Left Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x600</p>
                    <p className="text-xs text-gray-300">Skyscraper</p>
                  </div>
                </AdSpace>

                {/* Left Sidebar Ad 2 */}
                <AdSpace id="left-sidebar-ad-2" className="min-h-[300px]">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm">💡</span>
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
                  id="blog-mobile-ad"
                  className="min-h-[250px]"
                  {...AdConfigs.contentAd}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="font-medium text-gray-600">Mobile Ad</p>
                    <p className="text-xs text-gray-400 mt-1">320x250 Mobile Banner</p>
                  </div>
                </AdSpace>
              </div>

              {/* Breadcrumb - Mobile Optimized */}
              <nav className="mb-6 lg:mb-8" aria-label="Breadcrumb">
                {/* Mobile: Stacked layout */}
                <div className="sm:hidden">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
                      Home
                    </Link>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(blog.category)}`}>
                      {getCategoryLabel(blog.category)}
                    </span>
                  </div>
                  <div 
                    className="text-gray-900 font-semibold text-base leading-6"
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                      display: 'block',
                      overflow: 'visible',
                      textOverflow: 'clip'
                    }}
                  >
                    {blog.title}
                  </div>
                </div>

                {/* Desktop: Horizontal layout */}
                <ol className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                  <li>
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                      Home
                    </Link>
                  </li>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <li>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(blog.category)}`}>
                      {getCategoryLabel(blog.category)}
                    </span>
                  </li>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <li className="text-gray-900 truncate max-w-md lg:max-w-lg" aria-current="page">
                    {blog.title}
                  </li>
                </ol>
              </nav>

              <Link href="/">
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 text-sm lg:text-base py-2 lg:py-2.5 mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>

              <article itemScope itemType="http://schema.org/BlogPosting">
                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg lg:rounded-xl mb-6 lg:mb-8 shadow-md lg:shadow-lg">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      itemProp="image"
                      loading="eager"
                    />
                  </div>
                )}

                {/* Article Header */}
                <header className="mb-8 lg:mb-12">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryBadgeColor(blog.category)}`}>
                      {getCategoryLabel(blog.category)}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>2.1k views</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight" itemProp="headline">
                    {blog.title}
                  </h1>

                  {blog.excerpt && (
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 lg:mb-8 leading-relaxed" itemProp="description">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 lg:py-6 border-t border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 space-y-3 sm:space-y-0 sm:space-x-6">
                      <div className="flex items-center" itemProp="author" itemScope itemType="http://schema.org/Person">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm lg:text-base" itemProp="name">Pkminfotech Team</p>
                          <p className="text-xs lg:text-sm text-gray-500">Published Author</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-gray-400" />
                        <time dateTime={blog.publishedAt || blog.createdAt} className="text-sm lg:text-base" itemProp="datePublished">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </time>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </header>

                {/* In-Content Ad - After intro, before main content */}
                <div className="my-8 lg:my-12">
                  <AdSpace id="content-top-ad" className="min-h-[250px]" />
                </div>

                {/* Article Content */}
                <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-none overflow-x-auto">
                      <div
                        className="article-content"
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.7',
                          color: '#374151',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                      >
                        <style dangerouslySetInnerHTML={{
                          __html: `
                            .article-content {
                              word-wrap: break-word;
                              overflow-wrap: break-word;
                              max-width: 100%;
                            }
                            
                            .article-content h1 {
                              font-size: 24px !important;
                              font-weight: 700 !important;
                              color: #1f2937 !important;
                              margin: 24px 0 16px 0 !important;
                              line-height: 1.2 !important;
                              border-bottom: 3px solid #3b82f6 !important;
                              padding-bottom: 8px !important;
                            }
                            
                            .article-content h2 {
                              font-size: 20px !important;
                              font-weight: 700 !important;
                              color: #1f2937 !important;
                              margin: 24px 0 12px 0 !important;
                              line-height: 1.3 !important;
                            }
                            
                            .article-content h3 {
                              font-size: 18px !important;
                              font-weight: 700 !important;
                              color: #1f2937 !important;
                              margin: 20px 0 12px 0 !important;
                              line-height: 1.3 !important;
                            }
                            
                            .article-content p {
                              margin: 12px 0 !important;
                              color: #374151 !important;
                              line-height: 1.6 !important;
                              text-align: left !important;
                              font-size: 16px !important;
                            }
                            
                            .article-content p:first-of-type {
                              font-size: 16px !important;
                              font-weight: 400 !important;
                              margin-bottom: 16px !important;
                            }
                            
                            .article-content p:first-of-type::first-letter {
                              float: left;
                              font-size: 40px;
                              line-height: 32px;
                              padding-right: 6px;
                              padding-top: 2px;
                              font-weight: 700;
                              color: #3b82f6;
                            }
                            
                            .article-content ul {
                              margin: 12px 0 !important;
                              padding-left: 20px !important;
                              list-style-type: disc !important;
                            }
                            
                            .article-content ul li {
                              margin: 6px 0 !important;
                              color: #374151 !important;
                              line-height: 1.5 !important;
                              font-size: 16px !important;
                            }
                            
                            .article-content strong {
                              font-weight: 600 !important;
                              color: #1f2937 !important;
                            }
                            
                            .article-content em {
                              font-style: italic !important;
                              color: #4b5563 !important;
                            }

                            /* Mobile specific styles */
                            @media (min-width: 768px) {
                              .article-content h1 {
                                font-size: 32px !important;
                                margin: 40px 0 24px 0 !important;
                              }
                              
                              .article-content h2 {
                                font-size: 28px !important;
                                margin: 40px 0 20px 0 !important;
                              }
                              
                              .article-content h3 {
                                font-size: 24px !important;
                                margin: 32px 0 16px 0 !important;
                              }
                              
                              .article-content p {
                                margin: 16px 0 !important;
                                text-align: justify !important;
                              }
                              
                              .article-content p:first-of-type {
                                font-size: 18px !important;
                                margin-bottom: 24px !important;
                              }
                              
                              .article-content p:first-of-type::first-letter {
                                font-size: 56px;
                                line-height: 48px;
                                padding-right: 8px;
                                padding-top: 4px;
                              }
                              
                              .article-content ul {
                                margin: 16px 0 !important;
                                padding-left: 24px !important;
                              }
                              
                              .article-content ul li {
                                margin: 8px 0 !important;
                                line-height: 1.6 !important;
                              }
                            }
                          `
                        }} />
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: blog.content
                              // First, convert markdown-style headings to HTML
                              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                              
                              // Convert bullet points to list items first
                              .replace(/^\* (.*$)/gm, '<li>$1</li>')
                              .replace(/^- (.*$)/gm, '<li>$1</li>')
                              
                              // Wrap consecutive list items in ul tags
                              .replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => {
                                return '<ul>' + match + '</ul>';
                              })
                              
                              // Convert bold and italic text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              
                              // Convert double line breaks to paragraph breaks
                              .split('\n\n')
                              .map(paragraph => {
                                if (paragraph.trim() && !paragraph.startsWith('<h') && !paragraph.startsWith('<ul')) {
                                  return `<p>${paragraph.trim()}</p>`;
                                }
                                return paragraph;
                              })
                              .join('\n')
                          }} 
                          itemProp="articleBody" 
                        />
                      </div>
                    </div>
                  </div>
                </article>

                {/* Bottom Content Ad */}
                <div className="my-8 lg:my-12">
                  <AdSpace id="content-bottom-ad" className="min-h-[300px]" />
                </div>

                {/* Article Footer */}
                <footer className="border-t border-gray-200 pt-6 lg:pt-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <span className="text-sm font-medium text-gray-600">Share this article:</span>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-2">
                          <Share2 className="h-3 w-3 mr-1" />
                          Facebook
                        </Button>
                        <Button size="sm" variant="outline" className="text-sky-600 border-sky-200 hover:bg-sky-50 text-xs px-3 py-2">
                          <Share2 className="h-3 w-3 mr-1" />
                          Twitter
                        </Button>
                        <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs px-3 py-2">
                          <Share2 className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 order-first lg:order-last">
                      Last updated: {formatDate(blog.updatedAt || blog.createdAt)}
                    </div>
                  </div>
                </footer>
              </article>
            </main>

            {/* Right Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Right Sidebar Ad */}
                <AdSpace 
                  id="right-sidebar-ad-1" 
                  className="min-h-[600px]"
                  {...AdConfigs.sidebarBanner}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <p className="font-medium text-xs">Right Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x600</p>
                    <p className="text-xs text-gray-300">Skyscraper</p>
                  </div>
                </AdSpace>

                {/* Related Articles - Compact */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Related</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col space-y-2">
                        <div className="w-full h-12 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                            Sample Related Article Title {i}
                          </h4>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar Ad 2 */}
                <AdSpace id="right-sidebar-ad-2" className="min-h-[300px]">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <p className="font-medium text-xs">Square Ad</p>
                    <p className="text-xs text-gray-300 mt-1">160x300</p>
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
              </div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16" role="contentinfo">
          {/* Footer Ad - Before footer content */}
          <div className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSpace id="footer-ad" className="min-h-[200px] bg-white">
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Company Info */}
              <div className="sm:col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center mb-4 lg:mb-6 group" aria-label="Pkminfotech Homepage">
                  <Image
                    src="/favicon-32x32.png"
                    alt="Pkminfotech Logo"
                    width={40}
                    height={40}
                    className="mr-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">Pkminfotech</h3>
                </Link>
                <p className="text-sm lg:text-base text-gray-400 mb-4 lg:mb-6 max-w-md leading-relaxed">
                  Pkminfotech is a dynamic blogging platform providing the latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.
                </p>
                <div className="flex space-x-3 lg:space-x-4">
                  <a href="#" className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="mailto:prakashkr806@gmail.com" className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Email">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Quick Links</h4>
                <ul className="grid grid-cols-2 gap-y-3 lg:gap-y-4 gap-x-2">
                  <li>
                    <Link href="/" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/about-us" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/services" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/contact-us" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
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
            <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                  <p className="text-gray-500 text-xs lg:text-sm text-center sm:text-left">
                    &copy; 2024 Pkminfotech. All rights reserved.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start space-x-3 lg:space-x-6 text-xs lg:text-sm">
                    <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</Link>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-gray-500 text-xs lg:text-sm text-center">
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