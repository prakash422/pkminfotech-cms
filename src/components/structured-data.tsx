import Script from 'next/script'

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pkminfotech.com'
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Pkminfotech",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon-32x32.png`,
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
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pkminfotech",
    "url": baseUrl,
    "description": "Latest tech news, business updates, travel guides for India and worldwide destinations",
    "inLanguage": ["en-US", "hi-IN"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
} 