export const revalidate = 60
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Calendar, Search, User, BadgeCheck, BookOpenCheck, ClipboardCheck, TimerReset, Wrench, ArrowRight, Clock3, Smartphone, Calculator, Percent, GraduationCap, HeartPulse, ChevronLeft, ChevronRight, MonitorCheck, Rows3, Trophy, Users, Newspaper, Globe2 } from "lucide-react"
import { formatDate, truncateText } from "@/lib/utils"
import { Metadata } from "next"
import ClientScripts from '@/components/ClientScripts'
import OptimizedImage from '@/components/OptimizedImage'
import { generateCanonicalUrl } from "@/lib/canonical-utils"
import ExploreCoreFeatures from "@/components/ExploreCoreFeatures"
import { toolItems } from "@/data/exam-platform"

// Enable ISR with 60 second revalidation
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const selectedCategory = params.category || 'all'
  
  const pageTitle = currentPage > 1 
    ? `Latest Blogs - Page ${currentPage} | pkminfotech`
    : 'Latest Tech News, Business Updates & Travel Guides | pkminfotech'
  
  const pageDescription = currentPage > 1
    ? `Browse our latest blog posts on page ${currentPage}. Discover tech news, travel guides, and business insights.`
    : 'Your source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.'

  // Generate proper canonical URL that resolves redirects
  const pagePath = currentPage > 1 
    ? `/page/${currentPage}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
    : `${selectedCategory !== 'all' ? `/?category=${selectedCategory}` : '/'}`
  
  const canonicalUrl = generateCanonicalUrl(pagePath)

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: "tech news, business updates, travel guides India, technology news, digital trends, tourist places, daily news, pkminfotech",
    authors: [{ name: "pkminfotech Team" }],
    creator: "pkminfotech",
    publisher: "pkminfotech",
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
      siteName: "pkminfotech",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/favicon.ico",
          width: 32,
          height: 32,
          alt: "pkminfotech Logo"
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

// Server-side data fetching with pagination and caching
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
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
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
    "name": "pkminfotech",
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
      "name": "pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pkminfotech.com/favicon.ico",
        "width": 32,
        "height": 32
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "pkminfotech",
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
        "name": blog.author.name || "pkminfotech Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "pkminfotech"
      },
      "image": blog.coverImage || "/favicon.ico"
    }))
  }
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const params = await searchParams
  const selectedCategory = params.category || 'all'
  if (selectedCategory === 'current-affairs') {
    const { redirect } = await import('next/navigation')
    const page = params.page || '1'
    redirect(page === '1' ? '/daily-current-affairs' : `/daily-current-affairs?page=${page}`)
  }
  const currentPage = parseInt(params.page || '1', 10)
  const blogsData = await getBlogs(selectedCategory === 'all' ? undefined : selectedCategory, currentPage)
  const latestBlogs = blogsData.blogs.slice(0, 4)
  const currentAffairsData = await getBlogs('current-affairs', 1, 4)
  const currentAffairsBlogs = currentAffairsData.blogs
  const toolCards = toolItems.slice(0, 8).map((tool, i) => ({
    title: tool.title,
    href: `/tools/${tool.slug}`,
    text: tool.description,
    icon: Calculator,
    tone: `tool-tone-${(i % 4) + 1}` as const,
  }))

  if (process.env.NEXT_PUBLIC_HOMEPAGE_LAYOUT !== "legacy") {
    return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(blogsData.blogs))
        }}
      />

      <main className="bg-light pb-4 pt-2">
        <div className="container compact-home pt-0">
          <section className="card border-0 shadow-sm figma-space-24 overflow-hidden compact-hero">
            <div className="figma-hero-unified position-relative">
              <div className="figma-hero-content">
                <h1 className="fw-bold text-dark mb-2 compact-title figma-title">
                  India&apos;s Smart Exam Practice &amp;
                  <br className="d-none d-md-block" />
                  Free Online Tools Platform
                </h1>
                <p className="text-secondary mb-3 compact-subtitle">
                  Practice mock tests, daily quizzes &amp; useful calculators - all in one place.
                </p>
                <div className="d-flex flex-wrap gap-2 figma-hero-cta">
                  <Link href="/current-affairs-quiz" className="figma-btn figma-btn-primary">
                    Daily Quiz <ArrowRight size={14} />
                  </Link>
                  <Link href="/tools" className="figma-btn figma-btn-outline">
                    Explore Tools <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="hero-chip"><BadgeCheck size={14} /> 100% Free</span>
                  <span className="hero-chip"><Clock3 size={14} /> Instant Results</span>
                  <span className="hero-chip"><Users size={14} /> Trusted by 10k+ Users</span>
                </div>
              </div>
              <div className="figma-hero-image-floating" aria-hidden="true">
                <Image
                  src="/home/herobanner.jpeg"
                  alt="pkminfotech hero banner"
                  width={860}
                  height={480}
                  priority
                  className="w-100 h-auto"
                  sizes="(max-width: 991px) 100vw, 46vw"
                />
              </div>
            </div>
          </section>

          <ExploreCoreFeatures />

          <section className="figma-space-24">
            <h2 className="text-center fw-bold mb-3 h4 figma-section-title">Popular Free Tools</h2>
            <div className="d-flex align-items-center gap-2 mb-2 tools-nav-line">
              <button className="figma-arrow-btn" aria-label="Previous tools">
                <ChevronLeft size={14} />
              </button>
              <div className="flex-grow-1 border-top border-secondary-subtle" />
              <button className="figma-arrow-btn" aria-label="Next tools">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="row g-3">
              {toolCards.map((tool) => (
                <div key={tool.title} className="col-6 col-lg-3">
                  <div className="card h-100 figma-card tool-card">
                    <div className="card-body p-3 tool-card-body">
                      <div className="d-flex align-items-center mb-2">
                        <div className={`d-inline-flex align-items-center justify-content-center rounded-circle me-2 tool-icon-wrap ${tool.tone}`}>
                          <tool.icon size={14} className="text-primary" />
                        </div>
                        <h3 className="h6 fw-semibold mb-0 tool-card-title">{tool.title}</h3>
                      </div>
                      <p className="small text-secondary mb-2 tool-card-text">{tool.text}</p>
                      <Link href={tool.href} className="figma-btn figma-btn-sm tool-cta-btn">
                        Use Now <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3">
              <Link href="/tools" className="figma-btn figma-btn-outline">
                View All <ArrowRight size={14} className="ms-1" />
              </Link>
            </div>
          </section>

          <section className="figma-space-24">
            <h2 className="text-center fw-bold mb-2 h4 figma-section-title">Current Affairs for Exams</h2>
            <p className="text-secondary small text-center mb-2">Stay updated for SSC, RRB, Banking &amp; govt exams.</p>
            {currentAffairsBlogs.length > 0 && (
              <div className="text-center mb-3">
                <Link href="/daily-current-affairs" className="small fw-semibold text-primary text-decoration-none">
                  View all <ArrowRight size={14} className="d-inline-block ms-1" />
                </Link>
              </div>
            )}
            <div className="row g-3">
              {currentAffairsBlogs.length > 0 ? (
                currentAffairsBlogs.map((blog: BlogPost) => (
                  <article key={blog.id} className="col-6 col-md-3">
                    <div className="card h-100 border figma-card blog-card-compact">
                      <div className="blog-card-compact-img overflow-hidden bg-light">
                        {blog.coverImage ? (
                          <OptimizedImage
                            src={blog.coverImage}
                            alt={blog.title}
                            width={320}
                            height={180}
                            className="w-100 h-100 object-fit-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center text-secondary small" style={{ minHeight: 90 }}>
                            Article
                          </div>
                        )}
                      </div>
                      <div className="card-body p-2 p-sm-3">
                        <h3 className="card-title mb-0 lh-sm" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                          <Link href={`/${blog.slug}`} className="text-decoration-none no-underline !text-gray-600 hover:!text-gray-900 transition-colors" style={{ fontSize: "0.8125rem" }}>
                            {truncateText(blog.title, 42)}
                          </Link>
                        </h3>
                        <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: "0.7rem" }}>
                          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0 small">
                    Current affairs articles will appear here. Add blogs with category &quot;Current Affairs&quot; in admin.
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="figma-space-24">
            <h2 className="text-center fw-bold mb-2 h4 figma-section-title">Latest Articles &amp; Updates</h2>
            <div className="row g-3">
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog: BlogPost) => (
                  <article key={blog.id} className="col-6 col-md-3">
                    <div className="card h-100 border figma-card blog-card-compact">
                      <div className="blog-card-compact-img overflow-hidden bg-light">
                        {blog.coverImage ? (
                          <OptimizedImage
                            src={blog.coverImage}
                            alt={blog.title}
                            width={320}
                            height={180}
                            className="w-100 h-100 object-fit-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center text-secondary small" style={{ minHeight: 90 }}>
                            Article
                          </div>
                        )}
                      </div>
                      <div className="card-body p-2 p-sm-3">
                        <h3 className="card-title mb-0 lh-sm" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                          <Link href={`/${blog.slug}`} className="text-decoration-none no-underline !text-gray-600 hover:!text-gray-900 transition-colors" style={{ fontSize: "0.8125rem" }}>
                            {truncateText(blog.title, 42)}
                          </Link>
                        </h3>
                        <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: "0.7rem" }}>
                          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0">
                    Latest articles will appear here once published.
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-center fw-bold mb-3 h4 figma-section-title">Why Choose Us?</h2>
            <p className="text-center text-secondary small mb-3">
              Built for practical preparation: fast interface, realistic tests, and updated content.
            </p>
            <div className="row g-3">
              <div className="col-sm-6 col-lg-3">
                <div className="card border figma-card h-100 why-card">
                  <div className="card-body text-center p-3">
                    <span className="why-icon-box mb-2">
                      <Clock3 className="text-primary" size={22} />
                    </span>
                    <h3 className="h6 fw-semibold">Trusted Since 2019 - 6+ Years of Consistent Indexing</h3>
                    <p className="small text-secondary mb-0">Long-term indexed presence with stable updates builds stronger exam-prep trust.</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border figma-card h-100 why-card">
                  <div className="card-body text-center p-3">
                    <span className="why-icon-box mb-2">
                      <BadgeCheck className="text-primary" size={22} />
                    </span>
                    <h3 className="h6 fw-semibold">Completely Free Practice - No Login Required</h3>
                    <p className="small text-secondary mb-0">Start instantly without signup friction across practice sets, quizzes, and tools.</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border figma-card h-100 why-card">
                  <div className="card-body text-center p-3">
                    <span className="why-icon-box mb-2">
                      <Smartphone className="text-primary" size={22} />
                    </span>
                    <h3 className="h6 fw-semibold">Fast &amp; Mobile Friendly</h3>
                    <p className="small text-secondary mb-0">Lightweight pages with touch-friendly UI and quick loading.</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border figma-card h-100 why-card">
                  <div className="card-body text-center p-3">
                    <span className="why-icon-box mb-2">
                      <Newspaper className="text-primary" size={22} />
                    </span>
                    <h3 className="h6 fw-semibold">Regular Updates</h3>
                    <p className="small text-secondary mb-0">New sets, mock tests, and tool improvements added regularly.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <style>{`
        .compact-home {
          max-width: 1120px;
        }
        .figma-space-24 {
          margin-bottom: 24px;
        }
        .compact-hero {
          border-radius: 0.9rem;
        }
        .figma-hero-unified {
          background: linear-gradient(145deg, #ffffff 0%, #fafbfd 45%, #f6f8fc 100%);
          min-height: 320px;
          padding: 24px;
        }
        .figma-hero-content {
          position: relative;
          z-index: 2;
          max-width: 54%;
        }
        .figma-hero-image-floating {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: min(46%, 430px);
          z-index: 1;
          filter: none;
        }
        .hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid #dbe7f7;
          color: #1f2937;
          font-size: 12px;
          font-weight: 600;
        }
        .figma-title {
          max-width: 540px;
        }
        .figma-card {
          border-radius: 0.75rem;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%) !important;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
        }
        .figma-card:hover {
          transform: translateY(-4px);
          border-color: #d9e4f5 !important;
          background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%) !important;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1), 0 6px 12px rgba(15, 23, 42, 0.06);
        }
        .figma-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          height: 36px;
          padding: 0 15px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .figma-btn-primary {
          background: linear-gradient(180deg, #2d7ef7 0%, #1a73e8 100%);
          color: #fff;
          border: 1px solid #1a73e8;
          box-shadow: 0 3px 8px rgba(26, 115, 232, 0.2);
        }
        .figma-btn-primary:hover {
          background: linear-gradient(180deg, #2872df 0%, #1669d6 100%);
          border-color: #1669d6;
          color: #fff;
        }
        .figma-btn-outline {
          background: #fff;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .figma-btn-outline:hover {
          border-color: #9ca3af;
          color: #111827;
        }
        .figma-btn-block {
          width: 100%;
        }
        .figma-btn-sm {
          height: 32px;
          font-size: 12px;
          padding: 0 12px;
        }
        .figma-section-title {
          letter-spacing: -0.2px;
          font-size: clamp(1.2rem, 1.5vw, 1.45rem);
        }
        .figma-arrow-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #d5dbe5;
          background: #fff;
          color: #7a8699;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .compact-title {
          font-size: clamp(1.35rem, 2.2vw, 2rem);
          line-height: 1.25;
        }
        .compact-subtitle {
          font-size: 0.95rem;
        }
        .compact-hero-graphic {
          width: 100%;
          max-width: 250px;
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: #ffffff;
          color: #0d6efd;
          border: 1px solid #dbe9ff;
        }
        .feature-tone-1 { background: #e9f2ff; }
        .feature-tone-2 { background: #e8f8ff; }
        .feature-tone-3 { background: #eef7ff; }
        .feature-tone-4 { background: #eaf4ff; }
        .feature-illustration {
          width: 74px;
          height: 52px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dfeafb;
          position: relative;
        }
        .feature-card {
          min-height: 224px;
        }
        .feature-card-body {
          gap: 2px;
          padding: 14px !important;
        }
        .feature-card .card-title {
          margin-bottom: 6px !important;
          font-size: 1.02rem;
        }
        .feature-description {
          min-height: 44px;
          font-size: 0.84rem !important;
          line-height: 1.35;
          margin-bottom: 8px !important;
        }
        .feature-card .figma-btn {
          height: 33px;
          font-size: 12px;
          padding: 0 11px;
          border-radius: 9px;
        }
        .tool-card {
          min-height: 170px;
          overflow: hidden;
        }
        .tool-card .card-body {
          display: flex;
          flex-direction: column;
        }
        .tool-card-body {
          gap: 2px;
        }
        .tool-card .figma-btn {
          align-self: flex-start;
          margin-top: auto;
        }
        .blog-card-compact {
          min-height: auto;
        }
        .blog-card-compact-img {
          height: 90px;
          display: block;
        }
        .blog-card-compact-img img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .tool-icon-wrap {
          width: 38px;
          height: 38px;
          border: 1px solid #dce7f7;
          flex-shrink: 0;
        }
        .tool-icon-wrap svg {
          width: 17px;
          height: 17px;
        }
        .tool-card-title {
          line-height: 1.2;
          color: #1f2937;
        }
        .tool-card-text {
          line-height: 1.35;
          min-height: 36px;
        }
        .tool-cta-btn {
          background: #2563eb;
          color: #fff;
          border: none;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
          padding: 0 0.65rem;
          height: 28px;
          line-height: 1;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          width: fit-content;
        }
        .tool-cta-btn:hover {
          background: #1d4ed8;
          color: #fff;
          transform: translateY(-1px);
        }
        .why-card {
          min-height: 148px;
        }
        .feature-cloud {
          position: absolute;
          left: 8px;
          top: 7px;
          width: 18px;
          height: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.75);
        }
        .why-icon-box {
          width: 48px;
          height: 40px;
          border-radius: 12px;
          background: #eaf3ff;
          border: 1px solid #dbe8fb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .tool-tone-1 { background: #ebf4ff; }
        .tool-tone-2 { background: #eef7ff; }
        .tool-tone-3 { background: #e8f8ff; }
        .tool-tone-4 { background: #eaf5ff; }
        @media (max-width: 767px) {
          .figma-space-24 {
            margin-bottom: 20px;
          }
          .feature-card,
          .tool-card,
          .why-card,
          .feature-description {
            min-height: unset;
          }
          .figma-section-title {
            font-size: 1.15rem;
            line-height: 1.25;
            margin-bottom: 12px !important;
          }
          .figma-hero-unified {
            min-height: auto;
            padding: 16px;
          }
          .figma-hero-content {
            max-width: 100%;
          }
          .figma-hero-image-floating {
            position: relative;
            width: 100%;
            right: auto;
            top: auto;
            transform: none;
            margin-top: 14px;
            filter: none;
          }
          .figma-hero-cta .figma-btn {
            flex: 1 1 calc(50% - 4px);
            min-width: 0;
            padding: 0 10px;
            font-size: 12px;
            height: 32px;
          }
          .hero-chip {
            height: 28px;
            font-size: 11px;
          }
          .feature-card .card-body,
          .tool-card .card-body,
          .why-card .card-body {
            padding: 12px !important;
          }
          .feature-card-body {
            padding: 12px !important;
          }
          .feature-illustration {
            width: 58px;
            height: 40px;
            border-radius: 10px;
            margin-bottom: 8px !important;
          }
          .feature-illustration svg {
            width: 18px;
            height: 18px;
          }
          .feature-description {
            font-size: 12px !important;
            line-height: 1.35;
            margin-bottom: 8px !important;
          }
          .feature-card .h6,
          .tool-card .h6,
          .why-card .h6 {
            font-size: 1.02rem;
            margin-bottom: 6px !important;
          }
          .feature-card .figma-btn {
            height: 30px;
            font-size: 12px;
          }
          .tool-card .figma-btn {
            height: 24px;
            font-size: 0.75rem;
            padding: 0 0.5rem;
            width: fit-content;
          }
          .feature-card .figma-btn svg,
          .tool-card .figma-btn svg {
            width: 11px;
            height: 11px;
          }
          .tools-nav-line {
            display: none !important;
          }
          .tool-card {
            min-height: 154px;
          }
          .tool-card .card-body {
            padding: 11px !important;
          }
          .tool-card .h6 {
            font-size: 0.9rem;
            line-height: 1.2;
          }
          .tool-card p {
            font-size: 11px !important;
            line-height: 1.3;
            margin-bottom: 8px !important;
          }
          .tool-icon-wrap {
            width: 34px;
            height: 34px;
          }
          .tool-icon-wrap svg {
            width: 15px;
            height: 15px;
          }
          .tool-card .figma-btn {
            height: 24px;
            font-size: 0.75rem;
            padding: 0 0.5rem;
            width: fit-content;
          }
          .row.g-3 {
            --bs-gutter-y: 0.75rem;
          }
          .figma-card:hover {
            transform: none;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.03);
          }
        }
      `}</style>
    </>
    )
  }
  
  return (
    <>
      <ClientScripts />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(blogsData.blogs))
        }}
      />

      <div className="auto-ads-space min-h-screen bg-gray-50">
        {/* Main Content Area Only - No static ad asides, let AdSense Auto Ads handle placement */}
        <div className="w-full px-0">
          <div className="py-2 lg:py-3">
            {/* Main Content - Narrower Container for Auto Ads on Sides */}
            <main role="main" className="max-w-5xl mx-auto">
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
                  {blogsData.blogs.map((blog: BlogPost, index: number) => (
                    <article key={blog.id} className="group" itemScope itemType="http://schema.org/BlogPosting">
                      <Card className="h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden">
                        {blog.coverImage && (
                          <div className="aspect-[16/10] w-full overflow-hidden">
                            <OptimizedImage
                              src={blog.coverImage}
                              alt={blog.title}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={index < 3}
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
                                <span itemProp="name">pkminfotech Team</span>
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

      </div>
    </>
  )
}
