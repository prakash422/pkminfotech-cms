import { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Info, Scale, ShieldAlert, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions - pkminfotech | Terms of Service',
  description: 'Read the terms of service and usage conditions for online tools, calculators, and content on pkminfotech.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/terms-and-conditions'
  }
}

export default function TermsAndConditionsPage() {
  return (
    <div className="page-surface py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Terms & Conditions" }
          ]}
        />

        <div className="flat-content-section pb-4">
          <h1 className="h2 fw-bold text-dark mb-3">Terms &amp; Conditions</h1>
          <p className="text-secondary small mb-4">Last Updated: June 28, 2026</p>

          <div className="alert bg-light border-0 text-secondary p-3 mb-4 rounded-3 d-flex gap-2 align-items-start">
            <Info size={18} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <strong className="text-dark d-block mb-1">Agreement of Usage</strong>
              By accessing pkminfotech, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue using our tools.
            </div>
          </div>

          <div className="lh-lg text-secondary small">
            <h2 className="h5 fw-bold text-dark mt-4 mb-2">1. Use of Online Tools</h2>
            <p className="mb-3">
              pkminfotech grants you a personal, non-exclusive, non-transferable, revocable license to access and use our suite of interactive utilities (including Bigha to Kattha, Rent Receipt Generator, CGPA Converter, and Photo Compressor) strictly for personal and non-commercial administrative tasks.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">2. User Behavior &amp; Prohibitions</h2>
            <p className="mb-3">
              When accessing our services, you agree not to:
            </p>
            <ul className="ps-3 mb-3">
              <li>Use automated scripts, crawlers, or bots to scrape utility outputs or site contents.</li>
              <li>Attempt to reverse engineer, disrupt, or copy page designs and calculation scripts.</li>
              <li>Generate duplicate versions of tools containing spam or harmful injection codes.</li>
            </ul>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">3. Accuracy of Calculations</h2>
            <p className="mb-3">
              Our tools process input parameters based on standard math formulas. Land area rod definitions, HRA receipts validation, and GPA mapping ratios are provided on an &quot;as-is&quot; basis for reference. While we strive to maintain correctness, we make no guarantees of suitability for official, court-binding, or legal actions. Verify all outputs through professional surveyors or legal experts prior to executing financial or property transactions.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">4. Client-Side Image Processing Policy</h2>
            <p className="mb-3">
              The Photo Compressor executes locally using HTML5 canvas configurations. We do not store, copy, or upload your pictures. You retain full copyright and ownership of any files processed.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">5. Updates and Modifications</h2>
            <p className="mb-3">
              We reserve the right to alter, pause, or update site layouts, calculation systems, or access criteria at any time without prior notice.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">6. Intellectual Property Rights</h2>
            <p className="mb-4">
              All branding icons, customized page layouts, custom styling frameworks, and tool algorithms are the exclusive intellectual property of pkminfotech.
            </p>

            <div className="border-top pt-3 text-center">
              <span className="small text-secondary">
                For legal inquiries, contact us at <a href="mailto:prakashkr806@gmail.com" className="text-primary text-decoration-none fw-semibold">prakashkr806@gmail.com</a>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
