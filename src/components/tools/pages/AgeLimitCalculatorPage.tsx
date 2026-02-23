import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscCglAgeLimitCalculatorCard from "@/components/tools/SscCglAgeLimitCalculatorCard"
import { Calendar, Search } from "lucide-react"

const AGE_LIMIT_FAQS = [
  { question: "What is the age limit for SSC CGL?", answer: "For SSC CGL, the upper age limit is generally 30 years for General/EWS, 33 years for OBC, and 35 years for SC/ST as on 1st January of the exam year. The minimum age is usually 18 years. Post-wise and category-wise limits are given in the official notification on ssc.gov.in." },
  { question: "How is age calculated for SSC CGL?", answer: "SSC calculates your age as on 1st January of the year of the exam. Only completed years are counted. So if you were born on 2 January 1999, your age as on 1 January of that year would be 24 years. Always check the latest notification for the exact reference date." },
  { question: "Is there age relaxation for OBC and SC/ST in SSC CGL?", answer: "Yes. OBC (Non-Creamy Layer) candidates get relaxation of 3 years; SC/ST get 5 years over the general upper age limit. PwBD candidates may get additional relaxation as per the notification. Ex-servicemen and other categories also have specific relaxations—check the latest SSC CGL notification for exact rules." },
  { question: "Can I apply for SSC CGL if I am 31 years old (General)?", answer: "For General category, the upper age limit is typically 30 years as on 1st January of the exam year. If you are 31 on that date, you are not eligible unless you belong to a category that gets relaxation (e.g. OBC, SC/ST, PwBD) or you are applying for a post with a higher age limit. Always verify with the official notification." },
  { question: "Where is the official age limit for SSC CGL given?", answer: "The exact age limits, relaxations, and post-wise criteria are published in the SSC CGL notification and corrigenda on the official website ssc.gov.in. Use this calculator only as a guide and confirm with the latest notification for your application year." },
]

type Props = { title: string; description: string; basePath: string }

export default function AgeLimitCalculatorPage({ title, description, basePath }: Props) {
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
            <Calendar size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm px-3 py-2">
            <span className="fs-4 fw-bold text-primary">25</span>
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Search size={28} className="text-primary" />
          </span>
        </div>
      </div>
      <SscCglAgeLimitCalculatorCard basePath={basePath} />
      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How age is calculated for SSC CGL</h2>
          <p className="mb-2">SSC uses your age as on <strong>1st January of the year of the exam</strong> (for the current cycle, that is 1 January of the exam year). Only completed years are counted—the commission does not consider months or days beyond your last birthday as on that date. Minimum age is generally 18 years. The upper age limit and relaxations depend on your category and the post; the exact figures are published in the official notification.</p>
          <p className="mb-0 small text-secondary">Use this calculator only as a guide. Always confirm with the latest SSC CGL notification on ssc.gov.in.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Age limit by category for SSC CGL</h2>
          <p className="mb-2">SSC CGL prescribes different upper age limits for different categories. For the general category and EWS, the upper age limit is typically 30 years. For OBC (Non-Creamy Layer), it is 33 years, and for SC and ST it is 35 years, as on the reference date (1st January of the year of the exam). Some posts may have a lower or higher age limit; the notification specifies post-wise limits. PwBD (Persons with Benchmark Disabilities) and ex-servicemen often get additional relaxation. Always refer to the latest notification for your application year.</p>
          <ul className="mb-0">
            <li><strong>General / EWS:</strong> usually 18–30 years</li>
            <li><strong>OBC (NCL):</strong> usually 18–33 years</li>
            <li><strong>SC / ST:</strong> usually 18–35 years</li>
            <li><strong>PwBD:</strong> relaxations as per notification</li>
          </ul>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Relaxations and special cases</h2>
          <p className="mb-2">Apart from category-based relaxation, SSC may allow extra years for ex-servicemen, central government civil employees, and others as specified in the notification. PwBD candidates may get up to 10 years' relaxation in some cases. The cumulative effect of more than one type of relaxation is also explained in the notification. Before applying, read the eligibility section carefully and use this age limit calculator to check whether you fall within the allowed range for your category and post.</p>
          <p className="mb-0 small text-secondary">Documents such as category certificate, PwBD certificate, or ex-serviceman certificate may be required at later stages; keep them ready as per the notification.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Example: Checking your age for SSC CGL</h2>
          <p className="mb-2">Suppose your date of birth is 15 June 1998 and you belong to the General category. As on 1 January of the exam year, you would have completed 25 years (your 26th birthday is in June, so as on 1 Jan you are 25). The upper age limit for General is 30 years, so you are within the limit and eligible. If you were born on 15 June 1993, you would be 30 years old as on that date; depending on the exact cut-off in the notification, you may or may not be eligible—always confirm with the official PDF. Use the calculator above with your date of birth and category to see your eligibility at a glance.</p>
          <p className="mb-0 small text-secondary">For combining your Tier 1 and Tier 2 performance, use our <Link href={`${basePath}/final-score-calculator`} className="text-primary">SSC CGL final score calculator</Link>.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={AGE_LIMIT_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
