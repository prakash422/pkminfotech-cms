import type { Metadata } from "next"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import ExamTypeCardGrid from "@/components/ExamTypeCardGrid"
import { BANKING_EXAM_TYPES } from "@/lib/banking/banking-exam-types"

const CANONICAL = "/banking"
export const metadata: Metadata = {
  title: "Banking Exam Preparation | IBPS PO, SBI PO, RBI Grade B | pkminfotech",
  description: "Free Banking exam practice, mock tests, daily quiz for IBPS PO, SBI PO, RBI Grade B, IBPS Clerk, SBI Clerk and other bank exams. Choose your exam and start preparing.",
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Banking Exam Preparation | IBPS PO, SBI PO, RBI Grade B | pkminfotech",
    description: "Free Banking exam practice, mock tests, daily quiz for IBPS, SBI, RBI and other bank exams. Choose your exam and start preparing.",
    url: CANONICAL,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "Banking Exam Preparation | pkminfotech", description: "Free Banking exam practice for IBPS, SBI, RBI and more." },
}

export default async function BankingLandingPage() {
  const exams = BANKING_EXAM_TYPES.map((e) => ({
    slug: e.slug,
    shortName: e.shortName,
    fullName: e.fullName,
  }))
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Banking" }]} />
        <ExamTypeCardGrid
          title="Banking Exam Preparation"
          subtitle="Choose your banking exam type and start practice mock tests, daily quizzes, previous papers, and more."
          exams={exams}
          basePath="/banking"
          searchPlaceholder="Search banking exam..."
        />
      </div>
    </main>
  )
}
