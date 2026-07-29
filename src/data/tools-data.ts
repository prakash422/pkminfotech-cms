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
  /** Optional preset for photo compressor variants (KB) */
  defaultTargetKb?: number
  /** Short chip / focus label shown on variant pages */
  focusLabel?: string
}

export interface ToolCategory {
  slug: string
  name: string
  description: string
  /** Homepage / marketing label if different from name */
  shortName?: string
}

export const toolCategories: ToolCategory[] = [
  {
    slug: "land-area",
    name: "Land Area Converters",
    shortName: "Land Area",
    description:
      "Convert regional Indian land units like Bigha, Kattha, Biswa, and Gaj to Square Feet and Acre with state-wise standards.",
  },
  {
    slug: "education",
    name: "Education Calculators",
    shortName: "Education",
    description:
      "CGPA/SGPA to percentage converters, age calculators, and other student-friendly grade tools for Indian universities.",
  },
  {
    slug: "utility",
    name: "Utility, Finance & Image Tools",
    shortName: "Utility",
    description:
      "HRA rent receipt generator, GST and SIP calculators, plus exam photo and signature compressors that run in your browser.",
  },
]

export function getToolByPath(examCategorySlug: string, toolSlug: string): ToolItem | undefined {
  return toolItems.find((t) => t.examCategorySlug === examCategorySlug && t.toolSlug === toolSlug)
}

export function getToolCategory(slug: string): ToolCategory | undefined {
  return toolCategories.find((c) => c.slug === slug)
}

export function getToolsByCategory(categorySlug: string): ToolItem[] {
  return toolItems.filter((t) => t.examCategorySlug === categorySlug)
}

/** Related tools for internal linking — same category first, then fill from others. */
export function getRelatedTools(current: ToolItem, limit = 4): ToolItem[] {
  const sameCategory = toolItems.filter(
    (t) => t.path !== current.path && t.examCategorySlug === current.examCategorySlug
  )
  const others = toolItems.filter(
    (t) => t.path !== current.path && t.examCategorySlug !== current.examCategorySlug
  )
  return [...sameCategory, ...others].slice(0, limit)
}

/** Soft-bridge: recommend tools from blog title/content so old posts pass authority to tools. */
export function getBridgeToolsForBlog(
  title: string,
  content: string,
  category: string,
  limit = 2
): ToolItem[] {
  const text = `${title} ${content}`.toLowerCase()
  const picks: ToolItem[] = []

  const addBySlug = (slug: string) => {
    const tool = toolItems.find((t) => t.slug === slug)
    if (tool && !picks.some((p) => p.path === tool.path)) picks.push(tool)
  }

  if (/bigha|kattha|biswa|gaj|acre|hectare|land|plot|जमीन|बीघा|कट्ठा|बिस्वा/.test(text)) {
    addBySlug("bigha-to-kattha-converter")
    addBySlug("bigha-to-square-feet-bihar")
  }
  if (/cgpa|sgpa|percentage|university|marksheet|grade|semester|aktu|vtu/.test(text)) {
    addBySlug("cgpa-to-percentage")
  }
  if (/rent|hra|landlord|tenant|किराया|receipt/.test(text)) {
    addBySlug("rent-receipt-generator")
  }
  if (/photo|passport|signature|admit|form upload|jpeg|compressor/.test(text)) {
    addBySlug("photo-compressor")
  }
  if (/gst|invoice|tax slab|invoice/.test(text)) {
    addBySlug("gst-calculator")
  }
  if (/sip|mutual fund|investment|returns/.test(text)) {
    addBySlug("sip-calculator")
  }
  if (/age|date of birth|dob|years old/.test(text)) {
    addBySlug("age-calculator")
  }

  if (picks.length < limit) {
    if (category === "hindi") {
      addBySlug("bigha-to-kattha-converter")
      addBySlug("gst-calculator")
      addBySlug("rent-receipt-generator")
    } else if (category === "current-affairs") {
      addBySlug("age-calculator")
      addBySlug("cgpa-to-percentage")
      addBySlug("photo-compressor")
    } else {
      addBySlug("rent-receipt-generator")
      addBySlug("cgpa-to-percentage")
      addBySlug("photo-compressor")
      addBySlug("bigha-to-kattha-converter")
    }
  }

  return picks.slice(0, limit)
}

