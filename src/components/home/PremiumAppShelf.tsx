"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Trophy,
  Globe2,
  Smartphone,
  MonitorCheck,
  TrendingUp,
  HeartPulse,
  GraduationCap,
  Calculator,
  Receipt,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { toolItems } from "@/data/tools-data"

interface ToolTileItem {
  title: string
  href: string
  categorySlug: string
  badgeText: string
  badgeVariant: "primary" | "success" | "warning" | "info" | "secondary"
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBg: string
  iconColor: string
}

const TOOL_TILES: ToolTileItem[] = [
  // Top Featured
  {
    title: "7th Pay Commission Salary Calculator",
    href: "/tools/ssc/7th-pay-salary-calculator",
    categorySlug: "ssc",
    badgeText: "50% DA Revised",
    badgeVariant: "primary",
    icon: Calculator,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Gaj to Square Feet & Plot Cost",
    href: "/tools/land-area/gaj-to-square-feet",
    categorySlug: "land-area",
    badgeText: "1 Gaj = 9 Sq Ft",
    badgeVariant: "success",
    icon: Globe2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Govt Exam Signature & Photo Resizer",
    href: "/tools/utility/signature-resizer-10-to-20-kb",
    categorySlug: "utility",
    badgeText: "10KB – 20KB JPG",
    badgeVariant: "warning",
    icon: Smartphone,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "SSC & Court Typing Speed Test",
    href: "/tools/ssc/typing-speed-test",
    categorySlug: "ssc",
    badgeText: "Net WPM & KDPH",
    badgeVariant: "info",
    icon: MonitorCheck,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  // SSC Calculators
  {
    title: "SSC CGL Tier 1 Marks Calculator",
    href: "/tools/ssc/ssc-cgl-tier-1-marks-calculator",
    categorySlug: "ssc",
    badgeText: "Tier 1 Marking",
    badgeVariant: "secondary",
    icon: Trophy,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "SSC CGL Tier 2 Merit Score (390)",
    href: "/tools/ssc/ssc-cgl-tier-2-marks-calculator",
    categorySlug: "ssc",
    badgeText: "390 Merit Scheme",
    badgeVariant: "secondary",
    icon: Trophy,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "SSC CGL Cutoff Predictor",
    href: "/tools/ssc/ssc-cgl-cutoff-predictor",
    categorySlug: "ssc",
    badgeText: "Category Safe Score",
    badgeVariant: "secondary",
    icon: TrendingUp,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    title: "SSC CGL Rank Predictor",
    href: "/tools/ssc/ssc-cgl-rank-predictor",
    categorySlug: "ssc",
    badgeText: "AIR Percentile",
    badgeVariant: "secondary",
    icon: Trophy,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  // Land Converters
  {
    title: "Bigha to Kattha & Dhur Converter",
    href: "/tools/land-area/bigha-to-kattha",
    categorySlug: "land-area",
    badgeText: "State-Wise Units",
    badgeVariant: "success",
    icon: Globe2,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    title: "Bigha to Square Feet (Bihar)",
    href: "/tools/land-area/bigha-to-square-feet-bihar",
    categorySlug: "land-area",
    badgeText: "27,225 Sq Ft / Bigha",
    badgeVariant: "success",
    icon: Globe2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Bigha to Kattha (Eastern UP)",
    href: "/tools/land-area/bigha-to-kattha-up",
    categorySlug: "land-area",
    badgeText: "20 Biswa Standard",
    badgeVariant: "success",
    icon: Globe2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  // Railway & Banking
  {
    title: "RRB NTPC Normalization Calculator",
    href: "/tools/railway/rrb-ntpc-normalization-calculator",
    categorySlug: "railway",
    badgeText: "Railway Formula",
    badgeVariant: "info",
    icon: TrendingUp,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    title: "Bank 80:20 Final Merit Calculator",
    href: "/tools/banking/bank-final-score-predictor",
    categorySlug: "railway",
    badgeText: "Mains + Interview",
    badgeVariant: "info",
    icon: Trophy,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  // Eligibility & Physical
  {
    title: "Police Constable & SI Height Check",
    href: "/tools/eligibility/police-height-eligibility",
    categorySlug: "eligibility",
    badgeText: "UP / Bihar / GD PST",
    badgeVariant: "warning",
    icon: HeartPulse,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "CTET Qualifying Marks & Cutoff",
    href: "/tools/eligibility/ctet-qualifying-marks",
    categorySlug: "eligibility",
    badgeText: "60% / 55% Criteria",
    badgeVariant: "warning",
    icon: GraduationCap,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  // Utilities & Education
  {
    title: "HRA Rent Receipt Generator",
    href: "/tools/utility/rent-receipt",
    categorySlug: "utility",
    badgeText: "PDF Download",
    badgeVariant: "secondary",
    icon: Receipt,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    title: "GST Invoice Calculator",
    href: "/tools/utility/gst-calculator",
    categorySlug: "utility",
    badgeText: "5%, 12%, 18%, 28%",
    badgeVariant: "secondary",
    icon: Receipt,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "CGPA to Percentage Converter",
    href: "/tools/education/cgpa-to-percentage",
    categorySlug: "education",
    badgeText: "CBSE / AKTU / VTU",
    badgeVariant: "secondary",
    icon: GraduationCap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
]

const CATEGORY_FILTERS = [
  { id: "featured", label: "🔥 Top Featured" },
  { id: "ssc", label: "🏛️ SSC & Central Govt" },
  { id: "land-area", label: "🌾 Land & Plot Units" },
  { id: "utility", label: "⚡ Utilities & Images" },
  { id: "railway", label: "🚆 Railway & Banking" },
  { id: "eligibility", label: "👮 Eligibility & Police" },
  { id: "education", label: "🎓 Education & Degree" },
]

export default function PremiumAppShelf() {
  const [activeTab, setActiveTab] = useState<string>("featured")

  const visibleTiles = useMemo(() => {
    if (activeTab === "featured") {
      return TOOL_TILES.slice(0, 8)
    }
    return TOOL_TILES.filter((t) => t.categorySlug === activeTab)
  }, [activeTab])

  return (
    <div className="premium-app-shelf my-4">
      {/* Shelf Header */}
      <div className="d-flex align-items-center justify-content-between mb-2.5">
        <div className="d-flex align-items-center gap-2">
          <span className="p-1.5 rounded-3 bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center">
            <Sparkles size={15} />
          </span>
          <span className="fw-bold text-dark" style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}>
            Instant Calculators &amp; Converters
          </span>
        </div>

        <Link
          href="/tools"
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 text-secondary hover:text-dark border-secondary-subtle"
          style={{ fontSize: "0.8rem" }}
        >
          <span>All 26 Tools</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Category Pills Switcher (Horizontal scroll, zero clutter) */}
      <div className="d-flex gap-2 overflow-x-auto pb-2 mb-3 shelf-pills-bar" style={{ scrollbarWidth: "none" }}>
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = activeTab === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition text-nowrap flex-shrink-0 ${
                isActive
                  ? "btn-dark shadow-sm"
                  : "btn-light text-secondary border border-light-subtle bg-white"
              }`}
              style={{ fontSize: "0.8125rem" }}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* App Tiles Grid (Clean, Uniform Heights, Zero Paragraph Clutter) */}
      <div className="row g-2.5 g-md-3">
        {visibleTiles.map((tool) => {
          const IconComp = tool.icon
          return (
            <div key={tool.href} className="col-12 col-md-6 col-lg-3">
              <Link href={tool.href} className="text-decoration-none">
                <div className="app-tile card border rounded-4 p-2.5 p-md-3 h-100 transition position-relative">
                  <div className="d-flex align-items-start gap-2.5">
                    <div
                      className={`app-tile-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5 ${tool.iconBg}`}
                      style={{ width: 42, height: 42 }}
                    >
                      <IconComp size={20} className={tool.iconColor} />
                    </div>

                    <div className="flex-grow-1 overflow-hidden">
                      <h3
                        className="fw-semibold text-dark mb-1.5"
                        style={{
                          fontSize: "0.84rem",
                          lineHeight: "1.3",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.2em",
                        }}
                        title={tool.title}
                      >
                        {tool.title}
                      </h3>
                      <div className="d-flex align-items-center justify-content-between pt-0.5">
                        <span
                          className={`badge bg-${tool.badgeVariant}-subtle text-${tool.badgeVariant} rounded-pill px-2 py-0.5 fw-medium`}
                          style={{ fontSize: "0.68rem" }}
                        >
                          {tool.badgeText}
                        </span>
                        <ArrowUpRight size={14} className="text-muted app-tile-arrow opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .app-tile {
          background: #ffffff;
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .app-tile:hover {
          transform: translateY(-2px);
          border-color: #3b82f6 !important;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08) !important;
        }
        .app-tile:hover .app-tile-arrow {
          opacity: 1 !important;
          color: #2563eb !important;
          transform: translate(2px, -2px);
        }
        .app-tile-arrow {
          transition: all 0.2s ease;
        }
      `,
        }}
      />
    </div>
  )
}
