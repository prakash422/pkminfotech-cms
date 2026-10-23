"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Calculator,
  Globe2,
  Smartphone,
  MonitorCheck,
  TrendingUp,
  HeartPulse,
  GraduationCap,
  Trophy,
  Receipt,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react"
import type { ToolItem } from "@/data/tools-data"

interface ToolsDirectoryClientProps {
  tools: ToolItem[]
  initialCategory?: string
}

const CATEGORY_TABS = [
  { id: "all", label: "All Tools", icon: Sparkles },
  { id: "land-area", label: "Land Area", icon: Globe2 },
  { id: "ssc", label: "SSC & Govt", icon: Trophy },
  { id: "utility", label: "Utilities & Images", icon: Smartphone },
  { id: "railway", label: "Railway", icon: TrendingUp },
  { id: "banking", label: "Banking", icon: Calculator },
  { id: "eligibility", label: "Eligibility", icon: HeartPulse },
  { id: "education", label: "Education", icon: GraduationCap },
]

function getToolIcon(tool: ToolItem) {
  const cat = tool.examCategorySlug
  const slug = tool.toolSlug

  if (slug.includes("salary") || slug.includes("gst") || slug.includes("sip") || slug.includes("rent")) {
    return { Icon: Calculator, bg: "bg-blue-50", color: "text-blue-600", badgeVar: "primary" }
  }
  if (slug.includes("typing")) {
    return { Icon: MonitorCheck, bg: "bg-indigo-50", color: "text-indigo-600", badgeVar: "info" }
  }
  if (slug.includes("resizer") || slug.includes("compressor") || slug.includes("photo")) {
    return { Icon: Smartphone, bg: "bg-purple-50", color: "text-purple-600", badgeVar: "warning" }
  }
  if (cat === "land-area") {
    return { Icon: Globe2, bg: "bg-emerald-50", color: "text-emerald-600", badgeVar: "success" }
  }
  if (cat === "eligibility") {
    return { Icon: HeartPulse, bg: "bg-rose-50", color: "text-rose-600", badgeVar: "danger" }
  }
  if (cat === "education") {
    return { Icon: GraduationCap, bg: "bg-sky-50", color: "text-sky-600", badgeVar: "secondary" }
  }
  if (cat === "railway" || cat === "banking") {
    return { Icon: TrendingUp, bg: "bg-amber-50", color: "text-amber-600", badgeVar: "warning" }
  }
  return { Icon: Trophy, bg: "bg-blue-50", color: "text-blue-600", badgeVar: "primary" }
}

function getToolBadge(tool: ToolItem) {
  if (tool.focusLabel) return tool.focusLabel
  if (tool.defaultTargetKb) return `< ${tool.defaultTargetKb} KB`
  if (tool.toolSlug === "7th-pay-salary-calculator") return "50% DA Revised"
  if (tool.toolSlug === "gaj-to-square-feet") return "1 Gaj = 9 Sq Ft"
  if (tool.toolSlug === "typing-speed-test") return "Live WPM Timer"
  if (tool.toolSlug.includes("bigha")) return "State Standards"
  if (tool.toolSlug.includes("tier-1")) return "Tier 1 Marking"
  if (tool.toolSlug.includes("tier-2")) return "390 Merit Scheme"
  if (tool.toolSlug.includes("normalization")) return "Shift Formula"
  return tool.category
}

