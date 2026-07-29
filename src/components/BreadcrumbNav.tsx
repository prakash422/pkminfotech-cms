import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  /** Tighter spacing for tool pages */
  compact?: boolean
}

export default function BreadcrumbNav({ items, compact = false }: BreadcrumbNavProps) {
  if (!items.length) return null

  // Nearest linked parent (skip current page)
  const parents = items.slice(0, -1)
  const backItem =
    [...parents].reverse().find((item) => Boolean(item.href)) || {
      label: "Home",
      href: "/",
    }

  const backHref = backItem.href || "/"
  const backLabel = backItem.label || "Home"

  return (
    <nav aria-label="breadcrumb" className={compact ? "tool-breadcrumb" : "mb-2 mb-md-3"}>
      {/* Mobile: back only — full trail wraps and looks broken on small screens */}
      <Link href={backHref} className="tool-crumb-back d-md-none">
        <ArrowLeft size={14} strokeWidth={2.25} aria-hidden="true" />
        <span>{backLabel}</span>
      </Link>

      {/* Desktop / tablet: full trail */}
      <ol className="breadcrumb mb-0 small d-none d-md-flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={`${item.label}-${index}`}
              className={`breadcrumb-item ${isLast ? "active text-secondary" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast || !item.href ? (
                item.label
              ) : (
                <Link href={item.href} className="text-decoration-none">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
