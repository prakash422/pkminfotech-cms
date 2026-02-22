/**
 * Choose Your Exam section: homepage cards.
 * status: "active" = link shown; "coming_soon" = no link, show "Coming soon".
 * icon: Lucide icon name used by frontend to pick component.
 */

export type ChooseYourExamStatus = "active" | "coming_soon"

export type ChooseYourExamItem = {
  slug: string
  label: string
  href: string | null
  line: string
  icon: string
  tone: string
  status: ChooseYourExamStatus
  /** Optional badge e.g. "Most Popular", "High Demand" */
  badge?: string | null
}

export const CHOOSE_YOUR_EXAM_ITEMS: ChooseYourExamItem[] = [
  { slug: "ssc", label: "SSC", href: "/ssc", line: "CGL, CHSL, MTS & more", icon: "BookOpenCheck", tone: "feature-tone-1", status: "active", badge: "Most Popular" },
  { slug: "rrb", label: "RRB", href: "/rrb", line: "Railway jobs with practice today", icon: "Train", tone: "feature-tone-2", status: "active", badge: "High Demand" },
  { slug: "banking", label: "Banking", href: "/banking", line: "IBPS, SBI, Clerk, PO", icon: "Landmark", tone: "feature-tone-banking", status: "active" },
  { slug: "police", label: "Police", href: "/police", line: "CAPF, CBI, SI & more", icon: "Shield", tone: "feature-tone-4", status: "active" },
  { slug: "teaching", label: "Teaching", href: "/teaching", line: "CTET, KVS, NVS, DSSSB", icon: "GraduationCap", tone: "feature-tone-1", status: "active" },
  { slug: "state", label: "State Exams", href: null, line: "UPPSC, MPSC, RPSC & more", icon: "MapPin", tone: "feature-tone-2", status: "coming_soon" },
]

export function getChooseYourExamItems(): ChooseYourExamItem[] {
  return CHOOSE_YOUR_EXAM_ITEMS
}