export default function ToolsDirectoryClient({ tools, initialCategory = "all" }: ToolsDirectoryClientProps) {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams?.get("category")

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (categoryFromUrl && CATEGORY_TABS.some((t) => t.id === categoryFromUrl)) {
      return categoryFromUrl
    }
    if (initialCategory && CATEGORY_TABS.some((t) => t.id === initialCategory)) {
      return initialCategory
    }
    return "all"
  })
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Sync category if query parameter changes in URL
  useEffect(() => {
    if (categoryFromUrl && CATEGORY_TABS.some((t) => t.id === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl)
    } else if (!categoryFromUrl && initialCategory === "all") {
      setSelectedCategory("all")
    }
  }, [categoryFromUrl, initialCategory])

  // Auto-scroll active tab into view horizontally
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const activeEl = document.getElementById(`tab-pill-${selectedCategory}`)
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [selectedCategory])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (categoryId === "all") {
        url.searchParams.delete("category")
      } else {
        url.searchParams.set("category", categoryId)
      }
      const newPath = url.pathname + (url.search ? url.search : "")
      window.history.replaceState(null, "", newPath)
    }
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length }
    tools.forEach((t) => {
      counts[t.examCategorySlug] = (counts[t.examCategorySlug] || 0) + 1
    })
    return counts
  }, [tools])

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.examCategorySlug === selectedCategory

      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true

      const query = searchQuery.toLowerCase().trim()
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query)
      )
    })
  }, [tools, selectedCategory, searchQuery])

  return (
    <div className="tools-directory-hub">
      {/* Search Bar & Header Controls */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-7">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute top-50 translate-middle-y text-secondary ms-3"
              />
              <input
                type="text"
                className="form-control rounded-pill ps-5 pe-5 py-2 border-secondary-subtle"
                placeholder="Search tools (e.g. 7th pay, gaj, bigha, signature, typing, cgl)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "0.875rem" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-secondary p-1"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex align-items-center justify-content-md-end gap-2 text-secondary small">
            <span className="fw-semibold text-dark">Showing:</span>
            <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded-pill">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
            </span>
            {searchQuery && (
              <button
                type="button"
                className="btn btn-link btn-sm text-primary p-0 text-decoration-none"
                onClick={() => setSearchQuery("")}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="d-flex gap-1.5 overflow-x-auto pt-3 border-top mt-3 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.id] || 0
            if (tab.id !== "all" && count === 0) return null
            const isActive = selectedCategory === tab.id
            const TabIcon = tab.icon

            return (
              <button
                key={tab.id}
                id={`tab-pill-${tab.id}`}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition text-nowrap d-inline-flex align-items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? "btn-dark shadow-sm"
                    : "btn-light text-secondary border border-light-subtle bg-light"
                }`}
                style={{ fontSize: "0.8125rem" }}
                onClick={() => handleCategorySelect(tab.id)}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
                <span
                  className={`badge rounded-pill ms-0.5 ${
                    isActive ? "bg-white text-dark" : "bg-white border text-secondary"
                  }`}
                  style={{ fontSize: "0.68rem" }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modern App Tiles Grid (Clean, Zero Paragraph Clutter) */}
      {filteredTools.length > 0 ? (
        <div className="row g-2.5 g-md-3">
          {filteredTools.map((tool) => {
            const { Icon, bg, color } = getToolIcon(tool)
            const badgeText = getToolBadge(tool)
            const targetHref = tool.path ?? `/tools/${tool.slug}`

            return (
              <div key={tool.slug} className="col-12 col-md-6 col-lg-4">
                <Link href={targetHref} className="text-decoration-none">
                  <div className="app-tile card border rounded-4 p-3 h-100 transition position-relative bg-white">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className={`app-tile-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5 ${bg}`}
                        style={{ width: 44, height: 44 }}
                      >
                        <Icon size={20} className={color} />
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <h2
                          className="fw-semibold text-dark mb-1.5"
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: "1.3",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.35em",
                          }}
                          title={tool.title}
                        >
                          {tool.title}
                        </h2>
                        <div className="d-flex align-items-center justify-content-between pt-0.5">
                          <span
                            className="badge bg-light text-secondary border rounded-pill px-2.5 py-1 fw-medium"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {badgeText}
                          </span>
                          <span className="app-tile-arrow text-primary small d-inline-flex align-items-center gap-0.5 fw-semibold">
                            <span>Open</span>
                            <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
          <div className="text-secondary mb-2">
            <Search size={36} className="text-muted" />
          </div>
          <h3 className="h6 fw-bold text-dark mb-1">No tools matched &quot;{searchQuery}&quot;</h3>
          <p className="text-secondary small mb-3">
            Try searching for another keyword like &quot;salary&quot;, &quot;plot&quot;, &quot;photo&quot;, or &quot;cgl&quot;.
          </p>
          <div>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-4"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .app-tile {
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .app-tile:hover {
          transform: translateY(-2px);
          border-color: #3b82f6 !important;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08) !important;
        }
        .app-tile:hover .app-tile-arrow {
          transform: translate(2px, -2px);
        }
        .app-tile-arrow {
          transition: transform 0.2s ease;
        }
      `,
        }}
      />
    </div>
  )
}
