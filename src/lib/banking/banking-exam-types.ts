/**
 * Banking exam types: slug (URL) and display names.
 */

export const BANKING_EXAM_TYPES = [
  { slug: "ibps-po", shortName: "IBPS PO", fullName: "IBPS Probationary Officer" },
  { slug: "ibps-clerk", shortName: "IBPS Clerk", fullName: "IBPS Clerk" },
  { slug: "ibps-rrb-po", shortName: "IBPS RRB PO", fullName: "IBPS RRB Probationary Officer" },
  { slug: "ibps-rrb-clerk", shortName: "IBPS RRB Clerk", fullName: "IBPS RRB Office Assistant" },
  { slug: "sbi-po", shortName: "SBI PO", fullName: "SBI Probationary Officer" },
  { slug: "sbi-clerk", shortName: "SBI Clerk", fullName: "SBI Clerk" },
  { slug: "rbi-grade-b", shortName: "RBI Grade B", fullName: "RBI Grade B Officer" },
  { slug: "rbi-assistant", shortName: "RBI Assistant", fullName: "RBI Assistant" },
] as const

export function getBankingExamTypeBySlug(slug: string) {
  const clean = slug.toLowerCase().trim()
  return BANKING_EXAM_TYPES.find((e) => e.slug === clean) ?? null
}
