import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PracticeSetRunnerContent from "@/components/practice/PracticeSetRunnerContent"
import { prisma } from "@/lib/prisma"
import {
  resolveExamByCategoryAndSlug,
  getExamTypeSlug,
} from "@/lib/exam-categories"
import { getSscExamTypeBySlug, SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

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

export default async function SscPracticeSetPage({ params }: PageProps) {
  const { examType, setSlug } = await params
  const set = await getPracticeSetBySlug(setSlug)
  if (!set) notFound()

  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  if (!config && !examRecord) notFound()

  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? SSC_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  const displayName = examRecord?.name ?? config!.shortName
  const base = `/ssc/${canonicalTypeSlug}`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "SSC", href: "/ssc" },
    { label: displayName, href: base },
    { label: "Practice", href: base },
    { label: set.title },
  ]

  return <PracticeSetRunnerContent set={set} breadcrumbItems={breadcrumbItems} />
}
