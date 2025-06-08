import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Simple test - just count users
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true,
      message: "Database connected successfully",
      userCount: userCount,
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 