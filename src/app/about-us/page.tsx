import { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Shield, Sparkles, Award, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - pkminfotech | Free Utility Tools & Smart Calculators',
  description: 'Learn about pkminfotech, a leading utility platform providing free tools for land area measurements, education grading, finance receipts, and photo compressor.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/about-us'
  }
}

export default function AboutUsPage() {
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: 960 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "About Us" }
          ]}
        />

        <div className="card border-0 shadow-sm p-4 p-md-5 bg-white mb-4" style={{ borderRadius: 16 }}>
          <div className="text-center mb-5">
            <span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis px-3 py-2 mb-3">Our Mission</span>
            <h1 className="display-5 fw-bold text-dark mb-3">About pkminfotech</h1>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: 680 }}>
              We build highly optimized, secure, and precise browser-based calculators and converters to simplify your daily workspace tasks.
            </p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3" style={{ width: 54, height: 54 }}>
                  <Shield size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">100% Privacy Focused</h3>
                <p className="small text-secondary mb-0">
                  Calculations and image compressions run entirely client-side in your browser. We never upload your private images or data.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3" style={{ width: 54, height: 54 }}>
                  <Sparkles size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">Zero Login Required</h3>
                <p className="small text-secondary mb-0">
                  No signups, subscriptions, or hidden charges. Instant utility access whenever you need it, fully optimized.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 bg-light rounded-3 h-100 border border-light-subtle text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-circle mb-3" style={{ width: 54, height: 54 }}>
                  <Award size={24} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">Mathematical Accuracy</h3>
                <p className="small text-secondary mb-0">
                  From ancient land measurements (like Akbar&apos;s Todar Mal laggas) to CBAS grade curves, we verify logic with experts.
                </p>
              </div>
            </div>
          </div>

          <div className="lh-lg text-secondary">
            <h2 className="h4 fw-bold text-dark mb-3">Who We Are</h2>
            <p className="mb-4">
              Founded with the goal of replacing cluttered, slow, and data-heavy converter sites, **pkminfotech** is a lightweight portal dedicated to responsive micro-utilities. We specialize in four core segments: regional land area calculations, educational conversions, compliance-ready finance receipts, and online application photo sizing.
            </p>
            <p className="mb-4">
              Our development philosophy centers on speed and clean design. Every page on pkminfotech is crafted to load in milliseconds, even on slow mobile internet connections. By omitting server-side database redirects for public interactions, we guarantee maximum security for tax receipt generators and scanned files.
            </p>
            <p className="mb-0">
              For queries, partnership requests, or feedback regarding tools improvements, feel free to visit our <Link href="/contact-us" className="text-primary text-decoration-none fw-semibold">Contact Us</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}