"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export type ExamNavItem = {
  label: string
  href: string
}

interface ExamInternalNavProps {
  examName: string
  items: ExamNavItem[]
  variant?: "pills" | "tabs"
  /** When on landing (pathname === basePath), first tab is shown as active */
  basePath?: string
}

export default function ExamInternalNav({ examName, items, variant = "pills", basePath }: ExamInternalNavProps) {
  const pathname = usePathname()
  const isTabs = variant === "tabs"

  return (
    <nav className="mb-3" aria-label={`${examName} sections`}>
      <ul className={`nav nav-fill flex-wrap gap-1 small fw-semibold ${isTabs ? "exam-internal-nav-tabs" : "nav-pills"}`}>
        {items.map((item, index) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") ||
            (basePath != null && pathname === basePath && index === 0)
          return (
            <li key={item.href} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link rounded ${isTabs ? (isActive ? "exam-internal-nav-tab-active" : "exam-internal-nav-tab") : isActive ? "active" : "bg-light text-dark"}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
      {isTabs && (
        <style dangerouslySetInnerHTML={{ __html: `
          .exam-internal-nav-tabs .nav-link { background: none !important; border: none; color: #64748b; border-bottom: 2px solid transparent; border-radius: 0; padding: 0.5rem 0.75rem; }
          .exam-internal-nav-tabs .nav-link:hover { color: #2563eb; }
          .exam-internal-nav-tab-active { color: #2563eb !important; border-bottom-color: #2563eb !important; font-weight: 600; }
        `}} />
      )}
    </nav>
  )
}
