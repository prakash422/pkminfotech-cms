import { NextRequest, NextResponse } from 'next/server'

interface FourOhFourData {
  url: string
  count: number
  lastSeen: string
  suggested: string
}

// In-memory storage for development (use Redis/Database in production)
const fourOhFourLog: Map<string, FourOhFourData> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { pathname } = await request.json()
    
    if (!pathname) {
      return NextResponse.json({ error: 'pathname required' }, { status: 400 })
    }

    // Log the 404
    const existing = fourOhFourLog.get(pathname)
    const suggested = getSuggestedRedirect(pathname)
    
    fourOhFourLog.set(pathname, {
      url: pathname,
      count: existing ? existing.count + 1 : 1,
      lastSeen: new Date().toISOString(),
      suggested
    })

    console.log(`📊 404 Tracked: ${pathname} (${fourOhFourLog.get(pathname)?.count} times) → Suggested: ${suggested}`)

    return NextResponse.json({ 
      success: true, 
      suggested,
      count: fourOhFourLog.get(pathname)?.count 
    })
  } catch (error) {
    console.error('Error logging 404:', error)
    return NextResponse.json({ error: 'Failed to log 404' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return analytics data
    const analytics = Array.from(fourOhFourLog.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 50) // Top 50 404s

    const summary = {
      total404s: fourOhFourLog.size,
      totalHits: analytics.reduce((sum, item) => sum + item.count, 0),
      top404s: analytics,
      patterns: getCommonPatterns(analytics)
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error getting 404 analytics:', error)
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}

function getSuggestedRedirect(pathname: string): string {
  const lower = pathname.toLowerCase()
  
  // Tech/Microsoft content
  if (lower.includes('microsoft') || lower.includes('windows') || lower.includes('office')) {
    return '/latest'
  }
  
  // Hindi content
  if (lower.includes('hindi') || lower.includes('हिंदी') || lower.includes('%E0%A4')) {
    return '/hindi'
  }
  
  // English content
  if (lower.includes('english') || lower.includes('guide') || lower.includes('tutorial')) {
    return '/english'
  }
  
  // Travel content
  if (lower.includes('travel') || lower.includes('tour') || lower.includes('place') || lower.includes('destination')) {
    return '/latest'
  }
  
  // Business content
  if (lower.includes('business') || lower.includes('startup') || lower.includes('company')) {
    return '/latest'
  }
  
  // Tech content
  if (lower.includes('tech') || lower.includes('software') || lower.includes('app') || lower.includes('mobile')) {
    return '/latest'
  }
  
  // Date-based URLs
  if (/\/20(20|21|22|23|24)\//.test(lower)) {
    return '/latest'
  }
  
  // Default to home for unrecognized patterns
  return '/'
}

function getCommonPatterns(analytics: FourOhFourData[]): Record<string, number> {
  const patterns: Record<string, number> = {}
  
  analytics.forEach(item => {
    const url = item.url
    
    // Check for common patterns
    if (url.includes('microsoft')) patterns['microsoft-related'] = (patterns['microsoft-related'] || 0) + item.count
    if (url.includes('hindi')) patterns['hindi-content'] = (patterns['hindi-content'] || 0) + item.count
    if (url.includes('%')) patterns['encoded-chars'] = (patterns['encoded-chars'] || 0) + item.count
    if (url.includes('cache')) patterns['cache-files'] = (patterns['cache-files'] || 0) + item.count
    if (url.match(/\/20(20|21|22|23|24)\//)) patterns['date-based'] = (patterns['date-based'] || 0) + item.count
    if (url.includes('.php') || url.includes('.asp')) patterns['old-extensions'] = (patterns['old-extensions'] || 0) + item.count
    if (url.length > 100) patterns['very-long-urls'] = (patterns['very-long-urls'] || 0) + item.count
  })
  
  return patterns
} 