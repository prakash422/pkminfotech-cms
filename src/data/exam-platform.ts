export interface ExamCategory {
  slug: string
  name: string
  description: string
  tests: number
}

export interface MockTestItem {
  slug: string
  title: string
  exam: string
  questions: number
  duration: number
}

export interface PracticeSetItem {
  slug: string
  title: string
  exam: string
  topic: string
  questions: number
}

export interface ToolItem {
  slug: string
  title: string
  description: string
  category: string
}

export const examCategories: ExamCategory[] = [
  { slug: "ssc", name: "SSC", description: "CGL, CHSL, MTS and GD preparation tests.", tests: 42 },
  { slug: "banking", name: "Banking", description: "IBPS and SBI PO/Clerk exam practice.", tests: 34 },
  { slug: "railway", name: "Railway", description: "RRB NTPC and Group-D mock tests.", tests: 28 },
  { slug: "upsc", name: "UPSC", description: "Prelims MCQ practice and current affairs.", tests: 18 },
  { slug: "defence", name: "Defence", description: "CDS, CAPF and AFCAT objective tests.", tests: 21 },
  { slug: "state-exams", name: "State Exams", description: "State PSC and police exam sets.", tests: 26 },
]

export const mockTests: MockTestItem[] = [
  { slug: "ssc-cgl-tier-1-mock-1", title: "SSC CGL Tier 1 - Full Mock 1", exam: "SSC", questions: 100, duration: 60 },
  { slug: "ibps-po-prelims-mock-1", title: "IBPS PO Prelims - Mock Test 1", exam: "Banking", questions: 100, duration: 60 },
  { slug: "rrb-ntpc-mock-1", title: "RRB NTPC - Full Mock 1", exam: "Railway", questions: 100, duration: 90 },
  { slug: "upsc-prelims-gs-mock-1", title: "UPSC Prelims GS - Mock 1", exam: "UPSC", questions: 100, duration: 120 },
]

export const practiceSets: PracticeSetItem[] = [
  { slug: "ssc-quant-practice-01", title: "SSC Quant Practice Set 01", exam: "SSC", topic: "Quantitative Aptitude", questions: 30 },
  { slug: "banking-reasoning-practice-01", title: "Banking Reasoning Set 01", exam: "Banking", topic: "Reasoning", questions: 35 },
  { slug: "railway-gk-practice-01", title: "Railway GK Set 01", exam: "Railway", topic: "General Knowledge", questions: 25 },
  { slug: "upsc-polity-practice-01", title: "UPSC Polity Set 01", exam: "UPSC", topic: "Indian Polity", questions: 20 },
]

export const toolItems: ToolItem[] = [
  { slug: "ssc-cgl-marks-calculator", title: "SSC CGL Marks Calculator", description: "Calculate your SSC CGL tier-wise marks and total score.", category: "SSC" },
  { slug: "ssc-cgl-age-limit-calculator", title: "SSC CGL Age Limit Calculator", description: "Check age limit and relaxation for SSC CGL posts.", category: "SSC" },
  { slug: "ssc-eligibility-checker", title: "SSC Eligibility Checker", description: "Verify eligibility for SSC exams by qualification and age.", category: "SSC" },
  { slug: "rrb-ntpc-normalization-calculator", title: "RRB NTPC Normalization Calculator", description: "Calculate normalized marks for RRB NTPC multi-shift exam.", category: "RRB" },
  { slug: "ibps-score-calculator", title: "IBPS Score Calculator", description: "Compute your IBPS PO/Clerk exam score from correct and wrong answers.", category: "Banking" },
  { slug: "ssc-cutoff-predictor", title: "SSC Cutoff Predictor", description: "Estimate expected cutoff for SSC CGL, CHSL, MTS and other exams.", category: "SSC" },
  { slug: "ssc-rank-predictor", title: "SSC Rank Predictor", description: "Predict your probable rank from marks and exam attempt.", category: "SSC" },
  { slug: "police-height-eligibility-tool", title: "Police Height Eligibility Tool", description: "Check height and chest eligibility for police and constable posts.", category: "Police" },
  { slug: "ctet-qualifying-marks-tool", title: "CTET Qualifying Marks Tool", description: "Check CTET qualifying marks and minimum score required.", category: "Teaching" },
  { slug: "bank-final-score-predictor", title: "Bank Final Score Predictor", description: "Predict final score after mains and interview for banking exams.", category: "Banking" },
]
