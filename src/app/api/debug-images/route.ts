import { NextRequest, NextResponse } from "next/server"

// Helper function to extract images from HTML content with alt text and titles
function extractImagesFromContent(content: string): Array<{url: string, alt?: string, title?: string}> {
  const images: Array<{url: string, alt?: string, title?: string}> = []
  
  // Multiple regex patterns to catch different image formats
  const imagePatterns = [
    // Standard img tags
    /<img[^>]*>/gi,
    // Self-closing img tags
    /<img[^>]*\/>/gi,
    // Images with various quote styles
    /<img[^>]*src\s*=\s*['"][^'"]*['"][^>]*>/gi,
    // Images without quotes (rare but possible)
    /<img[^>]*src\s*=\s*[^\s>]+[^>]*>/gi
  ]

  // Use a Set to avoid duplicates
  const foundImages = new Set<string>()

  imagePatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const imgTag = match[0]
      
      // Extract src with multiple patterns
      let srcMatch = imgTag.match(/src\s*=\s*["']([^"']+)["']/i) ||
                    imgTag.match(/src\s*=\s*([^\s>]+)/i)
      
      if (!srcMatch || !srcMatch[1]) continue
      
      let src = srcMatch[1].trim()
      
      // Skip data URLs, relative URLs, and invalid URLs
      if (!src || 
          src.startsWith('data:') || 
          src.startsWith('#') ||
          src.startsWith('javascript:') ||
          (!src.startsWith('http') && !src.startsWith('//'))) {
        continue
      }
      
      // Handle protocol-relative URLs
      if (src.startsWith('//')) {
        src = 'https:' + src
      }
      
      // Skip if we've already found this image
      if (foundImages.has(src)) continue
      foundImages.add(src)
      
      // Extract alt text with multiple patterns
      const altMatch = imgTag.match(/alt\s*=\s*["']([^"']*)["']/i) ||
                      imgTag.match(/alt\s*=\s*([^\s>]+)/i)
      
      // Extract title attribute with multiple patterns  
      const titleMatch = imgTag.match(/title\s*=\s*["']([^"']*)["']/i) ||
                        imgTag.match(/title\s*=\s*([^\s>]+)/i)
      
      images.push({
        url: src,
        alt: altMatch ? altMatch[1].trim() : undefined,
        title: titleMatch ? titleMatch[1].trim() : undefined
      })
    }
  })

  // Also look for images in href attributes (linked images)
  const linkPattern = /<a[^>]*href\s*=\s*["']([^"']*\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?[^"']*)?)["'][^>]*>/gi
  let linkMatch
  while ((linkMatch = linkPattern.exec(content)) !== null) {
    let src = linkMatch[1].trim()
    
    if (!src.startsWith('http') && !src.startsWith('//')) continue
    
    if (src.startsWith('//')) {
      src = 'https:' + src
    }
    
    if (!foundImages.has(src)) {
      foundImages.add(src)
      images.push({
        url: src,
        alt: undefined,
        title: undefined
      })
    }
  }

  // Look for images in background-image CSS properties
  const bgImagePattern = /background-image\s*:\s*url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi
  let bgMatch
  while ((bgMatch = bgImagePattern.exec(content)) !== null) {
    let src = bgMatch[1].trim()
    
    if (!src.startsWith('http') && !src.startsWith('//')) continue
    
    if (src.startsWith('//')) {
      src = 'https:' + src
    }
    
    if (!foundImages.has(src)) {
      foundImages.add(src)
      images.push({
        url: src,
        alt: undefined,
        title: undefined
      })
    }
  }

  return images
}

// POST /api/debug-images - Debug image extraction
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      )
    }

    const images = extractImagesFromContent(content)
    
    return NextResponse.json({
      success: true,
      totalImages: images.length,
      images: images.map(img => ({
        url: img.url,
        hasAlt: !!img.alt,
        altText: img.alt,
        hasTitle: !!img.title,
        titleText: img.title,
        isBlogger: img.url.includes('blogspot.com') || 
                  img.url.includes('googleusercontent.com') ||
                  img.url.includes('blogger.com')
      })),
      rawContent: content.substring(0, 500) + (content.length > 500 ? '...' : '')
    })

  } catch (error) {
    console.error("Debug images error:", error)
    return NextResponse.json(
      { 
        error: "Failed to debug images", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// GET /api/debug-images - Get debug instructions
export async function GET() {
  return NextResponse.json({
    instructions: {
      method: "POST",
      endpoint: "/api/debug-images",
      body: {
        content: "HTML content containing images"
      },
      description: "Debug image extraction from HTML content"
    },
    examples: {
      basicImage: '<img src="https://example.com/image.jpg" alt="Example">',
      bloggerImage: '<img src="https://blogger.googleusercontent.com/img/a/AVvXsEj123/s320/image.jpg">',
      linkedImage: '<a href="https://example.com/image.jpg">Link</a>'
    }
  })
} 