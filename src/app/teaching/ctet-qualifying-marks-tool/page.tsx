import type { Metadata } from "next"
import CtetQualifyingMarksPage from "@/components/tools/pages/CtetQualifyingMarksPage"
import { getToolByPath } from "@/data/exam-platform"

const TOOL = getToolByPath("teaching", "ctet-qualifying-marks-tool")
if (!TOOL) throw new Error("teaching/ctet-qualifying-marks-tool not found in exam-platform")

const TOOL_PATH = "/teaching/ctet-qualifying-marks-tool"
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

/** Static route so /teaching/ctet-qualifying-marks-tool is not caught by /teaching/[examType]. */
export default function TeachingCtetQualifyingMarksRoute() {
  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <CtetQualifyingMarksPage
          title={TOOL.title}
          description={TOOL.description}
          basePath="/teaching"
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
