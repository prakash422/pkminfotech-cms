import Link from "next/link"
import type { Metadata } from "next"
import { mockTests } from "@/data/exam-platform"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import { prisma } from "@/lib/prisma"

const MOCK_TEST_FAQS = [
  {
    question: "Are mock tests free?",
    answer: "Yes. You can attempt all mock tests on this page without signup. Create an account if you want to track your scores and attempt history.",
  },
  {
    question: "How many mocks should I give before the exam?",
    answer: "Aim for at least 5–10 full-length mocks in the last 2–3 months. Focus on analysing your mistakes and improving weak sections between mocks.",
  },
  {
    question: "Where do I find PYQ for my exam?",
    answer: "Go to your exam category (SSC, Banking, RRB, etc.), select your exam type (e.g. SSC CGL, IBPS PO), and click the PYQ tab for previous year question sets.",
  },
]

const CANONICAL = "/mock-tests"
export const metadata: Metadata = {
  title: "Free Mock Tests | pkminfotech",
  description: "Take free full-length mock tests for SSC, Banking, Railway and UPSC exams. Timed tests with negative marking. Practice before the real exam.",
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Mock Tests | pkminfotech",
    description: "Take free full-length mock tests for SSC, Banking, Railway and UPSC exams.",
    url: CANONICAL,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: "Free Mock Tests | pkminfotech", description: "Free mock tests for SSC, Banking, Railway and UPSC exams." },
}

interface MockTestCardItem {
  slug: string
  title: string
  exam: string
  questions: number
  duration: number
  language?: string
}

async function getMockTests(): Promise<MockTestCardItem[]> {
  try {
    const dbTests = (await prisma.mockTest.findMany({
      where: { isActive: true },
      include: {
        exam: true,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    })) as Array<{
      mockId: string
      title: string | null
      totalQuestions: number
      durationMinutes: number
      language: string
      exam: { name: string } | null
    }>

    if (dbTests.length === 0) return mockTests

    return dbTests.map((test) => {
      const questionCount = test.totalQuestions ?? 0
      return {
        slug: test.mockId,
        title: test.title || test.mockId,
        exam: test.exam?.name || "Exam",
        questions: questionCount,
        duration: test.durationMinutes || Math.max(questionCount, 10),
        language: test.language || "en",
      }
    })
  } catch {
    return mockTests
  }
}

export default async function MockTestsPage() {
  const tests = await getMockTests()

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Mock Tests" },
          ]}
        />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Full-Length Mock Tests</h1>
            <p className="text-secondary mb-0">
              Timed mock tests with instant scoring and exam-wise filtering.
            </p>
          </div>
        </section>

        <section className="row g-3">
          {tests.map((test) => (
            <div className="col-md-6" key={test.slug}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge text-bg-primary-subtle text-primary-emphasis">{test.exam}</span>
                    <span className="small text-secondary">{test.duration} min</span>
                  </div>
                  <h2 className="h5 fw-semibold">{test.title}</h2>
                  <p className="small text-secondary mb-1">{test.questions} questions • Instant result</p>
                  <p className="small text-secondary mb-3">
                    Language: {test.language === "hi" ? "Hindi" : test.language === "bilingual" ? "Bilingual" : "English"}
                  </p>
                  <Link href={`/mock-tests/${test.slug}`} className="btn btn-primary btn-sm">
                    Start Test
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </section>

        <section className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">Why take full-length mock tests before the exam?</h2>
            <p className="text-secondary mb-3">
              Mock tests simulate the real exam: same duration, similar difficulty, and negative marking. They help you practice time management, build stamina, and find weak sections. Exams like <Link href="/ssc" className="text-primary">SSC CGL</Link>, <Link href="/banking" className="text-primary">IBPS PO</Link>, <Link href="/rrb" className="text-primary">RRB NTPC</Link>, and <Link href="/ssc" className="text-primary">SSC CHSL</Link> are highly competitive; taking at least 5–10 full mocks before the exam improves your chance of scoring well. Our free mock tests are timed and give instant results so you can analyse your performance right away.
            </p>
            <p className="text-secondary mb-0">
              Use the tests above to attempt exam-wise mocks. For topic-wise practice and daily revision, try our <Link href="/daily-quiz" className="text-primary">daily quiz</Link> and <Link href="/current-affairs-quiz" className="text-primary">current affairs quiz</Link>. For exam-specific practice sets and PYQ, go to <Link href="/ssc" className="text-primary">SSC</Link>, <Link href="/banking" className="text-primary">Banking</Link>, or <Link href="/rrb" className="text-primary">RRB</Link> and select your exam type.
            </p>
          </div>
        </section>

        <section className="card border-0 shadow-sm mt-3">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">How to use mock tests effectively</h2>
            <p className="text-secondary mb-3">
              Attempt each mock in one sitting, without pausing, and stick to the time limit. After submission, review every wrong answer and note the correct concept. Track your score and section-wise accuracy over multiple mocks to see improvement. If you are weak in a section (e.g. Reasoning or Quant), go back to our <Link href="/ssc" className="text-primary">practice sets</Link> for that exam and topic before taking the next mock. Many toppers recommend one full mock per week in the last 2–3 months before the exam.
            </p>
            <p className="text-secondary mb-0">
              Our mock tests are free and work on both desktop and mobile. You can also use our <Link href="/tools" className="text-primary">online tools</Link>—SSC CGL marks calculator, IBPS score calculator, cutoff predictor—to estimate your score and plan your strategy. Good luck with your preparation.
            </p>
          </div>
        </section>

        <section className="card border-0 shadow-sm mt-3">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-semibold mb-3">Mock test vs PYQ: when to use which</h2>
            <p className="text-secondary mb-3">
              <strong>Mock tests</strong> are full-length papers that simulate the actual exam—same duration, similar difficulty, and negative marking. Use them to practice time management and to gauge your readiness. <strong>PYQ (Previous Year Questions)</strong> are real questions from past exams. They help you understand the exam pattern, repeated topics, and the level of difficulty. Ideally, cover syllabus and topic-wise practice first, then solve PYQ by year or topic, and finally take mock tests. For exam-wise PYQ, go to <Link href="/ssc" className="text-primary">SSC</Link>, <Link href="/banking" className="text-primary">Banking</Link>, or <Link href="/rrb" className="text-primary">RRB</Link>, select your exam (e.g. SSC CGL, IBPS PO), and open the <strong>PYQ</strong> tab on that exam’s page.
            </p>
            <p className="text-secondary mb-0">
              Combine <Link href="/daily-quiz" className="text-primary">daily quiz</Link> and <Link href="/current-affairs-quiz" className="text-primary">current affairs quiz</Link> for everyday practice. Use this page for full mocks and the exam-specific pages for practice sets and PYQ.
            </p>
          </div>
        </section>

        <FaqAccordion title="FAQ" items={MOCK_TEST_FAQS} />

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-outline-primary btn-sm me-2">Home</Link>
          <Link href="/daily-quiz" className="btn btn-outline-primary btn-sm me-2">Daily Quiz</Link>
          <Link href="/current-affairs-quiz" className="btn btn-outline-primary btn-sm me-2">Current Affairs Quiz</Link>
          <Link href="/tools" className="btn btn-outline-primary btn-sm">Online Tools</Link>
        </div>
      </div>
    </main>
  )
}
