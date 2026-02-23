import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import IbpsScoreCalculatorCard from "@/components/tools/IbpsScoreCalculatorCard"
import { ClipboardList, Clock, Calculator } from "lucide-react"

const IBPS_FAQS = [
  { question: "What is the marking scheme for IBPS PO/Clerk?", answer: "IBPS prelims typically have 1 mark per correct answer and 0.25 marks deduction (¼) for each wrong answer. Unattempted questions have no effect. The exact scheme is given in the exam notification—some sections or exams may have different values. This calculator lets you set marks per question and negative marking to match your exam." },
  { question: "How do I use the IBPS score calculator?", answer: "Select your exam (e.g. IBPS PO), enter total questions, number of correct and incorrect answers, and the marking scheme (marks per question and negative marking per wrong answer). Click Calculate Score to get your final marks and a detailed breakdown. Use your answer key response to fill correct and incorrect counts." },
  { question: "Are unattempted questions penalized?", answer: "In standard IBPS exams, unattempted questions do not carry any penalty. Only wrong answers lead to negative marking. So your final score = (correct × marks per question) − (incorrect × negative marking). This tool does not deduct for unattempted questions." },
  { question: "Is the calculated score the same as the official score?", answer: "This calculator uses the same formula (correct marks minus negative marks). Your actual score may still differ if IBPS applies normalization or section-wise rules. Use the official answer key and result for your final score; this tool is for quick self-assessment." },
  { question: "Where can I get the official IBPS answer key?", answer: "IBPS releases the official answer key on its website (ibps.in) after the exam. Use that to count your correct and incorrect answers, then enter the values in this calculator to estimate your score before the result is declared." },
]

type Props = { title: string; description: string; basePath: string }

export default function IbpsScoreCalculatorPage({ title, description, basePath }: Props) {
  return (
    <>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Online Tools", href: "/tools" },
          { label: title },
        ]}
      />
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mb-3">
        <div>
          <h1 className="fw-bold mb-1 h5">{title}</h1>
          <p className="text-secondary mb-0 small">{description}</p>
        </div>
        <div className="d-none d-md-flex align-items-center justify-content-center gap-2 p-3 rounded-3 ssc-cgl-hero-illustration">
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <ClipboardList size={22} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Clock size={22} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Calculator size={22} className="text-primary" />
          </span>
        </div>
      </div>
      <IbpsScoreCalculatorCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-2 p-md-3">
          <h2 className="h6 fw-semibold mb-2">How IBPS scoring works</h2>
          <p className="mb-0 small">IBPS exams use <strong>negative marking</strong>: you get fixed marks per correct answer and lose a fraction (e.g. ¼ or 0.25) per wrong answer. <strong>Final score = (Correct × Marks per question) − (Incorrect × Negative marking)</strong>. Unattempted questions are not penalized. This calculator uses the same formula.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-2">
        <div className="card-body p-2 p-md-3">
          <h2 className="h6 fw-semibold mb-2">Marks per question and negative marking</h2>
          <p className="mb-0 small">Common values are <strong>+1</strong> per correct and <strong>−0.25</strong> per wrong. Use the calculator fields to match your exam notification. For more tools, see <Link href="/tools" className="text-primary">Online Tools</Link>.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={IBPS_FAQS} />

      <div className="text-center mt-3">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
