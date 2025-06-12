import { NextRequest, NextResponse } from 'next/server'
import { validateCanonicalUrls, generateCanonicalUrl } from '@/lib/canonical-utils'

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()
    
    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array required' }, { status: 400 })
    }

    const results = validateCanonicalUrls(urls)
    const issues = results.filter(r => !r.isValid)
    
    return NextResponse.json({
      total: results.length,
      issues: issues.length,
      valid: results.length - issues.length,
      results: results
    })
  } catch (error) {
    console.error('Error validating canonical URLs:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get all pages and validate their canonical URLs
    const sampleUrls = [
      'https://www.pkminfotech.com/',
      'https://www.pkminfotech.com/latest',
      'https://www.pkminfotech.com/english', 
      'https://www.pkminfotech.com/hindi',
      'https://www.pkminfotech.com/about-us',
      'https://www.pkminfotech.com/contact-us',
      'https://www.pkminfotech.com/privacy-policy',
      'https://www.pkminfotech.com/disclaimers',
      'https://www.pkminfotech.com/blog/test-post',
      'https://www.pkminfotech.com/pages/test-page'
    ]
    
    const results = validateCanonicalUrls(sampleUrls)
    const issues = results.filter(r => !r.isValid)
    
    // Test specific problematic patterns
    const testPatterns = [
      '/blog/some-post',
      '/diwali2020', 
      '/microsoft-office-guide',
      '/p/old-post',
      '/2023/old-article'
    ]
    
    const patternTests = testPatterns.map(pattern => ({
      pattern,
      correctCanonical: generateCanonicalUrl(pattern),
      wouldRedirect: pattern !== generateCanonicalUrl(pattern).replace('https://www.pkminfotech.com', '')
    }))
    
    return NextResponse.json({
      status: issues.length === 0 ? 'All canonical URLs are valid ✅' : `${issues.length} canonical URL issues found ⚠️`,
      total: results.length,
      issues: issues.length,
      valid: results.length - issues.length,
      results: results,
      patternTests: patternTests,
      recommendations: issues.length > 0 ? [
        'Update canonical URLs to point to final destinations',
        'Use generateCanonicalUrl() utility in all metadata',
        'Check for redirect chains in canonical tags',
        'Ensure no hardcoded URLs that redirect'
      ] : [
        'All canonical URLs are properly configured! 🎉'
      ]
    })
  } catch (error) {
    console.error('Error in canonical validation:', error)
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 