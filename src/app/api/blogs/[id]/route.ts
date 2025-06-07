import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/blogs/[id] - Get single blog
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: params.id
      },
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

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - Update blog
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, category, status, focusKeyword, metaDescription } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Check if slug already exists (excluding current blog)
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findFirst({
        where: {
          slug,
          id: { not: params.id }
        }
      })
      
      if (slugExists) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      content,
      excerpt,
      category: category || existingBlog.category,
      status: status || existingBlog.status,
      publishedAt: status === "published" && existingBlog.status !== "published" 
        ? new Date() 
        : status === "draft" 
          ? null 
          : existingBlog.publishedAt
    }

    // Add optional fields if they exist
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (focusKeyword !== undefined) updateData.focusKeyword = focusKeyword
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription

    const blog = await prisma.blog.update({
      where: {
        id: params.id
      },
      data: updateData,
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

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// PATCH /api/blogs/[id] - Partial update (e.g., status change)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Get existing blog
    const existingBlog = await prisma.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    const updateData: any = { ...body }
    
    // Handle status change
    if (body.status === "published" && existingBlog.status !== "published") {
      updateData.publishedAt = new Date()
    } else if (body.status === "draft") {
      updateData.publishedAt = null
    }

    const blog = await prisma.blog.update({
      where: {
        id: params.id
      },
      data: updateData,
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

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - Delete blog
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const blog = await prisma.blog.findUnique({
      where: { id: params.id }
    })

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    await prisma.blog.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    )
  }
} 