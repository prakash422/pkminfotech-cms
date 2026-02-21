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
}

export default function ExamInternalNav({ examName, items }: ExamInternalNavProps) {
  const pathname = usePathname()

  return (
    <nav className="mb-3" aria-label={`${examName} sections`}>
      <ul className="nav nav-pills nav-fill flex-wrap gap-1 small fw-semibold">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <li key={item.href} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link rounded ${isActive ? "active" : "bg-light text-dark"}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
