/**
 * RRB exam types: slug (URL) and display names.
 */

export const RRB_EXAM_TYPES = [
  { slug: "ntpc", shortName: "RRB NTPC", fullName: "Railway Recruitment Board NTPC" },
  { slug: "group-d", shortName: "RRB Group D", fullName: "Railway Group D" },
  { slug: "je", shortName: "RRB JE", fullName: "Junior Engineer" },
  { slug: "alp", shortName: "RRB ALP", fullName: "Assistant Loco Pilot" },
  { slug: "technician", shortName: "RRB Technician", fullName: "Technician" },
] as const

export function getRrbExamTypeBySlug(slug: string) {
  const clean = slug.toLowerCase().trim()
  return RRB_EXAM_TYPES.find((e) => e.slug === clean) ?? null
}
