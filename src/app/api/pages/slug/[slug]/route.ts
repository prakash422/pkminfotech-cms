import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/pages/slug/[slug] - Get page by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const page = await prisma.page.findUnique({
      where: { 
        slug: slug,
        status: 'published'
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

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 