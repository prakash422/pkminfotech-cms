import type { Metadata } from "next"
import BankFinalScorePredictorPage from "@/components/tools/pages/BankFinalScorePredictorPage"
import { getToolByPath } from "@/data/exam-platform"

const TOOL = getToolByPath("banking", "final-score-predictor")
if (!TOOL) throw new Error("banking/final-score-predictor not found in exam-platform")

const TOOL_PATH = "/banking/final-score-predictor"
export const metadata: Metadata = {
  title: `${TOOL.title} | pkminfotech`,
  description: TOOL.description,
  robots: { index: true, follow: true },
  alternates: { canonical: TOOL_PATH },
  openGraph: {
    title: `${TOOL.title} | pkminfotech`,
    description: TOOL.description,
    url: TOOL_PATH,
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: { card: "summary_large_image", title: `${TOOL.title} | pkminfotech`, description: TOOL.description },
}

/** Static route so /banking/final-score-predictor is not caught by /banking/[examType]. */
export default function BankingFinalScorePredictorRoute() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <BankFinalScorePredictorPage
          title={TOOL.title}
          description={TOOL.description}
          basePath="/banking"
        />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ssc-cgl-hero-illustration { background: linear-gradient(135deg, #e8f4fd 0%, #d4ebfa 100%); }
        .criteria-expand-card { border-radius: 12px; overflow: hidden; }
        .criteria-expand-btn:hover { background: rgba(13, 110, 253, 0.08); }
      `}} />
    </main>
  )
}
