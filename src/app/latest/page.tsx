import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import OptimizedImage from "@/components/OptimizedImage"
import { generateCanonicalUrl } from "@/lib/canonical-utils"
import { prisma } from "@/lib/prisma"

const BLOGS_PER_PAGE = 12

type BlogItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  category: string
  publishedAt: Date | null
  createdAt: Date
  author: { id: string; name: string | null }
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))
  const title =
    currentPage > 1
      ? `Latest Blog Posts - Page ${currentPage} | Pkminfotech`
      : "Latest Blog Posts | Pkminfotech - Tech News & Updates"
  const canonical =
    currentPage > 1 ? `${generateCanonicalUrl("/latest")}?page=${currentPage}` : generateCanonicalUrl("/latest")
  return {
    title,
    description:
      currentPage > 1
        ? `Browse our latest blog posts on page ${currentPage}. Tech news, business insights, and digital trends.`
        : "Read our latest articles about technology, business insights, and digital trends on Pkminfotech.",
    keywords: "latest tech blog, technology articles, business updates, digital insights",
    alternates: { canonical },
    openGraph: {
      title: currentPage > 1 ? `Latest Blog Posts - Page ${currentPage} | Pkminfotech` : "Latest Blog Posts | Pkminfotech",
      description: "Latest articles about technology and business",
      url: canonical,
      images: [{ url: "/favicon-32x32.png", width: 32, height: 32 }],
    },
    ...(currentPage > 1 && {
      robots: { index: false, follow: true },
    }),
  }
}

async function getLatestBlogsPaginated(page: number) {
  const skip = (page - 1) * BLOGS_PER_PAGE
  const where = { status: "published" as const }
  const [blogs, totalCount] = await Promise.all([
    prisma.blog.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: BLOGS_PER_PAGE,
    }),
    prisma.blog.count({ where }),
  ])
  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE)
  return {
    blogs,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

function getCategoryLabel(category: string) {
  if (category === "hindi") return "हिंदी"
  if (category === "english") return "English"
  return "Latest"
}

function getCategoryBadgeClass(category: string) {
  if (category === "hindi") return "bg-orange-100 text-orange-800 border-orange-200"
  if (category === "english") return "bg-green-100 text-green-800 border-green-200"
  return "bg-blue-100 text-blue-800 border-blue-200"
}

export default async function LatestBlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))
  const { blogs, pagination } = await getLatestBlogsPaginated(currentPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
              Read our latest articles about technology, business insights, and digital trends.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
              <Link href="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog: BlogItem) => (
                  <article
                    key={blog.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {blog.coverImage && (
                      <div className="aspect-[16/9] w-full overflow-hidden shrink-0">
                        <Link href={`/${blog.slug}`}>
                          <OptimizedImage
                            src={blog.coverImage}
                            alt={blog.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </Link>
                      </div>
                    )}
                    <div className="p-3 flex flex-col flex-1 min-h-0">
                      <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${getCategoryBadgeClass(blog.category)}`}
                        >
                          {getCategoryLabel(blog.category)}
                        </span>
                        <span className="flex items-center text-gray-500 text-[11px]">
                          <Clock className="h-3 w-3 mr-0.5" />
                          5 min read
                        </span>
                      </div>

                      <h2 className="mb-1.5 line-clamp-2 leading-tight" style={{ fontSize: "0.9125rem", fontWeight: 600 }}>
                        <Link
                          href={`/${blog.slug}`}
                          className="no-underline transition-colors !text-gray-600 hover:!text-gray-900"
                          style={{ fontSize: "0.9125rem" }}
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      {blog.excerpt && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2 flex-1 leading-snug">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <time
                          dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}
                          className="flex items-center text-gray-500 text-[11px]"
                        >
                          <Calendar className="h-3 w-3 mr-0.5" />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </time>
                        <Link href={`/${blog.slug}`}>
                          <Button variant="outline" size="sm" className="text-[11px] h-7 px-2">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav
                  className="mt-12 flex justify-center items-center gap-2 flex-wrap"
                  aria-label="Blog pagination"
                >
                  {pagination.hasPrevPage ? (
                    <Link
                      href={pagination.currentPage === 2 ? "/latest" : `/latest?page=${pagination.currentPage - 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                      Previous
                    </span>
                  )}

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const startPage = Math.max(1, pagination.currentPage - 2)
                    const pageNum = startPage + i
                    if (pageNum > pagination.totalPages) return null
                    const isCurrent = pageNum === pagination.currentPage
                    return (
                      <Link
                        key={pageNum}
                        href={pageNum === 1 ? "/latest" : `/latest?page=${pageNum}`}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isCurrent
                            ? "bg-blue-600 text-white border border-blue-600"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {pageNum}
                      </Link>
                    )
                  })}

                  {pagination.hasNextPage ? (
                    <Link
                      href={`/latest?page=${pagination.currentPage + 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                      Next
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
