import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0 small">
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
