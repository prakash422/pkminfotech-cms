"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Facebook, Instagram, Linkedin, Menu, Search, User, ChevronDown, X, Youtube, LogOut, Shield } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const TOP_LINKS = [
  { label: "Online Tools", href: "/tools" },
  { label: "Guides", href: "/latest" },
  { label: "About", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
]

export default function SiteChrome() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
                <Image src="/favicon-32x32.png" alt="pkminfotech logo" width={22} height={22} />
              </span>
              <span className="fw-bold">pkminfotech</span>
            </Link>

            <nav className="d-none d-lg-flex align-items-center gap-2 small fw-semibold">
              <Link
                href="/"
                className={`text-decoration-none px-2 py-1 rounded ${pathname === "/" ? "text-primary" : "text-dark"}`}
              >
                Home
              </Link>
              {TOP_LINKS.map((item) => {
                const active =
                  item.href === "/tools"
                    ? pathname === "/tools" || pathname.startsWith("/tools/")
                    : pathname === item.href
                return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-decoration-none px-2 py-1 rounded ${active ? "text-primary" : "text-dark"}`}
                >
                  {item.label}
                </Link>
                )
              })}
            </nav>

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light btn-sm d-none d-sm-inline-flex align-items-center justify-content-center" aria-label="Search" style={{ width: 32, height: 32 }}>
                <Search size={14} />
              </button>
              {status !== "loading" && session?.user && session.user.role === "admin" && (
                <Link href="/admin/dashboard" className="btn btn-outline-primary btn-sm d-none d-md-inline-flex align-items-center gap-1 rounded-3">
                  <Shield size={14} />
                  <span>Admin</span>
                </Link>
              )}
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
            <div
              className="position-fixed top-0 start-0 w-100 h-100 mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div className={`mobile-menu-drawer ${mobileMenuOpen ? "open" : ""}`} aria-label="Mobile navigation">
            <div className="mobile-menu-drawer-header">
              <span className="fw-bold d-flex align-items-center text-dark">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle border me-2" style={{ width: 32, height: 32 }}>
                  <Image src="/favicon-32x32.png" alt="pkminfotech logo" width={18} height={18} />
                </span>
                pkminfotech
              </span>
              <button
                type="button"
                className="btn btn-link text-secondary p-1 ms-auto"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mobile-menu-drawer-body">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${pathname === "/" ? "active" : ""}`}>
                Home
              </Link>
              <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${pathname === "/tools" || pathname.startsWith("/tools/") ? "active" : ""}`}>
                Online Tools
              </Link>
              <Link href="/latest" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${pathname === "/latest" ? "active" : ""}`}>
                Guides
              </Link>
              <Link href="/about-us" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${pathname === "/about-us" ? "active" : ""}`}>
                About
              </Link>
              <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${pathname === "/contact-us" ? "active" : ""}`}>
                Contact Us
              </Link>
            </div>
            <div className="mobile-menu-drawer-footer text-center text-muted small py-3 border-top">
              {status !== "loading" && session?.user && session.user.role === "admin" && (
                <div className="d-grid mb-2">
                  <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-light btn-sm py-2 border rounded-3 text-decoration-none">
                    Admin Dashboard
                  </Link>
                </div>
              )}
              <span>&copy; 2026 pkminfotech</span>
            </div>
          </div>
        </div>
      </header>
      <style>{`
        .profile-dropdown {
          padding: 4px 0;
          font-size: 13px;
        }
        .profile-dropdown-item {
          padding: 6px 12px;
          line-height: 1.3;
          transition: background 0.15s ease;
        }
        .profile-dropdown-item:hover {
          background: #f1f5f9;
        }
        .profile-dropdown-item--danger:hover {
          background: #fef2f2;
        }
        .profile-dropdown-item--danger {
          color: #dc2626;
        }
        .profile-trigger {
          padding: 4px 8px 4px 6px;
        }
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
        .mobile-menu-backdrop {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(4px);
          z-index: 1040;
        }
        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          background: #ffffff;
          z-index: 1050;
          box-shadow: -4px 0 24px rgba(15, 23, 42, 0.15);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-menu-drawer.open {
          transform: translateX(0);
        }
        .mobile-menu-drawer-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .mobile-menu-drawer-body {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          background: #f8fafc;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: #2563eb;
          background: #eff6ff;
        }
        .mobile-menu-drawer-footer {
          padding: 20px;
          border-top: 1px solid #f1f5f9;
        }
        .site-start-btn-mobile {
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
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
      <div className="py-4 text-white" style={{ background: "linear-gradient(180deg, #061731 0%, #071a36 100%)" }}>
        <div className="container" style={{ maxWidth: 1120 }}>
          <div className="row g-4">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Image src="/favicon-32x32.png" alt="pkminfotech logo" width={18} height={18} />
                <span className="fw-semibold">pkminfotech</span>
              </div>
              <p className="small text-white-50 mb-0">
                Free India utility tools since a 2019 blog — land converters, education calculators, rent receipts, and exam photo tools.
              </p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-semibold mb-2">Tool categories</h6>
              <ul className="list-unstyled mb-0 small">
                <li><Link href="/tools/land-area" className="text-white-50 text-decoration-none">Land Area</Link></li>
                <li><Link href="/tools/education" className="text-white-50 text-decoration-none">Education</Link></li>
                <li><Link href="/tools/utility" className="text-white-50 text-decoration-none">Finance &amp; Image</Link></li>
                <li><Link href="/tools" className="text-white-50 text-decoration-none">All Tools</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-semibold mb-2">Company</h6>
              <ul className="list-unstyled mb-0 small">
                <li><Link href="/about-us" className="text-white-50 text-decoration-none">About</Link></li>
                <li><Link href="/contact-us" className="text-white-50 text-decoration-none">Contact</Link></li>
                <li><Link href="/latest" className="text-white-50 text-decoration-none">Guides</Link></li>
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
            <span>&copy; {new Date().getFullYear()} pkminfotech</span>
            <span>Free Online Tools • Land • Education • Finance</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
