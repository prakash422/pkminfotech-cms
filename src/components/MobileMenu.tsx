'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Home, Info, Briefcase, Mail, Phone } from "lucide-react"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden relative z-50 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
        onClick={toggleMenu}
      >
        <div className="relative w-6 h-6">
          <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
          <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`} />
          <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Pkminfotech</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-6" role="navigation" aria-label="Mobile navigation">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/" 
                      className="flex items-center py-3 px-4 text-blue-600 bg-blue-50 rounded-lg font-medium transition-all duration-200 hover:bg-blue-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="#about" 
                      className="flex items-center py-3 px-4 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      <Info className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>About Us</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#services" 
                      className="flex items-center py-3 px-4 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      <Briefcase className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>Services</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contact" 
                      className="flex items-center py-3 px-4 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>Contact</span>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Get in touch with us</p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="mailto:prakashkr806@gmail.com" 
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Email us"
                    >
                      <Mail className="h-5 w-5 text-white" />
                    </a>
                    <a 
                      href="#contact" 
                      className="w-10 h-10 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Contact page"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-5 w-5 text-white" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">© 2024 Pkminfotech</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}