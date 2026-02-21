/**
 * SSC exam types: slug (URL) and display names.
 * Order: Practice → Daily Quiz → Mock Test (then PYQ, Syllabus) on each exam type page.
 */

export const SSC_EXAM_TYPES = [
  { slug: "cgl", shortName: "SSC CGL", fullName: "Combined Graduate Level" },
  { slug: "chsl", shortName: "SSC CHSL", fullName: "Combined Higher Secondary Level" },
  { slug: "mts", shortName: "SSC MTS", fullName: "Multi Tasking Staff" },
  { slug: "gd-constable", shortName: "SSC GD", fullName: "GD Constable" },
  { slug: "cpo", shortName: "SSC CPO", fullName: "Sub Inspector (Delhi Police, CAPF)" },
  { slug: "je", shortName: "SSC JE", fullName: "Junior Engineer" },
  { slug: "stenographer", shortName: "SSC Stenographer", fullName: "Stenographer (Grade C & D)" },
  { slug: "selection-post", shortName: "SSC Selection Post", fullName: "Selection Post" },
] as const

export type SscExamTypeSlug = (typeof SSC_EXAM_TYPES)[number]["slug"]

export function getSscExamTypeBySlug(slug: string) {
  const clean = slug.toLowerCase().trim()
  return SSC_EXAM_TYPES.find((e) => e.slug === clean) ?? null
}
