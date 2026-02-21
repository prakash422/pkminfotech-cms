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

const readString = (value: unknown): string | null => {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const getUniqueExamSlug = async (value: string) => {
  const base = slugify(value) || "exam"
  let candidate = base
  let suffix = 2
  while (true) {
    const exists = await prisma.exam.findFirst({
      where: { slug: candidate },
      select: { id: true },
    })
    if (!exists) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

type SectionInput = { name: string; questions: string[] }
type InlineQuestionInput = Record<string, unknown>

type DailyQuizDelegate = {
  findUnique: (args: Record<string, unknown>) => Promise<unknown>
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>
  upsert: (args: Record<string, unknown>) => Promise<unknown>
}

export async function GET(request: NextRequest) {
  try {
    const dailyQuizDelegate = (prisma as unknown as { dailyQuiz?: DailyQuizDelegate }).dailyQuiz
    if (!dailyQuizDelegate) {
      return NextResponse.json(
        {
          error:
            "DailyQuiz model is not available in Prisma client. Run prisma generate and restart dev server.",
        },
        { status: 500 }
      )
    }

    const quizId = request.nextUrl.searchParams.get("quizId")
    const withQuestions = request.nextUrl.searchParams.get("withQuestions") === "1"

    if (quizId) {
      const quiz = await dailyQuizDelegate.findUnique({
        where: { quizId },
        include: { exam: true },
      })
      if (!quiz) return NextResponse.json({ error: "Daily quiz not found" }, { status: 404 })

      if (withQuestions) {
        const typedQuiz = quiz as {
          questionIds?: string[]
        }
        const questionIds = typedQuiz.questionIds || []
        const dbQuestions = await prisma.question.findMany({
          where: {
            id: { in: questionIds },
            isActive: true,
          },
        })
        const questionMap = new Map(dbQuestions.map((item:any) => [item.id, item]))
        const orderedQuestions = questionIds
          .map((id) => questionMap.get(id))
          .filter(Boolean)

        return NextResponse.json({
          data: {
            ...quiz,
            orderedQuestions,
          },
        })
      }

      return NextResponse.json({ data: quiz })
    }

    const quizzes = await dailyQuizDelegate.findMany({
      where: { isActive: true },
      include: { exam: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json({ data: quizzes })
  } catch (error) {
    console.error("daily-quiz GET error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dailyQuizDelegate = (prisma as unknown as { dailyQuiz?: DailyQuizDelegate }).dailyQuiz
    if (!dailyQuizDelegate) {
      return NextResponse.json(
        {
          error:
            "DailyQuiz model is not available in Prisma client. Run prisma generate and restart dev server.",
        },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const quizId = readString(body.quizId)
    const examName = readString(body.exam) || "Daily Quiz"
    const language = readString(body.language) || "en"
    const totalQuestionsInput = Number(body.totalQuestions || 0)
    const totalMarks = Number(body.totalMarks || 0)
    const marksPerQuestion = Number(body.marksPerQuestion || 0)
    const negativeMarking = Number(body.negativeMarking || 0)
    const durationMinutes = Number(body.durationMinutes || 0)

    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 })
    }

    const sectionsRaw = Array.isArray(body.sections) ? body.sections : []
    const sections: SectionInput[] = []
    const inlineQuestionsRaw = Array.isArray(body.questions) ? body.questions : []
    for (let index = 0; index < sectionsRaw.length; index += 1) {
      const item = sectionsRaw[index]
      if (!item || typeof item !== "object") {
        return NextResponse.json({ error: `section at index ${index} must be an object` }, { status: 400 })
      }
      const section = item as Record<string, unknown>
      const name = readString(section.name)
      const questions = Array.isArray(section.questions)
        ? section.questions.filter((q) => typeof q === "string").map((q) => String(q).trim())
        : []
      if (!name || questions.length === 0) {
        return NextResponse.json(
          { error: `section ${index + 1}: name and questions[] are required` },
          { status: 400 }
        )
      }
      sections.push({ name, questions })
    }

    const directQuestionIds = Array.isArray(body.questionIds)
      ? body.questionIds.filter((q) => typeof q === "string").map((q) => String(q).trim())
      : []

    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    })
    const normalized = examName.toLowerCase().trim()
    const matched = exams.find(
      (exam: { id: string; name: string }) => exam.name.toLowerCase().trim() === normalized
    )
    const examId =
      matched?.id ||
      (
        await prisma.exam.create({
          data: {
            name: examName,
            slug: await getUniqueExamSlug(examName),
            isActive: true,
          },
        })
      ).id

    const quizBankSet = await prisma.practiceSet.upsert({
      where: { slug: `daily-quiz-${slugify(quizId)}-bank` },
      update: {
        title: `${quizId} Question Bank`,
        examId,
        language,
      },
      create: {
        title: `${quizId} Question Bank`,
        slug: `daily-quiz-${slugify(quizId)}-bank`,
        examId,
        language,
        totalQuestions: Math.max(totalQuestionsInput || 0, 5),
        difficulty: "mixed",
      },
    })

    const normalizeInlineQuestion = (item: InlineQuestionInput) => {
      const questionObj =
        item.question && typeof item.question === "object"
          ? (item.question as Record<string, unknown>)
          : null
      const explanationObj =
        item.explanation && typeof item.explanation === "object"
          ? (item.explanation as Record<string, unknown>)
          : null
      const options = Array.isArray(item.options) ? item.options : []
      const optionObjects = options.filter((entry) => entry && typeof entry === "object") as Array<
        Record<string, unknown>
      >

      const pick = (id: "A" | "B" | "C" | "D") =>
        optionObjects.find((entry) => String(readString(entry.id) || "").toUpperCase() === id) ||
        optionObjects["ABCD".indexOf(id)]

      const optionAObj = pick("A")
      const optionBObj = pick("B")
      const optionCObj = pick("C")
      const optionDObj = pick("D")
      const optionA = readString(optionAObj?.en) || readString(item.optionA) || ""
      const optionB = readString(optionBObj?.en) || readString(item.optionB) || ""
      const optionC = readString(optionCObj?.en) || readString(item.optionC) || ""
      const optionD = readString(optionDObj?.en) || readString(item.optionD) || ""

      const correctRaw = readString(item.correctOption) || readString(item.correctAnswer) || ""
      let correctAnswer = correctRaw.toUpperCase()
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        const compare = [optionA, optionB, optionC, optionD].map((entry) => entry.toLowerCase().trim())
        const idx = compare.findIndex((entry) => entry === correctRaw.toLowerCase().trim())
        if (idx >= 0) correctAnswer = ["A", "B", "C", "D"][idx]
      }

      const questionText = readString(questionObj?.en) || readString(item.questionText) || ""
      const questionTextHi = readString(questionObj?.hi) || readString(item.questionTextHi)
      const rowLanguage = readString(item.language) || (questionTextHi ? "bilingual" : language)

      if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        throw new Error("question.en and options A-D are required")
      }
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        throw new Error("correctOption must be A, B, C, or D")
      }

      return {
        category: readString(item.category) || "General",
        payload: {
          questionText,
          questionTextHi,
          optionA,
          optionAHi: readString(optionAObj?.hi) || readString(item.optionAHi),
          optionB,
          optionBHi: readString(optionBObj?.hi) || readString(item.optionBHi),
          optionC,
          optionCHi: readString(optionCObj?.hi) || readString(item.optionCHi),
          optionD,
          optionDHi: readString(optionDObj?.hi) || readString(item.optionDHi),
          correctAnswer,
          explanation: readString(item.explanation) || readString(explanationObj?.en),
          explanationHi: readString(item.explanationHi) || readString(explanationObj?.hi),
          difficulty: readString(item.difficulty) || "medium",
          language: rowLanguage,
          examId,
          practiceSetId: quizBankSet.id,
          isActive: true,
        },
      }
    }

    const inlineCreatedIds: string[] = []
    const inlineSectionsMap = new Map<string, string[]>()
    for (let index = 0; index < inlineQuestionsRaw.length; index += 1) {
      const item = inlineQuestionsRaw[index]
      if (!item || typeof item !== "object") {
        return NextResponse.json({ error: `question at index ${index} must be an object` }, { status: 400 })
      }
      try {
        const normalizedInline = normalizeInlineQuestion(item as InlineQuestionInput)
        const created = await prisma.question.create({ data: normalizedInline.payload })
        inlineCreatedIds.push(created.id)
        const list = inlineSectionsMap.get(normalizedInline.category) || []
        list.push(created.id)
        inlineSectionsMap.set(normalizedInline.category, list)
      } catch (error) {
        return NextResponse.json(
          { error: `question ${index + 1}: ${error instanceof Error ? error.message : "Invalid format"}` },
          { status: 400 }
        )
      }
    }

    const sectionQuestionIds = sections.flatMap((section) => section.questions)
    const questionIds = Array.from(new Set([...directQuestionIds, ...sectionQuestionIds, ...inlineCreatedIds]))

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "questionIds[] or sections[].questions[] or questions[] is required" },
        { status: 400 }
      )
    }

    const existingQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true },
    })
    const existingSet = new Set(existingQuestions.map((q: { id: string }) => q.id))
    const missing = questionIds.filter((id) => !existingSet.has(id))
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Invalid question IDs: ${missing.slice(0, 5).join(", ")}` },
        { status: 400 }
      )
    }

    const autoSectionsFromInline: SectionInput[] = Array.from(inlineSectionsMap.entries()).map(
      ([name, questions]) => ({ name, questions })
    )
    const normalizedSections = [...sections, ...autoSectionsFromInline]

    const resolvedTotalQuestions = totalQuestionsInput > 0 ? totalQuestionsInput : questionIds.length
    const resolvedDuration = durationMinutes > 0 ? durationMinutes : Math.max(resolvedTotalQuestions, 10)
    const resolvedTotalMarks =
      totalMarks > 0
        ? totalMarks
        : marksPerQuestion > 0
          ? resolvedTotalQuestions * marksPerQuestion
          : resolvedTotalQuestions * 2

    const saved = await dailyQuizDelegate.upsert({
      where: { quizId },
      update: {
        title: readString(body.title) || quizId,
        totalQuestions: resolvedTotalQuestions,
        totalMarks: resolvedTotalMarks,
        negativeMarking,
        durationMinutes: resolvedDuration,
        language,
        sections: normalizedSections.length ? (normalizedSections as unknown as object) : null,
        questionIds,
        quizDate: readString(body.quizDate) || readString(body.date) ? new Date(String(readString(body.quizDate) || readString(body.date))) : null,
        isActive: body.isActive ?? true,
        examId,
      },
      create: {
        quizId,
        title: readString(body.title) || quizId,
        totalQuestions: resolvedTotalQuestions,
        totalMarks: resolvedTotalMarks,
        negativeMarking,
        durationMinutes: resolvedDuration,
        language,
        sections: normalizedSections.length ? (normalizedSections as unknown as object) : null,
        questionIds,
        quizDate: readString(body.quizDate) || readString(body.date) ? new Date(String(readString(body.quizDate) || readString(body.date))) : null,
        isActive: body.isActive ?? true,
        examId,
      },
    })

    return NextResponse.json({ data: saved }, { status: 201 })
  } catch (error) {
    console.error("daily-quiz POST error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
