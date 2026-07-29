type ToolPageHeaderProps = {
  title: string
  description: string
  className?: string
}

/**
 * Tool page title + short description.
 * Back navigation lives in breadcrumb (avoids duplicate “All tools” row).
 */
export default function ToolPageHeader({
  title,
  description,
  className = "",
}: ToolPageHeaderProps) {
  return (
    <header className={`tool-page-header ${className}`.trim()}>
      <h1 className="tool-page-title">{title}</h1>
      <p className="tool-page-desc">{description}</p>
    </header>
  )
}
