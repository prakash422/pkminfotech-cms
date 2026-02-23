import type { Metadata } from "next"
import IbpsScoreCalculatorPage from "@/components/tools/pages/IbpsScoreCalculatorPage"
import { getToolByPath } from "@/data/exam-platform"

const TOOL = getToolByPath("banking", "ibps-score-calculator")
if (!TOOL) throw new Error("banking/ibps-score-calculator tool not found in exam-platform")

const TOOL_PATH = "/banking/ibps-score-calculator"
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

/** Static route so /banking/ibps-score-calculator is not caught by /banking/[examType]. */
export default function BankingIbpsScoreCalculatorRoute() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <IbpsScoreCalculatorPage
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
