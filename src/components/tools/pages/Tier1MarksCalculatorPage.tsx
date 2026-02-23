import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglTier1CalculatorCard from "@/components/tools/SscCglTier1CalculatorCard"
import { ClipboardList, Calculator, Clock, CheckCircle } from "lucide-react"

const TIER1_FAQS = [
  { question: "How many questions are there in SSC CGL Tier 1?", answer: "There are 100 questions in Tier 1, carrying 200 marks in total. The paper has four sections: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension." },
  { question: "What is the negative marking for a wrong answer in Tier 1?", answer: "For each wrong answer, 0.50 marks are cut. So four wrong answers wipe out the gain from one correct answer (2 marks)." },
  { question: "Are unattempted questions penalised?", answer: "No. Leaving a question blank gives you zero marks but no negative. Only wrong answers attract the 0.50 deduction." },
  { question: "Is the Tier 1 score normalised by SSC?", answer: "Yes. SSC uses a normalisation process across shifts and dates. The score used for shortlisting is usually the normalised one; the formula above gives you the raw marks." },
  { question: "Where can I see the official marking scheme?", answer: "The exact marking scheme and any updates are given in the SSC CGL notification and exam pattern on the official website ssc.gov.in. Always refer to the latest notification for your year." },
]

type Props = { title: string; description: string; basePath: string }

export default function Tier1MarksCalculatorPage({ title, description, basePath }: Props) {
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
      <SscCglTier1CalculatorCard basePath={basePath} />
      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Formula Used for Tier 1 Marks</h2>
          <p className="mb-2">SSC CGL Tier 1 raw marks are computed as: your correct answers multiplied by 2, minus the penalty for wrong ones. Unattempted questions do not add or subtract anything.</p>
          <div className="bg-light rounded p-3 mb-2 font-monospace small">
            <strong>Raw marks = (Number of correct × 2) − (Number of wrong × 0.50)</strong>
          </div>
          <p className="mb-0 small text-secondary">So for every 4 wrong answers you lose the benefit of 1 correct answer. Use the calculator above to plug in your numbers and verify.</p>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Negative Marking Rule in Tier 1</h2>
          <ul className="mb-0">
            <li>Each <strong>correct</strong> answer: you get <strong>+2</strong> marks.</li>
            <li>Each <strong>wrong</strong> answer: <strong>0.50 marks</strong> are deducted (one-fourth of a mark).</li>
            <li>Questions you <strong>leave blank</strong>: no marks, no deduction.</li>
          </ul>
          <p className="mt-2 mb-0 small text-secondary">Tier 1 has 100 questions and 60 minutes. Random guessing can pull your score down quickly, so attempt only when you can eliminate options or are fairly sure.</p>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Example: How Tier 1 Marks Are Calculated</h2>
          <p className="mb-2">Say you attempt 85 questions: 68 correct and 17 wrong. You leave 15 questions unattempted.</p>
          <div className="bg-light rounded p-3 mb-2 small">
            Marks from correct: 68 × 2 = <strong>136</strong><br />
            Deduction for wrong: 17 × 0.50 = <strong>8.5</strong><br />
            <strong>Tier 1 raw marks = 136 − 8.5 = 127.5</strong>
          </div>
          <p className="mb-0 small text-secondary">SSC may later apply normalization to this raw score. For combining with Tier 2, use our <Link href={`${basePath}/final-score-calculator`} className="text-primary">final score calculator</Link>.</p>
        </div>
      </section>
      <FaqAccordion title="FAQ" items={TIER1_FAQS} />
      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
