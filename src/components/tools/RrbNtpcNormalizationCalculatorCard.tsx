"use client"

import { useState, useMemo } from "react"
import { CheckCircle, ChevronDown, Info } from "lucide-react"

const SHIFTS = [
  { value: "shift-1", label: "Shift 1" },
  { value: "shift-2", label: "Shift 2" },
]

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
]

// Illustrative difficulty factors: harder shift gets higher factor so normalized = raw * (yourFactor / otherFactor)
const DIFFICULTY_FACTOR: Record<string, number> = {
  easy: 0.9,
  moderate: 1,
  difficult: 1.1,
}

function computeNormalizedMarks(
  rawScore: number,
  yourDifficulty: string,
  otherDifficulty: string
): number {
  const yourFactor = DIFFICULTY_FACTOR[yourDifficulty] ?? 1
  const otherFactor = DIFFICULTY_FACTOR[otherDifficulty] ?? 1
  const normalized = rawScore * (yourFactor / otherFactor)
  return Math.min(100, Math.max(0, Math.round(normalized * 100) / 100))
}

function getStatusMessage(normalized: number): string {
  if (normalized >= 75) return "Great! Your normalized marks are above average."
  if (normalized >= 50) return "Your normalized marks are in the average range."
  return "Keep practicing to improve your score in future attempts."
}

type Props = { basePath?: string }
const DEFAULT_BASE_PATH = "/rrb-ntpc"

export default function RrbNtpcNormalizationCalculatorCard({ basePath = DEFAULT_BASE_PATH }: Props) {
  const [shift, setShift] = useState("shift-1")
  const [rawScore, setRawScore] = useState("72")
  const [yourDifficulty, setYourDifficulty] = useState("moderate")
  const [otherDifficulty, setOtherDifficulty] = useState("moderate")
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const rawNum = useMemo(() => parseFloat(rawScore) || 0, [rawScore])
  const normalized = useMemo(
    () => computeNormalizedMarks(rawNum, yourDifficulty, otherDifficulty),
    [rawNum, yourDifficulty, otherDifficulty]
  )
  const statusMessage = useMemo(() => getStatusMessage(normalized), [normalized])
  const shiftLabel = SHIFTS.find((s) => s.value === shift)?.label ?? "Shift 1"

  const handleCalculate = () => setSubmitted(true)

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-3 p-md-4">
          <div className="row g-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-3">Enter Your Details</h3>
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Select Your Shift <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  {SHIFTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Enter Your Raw Score <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={0}
                  max={100}
                  step={0.01}
                  value={rawScore}
                  onChange={(e) => setRawScore(e.target.value)}
                  placeholder="e.g. 72"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Difficulty Level of Your Shift <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={yourDifficulty}
                  onChange={(e) => setYourDifficulty(e.target.value)}
                >
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label small mb-1">
                  Difficulty Level of Other Shifts <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={otherDifficulty}
                  onChange={(e) => setOtherDifficulty(e.target.value)}
                >
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCalculate}
              >
                Calculate Normalized Marks <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Select your shift, enter raw score and difficulty levels, then click <strong>Calculate Normalized Marks</strong> to see your normalized score.
                    </p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className="px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary-subtle">
                      <CheckCircle size={22} className="text-success flex-shrink-0" />
                      <span className="fw-semibold text-dark">Your Normalized Score</span>
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <p className="text-secondary small mb-1">Normalized Marks:</p>
                      <p className="fs-2 fw-bold text-dark mb-2 rounded-2 bg-success bg-opacity-10 d-inline-block px-3 py-2">
                        {normalized.toFixed(2)}
                      </p>
                      <div className={`rounded-2 p-3 small mb-3 bg-success bg-opacity-10 text-success`}>
                        {statusMessage}
                      </div>
                      <p className="small text-secondary mb-0">Exam Attempt: RRB NTPC</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 shadow-sm mt-3 criteria-expand-card border-start border-primary border-3">
        <div className="card-body p-0 bg-primary bg-opacity-10">
          <button
            type="button"
            className="btn btn-link w-100 text-start d-flex align-items-center gap-2 px-4 py-3 text-decoration-none text-dark criteria-expand-btn"
            onClick={() => setCriteriaExpanded((e) => !e)}
            aria-expanded={criteriaExpanded}
          >
            <span className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 flex-shrink-0" style={{ width: 36, height: 36 }}>
              <Info size={20} className="text-primary" />
            </span>
            <span className="flex-grow-1 fw-semibold">How is normalization calculated?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">RRB uses a normalization process to make scores comparable across different exam shifts. When one shift is easier or harder than another, raw marks are adjusted so that candidates are judged fairly. This tool uses an <strong>illustrative formula</strong> based on the difficulty level you select for your shift and other shifts—actual RRB normalization is defined by the official notification and may use mean and standard deviation of each shift.</p>
                <p className="mb-0 mt-2">Always refer to the official RRB NTPC result and normalization method published by the Railway Recruitment Board for your exam cycle.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
