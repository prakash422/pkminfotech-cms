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
}

export const CHOOSE_YOUR_EXAM_ITEMS: ChooseYourExamItem[] = [
  { slug: "ssc", label: "SSC", href: "/ssc", line: "CGL, CHSL, MTS — one step closer to your goal.", icon: "BookOpenCheck", tone: "feature-tone-1", status: "active" },
  { slug: "rrb", label: "RRB", href: "/rrb", line: "Railway jobs start with practice today.", icon: "Train", tone: "feature-tone-2", status: "active" },
  { slug: "banking", label: "Banking", href: "/banking", line: "IBPS, SBI — build your banking career.", icon: "Landmark", tone: "feature-tone-3", status: "active" },
  { slug: "police", label: "Police", href: "/police", line: "CAPF, CISF, CRPF — central level preparation.", icon: "Shield", tone: "feature-tone-4", status: "active" },
  { slug: "teaching", label: "Teaching", href: "/teaching", line: "CTET, KVS, NVS, DSSSB — teach with confidence.", icon: "GraduationCap", tone: "feature-tone-1", status: "active" },
  { slug: "state", label: "State Exams", href: null, line: "Coming soon — stay tuned.", icon: "MapPin", tone: "feature-tone-2", status: "coming_soon" },
]

export function getChooseYourExamItems(): ChooseYourExamItem[] {
  return CHOOSE_YOUR_EXAM_ITEMS
}
