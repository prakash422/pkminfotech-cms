import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { toolItems } from '@/data/tools-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'

  // 1. Static pages (excluding exam pages / prep / mock-tests)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/latest`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/english`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hindi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimers`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // 2. Filter out exam-specific calculators (high competition)
  const examSlugs = new Set([
    'ssc', 'ssc-cgl', 'banking', 'rrb', 'rrb-ntpc', 'police', 'teaching', 'railway', 'upsc', 'defence', 'state-exams'
  ])
  const nonExamTools = toolItems.filter((tool) => !examSlugs.has(tool.examCategorySlug))

  const toolPages = nonExamTools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 3. Dynamic blog pages (wrapped in separate try/catch to be database-resilient)
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'published'
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    const activeBlogPages: any[] = []
    const { resolveCanonicalUrl } = require('@/lib/canonical-utils')

    blogs.forEach((blog: any) => {
      const resolved = resolveCanonicalUrl(`/${blog.slug}`)
      // Only include blogs in sitemap that do not redirect
      if (resolved === `/${blog.slug}`) {
        activeBlogPages.push({
          url: `${baseUrl}/${blog.slug}`,
          lastModified: blog.updatedAt || blog.publishedAt || new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      }
    })

    blogPages = activeBlogPages
  } catch (error) {
    console.error('Error fetching blogs for sitemap, returning static pages only:', error)
  }

  return [...staticPages, ...toolPages, ...blogPages]
} 