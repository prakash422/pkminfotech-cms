import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglCutoffPredictorCard from "@/components/tools/SscCglCutoffPredictorCard"
import { GraduationCap, BarChart3, CheckCircle } from "lucide-react"

const CUTOFF_FAQS = [
  { question: "What is the cutoff for SSC CGL Tier 1?", answer: "SSC declares category-wise and post-wise cutoff marks after the exam. Tier 1 cutoffs are usually in a range that varies with difficulty and number of candidates. General category cutoffs are typically higher than reserved categories. Check the official SSC CGL result notification for the exact cutoff of your cycle." },
  { question: "How is SSC CGL cutoff calculated?", answer: "SSC uses the number of vacancies, normalized marks, and reservation rules to determine cutoff. Only candidates who score above the cutoff (and meet other criteria) are shortlisted for the next stage. The exact method is explained in the exam notification." },
  { question: "Can I qualify if I am slightly below the expected cutoff?", answer: "Expected cutoffs are estimates. Actual cutoffs may be lower or higher depending on the cycle. If you are close, wait for the official result. Also, different posts have different cutoffs; you might qualify for some posts even if not for others." },
  { question: "What is the difference between Tier 1 and Tier 2 cutoff?", answer: "Tier 1 cutoff is used to shortlist candidates for Tier 2. Tier 2 has its own cutoff and the final merit is based on combined performance. Both cutoffs are declared by SSC. Use Tier 1 or Tier 2 in the tool depending on which stage you want to check." },
  { question: "Where are official SSC CGL cutoffs published?", answer: "SSC publishes cut-off marks in the result notification and on the official website ssc.gov.in. This predictor is only for estimation; always rely on the official cutoff for your exam cycle." },
]

type Props = { title: string; description: string; basePath: string }

export default function CutoffPredictorPage({ title, description, basePath }: Props) {
  return (
    <>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Online Tools", href: "/tools" },
          { label: title },
        ]}
      />
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-2">{title}</h1>
          <p className="text-secondary mb-0 small">{description}</p>
        </div>
        <div className="d-none d-md-flex align-items-center justify-content-center gap-3 p-4 rounded-3 ssc-cgl-hero-illustration">
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <GraduationCap size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <BarChart3 size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <CheckCircle size={28} className="text-success" />
          </span>
        </div>
      </div>
      <SscCglCutoffPredictorCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How cutoff marks work in SSC CGL</h2>
          <p className="mb-2">SSC CGL has multiple tiers. After Tier 1, a cutoff is applied to shortlist candidates for Tier 2. Cutoff marks are <strong>category-wise</strong> and often <strong>post-wise</strong>. They depend on vacancies, number of candidates, difficulty, and normalization. The commission declares the minimum marks required to qualify; only those who meet or exceed the cutoff (and other criteria) move to the next stage.</p>
          <p className="mb-0 small text-secondary">This tool gives an indicative estimate based on past trends. Actual cutoffs are published by SSC in the result notification.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Tier 1 vs Tier 2 cutoffs</h2>
          <p className="mb-2">Tier 1 is the first screening stage; its cutoff decides who appears for Tier 2. Tier 2 cutoffs are applied later and the final merit list is prepared using both tiers as per the notification. Tier 1 is usually out of 200 marks (100 questions × 2); Tier 2 has different papers and marking. Select the relevant tier in the predictor and enter your score to see how you stand against an estimated cutoff.</p>
          <p className="mb-0 small text-secondary">Use our <Link href={`${basePath}/tier-1-marks-calculator`} className="text-primary">Tier 1 marks calculator</Link> or <Link href={`${basePath}/tier-2-marks-calculator`} className="text-primary">Tier 2 marks calculator</Link> to compute your raw marks first.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Factors that affect cutoff</h2>
          <p className="mb-2">Cutoff marks vary each cycle because of <strong>difficulty level</strong>, <strong>number of applicants</strong>, <strong>vacancies</strong>, and <strong>normalization</strong> across shifts. A tougher paper may lead to a lower cutoff; more vacancies or fewer candidates may also affect it. Category-wise reservation means different cutoffs for General, OBC, SC, ST, and others. This predictor uses illustrative values—always check the official SSC CGL result for your cycle.</p>
          <p className="mb-0 small text-secondary">For final combined score after Tier 1 and Tier 2, use our <Link href={`${basePath}/final-score-calculator`} className="text-primary">SSC CGL final score calculator</Link>.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={CUTOFF_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
