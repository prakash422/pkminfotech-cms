import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseStringPromise } from 'xml2js'

interface BloggerPost {
  id: string
  title: string
  content: string
  published: string
  updated: string
  category?: string[]
  labels?: string[]
  author: {
    name: string
    email: string
  }
  images?: string[]
  metaDescription?: string
  seoTitle?: string
}

interface ImageProcessResult {
  originalUrl: string
  newUrl: string
  downloaded: boolean
  altText?: string
  title?: string
}

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

  console.log(`Extracted ${images.length} images from content:`, images.map(img => img.url))
  
  return images
}

// Helper function to generate SEO-friendly meta description
function generateMetaDescription(content: string, excerpt?: string): string {
  if (excerpt) {
    return excerpt.replace(/<[^>]*>/g, '').substring(0, 160)
  }
  
  // Remove HTML tags and extract first 160 characters
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return cleanContent.substring(0, 157) + (cleanContent.length > 157 ? '...' : '')
}

// Helper function to generate SEO title (limit 60 characters)
function generateSEOTitle(title: string): string {
  if (title.length <= 60) return title
  
  // Try to cut at word boundary
  const truncated = title.substring(0, 57)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 40) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

// Helper function to improve image alt text
function improveImageAltText(alt: string | undefined, title: string | undefined, postTitle: string): string {
  if (alt && alt.trim() && alt.toLowerCase() !== 'image') {
    return alt.trim()
  }
  
  if (title && title.trim() && title.toLowerCase() !== 'image') {
    return title.trim()
  }
  
  // Generate basic alt text based on post title
  return `Image from ${postTitle}`
}

// Helper function to download and save image (optional - can be enabled/disabled)
async function processImage(
  imageData: {url: string, alt?: string, title?: string}, 
  downloadImages: boolean = false,
  postTitle: string = ''
): Promise<ImageProcessResult> {
  try {
    let cleanUrl = imageData.url
    
    // Comprehensive Blogger URL cleaning
    if (imageData.url.includes('blogspot.com') || 
        imageData.url.includes('googleusercontent.com') ||
        imageData.url.includes('blogger.com')) {
      
      // Remove size parameters in various formats
      cleanUrl = cleanUrl
        // Remove /s320/, /s640/, etc.
        .replace(/\/s\d+(-c)?\//, '/')
        // Remove =s320, =s640, etc. at end of URL
        .replace(/=s\d+(-c)?$/, '')
        // Remove =w320, =h320 parameters
        .replace(/[?&]w=\d+/g, '')
        .replace(/[?&]h=\d+/g, '')
        // Remove blogger resize parameters
        .replace(/[?&]imgmax=\d+/g, '')
        // Remove other blogger-specific parameters
        .replace(/[?&]resize=\d+/g, '')
        // Clean up multiple slashes
        .replace(/([^:]\/)\/+/g, '$1')
    }
    
    // Validate URL format
    try {
      new URL(cleanUrl)
    } catch (urlError) {
      console.warn(`Invalid URL format: ${cleanUrl}, keeping original: ${imageData.url}`)
      cleanUrl = imageData.url
    }
    
    if (!downloadImages) {
      return {
        originalUrl: imageData.url,
        newUrl: cleanUrl,
        downloaded: false,
        altText: improveImageAltText(imageData.alt, imageData.title, postTitle),
        title: imageData.title || imageData.alt
      }
    }

    // If downloading is enabled, you could implement image download logic here
    // For now, we'll keep images as external links but clean up the URLs
    
    return {
      originalUrl: imageData.url,
      newUrl: cleanUrl,
      downloaded: false,
      altText: improveImageAltText(imageData.alt, imageData.title, postTitle),
      title: imageData.title || imageData.alt
    }
  } catch (error) {
    console.error(`Error processing image ${imageData.url}:`, error)
    return {
      originalUrl: imageData.url,
      newUrl: imageData.url,
      downloaded: false,
      altText: improveImageAltText(imageData.alt, imageData.title, postTitle),
      title: imageData.title || imageData.alt
    }
  }
}

// Helper function to update content with new image URLs and improved alt text
function updateContentWithNewImages(content: string, imageResults: ImageProcessResult[]): string {
  let updatedContent = content

  imageResults.forEach(result => {
    // Create regex to match the original img tag
    const escapedUrl = result.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const imgRegex = new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, 'gi')
    
    updatedContent = updatedContent.replace(imgRegex, (match) => {
      // Update the image tag with improved attributes
      let newImgTag = match
      
      // Update src if URL changed
      if (result.originalUrl !== result.newUrl) {
        newImgTag = newImgTag.replace(
          /src="[^"]*"/i,
          `src="${result.newUrl}"`
        )
      }
      
      // Add or update alt text
      if (result.altText) {
        if (/alt="[^"]*"/i.test(newImgTag)) {
          newImgTag = newImgTag.replace(/alt="[^"]*"/i, `alt="${result.altText}"`)
        } else {
          newImgTag = newImgTag.replace(/<img/i, `<img alt="${result.altText}"`)
        }
      }
      
      // Add or update title attribute
      if (result.title) {
        if (/title="[^"]*"/i.test(newImgTag)) {
          newImgTag = newImgTag.replace(/title="[^"]*"/i, `title="${result.title}"`)
        } else {
          newImgTag = newImgTag.replace(/<img/i, `<img title="${result.title}"`)
        }
      }
      
      // Add loading="lazy" for performance
      if (!/loading="/i.test(newImgTag)) {
        newImgTag = newImgTag.replace(/<img/i, '<img loading="lazy"')
      }
      
      return newImgTag
    })
  })

  return updatedContent
}

