import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { TEACHING_EXAM_TYPES } from "@/lib/teaching/teaching-exam-types"

export const metadata: Metadata = {
  title: "Teaching Exam Preparation | CTET, KVS, NVS, DSSSB | pkminfotech",
  description: "Free Teaching exam practice for CTET, KVS, NVS, DSSSB Teacher.",
}

export default async function TeachingLandingPage() {
  const exams = TEACHING_EXAM_TYPES.map((e) => ({
    slug: e.slug,
    shortName: e.shortName,
    fullName: e.fullName,
  }))
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Teaching" }]} />
        <ExamTypeCardGrid
          title="Teaching Exam Preparation (National Level)"
          subtitle="Choose your teaching exam type and start practice mock tests, daily quizzes, previous papers, and more."
          exams={exams}
          basePath="/teaching"
          searchPlaceholder="Search teaching exam..."
        />
      </div>
    </main>
  )
}
