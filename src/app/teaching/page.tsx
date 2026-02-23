import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { TEACHING_EXAM_TYPES } from "@/lib/teaching/teaching-exam-types"

const CANONICAL = "/teaching"
export const metadata: Metadata = {
  title: "Teaching Exam Preparation | CTET, KVS, NVS, DSSSB | pkminfotech",
  description: "Free Teaching exam practice for CTET, KVS, NVS, DSSSB and other teacher recruitment exams. Choose your exam and start preparing with mock tests and PYQ.",
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Teaching Exam Preparation | CTET, KVS, NVS, DSSSB | pkminfotech",
    description: "Free Teaching exam practice for CTET, KVS, NVS, DSSSB and other teacher recruitment exams.",
    url: CANONICAL,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "Teaching Exam Preparation | pkminfotech", description: "Free Teaching exam practice for CTET, KVS, NVS, DSSSB and more." },
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
