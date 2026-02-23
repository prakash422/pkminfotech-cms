"use client"

import { useCallback, useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

type Option = { id: string; name: string }

interface PracticeSetItem {
  id: string
  title: string
  exam?: { name: string } | null
  _count?: { questions: number }
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

const bulkImportTemplate = `{
  "set": {
    "title": "SSC CGL Quant Set 01",
    "examId": "PUT_EXAM_ID_HERE",
    "language": "bilingual",
    "difficulty": "mixed",
    "totalQuestions": 10
  },
  "questions": [
    {
      "questionText": "What is 12 + 8?",
      "questionTextHi": "12 + 8 kitna hota hai?",
      "optionA": "18",
      "optionAHi": "18",
      "optionB": "20",
      "optionBHi": "20",
      "optionC": "22",
      "optionCHi": "22",
      "optionD": "24",
      "optionDHi": "24",
      "correctAnswer": "B",
      "language": "bilingual"
    }
  ]
}`

export default function QuestionPracticeAdminPage() {
  const [states, setStates] = useState<Option[]>([])
  const [exams, setExams] = useState<Option[]>([])
  const [subjects, setSubjects] = useState<Option[]>([])
  const [topics, setTopics] = useState<Option[]>([])
  const [sets, setSets] = useState<PracticeSetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  const [masterType, setMasterType] = useState("state")
  const [masterName, setMasterName] = useState("")
  const [masterCode, setMasterCode] = useState("")
  const [masterStateId, setMasterStateId] = useState("")
  const [masterSubjectId, setMasterSubjectId] = useState("")

  const [setTitle, setSetTitle] = useState("")
  const [setExamId, setSetExamId] = useState("")
  const [setStateId, setSetStateId] = useState("")
  const [setSubjectId, setSetSubjectId] = useState("")
  const [setTopicId, setSetTopicId] = useState("")
  const [setLanguage, setSetLanguage] = useState("en")
  const [setDifficulty, setSetDifficulty] = useState("mixed")

  const [questionText, setQuestionText] = useState("")
  const [questionTextHi, setQuestionTextHi] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionAHi, setOptionAHi] = useState("")
  const [optionB, setOptionB] = useState("")
  const [optionBHi, setOptionBHi] = useState("")
  const [optionC, setOptionC] = useState("")
  const [optionCHi, setOptionCHi] = useState("")
  const [optionD, setOptionD] = useState("")
  const [optionDHi, setOptionDHi] = useState("")
  const [questionLanguage, setQuestionLanguage] = useState("en")
  const [correctAnswer, setCorrectAnswer] = useState("A")
  const [questionExamId, setQuestionExamId] = useState("")
  const [questionSetId, setQuestionSetId] = useState("")
  const [questionStateId, setQuestionStateId] = useState("")
  const [questionSubjectId, setQuestionSubjectId] = useState("")
  const [questionTopicId, setQuestionTopicId] = useState("")
  const [questionExplanation, setQuestionExplanation] = useState("")
  const [questionExplanationHi, setQuestionExplanationHi] = useState("")
  const [bulkImportJson, setBulkImportJson] = useState(bulkImportTemplate)
  const [submitting, setSubmitting] = useState(false)

  const fetchByType = async (type: string) => {
    const res = await fetch(`/api/question-practice?type=${type}`)
    if (!res.ok) throw new Error(`Failed to fetch ${type}`)
    const json = await res.json()
    return json.data || []
  }

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [statesData, examsData, subjectsData, topicsData, setsData] = await Promise.all([
        fetchByType("states"),
        fetchByType("exams"),
        fetchByType("subjects"),
        fetchByType("topics"),
        fetchByType("sets"),
      ])

      setStates(statesData)
      setExams(examsData)
      setSubjects(subjectsData)
      setTopics(topicsData)
      setSets(setsData)
    } catch {
      setMessage("Failed to fetch question-practice data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const postData = async (type: string, data: Record<string, unknown>) => {
    const res = await fetch("/api/question-practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || "Request failed")
    return json
  }

  const onCreateMaster = async () => {
    try {
      setSubmitting(true)
      if (!masterName.trim()) {
        setMessage("Name is required.")
        return
      }

      if (masterType === "exam") {
        await postData("exam", { name: masterName, stateId: masterStateId || null })
      } else if (masterType === "topic") {
        if (!masterSubjectId) {
          setMessage("Topic ke liye subject select karein.")
          return
        }
        await postData("topic", { name: masterName, subjectId: masterSubjectId })
      } else if (masterType === "subject") {
        await postData("subject", { name: masterName })
      } else {
        await postData("state", { name: masterName, code: masterCode || null })
      }

      setMasterName("")
      setMasterCode("")
      setMessage(`${masterType} created successfully.`)
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const onCreateSet = async () => {
    try {
      setSubmitting(true)
      if (!setTitle.trim() || !setExamId) {
        setMessage("Set title and exam are required.")
        return
      }

      await postData("set", {
        title: setTitle,
        examId: setExamId,
        stateId: setStateId || null,
        subjectId: setSubjectId || null,
        topicId: setTopicId || null,
        language: setLanguage,
        difficulty: setDifficulty,
        totalQuestions: 10,
      })

      setSetTitle("")
      setMessage("Practice set created (10-question template).")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const onCreateQuestion = async () => {
    try {
      setSubmitting(true)
      const englishValid =
        !!questionText.trim() &&
        !!optionA.trim() &&
        !!optionB.trim() &&
        !!optionC.trim() &&
        !!optionD.trim()

      const hindiValid =
        !!questionTextHi.trim() &&
        !!optionAHi.trim() &&
        !!optionBHi.trim() &&
        !!optionCHi.trim() &&
        !!optionDHi.trim()

      if (!questionExamId || !questionSetId) {
        setMessage("Exam aur practice set select karein.")
        return
      }

      if (questionLanguage === "en" && !englishValid) {
        setMessage("English mode me question + options A-D required hain.")
        return
      }

      if (questionLanguage === "hi" && !hindiValid) {
        setMessage("Hindi mode me question + options A-D required hain.")
        return
      }

      if (questionLanguage === "bilingual" && (!englishValid || !hindiValid)) {
        setMessage("Bilingual mode me English aur Hindi dono fields required hain.")
        return
      }

      if (!["en", "hi", "bilingual"].includes(questionLanguage)) {
        setMessage("Question form ke required fields fill karein.")
        return
      }

      await postData("question", {
        questionText,
        questionTextHi,
        optionA,
        optionAHi,
        optionB,
        optionBHi,
        optionC,
        optionCHi,
        optionD,
        optionDHi,
        language: questionLanguage,
        correctAnswer,
        explanation: questionExplanation,
        explanationHi: questionExplanationHi,
        examId: questionExamId,
        practiceSetId: questionSetId,
        stateId: questionStateId || null,
        subjectId: questionSubjectId || null,
        topicId: questionTopicId || null,
      })

      setQuestionText("")
      setQuestionTextHi("")
      setOptionA("")
      setOptionAHi("")
      setOptionB("")
      setOptionBHi("")
      setOptionC("")
      setOptionCHi("")
      setOptionD("")
      setOptionDHi("")
      setQuestionExplanation("")
      setQuestionExplanationHi("")
      setMessage("Question added successfully.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const onBulkImport = async () => {
    try {
      setSubmitting(true)

      if (!bulkImportJson.trim()) {
        setMessage("JSON script required hai.")
        return
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(bulkImportJson)
      } catch {
        setMessage("Invalid JSON format. Please check script.")
        return
      }

      await postData("bulkImport", (parsed || {}) as Record<string, unknown>)
      setMessage("Bulk import success: set + questions created.")
      fetchAll()
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Question Practice" description="Masters → Set → Questions / Bulk JSON">
      <div className="space-y-2">
        {message && (
          <div className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-800">
            {message}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 flex-1">
            <InfoCard label="States" value={states.length} />
            <InfoCard label="Exams" value={exams.length} />
            <InfoCard label="Subjects" value={subjects.length} />
            <InfoCard label="Topics" value={topics.length} />
            <InfoCard label="Sets" value={sets.length} />
          </div>
          <Button variant="outline" size="sm" onClick={fetchAll} className="gap-1 h-7 px-2 shrink-0">
            <RefreshCcw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
        {loading ? (
          <p className="text-xs text-gray-500 py-2">Loading...</p>
        ) : (
          <>
            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">1) Masters</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
                <select
                  className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs"
                  value={masterType}
                  onChange={(e) => setMasterType(e.target.value)}
                >
                  <option value="state">State</option>
                  <option value="exam">Exam</option>
                  <option value="subject">Subject</option>
                  <option value="topic">Topic</option>
                </select>
                <input
                  className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs"
                  placeholder="Name"
                  value={masterName}
                  onChange={(e) => setMasterName(e.target.value)}
                />
                {masterType === "state" ? (
                  <input
                    className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs"
                    placeholder="Code (opt)"
                    value={masterCode}
                    onChange={(e) => setMasterCode(e.target.value)}
                  />
                ) : masterType === "exam" ? (
                  <select
                    className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs"
                    value={masterStateId}
                    onChange={(e) => setMasterStateId(e.target.value)}
                  >
                    <option value="">All India / No State</option>
                    {states.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : masterType === "topic" ? (
                  <select
                    className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs"
                    value={masterSubjectId}
                    onChange={(e) => setMasterSubjectId(e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div />
                )}
                <Button type="button" size="sm" onClick={onCreateMaster} disabled={submitting} className="h-7 px-2 text-xs">
                  Create
                </Button>
              </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">2) Practice Set</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5">
                <input
                  className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2"
                  placeholder="Set title"
                  value={setTitle}
                  onChange={(e) => setSetTitle(e.target.value)}
                />
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={setExamId} onChange={(e) => setSetExamId(e.target.value)}>
                  <option value="">Select Exam</option>
                  {exams.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={setStateId} onChange={(e) => setSetStateId(e.target.value)}>
                  <option value="">State (optional)</option>
                  {states.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={setSubjectId} onChange={(e) => setSetSubjectId(e.target.value)}>
                  <option value="">Subject (optional)</option>
                  {subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={setTopicId} onChange={(e) => setSetTopicId(e.target.value)}>
                  <option value="">Topic (optional)</option>
                  {topics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2.5 md:col-span-2">
                  <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" value={setLanguage} onChange={(e) => setSetLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bilingual">Bilingual</option>
                  </select>
                  <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs" value={setDifficulty} onChange={(e) => setSetDifficulty(e.target.value)}>
                    <option value="mixed">Mixed</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <Button type="button" size="sm" onClick={onCreateSet} disabled={submitting} className="mt-1.5 h-7 px-2 text-xs">
                Create Set
              </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">3) Add Question</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5">
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionLanguage} onChange={(e) => setQuestionLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bilingual">Bilingual</option>
                </select>
                <textarea
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm md:col-span-6"
                  rows={3}
                  placeholder="Question text (English)"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="A (en)" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="B (en)" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="C (en)" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="D (en)" value={optionD} onChange={(e) => setOptionD(e.target.value)} />
                {(questionLanguage === "hi" || questionLanguage === "bilingual") && (
                  <>
                    <textarea
                      className="rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm md:col-span-6"
                      rows={3}
                      placeholder="Question text (Hindi)"
                      value={questionTextHi}
                      onChange={(e) => setQuestionTextHi(e.target.value)}
                    />
                    <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="A (hi)" value={optionAHi} onChange={(e) => setOptionAHi(e.target.value)} />
                    <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="B (hi)" value={optionBHi} onChange={(e) => setOptionBHi(e.target.value)} />
                    <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="C (hi)" value={optionCHi} onChange={(e) => setOptionCHi(e.target.value)} />
                    <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="D (hi)" value={optionDHi} onChange={(e) => setOptionDHi(e.target.value)} />
                  </>
                )}
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="Explanation (English, optional)" value={questionExplanation} onChange={(e) => setQuestionExplanation(e.target.value)} />
                <input className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-3" placeholder="Explanation (Hindi, optional)" value={questionExplanationHi} onChange={(e) => setQuestionExplanationHi(e.target.value)} />
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                  <option value="A">Correct: A</option>
                  <option value="B">Correct: B</option>
                  <option value="C">Correct: C</option>
                  <option value="D">Correct: D</option>
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionExamId} onChange={(e) => setQuestionExamId(e.target.value)}>
                  <option value="">Select Exam</option>
                  {exams.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionSetId} onChange={(e) => setQuestionSetId(e.target.value)}>
                  <option value="">Select Practice Set</option>
                  {sets.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item._count?.questions ?? 0}/10)
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionStateId} onChange={(e) => setQuestionStateId(e.target.value)}>
                  <option value="">State (optional)</option>
                  {states.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionSubjectId} onChange={(e) => setQuestionSubjectId(e.target.value)}>
                  <option value="">Subject (optional)</option>
                  {subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs md:col-span-2" value={questionTopicId} onChange={(e) => setQuestionTopicId(e.target.value)}>
                  <option value="">Topic (optional)</option>
                  {topics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="button" size="sm" onClick={onCreateQuestion} disabled={submitting} className="mt-1.5 h-7 px-2 text-xs">
                Add Question
              </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">Recent Sets</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                {sets.length === 0 ? (
                  <p className="text-xs text-gray-500">No sets.</p>
                ) : (
                  sets.slice(0, 8).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/80 px-2 py-0.5 text-xs">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-gray-600">{item.exam?.name || "No Exam"}</p>
                      </div>
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        {item._count?.questions ?? 0} Q
                      </span>
                    </div>
                  ))
                )}
              </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-semibold text-gray-900">4) Bulk Import JSON</CardTitle>
                <p className="text-[11px] text-gray-500">set + questions[] — paste &amp; Import</p>
              </CardHeader>
              <CardContent className="p-2">
                <textarea
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] font-mono leading-snug min-h-[160px] resize-y"
                  value={bulkImportJson}
                  onChange={(e) => setBulkImportJson(e.target.value)}
                  placeholder="Paste bulk JSON (set + questions)"
                />
                <div className="mt-1.5 flex gap-1">
                  <Button type="button" size="sm" onClick={onBulkImport} disabled={submitting} className="h-7 px-2 text-xs">
                    Import JSON
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setBulkImportJson(bulkImportTemplate)} disabled={submitting} className="h-7 px-2 text-xs">
                    Reset
                  </Button>
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
    <Card className="border-gray-200">
      <CardContent className="p-1.5">
        <p className="text-[10px] text-gray-500">{label}</p>
        <p className="text-base font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}
