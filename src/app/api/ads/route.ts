import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/ads - List all ads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("active")
    const limit = searchParams.get("limit")
    const page = searchParams.get("page")

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    // Additional filter for active ads within date range
    if (isActive === "true") {
      const now = new Date()
      where.OR = [
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } }
          ]
        },
        {
          AND: [
            { startDate: null },
            { endDate: null }
          ]
        },
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: null }
          ]
        },
        {
          AND: [
            { startDate: null },
            { endDate: { gte: now } }
          ]
        }
      ]
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: limit ? parseInt(limit) : undefined,
      skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json(
      { error: "Failed to fetch ads" },
      { status: 500 }
    )
  }
}

// POST /api/ads - Create new ad
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
    const { title, description, imageUrl, ctaText, ctaLink, startDate, endDate, isActive } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        imageUrl,
        ctaText,
        ctaLink,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    )
  }
} 