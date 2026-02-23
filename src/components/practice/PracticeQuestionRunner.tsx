"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"

type Language = "en" | "hi"
type OptionKey = "A" | "B" | "C" | "D"

interface PracticeQuestion {
  id: string
  questionText: string
  questionTextHi?: string | null
  optionA: string
  optionAHi?: string | null
  optionB: string
  optionBHi?: string | null
  optionC: string
  optionCHi?: string | null
  optionD: string
  optionDHi?: string | null
  correctAnswer?: string | null
}

interface PracticeQuestionRunnerProps {
  questions: PracticeQuestion[]
  defaultLanguage?: Language
  durationMinutes?: number
  sections?: Array<{ name: string; questions: string[] }>
  mockMode?: boolean
  positiveMarks?: number
  negativeMarks?: number
  totalMarks?: number
  nextMockUrl?: string
  showGrowthBadges?: boolean
  attemptedUsersToday?: number
  /** When set, attempt is sent to API for logged-in user (profile tracking). */
  quizId?: string
  quizTitle?: string
  quizType?: "daily-quiz" | "current-affairs" | "mock-test"
}

const pickText = (
  language: Language,
  primary: string | null | undefined,
  fallback: string | null | undefined
) => {
  if (language === "hi") return (primary && primary.trim()) || fallback || ""
  return fallback || primary || ""
}

