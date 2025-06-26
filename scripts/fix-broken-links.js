#!/usr/bin/env node

/**
 * Broken Link Detection and Fix Script
 * Automatically detects and fixes broken internal links in blog content
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mapping of broken URLs to their correct destinations
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
  '/bhadrakali-mandir-itkhori': '/hindi',
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

async function scanAndFixBrokenLinks() {
  let fixedCount = 0
  let totalChecked = 0
  const errors = []
  
  try {
    // Get all blogs
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, content: true, title: true }
    })
    
    for (const blog of blogs) {
      totalChecked++
      let content = blog.content
      let hasChanges = false
      const fixedInThisBlog = []
      
      // Check for each known broken link
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
          if (content.includes(pattern)) {
            const replacement = `href="${fixedUrl}"`
            content = content.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement)
            hasChanges = true
            fixedInThisBlog.push(`${brokenUrl} → ${fixedUrl}`)
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
        } catch (error) {
          errors.push(`Failed to update "${blog.title}": ${error.message}`)
        }
      }
    }
    
  } catch (error) {
    errors.push(`System error: ${error.message}`)
  } finally {
    await prisma.$disconnect()
  }
  
  // Summary
  if (errors.length > 0) {
    errors.forEach(error => console.log(`   ${error}`))
  }
  
  if (fixedCount > 0) {
    console.log('   Recommendations:')
    console.log('   • Deploy these changes to production')
    console.log('   • Wait 24-48 hours for crawlers to re-index')
    console.log('   • Check Ahrefs again for improvement')
  }
}

// Additional function to scan for potential issues
async function scanForPotentialIssues() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    select: { slug: true, content: true, title: true }
  })
  
  const suspiciousPatterns = [
    '/webseries', '/web-series', '/netflix', '/laptop', '/mobile', 
    '/travel', '/temple', '/culture', '/tech-news', '/review',
    'pkminfotech.com/blog/', 'pkminfotech.com/p/'
  ]
  
  const issues = []
  
  for (const blog of blogs) {
    for (const pattern of suspiciousPatterns) {
      if (blog.content.includes(pattern)) {
        issues.push({
          blog: blog.title,
          pattern,
          url: `/${blog.slug}`
        })
      }
    }
  }
  
  if (issues.length > 0) {
    issues.slice(0, 10).forEach(issue => {
      console.log(`   "${issue.blog}" contains: ${issue.pattern}`)
    })
    if (issues.length > 10) {
      console.log(`   ... and ${issues.length - 10} more`)
    }
  }
}

// Run the script
if (require.main === module) {
  (async () => {
    await scanAndFixBrokenLinks()
    await scanForPotentialIssues()
  })()
}