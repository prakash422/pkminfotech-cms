"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Linkedin, Menu, Search, X, Youtube } from "lucide-react"
import { useState } from "react"

const TOP_LINKS = [
  { label: "Current Affairs Update", href: "/daily-current-affairs" },
  { label: "Current Affairs Quiz", href: "/current-affairs-quiz" },
  { label: "Blog", href: "/latest" },
  { label: "Online Tools", href: "/tools" },
  { label: "Contact Us", href: "/contact-us" },
]

export default function SiteChrome() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const hideChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")

  if (hideChrome) return null

  return (
    <>
      <header className="bg-white border-bottom sticky-top z-3">
        <div className="container py-2" style={{ maxWidth: 1120 }}>
          <div className="d-flex align-items-center justify-content-between gap-3">
            <Link href="/" className="d-flex align-items-center text-decoration-none text-dark">
              <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle border me-2" style={{ width: 36, height: 36 }}>
                <Image src="/favicon-32x32.png" alt="PKMinfotech logo" width={22} height={22} />
              </span>
              <span className="fw-bold">PKMinfotech</span>
            </Link>

            <nav className="d-none d-lg-flex align-items-center gap-2 small fw-semibold">
              <Link
                href="/"
                className={`text-decoration-none px-2 py-1 rounded ${pathname === "/" ? "text-primary" : "text-dark"}`}
              >
                Home
              </Link>
              {TOP_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-decoration-none px-2 py-1 rounded ${pathname === item.href ? "text-primary" : "text-dark"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light btn-sm d-none d-sm-inline-flex align-items-center justify-content-center" aria-label="Search" style={{ width: 32, height: 32 }}>
                <Search size={14} />
              </button>
              <Link href="/admin/login" className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex">Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm site-start-btn d-none d-md-inline-flex">Start Free</Link>
              <button
                type="button"
                className="btn btn-light btn-sm d-inline-flex d-lg-none align-items-center justify-content-center site-menu-btn"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                style={{ width: 34, height: 34 }}
              >
                {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="d-lg-none mt-2 border-top pt-2" aria-label="Mobile navigation">
              <div className="d-grid gap-1">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm text-start ps-2 mb-1">
                  Start Free
                </Link>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`text-decoration-none px-2 py-2 rounded small fw-semibold ${pathname === "/" ? "text-primary bg-primary-subtle" : "text-dark bg-light"}`}>
                  Home
                </Link>
                {TOP_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-decoration-none px-2 py-2 rounded small fw-semibold ${pathname === item.href ? "text-primary bg-primary-subtle" : "text-dark bg-light"}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none px-2 py-2 rounded small fw-semibold text-dark bg-light">
                  Login
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      <style>{`
        .site-start-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          height: 34px;
          line-height: 1;
          border-radius: 10px;
          padding: 0 14px;
          font-weight: 600;
          font-size: 13px;
          vertical-align: middle;
          letter-spacing: 0.1px;
          box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
        }
        .site-menu-btn {
          border-radius: 10px;
          border-color: #d8dfeb;
          background: #ffffff;
          color: #334155;
        }
        .site-menu-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        @media (max-width: 767px) {
          .site-start-btn { display: none !important; }
          .site-menu-btn {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>
    </>
  )
}

export function SiteFooter() {
  const pathname = usePathname()

  const hideFooter =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")

  if (hideFooter) return null

  return (
    <footer className="mt-4">
      <div className="py-3 text-white" style={{ background: "linear-gradient(90deg, #072b5f, #0b3f87)" }}>
        <div className="container" style={{ maxWidth: 1120 }}>
          <div className="row g-2 small fw-semibold">
            <div className="col-6 col-md-3">10,000+ Mock Tests</div>
            <div className="col-6 col-md-3">10,000+ Users</div>
            <div className="col-6 col-md-3">100+ Online Tools</div>
            <div className="col-6 col-md-3">Daily Updates</div>
          </div>
        </div>
      </div>
      <div className="py-4 text-white" style={{ background: "linear-gradient(180deg, #061731 0%, #071a36 100%)" }}>
        <div className="container" style={{ maxWidth: 1120 }}>
          <div className="row g-4">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Image src="/favicon-32x32.png" alt="PKMinfotech logo" width={18} height={18} />
                <span className="fw-semibold">PKMinfotech</span>
              </div>
              <p className="small text-white-50 mb-0">
                Exam practice, mock tests and utility tools to help learners prepare better.
              </p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-semibold mb-2">Explore</h6>
              <ul className="list-unstyled mb-0 small">
                <li><Link href="/ssc" className="text-white-50 text-decoration-none">SSC Exam</Link></li>
                <li><Link href="/daily-current-affairs" className="text-white-50 text-decoration-none">Current Affairs Update</Link></li>
                <li><Link href="/tools" className="text-white-50 text-decoration-none">Online Tools</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-semibold mb-2">Company</h6>
              <ul className="list-unstyled mb-0 small">
                <li><Link href="/about-us" className="text-white-50 text-decoration-none">About</Link></li>
                <li><Link href="/contact-us" className="text-white-50 text-decoration-none">Contact</Link></li>
                <li><Link href="/latest" className="text-white-50 text-decoration-none">Blog</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-semibold mb-2">Policies</h6>
              <ul className="list-unstyled mb-0 small">
                <li><Link href="/privacy-policy" className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
                <li><Link href="/disclaimers" className="text-white-50 text-decoration-none">Disclaimers</Link></li>
                <li><Link href="/terms-and-conditions" className="text-white-50 text-decoration-none">Terms &amp; Conditions</Link></li>
                <li><Link href="/sitemap.xml" className="text-white-50 text-decoration-none">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3">
            <a href="#" aria-label="Facebook" className="d-inline-flex align-items-center justify-content-center rounded-circle text-white-50 border border-secondary-subtle text-decoration-none" style={{ width: 30, height: 30 }}>
              <Facebook size={14} />
            </a>
            <a href="#" aria-label="Instagram" className="d-inline-flex align-items-center justify-content-center rounded-circle text-white-50 border border-secondary-subtle text-decoration-none" style={{ width: 30, height: 30 }}>
              <Instagram size={14} />
            </a>
            <a href="#" aria-label="LinkedIn" className="d-inline-flex align-items-center justify-content-center rounded-circle text-white-50 border border-secondary-subtle text-decoration-none" style={{ width: 30, height: 30 }}>
              <Linkedin size={14} />
            </a>
            <a href="#" aria-label="YouTube" className="d-inline-flex align-items-center justify-content-center rounded-circle text-white-50 border border-secondary-subtle text-decoration-none" style={{ width: 30, height: 30 }}>
              <Youtube size={14} />
            </a>
          </div>
          <div className="border-top border-secondary-subtle mt-3 pt-3 small text-white-50 d-flex flex-wrap justify-content-between gap-2">
            <span>&copy; {new Date().getFullYear()} PKMinfotech</span>
            <span>Exam Practice • Mock Tests • Online Tools</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
