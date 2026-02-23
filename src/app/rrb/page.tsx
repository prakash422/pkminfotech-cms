import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { RRB_EXAM_TYPES } from "@/lib/rrb/rrb-exam-types"

const CANONICAL = "/rrb"
export const metadata: Metadata = {
  title: "RRB Exam Preparation | NTPC, Group D, JE, ALP, Technician | pkminfotech",
  description: "Free RRB exam practice, mock tests, daily quiz for NTPC, Group D, JE, ALP, Technician and other Railway exams. Choose your exam and start preparing.",
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "RRB Exam Preparation | NTPC, Group D, JE, ALP, Technician | pkminfotech",
    description: "Free RRB exam practice, mock tests, daily quiz for NTPC, Group D, JE, ALP, Technician and other Railway exams.",
    url: CANONICAL,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "RRB Exam Preparation | pkminfotech", description: "Free RRB exam practice for NTPC, Group D, JE, ALP and more." },
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
