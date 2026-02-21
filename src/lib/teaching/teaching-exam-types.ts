/**
 * Teaching exam types - National Level only.
 */

export const TEACHING_EXAM_TYPES = [
  { slug: "ctet", shortName: "CTET", fullName: "Central Teacher Eligibility Test" },
  { slug: "kvs", shortName: "KVS", fullName: "Kendriya Vidyalaya Sangathan" },
  { slug: "nvs", shortName: "NVS", fullName: "Navodaya Vidyalaya Samiti" },
  { slug: "dsssb", shortName: "DSSSB Teacher", fullName: "Delhi Subordinate Services Selection Board" },
] as const

export function getTeachingExamTypeBySlug(slug: string) {
  const clean = slug.toLowerCase().trim()
  return TEACHING_EXAM_TYPES.find((e) => e.slug === clean) ?? null
}
