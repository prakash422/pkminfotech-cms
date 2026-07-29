"use client"

import ContentAdBand from "@/components/ContentAdBand"

/**
 * Focus-point ad for tool pages — sits after calculator/results,
 * before long guide content (Cars24-style natural break).
 * Clearly labeled via ContentAdBand; hidden when printing.
 */
export default function ToolFocusAd({ className = "" }: { className?: string }) {
  return <ContentAdBand className={`tool-focus-ad d-print-none ${className}`} />
}
