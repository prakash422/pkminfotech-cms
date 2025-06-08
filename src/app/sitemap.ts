import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  ]

  try {
    // Get all published blog posts
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'published',
        publishedAt: {
          not: null
        }
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        category: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // Get all published pages
    const pages = await prisma.page.findMany({
      where: {
        status: 'published'
      },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true
      }
    })

    // Blog post URLs
    const blogUrls = blogs.map((blog) => ({
      url: `${baseUrl}/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: blog.category === 'latest' ? 0.9 : 0.7,
    }))

    // Page URLs
    const pageUrls = pages.map((page) => ({
      url: `${baseUrl}/pages/${page.slug}`,
      lastModified: page.updatedAt || page.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Category pages
    const categories = await prisma.blog.findMany({
      where: {
        status: 'published'
      },
      select: {
        category: true
      },
      distinct: ['category']
    })

    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/?category=${cat.category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }))

    return [...staticPages, ...blogUrls, ...pageUrls, ...categoryUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
} 