/**
 * Canonical URL Utilities
 * Resolves redirects and ensures canonical URLs point to final destinations
 */

interface RedirectRule {
  source: string
  destination: string
  permanent: boolean
}

// All redirect rules from next.config.js - UPDATED with Ahrefs report URLs
const REDIRECT_RULES: RedirectRule[] = [
  // === SPECIFIC URLS FROM AHREFS REPORT ===
  { source: '/bahubali-hills-udaipur-where-nature-and-history-converge', destination: '/latest', permanent: true },
  { source: '/ranchi-waterpark-discovering-the-aquatic-wonderland', destination: '/hindi', permanent: true },
  { source: '/how-to-link-pan-card-with-aadhar-card-link-pan-card-with-aadhar-card', destination: '/hindi', permanent: true },
  { source: '/link-pan-card-with-aadhar-card', destination: '/hindi', permanent: true },
  
  // Previous specific URLs
  { source: '/diwali2020', destination: '/latest', permanent: true },
  { source: '/custom-rom', destination: '/latest', permanent: true },
  { source: '/opt-out-of-subsidy-solutions-in-hindi', destination: '/hindi', permanent: true },
  { source: '/tribal-culture-in-india', destination: '/latest', permanent: true },
  { source: '/rajasthani-culture', destination: '/latest', permanent: true },
  { source: '/discover-akshardham-serene-boat-ride-in-delhi', destination: '/latest', permanent: true },
  { source: '/mi-cloud', destination: '/latest', permanent: true },
  { source: '/lugu-pahar-jharkhand', destination: '/hindi', permanent: true },
  { source: '/bhadrakali_mandir_itkhori', destination: '/hindi', permanent: true },
  { source: '/bhadrakali-mandir-itkhori', destination: '/hindi', permanent: true },
  { source: '/best-laptop-under-50000', destination: '/latest', permanent: true },
  { source: '/telibagh-lucknow-uttar-pradesh', destination: '/latest', permanent: true },
  { source: '/web-series-on-netflix', destination: '/latest', permanent: true },
  { source: '/hot-webseries', destination: '/latest', permanent: true },
  { source: '/banaso-mandir', destination: '/hindi', permanent: true },
  { source: '/sandhya-veer-ranchi-a-beacon-of-progress-and-culture', destination: '/hindi', permanent: true },
  
  // Blog redirects
  { source: '/blog/:slug*', destination: '/:slug*', permanent: true },
  
  // Pattern-based redirects
  { source: '/microsoft:path*', destination: '/latest', permanent: true },
  { source: '/webseries:path*', destination: '/latest', permanent: true },
  { source: '/web-series:path*', destination: '/latest', permanent: true },
  { source: '/laptop:path*', destination: '/latest', permanent: true },
  { source: '/mobile:path*', destination: '/latest', permanent: true },
  { source: '/temple:path*', destination: '/hindi', permanent: true },
  { source: '/mandir:path*', destination: '/hindi', permanent: true },
  { source: '/culture:path*', destination: '/latest', permanent: true },
  { source: '/travel:path*', destination: '/latest', permanent: true },
  
  // Old blog patterns
  { source: '/p/:path*', destination: '/latest', permanent: true },
  { source: '/post/:path*', destination: '/latest', permanent: true },
  { source: '/articles/:path*', destination: '/latest', permanent: true },
  
  // Date-based URLs
  { source: '/2020/:path*', destination: '/latest', permanent: true },
  { source: '/2021/:path*', destination: '/latest', permanent: true },
  { source: '/2022/:path*', destination: '/latest', permanent: true },
  { source: '/2023/:path*', destination: '/latest', permanent: true },
  { source: '/2024/:path*', destination: '/latest', permanent: true },
  
  // File extensions
  { source: '/:path*.php', destination: '/latest', permanent: true },
  { source: '/:path*.asp', destination: '/latest', permanent: true },
  { source: '/:path*.jsp', destination: '/latest', permanent: true },
  
  // Admin redirects
  { source: '/wp-admin/:path*', destination: '/', permanent: true },
  { source: '/wp-content/:path*', destination: '/', permanent: true },
  
  // Pages folder
  { source: '/pages/:path*', destination: '/:path*', permanent: true },
]

