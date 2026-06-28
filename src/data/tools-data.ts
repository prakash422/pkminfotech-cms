export interface ToolItem {
  slug: string
  title: string
  description: string
  category: string
  /** Category segment in URL, e.g. "land-area", "utility", "education" */
  examCategorySlug: string
  /** Tool segment in URL, e.g. "bigha-to-kattha", "rent-receipt" */
  toolSlug: string
  /** Canonical nested path under /tools/ */
  path: string
}

export function getToolByPath(examCategorySlug: string, toolSlug: string): ToolItem | undefined {
  return toolItems.find((t) => t.examCategorySlug === examCategorySlug && t.toolSlug === toolSlug)
}

export const toolItems: ToolItem[] = [
  {
    slug: "bigha-to-kattha-converter",
    title: "Bigha to Kattha Converter",
    description: "Convert regional land measurements like Bigha, Kattha, Biswa, and Gaj to Square Feet and Acre according to state-wise standard calculations.",
    category: "Land Area",
    examCategorySlug: "land-area",
    toolSlug: "bigha-to-kattha",
    path: "/tools/land-area/bigha-to-kattha"
  },
  {
    slug: "rent-receipt-generator",
    title: "Rent Receipt Generator",
    description: "Create HRA rent receipts in PDF format instantly. Enter details and generate receipt for official submission.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "rent-receipt",
    path: "/tools/utility/rent-receipt"
  },
  {
    slug: "cgpa-to-percentage",
    title: "CGPA/SGPA to Percentage Converter",
    description: "Convert your SGPA/CGPA scores to percentage formats for AKTU, VTU, CBSE and other standard Indian university systems.",
    category: "Education",
    examCategorySlug: "education",
    toolSlug: "cgpa-to-percentage",
    path: "/tools/education/cgpa-to-percentage"
  },
  {
    slug: "photo-compressor",
    title: "Exam Photo & Signature Compressor",
    description: "Compress and resize uloaded images under 20kb, 50kb or customized size limits entirely in your browser using canvas scaling.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "photo-compressor",
    path: "/tools/utility/photo-compressor"
  },
  {
    slug: "sip-calculator",
    title: "SIP Calculator",
    description: "Calculate expected future returns and wealth generated from your Systematic Investment Plan (SIP) in Mutual Funds.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "sip-calculator",
    path: "/tools/utility/sip-calculator"
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description: "Calculate your exact age in years, months, and days from Date of Birth relative to today or any target date.",
    category: "Education",
    examCategorySlug: "education",
    toolSlug: "age-calculator",
    path: "/tools/education/age-calculator"
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator (Add/Remove GST)",
    description: "Calculate Indian GST (5%, 12%, 18%, 28%) inclusive or exclusive tax amounts for goods and services.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "gst-calculator",
    path: "/tools/utility/gst-calculator"
  }
]
