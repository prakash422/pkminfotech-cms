import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { POLICE_EXAM_TYPES } from "@/lib/police/police-exam-types"

export const metadata: Metadata = {
  title: "Police Exam Preparation | Central Level CAPF, CISF, CRPF | pkminfotech",
  description: "Free Police exam practice for CAPF, CISF, CRPF. SSC GD under SSC.",
}

export default async function PoliceLandingPage() {
  const exams = POLICE_EXAM_TYPES.map((e) => ({
    slug: e.slug,
    shortName: e.shortName,
    fullName: e.fullName,
    ...("externalLink" in e && e.externalLink ? { externalLink: e.externalLink } : {}),
  }))
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Police" }]} />
        <ExamTypeCardGrid
          title="Police Exam Preparation (Central Level)"
          subtitle="Choose your exam type and start practice mock tests, daily quizzes, previous papers, and more."
          exams={exams}
          basePath="/police"
          searchPlaceholder="Search police exam..."
        />
      </div>
    </main>
  )
}
