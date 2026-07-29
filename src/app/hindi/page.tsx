import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Clock, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import OptimizedImage from '@/components/OptimizedImage'

export const metadata: Metadata = {
  title: 'हिंदी गाइड्स और अपडेट्स',
  description: 'pkminfotech पर हिंदी गाइड्स। लैंड कन्वर्टर, शिक्षा और फाइनेंस टूल्स भी मुफ़्त उपलब्ध हैं।',
  keywords: 'pkminfotech हिंदी गाइड, ऑनलाइन टूल्स, कैलकुलेटर',
  openGraph: {
    title: 'हिंदी गाइड्स और अपडेट्स | pkminfotech',
    description: 'हिंदी गाइड्स के साथ मुफ़्त ऑनलाइन टूल्स',
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
}

async function getHindiBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      return []
    }
    
    const blogs: Blog[] = data
    return blogs
      .filter((blog: Blog) => blog.status === 'published' && blog.category === 'hindi')
      .sort((a: Blog, b: Blog) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
  } catch (error) {
    return []
  }
}

export default async function HindiBlogPage() {
  const blogs = await getHindiBlogs()

  return (
    <div className="page-surface">
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
              <li className="text-orange-600 font-medium" aria-current="page">
                हिंदी Blog
              </li>
            </ol>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              हिंदी गाइड्स
            </h1>
            <p className="text-lg text-gray-600">
              हिंदी गाइड्स और अपडेट्स। कैलकुलेटर चाहिए? हमारे{" "}
              <Link href="/tools" className="text-blue-600 font-semibold hover:underline">
                मुफ़्त ऑनलाइन टूल्स
              </Link>{" "}
              देखें।
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">कोई हिंदी ब्लॉग पोस्ट नहीं मिला।</p>
              <Link href="/">
                <Button className="mt-4">होम पेज पर वापस जाएं</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              {blogs.map((blog) => (
                <article key={blog.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors bg-white">
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
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          हिंदी ब्लॉग
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
                      
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                        <Link href={`/${blog.slug}`} className="hover:text-blue-600 transition-colors">
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
                            पूरा पढ़ें
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