import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import RrbNtpcNormalizationCalculatorCard from "@/components/tools/RrbNtpcNormalizationCalculatorCard"
import { Scale, FileCheck, Calculator } from "lucide-react"

const NORMALIZATION_FAQS = [
  { question: "Why does RRB NTPC use normalization?", answer: "RRB NTPC is conducted in multiple shifts. Questions and difficulty can vary between shifts. Normalization adjusts raw marks so that candidates from different shifts are compared fairly. Without it, candidates in an easier shift would have an advantage. The exact formula is given in the official RRB notification." },
  { question: "What is raw score vs normalized score?", answer: "Raw score is the marks you get from the answer key (correct answers minus negative marking). Normalized score is the adjusted score after applying the normalization formula across shifts. Merit lists are usually prepared on the basis of normalized marks. This calculator gives you an indicative normalized score based on the difficulty levels you select." },
  { question: "How do I know my shift's difficulty level?", answer: "Difficulty is often perceived from how the paper felt (easy, moderate, or tough) or from post-exam analysis and expert opinions. This tool lets you choose Easy, Moderate, or Difficult for your shift and for other shifts to see how your score might adjust. The actual normalization by RRB uses statistical data from all candidates, not self-reported difficulty." },
  { question: "Is the normalized score from this tool official?", answer: "No. This calculator uses an illustrative formula for educational purposes. The actual normalized marks are calculated and declared by the Railway Recruitment Board. Always rely on the official RRB NTPC result for your final normalized score and rank." },
  { question: "Where are RRB NTPC results published?", answer: "RRB publishes results and merit lists on the regional RRB websites and the official RRB portal. Check the notification for your exam cycle for the exact link. Use this tool only to get an idea of how normalization might affect your score." },
]

type Props = { title: string; description: string; basePath: string }

export default function NormalizationCalculatorPage({ title, description, basePath }: Props) {
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
            <Scale size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <FileCheck size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Calculator size={28} className="text-primary" />
          </span>
        </div>
      </div>
      <RrbNtpcNormalizationCalculatorCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How normalization works in RRB NTPC</h2>
          <p className="mb-2">RRB NTPC CBT is held in <strong>multiple shifts</strong>. To ensure fairness, raw marks are converted into <strong>normalized marks</strong> using a formula that accounts for difficulty variation across shifts. If your shift was tougher, your normalized score may be adjusted upward; if it was easier, it may be adjusted downward. The exact method is specified in the exam notification. This tool gives you an <strong>indicative</strong> normalized score based on the difficulty levels you select—actual normalization is done by RRB using official data.</p>
          <p className="mb-0 small text-secondary">Use this calculator after you have your raw score (from the answer key) to get an idea of your normalized marks.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Shift and difficulty</h2>
          <p className="mb-2">You can select <strong>Shift 1</strong> or <strong>Shift 2</strong> (or more, depending on the exam) and enter your <strong>raw score</strong>. Then choose how difficult your shift was compared to others (Easy, Moderate, Difficult). The calculator applies an illustrative adjustment so you can see how your score might change. In the actual exam, RRB uses statistical parameters (e.g. mean, standard deviation) of each shift to compute normalized marks. Always refer to the official result for your final score.</p>
          <p className="mb-0 small text-secondary">For other exam tools, visit our <Link href="/tools" className="text-primary">Online Tools</Link> page.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={NORMALIZATION_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
