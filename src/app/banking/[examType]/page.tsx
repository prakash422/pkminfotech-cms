import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import ExamTypeLanding from "@/components/ExamTypeLanding"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getBankingExamTypeBySlug, BANKING_EXAM_TYPES } from "@/lib/banking/banking-exam-types"
import { prisma } from "@/lib/prisma"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getBankingExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("banking", examType)
  const name = examRecord?.name ?? config?.shortName ?? examType
  const canonicalSlug = config?.slug ?? (examRecord ? getExamTypeSlug(examRecord.slug, "banking") : examType)
  const canonicalPath = `/banking/${canonicalSlug}`
  const title = `${name} | Practice, Mock Test, PYQ | pkminfotech`
  const description = `Free ${name} practice sets, mock tests, daily quiz, PYQ and syllabus. Start your Banking exam preparation with topic-wise practice and full mocks.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function BankingExamTypeLandingPage({ params }: PageProps) {
  const { examType } = await params
  const config = getBankingExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("banking", examType)
  if (!config && !examRecord) notFound()

  const category = "banking"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? BANKING_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  if (canonicalTypeSlug !== examType) redirect(`/banking/${canonicalTypeSlug}`)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/banking/${canonicalTypeSlug}`
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
      categoryLabel="Banking"
      categoryHref="/banking"
      displayName={displayName}
      fullName={config?.fullName}
      base={base}
      navItems={navItems}
      practiceSets={practiceSets}
    />
  )
}
