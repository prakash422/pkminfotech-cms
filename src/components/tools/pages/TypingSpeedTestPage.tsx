"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import {
  Timer,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Share2,
  Keyboard,
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Check
} from "lucide-react"
import ToolHeaderHero from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

interface PassageOption {
  id: string
  title: string
  genre: string
  text: string
}

const PASSAGES: PassageOption[] = [
  {
    id: "digital-india",
    title: "Digital India & Public Governance (SSC CHSL Style)",
    genre: "General / Current Affairs",
    text: "The rapid evolution of digital infrastructure across India has fundamentally altered the paradigm of public service delivery. Transparent governance and financial inclusion through unified payment interfaces have empowered millions of citizens residing in remote rural areas. By eliminating intermediaries and reducing procedural bottlenecks, digital portals ensure that welfare entitlements reach the targeted beneficiaries directly into their authenticated bank accounts. Digital literacy campaigns spearheaded by local administration have further bridged the urban and rural divide. Consequently, public institutions now operate with heightened accountability and speed, enabling sustainable economic growth and fostering civic participation at the grassroots level.",
  },
  {
    id: "legal-court",
    title: "Rule of Law & Constitutional Rights (High Court Style)",
    genre: "Legal / Court Exam",
    text: "The fundamental objective of the judicial apparatus is the preservation of fundamental rights guaranteed under the Constitution of India. Equal protection of laws mandates that procedural justice must be accessible to every citizen regardless of socio-economic standing. Principles of natural justice demand that no person shall be condemned unheard and that every administrative adjudication must be supported by cogent reasons. Delay in the disposal of proceedings undermines public confidence in the judicial hierarchy. Therefore, modern case management systems and institutional arbitration frameworks are being integrated to expedite statutory remedies and ensure that justice is neither delayed nor denied.",
  },
  {
    id: "economy-admin",
    title: "Civil Administration & Economic Policy (SSC CGL DEST Style)",
    genre: "Administrative Memo",
    text: "Effective fiscal administration requires judicious allocation of public revenue across core sectors such as healthcare, education, and transport infrastructure. Sound macroeconomic management involves continuous monitoring of consumer inflation, taxation compliance, and capital expenditure targets. Civil servants entrusted with supervisory duties must exhibit exemplary diligence, integrity, and proactive problem solving. Periodic performance audits conducted by autonomous statutory authorities ensure that public expenditure adheres strictly to prescribed financial rules. Collaborative efforts between various ministries and statutory regulatory commissions are indispensable for creating an attractive domestic manufacturing ecosystem.",
  },
]


