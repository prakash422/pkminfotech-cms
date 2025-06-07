import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/blogs/bulk-delete - Delete multiple blogs
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
    const { blogIds } = body

    // Validate input
    if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
      return NextResponse.json(
        { error: "No blog IDs provided" },
        { status: 400 }
      )
    }

    // Validate all blog IDs are strings
    if (!blogIds.every(id => typeof id === 'string' && id.trim().length > 0)) {
      return NextResponse.json(
        { error: "Invalid blog IDs provided" },
        { status: 400 }
      )
    }

    // Get blogs to verify they exist and get titles for logging
    const blogsToDelete = await prisma.blog.findMany({
      where: {
        id: { in: blogIds }
      },
      select: {
        id: true,
        title: true,
        authorId: true
      }
    })

    if (blogsToDelete.length === 0) {
      return NextResponse.json(
        { error: "No blogs found to delete" },
        { status: 404 }
      )
    }

    // Optional: Check if user has permission to delete these blogs
    // For now, we'll allow any authenticated user to delete any blog
    // You might want to add author check: blogsToDelete.every(blog => blog.authorId === session.user.id)

    // Perform bulk delete
    const deleteResult = await prisma.blog.deleteMany({
      where: {
        id: { in: blogIds }
      }
    })

    // Log the deletion for audit purposes
    console.log(`User ${session.user.email} deleted ${deleteResult.count} blogs:`, 
      blogsToDelete.map(blog => ({ id: blog.id, title: blog.title }))
    )

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.count} blog(s)`,
      deletedCount: deleteResult.count,
      deletedBlogs: blogsToDelete.map(blog => ({
        id: blog.id,
        title: blog.title
      }))
    })

  } catch (error) {
    console.error("Bulk delete error:", error)
    return NextResponse.json(
      { 
        error: "Failed to delete blogs", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 