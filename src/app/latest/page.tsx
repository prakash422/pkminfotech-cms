import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import OptimizedImage from "@/components/OptimizedImage"
import { generateCanonicalUrl } from "@/lib/canonical-utils"
import { prisma } from "@/lib/prisma"
import BreadcrumbNav from "@/components/BreadcrumbNav"

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
      ? `Guides & Updates - Page ${currentPage}`
      : "Guides & Updates"
  const canonical =
    currentPage > 1 ? `${generateCanonicalUrl("/latest")}?page=${currentPage}` : generateCanonicalUrl("/latest")
  return {
    title,
    description:
      currentPage > 1
        ? `Browse helpful guides and updates on page ${currentPage} from pkminfotech.`
        : "Helpful guides and updates from pkminfotech — secondary to our free online tools for land, education, and finance.",
    keywords: "pkminfotech guides, online tools tips, land converter guides, education calculators",
    alternates: { canonical },
    openGraph: {
      title: currentPage > 1 ? `Guides & Updates - Page ${currentPage} | pkminfotech` : "Guides & Updates | pkminfotech",
      description: "Helpful guides alongside free online tools from pkminfotech",
      url: canonical,
      images: [{ url: "/favicon-32x32.png", width: 32, height: 32 }],
    },
    ...(currentPage > 1 && {
      robots: { index: false, follow: true },
    }),
  }
}

async function getLatestBlogsPaginated(page: number) {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:27017")) {
    return {
      blogs: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  try {
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
  } catch (error) {
    console.error("Error in getLatestBlogsPaginated:", error)
    return {
      blogs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
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
    <div className="page-surface tool-page-shell py-1 py-md-3">
      <div className="container guides-hub" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          compact
          items={[
            { label: "Home", href: "/" },
            { label: "Guides" },
          ]}
        />

        <header className="guides-hub-header">
          <h1 className="guides-hub-title">Guides &amp; Updates</h1>
          <p className="guides-hub-desc">
            Tips and how-tos from pkminfotech. Need a calculator?{" "}
            <Link href="/tools" className="guides-hub-inline-link">
              Free online tools
            </Link>
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary mb-3">No guides yet.</p>
            <Link href="/tools" className="guide-read-link">
              Browse tools <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-2 g-md-3">
              {blogs.map((blog: BlogItem) => (
                <div className="col-12 col-md-6 col-lg-4" key={blog.id}>
                  <article className="guide-card h-100">
                    {blog.coverImage ? (
                      <Link href={`/${blog.slug}`} className="guide-card-media">
                        <OptimizedImage
                          src={blog.coverImage}
                          alt={blog.title}
                          width={400}
                          height={225}
                          className="w-100 h-100 object-fit-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </Link>
                    ) : null}
                    <div className="guide-card-body">
                      <div className="guide-card-meta">
                        <span className={`guide-card-badge ${getCategoryBadgeClass(blog.category)}`}>
                          {getCategoryLabel(blog.category)}
                        </span>
                        <span className="guide-card-readtime">
                          <Clock size={11} /> 5 min
                        </span>
                      </div>
                      <h2 className="guide-card-title">
                        <Link href={`/${blog.slug}`}>{blog.title}</Link>
                      </h2>
                      {blog.excerpt ? (
                        <p className="guide-card-excerpt">{blog.excerpt}</p>
                      ) : null}
                      <div className="guide-card-footer">
                        <time
                          dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}
                          className="guide-card-date"
                        >
                          <Calendar size={11} />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </time>
                        <Link href={`/${blog.slug}`} className="guide-read-link">
                          Read <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <nav className="guides-pagination" aria-label="Guides pagination">
                {pagination.hasPrevPage ? (
                  <Link
                    href={pagination.currentPage === 2 ? "/latest" : `/latest?page=${pagination.currentPage - 1}`}
                    className="guides-page-btn"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="guides-page-btn is-disabled">Previous</span>
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
                      className={`guides-page-btn ${isCurrent ? "is-active" : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {pageNum}
                    </Link>
                  )
                })}

                {pagination.hasNextPage ? (
                  <Link href={`/latest?page=${pagination.currentPage + 1}`} className="guides-page-btn">
                    Next
                  </Link>
                ) : (
                  <span className="guides-page-btn is-disabled">Next</span>
                )}
              </nav>
            )}
          </>
        )}
      </div>

      <style>{`
        .guides-hub-header {
          margin-bottom: 0.85rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid #eef2f7;
        }
        .guides-hub-title {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: clamp(1.28rem, 4.2vw, 1.65rem);
          font-weight: 750;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .guides-hub-desc {
          margin: 0;
          max-width: 36rem;
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.45;
        }
        .guides-hub-inline-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
        .guides-hub-inline-link:hover {
          text-decoration: underline;
        }
        .guide-card {
          display: flex;
          flex-direction: column;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
          transition: border-color 0.15s ease;
        }
        .guide-card:hover {
          border-color: #cbd5e1;
        }
        .guide-card-media {
          display: block;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f1f5f9;
        }
        .guide-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 10px 12px 12px;
          min-height: 0;
        }
        .guide-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .guide-card-badge {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 7px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }
        .guide-card-readtime {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
        }
        .guide-card-title {
          margin: 0 0 4px;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.015em;
        }
        .guide-card-title a {
          color: #0f172a;
          text-decoration: none;
        }
        .guide-card-title a:hover {
          color: #2563eb;
        }
        .guide-card-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 8px;
          color: #64748b;
          font-size: 0.78rem;
          line-height: 1.4;
          flex: 1;
        }
        .guide-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
        }
        .guide-card-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 11px;
        }
        .guide-read-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          line-height: 1;
        }
        .guide-read-link:hover {
          color: #1d4ed8;
        }
        .guides-pagination {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .guides-page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 34px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }
        .guides-page-btn.is-active {
          background: #2563eb;
          border-color: #2563eb;
          color: #fff;
        }
        .guides-page-btn.is-disabled {
          color: #94a3b8;
          background: #f8fafc;
          cursor: not-allowed;
        }
        @media (max-width: 575px) {
          .guides-hub-header {
            margin-bottom: 0.7rem;
            padding-bottom: 0.55rem;
          }
          .guides-hub-desc {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  )
}