export default function TypingSpeedTestPage({
  title,
  description,
  basePath,
}: {
  title: string
  description: string
  basePath: string
}) {
  const [selectedPassageId, setSelectedPassageId] = useState<string>("digital-india")
  const [testDurationSeconds, setTestDurationSeconds] = useState<number>(60)
  const [allowBackspace, setAllowBackspace] = useState<boolean>(true)

  // Test Running State
  const [status, setStatus] = useState<"idle" | "running" | "finished">("idle")
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [userInput, setUserInput] = useState<string>("")
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0)
  const [backspaceCount, setBackspaceCount] = useState<number>(0)
  const [copied, setCopied] = useState<boolean>(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activePassage = useMemo(() => {
    return PASSAGES.find((p) => p.id === selectedPassageId) || PASSAGES[0]
  }, [selectedPassageId])

  const targetWords = useMemo(() => {
    return activePassage.text.trim().split(/\s+/)
  }, [activePassage.text])

  const userWords = useMemo(() => {
    return userInput.trim().length > 0 ? userInput.trim().split(/\s+/) : []
  }, [userInput])

  const stats = useMemo(() => {
    let correctWords = 0
    let errorWords = 0

    userWords.forEach((word, index) => {
      if (index < targetWords.length) {
        if (word === targetWords[index]) {
          correctWords++
        } else {
          errorWords++
        }
      }
    })

    const elapsedSeconds = testDurationSeconds - timeLeft
    const elapsedMinutes = Math.max(elapsedSeconds / 60, 0.05)

    const grossWpm = Math.round((keystrokeCount / 5) / elapsedMinutes)
    const netWpm = Math.max(0, Math.round(grossWpm - (errorWords / elapsedMinutes)))

    const totalTyped = keystrokeCount
    const errorKeystrokes = errorWords * 5
    const accuracy = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round(((totalTyped - errorKeystrokes) / totalTyped) * 100))) : 100
    const kdph = Math.round((keystrokeCount / Math.max(elapsedSeconds, 1)) * 3600)

    return {
      correctWords,
      errorWords,
      grossWpm,
      netWpm,
      accuracy,
      kdph,
      totalKeystrokes: keystrokeCount,
      backspaceCount,
      elapsedSeconds,
    }
  }, [userWords, targetWords, keystrokeCount, backspaceCount, testDurationSeconds, timeLeft])

  useEffect(() => {
    if (status === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setStatus("finished")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const startTest = () => {
    setUserInput("")
    setKeystrokeCount(0)
    setBackspaceCount(0)
    setTimeLeft(testDurationSeconds)
    setStatus("running")
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStatus("idle")
    setTimeLeft(testDurationSeconds)
    setUserInput("")
    setKeystrokeCount(0)
    setBackspaceCount(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "idle") {
      setStatus("running")
    }
    setUserInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace") {
      if (!allowBackspace) {
        e.preventDefault()
        return
      }
      setBackspaceCount((b) => b + 1)
    } else if (e.key.length === 1) {
      setKeystrokeCount((k) => k + 1)
    }
  }

  const sscChslPass = stats.netWpm >= 35 && stats.accuracy >= 93
  const sscCglPass = stats.netWpm >= 27 && stats.accuracy >= 90
  const courtPass = stats.netWpm >= 30 && stats.accuracy >= 90

  const handleCopySummary = () => {
    const text = `⌨️ *My Typing Speed Test Score:*
• Net Speed: ${stats.netWpm} WPM
• Gross Speed: ${stats.grossWpm} WPM
• Accuracy: ${stats.accuracy}%
• Total Keystrokes: ${stats.totalKeystrokes}
• Hourly KDPH: ${stats.kdph.toLocaleString()}
• Duration: ${Math.round(testDurationSeconds / 60)} Minute(s)
Practice here: https://www.pkminfotech.com/tools/ssc/typing-speed-test`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usefulLinks: UsefulLinkItem[] = [
    { label: "Commission Marking & WPM Formula", href: "#marking-rules" },
    { label: "Full vs Half Mistakes Rules", href: "#error-rules" },
    { label: "Exam Qualifying Standards Check", href: "#standards" },
    { label: "Frequently Asked Questions", href: "#faq" },
  ]

  return (
    <div className="typing-speed-test-page">
      {/* 1. Unified Hero Header */}
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText="Official SSC & Court Scheme"
      />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* Main Interactive Tool Console */}
          <div className="tool-console-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            {/* Top Mode Switcher Bar */}
            <div className="p-2.5 p-md-3 bg-light border-bottom d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
              <div 
                className="d-flex rounded-3 p-1 bg-white border border-light-subtle gap-1 overflow-x-auto text-nowrap no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
              >
                {[
                  { sec: 60, label: "1 Min Quick" },
                  { sec: 300, label: "5 Min Warmup" },
                  { sec: 600, label: "10 Min (CHSL)" },
                  { sec: 900, label: "15 Min (CGL DEST)" },
                ].map((t) => (
                  <button
                    key={t.sec}
                    type="button"
                    disabled={status === "running"}
                    onClick={() => {
                      setTestDurationSeconds(t.sec)
                      setTimeLeft(t.sec)
                    }}
                    className={`btn btn-sm fw-semibold px-2.5 py-1 rounded-2 flex-shrink-0 ${
                      testDurationSeconds === t.sec ? "btn-primary shadow-sm text-white" : "btn-light text-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 flex-shrink-0">
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                  {status === "running" ? "Test Running" : "Ready"}
                </span>
                <button
                  type="button"
                  onClick={resetTest}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  title="Reset test"
                >
                  <RotateCcw size={13} />
                  <span className="small">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 p-md-4">
              {/* Passage & Options Bar */}
              <div className="row g-2 align-items-center mb-3">
                <div className="col-12 col-md-7">
                  <select
                    className="form-select form-select-sm border-secondary-subtle rounded-3 py-1.5 fw-semibold"
                    disabled={status === "running"}
                    value={selectedPassageId}
                    onChange={(e) => {
                      setSelectedPassageId(e.target.value)
                      resetTest()
                    }}
                  >
                    {PASSAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-5 d-flex justify-content-md-end">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="backspaceSwitch"
                      checked={allowBackspace}
                      disabled={status === "running"}
                      onChange={(e) => setAllowBackspace(e.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold text-secondary" htmlFor="backspaceSwitch">
                      {allowBackspace ? "Backspace: Allowed (SSC)" : "Backspace: Strict Off"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Target Passage Box with word-by-word visual indicator */}
              <div
                className="p-3 bg-light rounded-3 border mb-3 font-monospace"
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  lineHeight: "1.85",
                  fontSize: "1rem",
                  userSelect: "none",
                }}
              >
                {targetWords.map((word, index) => {
                  const typedWord = userWords[index]
                  const isCurrent = index === userWords.length - 1
                  let colorClass = "text-dark"
                  let bgClass = "transparent"

                  if (index < userWords.length - 1 || (index === userWords.length - 1 && userInput.endsWith(" "))) {
                    if (typedWord === word) {
                      colorClass = "text-success fw-bold"
                    } else {
                      colorClass = "text-danger fw-bold text-decoration-line-through"
                    }
                  } else if (isCurrent) {
                    bgClass = "#e0f2fe"
                    colorClass = "text-primary fw-bold"
                  }

                  return (
                    <span
                      key={index}
                      className="px-1 rounded"
                      style={{ backgroundColor: bgClass }}
                    >
                      <span className={colorClass}>{word}</span>{" "}
                    </span>
                  )
                })}
              </div>

              {/* Interactive Typing Area */}
              <div className="mb-3">
                <textarea
                  ref={inputRef}
                  rows={4}
                  className="form-control form-control-lg border-2 border-primary border-opacity-50 rounded-3 font-monospace"
                  style={{ fontSize: "1.05rem" }}
                  placeholder={
                    status === "idle"
                      ? "Click here or press 'Start Typing Test' below to begin..."
                      : "Type the passage here..."
                  }
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={status === "finished"}
                />
              </div>

              {/* Control Action Buttons */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-2">
                <div className="d-flex gap-2">
                  {status !== "running" ? (
                    <button
                      type="button"
                      className="btn btn-primary px-3.5 py-2 fw-semibold shadow-xs d-inline-flex align-items-center gap-1.5"
                      style={{ borderRadius: "10px", fontSize: "0.88rem" }}
                      onClick={startTest}
                    >
                      <Play size={15} />
                      <span className="text-nowrap">{status === "finished" ? "Try Again" : "Start Typing Test"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning px-3.5 py-2 fw-semibold shadow-xs d-inline-flex align-items-center gap-1.5 text-dark"
                      style={{ borderRadius: "10px", fontSize: "0.88rem" }}
                      onClick={() => setStatus("finished")}
                    >
                      <span className="text-nowrap">Submit Early</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3 py-2 d-inline-flex align-items-center gap-1.5 shadow-xs"
                    style={{ borderRadius: "10px", fontSize: "0.88rem" }}
                    onClick={resetTest}
                  >
                    <RotateCcw size={15} />
                    <span className="text-nowrap">Reset</span>
                  </button>
                </div>

                <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
                  1 Standard Word = 5 Key Depressions (including spaces)
                </span>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="row g-2 g-md-3 mt-3">
                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Net Speed</div>
                    <div className="fs-4 fw-bold text-success">{stats.netWpm} WPM</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Gross: {stats.grossWpm} WPM
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Accuracy</div>
                    <div className="fs-4 fw-bold text-dark">{stats.accuracy}%</div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Mistakes: {stats.errorWords}
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Time Remaining</div>
                    <div className={`fs-4 fw-bold ${timeLeft <= 10 && status === "running" ? "text-danger" : "text-primary"}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Of {testDurationSeconds}s Total
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="card border rounded-3 p-3 bg-light text-center h-100">
                    <div className="small text-secondary mb-1 fw-semibold">Hourly KDPH</div>
                    <div className="fs-5 fw-bold text-info mt-0.5 mb-0.5">
                      {stats.kdph.toLocaleString()}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Key Depressions / Hr
                    </div>
                  </div>
                </div>
              </div>

              {/* Finished Result Banner */}
              {status === "finished" && (
                <div className="p-3 bg-light rounded-4 border border-success border-2 mt-3" id="standards">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-success text-white fw-bold px-3 py-1 rounded-pill">
                      Test Completed 🎉
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="btn btn-sm btn-outline-secondary rounded-pill py-0.5 px-2.5 d-inline-flex align-items-center gap-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      <span>{copied ? "Copied!" : "Copy Score"}</span>
                    </button>
                  </div>

                  <div className="row g-2 text-center small">
                    <div className="col-4">
                      <div className={`p-2 rounded-3 border ${sscChslPass ? "bg-success-subtle text-success fw-bold" : "bg-white"}`}>
                        CHSL DEO (35 WPM): {sscChslPass ? "QUALIFIED ✓" : "FAIL"}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className={`p-2 rounded-3 border ${sscCglPass ? "bg-success-subtle text-success fw-bold" : "bg-white"}`}>
                        CGL DEST (27 WPM): {sscCglPass ? "QUALIFIED ✓" : "FAIL"}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className={`p-2 rounded-3 border ${courtPass ? "bg-success-subtle text-success fw-bold" : "bg-white"}`}>
                        High Court (30 WPM): {courtPass ? "QUALIFIED ✓" : "FAIL"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Action Toolbar */}
              <div className="pt-3 mt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
                <div className="row g-2">
                  <div className="col-6">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `I scored ${stats.netWpm} Net WPM with ${stats.accuracy}% accuracy in the typing speed test! Test yours: https://www.pkminfotech.com/tools/ssc/typing-speed-test`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 text-white d-flex align-items-center justify-content-center gap-1.5 text-decoration-none shadow-xs"
                      style={{
                        backgroundColor: "#25D366",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "none",
                        boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)"
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span className="text-nowrap">WhatsApp</span>
                    </a>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="btn w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#334155",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                        fontWeight: 600
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-success flex-shrink-0" />
                          <span className="text-success text-nowrap">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-secondary flex-shrink-0" />
                          <span className="text-nowrap">Copy Score</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Boundary: Interactive Tool (Above) vs Reference Guide & Documentation (Below) */}
          <div className="tool-reference-section-header mt-5 mb-3 pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span 
                className="badge rounded-pill bg-light text-primary border border-primary-subtle fw-bold px-3 py-1 text-uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
              >
                Official Reference Guide &amp; Evaluation Formula
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              How SSC &amp; High Courts Calculate Net WPM and Errors
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Official key depression standards, error classifications, and qualifying benchmarks.
            </p>
          </div>

          <div className="text-secondary small lh-lg">
            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="marking-rules">1. Key Depressions &amp; Words Standard</h3>
            <div className="bg-light p-3 rounded-3 border font-monospace mb-3">
              1 Standard Word = 5 Key Depressions (including spacebar) <br />
              Gross WPM = (Total Keystrokes ÷ 5) ÷ Test Minutes <br />
              Net WPM = Gross WPM - (Mistakes ÷ Test Minutes)
            </div>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="error-rules">2. Mistake Classifications</h3>
            <ul className="ps-3 mb-4">
              <li><strong>Full Mistakes:</strong> Omission of a word, addition of unprinted word, or substitution of wrong word.</li>
              <li><strong>Half Mistakes:</strong> Spacing errors, capitalization mistakes, or transposition of adjacent letters.</li>
              <li><strong>Error Margin Allowed:</strong> UR candidates: 5%–7% mistakes permissible. Reserved: up to 10% errors.</li>
            </ul>

            <h3 className="h6 fw-bold text-dark mt-4 mb-2" id="faq">3. Frequently Asked Questions</h3>
            <div className="border-top pt-3">
              <div className="mb-3">
                <strong className="text-dark d-block">Q: Is backspace allowed in the actual SSC typing test?</strong>
                <span className="text-muted">Yes, SSC allows the use of backspace to correct errors during the DEST/Typing test within the allotted time.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug="ssc"
              categoryName="SSC Tools"
              currentPath="/tools/ssc/typing-speed-test"
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
