import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Home, Share2, Eye, Clock, Bookmark, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import MobileMenu from "@/components/MobileMenu"

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
    
    if (data.error) {
      console.error('API returned error:', data.error)
      return null
    }
    
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
      url: `https://www.pkminfotech.com/${blog.slug}`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20">
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

              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Main navigation">
                <Link href="/" className="font-medium transition-colors flex items-center px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
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
                  <Link href="/about-us" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 py-8 lg:py-12">
            
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2" role="complementary">
              <div className="sticky top-24 space-y-6">
                {/* Sidebar content if needed */}
              </div>
            </aside>

            {/* Main Content - Centered */}
            <main className="lg:col-span-8" role="main">
              <nav className="mb-6 lg:mb-8" aria-label="Breadcrumb">
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
                  <div className="text-gray-900 font-semibold text-base leading-6">
                    {blog.title}
                  </div>
                </div>

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

                {/* Article Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
                  <div className="p-6 lg:p-8">
                    <div className="prose prose-lg max-w-none">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: blog.content
                            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                            .replace(/^\* (.*$)/gm, '<li>$1</li>')
                            .replace(/^- (.*$)/gm, '<li>$1</li>')
                            .replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => {
                              return '<ul>' + match + '</ul>';
                            })
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
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
                {/* Sidebar content if needed */}
              </div>
            </aside>
          </div>
        </div>

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