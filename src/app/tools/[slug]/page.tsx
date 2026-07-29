import Link from "next/link"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowRight, Calculator, Sparkles } from "lucide-react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import {
  toolItems,
  toolCategories,
  getToolCategory,
  getToolsByCategory,
} from "@/data/tools-data"
import ContentAdBand from "@/components/ContentAdBand"
import SideRailAds from "@/components/SideRailAds"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getToolCategory(slug)
  if (category) {
    const title = category.name
    const description = category.description
    const canonical = `https://www.pkminfotech.com/tools/${category.slug}`
    return {
      title,
      description,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: `${title} | pkminfotech`,
        description,
        url: canonical,
        type: "website",
        siteName: "pkminfotech",
      },
      twitter: { card: "summary_large_image", title: `${title} | pkminfotech`, description },
    }
  }

  const tool = toolItems.find((t) => t.slug === slug)
  if (!tool) return { title: "Tool not found" }
  // Legacy flat tool URLs permanently redirect; keep metadata minimal.
  return {
    title: tool.title,
    description: tool.description,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://www.pkminfotech.com${tool.path}` },
  }
}

export function generateStaticParams() {
  const categoryParams = toolCategories.map((c) => ({ slug: c.slug }))
  const legacyToolParams = toolItems.map((t) => ({ slug: t.slug }))
  return [...categoryParams, ...legacyToolParams]
}

/**
 * /tools/[slug] serves:
 * - Category hubs: /tools/land-area, /tools/education, /tools/utility
 * - Legacy redirects: /tools/bigha-to-kattha-converter → canonical nested path
 */
export default async function ToolSlugOrCategoryPage({ params }: Props) {
  const { slug } = await params

  const category = getToolCategory(slug)
  if (category) {
    const tools = getToolsByCategory(category.slug)
    return (
      <main className="page-surface py-4">
        <SideRailAds />
        <div className="container" style={{ maxWidth: 1120 }}>
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Online Tools", href: "/tools" },
              { label: category.shortName || category.name },
            ]}
          />
          <section className="flat-content-section border-bottom pb-3 mb-3 mb-md-4">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <h1 className="fw-bold mb-2">{category.name}</h1>
                  <p className="text-secondary mb-0">{category.description}</p>
                </div>
                <span className="d-none d-md-inline-flex align-items-center gap-1 badge rounded-pill text-bg-primary-subtle text-primary-emphasis">
                  <Sparkles size={14} /> {tools.length} tools
                </span>
              </div>
            </div>
          </section>

          <ContentAdBand className="mb-3" />

          <section className="row g-3">
            {tools.map((tool) => (
              <div className="col-12 col-md-6 col-lg-4" key={tool.slug}>
                <article className="tool-panel h-100">
                  <div className="p-3 p-md-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle"
                        style={{ width: 34, height: 34 }}
                      >
                        <Calculator size={18} className="text-primary" />
                      </span>
                      <div className="small text-primary fw-semibold">{tool.category}</div>
                    </div>
                    <h2 className="h5 fw-semibold mb-2">{tool.title}</h2>
                    <p className="small text-secondary mb-3 flex-grow-1">{tool.description}</p>
                    <Link href={tool.path} className="align-self-start tools-cta">
                      Open Tool <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </section>

          <ContentAdBand className="mt-4" />

          <div className="text-center mt-4">
            <Link href="/tools" className="btn btn-outline-primary btn-sm">
              Browse all tools
            </Link>
          </div>
        </div>
        <style>{`
          .tools-cta {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 34px;
            padding: 0 14px;
            border-radius: 10px;
            border: 1px solid #cfe0ff;
            background: #eaf2ff;
            color: #0d6efd;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
          }
          .tools-cta:hover {
            background: #0d6efd;
            border-color: #0d6efd;
            color: #fff;
          }
        `}</style>
      </main>
    )
  }

  const tool = toolItems.find((t) => t.slug === slug)
  if (!tool) notFound()
  // Legacy flat URLs must permanently consolidate onto nested canonical paths.
  permanentRedirect(tool.path)
}
