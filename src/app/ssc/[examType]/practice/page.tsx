import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { resolveExamByCategoryAndSlug, getExamTypeSlug } from "@/lib/exam-categories"
import { getSscExamTypeBySlug, SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `Practice | PKMinfotech`, description: "Practice sets are on the exam page." }
}

/** Practice list is merged on landing; redirect to canonical exam URL. */
export default async function SscExamPracticeRedirect({ params }: PageProps) {
  const { examType } = await params
  const config = getSscExamTypeBySlug(examType)
  const examRecord = await resolveExamByCategoryAndSlug("ssc", examType)
  const category = "ssc"
  const typeSlug = examRecord ? getExamTypeSlug(examRecord.slug, category) : examType
  const canonicalTypeSlug =
    config?.slug ?? (examRecord ? SSC_EXAM_TYPES.find((e) => e.shortName === examRecord.name)?.slug ?? typeSlug : examType)
  redirect(`/ssc/${canonicalTypeSlug}`)
}
