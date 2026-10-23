"use client"

import React from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Lightbulb, 
  Layers, 
  Calculator, 
  Maximize2, 
  Compass, 
  FileText, 
  CheckCircle2, 
  Trophy, 
  Scale, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  GraduationCap
} from "lucide-react"
import { toolItems, getToolByPath, type ToolItem } from "@/data/tools-data"

export interface SidebarToolItem {
  title: string
  subtitle: string
  href: string
  color?: string
  bg?: string
  icon?: any
}

export interface UsefulLinkItem {
  label: string
  href: string
}

interface ToolSidebarProps {
  categorySlug?: string
  categoryName?: string
  allCategoryUrl?: string
  currentPath?: string
  customRelatedTools?: SidebarToolItem[]
  usefulLinks?: UsefulLinkItem[]
}

const DEFAULT_LAND_TOOLS: SidebarToolItem[] = [
  {
    title: "Gaj to Square Feet",
    subtitle: "Convert Gaj to Sq Ft",
    href: "/tools/land-area/gaj-to-square-feet",
    icon: Compass,
    color: "#2563eb",
    bg: "#eff6ff"
  },
  {
    title: "Square Feet to Bigha",
    subtitle: "Convert Sq Ft to Bigha",
    href: "/tools/land-area/bigha-to-square-feet-bihar",
    icon: Maximize2,
    color: "#0891b2",
    bg: "#ecfeff"
  },
  {
    title: "Bigha to Kattha (UP)",
    subtitle: "Convert Bigha to Kattha",
    href: "/tools/land-area/bigha-to-kattha-up",
    icon: Layers,
    color: "#2563eb",
    bg: "#eff6ff"
  },
  {
    title: "Kattha to Decimal",
    subtitle: "Convert Kattha to Decimal",
    href: "/tools/land-area/bigha-to-kattha-west-bengal",
    icon: Scale,
    color: "#7c3aed",
    bg: "#f5f3ff"
  },
  {
    title: "Decimal to Bigha",
    subtitle: "Convert Decimal to Bigha",
    href: "/tools/land-area/bigha-to-square-feet-bihar",
    icon: CheckCircle2,
    color: "#2563eb",
    bg: "#eff6ff"
  }
]

export default function ToolSidebar({
  categorySlug = "land-area",
  categoryName = "Land Tools",
  allCategoryUrl,
  currentPath = "",
  customRelatedTools,
  usefulLinks
}: ToolSidebarProps) {
  // Determine related tools list
  let toolsList: SidebarToolItem[] = []

  if (customRelatedTools && customRelatedTools.length > 0) {
    toolsList = customRelatedTools
  } else if (categorySlug === "land-area") {
    toolsList = DEFAULT_LAND_TOOLS.filter(t => t.href !== currentPath)
  } else {
    // Dynamically derive from toolItems
    const related = toolItems
      .filter(t => t.examCategorySlug === categorySlug && t.path !== currentPath)
      .slice(0, 5)

    const fallbackOthers = toolItems
      .filter(t => t.path !== currentPath && t.examCategorySlug !== categorySlug)
      .slice(0, Math.max(0, 5 - related.length))

    const combined = [...related, ...fallbackOthers]

    const ICON_PALETTE = [
      { icon: Calculator, color: "#2563eb", bg: "#eff6ff" },
      { icon: Trophy, color: "#0891b2", bg: "#ecfeff" },
      { icon: TrendingUp, color: "#7c3aed", bg: "#f5f3ff" },
      { icon: GraduationCap, color: "#ea580c", bg: "#fff7ed" },
      { icon: ShieldCheck, color: "#059669", bg: "#ecfdf5" },
    ]

    toolsList = combined.map((item, idx) => {
      const palette = ICON_PALETTE[idx % ICON_PALETTE.length]
      return {
        title: item.title,
        subtitle: item.description.length > 36 ? `${item.description.slice(0, 36)}...` : item.description,
        href: item.path,
        icon: palette.icon,
        color: palette.color,
        bg: palette.bg
      }
    })
  }

  const categoryLink = allCategoryUrl || (categorySlug ? `/tools?category=${categorySlug}` : "/tools")

  const defaultUsefulLinks: UsefulLinkItem[] = [
    { label: "Land Measurement Units in India", href: "#origin" },
    { label: "State-wise Bigha Conversion", href: "#regional-table" },
    { label: "Bigha vs Kattha vs Decimal", href: "#mathematics" },
    { label: "Frequently Asked Questions", href: "#faqs" },
  ]

  const linksToShow = usefulLinks && usefulLinks.length > 0 ? usefulLinks : defaultUsefulLinks

  return (
    <aside className="tool-sidebar d-flex flex-column gap-3">
      {/* Card 1: Related Tools */}
      <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white sidebar-card">
        <h3 className="h6 fw-bold text-dark mb-3 px-1" style={{ fontSize: "0.95rem" }}>
          Related {categoryName}
        </h3>

        <div className="d-flex flex-column gap-1.5">
          {toolsList.map((tool, idx) => {
            const IconComp = tool.icon || Layers
            return (
              <Link
                key={idx}
                href={tool.href}
                className="d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none sidebar-tool-link"
              >
                <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ 
                      width: 36, 
                      height: 36, 
                      backgroundColor: tool.bg || "#eff6ff" 
                    }}
                  >
                    <IconComp size={18} style={{ color: tool.color || "#2563eb" }} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.85rem", lineHeight: 1.25 }}>
                      {tool.title}
                    </div>
                    <div className="text-secondary small text-truncate" style={{ fontSize: "0.75rem", lineHeight: 1.2 }}>
                      {tool.subtitle}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-secondary flex-shrink-0 ms-2 text-opacity-50" />
              </Link>
            )
          })}
        </div>

        <div className="pt-3 mt-2 border-top text-center">
          <Link 
            href={categoryLink}
            className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 hover:underline"
            style={{ fontSize: "0.8125rem" }}
          >
            <span>View All {categoryName}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Card 2: Useful Information */}
      <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white sidebar-card">
        <div className="d-flex align-items-center gap-2 mb-3 px-1">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 26, height: 26, backgroundColor: "#ecfdf5" }}
          >
            <Lightbulb size={15} className="text-success" />
          </div>
          <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
            Useful Information
          </h3>
        </div>

        <div className="d-flex flex-column gap-2 px-1">
          {linksToShow.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-secondary text-decoration-none small d-flex align-items-center gap-2 sidebar-info-link"
              style={{ fontSize: "0.8125rem", lineHeight: 1.4 }}
            >
              <ChevronRight size={13} className="text-primary flex-shrink-0" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sidebar-card {
          border: 1px solid #eef2f6 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03) !important;
        }
        .sidebar-tool-link {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }
        .sidebar-tool-link:hover {
          background-color: #f8fafc;
        }
        .sidebar-info-link {
          transition: color 0.15s ease, transform 0.15s ease;
        }
        .sidebar-info-link:hover {
          color: #2563eb !important;
          transform: translateX(2px);
        }
      `}</style>
    </aside>
  )
}