export const toolItems: ToolItem[] = [
  {
    slug: "bigha-to-kattha-converter",
    title: "Bigha to Kattha Converter",
    description:
      "Convert Bigha, Kattha, Biswa and Gaj to sq ft or acre — with state-wise land standards.",
    category: "Land Area",
    examCategorySlug: "land-area",
    toolSlug: "bigha-to-kattha",
    path: "/tools/land-area/bigha-to-kattha",
  },
  {
    slug: "bigha-to-square-feet-bihar",
    title: "Bigha to Square Feet Converter — Bihar",
    description:
      "Bihar land conversion: Bigha, Kattha and Dhur to square feet and acre (1 Bigha = 27,225 sq ft).",
    category: "Land Area",
    examCategorySlug: "land-area",
    toolSlug: "bigha-to-square-feet-bihar",
    path: "/tools/land-area/bigha-to-square-feet-bihar",
  },
  {
    slug: "bigha-to-kattha-up",
    title: "Bigha to Kattha Converter — Uttar Pradesh",
    description:
      "UP Bigha–Biswa conversion for Eastern and Western standards used in land records.",
    category: "Land Area",
    examCategorySlug: "land-area",
    toolSlug: "bigha-to-kattha-up",
    path: "/tools/land-area/bigha-to-kattha-up",
  },
  {
    slug: "bigha-to-kattha-west-bengal",
    title: "Bigha to Kattha Converter — West Bengal",
    description:
      "West Bengal Bigha–Kattha conversion (1 Bigha ≈ 14,400 sq ft) for deeds and local deals.",
    category: "Land Area",
    examCategorySlug: "land-area",
    toolSlug: "bigha-to-kattha-west-bengal",
    path: "/tools/land-area/bigha-to-kattha-west-bengal",
  },
  {
    slug: "rent-receipt-generator",
    title: "Rent Receipt Generator",
    description:
      "Generate a printable HRA rent receipt in seconds — enter details and download for office or tax use.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "rent-receipt",
    path: "/tools/utility/rent-receipt",
  },
  {
    slug: "cgpa-to-percentage",
    title: "CGPA/SGPA to Percentage Converter",
    description:
      "Convert CGPA/SGPA to percentage for CBSE, AKTU, VTU and other Indian university formulas.",
    category: "Education",
    examCategorySlug: "education",
    toolSlug: "cgpa-to-percentage",
    path: "/tools/education/cgpa-to-percentage",
  },
  {
    slug: "photo-compressor",
    title: "Exam Photo & Signature Compressor",
    description:
      "Compress exam photos and signatures to 20KB / 50KB in your browser — nothing uploaded.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "photo-compressor",
    path: "/tools/utility/photo-compressor",
    defaultTargetKb: 50,
    focusLabel: "Exam photo / signature",
  },
  {
    slug: "sip-calculator",
    title: "SIP Calculator",
    description:
      "Estimate mutual fund SIP returns and future wealth from your monthly investment.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "sip-calculator",
    path: "/tools/utility/sip-calculator",
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description:
      "Find exact age in years, months and days from date of birth — useful for exams and forms.",
    category: "Education",
    examCategorySlug: "education",
    toolSlug: "age-calculator",
    path: "/tools/education/age-calculator",
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator (Add/Remove GST)",
    description:
      "Add or remove GST at 5%, 12%, 18% or 28% — see tax and base amount instantly.",
    category: "Utility",
    examCategorySlug: "utility",
    toolSlug: "gst-calculator",
    path: "/tools/utility/gst-calculator",
  },
]
