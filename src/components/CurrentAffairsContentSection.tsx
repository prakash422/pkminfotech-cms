import { BookOpen } from "lucide-react"

type Props = {
  children: React.ReactNode
  title?: string
}

export default function CurrentAffairsContentSection({ children, title = "Preparation guide" }: Props) {
  return (
    <section className="card border-0 shadow-sm mt-4 mb-4 overflow-hidden bg-white">
      <div className="card-body p-4 p-md-5">
        <h2 className="h6 fw-bold text-uppercase text-secondary mb-3 d-flex align-items-center gap-2">
          <BookOpen size={18} aria-hidden />
          {title}
        </h2>
        <div className="pe-2" style={{ lineHeight: 1.75, fontSize: "0.9375rem" }}>
          {children}
        </div>
      </div>
    </section>
  )
}
