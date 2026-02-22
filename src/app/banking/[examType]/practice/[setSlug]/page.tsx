import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PracticeSetRunnerContent from "@/components/practice/PracticeSetRunnerContent"
import { prisma } from "@/lib/prisma"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getBankingExamTypeBySlug, BANKING_EXAM_TYPES } from "@/lib/banking/banking-exam-types"

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

export default async function BankingPracticeSetPage({ params }: PageProps) {
  const { examType, setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)
  if (!set) notFound()

  const config = getBankingExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("banking", examType)
  if (!config && !examRecord) notFound()

  const category = "banking"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? BANKING_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/banking/${canonicalTypeSlug}`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Banking", href: "/banking" },
    { label: displayName, href: base },
    { label: "Practice", href: base },
    { label: set.title },
  ]

  return <PracticeSetRunnerContent set={set} breadcrumbItems={breadcrumbItems} />
}
