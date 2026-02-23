import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import ExamTypeLanding from "@/components/ExamTypeLanding"
import { getPoliceExamTypeBySlug } from "@/lib/police/police-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examType } = await params
  const config = getPoliceExamTypeBySlug(examType)
  if (config && "externalLink" in config && config.externalLink)
    return { title: "Redirect | pkminfotech", robots: { index: false, follow: true } }
  const name = config?.shortName ?? examType
  const canonicalPath = `/police/${config?.slug ?? examType}`
  const title = `${name} | Practice, Mock Test, PYQ | pkminfotech`
  const description = `Free ${name} practice sets, mock tests, daily quiz, PYQ and syllabus. Start your Police exam preparation with topic-wise practice and full mocks.`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, url: canonicalPath, type: "website", siteName: "pkminfotech" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function PoliceExamTypeLandingPage({ params }: PageProps) {
  const { examType } = await params
  const config = getPoliceExamTypeBySlug(examType)
  if (!config) notFound()
  if ("externalLink" in config && config.externalLink) redirect(config.externalLink)

  const displayName = config.shortName
  const base = `/police/${config.slug}`
  const fullName = "fullName" in config ? config.fullName : undefined
  const navItems = [
    { label: "Practice", href: base },
    { label: "Mock Test", href: `${base}/mock-test` },
    { label: "PYQ", href: `${base}/pyq` },
    { label: "Syllabus", href: `${base}/syllabus` },
  ]

  return (
    <ExamTypeLanding
      categoryLabel="Police"
      categoryHref="/police"
      displayName={displayName}
      fullName={fullName}
      base={base}
      navItems={navItems}
    />
  )
}
