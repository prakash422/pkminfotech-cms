import { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Info, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimers - pkminfotech | Calculation & General Limits',
  description: 'Understand the limitations, accuracy bounds, and external links disclaimers for online tools on pkminfotech.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/disclaimers'
  }
}

export default function DisclaimersPage() {
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Disclaimers" }
          ]}
        />

        <div className="card border-0 shadow-sm p-4 p-md-5 bg-white" style={{ borderRadius: 16 }}>
          <h1 className="h2 fw-bold text-dark mb-3">Legal Disclaimer</h1>
          <p className="text-secondary small mb-4">Last Updated: June 28, 2026</p>

          <div className="alert bg-light border-0 text-secondary p-3 mb-4 rounded-3 d-flex gap-2 align-items-start">
            <Info size={18} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <strong className="text-dark d-block mb-1">Notice to All Users</strong>
              By accessing any of the calculators and converters on **pkminfotech**, you acknowledge and agree to the guidelines, limitations, and liabilities outlined below.
            </div>
          </div>

          <div className="lh-lg text-secondary small">
            <h2 className="h5 fw-bold text-dark mt-4 mb-2">1. Precision &amp; Math Limitations</h2>
            <p className="mb-3">
              All tools, converters, and calculators available on pkminfotech are designed as estimation models. Land area metrics (specifically *Bigha*, *Kattha*, *Biswa*) are subject to local fluctuations based on regional rules and individual state revenue definitions. The mathematical values provided by our software are for convenience and general reference only, and should not be used as legal deeds or final surveys.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">2. Finance &amp; Tax Calculators Disclaimer</h2>
            <p className="mb-3">
              The Rent Receipt Generator and other finance tools are designed to print documentation templates. Availing HRA tax benefits under Section 10(13A) is governed by rules laid down by the Income Tax Department of India. pkminfotech does not guarantee tax deductions or provide certified financial counseling. We strongly suggest consulting a Chartered Accountant (CA) or certified tax professional before submitting receipts to employers.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">3. External Hyperlinks Policy</h2>
            <p className="mb-3">
              Our pages may contain links directing users to external platforms, blogs, or government portals. While we strive to source links from reputable directories, we have no control over the privacy conditions, cookies, or reliability of these external resources. The presence of any link does not imply endorsement by pkminfotech.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">4. Client-Side Image Compression Limits</h2>
            <p className="mb-3">
              The Exam Photo &amp; Signature Compressor operates client-side via HTML5 canvas, adjusting quality factors iteratively. It is the user&apos;s responsibility to inspect the downloaded JPG file for visual sharpness and confirm it matches the exact rules published by recruitment boards (such as SSC, UPSC, IBPS) before submitting applications.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">5. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall pkminfotech or its developers be held liable for any direct, indirect, consequential, or incidental damages arising from the use or inability to use our tools, articles, or services.
            </p>

            <div className="border-top pt-3 text-center">
              <span className="small text-secondary">
                Have questions regarding legal terms? Visit our <a href="mailto:prakashkr806@gmail.com" className="text-primary text-decoration-none fw-semibold">Contact Us</a> channel.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}