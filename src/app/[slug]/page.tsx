import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Home, Share2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import MobileMenu from "@/components/MobileMenu"

interface BlogPageProps {
  params: {
    slug: string
  }
}

async function getBlogBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const blogs = await response.json()
      return blogs.find((blog: any) => blog.slug === slug && blog.status === 'published')
    }
  } catch (error) {
    console.error('Failed to fetch blog:', error)
  }
  return null
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${blog.title} | Pkminfotech`,
    description: blog.excerpt || `Read ${blog.title} on Pkminfotech`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on Pkminfotech`,
      url: `https://pkminfotech.com/${blog.slug}`,
      images: blog.coverImage ? [blog.coverImage] : [],
      type: 'article',
      publishedTime: blog.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on Pkminfotech`,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  return (
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
              <Link href="/" className="text-blue-600 font-medium flex items-center">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8" role="main">
        {/* Breadcrumb */}
        <nav className="mb-6 lg:mb-8" aria-label="Breadcrumb">
          <Link href="/">
            <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 text-sm lg:text-base py-2 lg:py-2.5">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </nav>

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight" itemProp="headline">
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
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm lg:text-base" itemProp="name">Pkminfotech Team</p>
                    <p className="text-xs lg:text-sm text-gray-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-gray-400" />
                  <time dateTime={blog.publishedAt || blog.createdAt} className="text-sm lg:text-base" itemProp="datePublished">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </time>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center self-start sm:self-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 xl:p-12 mb-8 lg:mb-12">
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg prose-gray max-w-none text-gray-800
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight prose-headings:mb-4 prose-headings:mt-8 first:prose-headings:mt-0
                prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-4 lg:prose-p:mb-6 prose-p:text-sm sm:prose-p:text-base
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-800 prose-em:italic
                prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 lg:prose-pre:p-6 prose-pre:text-sm prose-pre:overflow-x-auto
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-800 prose-blockquote:p-4 lg:prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:my-6 lg:prose-blockquote:my-8 prose-blockquote:font-medium
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 lg:prose-img:my-8 prose-img:w-full prose-img:max-w-full prose-img:h-auto
                prose-ul:my-4 lg:prose-ul:my-6 prose-ol:my-4 lg:prose-ol:my-6 prose-ul:text-gray-800 prose-ol:text-gray-800
                prose-li:my-1 lg:prose-li:my-2 prose-li:text-gray-800
                prose-table:border-collapse prose-table:w-full prose-table:overflow-x-auto prose-table:text-sm lg:prose-table:text-base
                prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 lg:prose-th:p-3 prose-th:text-gray-900 prose-th:font-semibold prose-th:text-left
                prose-td:border prose-td:border-gray-300 prose-td:p-2 lg:prose-td:p-3 prose-td:text-gray-800
                prose-hr:border-gray-300 prose-hr:my-6 lg:prose-hr:my-8
                [&>*]:text-gray-800 [&_p]:text-gray-800 [&_li]:text-gray-800 [&_span]:text-gray-800 [&_div]:text-gray-800
                [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h6]:text-gray-900
                [&_.ProseMirror]:text-gray-800 [&_.ProseMirror_p]:text-gray-800"
              style={{ color: '#1f2937' }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
              itemProp="articleBody"
            />
          </div>


        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm lg:text-lg">P</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold">Pkminfotech</h3>
              </div>
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
                <a href="#" className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="GitHub">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
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
                  <a href="#about" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full mr-2"></span>
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
          <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <p className="text-gray-500 text-xs lg:text-sm text-center sm:text-left">
                  &copy; 2024 Pkminfotech. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start space-x-3 lg:space-x-6 text-xs lg:text-sm">
                  <a href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                  <a href="/cookies" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
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
  )
} 