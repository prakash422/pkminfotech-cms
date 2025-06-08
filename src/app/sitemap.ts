import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'

  // Get all published blog posts
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true
    },
    orderBy: { updatedAt: 'desc' }
  })

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
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Blog posts
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages
  const categoryPages = [
    {
      url: `${baseUrl}/?category=latest`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=english`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=hindi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  return [
    ...staticPages,
    ...blogUrls,
    ...categoryPages,
  ]
} 