import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglRankPredictorCard from "@/components/tools/SscCglRankPredictorCard"
import { ClipboardList, BarChart3, Trophy } from "lucide-react"

const RANK_FAQS = [
  { question: "How is SSC CGL rank determined?", answer: "SSC prepares the final merit list using normalized marks from Tier 1 and Tier 2 (and other stages as per the notification). Rank is the position of a candidate in that merit list. Category-wise and post-wise ranks may also be declared. This predictor gives an approximate rank based on your score—actual rank is declared by SSC in the result." },
  { question: "What is a good rank in SSC CGL?", answer: "A \"good\" rank depends on the number of vacancies and your category. Top few thousand ranks often get preferred posts. Use the official cutoff and vacancy data to see up to which rank candidates were selected in previous cycles. This tool helps you get an estimated rank from your marks." },
  { question: "Can I predict my rank before the result?", answer: "Yes, in an approximate way. Once you have your expected marks (from answer key or self-calculation), you can use rank predictors that use score distribution and past trends. This tool provides such an estimate. The actual rank is confirmed only when SSC declares the result." },
  { question: "Does category affect rank?", answer: "Yes. Merit lists are often prepared category-wise (General, OBC, SC, ST, etc.). So your rank within your category matters for post allocation. This predictor lets you select category for a more relevant estimate; actual rank is as per SSC's result notification." },
  { question: "Where is the official SSC CGL rank list?", answer: "SSC publishes the final result and merit list (with ranks) on ssc.gov.in. Use this predictor only for estimation; your actual rank will be in the official result." },
]

type Props = { title: string; description: string; basePath: string }

export default function RankPredictorPage({ title, description, basePath }: Props) {
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
            <ClipboardList size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <BarChart3 size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Trophy size={28} className="text-warning" />
          </span>
        </div>
      </div>
      <SscCglRankPredictorCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How rank is calculated in SSC CGL</h2>
          <p className="mb-2">SSC CGL rank is your <strong>position in the merit list</strong> after normalization and combination of Tier 1 and Tier 2 (as per the notification). Higher marks generally mean a better (lower) rank. The exact rank depends on how many candidates appeared, the difficulty of the paper, and the final answer key. This predictor uses your score to give an <strong>estimated rank</strong> and percentile band—it is not the official rank. SSC declares the final rank in the result.</p>
          <p className="mb-0 small text-secondary">Use our <Link href={`${basePath}/tier-1-marks-calculator`} className="text-primary">Tier 1</Link> and <Link href={`${basePath}/tier-2-marks-calculator`} className="text-primary">Tier 2</Link> marks calculators to get your expected score, then use this tool to estimate your rank.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Understanding percentile and rank</h2>
          <p className="mb-2">A <strong>percentile</strong> (e.g. Top 1%) tells you that you scored better than a certain percentage of candidates. <strong>Rank</strong> is your position (1, 2, 3, …). Lower rank is better. The predictor shows both an estimated rank number and a percentile band so you can gauge your standing. Actual rank and percentile are declared by SSC in the result notification.</p>
          <p className="mb-0 small text-secondary">For cutoff comparison, use our <Link href={`${basePath}/cutoff-predictor`} className="text-primary">SSC CGL cutoff predictor</Link>.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">What affects your rank</h2>
          <p className="mb-2">Your rank depends on <strong>your normalized marks</strong>, <strong>total candidates</strong>, and <strong>category</strong>. A tougher paper may mean lower marks for many, so the same score might fetch a better rank in a difficult cycle. Reservation and category-wise merit lists also affect where you stand. This tool gives an indicative rank based on score—use it to get an idea, and refer to the official result for the actual rank.</p>
          <p className="mb-0 small text-secondary">Always check ssc.gov.in for the final result and merit list.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={RANK_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
