import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { toolItems } from "@/data/exam-platform"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = toolItems.find((t) => t.slug === slug)
  if (!tool) return { title: "Tool not found | pkminfotech" }
  return {
    title: `${tool.title} | pkminfotech`,
    description: tool.description,
  }
}

/** Old /tools/[slug] URLs redirect to canonical /examCategory/toolSlug. */
export default async function ToolSlugPage({ params }: Props) {
  const { slug } = await params
  const tool = toolItems.find((t) => t.slug === slug)
  if (!tool) notFound()
  redirect(tool.path)
}
