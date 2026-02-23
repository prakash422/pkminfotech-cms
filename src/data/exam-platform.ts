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
  /** Exam segment in URL, e.g. "ssc-cgl", "banking". Enables reuse: /ssc-cgl/tier-1-marks-calculator, /banking/tier-1-marks-calculator */
  examCategorySlug: string
  /** Tool segment in URL, e.g. "tier-1-marks-calculator", "rank-predictor". Same component can be reused across exams. */
  toolSlug: string
  /** Canonical path = /:examCategorySlug/:toolSlug */
  path: string
}

export function getToolByPath(examCategorySlug: string, toolSlug: string): ToolItem | undefined {
  return toolItems.find((t) => t.examCategorySlug === examCategorySlug && t.toolSlug === toolSlug)
}

export function getToolPath(item: ToolItem): string {
  return `/${item.examCategorySlug}/${item.toolSlug}`
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
  { slug: "ssc-cgl-tier-1-marks-calculator", title: "SSC CGL Tier 1 Marks Calculator", description: "Calculate SSC CGL Tier 1 raw marks with negative marking formula. Enter correct and wrong answers to get your expected score for Tier 1 exam.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "tier-1-marks-calculator", path: "/ssc-cgl/tier-1-marks-calculator" },
  { slug: "ssc-cgl-tier-2-marks-calculator", title: "SSC CGL Tier 2 Marks Calculator", description: "SSC CGL Tier 2 section-wise marks and negative marking rules. Calculate your Tier 2 score by section for the combined merit.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "tier-2-marks-calculator", path: "/ssc-cgl/tier-2-marks-calculator" },
  { slug: "ssc-cgl-final-score-calculator", title: "SSC CGL Final Score Calculator", description: "Combine SSC CGL Tier 1 and Tier 2 marks to get your final merit score. Uses official weightage for the current exam cycle.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "final-score-calculator", path: "/ssc-cgl/final-score-calculator" },
  { slug: "ssc-cgl-age-limit-calculator", title: "SSC CGL Age Limit Calculator", description: "Check your eligibility for SSC CGL based on age limit. Enter DOB and category to see if you meet the upper and lower age criteria.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "age-limit-calculator", path: "/ssc-cgl/age-limit-calculator" },
  { slug: "ssc-eligibility-checker", title: "SSC Eligibility Checker", description: "Verify your eligibility for SSC exams including CGL, CHSL, MTS. Check age limit, qualification, and exam-specific criteria in one place.", category: "SSC", examCategorySlug: "ssc", toolSlug: "eligibility-checker", path: "/ssc/eligibility-checker" },
  { slug: "rrb-ntpc-normalization-calculator", title: "RRB NTPC Normalization Calculator", description: "Calculate normalized marks for RRB NTPC multi-shift exam. Enter raw score and difficulty level of your shift and other shifts.", category: "Railway", examCategorySlug: "rrb-ntpc", toolSlug: "normalization-calculator", path: "/rrb-ntpc/normalization-calculator" },
  { slug: "ibps-score-calculator", title: "IBPS Score Calculator", description: "Calculate your total score in IBPS PO, Clerk and other exams with negative marking. Enter correct, incorrect and marking scheme for instant result.", category: "Banking", examCategorySlug: "banking", toolSlug: "ibps-score-calculator", path: "/banking/ibps-score-calculator" },
  { slug: "ssc-cutoff-predictor", title: "SSC CGL Cutoff Predictor", description: "Estimate expected cutoff marks for SSC CGL Tier 1 and Tier 2 by category. Enter your score to see if you are above or below expected cutoff.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "cutoff-predictor", path: "/ssc-cgl/cutoff-predictor" },
  { slug: "ssc-rank-predictor", title: "SSC CGL Rank Predictor", description: "Predict your probable rank for SSC CGL based on your marks and exam attempt. Get estimated rank and percentile band for Tier 1 or Tier 2.", category: "SSC", examCategorySlug: "ssc-cgl", toolSlug: "rank-predictor", path: "/ssc-cgl/rank-predictor" },
  { slug: "police-height-eligibility-tool", title: "Police Height Eligibility Tool", description: "Check if you meet minimum height for police and constable exams. Enter category, gender and height in cm for eligibility result.", category: "Police", examCategorySlug: "police", toolSlug: "height-eligibility-tool", path: "/police/height-eligibility-tool" },
  { slug: "ctet-qualifying-marks-tool", title: "CTET Qualifying Marks Tool", description: "Check if you meet CTET qualifying marks (60% General, 55% reserved). Enter category, Paper 1 or 2, and your score for eligibility.", category: "Teaching", examCategorySlug: "teaching", toolSlug: "ctet-qualifying-marks-tool", path: "/teaching/ctet-qualifying-marks-tool" },
  { slug: "bank-final-score-predictor", title: "Banking Final Score Predictor", description: "Predict your estimated final score for IBPS PO, Clerk and other bank exams. Enter prelims and mains marks to get combined merit score.", category: "Banking", examCategorySlug: "banking", toolSlug: "final-score-predictor", path: "/banking/final-score-predictor" },
]
