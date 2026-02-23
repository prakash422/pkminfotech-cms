import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglFinalScoreCalculatorCard from "@/components/tools/SscCglFinalScoreCalculatorCard"
import { ClipboardList, Calculator, Clock, CheckCircle } from "lucide-react"

const FINAL_SCORE_FAQS = [
  { question: "How is the SSC CGL final merit list prepared?", answer: "Merit is based on the combined score from normalised Tier 1 and Tier 2 with the weightage given in the notification. Category-wise cut-offs and post preferences are then applied." },
  { question: "Do Tier 1 marks count in the final score?", answer: "Yes. Tier 1 is used for shortlisting and also contributes to the final combined score with a certain weight (often smaller than Tier 2, e.g. 1 out of 4)." },
  { question: "What is normalisation and why is it used?", answer: "Normalisation adjusts for difficulty differences across exam shifts or dates. It tries to ensure that candidates in a tougher shift are not at a disadvantage. SSC uses a statistical method described in the notification." },
  { question: "Where is the exact final score formula given?", answer: "The formula, weights and normalisation details are published in the SSC CGL notification and any corrigenda. Check ssc.gov.in for the latest year's documents." },
  { question: "Can I predict my rank from my marks?", answer: "Rank depends on how others have performed and on your category and post. You can only get an idea from previous years' cut-offs. Tools like a rank predictor give an approximate range, not the exact rank." },
]

type Props = { title: string; description: string; basePath: string }

export default function FinalScoreCalculatorPage({ title, description, basePath }: Props) {
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
        <div className="d-none d-md-flex align-items-center gap-2 p-3 rounded-3 ssc-cgl-hero-icons">
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm" style={{ width: 44, height: 44 }}>
            <ClipboardList size={22} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm" style={{ width: 44, height: 44 }}>
            <Calculator size={22} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm" style={{ width: 44, height: 44 }}>
            <Clock size={22} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm" style={{ width: 44, height: 44 }}>
            <CheckCircle size={22} className="text-success" />
          </span>
        </div>
      </div>
      <SscCglFinalScoreCalculatorCard basePath={basePath} />
      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Formula for Final Score</h2>
          <p className="mb-2">SSC does not simply add Tier 1 and Tier 2 raw marks. They normalise both tiers and then combine them using a weight. Tier 2 typically has a higher weight (e.g. 3) and Tier 1 a lower one (e.g. 1).</p>
          <div className="bg-light rounded p-3 mb-2 small">
            <strong>Final score (illustrative) = (Normalised Tier 1 × weight₁) + (Normalised Tier 2 × weight₂)</strong>
          </div>
          <p className="mb-0 small text-secondary">The calculator on this page lets you add Tier 1 and Tier 2 raw scores for a quick total. For the actual merit score, SSC uses the normalised values and weights announced in the notification.</p>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Rules That Affect Your Final Score</h2>
          <ul className="mb-0">
            <li><strong>Normalisation:</strong> Raw marks are converted to a common scale so that different shifts or dates are comparable. Your "final" Tier 1 and Tier 2 scores in merit are usually these normalised scores.</li>
            <li><strong>Qualifying:</strong> You must clear the minimum qualifying marks (category-wise) in both Tier 1 and Tier 2 to be considered in the final merit.</li>
            <li><strong>Weightage:</strong> The combined score is built from weighted Tier 1 and Tier 2 scores. Tier 2 often has a larger share (e.g. 1:3 or as per notice).</li>
            <li>Document verification and post-specific criteria also apply at the selection stage.</li>
          </ul>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Example: Combining Tier 1 and Tier 2</h2>
          <p className="mb-2">Assume your normalised Tier 1 score is 115 and Tier 2 score is 340. If the weight ratio is 1 : 3 (Tier 1 : Tier 2):</p>
          <div className="bg-light rounded p-3 mb-2 small">
            Tier 1 part: 115 × 1 = <strong>115</strong><br />
            Tier 2 part: 340 × 3 = <strong>1020</strong><br />
            <strong>Combined = 115 + 1020 = 1135</strong> (or as scaled in the official method)
          </div>
          <p className="mb-0 small text-secondary">Use the <Link href={`${basePath}/tier-1-marks-calculator`} className="text-primary">Tier 1</Link> and <Link href={`${basePath}/tier-2-marks-calculator`} className="text-primary">Tier 2</Link> calculators to get your raw marks first; the actual final score is computed by SSC using their normalisation and weights.</p>
        </div>
      </section>
      <FaqAccordion title="FAQ" items={FINAL_SCORE_FAQS} />
      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
