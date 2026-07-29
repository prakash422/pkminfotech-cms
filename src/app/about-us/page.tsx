import { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Shield, Sparkles, Award, ArrowRight, BookOpen, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — From Blog to Free Online Tools',
  description:
    'pkminfotech started in 2019 as a tech and travel blog. Today we focus on free India utility tools — land converters, CGPA calculators, rent receipts, and exam photo tools — while keeping helpful guides.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/about-us',
  },
  openGraph: {
    title: 'About Us — From Blog to Free Online Tools | pkminfotech',
    description:
      'How pkminfotech evolved from a 2019 blog into a free online tools platform for land, education, finance, and image utilities.',
    url: 'https://www.pkminfotech.com/about-us',
    type: 'website',
    siteName: 'pkminfotech',
  },
}

export default function AboutUsPage() {
  return (
    <div className="page-surface py-4">
      <div className="container" style={{ maxWidth: 960 }}>
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'About Us' },
          ]}
        />

        <div className="flat-content-section pb-4 mb-4">
          <div className="text-center mb-5">
            <span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis px-3 py-2 mb-3">
              Since 2019
            </span>
            <h1 className="display-5 fw-bold text-dark mb-3">About pkminfotech</h1>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: 720 }}>
              We began as a blog. We now build free, privacy-first online tools for everyday India needs — land area,
              education, finance, and form photos — while keeping useful articles.
            </p>
          </div>

          <div className="lh-lg text-secondary mb-5">
            <h2 className="h4 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <BookOpen size={22} className="text-primary" /> Our story
            </h2>
            <p className="mb-3">
              <strong className="text-dark">pkminfotech</strong> launched around <strong className="text-dark">2019</strong>{' '}
              as a content site covering technology tips, business updates, and travel guides. Over time, readers kept
              asking for practical calculators they could use without signing up or uploading private files.
            </p>
            <p className="mb-3">
              As a small independent project, publishing fresh blog posts every week was hard to sustain. So we repositioned
              the same trusted domain toward <strong className="text-dark">evergreen utility tools</strong> — pages that
              stay useful year-round — while retaining the blog for guides and updates.
            </p>
            <p className="mb-0">
              Today the homepage leads with free tools. The blog remains available so older articles and search traffic
              stay useful, and each article can point you to a related calculator when it helps.
            </p>
          </div>

          <div className="lh-lg text-secondary mb-5">
            <h2 className="h4 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Wrench size={22} className="text-primary" /> What we focus on now
            </h2>
            <ul className="mb-3">
              <li>
                <Link href="/tools/land-area" className="fw-semibold text-decoration-none">
                  Land area
                </Link>{' '}
                — Bigha, Kattha, Biswa and state-wise square feet conversions
              </li>
              <li>
                <Link href="/tools/education" className="fw-semibold text-decoration-none">
                  Education
                </Link>{' '}
                — CGPA/SGPA to percentage and age tools for students
              </li>
              <li>
                <Link href="/tools/utility" className="fw-semibold text-decoration-none">
                  Finance &amp; image utilities
                </Link>{' '}
                — rent receipts, GST/SIP helpers, exam photo compression
              </li>
            </ul>
            <p className="mb-0">
              Browse everything on our{' '}
              <Link href="/tools" className="fw-semibold text-decoration-none">
                Free Online Tools
              </Link>{' '}
              page.
            </p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3"
                  style={{ width: 54, height: 54 }}
                >
                  <Shield size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">Privacy-first tools</h3>
                <p className="small text-secondary mb-0">
                  Photo compression and most calculators run in your browser. We do not need your files on our servers.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3"
                  style={{ width: 54, height: 54 }}
                >
                  <Sparkles size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">Free to use</h3>
                <p className="small text-secondary mb-0">
                  No forced signup for core tools. Open the page, get the result, leave — simple by design.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-circle mb-3"
                  style={{ width: 54, height: 54 }}
                >
                  <Award size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">India-first accuracy</h3>
                <p className="small text-secondary mb-0">
                  State land units, university grade formulas, and HRA-style rent receipts are built for Indian use cases.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Link href="/tools" className="btn btn-primary rounded-3 px-4 d-inline-flex align-items-center gap-2">
              Explore free tools <ArrowRight size={16} />
            </Link>
            <Link href="/latest" className="btn btn-outline-secondary rounded-3 px-4">
              Read the blog
            </Link>
            <Link href="/contact-us" className="btn btn-outline-secondary rounded-3 px-4">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
