"use client"

import { useState, useMemo } from "react"
import { CheckCircle, XCircle, ChevronDown, Calendar, Info } from "lucide-react"

const REFERENCE_YEAR = new Date().getFullYear()
const REFERENCE_DATE = new Date(REFERENCE_YEAR, 0, 1) // 1 Jan of current year

const EXAMS: { value: string; label: string; minAge: number; maxAge: number; minQualLevel: number }[] = [
  { value: "ssc-cgl", label: "SSC CGL", minAge: 18, maxAge: 32, minQualLevel: 3 },
  { value: "ssc-chsl", label: "SSC CHSL", minAge: 18, maxAge: 27, minQualLevel: 2 },
  { value: "ssc-mts", label: "SSC MTS", minAge: 18, maxAge: 25, minQualLevel: 1 },
  { value: "ssc-gd", label: "SSC GD", minAge: 18, maxAge: 23, minQualLevel: 1 },
]

const QUALIFICATIONS: { value: number; label: string }[] = [
  { value: 1, label: "10th Pass" },
  { value: 2, label: "12th Pass" },
  { value: 3, label: "Graduate" },
  { value: 4, label: "Post Graduate" },
]

function getAgeAsOnDate(dob: Date, refDate: Date): { years: number; months: number } {
  let years = refDate.getFullYear() - dob.getFullYear()
  let months = refDate.getMonth() - dob.getMonth()
  if (refDate.getDate() < dob.getDate()) months--
  if (months < 0) {
    years--
    months += 12
  }
  return { years: Math.max(0, years), months: Math.max(0, months) }
}

function formatDateForInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function SscEligibilityCheckerCard() {
  const [exam, setExam] = useState("ssc-cgl")
  const [dobInput, setDobInput] = useState("1999-12-31")
  const [qualification, setQualification] = useState(3)
  const [submitted, setSubmitted] = useState(false)
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const examConfig = useMemo(() => EXAMS.find((e) => e.value === exam) ?? EXAMS[0], [exam])

  const dobDate = useMemo(() => {
    const [y, m, d] = dobInput.split("-").map(Number)
    if (!y || !m || !d) return null
    const date = new Date(y, m - 1, d)
    if (isNaN(date.getTime())) return null
    return date
  }, [dobInput])

  const ageAsOnRef = useMemo(
    () => (dobDate ? getAgeAsOnDate(dobDate, REFERENCE_DATE) : null),
    [dobDate]
  )

  const isEligible = useMemo(() => {
    if (ageAsOnRef === null) return null
    const ageInYears = ageAsOnRef.years + ageAsOnRef.months / 12
    const ageOk = ageInYears >= examConfig.minAge && ageInYears <= examConfig.maxAge
    const qualOk = qualification >= examConfig.minQualLevel
    return ageOk && qualOk
  }, [ageAsOnRef, examConfig, qualification])

  const handleCheck = () => setSubmitted(true)

  const qualLabel = QUALIFICATIONS.find((q) => q.value === qualification)?.label ?? "Graduate"
  const examLabel = examConfig.label

  return (
    <>
      <div className="card border-0 shadow-sm ssc-cgl-calc-card">
        <div className="card-body p-2 p-md-4">
          <div className="row g-2 g-md-4">
            <div className="col-md-6 col-lg-5">
              <h3 className="h6 fw-semibold mb-2 mb-md-3">Enter Your Details</h3>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Select Your Exam <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                >
                  {EXAMS.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2 mb-md-3">
                <label className="form-label small mb-0 mb-md-1">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <Calendar size={16} className="text-secondary" />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={dobInput}
                    onChange={(e) => setDobInput(e.target.value)}
                    max={formatDateForInput(new Date())}
                  />
                </div>
              </div>
              <div className="mb-2 mb-md-4">
                <label className="form-label small mb-0 mb-md-1">
                  Education Qualification <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={qualification}
                  onChange={(e) => setQualification(Number(e.target.value))}
                >
                  {QUALIFICATIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCheck}
              >
                Check Eligibility <span aria-hidden>→</span>
              </button>
            </div>
            <div className="col-md-6 col-lg-7">
              <div className="h-100 d-flex flex-column justify-content-center">
                {!submitted ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-0 small">
                      Enter your details and click <strong>Check Eligibility</strong> to see if you meet the criteria for SSC exams.
                    </p>
                  </div>
                ) : ageAsOnRef === null ? (
                  <div className="text-center text-warning py-4">
                    <p className="mb-0 small">Please enter a valid date of birth.</p>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden align-self-start w-100">
                    <div className={`px-3 py-2 d-flex align-items-center gap-2 ${isEligible ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}>
                      {isEligible ? (
                        <>
                          <CheckCircle size={22} className="text-success flex-shrink-0" />
                          <span className="fw-semibold text-dark">You are Eligible!</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={22} className="text-danger flex-shrink-0" />
                          <span className="fw-semibold text-dark">You are not eligible</span>
                        </>
                      )}
                    </div>
                    <div className="card-body p-3 p-md-4">
                      <p className="small text-secondary mb-1">Exam: <strong className="text-dark">{examLabel}</strong></p>
                      <p className="small text-secondary mb-1">
                        Age as of 01-01-{REFERENCE_YEAR}: <strong className="text-dark">{ageAsOnRef.years} Years {ageAsOnRef.months} Months</strong>
                      </p>
                      <p className="small text-secondary mb-3">Qualification: <strong className="text-dark">{qualLabel}</strong></p>
                      <div className={`rounded-2 p-3 small mb-0 ${isEligible ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                        {isEligible
                          ? "Great! You meet the criteria for SSC exams."
                          : "You do not meet the age or qualification criteria for this exam. Check the official SSC notification for relaxations."}
                      </div>
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
            <span className="flex-grow-1 fw-semibold">What are the eligibility criteria for SSC?</span>
            {criteriaExpanded ? <ChevronDown size={20} className="flex-shrink-0 text-primary" /> : <span className="flex-shrink-0 badge bg-primary bg-opacity-10 text-primary">Expand &gt;</span>}
          </button>
          {criteriaExpanded && (
            <div className="px-4 pb-4 pt-0 border-top border-primary border-opacity-25">
              <div className="pt-3 p-3 bg-white rounded-2 small text-secondary shadow-sm">
                <p className="mb-1">Eligibility for SSC exams is based on <strong>age</strong> (as on 1st January of the exam year) and <strong>educational qualification</strong>. Minimum age is usually 18 years. Upper age and minimum qualification vary by exam:</p>
                <ul className="mb-0 ps-3">
                  <li><strong>SSC CGL:</strong> typically 18–32 years, Graduate</li>
                  <li><strong>SSC CHSL:</strong> typically 18–27 years, 12th pass</li>
                  <li><strong>SSC MTS:</strong> typically 18–25 years, 10th pass</li>
                  <li><strong>SSC GD:</strong> typically 18–23 years, 10th pass</li>
                </ul>
                <p className="mt-2 mb-0">Category-wise relaxations apply. Always refer to the official SSC notification on ssc.gov.in for the exact criteria for your year.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
