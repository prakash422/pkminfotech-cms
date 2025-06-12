import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface CatchAllProps {
  params: {
    catchall: string[]
  }
}

export default async function CatchAllPage({ params }: CatchAllProps) {
  const path = params.catchall?.join('/') || ''
  
  // Log for analytics
  try {
    await fetch('/api/404-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname: `/${path}` })
    })
  } catch (error) {
    console.error('Failed to log 404:', error)
  }

  // Intelligent redirect based on URL content
  const suggested = getSmartRedirect(path)
  
  if (suggested !== '/404') {
    redirect(suggested)
  }
  
  // If no smart redirect found, show 404
  notFound()
}

function getSmartRedirect(path: string): string {
  const lower = path.toLowerCase()
  
  // === CONTENT-BASED REDIRECTS ===
  
  // Hindi content patterns
  if (
    lower.includes('hindi') || 
    lower.includes('हिंदी') || 
    lower.includes('%e0%a4') || // Encoded Hindi
    lower.includes('subsidy') ||
    lower.includes('opt-out')
  ) {
    return '/hindi'
  }
  
  // English/Tutorial content
  if (
    lower.includes('english') || 
    lower.includes('guide') || 
    lower.includes('tutorial') ||
    lower.includes('how-to')
  ) {
    return '/english'
  }
  
  // Tech content
  if (
    lower.includes('microsoft') || 
    lower.includes('windows') || 
    lower.includes('office') ||
    lower.includes('tech') ||
    lower.includes('software') ||
    lower.includes('app') ||
    lower.includes('mobile') ||
    lower.includes('android') ||
    lower.includes('ios') ||
    lower.includes('custom-rom') ||
    lower.includes('rom')
  ) {
    return '/latest'
  }
  
  // Travel content
  if (
    lower.includes('travel') || 
    lower.includes('tour') || 
    lower.includes('place') ||
    lower.includes('destination') ||
    lower.includes('diwali') ||
    lower.includes('festival')
  ) {
    return '/latest'
  }
  
  // Business content
  if (
    lower.includes('business') || 
    lower.includes('startup') || 
    lower.includes('company') ||
    lower.includes('finance')
  ) {
    return '/latest'
  }
  
  // === PATTERN-BASED REDIRECTS ===
  
  // Date-based URLs → Latest
  if (/20(20|21|22|23|24)/.test(lower)) {
    return '/latest'
  }
  
  // Old blog patterns
  if (
    lower.startsWith('p/') ||
    lower.startsWith('post/') ||
    lower.startsWith('blog/') ||
    lower.startsWith('articles/')
  ) {
    return '/latest'
  }
  
  // Cache/temporary files
  if (
    lower.includes('cache') ||
    lower.includes('temp') ||
    lower.includes('tmp')
  ) {
    return '/latest'
  }
  
  // Admin/system URLs
  if (
    lower.includes('admin') ||
    lower.includes('wp-') ||
    lower.includes('login')
  ) {
    return '/'
  }
  
  // File extensions
  if (
    lower.endsWith('.php') ||
    lower.endsWith('.asp') ||
    lower.endsWith('.jsp') ||
    lower.endsWith('.html')
  ) {
    return '/latest'
  }
  
  // Very long URLs (likely spam/broken)
  if (path.length > 100) {
    return '/'
  }
  
  // Special characters/encoded URLs
  if (
    lower.includes('%') ||
    lower.includes('---') ||
    lower.includes('__')
  ) {
    return '/latest'
  }
  
  // === KEYWORD-BASED REDIRECTS ===
  
  // If contains common keywords, send to latest
  const techKeywords = [
    'update', 'version', 'download', 'install', 'setup',
    'tips', 'tricks', 'review', 'news', 'latest',
    'technology', 'digital', 'online', 'internet'
  ]
  
  if (techKeywords.some(keyword => lower.includes(keyword))) {
    return '/latest'
  }
  
  // Default: no redirect (will show 404)
  return '/404'
} 