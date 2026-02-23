import type { Metadata } from "next"
import EligibilityCheckerPage from "@/components/tools/pages/EligibilityCheckerPage"
import { getToolByPath } from "@/data/exam-platform"

const TOOL = getToolByPath("ssc", "eligibility-checker")
if (!TOOL) throw new Error("SSC eligibility-checker tool not found in exam-platform")

export const metadata: Metadata = {
  title: `${TOOL.title} | pkminfotech`,
  description: TOOL.description,
}

/** Static route so /ssc/eligibility-checker is not caught by /ssc/[examType]. */
export default function SscEligibilityCheckerRoute() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <EligibilityCheckerPage
          title={TOOL?.title ?? ""}
          description={TOOL?.description ?? ""}
          basePath="/ssc"
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
