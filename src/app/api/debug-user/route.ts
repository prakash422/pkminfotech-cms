import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Debug endpoint disabled in production" }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({
      status: "ok",
      userCount,
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    console.error("Debug user error:", error)
    return NextResponse.json(
      { error: "Failed to debug user", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}