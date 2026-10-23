import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import {
  toolItems,
  toolCategories,
  getToolCategory,
} from "@/data/tools-data"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getToolCategory(slug)
  if (category) {
    const title = category.name
    const description = category.description
    const canonical = `https://www.pkminfotech.com/tools?category=${category.slug}`
    return {
      title: `${title} | pkminfotech`,
      description,
      robots: { index: false, follow: true },
      alternates: { canonical },
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

export default async function ToolSlugOrCategoryPage({ params }: Props) {
  const { slug } = await params

  const category = getToolCategory(slug)
  if (category) {
    permanentRedirect(`/tools?category=${category.slug}`)
  }

  const tool = toolItems.find((t) => t.slug === slug)
  if (!tool) notFound()
  // Legacy flat URLs must permanently consolidate onto nested canonical paths.
  permanentRedirect(tool.path)
}

