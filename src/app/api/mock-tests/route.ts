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

type SectionInput = {
  name: string
  questions: string[]
}

type InlineQuestionInput = Record<string, unknown>

type MockTestDelegate = {
  findUnique: (args: Record<string, unknown>) => Promise<unknown>
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>
  upsert: (args: Record<string, unknown>) => Promise<unknown>
}

export async function GET(request: NextRequest) {
  try {
    const mockTestDelegate = (prisma as unknown as { mockTest?: MockTestDelegate }).mockTest
    if (!mockTestDelegate) {
      return NextResponse.json(
        {
          error:
            "MockTest model is not available in Prisma client. Run prisma generate and restart dev server.",
        },
        { status: 500 }
      )
    }

    const mockId = request.nextUrl.searchParams.get("mockId")

    if (mockId) {
      const mockTest = await mockTestDelegate.findUnique({
        where: { mockId },
        include: { exam: true },
      })
      if (!mockTest) {
        return NextResponse.json({ error: "Mock test not found" }, { status: 404 })
      }
      return NextResponse.json({ data: mockTest })
    }

    const mockTests = await mockTestDelegate.findMany({
      where: { isActive: true },
      include: { exam: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json({ data: mockTests })
  } catch (error) {
    console.error("mock-tests GET error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const mockTestDelegate = (prisma as unknown as { mockTest?: MockTestDelegate }).mockTest
    if (!mockTestDelegate) {
      return NextResponse.json(
        {
          error:
            "MockTest model is not available in Prisma client. Run prisma generate and restart dev server.",
        },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const mockId = readString(body.mockId)
    const examName = readString(body.exam)
    const totalQuestionsInput = Number(body.totalQuestions || 0)
    const totalMarks = Number(body.totalMarks || 0)
    const marksPerQuestion = Number(body.marksPerQuestion || 0)
    const negativeMarking = Number(body.negativeMarking || 0)
    const durationMinutes = Number(body.durationMinutes || 0)
    const sectionsRaw = Array.isArray(body.sections) ? body.sections : []
    const language = readString(body.language) || "en"

    if (!mockId || !examName) {
      return NextResponse.json({ error: "mockId and exam are required" }, { status: 400 })
    }

    if (sectionsRaw.length === 0) {
      return NextResponse.json({ error: "sections[] is required" }, { status: 400 })
    }

    const sections: SectionInput[] = []
    const inlineQuestionBlocks: Array<{ sectionName: string; question: InlineQuestionInput }> = []
    for (let index = 0; index < sectionsRaw.length; index += 1) {
      const item = sectionsRaw[index]
      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { error: `section at index ${index} must be an object` },
          { status: 400 }
        )
      }
      const section = item as Record<string, unknown>
      const name = readString(section.name)
      const rawQuestions = Array.isArray(section.questions) ? section.questions : []
      const questions: string[] = []

      rawQuestions.forEach((q) => {
        if (typeof q === "string" && q.trim()) {
          questions.push(q.trim())
          return
        }
        if (q && typeof q === "object") {
          inlineQuestionBlocks.push({
            sectionName: name || `Section ${index + 1}`,
            question: q as InlineQuestionInput,
          })
        }
      })

      if (!name || (questions.length === 0 && rawQuestions.length === 0)) {
        return NextResponse.json(
          { error: `section ${index + 1}: name and questions[] are required` },
          { status: 400 }
        )
      }

      sections.push({ name, questions })
    }

    const directQuestionIds = Array.from(new Set(sections.flatMap((section) => section.questions)))

    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    })
    const normalizedExamName = examName.trim().toLowerCase()
    const matchedExam = exams.find(
      (exam: { id: string; name: string }) =>
        exam.name.trim().toLowerCase() === normalizedExamName
    )
    const examId =
      matchedExam?.id ||
      (
        await prisma.exam.create({
          data: {
            name: examName,
            slug: await getUniqueExamSlug(examName),
            isActive: true,
          },
        })
      ).id

    const mockBankSet = await prisma.practiceSet.upsert({
      where: { slug: `mock-${slugify(mockId)}-bank` },
      update: {
        title: `${mockId} Question Bank`,
        examId,
        language,
      },
      create: {
        title: `${mockId} Question Bank`,
        slug: `mock-${slugify(mockId)}-bank`,
        examId,
        language,
        totalQuestions: Math.max(totalQuestionsInput || 0, directQuestionIds.length + inlineQuestionBlocks.length, 1),
        difficulty: "mixed",
      },
    })

    const normalizeInlineQuestion = (question: InlineQuestionInput) => {
      const questionObj =
        question.question && typeof question.question === "object"
          ? (question.question as Record<string, unknown>)
          : null
      const explanationObj =
        question.explanation && typeof question.explanation === "object"
          ? (question.explanation as Record<string, unknown>)
          : null

      const optionsArray = Array.isArray(question.options) ? question.options : []
      const optionObjects = optionsArray.filter(
        (item) => item && typeof item === "object"
      ) as Array<Record<string, unknown>>
      const optionStrings = optionsArray.filter((item) => typeof item === "string").map(String)

      const pickOptionObject = (id: "A" | "B" | "C" | "D") =>
        optionObjects.find((item) => String(readString(item.id) || "").toUpperCase() === id) ||
        optionObjects["ABCD".indexOf(id)]

      const optionAObj = pickOptionObject("A")
      const optionBObj = pickOptionObject("B")
      const optionCObj = pickOptionObject("C")
      const optionDObj = pickOptionObject("D")

      const optionA = readString(question.optionA) || readString(optionAObj?.en) || optionStrings[0] || ""
      const optionB = readString(question.optionB) || readString(optionBObj?.en) || optionStrings[1] || ""
      const optionC = readString(question.optionC) || readString(optionCObj?.en) || optionStrings[2] || ""
      const optionD = readString(question.optionD) || readString(optionDObj?.en) || optionStrings[3] || ""

      const correctRaw =
        readString(question.correctOption) || readString(question.correctAnswer) || ""
      let correctAnswer = correctRaw.toUpperCase()
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        const compareList = [optionA, optionB, optionC, optionD].map((item) =>
          String(item).trim().toLowerCase()
        )
        const idx = compareList.findIndex((item) => item === correctRaw.trim().toLowerCase())
        if (idx >= 0) correctAnswer = ["A", "B", "C", "D"][idx]
      }

      const questionText = readString(question.questionText) || readString(questionObj?.en) || ""
      const questionTextHi = readString(question.questionTextHi) || readString(questionObj?.hi)
      const questionLanguage = readString(question.language) || (questionTextHi ? "bilingual" : language)

      if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        throw new Error("English question and options A-D are required")
      }
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        throw new Error("correctOption/correctAnswer must be A, B, C, or D")
      }

      return {
        questionText,
        questionTextHi,
        optionA,
        optionAHi: readString(question.optionAHi) || readString(optionAObj?.hi),
        optionB,
        optionBHi: readString(question.optionBHi) || readString(optionBObj?.hi),
        optionC,
        optionCHi: readString(question.optionCHi) || readString(optionCObj?.hi),
        optionD,
        optionDHi: readString(question.optionDHi) || readString(optionDObj?.hi),
        correctAnswer,
        explanation: readString(question.explanation) || readString(explanationObj?.en),
        explanationHi: readString(question.explanationHi) || readString(explanationObj?.hi),
        difficulty: readString(question.difficulty) || "medium",
        language: questionLanguage,
      }
    }

    const createdInlineIds: string[] = []
    for (let index = 0; index < inlineQuestionBlocks.length; index += 1) {
      const block = inlineQuestionBlocks[index]
      try {
        const normalized = normalizeInlineQuestion(block.question)
        const created = await prisma.question.create({
          data: {
            ...normalized,
            examId,
            practiceSetId: mockBankSet.id,
            isActive: true,
          },
        })
        createdInlineIds.push(created.id)
      } catch (error) {
        return NextResponse.json(
          {
            error: `section "${block.sectionName}" question ${index + 1}: ${
              error instanceof Error ? error.message : "invalid question format"
            }`,
          },
          { status: 400 }
        )
      }
    }

    const questionIds = Array.from(new Set([...directQuestionIds, ...createdInlineIds]))
    const existingQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true },
    })

    const existingQuestionIds = new Set(existingQuestions.map((question: { id: string }) => question.id))
    const missingQuestionIds = questionIds.filter((id) => !existingQuestionIds.has(id))
    if (missingQuestionIds.length > 0) {
      return NextResponse.json(
        { error: `Invalid question IDs: ${missingQuestionIds.slice(0, 5).join(", ")}` },
        { status: 400 }
      )
    }

    // Replace inline objects in sections with generated question IDs.
    let inlineCursor = 0
    const normalizedSections: SectionInput[] = sections.map((section) => {
      const original = sectionsRaw.find(
        (item) => !!item && typeof item === "object" && readString((item as Record<string, unknown>).name) === section.name
      ) as Record<string, unknown> | undefined
      const rawQuestions = Array.isArray(original?.questions) ? original?.questions : []
      const mappedQuestions = rawQuestions
        .map((entry) => {
          if (typeof entry === "string" && entry.trim()) return entry.trim()
          if (entry && typeof entry === "object") {
            const id = createdInlineIds[inlineCursor]
            inlineCursor += 1
            return id
          }
          return null
        })
        .filter(Boolean) as string[]
      return { name: section.name, questions: mappedQuestions }
    })

    const resolvedTotalQuestions = totalQuestionsInput > 0 ? totalQuestionsInput : questionIds.length
    const resolvedDuration = durationMinutes > 0 ? durationMinutes : Math.max(resolvedTotalQuestions, 10)
    const resolvedTotalMarks =
      totalMarks > 0 ? totalMarks : marksPerQuestion > 0 ? resolvedTotalQuestions * marksPerQuestion : resolvedTotalQuestions * 2

    const saved = await mockTestDelegate.upsert({
      where: { mockId },
      update: {
        title: readString(body.title) || mockId,
        totalQuestions: resolvedTotalQuestions,
        totalMarks: resolvedTotalMarks,
        negativeMarking,
        durationMinutes: resolvedDuration,
        language,
        sections: normalizedSections as unknown as object,
        questionIds,
        isActive: body.isActive ?? true,
        examId,
      },
      create: {
        mockId,
        title: readString(body.title) || mockId,
        totalQuestions: resolvedTotalQuestions,
        totalMarks: resolvedTotalMarks,
        negativeMarking,
        durationMinutes: resolvedDuration,
        language,
        sections: normalizedSections as unknown as object,
        questionIds,
        isActive: body.isActive ?? true,
        examId,
      },
    })

    return NextResponse.json({ data: saved }, { status: 201 })
  } catch (error) {
    console.error("mock-tests POST error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
