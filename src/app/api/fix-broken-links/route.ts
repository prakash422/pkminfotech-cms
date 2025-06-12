import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BrokenLink {
  sourceUrl: string
  targetUrl: string
  statusCode: number
  suggested: string
  linkText: string
}

// Known broken links and their fixes from the Ahrefs data
const BROKEN_LINK_FIXES: Record<string, string> = {
  // 404 errors - redirect to appropriate existing content
  '/tribal-culture-in-india': '/latest',
  '/rajasthani-culture': '/latest',
  '/bhadrakali-mandir-itkhori': '/hindi',
  '/discover-akshardham-serene-boat-ride-in-delhi': '/latest',
  '/telibagh-lucknow-uttar-pradesh': '/latest',
  '/bahubali-hills-udaipur-where-nature-and-history-converge': '/latest',
  
  // 308 redirects - update to final destinations
  '/mi-cloud': '/latest',
  '/lugu-pahar-jharkhand': '/hindi', 
  '/best-laptop-under-50000': '/latest',
  '/web-series-on-netflix': '/latest',
  '/ranchi-waterpark-discovering-the-aquatic-wonderland': '/hindi',
  '/sandhya-veer-ranchi-a-beacon-of-progress-and-culture': '/hindi',
  '/hot-webseries': '/latest',
  '/banaso-mandir': '/hindi',
  '/how-to-link-pan-card-with-aadhar-card-link-pan-card-with-aadhar-card': '/hindi',
  
  // Additional common broken patterns
  '/best-web-series': '/latest',
  '/netflix-series': '/latest',
  '/travel-guide': '/latest',
  '/temple-guide': '/hindi',
  '/tech-news': '/latest',
  '/laptop-review': '/latest',
  '/mobile-review': '/latest'
}

export async function POST(request: NextRequest) {
  try {
    const { action, urls } = await request.json()
    
    if (action === 'scan') {
      return await scanBrokenLinks()
    } else if (action === 'fix') {
      return await fixBrokenLinks(urls)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in broken links API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return overview of broken link issues
    const brokenLinks = await detectBrokenLinks()
    const summary = {
      total: brokenLinks.length,
      by404: brokenLinks.filter(link => link.statusCode === 404).length,
      by308: brokenLinks.filter(link => link.statusCode === 308).length,
      fixable: brokenLinks.filter(link => BROKEN_LINK_FIXES[link.targetUrl]).length,
      topIssues: brokenLinks.slice(0, 10)
    }
    
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error getting broken links overview:', error)
    return NextResponse.json({ error: 'Failed to get overview' }, { status: 500 })
  }
}

async function detectBrokenLinks(): Promise<BrokenLink[]> {
  const brokenLinks: BrokenLink[] = []
  
  try {
    // Get all published blogs
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, content: true, title: true }
    })
    
    // Extract internal links from content
    for (const blog of blogs) {
      const sourceUrl = `/${blog.slug}`
      const linkMatches = blog.content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi) || []
      
      for (const linkMatch of linkMatches) {
        const hrefMatch = linkMatch.match(/href=["']([^"']+)["']/)
        const textMatch = linkMatch.match(/>([^<]*)<\/a>/)
        
        if (hrefMatch) {
          const targetUrl = hrefMatch[1]
          const linkText = textMatch ? textMatch[1] : ''
          
          // Check if it's an internal link that might be broken
          if (targetUrl.startsWith('/') || targetUrl.includes('pkminfotech.com')) {
            const cleanUrl = targetUrl.replace(/https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0]
            
            // Check if this URL pattern is known to be broken
            if (BROKEN_LINK_FIXES[cleanUrl] || 
                cleanUrl.includes('webseries') ||
                cleanUrl.includes('laptop') ||
                cleanUrl.includes('mobile') ||
                cleanUrl.includes('temple') ||
                cleanUrl.includes('travel') ||
                cleanUrl.includes('culture')) {
              
              brokenLinks.push({
                sourceUrl,
                targetUrl: cleanUrl,
                statusCode: BROKEN_LINK_FIXES[cleanUrl] ? 308 : 404,
                suggested: BROKEN_LINK_FIXES[cleanUrl] || '/latest',
                linkText
              })
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error detecting broken links:', error)
  }
  
  return brokenLinks
}

async function scanBrokenLinks() {
  const brokenLinks = await detectBrokenLinks()
  const fixableLinks = brokenLinks.filter(link => BROKEN_LINK_FIXES[link.targetUrl])
  
  return NextResponse.json({
    summary: {
      total: brokenLinks.length,
      fixable: fixableLinks.length,
      categories: {
        '404_errors': brokenLinks.filter(l => l.statusCode === 404).length,
        '308_redirects': brokenLinks.filter(l => l.statusCode === 308).length
      }
    },
    brokenLinks: brokenLinks.slice(0, 50), // Limit response size
    recommendations: [
      'Update internal links to point to existing pages',
      'Create missing pages for important broken links',
      'Add redirects for old URLs that still receive traffic',
      'Use relative URLs instead of absolute URLs for internal links'
    ]
  })
}

async function fixBrokenLinks(urls?: string[]) {
  const brokenLinks = await detectBrokenLinks()
  const linksToFix = urls ? brokenLinks.filter(link => urls.includes(link.targetUrl)) : brokenLinks
  
  let fixedCount = 0
  const errors: string[] = []
  
  for (const link of linksToFix) {
    try {
      if (BROKEN_LINK_FIXES[link.targetUrl]) {
        // Find the blog and update its content
        const blog = await prisma.blog.findFirst({
          where: { slug: link.sourceUrl.replace('/', '') }
        })
        
        if (blog) {
          const updatedContent = blog.content.replace(
            new RegExp(`href=["']${link.targetUrl}["']`, 'g'),
            `href="${BROKEN_LINK_FIXES[link.targetUrl]}"`
          )
          
          if (updatedContent !== blog.content) {
            await prisma.blog.update({
              where: { id: blog.id },
              data: { content: updatedContent }
            })
            fixedCount++
          }
        }
      }
    } catch (error) {
      errors.push(`Failed to fix ${link.targetUrl}: ${error}`)
    }
  }
  
  return NextResponse.json({
    success: true,
    fixedCount,
    totalProcessed: linksToFix.length,
    errors
  })
} 