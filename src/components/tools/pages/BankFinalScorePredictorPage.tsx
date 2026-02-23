import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import BankFinalScorePredictorCard from "@/components/tools/BankFinalScorePredictorCard"
import { Calculator, BookOpen, ClipboardList, Award } from "lucide-react"

const BANK_FINAL_FAQS = [
  { question: "How is the final score calculated in IBPS PO/Clerk?", answer: "The final merit is usually a combination of Prelims (scaled) and Mains (scaled) marks. The exact weightage—e.g. Prelims 25%, Mains 75%—is given in the exam notification. Some exams also have an Interview stage. This predictor uses an illustrative formula; check the official advertisement for the exact calculation." },
  { question: "What are prelims and mains weightage?", answer: "Prelims is typically given a lower weight (e.g. scaled to 50 in final merit) and Mains a higher weight (e.g. 150–200) so that the main exam has more impact. The notification specifies the exact scaling. Enter your obtained and total marks in this tool to get an estimated final score." },
  { question: "Can I predict my final score before the result?", answer: "Yes, approximately. Once you have your expected or actual Prelims and Mains marks from the answer keys, you can use this predictor to see how they might combine into the final score. Actual final scores are declared by the conducting body; this tool is for estimation only." },
  { question: "Does the final score include the interview?", answer: "For exams that have an interview (e.g. IBPS PO), the final selection is often based on Mains + Interview. The exact formula is in the notification. This tool only combines Prelims and Mains; it does not include the interview stage." },
  { question: "Where is the official final merit formula?", answer: "The recruiting body (IBPS, SBI, etc.) publishes the final merit calculation in the exam notification and result notice. Use this predictor for a quick estimate; always refer to the official source for your exam cycle." },
]

type Props = { title: string; description: string; basePath: string }

export default function BankFinalScorePredictorPage({ title, description, basePath }: Props) {
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
            <Calculator size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <BookOpen size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <ClipboardList size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Award size={28} className="text-warning" />
          </span>
        </div>
      </div>
      <BankFinalScorePredictorCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How banking final merit works</h2>
          <p className="mb-2">Bank exams like <strong>IBPS PO</strong> and <strong>IBPS Clerk</strong> have Prelims and Mains. The <strong>final merit</strong> is usually a weighted combination of both—Prelims is scaled to a smaller number and Mains to a larger one so that Mains has more weight. The exact formula is in the notification. This tool gives you an <strong>estimated final score</strong> from your Prelims and Mains marks. Use it after you have your expected or actual marks from the answer keys.</p>
          <p className="mb-0 small text-secondary">For raw marks calculation, use our <Link href={`${basePath}/ibps-score-calculator`} className="text-primary">IBPS Score Calculator</Link>. Always refer to the official result for final selection.</p>
        </div>
      </section>

      <FaqAccordion title="Frequently Asked Questions – Banking Final Score" items={BANK_FINAL_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
