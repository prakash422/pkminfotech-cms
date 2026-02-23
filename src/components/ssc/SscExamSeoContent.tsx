import Link from "next/link"

type Props = {
  /** e.g. "SSC CGL", "SSC CHSL" */
  displayName: string
  /** e.g. "Combined Graduate Level", "Combined Higher Secondary Level" */
  fullName?: string
  /** Base path e.g. "/ssc/cgl" */
  base: string
  /** URL slug e.g. "cgl", "chsl" - used for CGL-specific tool links */
  slug: string
}

/**
 * Dynamic SEO content for any SSC exam page (500+ words). Rendered below practice sets.
 * Uses displayName, fullName, base, slug so the same component works for CGL, CHSL, MTS, GD, CPO, JE, etc.
 */
export default function SscExamSeoContent({ displayName, fullName, base, slug }: Props) {
  const isCgl = slug === "cgl"
  const otherExamsText = isCgl ? "CHSL, MTS, and GD" : "CGL, CHSL, MTS, and GD"

  return (
    <>
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">What is {displayName}?</h2>
          <p className="text-secondary mb-3">
            <strong>{displayName}{fullName ? ` (Staff Selection Commission – ${fullName})` : ""}</strong> is a government exam conducted by the Staff Selection Commission (SSC) for recruitment to various posts under the Government of India. Lakhs of candidates apply every year, so preparation must be structured and consistent. The exam pattern may include computer-based tests, descriptive papers, or skill tests depending on the notification. On this page you will find <strong>free practice sets</strong> for {displayName} covering Reasoning, Quantitative Aptitude, English, and General Awareness where applicable.
          </p>
          <p className="text-secondary mb-0">
            Use the tabs above to access <Link href={`${base}/mock-test`} className="text-primary">Mock Test</Link>, <Link href={`${base}/pyq`} className="text-primary">PYQ</Link>, and <Link href={`${base}/syllabus`} className="text-primary">Syllabus</Link>. For a quick eligibility check, try our <Link href="/ssc/eligibility-checker" className="text-primary">SSC Eligibility Checker</Link>
            {isCgl && <> and <Link href="/ssc-cgl/age-limit-calculator" className="text-primary">SSC CGL Age Limit Calculator</Link></>}.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">{displayName} eligibility and age limit</h2>
          <p className="text-secondary mb-3">
            Eligibility for {displayName} depends on the post. Educational qualification may be graduation, 12th pass, or 10th pass as per the notification. Age limits vary by post and category: usually 18–32 years for General/EWS, with relaxations for OBC, SC/ST, PwBD, and ex-servicemen as per the official advertisement. Age is calculated as on the date specified in the notification (often 1st January of the year of the exam). Nationality rules apply. Check the latest {displayName} notification on ssc.nic.in for exact eligibility
            {isCgl && <>; use our <Link href="/ssc-cgl/age-limit-calculator" className="text-primary">age limit calculator</Link> to see if you meet the criteria for your category</>}.
          </p>
          <p className="text-secondary mb-0">
            Post-wise educational qualification may differ. Always refer to the official notification for the post you are interested in.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">{displayName} exam pattern and syllabus</h2>
          <p className="text-secondary mb-3">
            Most SSC exams are computer-based and include sections such as General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. The number of questions, marking scheme, and negative marking are given in the {displayName} notification. Syllabus typically covers analogies, coding-decoding, number series, simplification, grammar, reading comprehension, current affairs, history, geography, polity, and science. Some exams have multiple tiers or a descriptive paper—check the official notification for the exact pattern.
          </p>
          <p className="text-secondary mb-0">
            Use the <strong>Practice</strong> sets on this page for daily revision. For full-length exam simulation, take our <Link href={`${base}/mock-test`} className="text-primary">{displayName} mock tests</Link>
            {isCgl && <>. After the exam, use our <Link href="/ssc-cgl/tier-1-marks-calculator" className="text-primary">Tier 1 marks calculator</Link> and <Link href="/ssc-cgl/cutoff-predictor" className="text-primary">cutoff predictor</Link> to estimate your score and chances</>}.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">How to prepare for {displayName}</h2>
          <p className="text-secondary mb-3">
            Start with the syllabus and exam pattern. Allocate time for each section: Reasoning, Quant, English, and General Awareness all need regular practice. Read one standard source for GK and current affairs and revise regularly. For English, practice comprehension, grammar, and vocabulary. For Quant and Reasoning, solve topic-wise sets and then mixed sets. Time management is critical—practice with a timer so that you can attempt all questions without rushing in the last minutes.
          </p>
          <p className="text-secondary mb-3">
            Use the <strong>practice sets</strong> on this page for section-wise and mixed practice. Attempt at least one set daily. Once you have covered the syllabus, take full-length <Link href={`${base}/mock-test`} className="text-primary">mock tests</Link> to build speed and stamina. Analyse your mock results and revise weak topics. Our <Link href="/daily-quiz" className="text-primary">daily quiz</Link> and <Link href="/current-affairs-quiz" className="text-primary">current affairs quiz</Link> help you stay in touch with GK and current events. For previous year questions, use the <Link href={`${base}/pyq`} className="text-primary">PYQ</Link> section.
          </p>
          <p className="text-secondary mb-0">
            Bookmark this page and visit <Link href="/ssc" className="text-primary">SSC</Link> for other exams like {otherExamsText}. For free online tools such as marks calculator, cutoff predictor, and rank predictor, go to <Link href="/tools" className="text-primary">Online Tools</Link>. Good luck with your {displayName} preparation.
          </p>
        </div>
      </section>

      <div className="text-center mt-4">
        <Link href="/ssc" className="btn btn-outline-primary btn-sm me-2">All SSC Exams</Link>
        <Link href="/daily-quiz" className="btn btn-outline-primary btn-sm me-2">Daily Quiz</Link>
        <Link href="/mock-tests" className="btn btn-outline-primary btn-sm me-2">Mock Tests</Link>
        <Link href="/tools" className="btn btn-outline-primary btn-sm">Online Tools</Link>
      </div>
    </>
  )
}
