import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PracticeSetRunnerContent from "@/components/practice/PracticeSetRunnerContent"
import { prisma } from "@/lib/prisma"
import { getPoliceExamTypeBySlug } from "@/lib/police/police-exam-types"

interface PageProps {
  params: Promise<{ examType: string; setSlug: string }>
}

async function getPracticeSetBySlug(setSlug: string) {
  return prisma.practiceSet.findFirst({
    where: { slug: setSlug, isActive: true },
    include: {
      exam: true,
      state: true,
      subject: true,
      topic: true,
      questions: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)
  if (!set)
    return { title: "Practice Set Not Found | pkminfotech", description: "The requested practice set could not be found." }
  return {
    title: `${set.title} | Practice | pkminfotech`,
    description: set.description || `Practice ${set.title} with ${set.questions.length || set.totalQuestions} MCQs.`,
  }
}

export default async function PolicePracticeSetPage({ params }: PageProps) {
  const { examType, setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)
  if (!set) notFound()

  const config = getPoliceExamTypeBySlug(examType)
  if (!config) notFound()
  if ("externalLink" in config && config.externalLink) notFound()

  const base = `/police/${config.slug}`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Police", href: "/police" },
    { label: config.shortName, href: base },
    { label: "Practice", href: base },
    { label: set.title },
  ]

  return <PracticeSetRunnerContent set={set} breadcrumbItems={breadcrumbItems} />
}
