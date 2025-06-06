import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get blog statistics
    const [totalBlogs, publishedBlogs] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({
        where: {
          status: "published"
        }
      })
    ])

    // Get ad statistics
    const [totalAds, activeAds] = await Promise.all([
      prisma.ad.count(),
      prisma.ad.count({
        where: {
          isActive: true
        }
      })
    ])

    const stats = {
      totalBlogs,
      publishedBlogs,
      totalAds,
      activeAds
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 