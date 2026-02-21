import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ExamTypeLanding from "@/components/ExamTypeLanding"
import { getTeachingExamTypeBySlug } from "@/lib/teaching/teaching-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getTeachingExamTypeBySlug(examType)
  const name = config?.shortName ?? examType
  return {
    title: `${name} | Practice, Daily Quiz, Mock Test | PKMinfotech`,
    description: `Free ${name} practice sets, daily quiz, mock tests, PYQ and syllabus.`,
  }
}

export default async function TeachingExamTypeLandingPage({ params }: PageProps) {
  const { examType } = await params
  const config = getTeachingExamTypeBySlug(examType)
  if (!config) notFound()

  const displayName = config.shortName
  const base = `/teaching/${config.slug}`
  const navItems = [
    { label: "Practice", href: base },
    { label: "Daily Quiz", href: `${base}/daily-quiz` },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  return (
    <ExamTypeLanding
      categoryLabel="Teaching"
      categoryHref="/teaching"
      displayName={displayName}
      fullName={config.fullName}
      base={base}
      navItems={navItems}
    />
  )
}