/**
 * Resolves a URL through all redirect chains to get the final destination
 */
export function resolveCanonicalUrl(path: string): string {
  let currentPath = path
  let resolvedPath = path
  const maxRedirects = 10 // Prevent infinite loops
  let redirectCount = 0

  while (redirectCount < maxRedirects) {
    const redirect = findRedirectForPath(currentPath)
    
    if (!redirect) {
      break // No more redirects found
    }
    
    resolvedPath = redirect.destination
    currentPath = resolvedPath
    redirectCount++
  }

  return resolvedPath
}

/**
 * Find matching redirect rule for a given path
 */
function findRedirectForPath(path: string): RedirectRule | null {
  for (const rule of REDIRECT_RULES) {
    if (matchesPattern(path, rule.source)) {
      return {
        ...rule,
        destination: processDestination(path, rule.source, rule.destination)
      }
    }
  }
  return null
}

/**
 * Check if path matches redirect pattern
 */
function matchesPattern(path: string, pattern: string): boolean {
  // Handle exact matches
  if (pattern === path) return true
  
  // Handle wildcard patterns
  if (pattern.includes('*')) {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/:\w+/g, '[^/]+')
    
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }
  
  // Handle parameter patterns like /:slug*
  if (pattern.includes(':')) {
    const regexPattern = pattern.replace(/:\w+/g, '[^/]+')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }
  
  return false
}

/**
 * Process destination with parameter substitution
 */
function processDestination(path: string, source: string, destination: string): string {
  // Simple parameter substitution for :slug* patterns
  if (source.includes(':slug*') && destination.includes(':slug*')) {
    const pathParts = path.split('/')
    const sourceParts = source.split('/')
    
    // Find the dynamic part
    for (let i = 0; i < sourceParts.length; i++) {
      if (sourceParts[i] === ':slug*') {
        const dynamicPart = pathParts.slice(i).join('/')
        return destination.replace(':slug*', dynamicPart)
      }
    }
  }
  
  return destination
}

/**
 * Generate canonical URL with proper base URL and redirect resolution
 */
export function generateCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // Resolve through redirect chains
  const finalPath = resolveCanonicalUrl(normalizedPath)
  
  // Remove trailing slash except for root
  const cleanPath = finalPath === '/' ? '/' : finalPath.replace(/\/$/, '')
  
  return `${base}${cleanPath}`
}

/**
 * Check if URL would be redirected
 */
export function wouldRedirect(path: string): boolean {
  return findRedirectForPath(path) !== null
}

/**
 * Get redirect destination for a path (if any)
 */
export function getRedirectDestination(path: string): string | null {
  const redirect = findRedirectForPath(path)
  return redirect ? redirect.destination : null
}

/**
 * Validate canonical URL is correct (doesn't point to redirected URL)
 */
export function validateCanonicalUrl(canonicalUrl: string): {
  isValid: boolean
  shouldBe?: string
  issue?: string
} {
  try {
    const url = new URL(canonicalUrl)
    const path = url.pathname
    
    if (wouldRedirect(path)) {
      const correctPath = resolveCanonicalUrl(path)
      return {
        isValid: false,
        shouldBe: generateCanonicalUrl(correctPath),
        issue: `Canonical URL points to redirected path. Should point to: ${correctPath}`
      }
    }
    
    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      issue: 'Invalid canonical URL format'
    }
  }
}

/**
 * Batch validate multiple canonical URLs
 */
export function validateCanonicalUrls(urls: string[]): Array<{
  url: string
  isValid: boolean
  shouldBe?: string
  issue?: string
}> {
  return urls.map(url => ({
    url,
    ...validateCanonicalUrl(url)
  }))
} 