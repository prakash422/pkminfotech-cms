import { prisma } from "@/lib/prisma"

export type ExamLite = {
  id: string
  name: string
  slug: string
}

/** Known exam categories (first URL segment): ssc, rrb, banking, police, teaching, etc. */
export const EXAM_CATEGORIES = ["ssc", "rrb", "banking", "police", "teaching"] as const
export type ExamCategory = (typeof EXAM_CATEGORIES)[number]

function matchesCategory(exam: { name: string; slug: string }, category: string): boolean {
  const c = category.toLowerCase()
  const nameMatch = exam.name.toLowerCase().includes(c)
  const slugMatch = exam.slug.toLowerCase() === c || exam.slug.toLowerCase().startsWith(`${c}-`)
  return nameMatch || slugMatch
}

/** Get exams for a category (e.g. ssc -> CGL, CHSL, MTS; rrb -> NTPC, etc.) */
export async function getExamsByCategory(category: string): Promise<ExamLite[]> {
  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })
  return exams.filter((exam) => matchesCategory(exam, category))
}

/** URL segment for exam type: e.g. ssc-cgl -> cgl, rrb-ntpc -> ntpc */
export function getExamTypeSlug(examSlug: string, category: string): string {
  const prefix = `${category.toLowerCase()}-`
  const slug = examSlug.toLowerCase().trim()
  return slug.startsWith(prefix) ? slug.slice(prefix.length) : slug
}

/** Resolve exam by category + exam-type slug (e.g. ssc + cgl -> SSC CGL exam) */
export async function resolveExamByCategoryAndSlug(
  category: string,
  examTypeSlug: string
): Promise<ExamLite | null> {
  const exams = await getExamsByCategory(category)
  const clean = examTypeSlug.toLowerCase().trim()
  return (
    exams.find((e) => getExamTypeSlug(e.slug, category) === clean) ||
    exams.find((e) => e.slug === clean) ||
    exams.find((e) => e.slug === `${category}-${clean}`) ||
    exams.find((e) => e.slug.includes(clean)) ||
    null
  )
}

/** Category display name for header/breadcrumb */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ssc: "SSC",
    rrb: "RRB",
    banking: "Banking",
    police: "Police",
    teaching: "Teaching",
  }
  return labels[category.toLowerCase()] || category.toUpperCase()
}
