export interface ToolSeoFaq {
  question: string
  answer: string
}

export interface ToolSearchIntent {
  query: string
  answer: string
}

export interface ToolSeoProfile {
  metaTitle: string
  metaDescription: string
  searchTerms: string[]
  intentTitle: string
  intentIntro: string
  intents: ToolSearchIntent[]
  faqs: ToolSeoFaq[]
}

export const TOOL_SEO_PROFILES: Record<string, ToolSeoProfile> = {
  "bigha-to-kattha-converter": {
    metaTitle: "Bigha to Kattha Converter — State-wise Land Units",
    metaDescription:
      "Convert Bigha to Kattha, Biswa, Dhur, square feet, Gaj and acres using Bihar, UP, West Bengal, Assam and Punjab-Haryana standards.",
    searchTerms: [
      "bigha to kattha converter",
      "1 bigha in kattha",
      "bigha to square feet",
      "kattha to bigha",
      "bigha to acre",
      "bigha to gaj",
    ],
    intentTitle: "Common Bigha and Kattha calculations",
    intentIntro:
      "Land-unit sizes change by state. Select the correct region before using these common conversions.",
    intents: [
      {
        query: "1 Bigha in Kattha",
        answer: "In Bihar and West Bengal, 1 Bigha commonly equals 20 Kattha, while Assam commonly uses 5 Kattha.",
      },
      {
        query: "Bigha to square feet",
        answer: "One Bigha is commonly 27,225 sq ft in Bihar, 27,000–27,225 sq ft in UP, and 14,400 sq ft in West Bengal.",
      },
      {
        query: "Bigha to acre and Gaj",
        answer: "The calculator converts the selected state’s Bigha value to acre and square yards (Gaj) automatically.",
      },
    ],
    faqs: [
      {
        question: "Why is Bigha to Kattha conversion not standard all over India?",
        answer:
          "Traditional land units were defined using different local measurement rods, so their square-foot values still vary by state and district.",
      },
      {
        question: "How many Kattha make one Acre?",
        answer:
          "It depends on the state’s Kattha size. Use the Bihar converter for Bihar figures, or compare regions with the hub table and matching state pages.",
      },
      {
        question: "How do Eastern and Western UP Bigha differ?",
        answer:
          "Both commonly use 20 Biswa per Bigha, but the square-foot base can differ. Use the Uttar Pradesh converter for East vs West details.",
      },
    ],
  },
  "bigha-to-square-feet-bihar": {
    metaTitle: "Bigha to Square Feet Converter Bihar — Kattha & Dhur",
    metaDescription:
      "Convert Bihar Bigha, Kattha and Dhur to square feet, Gaj and acres. Uses the common standard: 1 Bigha = 27,225 sq ft.",
    searchTerms: [
      "bigha to square feet Bihar",
      "1 bigha in square feet Bihar",
      "kattha to square feet Bihar",
      "dhur to square feet Bihar",
      "bigha to acre Bihar",
    ],
    intentTitle: "Popular Bihar land conversions",
    intentIntro:
      "This page is locked to the common Bihar standard, so values are not mixed with West Bengal or Uttar Pradesh units.",
    intents: [
      {
        query: "1 Bigha in square feet Bihar",
        answer: "The common Bihar reference is 27,225 square feet for 1 Bigha.",
      },
      {
        query: "1 Kattha in square feet Bihar",
        answer: "Using 20 Kattha per Bigha, 1 Bihar Kattha equals approximately 1,361.25 square feet.",
      },
      {
        query: "Bihar Bigha to acre",
        answer: "One Bihar Bigha is approximately 0.625 acre; one acre is about 1.6 Bigha.",
      },
    ],
    faqs: [
      {
        question: "How many square feet is 1 Bigha in Bihar?",
        answer: "The common practical value is 27,225 square feet for 1 Bigha in Bihar.",
      },
      {
        question: "How many Kattha make 1 Acre in Bihar?",
        answer: "About 32 Kattha make one acre using the common Bihar standard.",
      },
      {
        question: "Is Bihar Kattha the same as West Bengal Kattha?",
        answer: "No. Bihar Kattha is about 1,361.25 sq ft, while West Bengal Kattha is commonly 720 sq ft.",
      },
    ],
  },
  "bigha-to-kattha-up": {
    metaTitle: "Bigha to Kattha Converter UP — Biswa, Gaj & Sq Ft",
    metaDescription:
      "Convert Bigha to Kattha, Biswa, square feet, Gaj and acres for Eastern or Western Uttar Pradesh land standards.",
    searchTerms: [
      "bigha to kattha UP",
      "1 bigha in biswa UP",
      "bigha to square feet Uttar Pradesh",
      "UP bigha to gaj",
      "pucca bigha to square feet",
    ],
    intentTitle: "Popular Uttar Pradesh land conversions",
    intentIntro:
      "Choose Eastern or Western UP because the local square-foot reference can differ even when both use 20 Biswa per Bigha.",
    intents: [
      {
        query: "1 Bigha in Biswa UP",
        answer: "Both common Eastern and Western UP references use 20 Biswa for 1 Bigha.",
      },
      {
        query: "UP Bigha to square feet",
        answer: "This calculator uses about 27,225 sq ft for Eastern UP and 27,000 sq ft for Western UP.",
      },
      {
        query: "Pucca vs Kucha Bigha",
        answer: "These terms can represent different local areas, so confirm the convention recorded in the district document.",
      },
    ],
    faqs: [
      {
        question: "What is 1 Bigha in Eastern UP?",
        answer: "A common reference is 27,225 square feet with 20 Biswa per Bigha.",
      },
      {
        question: "What is 1 Bigha in Western UP?",
        answer: "A common reference is approximately 27,000 square feet with 20 Biswa per Bigha.",
      },
      {
        question: "Are Pucca and Kucha Bigha the same in UP?",
        answer: "No. Their local meanings can differ, so confirm the term and district standard used in the land paper.",
      },
    ],
  },
  "bigha-to-kattha-west-bengal": {
    metaTitle: "Bigha to Kattha Converter West Bengal — Sq Ft & Acre",
    metaDescription:
      "Convert West Bengal Bigha and Kattha to square feet, Gaj and acres using 1 Bigha = 20 Kattha = 14,400 sq ft.",
    searchTerms: [
      "bigha to kattha West Bengal",
      "1 kattha in square feet Kolkata",
      "1 bigha in square feet West Bengal",
      "West Bengal land converter",
      "kattha to acre Bengal",
    ],
    intentTitle: "Popular West Bengal land conversions",
    intentIntro:
      "West Bengal Kattha is smaller than Bihar Kattha. This page keeps the Bengal standard separate.",
    intents: [
      {
        query: "1 Kattha in square feet West Bengal",
        answer: "One Kattha is commonly 720 square feet in West Bengal.",
      },
      {
        query: "1 Bigha in square feet West Bengal",
        answer: "One Bigha commonly equals 20 Kattha or 14,400 square feet.",
      },
      {
        query: "West Bengal Bigha to acre",
        answer: "One Bengal Bigha is about 0.33 acre; one acre is approximately 3.025 Bigha.",
      },
    ],
    faqs: [
      {
        question: "How many square feet is 1 Kattha in West Bengal?",
        answer: "One Kattha is commonly 720 square feet in West Bengal.",
      },
      {
        question: "How many West Bengal Bigha make an Acre?",
        answer: "One acre is approximately 3.025 West Bengal Bigha.",
      },
      {
        question: "Can I use a Bihar converter for Bengal land?",
        answer: "No. The state standards differ significantly, so Bengal land should use the West Bengal converter.",
      },
    ],
  },
  "rent-receipt-generator": {
    metaTitle: "Rent Receipt Generator for HRA — Print or Download",
    metaDescription:
      "Create printable monthly rent receipts for HRA and office submission with tenant, landlord, address, rent period and payment details.",
    searchTerms: [
      "rent receipt generator",
      "HRA rent receipt online",
      "rent receipt format",
      "monthly rent receipt",
      "house rent receipt download",
      "rent receipt for income tax",
    ],
    intentTitle: "Common rent receipt uses",
    intentIntro:
      "Generate a clear record for monthly rent, HRA proof and employer submission. Keep payment evidence and landlord details accurate.",
    intents: [
      {
        query: "HRA rent receipt online",
        answer: "Enter the tenant, landlord, property, amount and period details, then print or save the generated receipt.",
      },
      {
        query: "Monthly rent receipt format",
        answer: "The generated format includes the rent month, amount, payment mode and acknowledgement fields.",
      },
      {
        query: "Rent receipt with landlord PAN",
        answer: "Add the landlord PAN when your employer or applicable tax documentation requires it.",
      },
    ],
    faqs: [
      {
        question: "Can I claim HRA if I do not receive an HRA component from my employer?",
        answer: "HRA exemption requires an HRA salary component; a separate Section 80GG deduction may apply when its conditions are met.",
      },
      {
        question: "Can I claim both HRA and Home Loan tax benefits?",
        answer: "It can be possible when the facts support both claims, such as living in a rented home away from the owned property.",
      },
      {
        question: "Is it necessary to paste a revenue stamp on digital transactions?",
        answer: "Digital payment records generally provide transaction evidence; requirements can differ for cash receipts.",
      },
    ],
  },
  "cgpa-to-percentage": {
    metaTitle: "CGPA to Percentage Calculator — CBSE, AKTU & VTU",
    metaDescription:
      "Convert CGPA or SGPA to percentage using CBSE, AKTU, VTU, Mumbai University and standard 10-point formulas with examples.",
    searchTerms: [
      "CGPA to percentage calculator",
      "SGPA to percentage",
      "CBSE CGPA to percentage",
      "AKTU CGPA to percentage",
      "VTU CGPA to percentage",
      "percentage to CGPA",
    ],
    intentTitle: "Popular CGPA and SGPA conversions",
    intentIntro:
      "Universities use different formulas. Select the board or university printed on the marksheet instead of applying one multiplier everywhere.",
    intents: [
      {
        query: "CBSE CGPA to percentage",
        answer: "The commonly used CBSE conversion multiplies CGPA by 9.5.",
      },
      {
        query: "AKTU or VTU CGPA to percentage",
        answer: "The configured AKTU and VTU formula is (CGPA − 0.75) × 10.",
      },
      {
        query: "SGPA to percentage",
        answer: "Choose the applicable university formula and enter the SGPA value on its 10-point scale.",
      },
    ],
    faqs: [
      {
        question: "How do I convert percentage back to CGPA?",
        answer: "Under the 9.5 multiplier method, divide percentage by 9.5; use the institution’s official rule where available.",
      },
      {
        question: "How is CGPA calculated from multiple subject grade points?",
        answer: "A simple unweighted CGPA is the average of subject grade points, but credit-based programs use a weighted average.",
      },
      {
        question: "Is CGPA to GPA conversion for US universities different?",
        answer: "Yes. Credential evaluators may consider course credits and institution standards instead of a direct multiplier.",
      },
    ],
  },
  "photo-compressor": {
    metaTitle: "Photo & Signature Compressor to 20KB, 50KB Online",
    metaDescription:
      "Compress exam photos and signatures to 20KB, 50KB or a custom size in your browser for SSC, UPSC and online forms.",
    searchTerms: [
      "photo compressor to 20KB",
      "photo compressor to 50KB",
      "signature compressor",
      "exam photo resize",
      "image compressor for online form",
      "JPG size reducer",
    ],
    intentTitle: "Popular exam image compression tasks",
    intentIntro:
      "Choose the target size required by the application portal. Processing stays in the browser and does not upload the image to our server.",
    intents: [
      {
        query: "Compress photo to 20KB",
        answer: "Upload the image, set a 20KB target and download the optimized result after checking clarity.",
      },
      {
        query: "Compress signature to 50KB",
        answer: "Crop excess white space first, then select 50KB or the exact limit shown by the form portal.",
      },
      {
        query: "Resize exam photo online",
        answer: "Use a sharp source image and verify both file size and pixel dimensions required by the notification.",
      },
    ],
    faqs: [
      {
        question: "Can I compress PNG images using this tool?",
        answer: "Yes. PNG images are accepted and may be converted to JPEG when needed to reach a small target size.",
      },
      {
        question: "Why does my photo look blurry after compression?",
        answer: "Very small targets reduce image detail; start with a sharp source and avoid repeatedly compressing the same file.",
      },
      {
        question: "Is there a limit to how many images I can compress?",
        answer: "No site limit is imposed because compression runs locally in the browser.",
      },
    ],
  },
  "sip-calculator": {
    metaTitle: "SIP Calculator — Mutual Fund Returns & Future Value",
    metaDescription:
      "Calculate estimated SIP returns, invested amount and future value from monthly investment, duration and expected annual return.",
    searchTerms: [
      "SIP calculator",
      "mutual fund SIP calculator",
      "monthly investment calculator",
      "SIP return calculator",
      "future value of SIP",
      "SIP calculator with inflation",
    ],
    intentTitle: "Common SIP estimates",
    intentIntro:
      "Use an assumed annual return to model scenarios. Mutual fund returns are market-linked and calculator results are not guaranteed.",
    intents: [
      {
        query: "Monthly SIP return calculator",
        answer: "Enter the monthly contribution, expected annual return and duration to estimate maturity value.",
      },
      {
        query: "Future value of SIP",
        answer: "The result separates total money invested from estimated market gains over the selected period.",
      },
      {
        query: "SIP with different return rates",
        answer: "Compare conservative, moderate and higher-return assumptions rather than treating one projection as certain.",
      },
    ],
    faqs: [
      {
        question: "Can I stop or pause my SIP anytime?",
        answer: "Most open-ended mutual fund SIP instructions can be paused or cancelled subject to the fund platform’s process.",
      },
      {
        question: "What is the difference between SIP and Lumpsum?",
        answer: "A SIP invests periodically, while a lumpsum invests one larger amount at once.",
      },
      {
        question: "Are mutual fund returns guaranteed?",
        answer: "No. Mutual fund returns are market-linked and past performance does not guarantee future results.",
      },
    ],
  },
  "age-calculator": {
    metaTitle: "Age Calculator by Date of Birth — Years, Months & Days",
    metaDescription:
      "Calculate exact age from date of birth in years, months and days for exams, forms and any selected cutoff date.",
    searchTerms: [
      "age calculator",
      "age calculator by date of birth",
      "exact age calculator",
      "DOB age calculator",
      "age as on date calculator",
      "exam age calculator",
    ],
    intentTitle: "Common date-of-birth calculations",
    intentIntro:
      "Use today or choose an official cutoff date to calculate completed years, remaining months and days.",
    intents: [
      {
        query: "Age calculator by date of birth",
        answer: "Enter the date of birth to get exact completed age in years, months and days.",
      },
      {
        query: "Age as on date calculator",
        answer: "Select the cutoff date printed in the exam or application notice instead of using today’s date.",
      },
      {
        query: "Age in total days and months",
        answer: "The results also show total months, weeks, days and hours for the selected dates.",
      },
    ],
    faqs: [
      {
        question: "How does a leap year affect age calculations?",
        answer: "The calculator uses actual calendar month lengths, including February 29 in leap years.",
      },
      {
        question: "Can I calculate my age in total hours or seconds?",
        answer: "The page shows total months, weeks, days and hours in addition to calendar age.",
      },
      {
        question: "What date should I use for exam eligibility?",
        answer: "Use the exact cutoff date stated in the official notification for that exam or post.",
      },
    ],
  },
  "gst-calculator": {
    metaTitle: "GST Calculator India — Add or Remove GST Online",
    metaDescription:
      "Add or remove 5%, 12%, 18% or 28% GST and calculate base price, tax amount, total, CGST and SGST instantly.",
    searchTerms: [
      "GST calculator",
      "remove GST calculator",
      "add GST calculator",
      "GST inclusive calculator",
      "GST exclusive calculator",
      "CGST SGST calculator",
    ],
    intentTitle: "Common GST calculations",
    intentIntro:
      "Choose Add GST when the entered value is before tax, or Remove GST when the entered total already includes tax.",
    intents: [
      {
        query: "Add GST to base price",
        answer: "GST amount equals base price × rate ÷ 100; add that tax to get the invoice total.",
      },
      {
        query: "Remove GST from inclusive amount",
        answer: "The calculator divides the inclusive total by 1 plus the GST rate to recover the base price.",
      },
      {
        query: "CGST and SGST split",
        answer: "For an intra-state transaction, the selected GST rate is shown as equal CGST and SGST portions.",
      },
    ],
    faqs: [
      {
        question: "What is Input Tax Credit (ITC)?",
        answer: "Eligible registered businesses may offset qualifying GST paid on purchases against GST collected on sales.",
      },
      {
        question: "How is IGST different from CGST and SGST?",
        answer: "Inter-state supplies generally use IGST, while intra-state supplies split tax into CGST and SGST.",
      },
      {
        question: "How do I remove GST from an inclusive price?",
        answer: "Divide the inclusive price by 1 plus the GST rate expressed as a decimal, then subtract the base price from the total.",
      },
    ],
  },
}

export function getToolSeoProfile(slug: string): ToolSeoProfile | undefined {
  return TOOL_SEO_PROFILES[slug]
}
