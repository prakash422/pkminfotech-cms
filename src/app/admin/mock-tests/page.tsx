"use client"

import { useCallback, useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

type ExamOption = { id: string; name: string }

interface MockTestItem {
  id: string
  mockId: string
  title?: string | null
  totalQuestions: number
  totalMarks: number
  negativeMarking: number
  durationMinutes: number
  exam?: { name: string } | null
  questionIds?: string[]
  createdAt?: string
}

const mockImportTemplate = `{
  "mockId": "ssc-cgl-mini-1",
  "exam": "SSC CGL",
  "totalQuestions": 20,
  "totalMarks": 40,
  "negativeMarking": 0.5,
  "durationMinutes": 20,
  "language": "bilingual",
  "sections": [
    {
      "name": "Reasoning",
      "questions": ["QUESTION_ID_1", "QUESTION_ID_2", "QUESTION_ID_3"]
    },
    {
      "name": "Quant",
      "questions": ["QUESTION_ID_11", "QUESTION_ID_12"]
    }
  ]
}`

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export default function MockTestsAdminPage() {
  const [exams, setExams] = useState<ExamOption[]>([])
  const [mockTests, setMockTests] = useState<MockTestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [mockImportJson, setMockImportJson] = useState(mockImportTemplate)
  const [manualMockId, setManualMockId] = useState("")
  const [manualTitle, setManualTitle] = useState("")
  const [manualExam, setManualExam] = useState("")
  const [manualTotalQuestions, setManualTotalQuestions] = useState(20)
  const [manualTotalMarks, setManualTotalMarks] = useState(40)
  const [manualNegativeMarking, setManualNegativeMarking] = useState(0.5)
  const [manualDurationMinutes, setManualDurationMinutes] = useState(20)
  const [manualLanguage, setManualLanguage] = useState("en")
  const [manualQuestionIds, setManualQuestionIds] = useState("")
  const [manualSectionsJson, setManualSectionsJson] = useState("")

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [examRes, mockRes] = await Promise.all([
        fetch("/api/question-practice?type=exams"),
        fetch("/api/mock-tests"),
      ])

      if (!examRes.ok || !mockRes.ok) throw new Error("Failed to load mock-test setup data.")

      const examJson = await examRes.json()
      const mockJson = await mockRes.json()
      setExams((examJson.data || []) as ExamOption[])
      setMockTests((mockJson.data || []) as MockTestItem[])
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const onMockImport = async () => {
    try {
      setSubmitting(true)

      if (!mockImportJson.trim()) {
        setMessage("Mock test JSON script required hai.")
        return
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(mockImportJson)
      } catch {
        setMessage("Invalid mock test JSON format. Please check script.")
        return
      }

      const res = await fetch("/api/mock-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed || {}),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Mock test import failed")

      setMessage("Mock test import success.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const onCreateManualMock = async () => {
    try {
      setSubmitting(true)

      const parsedQuestionIds = manualQuestionIds
        .split(/[\n,\s]+/)
        .map((item) => item.trim())
        .filter(Boolean)

      if (!manualMockId.trim() || !manualExam.trim() || parsedQuestionIds.length === 0) {
        setMessage("mockId, exam aur कम से कम ek question ID required hai.")
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
        parsedSections = [{ name: "General", questions: parsedQuestionIds }]
      }

      const payload = {
        mockId: manualMockId.trim(),
        title: manualTitle.trim() || manualMockId.trim(),
        exam: manualExam.trim(),
        totalQuestions: Number(manualTotalQuestions) || parsedQuestionIds.length,
        totalMarks: Number(manualTotalMarks) || (Number(manualTotalQuestions) || parsedQuestionIds.length) * 2,
        negativeMarking: Number(manualNegativeMarking) || 0,
        durationMinutes: Number(manualDurationMinutes) || 20,
        language: manualLanguage,
        questionIds: parsedQuestionIds,
        sections: parsedSections,
      }

      const res = await fetch("/api/mock-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Manual mock create failed")

      setMessage("Manual mock test created successfully.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      title="Mock Tests"
      description="Dedicated mock-test setup and JSON import (mockId + sections)"
    >
      <div className="space-y-4">
        {message && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
            {message}
          </div>
        )}

        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mock Test Setup</h2>
            <p className="text-xs text-gray-600">Mock metadata + section-wise question mapping</p>
          </div>
          <Button variant="outline" onClick={fetchAll} className="gap-2 h-9 px-3">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard label="Exams" value={exams.length} />
          <InfoCard label="Mock Tests" value={mockTests.length} />
          <InfoCard
            label="Mapped Questions"
            value={mockTests.reduce((sum, item) => sum + (item.questionIds?.length || 0), 0)}
          />
          <InfoCard
            label="Total Duration (min)"
            value={mockTests.reduce((sum, item) => sum + (item.durationMinutes || 0), 0)}
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
                <CardTitle className="text-base text-gray-900">1) Mock Test JSON Import (One Click)</CardTitle>
                <p className="text-sm text-gray-600">Sirf mock-test data ke liye dedicated import block</p>
              </CardHeader>
              <CardContent className="pt-0">
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono"
                  rows={16}
                  value={mockImportJson}
                  onChange={(e) => setMockImportJson(e.target.value)}
                  placeholder="Paste mock test JSON here"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" onClick={onMockImport} disabled={submitting} className="h-9">
                    Import Mock JSON
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMockImportJson(mockImportTemplate)}
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
                <CardTitle className="text-base text-gray-900">2) Create Mock Test Manually</CardTitle>
                <p className="text-sm text-gray-600">Agar manual add karna ho to yahi form use karein</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <input className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm" placeholder="Mock ID (unique)" value={manualMockId} onChange={(e) => setManualMockId(e.target.value)} />
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
                  <div className="text-xs text-gray-500 flex items-center">
                    Question IDs ko niche textarea me add karein
                  </div>
                </div>
                <textarea className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono" rows={4} placeholder="Question IDs (comma/newline separated)" value={manualQuestionIds} onChange={(e) => setManualQuestionIds(e.target.value)} />
                <textarea className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs md:text-sm font-mono" rows={4} placeholder='Sections JSON (optional), e.g. [{"name":"Reasoning","questions":["id1"]}]' value={manualSectionsJson} onChange={(e) => setManualSectionsJson(e.target.value)} />
                <Button type="button" onClick={onCreateManualMock} disabled={submitting} className="h-9">
                  Create Manual Mock Test
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base text-gray-900">3) Recent Mock Tests</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1.5">
                  {mockTests.length === 0 ? (
                    <p className="text-sm text-gray-600">No mock tests found.</p>
                  ) : (
                    mockTests.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.title || item.mockId}</p>
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
