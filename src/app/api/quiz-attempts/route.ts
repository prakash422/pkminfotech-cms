import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** GET /api/quiz-attempts — current user's quiz attempts, newest first */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizAttemptModel = (prisma as { quizAttempt?: { findMany: (args: object) => Promise<unknown[]> } }).quizAttempt
    if (!quizAttemptModel) {
      return NextResponse.json(
        { error: "QuizAttempt model not available. Run: npx prisma generate, then restart dev server." },
        { status: 503 }
      )
    }

    const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "50", 10) || 50, 100)
    const attempts = await quizAttemptModel.findMany({
      where: { userId },
      orderBy: { attemptedAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ data: attempts })
  } catch (error) {
    console.error("quiz-attempts GET error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/** POST /api/quiz-attempts — record one quiz attempt for current user */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const quizId = typeof body.quizId === "string" ? body.quizId.trim() : null
    const quizTitle = typeof body.quizTitle === "string" ? body.quizTitle.trim() : null
    const quizType =
      typeof body.quizType === "string" && ["daily-quiz", "current-affairs", "mock-test"].includes(body.quizType)
        ? body.quizType
        : "daily-quiz"
    const score = Number(body.score)
    const totalMarks = Number(body.totalMarks)
    const correctCount = Number(body.correctCount)
    const totalQuestions = Number(body.totalQuestions)

    if (!quizId || Number.isNaN(score) || Number.isNaN(totalMarks) || Number.isNaN(correctCount) || Number.isNaN(totalQuestions)) {
      return NextResponse.json(
        { error: "quizId, score, totalMarks, correctCount, totalQuestions required" },
        { status: 400 }
      )
    }

    const quizAttemptModel = (prisma as { quizAttempt?: { create: (args: object) => Promise<unknown> } }).quizAttempt
    if (!quizAttemptModel) {
      return NextResponse.json(
        { error: "QuizAttempt model not available. Run: npx prisma generate, then restart dev server." },
        { status: 503 }
      )
    }

    const attempt = await quizAttemptModel.create({
      data: {
        userId,
        quizId,
        quizTitle: quizTitle || quizId,
        quizType,
        score,
        totalMarks,
        correctCount,
        totalQuestions,
      },
    })

    return NextResponse.json({ data: attempt }, { status: 201 })
  } catch (error) {
    console.error("quiz-attempts POST error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
