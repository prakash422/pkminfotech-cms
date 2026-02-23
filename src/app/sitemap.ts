import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { toolItems } from '@/data/exam-platform'
import { SSC_EXAM_TYPES } from '@/lib/ssc/ssc-exam-types'
import { BANKING_EXAM_TYPES } from '@/lib/banking/banking-exam-types'
import { RRB_EXAM_TYPES } from '@/lib/rrb/rrb-exam-types'
import { TEACHING_EXAM_TYPES } from '@/lib/teaching/teaching-exam-types'
import { POLICE_EXAM_TYPES } from '@/lib/police/police-exam-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'

  try {
    // Fetch all published blogs
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

    // Static pages
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
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      // Choose Your Exam category landing pages
      { url: `${baseUrl}/ssc`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
      { url: `${baseUrl}/banking`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
      { url: `${baseUrl}/rrb`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
      { url: `${baseUrl}/police`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
      { url: `${baseUrl}/teaching`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
      // Quiz & prep pages
      { url: `${baseUrl}/daily-quiz`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.85 },
      { url: `${baseUrl}/current-affairs-quiz`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.85 },
      { url: `${baseUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    ]

    // Exam-type landing pages (Practice, Mock Test, PYQ, Syllabus)
    const examLandingPages: MetadataRoute.Sitemap = []
    const examEntry = (path: string) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
    SSC_EXAM_TYPES.forEach((e) => examLandingPages.push(examEntry(`/ssc/${e.slug}`)))
    BANKING_EXAM_TYPES.forEach((e) => examLandingPages.push(examEntry(`/banking/${e.slug}`)))
    RRB_EXAM_TYPES.forEach((e) => examLandingPages.push(examEntry(`/rrb/${e.slug}`)))
    TEACHING_EXAM_TYPES.forEach((e) => examLandingPages.push(examEntry(`/teaching/${e.slug}`)))
    POLICE_EXAM_TYPES.forEach((e) => {
      if (!('externalLink' in e)) examLandingPages.push(examEntry(`/police/${e.slug}`))
    })

    // Online tool pages (SEO: include all tool URLs in sitemap)
    const toolPages = toolItems.map((tool) => ({
      url: `${baseUrl}${tool.path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Dynamic blog pages
    const blogPages = blogs.map((blog:any) => ({
      url: `${baseUrl}/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...examLandingPages, ...toolPages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return only static pages if database error
    return [
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
    ]
  }
} 