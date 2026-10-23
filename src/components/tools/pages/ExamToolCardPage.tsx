"use client"

import React from "react"
import { HelpCircle, CheckCircle2 } from "lucide-react"
import ToolHeaderHero, { FilterChip } from "@/components/tools/ToolHeaderHero"
import ToolSidebar, { UsefulLinkItem } from "@/components/tools/ToolSidebar"

interface ExamToolCardPageProps {
  title: string
  description: string
  basePath: string
  currentPath?: string
  CardComponent: React.ComponentType<{ basePath?: string }>
  badgeText?: string
  scoringRules?: { label: string; value: string }[]
  tips?: string[]
}

const SSC_FILTER_CHIPS = [
  { label: "Tier 1 Marks", path: "/tools/ssc/ssc-cgl-tier-1-marks-calculator" },
  { label: "Tier 2 (390M)", mobileLabel: "Tier 2", path: "/tools/ssc/ssc-cgl-tier-2-marks-calculator" },
  { label: "Final Score", path: "/tools/ssc/ssc-cgl-final-score-calculator" },
  { label: "Rank Predictor", mobileLabel: "Rank", path: "/tools/ssc/ssc-cgl-rank-predictor" },
  { label: "7th Pay Salary", mobileLabel: "Salary", path: "/tools/ssc/7th-pay-salary-calculator" },
  { label: "All SSC tools", path: "/tools/ssc" },
]

const BANKING_FILTER_CHIPS = [
  { label: "IBPS PO / Clerk", path: "/tools/banking/ibps-score-calculator" },
  { label: "Final Merit (80:20)", path: "/tools/banking/bank-final-score-predictor" },
  { label: "All Banking Tools", path: "/tools/banking" },
]

const RAILWAY_FILTER_CHIPS = [
  { label: "RRB NTPC Normalization", path: "/tools/railway/rrb-ntpc-normalization-calculator" },
  { label: "All Railway Tools", path: "/tools/railway" },
]

const ELIGIBILITY_FILTER_CHIPS = [
  { label: "CTET Qualifying", path: "/tools/eligibility/ctet-qualifying-marks" },
  { label: "Police Height", path: "/tools/eligibility/police-height-eligibility" },
  { label: "All Eligibility Tools", path: "/tools/eligibility" },
]

export default function ExamToolCardPage({
  title,
  description,
  basePath,
  currentPath,
  CardComponent,
  badgeText = "Official Marking Scheme",
  scoringRules = [
    { label: "Correct Response", value: "+2 Marks (or as per exam tier)" },
    { label: "Negative Marking", value: "-0.50 Marks (1/4th or 1/3rd penalty)" },
    { label: "Unattempted Questions", value: "0 Marks" },
  ],
  tips = [
    "Verify with the official answer key response sheet PDF released on the commission portal.",
    "Normalization shift variations depend on average shift difficulty scores across all exam days.",
    "Category-wise cutoffs (UR, OBC, EWS, SC, ST) vary each year based on vacancies and candidate count."
  ]
}: ExamToolCardPageProps) {
  const activePath = currentPath || ""
  
  const categoryChips = 
    (basePath.includes("banking") || activePath.includes("/banking")) ? BANKING_FILTER_CHIPS :
    (basePath.includes("railway") || activePath.includes("/railway")) ? RAILWAY_FILTER_CHIPS :
    (basePath.includes("eligibility") || activePath.includes("/eligibility")) ? ELIGIBILITY_FILTER_CHIPS :
    (basePath.includes("ssc") || activePath.includes("/ssc")) ? SSC_FILTER_CHIPS :
    []

  const chips: FilterChip[] = categoryChips.map(c => ({
    label: c.label,
    mobileLabel: (c as any).mobileLabel,
    href: c.path,
    active: activePath ? activePath === c.path : false
  }))

  const usefulLinks: UsefulLinkItem[] = [
    { label: "How Scoring Scheme Works", href: "#scoring-rules" },
    { label: "Important Tips for Aspirants", href: "#tips" },
    { label: "Answer Key Verification Guide", href: "#scoring-rules" },
    { label: "All India Cutoff Trends", href: "/latest" },
  ]

  const cleanCategorySlug = basePath.replace("/tools/", "") || "ssc"
  const cleanCategoryName = 
    cleanCategorySlug === "ssc" ? "SSC Calculators" :
    cleanCategorySlug === "banking" ? "Banking Tools" :
    cleanCategorySlug === "railway" ? "Railway Tools" :
    cleanCategorySlug === "eligibility" ? "Eligibility Checkers" : "Related Tools"

  return (
    <div className="exam-tool-page-wrapper">
      {/* 1. Unified Hero Header (Self-contained with WhatsApp & Share, clean badge, no duplicates) */}
      <ToolHeaderHero
        title={title}
        description={description}
        chips={chips}
        badgeText={badgeText || "Official Marking Scheme"}
      />

      {/* 2. Main 2-Column Responsive Layout (8-col Main + 4-col Sidebar) */}
      <div className="row g-4 align-items-start">
        {/* Main 8-Col Content */}
        <div className="col-12 col-lg-8">
          {/* The Interactive Calculator Component */}
          <div className="mb-4">
            <CardComponent basePath={basePath} />
          </div>

          {/* Clear Boundary: Interactive Tool (Above) vs Reference Guide & Documentation (Below) */}
          <div className="tool-reference-section-header mt-5 mb-3 pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span 
                className="badge rounded-pill bg-light text-primary border border-primary-subtle fw-bold px-3 py-1 text-uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
              >
                Official Reference Guide &amp; Scoring Scheme
              </span>
            </div>
            <h2 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
              Official Marking Formula, Cutoff Scheme &amp; Guidelines
            </h2>
            <p className="text-secondary small mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Standard evaluation rules, penalty parameters, and normalization criteria issued by the commission.
            </p>
          </div>

          {/* Scoring Rules / How It Works Card */}
          <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white p-3.5 p-md-4" id="scoring-rules" style={{ border: "1px solid #e2e8f0" }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 34, height: 34, backgroundColor: "#eff6ff" }}
              >
                <HelpCircle size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: "1rem" }}>
                  Commission Marking Scheme Breakdown
                </h3>
                <span className="text-secondary small" style={{ fontSize: "0.75rem" }}>
                  Official score calculation formula applied on answer key sheets
                </span>
              </div>
            </div>
            
            <div className="row g-3 mb-3.5">
              {scoringRules.map((rule, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <div className="p-3 bg-light rounded-3 border d-flex flex-column justify-content-between h-100">
                    <span className="text-secondary mb-1.5 fw-semibold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                      {rule.label}
                    </span>
                    <span className="fw-bold text-dark" style={{ fontSize: "1rem", lineHeight: 1.3 }}>
                      {rule.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-top" id="tips">
              <strong className="text-dark d-block mb-2 fw-bold" style={{ fontSize: "0.9rem" }}>
                Important Guidelines for Candidates:
              </strong>
              <div className="d-flex flex-column gap-2">
                {tips.map((tip, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-secondary" style={{ fontSize: "0.875rem", lineHeight: 1.55 }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4-Col Sticky Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 90 }}>
            <ToolSidebar
              categorySlug={cleanCategorySlug}
              categoryName={cleanCategoryName}
              currentPath={activePath || basePath}
              usefulLinks={usefulLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
