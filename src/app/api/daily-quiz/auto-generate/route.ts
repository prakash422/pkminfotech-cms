import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

function shuffle<T>(array: T[]): T[] {
  const out = [...array]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function getTodayQuizId(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `daily-quiz-${y}-${m}-${d}`
}

function getTodayTitle(): string {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
  return `Daily Quiz - ${now.toLocaleDateString("en-IN", options)}`
}

/** Allow cron (secret) or admin session */
async function isAllowed(request: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (session?.user?.email) return true
  const secret = process.env.CRON_SECRET || process.env.DAILY_QUIZ_AUTO_SECRET
  if (!secret) return false
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ") && authHeader.slice(7) === secret) return true
  const q: string | null = request.nextUrl.searchParams.get("secret")
  if (q === secret) return true
  return false
}

/**
 * GET /api/daily-quiz/auto-generate
 * Generates today's daily quiz: 10 random questions from DB, upserts quiz for current date.
 * Auth: admin session OR CRON_SECRET / DAILY_QUIZ_AUTO_SECRET (query ?secret= or Authorization: Bearer)
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await isAllowed(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dailyQuizDelegate = (prisma as unknown as { dailyQuiz?: { upsert: (args: object) => Promise<unknown> } })
      .dailyQuiz
    if (!dailyQuizDelegate) {
      return NextResponse.json(
        { error: "DailyQuiz model not available. Run prisma generate." },
        { status: 500 }
      )
    }

    const quizId = getTodayQuizId()
    const existing = await prisma.dailyQuiz.findUnique({
      where: { quizId },
      select: { quizId: true, totalQuestions: true, title: true },
    })
    if (existing) {
      return NextResponse.json({
        data: {
          quizId: existing.quizId,
          title: existing.title,
          totalQuestions: existing.totalQuestions,
          message: "Today's quiz already exists. No change made.",
        },
      })
    }

    const countParam = request.nextUrl.searchParams.get("count")
    const wantCount = Math.min(Math.max(parseInt(countParam || "10", 10) || 10, 1), 50)

    const all = await prisma.question.findMany({
      where: { isActive: true },
      select: { id: true },
    })
    const allIds = all.map((q: { id: string }) => q.id)
    if (allIds.length === 0) {
      return NextResponse.json(
        { error: "No active questions in DB. Add questions first (Question Practice / Daily Quiz import)." },
        { status: 400 }
      )
    }

    const shuffled = shuffle(allIds)
    const questionIds = shuffled.slice(0, Math.min(wantCount, shuffled.length))
    const totalQuestions = questionIds.length

    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    })
    const dailyExam = exams.find((e: { id: string; name: string }) => e.name.toLowerCase().trim() === "daily quiz")
    const examId =
      dailyExam?.id ||
      (
        await prisma.exam.create({
          data: {
            name: "Daily Quiz",
            slug: await (async () => {
              let candidate = "daily-quiz"
              let suffix = 2
              while (true) {
                const exists = await prisma.exam.findFirst({
                  where: { slug: candidate },
                  select: { id: true },
                })
                if (!exists) return candidate
                candidate = `daily-quiz-${suffix}`
                suffix += 1
              }
            })(),
            isActive: true,
          },
        })
      ).id

    const title = getTodayTitle()
    const totalMarks = totalQuestions * 2
    const negativeMarking = 0.5
    const durationMinutes = Math.max(totalQuestions, 10)
    const quizDate = new Date()
    quizDate.setHours(0, 0, 0, 0)

    await dailyQuizDelegate.upsert({
      where: { quizId },
      update: {
        title,
        totalQuestions,
        totalMarks,
        negativeMarking,
        durationMinutes,
        language: "en",
        sections: [{ name: "General", questions: questionIds }],
        questionIds,
        quizDate,
        isActive: true,
        examId,
      },
      create: {
        quizId,
        title,
        totalQuestions,
        totalMarks,
        negativeMarking,
        durationMinutes,
        language: "en",
        sections: [{ name: "General", questions: questionIds }],
        questionIds,
        quizDate,
        isActive: true,
        examId,
      },
    })

    return NextResponse.json({
      data: {
        quizId,
        title,
        totalQuestions,
        message: `Today's daily quiz created: ${totalQuestions} questions (random from ${allIds.length} in DB).`,
      },
    })
  } catch (error) {
    console.error("daily-quiz auto-generate error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