// POST /api/blogger-import - Import Blogger XML
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const downloadImages = formData.get('downloadImages') === 'true'
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.xml')) {
      return NextResponse.json(
        { error: "Please upload a valid XML file" },
        { status: 400 }
      )
    }

    const xmlContent = await file.text()
    
    // Parse XML
    const result = await parseStringPromise(xmlContent)
    
    // Extract posts from Blogger XML structure
    const entries = result.feed.entry || []
    const posts: BloggerPost[] = []
    
    for (const entry of entries) {
      // Skip non-post entries (comments, etc.)
      if (!entry.category?.some((cat: any) => 
        cat.$?.term === 'http://schemas.google.com/blogger/2008/kind#post'
      )) {
        continue
      }

      // Skip draft posts if needed
      const isDraft = entry.category?.some((cat: any) => 
        cat.$?.term === 'http://www.blogger.com/atom/ns#'
      )

      if (isDraft) continue

      const content = entry.content?.[0]._ || entry.content?.[0] || ''
      const title = entry.title[0]._ || entry.title[0] || 'Untitled'
      
      const post: BloggerPost = {
        id: entry.id[0].split('.post-')[1] || entry.id[0],
        title,
        content,
        published: entry.published[0],
        updated: entry.updated[0],
        author: {
          name: entry.author?.[0]?.name?.[0] || 'Admin',
          email: entry.author?.[0]?.email?.[0] || session.user.email || 'admin@example.com'
        }
      }

      // Extract images from content with alt text and titles
      const imageData = extractImagesFromContent(content)
      post.images = imageData.map(img => img.url)

      // Generate SEO metadata
      post.seoTitle = generateSEOTitle(title)
      post.metaDescription = generateMetaDescription(content)

      // Extract categories/labels
      const categories = entry.category
        ?.filter((cat: any) => cat.$?.scheme === 'http://www.blogger.com/atom/ns#')
        ?.map((cat: any) => cat.$?.term)
        .filter(Boolean) || []
      
      post.category = categories
      post.labels = categories

      posts.push(post)
    }

    // Import posts to database
    const importResults = {
      total: posts.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[],
      imagesProcessed: 0,
      imagesDownloaded: 0,
      seoOptimized: 0
    }

    for (const post of posts) {
      try {
        // Generate slug from title
        const slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 100) // Limit slug length

        // Check if post already exists
        const existingPost = await prisma.blog.findFirst({
          where: {
            OR: [
              { slug },
              { title: post.title }
            ]
          }
        })

        if (existingPost) {
          importResults.skipped++
          continue
        }

        // Process images with enhanced metadata
        let updatedContent = post.content
        const imageResults: ImageProcessResult[] = []

        if (post.images && post.images.length > 0) {
          const imageData = extractImagesFromContent(post.content)
          
          for (const imgData of imageData) {
            const result = await processImage(imgData, downloadImages, post.title)
            imageResults.push(result)
            importResults.imagesProcessed++
            if (result.downloaded) {
              importResults.imagesDownloaded++
            }
          }

          // Update content with new image URLs and improved attributes
          updatedContent = updateContentWithNewImages(post.content, imageResults)
        }

        // Determine category
        let category = 'latest' // default
        if (post.category && post.category.length > 0) {
          const firstLabel = post.category[0].toLowerCase()
          if (firstLabel.includes('hindi') || firstLabel.includes('हिंदी')) {
            category = 'hindi'
          } else if (firstLabel.includes('english')) {
            category = 'english'
          }
        }

        // Generate excerpt from content (without HTML tags)
        const excerpt = post.metaDescription || updatedContent
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .substring(0, 200) + '...'

        // Extract cover image (first image in content)
        let coverImage = null
        if (imageResults.length > 0) {
          coverImage = imageResults[0].newUrl
        }

        // Create blog post with SEO optimization
        await prisma.blog.create({
          data: {
            title: post.seoTitle || post.title,
            slug,
            content: updatedContent,
            excerpt,
            coverImage,
            category,
            status: 'published',
            publishedAt: new Date(post.published),
            createdAt: new Date(post.published),
            updatedAt: new Date(post.updated),
            authorId: session.user.id
          }
        })

        importResults.imported++
        importResults.seoOptimized++
      } catch (error) {
        console.error(`Error importing post "${post.title}":`, error)
        importResults.errors.push(`Failed to import: ${post.title}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      results: importResults
    })

  } catch (error) {
    console.error("Blogger import error:", error)
    return NextResponse.json(
      { 
        error: "Failed to import Blogger data", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// GET /api/blogger-import - Get import instructions
export async function GET() {
  return NextResponse.json({
    instructions: {
      step1: "Go to your Blogger dashboard",
      step2: "Navigate to Settings > Other",
      step3: "Click 'Back up Content'",
      step4: "Download the XML file",
      step5: "Upload the XML file using this API endpoint",
      supportedFormats: ["Blogger XML export"],
      maxFileSize: "50MB",
      endpoint: "/api/blogger-import",
      seoFeatures: {
        supported: true,
        features: [
          "SEO-optimized titles (60 char limit)",
          "Meta descriptions (160 char limit)",
          "Image alt text and title attributes",
          "Lazy loading for images",
          "Clean, semantic HTML"
        ]
      },
      imageHandling: {
        supported: true,
        options: [
          "Keep images as external links (recommended)",
          "Download images to server (coming soon)"
        ],
        note: "Images from Blogger will be optimized for better quality with proper alt text"
      }
    }
  })
} 