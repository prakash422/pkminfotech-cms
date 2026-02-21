const MONTH_SLUGS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
] as const

export type QuizForFilter = {
  quizId: string
  quizDate?: string | null
  createdAt?: string | null
}

/** Parse slug "march-2026" -> { year: 2026, month: 3 } (1-based month) */
export function parseMonthSlug(slug: string): { year: number; month: number } | null {
  const lower = slug.toLowerCase().trim()
  const parts = lower.split("-")
  if (parts.length < 2) return null
  const year = parseInt(parts[parts.length - 1], 10)
  if (isNaN(year) || year < 2000 || year > 2100) return null
  const monthName = parts.slice(0, -1).join("-")
  const monthIndex = MONTH_SLUGS.indexOf(monthName as (typeof MONTH_SLUGS)[number])
  if (monthIndex === -1) return null
  return { year, month: monthIndex + 1 }
}

/** Format date to slug "march-2026" */
export function getMonthSlug(date: Date): string {
  const monthName = MONTH_SLUGS[date.getMonth()]
  const year = date.getFullYear()
  return `${monthName}-${year}`
}

/** Format for display "March 2026" */
export function formatMonthLabel(year: number, month: number): string {
  const name = MONTH_SLUGS[month - 1]
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${year}`
}

/** Parse slug "21-february-2026" -> { year: 2026, month: 2, day: 21 } (month 1-based) */
export function parseDateSlug(slug: string): { year: number; month: number; day: number } | null {
  const lower = slug.toLowerCase().trim()
  const parts = lower.split("-")
  if (parts.length < 3) return null
  const day = parseInt(parts[0], 10)
  if (isNaN(day) || day < 1 || day > 31) return null
  const year = parseInt(parts[parts.length - 1], 10)
  if (isNaN(year) || year < 2000 || year > 2100) return null
  const monthName = parts.slice(1, -1).join("-")
  const monthIndex = MONTH_SLUGS.indexOf(monthName as (typeof MONTH_SLUGS)[number])
  if (monthIndex === -1) return null
  return { year, month: monthIndex + 1, day }
}

/** Format YYYY-MM-DD to slug "21-february-2026" */
export function getDateSlug(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return yyyyMmDd
  const monthName = MONTH_SLUGS[m - 1] ?? "january"
  return `${d}-${monthName}-${y}`
}

/** Get date slug from a quiz (uses quizDate or createdAt, expects ISO or YYYY-MM-DD) */
export function getQuizDateSlug(quiz: QuizForFilter): string {
  const raw = quiz.quizDate ?? quiz.createdAt
  if (!raw) return ""
  const yyyyMmDd = raw.toString().slice(0, 10)
  return getDateSlug(yyyyMmDd)
}

/** Convert parsed date slug to YYYY-MM-DD for input value */
export function dateSlugToYyyyMmDd(parsed: { year: number; month: number; day: number }): string {
  const m = String(parsed.month).padStart(2, "0")
  const d = String(parsed.day).padStart(2, "0")
  return `${parsed.year}-${m}-${d}`
}

/** Get start and end of month in UTC for comparison */
function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
  return { start, end }
}

/** Filter quizzes that fall on the given day (dateStr = YYYY-MM-DD) */
export function filterQuizzesByDate<T extends QuizForFilter>(quizzes: T[], dateStr: string): T[] {
  const [y, m, d] = dateStr.split("-").map(Number)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return quizzes
  const start = new Date(y, m - 1, d, 0, 0, 0, 0)
  const end = new Date(y, m - 1, d, 23, 59, 59, 999)
  return quizzes.filter((q) => {
    const qDate = q.quizDate ?? q.createdAt
    if (!qDate) return false
    const qd = new Date(qDate)
    return qd >= start && qd <= end
  })
}

/** Filter quizzes that fall in the given month (by quizDate or createdAt) */
export function filterQuizzesByMonth<T extends QuizForFilter>(
  quizzes: T[],
  year: number,
  month: number
): T[] {
  const { start, end } = getMonthRange(year, month)
  return quizzes.filter((q) => {
    const dateStr = q.quizDate ?? q.createdAt
    if (!dateStr) return false
    const d = new Date(dateStr)
    return d >= start && d <= end
  })
}

/** Get list of { slug, label } for months that have quizzes, sorted newest first */
export function getAvailableMonthSlugs(quizzes: QuizForFilter[]): { slug: string; label: string }[] {
  const set = new Set<string>()
  for (const q of quizzes) {
    const dateStr = q.quizDate ?? q.createdAt
    if (!dateStr) continue
    const d = new Date(dateStr)
    const slug = getMonthSlug(d)
    if (!set.has(slug)) {
      set.add(slug)
    }
  }
  const list = Array.from(set)
    .map((slug) => {
      const parsed = parseMonthSlug(slug)
      if (!parsed) return null
      return { slug, label: formatMonthLabel(parsed.year, parsed.month), ...parsed }
    })
    .filter(Boolean) as { slug: string; label: string; year: number; month: number }[]
  list.sort((a, b) => b.year - a.year || b.month - a.month)
  return list.map(({ slug, label }) => ({ slug, label }))
}
