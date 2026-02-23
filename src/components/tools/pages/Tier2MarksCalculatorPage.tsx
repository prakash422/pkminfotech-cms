import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglTier2CalculatorCard from "@/components/tools/SscCglTier2CalculatorCard"
import { ClipboardList, Calculator, Clock, CheckCircle } from "lucide-react"

const TIER2_FAQS = [
  { question: "Who is eligible to appear for Tier 2?", answer: "Only candidates who meet the Tier 1 cut-off (category-wise) are called for Tier 2. Tier 2 marks are used along with Tier 1 for preparing the final merit list." },
  { question: "Why is negative marking different in different sections?", answer: "SSC assigns a higher penalty (e.g. 1 mark) in sections they consider more critical. Other sections use 0.50 per wrong. The exact split is in the exam pattern PDF." },
  { question: "How do I add up my Tier 2 score?", answer: "Calculate each section using the right marks per question and negative marking, then add the section totals. Paper 1 total is 850 marks; Papers 2 and 3 have their own totals as per the notice." },
  { question: "Is Tier 2 also normalised?", answer: "SSC can apply normalisation to Tier 2 as well. The raw total you get from the formula is often converted to a normalised score for merit. Details are in the notification." },
  { question: "Where do I find the exact marks per question for my exam?", answer: "The SSC CGL notification and the exam pattern document on ssc.gov.in give the marks per question and negative marking for each section. These can change from one recruitment cycle to another." },
]

type Props = { title: string; description: string; basePath: string }

export default function Tier2MarksCalculatorPage({ title, description, basePath }: Props) {
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
      <SscCglTier2CalculatorCard basePath={basePath} />
      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How Tier 2 Marks Are Worked Out</h2>
          <p className="mb-2">Tier 2 marking is not the same in every section. In Paper 1 (computer-based), some sections deduct 1 mark per wrong answer; in others the deduction is 0.50. Paper 2 and Paper 3 usually have 0.50 per wrong.</p>
          <div className="bg-light rounded p-3 mb-2 small">
            <strong>Section score = (Correct × marks per question) − (Wrong × deduction)</strong><br />
            <span className="text-secondary">Use the calculator with the right "marks per correct" and "negative marking" for each section, then add section scores for the paper total.</span>
          </div>
          <p className="mb-0 small text-secondary">Paper 1 is common for all posts and carries 850 marks. Check the latest notification for section-wise marks and deduction.</p>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Negative Marking in Tier 2</h2>
          <ul className="mb-0">
            <li><strong>Paper 1 – Section I, II and Module I of Section III:</strong> one mark is deducted for each wrong answer.</li>
            <li><strong>Paper 1 – remaining sections:</strong> 0.50 marks are deducted per wrong answer.</li>
            <li><strong>Paper 2 (Statistics) and Paper 3 (Finance/Economics):</strong> 0.50 marks per wrong answer.</li>
            <li>Blank or unattempted questions do not carry any negative marking.</li>
          </ul>
          <p className="mt-2 mb-0 small text-secondary">Because the penalty is higher in some sections, avoid blind guessing there. Use the calculator above once per section if your paper has different rules.</p>
        </div>
      </section>
      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Sample Calculation for One Tier 2 Section</h2>
          <p className="mb-2">Suppose in a section with 3 marks per correct and 1 mark deduction per wrong, you have 35 correct and 8 wrong out of 43 attempted.</p>
          <div className="bg-light rounded p-3 mb-2 small">
            From correct: 35 × 3 = <strong>105</strong><br />
            Deduction: 8 × 1 = <strong>8</strong><br />
            <strong>Section total = 105 − 8 = 97</strong>
          </div>
          <p className="mb-0 small text-secondary">Add all such section totals to get your Paper 1 (and Paper 2/3 if applicable) score. To see how Tier 2 combines with Tier 1, use the <Link href={`${basePath}/final-score-calculator`} className="text-primary">SSC CGL final score calculator</Link>.</p>
        </div>
      </section>
      <FaqAccordion title="FAQ" items={TIER2_FAQS} />
      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
