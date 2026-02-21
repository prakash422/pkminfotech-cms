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

const getSafeBaseSlug = (value: string, fallback = "item") => {
  const normalized = slugify(value)
  return normalized || fallback
}

const getUniqueSlug = async (
  model: "state" | "exam" | "subject" | "topic" | "practiceSet",
  value: string,
  fallback = "item"
) => {
  const base = getSafeBaseSlug(value, fallback)
  let candidate = base
  let suffix = 2

  while (true) {
    let exists = false
    if (model === "state") {
      exists = Boolean(await prisma.state.findFirst({ where: { slug: candidate }, select: { id: true } }))
    } else if (model === "exam") {
      exists = Boolean(await prisma.exam.findFirst({ where: { slug: candidate }, select: { id: true } }))
    } else if (model === "subject") {
      exists = Boolean(await prisma.subject.findFirst({ where: { slug: candidate }, select: { id: true } }))
    } else if (model === "topic") {
      exists = Boolean(await prisma.topic.findFirst({ where: { slug: candidate }, select: { id: true } }))
    } else {
      exists = Boolean(
        await prisma.practiceSet.findFirst({ where: { slug: candidate }, select: { id: true } })
      )
    }

    if (!exists) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type")
    const practiceSetId = request.nextUrl.searchParams.get("practiceSetId")

    if (!type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 })
    }

    switch (type) {
      case "states": {
        const states = await prisma.state.findMany({ orderBy: { name: "asc" } })
        return NextResponse.json({ data: states })
      }
      case "exams": {
        const exams = await prisma.exam.findMany({
          include: { state: true },
          orderBy: { name: "asc" },
        })
        return NextResponse.json({ data: exams })
      }
      case "subjects": {
        const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } })
        return NextResponse.json({ data: subjects })
      }
      case "topics": {
        const topics = await prisma.topic.findMany({
          include: { subject: true },
          orderBy: { name: "asc" },
        })
        return NextResponse.json({ data: topics })
      }
      case "sets": {
        const sets = await prisma.practiceSet.findMany({
          include: {
            state: true,
            exam: true,
            subject: true,
            topic: true,
            _count: { select: { questions: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        return NextResponse.json({ data: sets })
      }
      case "questions": {
        const where = practiceSetId ? { practiceSetId } : {}
        const questions = await prisma.question.findMany({
          where,
          include: {
            exam: true,
            practiceSet: true,
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        })
        return NextResponse.json({ data: questions })
      }
      default:
        return NextResponse.json({ error: "invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("question-practice GET error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as { type?: unknown; data?: unknown }
    const type = readString(body.type)
    const data = (body.data ?? {}) as Record<string, unknown>

    if (!type || !data) {
      return NextResponse.json({ error: "type and data are required" }, { status: 400 })
    }

    const buildQuestionPayload = (
      input: Record<string, unknown>,
      fallbackExamId?: string,
      fallbackPracticeSetId?: string
    ) => {
      const questionText = readString(input.questionText)
      const questionTextHi = readString(input.questionTextHi)
      const optionA = readString(input.optionA)
      const optionAHi = readString(input.optionAHi)
      const optionB = readString(input.optionB)
      const optionBHi = readString(input.optionBHi)
      const optionC = readString(input.optionC)
      const optionCHi = readString(input.optionCHi)
      const optionD = readString(input.optionD)
      const optionDHi = readString(input.optionDHi)
      const examId = readString(input.examId) || fallbackExamId || null
      const practiceSetId = readString(input.practiceSetId) || fallbackPracticeSetId || null
      const questionLanguage = readString(input.language) || "en"
      const answer = String(readString(input.correctAnswer) || "").toUpperCase()

      const isEnglishValid = Boolean(questionText && optionA && optionB && optionC && optionD)
      const isHindiValid = Boolean(questionTextHi && optionAHi && optionBHi && optionCHi && optionDHi)

      if (!["en", "hi", "bilingual"].includes(questionLanguage)) {
        throw new Error("language must be en, hi, or bilingual")
      }

      if (!examId || !practiceSetId) {
        throw new Error("Exam and set are required")
      }

      if (questionLanguage === "en" && !isEnglishValid) {
        throw new Error("English question and options A-D are required for English mode")
      }

      if (questionLanguage === "hi" && !isHindiValid) {
        throw new Error("Hindi question and options A-D are required for Hindi mode")
      }

      if (questionLanguage === "bilingual" && (!isEnglishValid || !isHindiValid)) {
        throw new Error("Both English and Hindi question/options are required for bilingual mode")
      }

      if (!["A", "B", "C", "D"].includes(answer)) {
        throw new Error("correctAnswer must be A, B, C, or D")
      }

      return {
        questionText: questionText || questionTextHi || "",
        questionTextHi,
        optionA: optionA || optionAHi || "",
        optionAHi,
        optionB: optionB || optionBHi || "",
        optionBHi,
        optionC: optionC || optionCHi || "",
        optionCHi,
        optionD: optionD || optionDHi || "",
        optionDHi,
        correctAnswer: answer,
        explanation: readString(input.explanation),
        explanationHi: readString(input.explanationHi),
        difficulty: readString(input.difficulty) || "medium",
        language: questionLanguage,
        year: input.year ? Number(input.year) : null,
        stateId: readString(input.stateId),
        examId,
        subjectId: readString(input.subjectId),
        topicId: readString(input.topicId),
        practiceSetId,
        isActive: input.isActive ?? true,
      }
    }

    switch (type) {
      case "state": {
        const name = readString(data.name)
        if (!name) {
          return NextResponse.json({ error: "State name is required" }, { status: 400 })
        }

        const state = await prisma.state.create({
          data: {
            name,
            slug: await getUniqueSlug("state", readString(data.slug) || name, "state"),
            code: readString(data.code),
            isActive: data.isActive ?? true,
          },
        })
        return NextResponse.json({ data: state }, { status: 201 })
      }
      case "exam": {
        const name = readString(data.name)
        if (!name) {
          return NextResponse.json({ error: "Exam name is required" }, { status: 400 })
        }

        const exam = await prisma.exam.create({
          data: {
            name,
            slug: await getUniqueSlug("exam", readString(data.slug) || name, "exam"),
            description: readString(data.description),
            stateId: readString(data.stateId),
            isActive: data.isActive ?? true,
          },
        })
        return NextResponse.json({ data: exam }, { status: 201 })
      }
      case "subject": {
        const name = readString(data.name)
        if (!name) {
          return NextResponse.json({ error: "Subject name is required" }, { status: 400 })
        }

        const subject = await prisma.subject.create({
          data: {
            name,
            slug: await getUniqueSlug("subject", readString(data.slug) || name, "subject"),
            isActive: data.isActive ?? true,
          },
        })
        return NextResponse.json({ data: subject }, { status: 201 })
      }
      case "topic": {
        const name = readString(data.name)
        const subjectId = readString(data.subjectId)
        if (!name || !subjectId) {
          return NextResponse.json(
            { error: "Topic name and subject are required" },
            { status: 400 }
          )
        }

        const topic = await prisma.topic.create({
          data: {
            name,
            slug: await getUniqueSlug("topic", readString(data.slug) || name, "topic"),
            subjectId,
            isActive: data.isActive ?? true,
          },
        })
        return NextResponse.json({ data: topic }, { status: 201 })
      }
      case "set": {
        const title = readString(data.title)
        const examId = readString(data.examId)
        if (!title || !examId) {
          return NextResponse.json(
            { error: "Set title and exam are required" },
            { status: 400 }
          )
        }

        const set = await prisma.practiceSet.create({
          data: {
            title,
            slug: await getUniqueSlug("practiceSet", readString(data.slug) || title, "practice-set"),
            description: readString(data.description),
            totalQuestions: Number(data.totalQuestions) || 10,
            difficulty: readString(data.difficulty) || "mixed",
            language: readString(data.language) || "en",
            stateId: readString(data.stateId),
            examId,
            subjectId: readString(data.subjectId),
            topicId: readString(data.topicId),
            isActive: data.isActive ?? true,
          },
        })
        return NextResponse.json({ data: set }, { status: 201 })
      }
      case "question": {
        let payload: ReturnType<typeof buildQuestionPayload>
        try {
          payload = buildQuestionPayload(data)
        } catch (error) {
          return NextResponse.json(
            { error: error instanceof Error ? error.message : "Invalid question payload" },
            { status: 400 }
          )
        }

        const question = await prisma.question.create({
          data: payload,
        })

        return NextResponse.json({ data: question }, { status: 201 })
      }
      case "bulkImport": {
        const setInput = (data.set ?? {}) as Record<string, unknown>
        const questionsInput = Array.isArray(data.questions) ? data.questions : []
        const legacyExamName = readString(data.exam)
        const legacySection = readString(data.section)
        const setTitle = readString(setInput.title)
        const setLanguage = readString(setInput.language) || readString(data.language) || "en"
        let setExamId = readString(setInput.examId)
        let setSubjectId = readString(setInput.subjectId)
        const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ")

        if (!setExamId && legacyExamName) {
          const exams = await prisma.exam.findMany({
            where: { isActive: true },
            select: { id: true, name: true },
          })
          const normalizedLegacyExamName = normalizeName(legacyExamName)
          const matchedExam = exams.find(
            (exam: { id: string; name: string }) =>
              normalizeName(exam.name) === normalizedLegacyExamName ||
              normalizeName(exam.name).includes(normalizedLegacyExamName) ||
              normalizedLegacyExamName.includes(normalizeName(exam.name))
          )

          if (matchedExam) {
            setExamId = matchedExam.id
          } else {
            const examSlug = await getUniqueSlug("exam", legacyExamName, "exam")
            const createdExam = await prisma.exam.create({
              data: {
                name: legacyExamName,
                slug: examSlug,
                isActive: true,
              },
            })
            setExamId = createdExam.id
          }
        }

        if (!setExamId) {
          return NextResponse.json(
            { error: "set.examId is required (or provide top-level exam name)." },
            { status: 400 }
          )
        }

        if (!setSubjectId && legacySection) {
          const subjects = await prisma.subject.findMany({
            where: { isActive: true },
            select: { id: true, name: true },
          })
          const normalizedLegacySection = normalizeName(legacySection)
          const matchedSubject = subjects.find(
            (subject: { id: string; name: string }) =>
              normalizeName(subject.name) === normalizedLegacySection ||
              normalizeName(subject.name).includes(normalizedLegacySection) ||
              normalizedLegacySection.includes(normalizeName(subject.name))
          )
          if (matchedSubject) {
            setSubjectId = matchedSubject.id
          } else {
            const subjectSlug = await getUniqueSlug("subject", legacySection, "subject")
            const createdSubject = await prisma.subject.create({
              data: {
                name: legacySection,
                slug: subjectSlug,
                isActive: true,
              },
            })
            setSubjectId = createdSubject.id
          }
        }

        if (questionsInput.length === 0) {
          return NextResponse.json(
            { error: "At least one question is required in questions[]" },
            { status: 400 }
          )
        }

        const normalizeBulkQuestion = (questionInput: Record<string, unknown>) => {
          const questionObj =
            questionInput.question && typeof questionInput.question === "object"
              ? (questionInput.question as Record<string, unknown>)
              : null

          const explanationObj =
            questionInput.explanation && typeof questionInput.explanation === "object"
              ? (questionInput.explanation as Record<string, unknown>)
              : null

          const optionsArray = Array.isArray(questionInput.options) ? questionInput.options : []
          const optionsAsString = optionsArray.filter((item) => typeof item === "string").map(String)
          const optionsAsObject = optionsArray.filter(
            (item) => !!item && typeof item === "object"
          ) as Array<Record<string, unknown>>

          const readOptionObject = (id: "A" | "B" | "C" | "D") =>
            optionsAsObject.find(
              (item) => String(readString(item.id) || "").toUpperCase() === id
            ) || optionsAsObject["ABCD".indexOf(id)]

          const optionAObj = readOptionObject("A")
          const optionBObj = readOptionObject("B")
          const optionCObj = readOptionObject("C")
          const optionDObj = readOptionObject("D")

          const optionA =
            readString(questionInput.optionA) ||
            readString(optionAObj?.en) ||
            optionsAsString[0] ||
            null
          const optionB =
            readString(questionInput.optionB) ||
            readString(optionBObj?.en) ||
            optionsAsString[1] ||
            null
          const optionC =
            readString(questionInput.optionC) ||
            readString(optionCObj?.en) ||
            optionsAsString[2] ||
            null
          const optionD =
            readString(questionInput.optionD) ||
            readString(optionDObj?.en) ||
            optionsAsString[3] ||
            null

          const correctAnswerRaw =
            readString(questionInput.correctAnswer) ||
            readString(questionInput.correctOption) ||
            ""

          let answer: string = correctAnswerRaw.toUpperCase()
          if (!["A", "B", "C", "D"].includes(answer)) {
            const resolvedOptions = [optionA, optionB, optionC, optionD].map((item) =>
              String(item || "").trim().toLowerCase()
            )
            const matchedIndex = resolvedOptions.findIndex(
              (item) => item === correctAnswerRaw.trim().toLowerCase()
            )
            if (matchedIndex >= 0) answer = ["A", "B", "C", "D"][matchedIndex]
          }

          return {
            questionText:
              readString(questionInput.questionText) ||
              readString(questionObj?.en) ||
              readString(questionInput.question),
            questionTextHi: readString(questionInput.questionTextHi) || readString(questionObj?.hi),
            optionA,
            optionAHi: readString(questionInput.optionAHi) || readString(optionAObj?.hi),
            optionB,
            optionBHi: readString(questionInput.optionBHi) || readString(optionBObj?.hi),
            optionC,
            optionCHi: readString(questionInput.optionCHi) || readString(optionCObj?.hi),
            optionD,
            optionDHi: readString(questionInput.optionDHi) || readString(optionDObj?.hi),
            correctAnswer: answer,
            explanation: readString(questionInput.explanation) || readString(explanationObj?.en),
            explanationHi: readString(questionInput.explanationHi) || readString(explanationObj?.hi),
            language:
              readString(questionInput.language) ||
              (readString(questionObj?.hi) ? "bilingual" : setLanguage),
            difficulty: readString(questionInput.difficulty) || "medium",
            year: questionInput.year,
            stateId: readString(questionInput.stateId) || readString(setInput.stateId),
            examId: setExamId,
            subjectId: readString(questionInput.subjectId) || setSubjectId,
            topicId: readString(questionInput.topicId) || readString(setInput.topicId),
          }
        }

        const preparedQuestions = []
        for (let index = 0; index < questionsInput.length; index += 1) {
          const questionInput = questionsInput[index]
          if (!questionInput || typeof questionInput !== "object") {
            return NextResponse.json(
              { error: `Question at index ${index} must be an object` },
              { status: 400 }
            )
          }

          try {
            const normalizedQuestion = normalizeBulkQuestion(
              questionInput as Record<string, unknown>
            )
            const payload = buildQuestionPayload(normalizedQuestion, setExamId, "TEMP_PRACTICE_SET_ID")
            preparedQuestions.push(payload)
          } catch (error) {
            return NextResponse.json(
              {
                error: `Question ${index + 1}: ${
                  error instanceof Error ? error.message : "Invalid question payload"
                }`,
              },
              { status: 400 }
            )
          }
        }

        const createdSet = await prisma.practiceSet.create({
          data: {
            title:
              setTitle ||
              `${legacyExamName || "Practice"} ${legacySection || "Set"} ${new Date().toLocaleDateString("en-IN")}`,
            slug: await getUniqueSlug(
              "practiceSet",
              readString(setInput.slug) ||
                setTitle ||
                `${legacyExamName || "practice"}-${legacySection || "set"}`,
              "practice-set"
            ),
            description: readString(setInput.description),
            totalQuestions: Number(setInput.totalQuestions) || questionsInput.length,
            difficulty: readString(setInput.difficulty) || "mixed",
            language: setLanguage,
            stateId: readString(setInput.stateId),
            examId: setExamId,
            subjectId: setSubjectId,
            topicId: readString(setInput.topicId),
            isActive: setInput.isActive ?? true,
          },
        })

        const createdQuestions = await Promise.all(
          preparedQuestions.map((payload) =>
            prisma.question.create({
              data: {
                ...payload,
                practiceSetId: createdSet.id,
              },
            })
          )
        )

        return NextResponse.json(
          {
            data: {
              setId: createdSet.id,
              totalImported: createdQuestions.length,
            },
          },
          { status: 201 }
        )
      }
      default:
        return NextResponse.json({ error: "invalid type" }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error("question-practice POST error", error)

    const prismaCode = (error as { code?: string } | null)?.code
    if (prismaCode === "P2002") {
      return NextResponse.json(
        { error: "Duplicate value. Use a unique slug/name." },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
