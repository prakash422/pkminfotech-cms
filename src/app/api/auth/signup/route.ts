import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name: typeof name === "string" ? name.trim() || null : null,
        email: trimmedEmail,
        password: hashedPassword,
        role: "user",
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Signup error:", e)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
