import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import SscEligibilityCheckerCard from "@/components/tools/SscEligibilityCheckerCard"
import { IdCard, Search, CheckCircle } from "lucide-react"

const ELIGIBILITY_FAQS = [
  { question: "What is the eligibility for SSC CGL?", answer: "SSC CGL eligibility is based on age (as on 1st January of the exam year) and educational qualification. Generally, you must be between 18 and 32 years for the general category and hold a bachelor's degree from a recognised university. Age relaxations apply for OBC, SC, ST, PwBD, and others as per the notification on ssc.gov.in." },
  { question: "Can 12th pass apply for SSC exams?", answer: "Yes. SSC CHSL requires 12th pass or equivalent. SSC CGL requires graduation. SSC MTS and SSC GD typically require 10th pass. Use this eligibility checker by selecting your exam and qualification to see if you meet the criteria." },
  { question: "How is age calculated for SSC eligibility?", answer: "SSC uses your age as on 1st January of the year of the exam. Only completed years and months are considered. The exact cut-off and category-wise relaxations are in the official notification on ssc.gov.in." },
  { question: "What is the minimum qualification for SSC CHSL?", answer: "SSC CHSL requires candidates to have passed 12th standard or equivalent from a recognised board. The age limit is usually 18–27 years (with relaxations for reserved categories). Check the latest notification for your application year." },
  { question: "Where to check official SSC eligibility?", answer: "The official eligibility criteria for all SSC exams are published in the respective exam notifications and corrigenda on ssc.gov.in. Use this tool only as a guide and always confirm with the latest notification before applying." },
]

type Props = { title: string; description: string; basePath: string }

export default function EligibilityCheckerPage({ title, description, basePath }: Props) {
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
            <IdCard size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Search size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <CheckCircle size={28} className="text-success" />
          </span>
        </div>
      </div>
      <SscEligibilityCheckerCard />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">How SSC eligibility is checked</h2>
          <p className="mb-2">SSC eligibility is based on two main factors: <strong>age</strong> (as on 1st January of the year of the exam) and <strong>educational qualification</strong>. The minimum age is usually 18 years. The upper age limit and minimum qualification vary by exam—for example, SSC CGL requires graduation and typically allows candidates up to 32 years, while SSC MTS may allow 10th pass and a lower upper age. Category-wise relaxations (OBC, SC, ST, PwBD, ex-servicemen) are given in the notification.</p>
          <p className="mb-0 small text-secondary">Use this checker only as a guide. Always confirm with the latest SSC notification on ssc.gov.in.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Eligibility by exam (SSC)</h2>
          <p className="mb-2">Different SSC exams have different age and qualification criteria. SSC CGL is for graduates and usually has an upper age limit of 32 years (general). SSC CHSL is for 12th pass candidates with typically 18–27 years. SSC MTS and SSC GD often require 10th pass and have lower upper age limits. Post-wise and category-wise variations are specified in each exam notification.</p>
          <ul className="mb-0">
            <li><strong>SSC CGL:</strong> Graduate, age as per notification (often 18–32 for general)</li>
            <li><strong>SSC CHSL:</strong> 12th pass, age usually 18–27</li>
            <li><strong>SSC MTS:</strong> 10th pass, age usually 18–25</li>
            <li><strong>SSC GD:</strong> 10th pass, age usually 18–23</li>
          </ul>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Qualification and documents</h2>
          <p className="mb-2">Your qualification must be from a recognised board or university. For graduation, the degree should be from a UGC-recognised institution. Equivalent qualifications recognised by the government are also accepted as per the notification. At the document verification stage, you will need to produce original certificates. For age and category relaxations, ensure you have the relevant certificates (category, PwBD, ex-serviceman, etc.) as specified in the notification.</p>
          <p className="mb-0 small text-secondary">For SSC CGL age limit in detail, use our <Link href="/ssc-cgl/age-limit-calculator" className="text-primary">SSC CGL age limit calculator</Link>.</p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Example: Checking eligibility for SSC CGL</h2>
          <p className="mb-2">Suppose your date of birth is 31 December 1999 and you are a graduate. As on 1 January of the exam year, you are 24 years old. SSC CGL typically allows candidates aged 18–32 with a graduate degree, so you meet both the age and qualification criteria. If you were 12th pass only, you would not meet the minimum qualification for CGL but could check eligibility for SSC CHSL instead. Use the tool above with your exam, date of birth, and qualification to verify in seconds.</p>
          <p className="mb-0 small text-secondary">Always refer to the official SSC notification for the exact criteria and any updates for your application year.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={ELIGIBILITY_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
