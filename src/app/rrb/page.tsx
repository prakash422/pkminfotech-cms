import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { RRB_EXAM_TYPES } from "@/lib/rrb/rrb-exam-types"

export const metadata: Metadata = {
  title: "RRB Exam Preparation | NTPC, Group D, JE, ALP, Technician | PKMinfotech",
  description: "Free RRB exam practice, mock tests, daily quiz for NTPC, Group D, JE, ALP, Technician.",
}

export default async function RrbLandingPage() {
  const exams = RRB_EXAM_TYPES.map((e) => ({
    slug: e.slug,
    shortName: e.shortName,
    fullName: e.fullName,
  }))
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "RRB" }]} />
        <ExamTypeCardGrid
          title="RRB Exam Preparation"
          subtitle="Choose your RRB exam type and start practice mock tests, daily quizzes, previous papers, and more."
          exams={exams}
          basePath="/rrb"
          searchPlaceholder="Search RRB exam..."
        />
      </div>
    </main>
  )
}
