import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { toolItems, getToolByPath, type ToolItem } from "@/data/tools-data"
import BighaToKatthaPage from "@/components/tools/pages/BighaToKatthaPage"
import RentReceiptPage from "@/components/tools/pages/RentReceiptPage"
import CgpaToPercentagePage from "@/components/tools/pages/CgpaToPercentagePage"
import PhotoCompressorPage from "@/components/tools/pages/PhotoCompressorPage"
import SipCalculatorPage from "@/components/tools/pages/SipCalculatorPage"
import AgeCalculatorPage from "@/components/tools/pages/AgeCalculatorPage"
import GstCalculatorPage from "@/components/tools/pages/GstCalculatorPage"
import StateLandConverterPage from "@/components/tools/pages/StateLandConverterPage"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import RelatedTools from "@/components/tools/RelatedTools"
import ContentAdBand from "@/components/ContentAdBand"
import SideRailAds from "@/components/SideRailAds"

type Props = { params: Promise<{ slug: string; toolSlug: string }> }

const TOOL_PAGE_REGISTRY: Record<string, React.ComponentType<any>> = {
  "land-area/bigha-to-kattha": BighaToKatthaPage,
  "land-area/bigha-to-square-feet-bihar": StateLandConverterPage,
  "land-area/bigha-to-kattha-up": StateLandConverterPage,
  "land-area/bigha-to-kattha-west-bengal": StateLandConverterPage,
  "utility/rent-receipt": RentReceiptPage,
  "education/cgpa-to-percentage": CgpaToPercentagePage,
  "utility/photo-compressor": PhotoCompressorPage,
  "utility/sip-calculator": SipCalculatorPage,
  "education/age-calculator": AgeCalculatorPage,
  "utility/gst-calculator": GstCalculatorPage,
}

function getToolPageKey(examCategory: string, toolSlug: string): string {
  return `${examCategory}/${toolSlug}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: examCategory, toolSlug } = await params
  const tool = getToolByPath(examCategory, toolSlug)
  if (!tool) return { title: "Tool not found" }
  // Layout template appends " | pkminfotech" — do not include it here.
  const title = tool.title
  const description = tool.description
  const canonicalPath = `https://www.pkminfotech.com${tool.path}`
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | pkminfotech`,
      description,
      url: canonicalPath,
      type: "website",
      siteName: "pkminfotech",
    },
    twitter: { card: "summary_large_image", title: `${title} | pkminfotech`, description },
  }
}

export function generateStaticParams() {
  return toolItems.map((t) => ({
    slug: t.examCategorySlug,
    toolSlug: t.toolSlug,
  }))
}

export default async function ToolsDetailNestedPage({ params }: Props) {
  const { slug: examCategory, toolSlug } = await params
  const tool = getToolByPath(examCategory, toolSlug)
  if (!tool) notFound()

  const basePath = `/tools/${tool.examCategorySlug}`
  const key = getToolPageKey(examCategory, toolSlug)
  const PageContent = TOOL_PAGE_REGISTRY[key]

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  }

  return (
    <main className="page-surface tool-page-shell py-1 py-md-3">
      <SideRailAds />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <div className="container" style={{ maxWidth: 900 }}>
        {PageContent ? (
          <PageContent
            title={tool.title}
            description={tool.description}
            basePath={basePath}
            defaultTargetKb={tool.defaultTargetKb}
            focusLabel={tool.focusLabel}
            pageKey={tool.slug}
          />
        ) : (
          <GenericToolPlaceholder tool={tool} />
        )}
        {/* 2nd ad — after guide content, before related tools */}
        <ContentAdBand className="tool-secondary-ad mt-3 mb-3" />
        <RelatedTools current={tool} />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ssc-cgl-hero-icons { background: linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%); }
        .ssc-cgl-hero-illustration { background: linear-gradient(135deg, #e8f4fd 0%, #d4ebfa 100%); }
        .criteria-expand-card { border-radius: 12px; overflow: hidden; }
        .criteria-expand-btn:hover { background: rgba(13, 110, 253, 0.08); }
      `,
        }}
      />
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
