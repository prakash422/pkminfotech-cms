import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import FaqAccordion from "@/components/FaqAccordion"
import CtetQualifyingMarksCard from "@/components/tools/CtetQualifyingMarksCard"
import { GraduationCap, BookOpen, Award } from "lucide-react"

const CTET_FAQS = [
  { question: "What are the qualifying marks for CTET?", answer: "CTET qualifying marks are 60% for General/EWS (90 out of 150 per paper) and 55% for SC/ST/OBC/PwD (82.5, often rounded to 83). You need to meet the qualifying marks in each paper you appear for (Paper 1 for Primary, Paper 2 for Elementary, or both). These are minimum criteria to get the CTET certificate, not cutoff for recruitment." },
  { question: "Is there negative marking in CTET?", answer: "No. CTET has no negative marking. Each question carries one mark. So your total score is the number of correct answers. Use this tool to check if your expected or actual score meets the qualifying marks for your category." },
  { question: "What is the difference between Paper 1 and Paper 2?", answer: "Paper 1 is for teachers for classes 1–5 (Primary); Paper 2 is for classes 6–8 (Elementary). Both are 150 marks and have the same qualifying criteria (60% General, 55% reserved). You can appear for one or both. This tool lets you select Paper 1 or Paper 2 and enter your score to check eligibility." },
  { question: "Do I need to qualify in both papers?", answer: "If you appear for both papers, you need to score the qualifying marks in each paper separately to get the CTET certificate for both levels. If you appear for only one paper, you need to qualify in that paper. This calculator checks one paper at a time." },
  { question: "Where are official CTET qualifying marks published?", answer: "CBSE publishes the qualifying marks and result criteria in the CTET notification and on the official CTET website. Use this tool for a quick check; always refer to the latest notification for your exam cycle." },
]

type Props = { title: string; description: string; basePath: string }

export default function CtetQualifyingMarksPage({ title, description, basePath }: Props) {
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
            <GraduationCap size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <BookOpen size={28} className="text-primary" />
          </span>
          <span className="d-flex align-items-center justify-content-center rounded-2 bg-white shadow-sm p-2">
            <Award size={28} className="text-primary" />
          </span>
        </div>
      </div>
      <CtetQualifyingMarksCard basePath={basePath} />

      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-semibold mb-3">CTET qualifying marks</h2>
          <p className="mb-2">CTET uses <strong>qualifying marks</strong> (minimum score to get the certificate): <strong>60%</strong> for General/EWS and <strong>55%</strong> for SC/ST/OBC/PwD. Each paper is 150 marks, so that is 90 and 82.5 (83) respectively. You must score at least the qualifying marks in each paper you attempt. This tool uses the official criteria—check the latest CTET notification for any change.</p>
          <p className="mb-0 small text-secondary">Qualifying does not mean selection for a job; it is the minimum to obtain the CTET certificate. For more tools, see <Link href="/tools" className="text-primary">Online Tools</Link>.</p>
        </div>
      </section>

      <FaqAccordion title="FAQ" items={CTET_FAQS} />

      <div className="text-center mt-4">
        <Link href="/tools" className="btn btn-outline-primary btn-sm">
          View all tools
        </Link>
      </div>
    </>
  )
}
