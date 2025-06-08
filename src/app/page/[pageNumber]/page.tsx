import { redirect } from 'next/navigation'
import HomePage from '@/app/page'

interface PageProps {
  params: Promise<{ pageNumber: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function PaginationPage({ params, searchParams }: PageProps) {
  const { pageNumber } = await params
  const searchParamsObj = await searchParams
  
  const pageNum = parseInt(pageNumber, 10)
  
  // Validate page number
  if (isNaN(pageNum) || pageNum < 1) {
    redirect('/')
  }
  
  // Redirect page 1 to home to avoid duplicate content
  if (pageNum === 1) {
    const redirectUrl = searchParamsObj.category && searchParamsObj.category !== 'all' 
      ? `/?category=${searchParamsObj.category}` 
      : '/'
    redirect(redirectUrl)
  }
  
  // Create new searchParams with page number
  const newSearchParams = {
    ...searchParamsObj,
    page: pageNumber
  }
  
  // Render the HomePage component with the page parameter
  return <HomePage searchParams={Promise.resolve(newSearchParams)} />
}

// Export metadata generation for SEO
export async function generateMetadata({ params, searchParams }: PageProps) {
  const { pageNumber } = await params
  const { category } = await searchParams
  
  const currentPage = parseInt(pageNumber, 10)
  const selectedCategory = category || 'all'
  
  const pageTitle = `Latest Blogs - Page ${currentPage} | Pkminfotech`
  const pageDescription = `Browse our latest blog posts on page ${currentPage}. Discover tech news, travel guides, and business insights.`

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
  const canonicalUrl = `${baseUrl}/page/${currentPage}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: "tech news, business updates, travel guides India, technology news, digital trends, tourist places, daily news, Pkminfotech",
    authors: [{ name: "Pkminfotech Team" }],
    creator: "Pkminfotech",
    publisher: "Pkminfotech",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false, // Don't index pagination pages
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: "Pkminfotech",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/favicon.ico",
          width: 32,
          height: 32,
          alt: "Pkminfotech Logo"
        },
        {
          url: "/og-home.jpg",
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/favicon.ico", "/og-home.jpg"],
      creator: "@pkminfotech"
    },
    verification: {
      google: "google-site-verification-code-here",
    }
  }
} 