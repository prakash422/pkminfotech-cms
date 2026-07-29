import type { LucideIcon } from "lucide-react"
import { BookOpen } from "lucide-react"

type GuideSectionHeaderProps = {
  title: string
  subtitle?: string
  icon?: LucideIcon
  label?: string
}

/** Clean guide H2 — icon as badge above title (not inline with long text). */
export default function GuideSectionHeader({
  title,
  subtitle,
  icon: Icon = BookOpen,
  label = "Guide",
}: GuideSectionHeaderProps) {
  return (
    <header className="guide-section-header">
      <div className="guide-section-label">
        <span className="guide-section-icon" aria-hidden="true">
          <Icon size={14} strokeWidth={2.25} />
        </span>
        <span>{label}</span>
      </div>
      <h2 className="guide-section-title">{title}</h2>
      {subtitle ? <p className="guide-section-sub">{subtitle}</p> : null}
    </header>
  )
}
