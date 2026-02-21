"use client"

import { useRouter, usePathname } from "next/navigation"
import { Calendar } from "lucide-react"
import { getDateSlug } from "@/lib/current-affairs-quiz"

const BASE_PATH = "/current-affairs-quiz"

type Props = {
  /** Initial date YYYY-MM-DD or null */
  initialDate: string | null
}

export default function CurrentAffairsDateFilter({ initialDate }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`${BASE_PATH}/${getDateSlug(value)}`)
    } else {
      router.push(BASE_PATH)
    }
  }

  const handleClear = () => {
    router.push(BASE_PATH)
  }

  return (
    <section className="card border shadow-sm mb-4">
      <div className="card-body py-3">
        <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
          <label htmlFor="current-affairs-date" className="text-secondary small fw-semibold mb-0 d-flex align-items-center gap-1">
            <Calendar size={16} />
            Date:
          </label>
          <input
            id="current-affairs-date"
            type="date"
            className="form-control form-control-sm"
            style={{ width: "auto", minWidth: 160 }}
            value={initialDate ?? ""}
            onChange={handleDateChange}
            aria-label="Select date"
          />
          {initialDate && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
