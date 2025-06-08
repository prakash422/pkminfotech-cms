import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { autoGenerateFullSEO, type BlogSEOData } from "@/lib/seo-utils"

// GET /api/blogs - List all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")
    const page = searchParams.get("page")

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (category) {
      where.category = category
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit ? parseInt(limit) : undefined,
      skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, category, status, authorId, focusKeyword, metaDescription } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    if (slug) {
      const existingBlog = await prisma.blog.findUnique({
        where: { slug }
      })
      
      if (existingBlog) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const finalCategory = category || "latest"

    // Auto-generate SEO data if not provided
    const seoData: BlogSEOData = {
      title,
      content,
      excerpt,
      category: finalCategory,
      focusKeyword,
      slug: finalSlug
    }

    const autoSEO = autoGenerateFullSEO(seoData)

    const blogData: any = {
      title,
      slug: finalSlug,
      content,
      excerpt,
      category: finalCategory,
      status: status || "draft",
      authorId: authorId || session.user.id,
      publishedAt: status === "published" ? new Date() : null,
      // Auto-generated SEO fields (use provided values if available, otherwise use auto-generated)
      focusKeyword: focusKeyword || autoSEO.focusKeyword,
      metaDescription: metaDescription || autoSEO.metaDescription
    }

    // Add optional fields if they exist
    if (coverImage) blogData.coverImage = coverImage

    const blog = await prisma.blog.create({
      data: blogData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    )
  }
} 