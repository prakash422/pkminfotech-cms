import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { SSC_EXAM_TYPES } from "@/lib/ssc/ssc-exam-types"

export const metadata: Metadata = {
  title: "SSC Exam Preparation | CGL, CHSL, MTS, GD, CPO, JE | pkminfotech",
  description: "Free SSC exam practice, mock tests, daily quiz and PYQ for CGL, CHSL, MTS, GD Constable, CPO, JE, Stenographer, Selection Post.",
}

export default async function SscLandingPage() {
  const exams = SSC_EXAM_TYPES.map((e) => ({
    slug: e.slug,
    shortName: e.shortName,
    fullName: e.fullName,
  }))
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "SSC" }]} />
        <ExamTypeCardGrid
          title="SSC Exam Preparation"
          subtitle="Choose your SSC exam type and start practice mock tests, daily quizzes, previous papers, and more."
          exams={exams}
          basePath="/ssc"
          searchPlaceholder="Search SSC exam..."
        />
      </div>
    </main>
  )
}
