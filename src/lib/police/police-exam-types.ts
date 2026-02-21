/**
 * Police exam types - Central Level only.
 * SSC GD is under SSC; linked from here.
 */

export const POLICE_EXAM_TYPES = [
  { slug: "ssc-gd", shortName: "SSC GD", fullName: "GD Constable (under SSC)", externalLink: "/ssc/gd-constable" as const },
  { slug: "capf", shortName: "CAPF", fullName: "Central Armed Police Forces (UPSC)" },
  { slug: "cisf-crpf", shortName: "CISF / CRPF", fullName: "CISF CRPF Recruitment" },
] as const

export function getPoliceExamTypeBySlug(slug: string) {
  const clean = slug.toLowerCase().trim()
  return POLICE_EXAM_TYPES.find((e) => e.slug === clean) ?? null
}
