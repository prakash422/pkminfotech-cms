import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to fetch users
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Database test failed:", error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 