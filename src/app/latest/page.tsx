import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ChevronRight, Clock, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import OptimizedImage from '@/components/OptimizedImage'
import { generateCanonicalUrl } from "@/lib/canonical-utils"

export const metadata: Metadata = {
  title: 'Latest Blog Posts | Pkminfotech - Tech News & Updates',
  description: 'Read Latest blog posts about technology, business, and digital trends on Pkminfotech.',
  keywords: 'latest tech blog, technology articles, business updates, digital insights',
  alternates: {
    canonical: generateCanonicalUrl('/latest'),
  },
  openGraph: {
    title: 'Latest Blog Posts | Pkminfotech',
    description: 'Latest articles about technology and business',
    url: generateCanonicalUrl('/latest'),
    images: [{ url: '/favicon-32x32.png', width: 32, height: 32 }],
  },
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

async function getLatestBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText)
      return []
    }
    
    const data = await response.json()
    
    if (data.error) {
      console.error('API returned error:', data.error)
      return []
    }
    
    if (!Array.isArray(data)) {
      console.error('API did not return an array:', data)
      return []
    }
    
    const blogs: Blog[] = data
    return blogs
      .filter((blog: Blog) => blog.status === 'published' && blog.category === 'latest')
      .sort((a: Blog, b: Blog) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function LatestBlogPage() {
  const blogs = await getLatestBlogs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Main Content - Narrower Container for Auto Ads on Sides */}
        <main className="max-w-5xl mx-auto" role="main">
          <nav className="mb-6 lg:mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-blue-600 font-medium" aria-current="page">
                Latest Blog
              </li>
            </ol>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest Blog Posts
            </h1>
            <p className="text-lg text-gray-600">
              Read our Latest articles about technology, business insights, and digital trends.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No Latest blog posts found.</p>
              <Link href="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              {blogs.map((blog) => (
                <article key={blog.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    {blog.coverImage && (
                      <div className="md:w-1/3">
                        <OptimizedImage
              src={blog.coverImage}
              alt={blog.title}
              width={300}
              height={192}
              className="w-full h-48 md:h-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
                      </div>
                    )}
                    <div className={`p-6 ${blog.coverImage ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Latest Blog
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
                      
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        <Link href={`/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>
                      
                      {blog.excerpt && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <time dateTime={blog.publishedAt || blog.createdAt}>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </time>
                        </div>
                        <Link href={`/${blog.slug}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 