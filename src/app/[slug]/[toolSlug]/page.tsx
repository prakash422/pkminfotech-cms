import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { toolItems, getToolByPath, type ToolItem } from "@/data/exam-platform"
import Tier1MarksCalculatorPage from "@/components/tools/pages/Tier1MarksCalculatorPage"
import Tier2MarksCalculatorPage from "@/components/tools/pages/Tier2MarksCalculatorPage"
import FinalScoreCalculatorPage from "@/components/tools/pages/FinalScoreCalculatorPage"
import AgeLimitCalculatorPage from "@/components/tools/pages/AgeLimitCalculatorPage"
import EligibilityCheckerPage from "@/components/tools/pages/EligibilityCheckerPage"
import CutoffPredictorPage from "@/components/tools/pages/CutoffPredictorPage"
import RankPredictorPage from "@/components/tools/pages/RankPredictorPage"
import NormalizationCalculatorPage from "@/components/tools/pages/NormalizationCalculatorPage"
import IbpsScoreCalculatorPage from "@/components/tools/pages/IbpsScoreCalculatorPage"
import PoliceHeightEligibilityPage from "@/components/tools/pages/PoliceHeightEligibilityPage"
import CtetQualifyingMarksPage from "@/components/tools/pages/CtetQualifyingMarksPage"
import BankFinalScorePredictorPage from "@/components/tools/pages/BankFinalScorePredictorPage"
import BreadcrumbNav from "@/components/BreadcrumbNav"

/** Params use [slug] for first segment to match app/[slug]/page.tsx (Next.js requires same name for same path level). */
type Props = { params: Promise<{ slug: string; toolSlug: string }> }

/** Maps (examCategorySlug, toolSlug) to custom page component. Enables reuse: e.g. same tool slug under different exam. */
const TOOL_PAGE_REGISTRY: Record<string, React.ComponentType<{ title: string; description: string; basePath: string }>> = {
  "ssc-cgl/tier-1-marks-calculator": Tier1MarksCalculatorPage,
  "ssc-cgl/tier-2-marks-calculator": Tier2MarksCalculatorPage,
  "ssc-cgl/final-score-calculator": FinalScoreCalculatorPage,
  "ssc-cgl/age-limit-calculator": AgeLimitCalculatorPage,
  "ssc/eligibility-checker": EligibilityCheckerPage,
  "ssc-cgl/cutoff-predictor": CutoffPredictorPage,
  "ssc-cgl/rank-predictor": RankPredictorPage,
  "rrb-ntpc/normalization-calculator": NormalizationCalculatorPage,
  "banking/ibps-score-calculator": IbpsScoreCalculatorPage,
  "police/height-eligibility-tool": PoliceHeightEligibilityPage,
  "teaching/ctet-qualifying-marks-tool": CtetQualifyingMarksPage,
  "banking/final-score-predictor": BankFinalScorePredictorPage,
}

function getToolPageKey(examCategory: string, toolSlug: string): string {
  return `${examCategory}/${toolSlug}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: examCategory, toolSlug } = await params
  const tool = getToolByPath(examCategory, toolSlug)
  if (!tool) return { title: "Tool not found | pkminfotech" }
  const title = `${tool.title} | pkminfotech`
  const description = tool.description
  const canonicalPath = tool.path
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
      siteName: "pkminfotech",
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export function generateStaticParams() {
  return toolItems.map((t) => ({
    slug: t.examCategorySlug,
    toolSlug: t.toolSlug,
  }))
}

export default async function ExamToolPage({ params }: Props) {
  const { slug: examCategory, toolSlug } = await params
  const tool = getToolByPath(examCategory, toolSlug)
  if (!tool) notFound()

  const basePath = `/${tool.examCategorySlug}`
  const key = getToolPageKey(examCategory, toolSlug)
  const PageContent = TOOL_PAGE_REGISTRY[key]

  return (
    <main className="bg-light py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        {PageContent ? (
          <PageContent title={tool.title} description={tool.description} basePath={basePath} />
        ) : (
          <GenericToolPlaceholder tool={tool} />
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ssc-cgl-hero-icons { background: linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%); }
        .ssc-cgl-hero-illustration { background: linear-gradient(135deg, #e8f4fd 0%, #d4ebfa 100%); }
        .criteria-expand-card { border-radius: 12px; overflow: hidden; }
        .criteria-expand-btn:hover { background: rgba(13, 110, 253, 0.08); }
      `}} />
    </main>
  )
}

function GenericToolPlaceholder({ tool }: { tool: ToolItem }) {
  return (
    <>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Online Tools", href: "/tools" },
          { label: tool.title },
        ]}
      />
      <h1 className="fw-bold mb-2">{tool.title}</h1>
      <p className="text-secondary mb-4">{tool.description}</p>
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 text-center text-secondary">
          <p className="mb-0">This tool is under development. Check back soon or explore other tools below.</p>
        </div>
      </section>
      <div className="text-center mb-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
