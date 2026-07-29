export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pkminfotech.com"

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "pkminfotech",
    url: baseUrl,
    logo: `${baseUrl}/android-chrome-192x192.png`,
    description:
      "Free online tools and calculators for land area conversion, education grading, finance receipts, and exam photo compression in India. Founded as a blog in 2019; tools-focused today.",
    foundingDate: "2019",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${baseUrl}/contact-us`,
    },
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "pkminfotech",
    url: baseUrl,
    description:
      "Free online tools for Bigha to Kattha conversion, CGPA to percentage, HRA rent receipts, GST/SIP calculators, and exam photo compression — plus helpful guides.",
    publisher: {
      "@type": "Organization",
      name: "pkminfotech",
      logo: `${baseUrl}/android-chrome-192x192.png`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/latest?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
