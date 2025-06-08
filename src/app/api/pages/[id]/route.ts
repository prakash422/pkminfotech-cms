import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// GET /api/pages/[id] - Get page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id: id },
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

// PUT /api/pages/[id] - Update page by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
      status,
      showInMenu,
      menuOrder,
      pageType
    } = body

    const { id } = await params
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: id }
    })

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check if slug already exists (excluding current page)
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const page = await prisma.page.update({
      where: { id: id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(keywords !== undefined && { keywords }),
        ...(status && { status }),
        ...(showInMenu !== undefined && { showInMenu }),
        ...(menuOrder !== undefined && { menuOrder }),
        ...(pageType && { pageType })
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

    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages/[id] - Delete page by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: id }
    })

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    await prisma.page.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 