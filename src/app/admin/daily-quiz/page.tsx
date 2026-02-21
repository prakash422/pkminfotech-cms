"use client"

import { useCallback, useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

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
    <AdminLayout
      title="Daily Quiz"
      description="Dedicated daily quiz setup and JSON import"
    >
      <div className="space-y-4">
        {message && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
            {message}
          </div>
        )}

        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daily Quiz Setup</h2>
            <p className="text-xs text-gray-600">Separate daily quiz module with independent import flow</p>
          </div>
          <Button variant="outline" onClick={fetchAll} className="gap-2 h-9 px-3">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard label="Exams" value={exams.length} />
          <InfoCard label="Daily Quizzes" value={quizzes.length} />
          <InfoCard
            label="Mapped Questions"
            value={quizzes.reduce((sum, item) => sum + (item.questionIds?.length || 0), 0)}
          />
          <InfoCard
            label="Total Duration (min)"
            value={quizzes.reduce((sum, item) => sum + (item.durationMinutes || 0), 0)}
          />
        </div>

        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-sm text-gray-600">Loading data...</CardContent>
          </Card>
        ) : (
          <>
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base text-gray-900">1) Daily Quiz JSON Import</CardTitle>
                <p className="text-sm text-gray-600">Sirf daily quiz data import karein</p>
              </CardHeader>
              <CardContent className="pt-0">
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono"
                  rows={14}
                  value={quizImportJson}
                  onChange={(e) => setQuizImportJson(e.target.value)}
                  placeholder="Paste daily quiz JSON here"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" onClick={onQuizImport} disabled={submitting} className="h-9">
                    Import Daily Quiz JSON
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuizImportJson(quizImportTemplate)}
                    disabled={submitting}
                    className="h-9"
                  >
                    Reset Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base text-gray-900">2) Create Daily Quiz Manually</CardTitle>
                <p className="text-sm text-gray-600">Manual question IDs se daily quiz create karein</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <input className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Quiz ID (unique)" value={manualQuizId} onChange={(e) => setManualQuizId(e.target.value)} />
                  <input className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Title (optional)" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
                  <input className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Exam name (e.g. SSC CGL)" value={manualExam} onChange={(e) => setManualExam(e.target.value)} />
                  <input type="number" className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Total Questions" value={manualTotalQuestions} onChange={(e) => setManualTotalQuestions(Number(e.target.value))} />
                  <input type="number" className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Total Marks" value={manualTotalMarks} onChange={(e) => setManualTotalMarks(Number(e.target.value))} />
                  <input type="number" step="0.25" className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Negative Marking" value={manualNegativeMarking} onChange={(e) => setManualNegativeMarking(Number(e.target.value))} />
                  <input type="number" className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Duration (min)" value={manualDurationMinutes} onChange={(e) => setManualDurationMinutes(Number(e.target.value))} />
                  <select className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" value={manualLanguage} onChange={(e) => setManualLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bilingual">Bilingual</option>
                  </select>
                  <input type="date" className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" value={manualQuizDate} onChange={(e) => setManualQuizDate(e.target.value)} />
                </div>
                <textarea className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono" rows={4} placeholder="Question IDs (comma/newline separated)" value={manualQuestionIds} onChange={(e) => setManualQuestionIds(e.target.value)} />
                <textarea className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono" rows={4} placeholder='Sections JSON (optional), e.g. [{"name":"General","questions":["id1"]}]' value={manualSectionsJson} onChange={(e) => setManualSectionsJson(e.target.value)} />
                <Button type="button" onClick={onCreateManualQuiz} disabled={submitting} className="h-9">
                  Create Manual Daily Quiz
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base text-gray-900">3) Recent Daily Quizzes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1.5">
                  {quizzes.length === 0 ? (
                    <p className="text-sm text-gray-600">No daily quizzes found.</p>
                  ) : (
                    quizzes.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.title || item.quizId}</p>
                          <p className="text-gray-600">
                            {item.exam?.name || "No Exam"} | {item.durationMinutes} min | -{item.negativeMarking}
                          </p>
                        </div>
                        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {item.totalQuestions} Qs
                        </span>
                      </div>
                    ))
                  )}
                </div>
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
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}
