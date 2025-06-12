import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping of broken URLs to their correct destinations based on Ahrefs data
const LINK_FIXES = {
  // 404 errors - pages that don't exist
  '/tribal-culture-in-india': '/latest',
  '/rajasthani-culture': '/latest', 
  '/discover-akshardham-serene-boat-ride-in-delhi': '/latest',
  '/bahubali-hills-udaipur-where-nature-and-history-converge': '/latest',
  
  // 308 redirects - update to final destinations  
  '/mi-cloud': '/latest',
  '/lugu-pahar-jharkhand': '/hindi',
  '/bhadrakali_mandir_itkhori': '/hindi',
  '/best-laptop-under-50000': '/latest',
  '/telibagh-lucknow-uttar-pradesh': '/latest',
  '/web-series-on-netflix': '/latest',
  '/hot-webseries': '/latest',
  '/banaso-mandir': '/hindi',
  '/ranchi-waterpark-discovering-the-aquatic-wonderland': '/hindi',
  '/sandhya-veer-ranchi-a-beacon-of-progress-and-culture': '/hindi',
  '/how-to-link-pan-card-with-aadhar-card-link-pan-card-with-aadhar-card': '/hindi',
  
  // Common patterns
  '/best-web-series': '/latest',
  '/netflix-series': '/latest',
  '/webseries': '/latest',
  '/laptop-review': '/latest',
  '/mobile-review': '/latest',
  '/travel-guide': '/latest',
  '/temple-guide': '/hindi'
}

export async function GET() {
  try {
    const brokenLinks = await scanForBrokenLinks()
    
    return NextResponse.json({
      status: 'success',
      summary: {
        totalBrokenLinks: brokenLinks.length,
        fixableLinks: brokenLinks.filter(link => LINK_FIXES[link.brokenUrl]).length,
        by404: brokenLinks.filter(link => link.expectedStatus === 404).length,
        by308: brokenLinks.filter(link => link.expectedStatus === 308).length
      },
      brokenLinks: brokenLinks.slice(0, 20), // Show first 20
      recommendations: [
        'Run POST /api/link-health with action=fix to automatically fix known broken links',
        'Review and create missing pages for important 404 links',
        'Update content to use correct URLs'
      ]
    })
  } catch (error) {
    console.error('Link health check error:', error)
    return NextResponse.json({ error: 'Failed to check links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'fix') {
      const result = await fixBrokenLinks()
      return NextResponse.json(result)
    } else if (action === 'scan') {
      const brokenLinks = await scanForBrokenLinks()
      return NextResponse.json({ brokenLinks })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Link fix error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function scanForBrokenLinks() {
  const brokenLinks = []
  
  try {
    // Get all blogs
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, content: true, title: true }
    })
    
    // Extract and check internal links
    for (const blog of blogs) {
      const content = blog.content
      const sourceUrl = `/${blog.slug}`
      
      // Find all internal links
      const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi
      let match
      
      while ((match = linkRegex.exec(content)) !== null) {
        const url = match[1]
        const linkText = match[2]
        
        // Check if it's an internal link
        if (url.startsWith('/') || url.includes('pkminfotech.com')) {
          const cleanUrl = url.replace(/https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0]
          
          // Check if this URL is known to be broken
          if (LINK_FIXES[cleanUrl]) {
            brokenLinks.push({
              sourceUrl,
              sourcePage: blog.title,
              brokenUrl: cleanUrl,
              linkText,
              suggestedFix: LINK_FIXES[cleanUrl],
              expectedStatus: cleanUrl.includes('webseries') || cleanUrl.includes('laptop') ? 308 : 404
            })
          }
        }
      }
    }
    
    // Also check for common broken patterns
    const commonBrokenPatterns = [
      '/webseries', '/web-series', '/netflix', '/laptop', '/mobile', 
      '/travel', '/temple', '/culture', '/tech-news', '/review'
    ]
    
    for (const blog of blogs) {
      for (const pattern of commonBrokenPatterns) {
        if (blog.content.includes(`href="${pattern}`) || blog.content.includes(`href='${pattern}`)) {
          brokenLinks.push({
            sourceUrl: `/${blog.slug}`,
            sourcePage: blog.title,
            brokenUrl: pattern,
            linkText: 'Unknown',
            suggestedFix: LINK_FIXES[pattern] || '/latest',
            expectedStatus: 404
          })
        }
      }
    }
    
  } catch (error) {
    console.error('Error scanning for broken links:', error)
  }
  
  return brokenLinks
}

async function fixBrokenLinks() {
  let fixedCount = 0
  let errorCount = 0
  const fixedLinks = []
  const errors = []
  
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, content: true, title: true }
    })
    
    for (const blog of blogs) {
      let content = blog.content
      let hasChanges = false
      
      // Fix each known broken link
      for (const [brokenUrl, fixedUrl] of Object.entries(LINK_FIXES)) {
        const patterns = [
          `href="${brokenUrl}"`,
          `href='${brokenUrl}'`,
          `href="https://www.pkminfotech.com${brokenUrl}"`,
          `href='https://www.pkminfotech.com${brokenUrl}'`,
          `href="https://pkminfotech.com${brokenUrl}"`,
          `href='https://pkminfotech.com${brokenUrl}'`
        ]
        
        for (const pattern of patterns) {
          const replacement = `href="${fixedUrl}"`
          if (content.includes(pattern)) {
            content = content.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement)
            hasChanges = true
          }
        }
      }
      
      // Update blog if changes were made
      if (hasChanges) {
        try {
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content }
          })
          
          fixedCount++
          fixedLinks.push({
            blogId: blog.id,
            title: blog.title,
            slug: blog.slug
          })
        } catch (error) {
          errorCount++
          errors.push(`Failed to update ${blog.title}: ${error.message}`)
        }
      }
    }
    
  } catch (error) {
    console.error('Error fixing broken links:', error)
    errors.push(`System error: ${error.message}`)
  }
  
  return {
    success: true,
    summary: {
      blogsUpdated: fixedCount,
      errors: errorCount,
      totalProcessed: fixedCount + errorCount
    },
    fixedLinks,
    errors: errors.slice(0, 10) // Limit error messages
  }
} 