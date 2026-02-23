import Link from "next/link"

type PyqSeoContentProps = {
  displayName: string
  base: string
  categoryLabel: string
  categoryHref: string
}

/**
 * Shared 500+ words SEO content for PYQ (Previous Year Questions) tab pages.
 * Used on ssc, banking, rrb, teaching, police exam-type PYQ pages.
 */
export default function PyqSeoContent({
  displayName,
  base,
  categoryLabel,
  categoryHref,
}: PyqSeoContentProps) {
  return (
    <>
      <section className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">What are PYQ (Previous Year Questions)?</h2>
          <p className="text-secondary mb-3">
            PYQ are real questions from past {displayName} exams. They help you understand the exam pattern, repeated topics, difficulty level, and the type of reasoning or calculation the paper expects. Solving PYQ is one of the most effective ways to prepare for competitive exams because question styles and many topics repeat across years. On this page you will find topic-wise or year-wise PYQ sets for {displayName}; each set can be attempted with a timer and negative marking similar to the actual exam.
          </p>
          <p className="text-secondary mb-0">
            Use the sets above to practice. If no sets are visible yet, we are adding them soon. In the meantime, use the <Link href={base} className="text-primary">Practice</Link> tab for topic-wise questions and the <Link href={`${base}/mock-test`} className="text-primary">Mock Test</Link> tab for full-length papers. You can also explore <Link href={categoryHref} className="text-primary">{categoryLabel} exams</Link> to choose another exam type.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">Why practice PYQ for {displayName}?</h2>
          <p className="text-secondary mb-3">
            Previous year questions show you exactly what the exam asks: question format, language, and the mix of easy, moderate, and tough questions. Many topics and even similar questions appear again, so practising PYQ improves both speed and accuracy. It also builds confidence because you get used to the real paper. For exams like {displayName}, where competition is high, candidates who have solved at least 3–5 years of PYQ often perform better in reasoning, quant, and general awareness. Combine PYQ with <Link href={`${base}/syllabus`} className="text-primary">syllabus</Link> coverage and <Link href="/mock-tests" className="text-primary">full-length mock tests</Link> for a complete preparation plan.
          </p>
          <p className="text-secondary mb-0">
            We recommend solving PYQ after you have covered the basics. First complete topic-wise practice from the <Link href={base} className="text-primary">Practice</Link> tab, then attempt PYQ by year or by topic. After that, take <Link href={`${base}/mock-test`} className="text-primary">mock tests</Link> to simulate the full exam. For daily revision, use our <Link href="/daily-quiz" className="text-primary">daily quiz</Link> and <Link href="/current-affairs-quiz" className="text-primary">current affairs quiz</Link>.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">How to use PYQ sets effectively</h2>
          <p className="text-secondary mb-3">
            Attempt each PYQ set in one go with the timer on, and apply the same negative marking as the real exam. After submitting, review every wrong and skipped question: note the correct approach and the concept behind it. If a topic keeps appearing in PYQ, give it extra focus in your revision. Track your score and accuracy across sets to see improvement. If you find a section weak (e.g. English or Quant), go back to the <Link href={base} className="text-primary">topic-wise practice</Link> for that section before attempting more PYQ. Many toppers solve the same PYQ set 2–3 times—first to understand the pattern, then to improve speed and accuracy.
          </p>
          <p className="text-secondary mb-0">
            All PYQ on pkminfotech are free. You can also use our <Link href="/tools" className="text-primary">online tools</Link>—marks calculators, score predictors, eligibility checkers—to estimate your score and plan your strategy. For more exams and resources, visit <Link href={categoryHref} className="text-primary">{categoryLabel}</Link>, <Link href="/mock-tests" className="text-primary">Mock Tests</Link>, or <Link href="/" className="text-primary">Home</Link>. Good luck with your {displayName} preparation.
          </p>
        </div>
      </section>

      <section className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">Frequently asked questions – {displayName} PYQ</h2>
          <p className="text-secondary small mb-2"><strong>Are PYQ free?</strong> Yes. All previous year question sets on this page are free to attempt. You can create an account to track your attempts and accuracy.</p>
          <p className="text-secondary small mb-2"><strong>How many years of PYQ should I solve?</strong> Aim for at least 3–5 years of papers. If time permits, solving more years helps with pattern recognition and repeated topics.</p>
          <p className="text-secondary small mb-2"><strong>Should I do PYQ or mock test first?</strong> It is better to cover syllabus and topic-wise practice first, then PYQ, and finally full-length mock tests. PYQ help you understand the paper; mocks help you practise time management and exam-day simulation.</p>
          <p className="text-secondary small mb-0"><strong>Where do I find full-length mock tests?</strong> Use the <Link href={`${base}/mock-test`} className="text-primary">Mock Test</Link> tab for {displayName}, or go to our <Link href="/mock-tests" className="text-primary">Mock Tests</Link> page for exam-wise full-length mocks.</p>
        </div>
      </section>
    </>
  )
}
