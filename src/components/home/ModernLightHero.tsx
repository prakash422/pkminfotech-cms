import React from "react"
import Image from "next/image"
import { Zap, CheckCircle2, ShieldCheck } from "lucide-react"

export default function ModernLightHero() {
  return (
    <section className="modern-light-hero card border-0 shadow-sm overflow-hidden my-2 my-md-2.5">
      <div className="p-3 p-sm-3.5 p-md-4">
        <div className="d-flex align-items-center justify-content-between gap-3">
          {/* Left Text Column */}
          <div className="hero-text-content" style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h1 className="hero-main-title mb-1">
              Free Online <span className="text-primary-blue">Calculators &amp; Tools</span>
            </h1>
            <p className="hero-sub-title mb-2">
              Simple tools to save time and get accurate results.
            </p>

            {/* Trust Badges Row */}
            <div className="d-flex flex-wrap gap-1.5 hero-badges-row">
              <div className="hero-badge-pill">
                <span className="badge-icon-yellow">⚡</span>
                <span className="badge-label">100% Free</span>
              </div>
              <div className="hero-badge-pill">
                <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                <span className="badge-label">Instant Results</span>
              </div>
              <div className="hero-badge-pill d-none d-sm-inline-flex">
                <ShieldCheck size={13} className="flex-shrink-0" style={{ color: "#6366f1" }} />
                <span className="badge-label">No Login Needed</span>
              </div>
            </div>
          </div>

          {/* Right 3D Illustration Column (Compact & Never Stacks Vertically) */}
          <div className="hero-illustration-wrapper flex-shrink-0 text-end">
            <Image
              src="/images/hero-tools-illustration.jpg"
              alt="Free Online Calculators and Tools Illustration"
              width={200}
              height={150}
              priority
              className="hero-illustration-img img-fluid"
            />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .modern-light-hero {
          border-radius: 18px;
          min-height: 124px;
          background: linear-gradient(135deg, #f0f7ff 0%, #e6f0fd 50%, #f4f8fe 100%);
          border: 1px solid rgba(191, 219, 254, 0.6) !important;
        }
        .hero-main-title {
          font-size: clamp(1.25rem, 3.2vw, 2.15rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .text-primary-blue {
          color: #2563eb;
        }
        .hero-sub-title {
          font-size: clamp(0.82rem, 1.5vw, 0.95rem);
          color: #64748b;
          line-height: 1.4;
          max-width: 460px;
        }
        .hero-badges-row {
          align-items: center;
        }
        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        .badge-icon-yellow {
          color: #eab308;
          font-size: 0.8rem;
        }
        .hero-illustration-wrapper {
          width: 105px;
          height: 85px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .hero-illustration-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 14px rgba(37, 99, 235, 0.1));
          border-radius: 12px;
        }
        @media (min-width: 576px) {
          .modern-light-hero {
            min-height: 150px;
          }
          .hero-illustration-wrapper {
            width: 145px;
            height: 115px;
          }
          .hero-badge-pill {
            padding: 4px 12px;
            font-size: 0.78rem;
          }
        }
        @media (min-width: 768px) {
          .modern-light-hero {
            border-radius: 20px;
            min-height: 170px;
          }
          .hero-illustration-wrapper {
            width: 180px;
            height: 135px;
          }
        }
      `,
        }}
      />
    </section>
  )
}
