import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/seo-optimization.css";
import SessionProvider from "@/components/providers/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Analytics from "@/components/analytics";
import StructuredData from "@/components/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pkminfotech - Latest Tech News, Business Updates & Travel Guides",
    template: "%s | Pkminfotech"
  },
  description: "Your trusted source for latest tech news, business updates, travel guides for India and worldwide destinations, and daily insights on technology and digital trends.",
  keywords: "tech news, business updates, travel guides India, technology news, digital trends, latest news, Pkminfotech, hindi news, english news",
  authors: [{ name: "Pkminfotech Team", url: "https://www.pkminfotech.com" }],
  creator: "Pkminfotech",
  publisher: "Pkminfotech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pkminfotech",
    title: "Pkminfotech - Latest Tech News, Business Updates & Travel Guides",
    description: "Your trusted source for latest tech news, business updates, travel guides for India and worldwide destinations.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pkminfotech - Latest News and Updates"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pkminfotech - Latest Tech News & Updates",
    description: "Your trusted source for latest tech news, business updates, and travel guides.",
    creator: "@pkminfotech",
    images: ["/og-image.jpg"]
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "News and Media"
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Google Analytics - Replace GA_MEASUREMENT_ID with your actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Google AdSense - Replace with your actual publisher ID */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Pkminfotech",
              "url": "https://pkminfotech.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pkminfotech.com/favicon-32x32.png",
                "width": 32,
                "height": 32
              },
              "description": "Latest tech news, business updates, travel guides for India and worldwide destinations",
              "sameAs": [
                "https://twitter.com/pkminfotech",
                "https://facebook.com/pkminfotech"
              ],
              "founder": {
                "@type": "Person",
                "name": "Prakash Mahto"
              },
              "publishingPrinciples": "https://pkminfotech.com/editorial-guidelines",
              "diversityPolicy": "https://pkminfotech.com/diversity-policy",
              "ethicsPolicy": "https://pkminfotech.com/ethics-policy"
            })
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Pkminfotech",
              "url": "https://pkminfotech.com",
              "description": "Latest tech news, business updates, travel guides for India and worldwide destinations",
              "inLanguage": ["en-US", "hi-IN"],
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://pkminfotech.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Favicon and Apple Touch Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SessionProvider>
          <div id="main-content">
            {children}
          </div>
        </SessionProvider>
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}
