import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import PoliceHeightEligibilityCard from "@/components/tools/PoliceHeightEligibilityCard"
import { Shield, Ruler, User } from "lucide-react"

const HEIGHT_FAQS = [
  { question: "What is the minimum height for police constable?", answer: "Minimum height varies by state and gender. Commonly, male candidates need 170 cm (General) and female candidates 157 cm. Many states allow 5 cm relaxation for SC/ST. Check the official recruitment notification for your state or force (e.g. SSC CPO, state police) for exact figures." },
  { question: "Is there height relaxation for SC/ST in police exams?", answer: "Yes. Many state police and central forces allow relaxation in minimum height for SC/ST candidates (e.g. 5 cm). Some also allow relaxation for OBC. The exact relaxation is given in the recruitment advertisement. This tool uses illustrative values—always refer to the official notification." },
  { question: "How is height measured in police recruitment?", answer: "Height is usually measured without shoes, in centimetres, during the physical eligibility test (PET) or medical examination. The method may be specified in the notification. Enter your height in cm in this tool to check if you meet the typical minimum for your category and gender." },
  { question: "Do different posts have different height requirements?", answer: "Yes. Constable, SI, and other posts may have different minimum height. Some central forces (e.g. CAPF, BSF) also specify chest measurement. This calculator gives a general idea; check the advertisement for the post you are applying for." },
  { question: "Where are official police height criteria published?", answer: "The recruiting body (state police, SSC, UPSC, etc.) publishes physical standards including height in the exam notification or advertisement. Use this tool only for a quick check; always rely on the official notification for your exam." },
]

type Props = { title: string; description: string; basePath: string }

export default function PoliceHeightEligibilityPage({ title, description, basePath }: Props) {
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
            <Shield size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <User size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Ruler size={28} className="text-primary" />
          </span>
        </div>
      </div>
      <PoliceHeightEligibilityCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">Minimum height for police exams</h2>
          <p className="mb-2">Police and constable recruitment notifications specify <strong>minimum height</strong> by gender and often by category. Male candidates typically need <strong>170 cm</strong> (General) and female candidates <strong>157 cm</strong>; many states allow <strong>relaxation for SC/ST</strong> (e.g. 5 cm). This tool uses illustrative values—actual requirements vary by state and post. Always check the official advertisement for your exam.</p>
          <p className="mb-0 small text-secondary">Chest measurement and other physical criteria may also apply; refer to the official notification for complete eligibility.</p>
        </div>
      </section>

      <FaqAccordion title="Frequently Asked Questions – Police Height Eligibility" items={HEIGHT_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
