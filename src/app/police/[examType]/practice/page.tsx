import type { Metadata } from "next"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ examType: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `Practice | pkminfotech`, description: "Practice sets are on the exam page." }
}

/** Practice list is merged on landing; redirect so user is not nested. */
export default async function PoliceExamPracticeRedirect({ params }: PageProps) {
  const { examType } = await params
  redirect(`/police/${examType}`)
}
