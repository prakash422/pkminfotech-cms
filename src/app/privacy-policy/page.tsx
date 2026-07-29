import { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { ShieldAlert, EyeOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - pkminfotech | Privacy First Tools',
  description: 'Understand how pkminfotech collects, protects, and handles your browser data. We process photos entirely in your browser using HTML5 Canvas.',
  alternates: {
    canonical: 'https://www.pkminfotech.com/privacy-policy'
  }
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-surface py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" }
          ]}
        />

        <div className="flat-content-section pb-4">
          <h1 className="h2 fw-bold text-dark mb-3">Privacy Policy</h1>
          <p className="text-secondary small mb-4">Last Updated: June 28, 2026</p>

          <div className="alert bg-success-subtle border-0 text-success-emphasis p-3 mb-4 rounded-3 d-flex gap-2 align-items-start">
            <EyeOff size={18} className="text-success mt-1 flex-shrink-0" />
            <div>
              <strong className="text-dark d-block mb-1">Our Privacy Commitment</strong>
              We do not collect, store, or transmit your private photos, signatures, or calculations. Everything runs safely on your own machine.
            </div>
          </div>

          <div className="lh-lg text-secondary small">
            <h2 className="h5 fw-bold text-dark mt-4 mb-2">1. Browser-Level (Client-Side) Image Resizing</h2>
            <p className="mb-3">
              Unlike traditional online image compressors that upload your passport photos and signatures to a remote server, **pkminfotech** processes your files locally using the **HTML5 Canvas API**. When you upload a JPG, JPEG, or PNG, the image stays in your device&apos;s memory. Canvas drawing and JPEG encoding occur entirely within your browser, ensuring no scanner data is ever transmitted to our network.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">2. Personal Data &amp; Rent Receipts</h2>
            <p className="mb-3">
              When using the Rent Receipt Generator, you input tenant name, landlord name, rent values, and addresses. This data is handled in your local browser state to format the print-friendly PDF page. We do not store, catalog, or save these records on any server database. Once you close or reload the browser tab, the inputs are permanently wiped.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">3. Google Analytics &amp; Cookies</h2>
            <p className="mb-3">
              We collect anonymous traffic data through Google Analytics to understand overall usage patterns, device configurations, and page views. This service uses tracking cookies to log basic details like screen dimensions and region tags. However, this contains zero personally identifiable information (PII).
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">4. Display Advertising</h2>
            <p className="mb-3">
              We may display third-party ads (like Google AdSense) on various parts of the website to help offset server and hosting costs. These advertisers may collect anonymous cookies to serve targeted ads based on your visits to our and other internet portals. You can choose to block cookies through individual browser settings.
            </p>

            <h2 className="h5 fw-bold text-dark mt-4 mb-2">5. Data Security</h2>
            <p className="mb-4">
              Our site employs standard SSL (HTTPS) encryption protocols to secure the transfer of assets and scripts. Because we do not run public database registries or request email signups, there is zero risk of user credentials leaks on pkminfotech.
            </p>

            <div className="border-top pt-3 text-center">
              <span className="small text-secondary">
                For questions regarding cookies control or data settings, email us at <a href="mailto:prakashkr806@gmail.com" className="text-primary text-decoration-none fw-semibold">prakashkr806@gmail.com</a>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}