import { Search } from "lucide-react"
import type { ToolSeoProfile } from "@/data/tool-seo-data"

export default function ToolSearchIntents({ profile }: { profile: ToolSeoProfile }) {
  return (
    <section className="tool-search-intents flat-content-section border-top pt-4 mt-4">
      <div className="d-flex align-items-center gap-2 mb-2">
        <Search size={16} className="text-primary flex-shrink-0" aria-hidden="true" />
        <h2 className="h5 fw-bold text-dark mb-0">{profile.intentTitle}</h2>
      </div>
      <p className="small text-secondary mb-3">{profile.intentIntro}</p>

      <div className="row g-2">
        {profile.intents.map((intent) => (
          <div className="col-12 col-md-4" key={intent.query}>
            <div className="tool-intent-item h-100">
              <h3 className="h6 fw-bold text-dark mb-1">{intent.query}</h3>
              <p className="small text-secondary mb-0">{intent.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
