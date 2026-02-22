import Link from "next/link"
import type { Metadata } from "next"
import { mockTests } from "@/data/exam-platform"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Free Mock Tests | pkminfotech",
  description: "Take free full-length mock tests for SSC, Banking, Railway and UPSC exams.",
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
      </div>
    </main>
  )
}
