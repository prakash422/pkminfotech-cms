// SEO utilities for auto-generating metadata

export interface BlogSEOData {
  title: string
  content: string
  excerpt?: string
  category: string
  focusKeyword?: string
  slug: string
}

// Auto-generate SEO title (optimized for 50-60 characters)
export function generateSEOTitle(title: string, category?: string): string {
  const maxLength = 60
  const suffix = ' | Pkminfotech'
  const availableLength = maxLength - suffix.length

  if (title.length <= availableLength) {
    return title + suffix
  }

  // Try to truncate at word boundary
  let truncated = title.substring(0, availableLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > availableLength * 0.7) {
    truncated = truncated.substring(0, lastSpace)
  }
  
  return truncated + '...' + suffix
}

// Auto-generate meta description (optimized for 150-160 characters)
export function generateMetaDescription(content: string, excerpt?: string): string {
  const maxLength = 160
  const minLength = 120

  if (excerpt && excerpt.length >= minLength && excerpt.length <= maxLength) {
    return excerpt
  }

  // Clean HTML and extract text
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  // Try to cut at sentence boundary
  let truncated = cleanContent.substring(0, maxLength - 3)
  const lastPeriod = truncated.lastIndexOf('.')
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastPeriod > minLength) {
    return cleanContent.substring(0, lastPeriod + 1)
  } else if (lastSpace > minLength) {
    truncated = truncated.substring(0, lastSpace)
  }

  return truncated + '...'
}

// Extract focus keyword from content if not provided
export function extractFocusKeyword(title: string, content: string): string {
  // Remove common words
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']
  
  // Extract words from title (prioritize title)
  const titleWords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))

  if (titleWords.length > 0) {
    return titleWords[0]
  }

  // Extract from content if title doesn't yield good keywords
  const contentWords = content
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4 && !commonWords.includes(word))

  // Count word frequency
  const wordCount: { [key: string]: number } = {}
  contentWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // Return most frequent word
  const sortedWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .map(([word]) => word)

  return sortedWords[0] || 'technology'
}

// Generate keywords from content and category
export function generateKeywords(category: string, title: string, content: string, focusKeyword?: string): string {
  const baseKeywords = ['Pkminfotech', 'latest news', 'updates']
  
  const categoryKeywords: { [key: string]: string[] } = {
    'hindi': ['हिंदी समाचार', 'भारत समाचार', 'hindi news', 'India news'],
    'english': ['English news', 'international news', 'global updates'],
    'latest': ['breaking news', 'latest updates', 'trending news'],
    'technology': ['tech news', 'technology updates', 'IT news', 'digital trends'],
    'business': ['business news', 'corporate updates', 'market analysis'],
    'travel': ['travel guides', 'tourism', 'travel tips', 'destinations']
  }

  const keywords = [
    ...baseKeywords,
    ...(categoryKeywords[category] || []),
    category
  ]

  if (focusKeyword) {
    keywords.unshift(focusKeyword)
  }

  // Extract additional keywords from title
  const titleKeywords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 3)

  keywords.push(...titleKeywords)

  return keywords.slice(0, 10).join(', ')
}

// Auto-generate JSON-LD structured data for blog posts
export function generateBlogStructuredData(blog: {
  title: string
  content: string
  excerpt?: string
  slug: string
  coverImage?: string
  category: string
  publishedAt?: Date
  updatedAt?: Date
  author?: { name?: string | null }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
  
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": blog.title,
    "description": blog.excerpt || generateMetaDescription(blog.content),
    "image": blog.coverImage || `${baseUrl}/default-blog-image.jpg`,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Pkminfotech Team",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pkminfotech",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon-32x32.png`,
        "width": 32,
        "height": 32
      }
    },
    "datePublished": blog.publishedAt?.toISOString(),
    "dateModified": blog.updatedAt?.toISOString(),
    "url": `${baseUrl}/${blog.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${blog.slug}`
    },
    "articleSection": blog.category,
    "wordCount": blog.content.replace(/<[^>]*>/g, '').split(' ').length,
    "inLanguage": blog.category === 'hindi' ? 'hi-IN' : 'en-US',
    "isPartOf": {
      "@type": "Website",
      "@id": baseUrl,
      "name": "Pkminfotech",
      "description": "Latest tech news, business updates & travel guides"
    }
  }
}

// SEO analysis scoring
export function analyzeSEO(data: {
  title: string
  metaDescription: string
  content: string
  focusKeyword?: string
}): { score: number; suggestions: string[] } {
  let score = 0
  const suggestions: string[] = []

  // Title length (30-60 characters is optimal)
  if (data.title.length >= 30 && data.title.length <= 60) {
    score += 20
  } else if (data.title.length < 30) {
    suggestions.push('Title is too short. Aim for 30-60 characters.')
    score += 5
  } else {
    suggestions.push('Title is too long. Aim for 30-60 characters.')
    score += 10
  }

  // Meta description length (120-160 characters)
  if (data.metaDescription.length >= 120 && data.metaDescription.length <= 160) {
    score += 20
  } else if (data.metaDescription.length < 120) {
    suggestions.push('Meta description is too short. Aim for 120-160 characters.')
    score += 5
  } else {
    suggestions.push('Meta description is too long. Aim for 120-160 characters.')
    score += 10
  }

  // Content length (at least 300 words is good)
  const wordCount = data.content.replace(/<[^>]*>/g, '').split(' ').length
  if (wordCount >= 300) {
    score += 20
  } else if (wordCount >= 150) {
    score += 10
    suggestions.push('Content could be longer. Aim for at least 300 words.')
  } else {
    score += 5
    suggestions.push('Content is too short. Aim for at least 300 words.')
  }

  // Focus keyword usage
  if (data.focusKeyword) {
    const keyword = data.focusKeyword.toLowerCase()
    const titleHasKeyword = data.title.toLowerCase().includes(keyword)
    const descHasKeyword = data.metaDescription.toLowerCase().includes(keyword)
    const contentHasKeyword = data.content.toLowerCase().includes(keyword)

    if (titleHasKeyword) score += 15
    else suggestions.push('Include focus keyword in title.')

    if (descHasKeyword) score += 15
    else suggestions.push('Include focus keyword in meta description.')

    if (contentHasKeyword) score += 10
    else suggestions.push('Include focus keyword in content.')
  } else {
    suggestions.push('Add a focus keyword for better SEO.')
  }

  return { score: Math.min(score, 100), suggestions }
}

// Auto-generate all SEO data for a blog post
export function autoGenerateFullSEO(blogData: BlogSEOData) {
  const seoTitle = generateSEOTitle(blogData.title, blogData.category)
  const metaDescription = generateMetaDescription(blogData.content, blogData.excerpt)
  const focusKeyword = blogData.focusKeyword || extractFocusKeyword(blogData.title, blogData.content)
  const keywords = generateKeywords(blogData.category, blogData.title, blogData.content, focusKeyword)

  return {
    title: seoTitle,
    metaDescription,
    focusKeyword,
    keywords,
    analysis: analyzeSEO({
      title: seoTitle,
      metaDescription,
      content: blogData.content,
      focusKeyword
    })
  }
} 