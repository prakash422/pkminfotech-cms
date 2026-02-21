import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import BreadcrumbNav from "@/components/BreadcrumbNav"

export const metadata: Metadata = {
  title: "Current Affairs Quiz | Daily Current Affairs Practice | PKMinfotech",
  description: "Free current affairs quiz and daily updates for SSC, RRB and govt exam preparation.",
}

export default async function CurrentAffairsPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || "http"
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || "http://localhost:3000"
  const response = await fetch(`${baseUrl}/api/daily-quiz`, { cache: "no-store" })
  const json = response.ok ? ((await response.json()) as { data?: Array<{ id: string; quizId: string; title?: string }> }) : { data: [] }
  const quizzes = (json.data || []).slice(0, 20)

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 1120 }}>
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Current Affairs" }]} />
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <h1 className="fw-bold mb-2">Current Affairs</h1>
            <p className="text-secondary mb-0">Daily current affairs quiz for SSC, RRB and govt exams.</p>
          </div>
        </section>

        <section className="row g-3">
          {quizzes.map((quiz) => (
            <div className="col-md-6" key={quiz.id}>
              <article className="card h-100 border shadow-sm">
                <div className="card-body p-3">
                  <h2 className="h6 fw-semibold">{quiz.title || quiz.quizId}</h2>
                  <p className="small text-secondary mb-3">Daily current affairs focused quiz</p>
                  <Link href={`/daily-quiz/${quiz.quizId}`} className="btn btn-primary btn-sm">
                    Attempt Quiz
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
