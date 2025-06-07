import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: "pkminfotech048@gmail.com"
      }
    })

    if (!user) {
      return NextResponse.json({ 
        error: "User not found",
        email: "pkminfotech048@gmail.com"
      })
    }

    // Test password
    const testPassword = "Pass@123"
    const isPasswordValid = await bcrypt.compare(testPassword, user.password)

    return NextResponse.json({
      userExists: true,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      passwordHashLength: user.password.length,
      testPasswordResult: isPasswordValid,
      testPassword: testPassword
    })
  } catch (error) {
    console.error("Debug user error:", error)
    return NextResponse.json(
      { error: "Failed to debug user", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 