import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PracticeSetRunnerContent from "@/components/practice/PracticeSetRunnerContent"
import { prisma } from "@/lib/prisma"
import { getTeachingExamTypeBySlug } from "@/lib/teaching/teaching-exam-types"

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
    return { title: "Practice Set Not Found | PKMinfotech", description: "The requested practice set could not be found." }
  return {
    title: `${set.title} | Practice | PKMinfotech`,
    description: set.description || `Practice ${set.title} with ${set.questions.length || set.totalQuestions} MCQs.`,
  }
}

export default async function TeachingPracticeSetPage({ params }: PageProps) {
  const { examType, setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)
  if (!set) notFound()

  const config = getTeachingExamTypeBySlug(examType)
  if (!config) notFound()

  const base = `/teaching/${config.slug}`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Teaching", href: "/teaching" },
    { label: config.shortName, href: base },
    { label: "Practice", href: base },
    { label: set.title },
  ]

  return <PracticeSetRunnerContent set={set} breadcrumbItems={breadcrumbItems} />
}
