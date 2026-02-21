/**
 * Shared hero section for exam tab pages (Daily Quiz, Mock Test, PYQ, Syllabus).
 * Matches the compact gradient style of ExamTypeLanding hero.
 */
type ExamTabHeroProps = {
  title: string
  subtitle?: string
  description: string
}

export default function ExamTabHero({ title, subtitle, description }: ExamTabHeroProps) {
  return (
    <>
      <section className="card border-0 shadow-sm mb-3 exam-tab-hero">
        <div className="card-body p-3 p-md-4 exam-tab-hero-body">
          <h1 className="fw-bold mb-0 exam-tab-hero-title">{title}</h1>
          {subtitle && (
            <p className="text-secondary mb-1 mt-0 exam-tab-hero-subtitle">{subtitle}</p>
          )}
          <p className="text-secondary mb-0 small exam-tab-hero-desc">{description}</p>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
        .exam-tab-hero,
        .exam-tab-hero .card-body {
          border-radius: 10px;
          background: linear-gradient(145deg, #ffffff 0%, #f5f7fa 45%, #eef2f7 100%) !important;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }
        .exam-tab-hero-body { padding: 0.65rem 1rem !important; }
        @media (min-width: 768px) {
          .exam-tab-hero-body { padding: 0.85rem 1.25rem !important; }
        }
        .exam-tab-hero-title { font-size: 1.25rem; line-height: 1.3; }
        .exam-tab-hero-subtitle { font-size: 0.875rem; }
        .exam-tab-hero-desc { font-size: 0.8rem !important; line-height: 1.4; max-width: 560px; }
      `}} />
    </>
  )
}
