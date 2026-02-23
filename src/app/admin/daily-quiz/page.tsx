"use client"

import { useCallback, useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Sparkles } from "lucide-react"

type ExamOption = { id: string; name: string }

interface DailyQuizItem {
  id: string
  quizId: string
  title?: string | null
  totalQuestions: number
  totalMarks: number
  negativeMarking: number
  durationMinutes: number
  exam?: { name: string } | null
  questionIds?: string[]
}

const quizImportTemplate = `{
  "quizId": "daily-quiz-2026-02-20",
  "title": "Daily Quiz - 20 Feb 2026",
  "totalQuestions": 5,
  "durationMinutes": 5,
  "date": "2026-02-20",
  "exam": "SSC CGL",
  "marksPerQuestion": 2,
  "negativeMarking": 0.5,
  "questions": [
    {
      "category": "Reasoning",
      "question": {
        "en": "Find next number: 2, 6, 12, 20, ?",
        "hi": "अगली संख्या ज्ञात करें: 2, 6, 12, 20, ?"
      },
      "options": [
        {"id": "A", "en": "28", "hi": "28"},
        {"id": "B", "en": "30", "hi": "30"},
        {"id": "C", "en": "32", "hi": "32"},
        {"id": "D", "en": "26", "hi": "26"}
      ],
      "correctOption": "B"
    },
    {
      "category": "Quant",
      "question": {
        "en": "15% of 200 = ?",
        "hi": "200 का 15% कितना है?"
      },
      "options": [
        {"id": "A", "en": "25", "hi": "25"},
        {"id": "B", "en": "30", "hi": "30"},
        {"id": "C", "en": "35", "hi": "35"},
        {"id": "D", "en": "40", "hi": "40"}
      ],
      "correctOption": "B"
    },
    {
      "category": "English",
      "question": {
        "en": "Choose synonym of Brave.",
        "hi": "Brave का समानार्थी शब्द चुनें।"
      },
      "options": [
        {"id": "A", "en": "Coward", "hi": "डरपोक"},
        {"id": "B", "en": "Bold", "hi": "साहसी"},
        {"id": "C", "en": "Weak", "hi": "कमज़ोर"},
        {"id": "D", "en": "Lazy", "hi": "आलसी"}
      ],
      "correctOption": "B"
    },
    {
      "category": "GK",
      "question": {
        "en": "Who is known as Missile Man of India?",
        "hi": "भारत के मिसाइल मैन किसे कहा जाता है?"
      },
      "options": [
        {"id": "A", "en": "Dr. APJ Abdul Kalam", "hi": "डॉ. एपीजे अब्दुल कलाम"},
        {"id": "B", "en": "Vikram Sarabhai", "hi": "विक्रम साराभाई"},
        {"id": "C", "en": "Homi Bhabha", "hi": "होमी भाभा"},
        {"id": "D", "en": "C.V. Raman", "hi": "सी.वी. रमन"}
      ],
      "correctOption": "A"
    },
    {
      "category": "Current Affairs",
      "question": {
        "en": "G20 Summit 2023 was hosted by which country?",
        "hi": "G20 शिखर सम्मेलन 2023 की मेजबानी किस देश ने की?"
      },
      "options": [
        {"id": "A", "en": "India", "hi": "भारत"},
        {"id": "B", "en": "USA", "hi": "अमेरिका"},
        {"id": "C", "en": "UK", "hi": "ब्रिटेन"},
        {"id": "D", "en": "France", "hi": "फ्रांस"}
      ],
      "correctOption": "A"
    }
  ]
}`

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export default function DailyQuizAdminPage() {
  const [exams, setExams] = useState<ExamOption[]>([])
  const [quizzes, setQuizzes] = useState<DailyQuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [quizImportJson, setQuizImportJson] = useState(quizImportTemplate)
  const [manualQuizId, setManualQuizId] = useState("")
  const [manualTitle, setManualTitle] = useState("")
  const [manualExam, setManualExam] = useState("")
  const [manualTotalQuestions, setManualTotalQuestions] = useState(10)
  const [manualTotalMarks, setManualTotalMarks] = useState(20)
  const [manualNegativeMarking, setManualNegativeMarking] = useState(0.5)
  const [manualDurationMinutes, setManualDurationMinutes] = useState(10)
  const [manualLanguage, setManualLanguage] = useState("en")
  const [manualQuizDate, setManualQuizDate] = useState("")
  const [manualQuestionIds, setManualQuestionIds] = useState("")
  const [manualSectionsJson, setManualSectionsJson] = useState("")
  const [autoGenerating, setAutoGenerating] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [examRes, quizRes] = await Promise.all([
        fetch("/api/question-practice?type=exams"),
        fetch("/api/daily-quiz"),
      ])

      if (!examRes.ok || !quizRes.ok) throw new Error("Failed to load daily-quiz data.")

      const examJson = await examRes.json()
      const quizJson = await quizRes.json()
      setExams((examJson.data || []) as ExamOption[])
      setQuizzes((quizJson.data || []) as DailyQuizItem[])
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const onQuizImport = async () => {
    try {
      setSubmitting(true)

      if (!quizImportJson.trim()) {
        setMessage("Daily quiz JSON script required hai.")
        return
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(quizImportJson)
      } catch {
        setMessage("Invalid daily quiz JSON format.")
        return
      }

      const res = await fetch("/api/daily-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed || {}),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Daily quiz import failed")

      setMessage("Daily quiz import success.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const onAutoGenerateToday = async () => {
    try {
      setAutoGenerating(true)
      setMessage(null)
      const res = await fetch("/api/daily-quiz/auto-generate?count=10", { credentials: "include" })
      const json = await res.json()
      if (!res.ok) {
        setMessage(json.error || "Auto-generate failed")
        return
      }
      setMessage(json.data?.message || "Today's quiz created.")
      fetchAll()
    } catch (e) {
      setMessage(getErrorMessage(e))
    } finally {
      setAutoGenerating(false)
    }
  }

  const onCreateManualQuiz = async () => {
    try {
      setSubmitting(true)

      const parsedQuestionIds = manualQuestionIds
        .split(/[\n,\s]+/)
        .map((item) => item.trim())
        .filter(Boolean)

      if (!manualQuizId.trim() || !manualExam.trim() || parsedQuestionIds.length === 0) {
        setMessage("quizId, exam aur कम से कम ek question ID required hai.")
        return
      }

      let parsedSections: unknown[] = []
      if (manualSectionsJson.trim()) {
        try {
          const maybeSections = JSON.parse(manualSectionsJson)
          if (!Array.isArray(maybeSections)) throw new Error("sections must be an array")
          parsedSections = maybeSections
        } catch {
          setMessage("Sections JSON invalid hai. Array format me do.")
          return
        }
      } else {
        parsedSections = [{ name: "Daily", questions: parsedQuestionIds }]
      }

      const payload = {
        quizId: manualQuizId.trim(),
        title: manualTitle.trim() || manualQuizId.trim(),
        exam: manualExam.trim(),
        totalQuestions: Number(manualTotalQuestions) || parsedQuestionIds.length,
        totalMarks: Number(manualTotalMarks) || (Number(manualTotalQuestions) || parsedQuestionIds.length) * 2,
        negativeMarking: Number(manualNegativeMarking) || 0,
        durationMinutes: Number(manualDurationMinutes) || 10,
        language: manualLanguage,
        quizDate: manualQuizDate || undefined,
        questionIds: parsedQuestionIds,
        sections: parsedSections,
      }

      const res = await fetch("/api/daily-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Manual daily quiz create failed")

      setMessage("Manual daily quiz created successfully.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Daily Quiz" description="Paste JSON → Import. No login needed on site.">
      <div className="space-y-2">
        {message && (
          <div className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-800">
            {message}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 flex-1">
            <InfoCard label="Exams" value={exams.length} />
            <InfoCard label="Quizzes" value={quizzes.length} />
            <InfoCard label="Questions" value={quizzes.reduce((s, i) => s + (i.questionIds?.length || 0), 0)} />
            <InfoCard label="Min" value={quizzes.reduce((s, i) => s + (i.durationMinutes || 0), 0)} />
          </div>
          <div className="flex gap-1 shrink-0">
            <Button size="sm" onClick={onAutoGenerateToday} disabled={autoGenerating || loading} className="gap-1 h-7 px-2 bg-green-600 hover:bg-green-700">
              <Sparkles className="h-3 w-3" />
              {autoGenerating ? "..." : "Generate today"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchAll} className="gap-1 h-7 px-2">
              <RefreshCcw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-gray-500 py-2">Loading...</p>
        ) : (
          <>
            {/* 1) JSON Import — primary flow: paste → Import */}
            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">1) Paste JSON &amp; Import</CardTitle>
                <p className="text-[11px] text-gray-500">quizId, title, exam, questions[] (category, question.en/hi, options, correctOption). Or use <strong>Generate today</strong> above: random 10 from DB for today.</p>
              </CardHeader>
              <CardContent className="p-2">
                <textarea
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-[11px] font-mono leading-snug min-h-[180px] resize-y"
                  value={quizImportJson}
                  onChange={(e) => setQuizImportJson(e.target.value)}
                  placeholder="Paste daily quiz JSON (structure as template)"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Button type="button" size="sm" onClick={onQuizImport} disabled={submitting} className="h-7 px-2 text-xs">
                    Import JSON
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setQuizImportJson(quizImportTemplate)} disabled={submitting} className="h-7 px-2 text-xs">
                    Reset template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2) Manual — compact row */}
            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">2) Manual (IDs only)</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-1">
                  <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" placeholder="Quiz ID" value={manualQuizId} onChange={(e) => setManualQuizId(e.target.value)} />
                  <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" placeholder="Title" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
                  <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" placeholder="Exam" value={manualExam} onChange={(e) => setManualExam(e.target.value)} />
                  <input type="number" className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs w-14" placeholder="Q" value={manualTotalQuestions} onChange={(e) => setManualTotalQuestions(Number(e.target.value))} />
                  <input type="number" className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs w-14" placeholder="Marks" value={manualTotalMarks} onChange={(e) => setManualTotalMarks(Number(e.target.value))} />
                  <input type="number" step="0.25" className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs w-14" placeholder="Neg" value={manualNegativeMarking} onChange={(e) => setManualNegativeMarking(Number(e.target.value))} />
                  <input type="number" className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs w-12" placeholder="Min" value={manualDurationMinutes} onChange={(e) => setManualDurationMinutes(Number(e.target.value))} />
                  <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" value={manualLanguage} onChange={(e) => setManualLanguage(e.target.value)}>
                    <option value="en">en</option>
                    <option value="hi">hi</option>
                    <option value="bilingual">bilingual</option>
                  </select>
                  <input type="date" className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" value={manualQuizDate} onChange={(e) => setManualQuizDate(e.target.value)} />
                </div>
                <textarea className="w-full rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] font-mono" rows={2} placeholder="Question IDs (comma/newline)" value={manualQuestionIds} onChange={(e) => setManualQuestionIds(e.target.value)} />
                <textarea className="w-full rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] font-mono" rows={2} placeholder='Sections JSON optional' value={manualSectionsJson} onChange={(e) => setManualSectionsJson(e.target.value)} />
                <Button type="button" size="sm" onClick={onCreateManualQuiz} disabled={submitting} className="h-7 px-2 text-xs">
                  Create manual quiz
                </Button>
              </CardContent>
            </Card>

            {/* 3) Recent list — compact */}
            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">3) Recent</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {quizzes.length === 0 ? (
                  <p className="text-xs text-gray-500">No quizzes.</p>
                ) : (
                  <div className="space-y-0.5 max-h-40 overflow-y-auto">
                    {quizzes.slice(0, 10).map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/80 px-2 py-0.5 text-xs">
                        <span className="font-medium text-gray-800 truncate">{item.title || item.quizId}</span>
                        <span className="text-gray-500 shrink-0">{item.exam?.name} · {item.totalQuestions}Q · {item.durationMinutes}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

function InfoCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-1.5">
        <p className="text-[10px] text-gray-500">{label}</p>
        <p className="text-base font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}
