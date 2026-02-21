import { prisma } from "@/lib/prisma"

export type SscExamLite = {
  id: string
  name: string
  slug: string
}

const isSscName = (value: string) => value.toLowerCase().includes("ssc")

export async function getSscExams(): Promise<SscExamLite[]> {
  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })
  return exams.filter((exam:any) => isSscName(exam.name) || exam.slug.startsWith("ssc"))
}

export async function resolveSscExamByShortSlug(shortSlug: string) {
  const exams = await getSscExams()
  const clean = shortSlug.toLowerCase().trim()
  return (
    exams.find((exam) => exam.slug === clean) ||
    exams.find((exam) => exam.slug === `ssc-${clean}`) ||
    exams.find((exam) => exam.slug.includes(clean))
  )
}

/** URL path segment for exam: e.g. ssc-cgl -> cgl */
export function examShortSlug(slug: string): string {
  return slug.replace(/^ssc-/, "").toLowerCase()
}
