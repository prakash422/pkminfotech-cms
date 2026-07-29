import { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Mail, Clock, ShieldCheck, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - pkminfotech | Feedback & Business Queries',
  description: 'Get in touch with pkminfotech. Email us at prakashkr806@gmail.com for tool improvements, advertising queries, feedback, or collaborations.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/contact-us'
  }
}

export default function ContactUsPage() {
  return (
    <div className="page-surface py-4">
      <div className="container" style={{ maxWidth: 960 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Contact Us" }
          ]}
        />

        <div className="row g-4">
          <div className="col-12 col-md-5">
            <div className="tool-panel p-4 h-100">
              <h1 className="h3 fw-bold text-dark mb-3">Get in Touch</h1>
              <p className="text-secondary small mb-4">
                Have questions about our tools, feedback on calculations, or partnership inquiries? Drop us an email and we will get back to you shortly.
              </p>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <Mail size={18} />
                </div>
                <div>
                  <span className="small text-secondary d-block">Email Support</span>
                  <a href="mailto:prakashkr806@gmail.com" className="fw-semibold text-dark text-decoration-none">
                    prakashkr806@gmail.com
                  </a>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-success-subtle text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <span className="small text-secondary d-block">Response Time</span>
                  <span className="fw-semibold text-dark">Within 24-48 Hours</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="bg-warning-subtle text-warning-emphasis rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="small text-secondary d-block">Location</span>
                  <span className="fw-semibold text-dark">India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-7">
            <div className="tool-panel p-4 p-md-5 h-100">
              <h2 className="h4 fw-bold text-dark mb-3">Support &amp; Advertisements</h2>
              <div className="lh-lg text-secondary small">
                <p className="mb-3">
                  Our team actively monitors tools accuracy. If you notice any discrepancy in **Bigha to Kattha** calculations for specific regional states (like Bihar, UP, Rajasthan, or Assam), please email us with details of local *lagga* measurements, and we will update the math system.
                </p>

                <h3 className="h6 fw-bold text-dark mt-4 mb-2">For Advertisers</h3>
                <p className="mb-3">
                  We host highly targeted traffic interested in online utility applications, calculations, and financial services. If you would like to run display ads or sponsored content, reach out to us at <a href="mailto:prakashkr806@gmail.com" className="text-primary text-decoration-none fw-semibold">prakashkr806@gmail.com</a>.
                </p>

                <div className="alert bg-light border-0 text-secondary p-3 mt-4 rounded-3 d-flex gap-2 align-items-start">
                  <ShieldCheck size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-dark d-block mb-1">Privacy Guarantee</strong>
                    Any communication, screenshots, or emails shared with us remain completely confidential and are deleted after resolving queries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}