export default function PracticeQuestionRunner({
  questions,
  defaultLanguage = "en",
  durationMinutes,
  sections = [],
  mockMode = false,
  positiveMarks = 2,
  negativeMarks = 0.5,
  totalMarks,
  nextMockUrl = "/mock-tests",
  showGrowthBadges = false,
  attemptedUsersToday = 0,
  quizId,
  quizTitle,
  quizType = "daily-quiz",
}: PracticeQuestionRunnerProps) {
  const { data: session } = useSession()
  const attemptRecorded = useRef(false)
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, OptionKey | undefined>>({})
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reviewAnswers, setReviewAnswers] = useState(false)
  const [streakDays, setStreakDays] = useState(1)
  const [streakUpdated, setStreakUpdated] = useState(false)
  const derivedDuration = Math.max(durationMinutes ?? questions.length, 1) * 60
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(derivedDuration)

  const normalizedQuestions = useMemo(
    () =>
      questions.map((item) => ({
        id: item.id,
        question: pickText(language, item.questionTextHi, item.questionText),
        optionA: pickText(language, item.optionAHi, item.optionA),
        optionB: pickText(language, item.optionBHi, item.optionB),
        optionC: pickText(language, item.optionCHi, item.optionC),
        optionD: pickText(language, item.optionDHi, item.optionD),
        correctAnswer: item.correctAnswer ? String(item.correctAnswer).toUpperCase() : null,
      })),
    [language, questions]
  )

  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return
    const timer = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setIsSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isSubmitted, timeLeftSeconds])

  useEffect(() => {
    if (!showGrowthBadges) return
    try {
      const raw = localStorage.getItem("dailyQuizStreak")
      if (!raw) return
      const parsed = JSON.parse(raw) as { streak?: number }
      if (parsed?.streak && parsed.streak > 0) setStreakDays(parsed.streak)
    } catch {
      // ignore bad localStorage data
    }
  }, [showGrowthBadges])

  useEffect(() => {
    if (!showGrowthBadges || !isSubmitted || streakUpdated) return
    try {
      const today = new Date()
      const todayKey = today.toISOString().slice(0, 10)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)

      const raw = localStorage.getItem("dailyQuizStreak")
      const parsed = raw ? (JSON.parse(raw) as { streak?: number; lastDate?: string }) : {}
      const prevStreak = parsed.streak && parsed.streak > 0 ? parsed.streak : 0
      const lastDate = parsed.lastDate || ""

      let nextStreak = prevStreak || 1
      if (lastDate === todayKey) {
        nextStreak = prevStreak || 1
      } else if (lastDate === yesterdayKey) {
        nextStreak = prevStreak + 1
      } else {
        nextStreak = 1
      }

      localStorage.setItem(
        "dailyQuizStreak",
        JSON.stringify({ streak: nextStreak, lastDate: todayKey })
      )
      setStreakDays(nextStreak)
      setStreakUpdated(true)
    } catch {
      // ignore localStorage failures
    }
  }, [isSubmitted, showGrowthBadges, streakUpdated])

  const current = normalizedQuestions[currentIndex]
  const selected = current ? answers[current.id] : undefined
  const questionSectionMap = useMemo(() => {
    const map = new Map<string, string>()
    sections.forEach((section) => {
      section.questions.forEach((questionId) => {
        map.set(questionId, section.name)
      })
    })
    return map
  }, [sections])
  const currentSectionName = current ? questionSectionMap.get(current.id) || "General" : "General"

  const formattedTimer = `${String(Math.floor(timeLeftSeconds / 60)).padStart(2, "0")}:${String(
    timeLeftSeconds % 60
  ).padStart(2, "0")}`

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => typeof value === "string").length,
    [answers]
  )

  const resultSummary = useMemo(() => {
    if (!isSubmitted) return null

    let correct = 0
    let incorrect = 0
    let attempted = 0

    normalizedQuestions.forEach((q) => {
      const selectedAnswer = answers[q.id]
      if (!selectedAnswer) return
      attempted += 1
      if (q.correctAnswer && selectedAnswer === q.correctAnswer) correct += 1
      else incorrect += 1
    })

    const score = correct * positiveMarks - incorrect * negativeMarks
    const accuracy = normalizedQuestions.length
      ? (correct / normalizedQuestions.length) * 100
      : 0

    const sectionScores = (sections.length ? sections : [{ name: "Overall", questions: normalizedQuestions.map((q) => q.id) }]).map(
      (section) => {
        let sectionCorrect = 0
        let sectionIncorrect = 0
        let sectionAttempted = 0

        section.questions.forEach((questionId) => {
          const selectedAnswer = answers[questionId]
          const targetQuestion = normalizedQuestions.find((q) => q.id === questionId)
          if (!targetQuestion || !selectedAnswer) return
          sectionAttempted += 1
          if (targetQuestion.correctAnswer && selectedAnswer === targetQuestion.correctAnswer) {
            sectionCorrect += 1
          } else {
            sectionIncorrect += 1
          }
        })

        const sectionScore = sectionCorrect * positiveMarks - sectionIncorrect * negativeMarks
        return {
          name: section.name,
          attempted: sectionAttempted,
          correct: sectionCorrect,
          incorrect: sectionIncorrect,
          score: sectionScore,
        }
      }
    )

    return {
      correct,
      incorrect,
      attempted,
      score,
      accuracy,
      sectionScores,
    }
  }, [answers, isSubmitted, negativeMarks, normalizedQuestions, positiveMarks, sections])

  useEffect(() => {
    if (
      !isSubmitted ||
      !resultSummary ||
      !session?.user ||
      !quizId ||
      attemptRecorded.current
    )
      return
    attemptRecorded.current = true
    const totalMarksVal = totalMarks ?? questions.length * positiveMarks
    fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        quizId,
        quizTitle: quizTitle || quizId,
        quizType,
        score: resultSummary.score,
        totalMarks: totalMarksVal,
        correctCount: resultSummary.correct,
        totalQuestions: questions.length,
      }),
    }).catch(() => {})
  }, [
    isSubmitted,
    resultSummary,
    session?.user,
    quizId,
    quizTitle,
    quizType,
    totalMarks,
    questions.length,
    positiveMarks,
  ])

  const timeTakenSeconds = Math.max(derivedDuration - timeLeftSeconds, 0)
  const formattedTimeTaken = `${Math.floor(timeTakenSeconds / 60)}m ${String(timeTakenSeconds % 60).padStart(2, "0")}s`

  const onSelectOption = (option: OptionKey) => {
    if (!current || isSubmitted) return
    setAnswers((prev) => ({ ...prev, [current.id]: option }))
  }

  const toggleReview = () => {
    if (!current || isSubmitted) return
    setReviewed((prev) => {
      const next = new Set(prev)
      if (next.has(current.id)) next.delete(current.id)
      else next.add(current.id)
      return next
    })
  }

  const getPaletteClass = (questionId: string) => {
    if (reviewed.has(questionId)) return "btn-warning"
    if (answers[questionId]) return "btn-success"
    return "btn-danger"
  }

  const retakeTest = () => {
    setCurrentIndex(0)
    setAnswers({})
    setReviewed(new Set())
    setIsSubmitted(false)
    setReviewAnswers(false)
    setTimeLeftSeconds(derivedDuration)
    setStreakUpdated(false)
  }

  const onShareResult = async () => {
    if (!resultSummary) return
    const text = `Score: ${resultSummary.score.toFixed(2)} | Accuracy: ${resultSummary.accuracy.toFixed(
      2
    )}% | Attempted: ${resultSummary.attempted}/${normalizedQuestions.length}`
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "My Daily Quiz Result",
          text,
          url: shareUrl,
        })
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
        window.alert("Result copied. Share anywhere.")
      }
    } catch {
      // user cancelled or share unavailable
    }
  }

  return (
    <section className="card border shadow-sm">
      <div className="card-body p-3 p-md-4">
        {isSubmitted && mockMode && !reviewAnswers && resultSummary ? (
          <div className="border rounded-3 p-3 bg-white">
            <h2 className="h5 fw-bold mb-3">Result Summary</h2>
            <div className="d-grid gap-2 mb-3">
              <div>✔ Score: {resultSummary.score.toFixed(2)} / {(totalMarks ?? normalizedQuestions.length * positiveMarks).toFixed(2)}</div>
              <div>✔ Accuracy: {resultSummary.accuracy.toFixed(2)}%</div>
              <div>✔ Attempted: {resultSummary.attempted} / {normalizedQuestions.length}</div>
              <div>✔ Time: {formattedTimeTaken}</div>
              <div>✔ Correct: {resultSummary.correct}</div>
              <div>✔ Incorrect: {resultSummary.incorrect}</div>
              {showGrowthBadges && (
                <>
                  {attemptedUsersToday > 0 && (
                    <div>✔ Attempted by {attemptedUsersToday.toLocaleString("en-IN")} users today</div>
                  )}
                  <div>✔ Streak: 🔥 {streakDays} Day Streak</div>
                </>
              )}
            </div>

            <div className="table-responsive mb-3">
              <table className="table table-sm table-bordered align-middle mb-0">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Attempted</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {resultSummary.sectionScores.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.attempted}</td>
                      <td>{row.correct}</td>
                      <td>{row.incorrect}</td>
                      <td>{row.score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setReviewAnswers(true)}>
                Review Answers
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={retakeTest}>
                Retake Test
              </button>
              {showGrowthBadges && (
                <button type="button" className="btn btn-outline-success btn-sm" onClick={onShareResult}>
                  Share Result
                </button>
              )}
              <Link href={nextMockUrl} className="btn btn-primary btn-sm">
                Next Mock
              </Link>
            </div>
          </div>
        ) : current ? (
          <div className="border rounded-3 p-3 bg-white">
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="badge text-bg-light border text-secondary">Section: {currentSectionName}</span>
                <span className="badge text-bg-light border text-secondary">
                  Question {currentIndex + 1} / {normalizedQuestions.length}
                </span>
                <div className="btn-group btn-group-sm" role="group" aria-label="Practice language switcher">
                  <button
                    type="button"
                    className={`btn ${language === "en" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`btn ${language === "hi" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setLanguage("hi")}
                  >
                    Hindi
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="fw-semibold text-danger">Time Left: {formattedTimer}</div>
                {showGrowthBadges && attemptedUsersToday > 0 && (
                  <span className="badge text-bg-light border text-secondary">
                    Attempted by {attemptedUsersToday.toLocaleString("en-IN")} users today
                  </span>
                )}
                {showGrowthBadges && (
                  <span className="badge text-bg-warning-subtle text-warning-emphasis border">
                    🔥 {streakDays} Day Streak
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => setIsSubmitted(true)}
                  disabled={isSubmitted}
                >
                  Submit
                </button>
              </div>
            </div>

            <div className={`row g-3 ${mockMode ? "" : "row-cols-1"}`}>
              <div className={mockMode ? "col-lg-8" : "col-12"}>
                <p className="fw-semibold mb-3">{current.question}</p>

                <div className="d-grid gap-2">
                  {(["A", "B", "C", "D"] as OptionKey[]).map((optionKey) => {
                    const label =
                      optionKey === "A"
                        ? current.optionA
                        : optionKey === "B"
                          ? current.optionB
                          : optionKey === "C"
                            ? current.optionC
                            : current.optionD

                    const isCorrectOption = optionKey === current.correctAnswer
                    const isSelectedWrong = selected === optionKey && selected !== current.correctAnswer
                    const optionClass = isSubmitted && reviewAnswers
                      ? isCorrectOption
                        ? "border-success bg-success-subtle"
                        : isSelectedWrong
                          ? "border-danger bg-danger-subtle"
                          : "border"
                      : "border"

                    return (
                      <label key={optionKey} className={`${optionClass} rounded-2 px-3 py-2 d-flex gap-2 align-items-start`}>
                        <input
                          type="radio"
                          name={`question-${current.id}`}
                          value={optionKey}
                          checked={selected === optionKey}
                          onChange={() => onSelectOption(optionKey)}
                          disabled={isSubmitted}
                          className="mt-1"
                        />
                        <span>
                          <strong>{optionKey}.</strong> {label}
                        </span>
                      </label>
                    )
                  })}
                </div>

                <button
                  type="button"
                  className={`btn btn-sm mt-3 ${reviewed.has(current.id) ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={toggleReview}
                  disabled={isSubmitted}
                >
                  {reviewed.has(current.id) ? "Marked for Review" : "Mark for Review"}
                </button>
              </div>

              {mockMode && (
                <div className="col-lg-4">
                  <div className="border rounded-3 p-3 bg-light">
                    <p className="fw-semibold mb-2">Question Palette</p>
                    <div className="d-flex flex-wrap gap-2">
                      {normalizedQuestions.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`btn btn-sm ${getPaletteClass(item.id)} ${idx === currentIndex ? "border border-dark" : ""}`}
                          onClick={() => setCurrentIndex(idx)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 small d-grid gap-1">
                      <div><span className="badge text-bg-success me-1">Green</span> Answered</div>
                      <div><span className="badge text-bg-danger me-1">Red</span> Not Answered</div>
                      <div><span className="badge text-bg-warning me-1">Yellow</span> Mark for Review</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-between mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() =>
                    setCurrentIndex((idx) => Math.min(idx + 1, normalizedQuestions.length - 1))
                  }
                  disabled={currentIndex === normalizedQuestions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>

            {isSubmitted && !mockMode && resultSummary && (
              <div className="alert alert-success mt-3 mb-0 py-2">
                Submitted! Answered: {answeredCount}/{normalizedQuestions.length}
                {` | Score: ${resultSummary.score.toFixed(2)}`}
              </div>
            )}
          </div>
        ) : (
          <div className="text-secondary small">No questions found.</div>
        )}
        <div className="mt-3 d-flex flex-wrap gap-2">
          <span className="badge text-bg-light border text-secondary">Answered: {answeredCount}</span>
          <span className="badge text-bg-light border text-secondary">Review: {reviewed.size}</span>
        </div>
      </div>
    </section>
  )
}
