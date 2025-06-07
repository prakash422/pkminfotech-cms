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

      const post: BloggerPost = {
        id: entry.id[0].split('.post-')[1] || entry.id[0],
        title: entry.title[0]._ || entry.title[0] || 'Untitled',
        content: entry.content?.[0]._ || entry.content?.[0] || '',
        published: entry.published[0],
        updated: entry.updated[0],
        author: {
          name: entry.author?.[0]?.name?.[0] || 'Admin',
          email: entry.author?.[0]?.email?.[0] || session.user.email || 'admin@example.com'
        }
      }

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
      errors: [] as string[]
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

        // Generate excerpt from content
        const excerpt = post.content
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .substring(0, 200) + '...'

        // Create blog post
        await prisma.blog.create({
          data: {
            title: post.title,
            slug,
            content: post.content,
            excerpt,
            category,
            status: 'published',
            publishedAt: new Date(post.published),
            createdAt: new Date(post.published),
            updatedAt: new Date(post.updated),
            authorId: session.user.id
          }
        })

        importResults.imported++
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
      endpoint: "/api/blogger-import"
    }
  })
} 