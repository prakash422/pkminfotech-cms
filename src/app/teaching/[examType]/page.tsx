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
  const canonicalPath = `/teaching/${config?.slug ?? examType}`
  const title = `${name} | Practice, Mock Test, PYQ | pkminfotech`
  const description = `Free ${name} practice sets, mock tests, daily quiz, PYQ and syllabus. Start your Teaching exam preparation with topic-wise practice and full mocks.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
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
