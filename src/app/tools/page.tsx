import Link from "next/link"
import type { Metadata } from "next"
import { toolItems } from "@/data/tools-data"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { ArrowRight, Calculator } from "lucide-react"
import ContentAdBand from "@/components/ContentAdBand"
import SideRailAds from "@/components/SideRailAds"

export const metadata: Metadata = {
  title: "Free Online Tools & Smart Calculators",
  description:
    "Convert land area measurements (Bigha to Kattha), generate printable rent receipts for HRA tax claims, convert CGPA to percentage, and compress form photos locally.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.pkminfotech.com/tools" },
  openGraph: {
    title: "Free Online Tools & Smart Calculators | pkminfotech",
    description:
      "Convert land area measurements (Bigha to Kattha), generate printable rent receipts for HRA tax claims, convert CGPA to percentage, and compress form photos locally.",
    url: "https://www.pkminfotech.com/tools",
    type: "website",
    siteName: "pkminfotech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools & Smart Calculators | pkminfotech",
    description:
      "Convert land area measurements, generate HRA rent receipts, convert CGPA to percentage, and compress images.",
  },
}

import React, { Suspense } from "react"
import ToolsDirectoryClient from "@/components/tools/ToolsDirectoryClient"

type Props = {
  searchParams?: Promise<{ category?: string }>
}

export default async function ToolsPage({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const initialCategory = resolvedParams?.category || "all"

  return (
    <main className="page-surface tool-page-shell py-2 py-md-3">
      <SideRailAds />
      <div className="container tools-hub" style={{ maxWidth: 1120 }}>
        <header className="mb-3">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h1 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Free Online Tools &amp; Calculators
            </h1>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-semibold small">
              {toolItems.length} Tools
            </span>
          </div>
          <p className="text-secondary small mb-0" style={{ maxWidth: 640 }}>
            Instant calculators for land measurements, 7th Pay salary, exam marking schemes, typing speed tests, and photo resizing — free with no registration required.
          </p>
        </header>

        <ContentAdBand className="tools-top-ad mb-2" />

        <Suspense fallback={<div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3"><p className="text-secondary small mb-0">Loading tools...</p></div>}>
          <ToolsDirectoryClient tools={toolItems} initialCategory={initialCategory} />
        </Suspense>
      </div>

      <style>{`
        .tools-hub-header {
          margin-bottom: 0.85rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eef2f7;
        }
        .tools-hub-title {
          color: #0f172a;
          font-size: clamp(1.28rem, 4.2vw, 1.65rem);
          font-weight: 750;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .tools-hub-count {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .tools-hub-desc {
          margin: 6px 0 10px;
          max-width: 36rem;
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.45;
        }
        .tools-card {
          border-radius: 12px;
        }
        .tools-card-body {
          padding: 12px 14px;
        }
        .tools-card-head {
          margin-bottom: 6px;
        }
        .tools-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          flex-shrink: 0;
        }
        .tools-category-pill {
          display: inline-flex;
          align-items: center;
          height: 22px;
          padding: 0 8px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
          font-size: 11px;
          font-weight: 700;
        }
        .tools-title {
          margin: 0 0 4px;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.015em;
          color: #0f172a;
        }
        .tools-desc {
          margin: 0;
          color: #64748b;
          font-size: 0.8125rem;
          line-height: 1.4;
        }
        .tools-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #cfe0ff;
          background: #eaf2ff;
          color: #0d6efd;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .tools-cta:hover {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
        @media (max-width: 767px) {
          .tools-hub-desc {
            font-size: 0.8125rem;
            margin: 4px 0 8px;
          }
          .tools-hub-header {
            margin-bottom: 0.7rem;
            padding-bottom: 0.65rem;
          }
          .tools-cta {
            width: 100%;
          }
          .tools-hub-grid .tool-panel.h-100 {
            height: auto !important;
          }
          .tools-desc.flex-grow-1 {
            flex-grow: 0 !important;
          }
        }
      `}</style>
    </main>
  )
}
