"use client"

import React from "react"
import ToolHeaderHero, { FilterChip } from "@/components/tools/ToolHeaderHero"

type ToolPageHeaderProps = {
  title: string
  description: string
  badgeText?: string
  badgeVariant?: string
  chips?: FilterChip[]
  className?: string
}

export default function ToolPageHeader({
  title,
  description,
  badgeText = "Free Online Tool",
  chips,
  className = "",
}: ToolPageHeaderProps) {
  return (
    <div className={`tool-page-header-unified ${className}`.trim()}>
      <ToolHeaderHero
        title={title}
        description={description}
        badgeText={badgeText}
        chips={chips}
      />
    </div>
  )
}

