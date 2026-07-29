import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/seo-optimization.css";
import SessionProvider from "@/components/providers/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Analytics from "@/components/analytics";
import StructuredData from "@/components/structured-data";
import ClientScripts from "@/components/ClientScripts";
import SiteChrome, { SiteFooter } from "@/components/SiteChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "pkminfotech - Free Online Tools & Calculators",
    template: "%s | pkminfotech"
  },
  description: "Free online tools for land area conversion, CGPA to percentage, HRA rent receipts, GST and SIP calculators, and exam photo compression — plus helpful guides from pkminfotech.",
  keywords: "online tools, bigha to kattha, rent receipt generator, cgpa to percentage, photo compressor, gst calculator, sip calculator, pkminfotech",
  authors: [{ name: "pkminfotech Team", url: "https://www.pkminfotech.com" }],
  creator: "pkminfotech",
  publisher: "pkminfotech",
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
    siteName: "pkminfotech",
    title: "pkminfotech - Free Online Tools & Calculators",
    description: "Free online tools for land area, education, finance and image utilities — plus helpful guides.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "pkminfotech - Free Online Tools"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "pkminfotech - Free Online Tools & Calculators",
    description: "Free online tools for land area, education, finance and image utilities.",
    creator: "@pkminfotech",
    images: ["/og-image.jpg"]
  },
  verification: {
    google: "dRJXjKr7fX0vfOh2SUkS-udeG7DPx4XX61rp8xhb8ho",
  },
  category: "Tools"
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
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        {/* Google Analytics 4 (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z8Y32YRBS6"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z8Y32YRBS6');
          `
        }} />
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        {/* Favicon and Apple Touch Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        {/* AdSense optimization */}
        <meta name="google-adsense-account" content="ca-pub-3361406010222956" />
      </head>
      <body className={inter.className}>
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SessionProvider>
          <div id="main-content" className="d-flex flex-column min-vh-100">
            <SiteChrome />
            <div className="flex-grow-1">
              {children}
            </div>
            <SiteFooter />
          </div>
          <Analytics />
          <StructuredData />
          <ClientScripts />
        </SessionProvider>
      </body>
    </html>
  );
}
