import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, Wrench } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import OptimizedImage from "@/components/OptimizedImage"
import { prisma } from "@/lib/prisma"
import { generateCanonicalUrl } from "@/lib/canonical-utils"
import { getBridgeToolsForBlog } from "@/data/tools-data"
import { formatBlogContent } from "@/lib/blog-content"
import ContentAdBand from "@/components/ContentAdBand"
import SideRailAds from "@/components/SideRailAds"
import BreadcrumbNav from "@/components/BreadcrumbNav"

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
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:27017")) {
    return null
  }

  try {
    // Validate slug format
    if (!slug || typeof slug !== 'string' || slug.length > 200) {
      console.log(`❌ Invalid slug format: ${slug}`)
      return null
    }

    // Clean the slug (remove any special characters, decode if needed)
    const cleanSlug = decodeURIComponent(slug).replace(/[^\w-]/g, '').toLowerCase()
    
    console.log(`🔍 Searching for blog: ${slug} (cleaned: ${cleanSlug})`)

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { slug: slug },
          { slug: cleanSlug },
          { slug: { contains: cleanSlug } }
        ],
        status: 'published'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!blog) {
      console.log(`❌ Blog not found for slug: ${slug}`)
      return null
    }

    console.log(`✅ Blog found: ${blog.title}`)
    // Convert Date fields to string to match Blog interface
    return {
      ...blog,
      publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === "current-affairs") redirect("/daily-current-affairs")
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Guide Not Found',
      description: 'The requested guide could not be found. Try our free online tools instead.',
    }
  }

  const publishedTime = blog.publishedAt || blog.createdAt
  const modifiedTime = blog.updatedAt || blog.createdAt

  // Generate proper canonical URL that resolves redirects
  const canonicalUrl = generateCanonicalUrl(`/${blog.slug}`)

  return {
    title: blog.title,
    description: blog.excerpt || `Read ${blog.title} on pkminfotech — free online tools and helpful guides.`,
    keywords: `${blog.category}, pkminfotech guides, online tools India`,
    authors: [{ name: 'pkminfotech Team' }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on pkminfotech`,
      url: canonicalUrl,
      siteName: 'pkminfotech',
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
      authors: ['pkminfotech Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} on pkminfotech`,
      images: blog.coverImage ? [blog.coverImage] : [],
      creator: '@pkminfotech',
    },
    alternates: {
      canonical: canonicalUrl,
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
  if (slug === "current-affairs") redirect("/daily-current-affairs")
  const blog = await getBlogBySlug(slug)

  // Log 404 errors for monitoring
  if (!blog) {
    try {
      await fetch('/api/404-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          userAgent: 'server-side',
          referer: 'direct',
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to log 404:', error)
    }
    
    notFound()
  }

  const getAbsoluteImageUrl = (url: string | null) => {
    const baseUrl = 'https://www.pkminfotech.com'
    if (!url) return `${baseUrl}/android-chrome-512x512.png`
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }

  // Generate proper canonical URL that resolves redirects for structured data
  const structuredDataCanonicalUrl = generateCanonicalUrl(`/${blog.slug}`)

  // Soft bridge: old blog posts pass internal authority to tools
  const recommendedTools = getBridgeToolsForBlog(
    blog.title,
    `${blog.excerpt || ""} ${blog.content}`,
    blog.category,
    2
  )

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.title,
    "image": getAbsoluteImageUrl(blog.coverImage),
    "author": {
      "@type": "Person",
      "name": "pkminfotech Team",
      "url": generateCanonicalUrl('/')
    },
    "publisher": {
      "@type": "Organization",
      "name": "pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": generateCanonicalUrl('/android-chrome-192x192.png'),
        "width": 192,
        "height": 192
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "url": structuredDataCanonicalUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": structuredDataCanonicalUrl
    },
    "articleSection": blog.category,
    "wordCount": blog.content.replace(/<[^>]*>/g, '').split(' ').length,
    "inLanguage": "en-US"
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hindi': return 'हिंदी ब्लॉग'
      case 'english': return 'English Blog'
      case 'latest': return 'Guides'
      case 'current-affairs': return 'Current Affairs'
      default: return category
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="page-surface tool-page-shell py-1 py-md-3">
        <SideRailAds />
        <div className="container blog-post" style={{ maxWidth: 820 }}>
          <BreadcrumbNav
            compact
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/latest" },
              {
                label:
                  blog.title.length > 42
                    ? `${blog.title.slice(0, 42).trimEnd()}…`
                    : blog.title,
              },
            ]}
          />

          <article itemScope itemType="http://schema.org/BlogPosting">
            <header className="blog-post-header">
              <div className="blog-post-meta">
                <span className="chip chip-active blog-post-chip">
                  {getCategoryLabel(blog.category)}
                </span>
                <span className="blog-post-meta-item">
                  <Clock size={12} aria-hidden="true" />
                  5 min read
                </span>
                <time
                  dateTime={blog.publishedAt || blog.createdAt}
                  className="blog-post-meta-item"
                  itemProp="datePublished"
                >
                  <Calendar size={12} aria-hidden="true" />
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </time>
              </div>

              <h1 className="blog-post-title" itemProp="headline">
                {blog.title}
              </h1>
            </header>

            {blog.coverImage ? (
              <div className="blog-post-cover">
                <OptimizedImage
                  src={blog.coverImage}
                  alt={blog.title}
                  width={800}
                  height={450}
                  className="w-100 h-100 object-fit-cover"
                  sizes="(max-width: 768px) 100vw, 820px"
                  priority
                />
              </div>
            ) : null}

            <ContentAdBand className="blog-top-ad my-2" />

            <div
              dangerouslySetInnerHTML={{ __html: formatBlogContent(blog.content) }}
              itemProp="articleBody"
              className="blog-article-body"
            />

            <ContentAdBand className="blog-bottom-ad my-3" />

            <section className="blog-related-tools" aria-labelledby="related-tools-heading">
              <div className="blog-related-label">
                <Wrench size={14} aria-hidden="true" />
                <span>Related tools</span>
              </div>
              <h2 id="related-tools-heading" className="blog-related-title">
                Free calculators you may need next
              </h2>
              <div className="row g-2">
                {recommendedTools.map((tool) => (
                  <div className="col-12 col-sm-6" key={tool.slug}>
                    <Link href={tool.path} className="blog-tool-card">
                      <span className="blog-tool-card-title">
                        {tool.title}
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                      <span className="blog-tool-card-desc">{tool.description}</span>
                    </Link>
                  </div>
                ))}
              </div>
              <p className="blog-related-more">
                <Link href="/tools">All free tools</Link>
                {" · "}
                <Link href="/latest">More guides</Link>
              </p>
            </section>

            <footer className="blog-post-footer">
              <p className="blog-post-updated mb-0">
                Updated {formatDate(blog.updatedAt || blog.createdAt)}
              </p>
            </footer>
          </article>
        </div>
      </div>

      <style>{`
        .blog-post-header { margin-bottom: 0.75rem; }
        .blog-post-meta {
          display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px;
        }
        .blog-post-chip {
          height: 24px !important; font-size: 11px !important;
          background: #eff6ff !important; border-color: #dbeafe !important; color: #1d4ed8 !important;
        }
        .blog-post-meta-item {
          display: inline-flex; align-items: center; gap: 4px;
          color: #94a3b8; font-size: 12px; font-weight: 500;
        }
        .blog-post-title {
          margin: 0; color: #0f172a;
          font-size: clamp(1.35rem, 4.8vw, 2rem); font-weight: 750;
          line-height: 1.22; letter-spacing: -0.03em;
        }
        .blog-post-cover {
          margin: 0.85rem 0 0.75rem; aspect-ratio: 16 / 9; overflow: hidden;
          border-radius: 12px; background: #f1f5f9;
        }
        .blog-article-body { color: #334155; font-size: 0.95rem; line-height: 1.7; }
        .blog-article-body p { margin: 0 0 1rem; }
        .blog-article-body h2, .blog-article-body .blog-h2 {
          margin: 1.5rem 0 0.55rem; color: #0f172a; font-size: 1.2rem;
          font-weight: 750; line-height: 1.3; letter-spacing: -0.02em;
        }
        .blog-article-body h3, .blog-article-body .blog-h3,
        .blog-article-body h4 {
          margin: 1.2rem 0 0.45rem; color: #0f172a; font-size: 1.05rem;
          font-weight: 700; line-height: 1.35;
        }
        .blog-article-body ul, .blog-article-body ol { margin: 0 0 1rem; padding-left: 1.15rem; }
        .blog-article-body li { margin-bottom: 0.35rem; }
        .blog-article-body li > p { margin-bottom: 0.35rem; }
        .blog-article-body a { color: #1d4ed8; text-decoration: none; overflow-wrap: anywhere; }
        .blog-article-body a:hover { text-decoration: underline; }
        .blog-article-body img {
          max-width: 100%; height: auto; margin: 0.5rem 0 1rem; border-radius: 10px;
        }
        .blog-article-body strong { color: #0f172a; font-weight: 700; }
        .blog-note {
          display: block; margin: 1.15rem 0; padding: 12px 14px;
          border: 1px solid #fde68a; border-left: 3px solid #f59e0b;
          border-radius: 10px; background: #fffbeb;
        }
        .blog-note-label {
          display: block; margin-bottom: 4px; color: #92400e;
          font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .blog-note-body p { margin: 0 0 0.5rem; color: #78350f; font-size: 0.875rem; line-height: 1.6; }
        .blog-note-body p:last-child { margin-bottom: 0; }
        .blog-also-read {
          display: block; margin: 1.15rem 0; padding: 12px 14px;
          border: 1px solid #e5e7eb; border-radius: 10px; background: #f8fafc;
        }
        .blog-also-read-label {
          display: block; margin-bottom: 6px; color: #2563eb;
          font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .blog-also-read ul { margin: 0; padding-left: 1.05rem; }
        .blog-also-read li { margin-bottom: 4px; font-size: 0.875rem; line-height: 1.5; }
        .blog-also-read li:last-child { margin-bottom: 0; }
        .blog-also-read a { color: #1d4ed8; font-weight: 600; text-decoration: none; }
        .blog-also-read a:hover { text-decoration: underline; }
        .blog-article-body .blog-byline {
          margin: 1.25rem 0 0; color: #94a3b8; font-size: 0.75rem; font-style: italic;
        }
        .blog-related-tools {
          margin: 1.25rem 0 1rem; padding: 0.9rem 0 0; border-top: 1px solid #eef2f7;
        }
        .blog-related-label {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 6px;
          color: #2563eb; font-size: 11px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .blog-related-title {
          margin: 0 0 0.65rem; color: #0f172a; font-size: 1.05rem;
          font-weight: 750; letter-spacing: -0.015em;
        }
        .blog-tool-card {
          display: flex; flex-direction: column; gap: 4px; height: 100%;
          padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px;
          background: #fff; text-decoration: none; transition: border-color 0.15s ease;
        }
        .blog-tool-card:hover { border-color: #bfdbfe; }
        .blog-tool-card-title {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          color: #0f172a; font-size: 0.9rem; font-weight: 700; line-height: 1.3;
        }
        .blog-tool-card:hover .blog-tool-card-title { color: #2563eb; }
        .blog-tool-card-desc {
          color: #64748b; font-size: 0.75rem; line-height: 1.35;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-related-more { margin: 0.75rem 0 0; color: #64748b; font-size: 0.8rem; }
        .blog-related-more a { color: #2563eb; font-weight: 600; text-decoration: none; }
        .blog-related-more a:hover { text-decoration: underline; }
        .blog-post-footer {
          margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eef2f7; padding-bottom: 1rem;
        }
        .blog-post-updated { color: #94a3b8; font-size: 0.75rem; }
        @media (max-width: 575px) {
          .blog-post-title { font-size: 1.35rem; }
          .blog-article-body { font-size: 0.9rem; }
        }
      `}</style>
    </>
  )
}
