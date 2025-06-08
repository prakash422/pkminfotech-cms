import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// GET /api/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const pageType = searchParams.get('pageType')
    const showInMenu = searchParams.get('showInMenu')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    if (pageType) {
      where.pageType = pageType
    }
    if (showInMenu !== null) {
      where.showInMenu = showInMenu === 'true'
    }

    const pages = await prisma.page.findMany({
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
      orderBy: [
        { menuOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      keywords,
      status = 'published',
      showInMenu = true,
      menuOrder = 0,
      pageType = 'static'
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        keywords,
        status,
        showInMenu,
        menuOrder,
        pageType,
        authorId: user.id
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

    return NextResponse.json({ page }, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 