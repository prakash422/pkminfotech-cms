import React from "react"
import { ShieldCheck, Zap, Users, Smartphone } from "lucide-react"

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Fast & Secure",
    desc: "Runs in your browser",
    color: "#2563eb",
  },
  {
    icon: Zap,
    title: "Works Offline",
    desc: "No server delays",
    color: "#eab308",
  },
  {
    icon: Users,
    title: "No Registration",
    desc: "Completely free to use",
    color: "#2563eb",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    desc: "Works on all devices",
    color: "#2563eb",
  },
]

export default function ModernTrustStrip() {
  return (
    <div className="card border rounded-4 bg-white p-3 p-md-3.5 my-4 trust-strip-card">
      <div className="row g-3 align-items-center">
        {TRUST_ITEMS.map((item, idx) => {
          const IconComp = item.icon
          const isNotLast = idx < TRUST_ITEMS.length - 1
          return (
            <div
              key={item.title}
              className={`col-6 col-lg-3 ${
                isNotLast ? "border-end-md" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-2.5 px-md-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 38, height: 38, backgroundColor: "#eff6ff" }}
                >
                  <IconComp size={19} style={{ color: item.color }} />
                </div>
                <div>
                  <h4
                    className="fw-bold text-dark mb-0 text-truncate"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-secondary small mb-0 text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .trust-strip-card {
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
        }
        @media (min-width: 992px) {
          .border-end-md {
            border-right: 1px solid #f1f5f9;
          }
        }
      `,
        }}
      />
    </div>
  )
}
