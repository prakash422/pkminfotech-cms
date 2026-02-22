import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import ExamTypeLanding from "@/components/ExamTypeLanding"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getRrbExamTypeBySlug, RRB_EXAM_TYPES } from "@/lib/rrb/rrb-exam-types"
import { prisma } from "@/lib/prisma"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("rrb", examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  return {
    title: `${name} | Practice, Mock Test, PYQ | pkminfotech`,
    description: `Free ${name} practice sets, mock tests, PYQ and syllabus.`,
  }
}

export default async function RrbExamTypeLandingPage({ params }: PageProps) {
  const { examType } = await params
  const config = getRrbExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("rrb", examType)
  if (!config && !examRecord) notFound()

  const category = "rrb"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? RRB_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/rrb/${canonicalTypeSlug}`)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/rrb/${canonicalTypeSlug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  const practiceSetsRaw = examRecord
    ? await prisma.practiceSet.findMany({
        where: { examId: examRecord.id, isActive: true },
        select: {
          id: true,
          title: true,
          slug: true,
          questions: { where: { isActive: true }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : []
  const practiceSets = practiceSetsRaw.map((s: { id: string; title: string; slug: string; questions: { id: string }[] }) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    urlSlug: s.slug,
    questionCount: s.questions?.length ?? 0,
  }))

  return (
    <ExamTypeLanding
      categoryLabel="RRB"
      categoryHref="/rrb"
      displayName={displayName}
      fullName={config?.fullName}
      base={base}
      navItems={navItems}
      practiceSets={practiceSets}
    />
  )
}
