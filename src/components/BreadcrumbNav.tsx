import React from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  compact?: boolean
}

// Visual breadcrumb removed per modern clean UX requirements
export default function BreadcrumbNav(_props: BreadcrumbNavProps) {
  return null
}
