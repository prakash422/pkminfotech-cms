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
  "ssc-cgl-tier-1-marks-calculator": {
    metaTitle: "SSC CGL Tier 1 Marks Calculator — Raw Score & Negative Marking",
    metaDescription:
      "Calculate your SSC CGL Tier 1 raw marks and accuracy instantly from your answer key responses (+2 correct, -0.50 negative marking).",
    searchTerms: [
      "ssc cgl tier 1 marks calculator",
      "ssc cgl answer key score calculator",
      "calculate ssc cgl tier 1 marks",
      "ssc cgl raw marks calculator",
      "ssc cgl negative marking calculation",
    ],
    intentTitle: "SSC CGL Tier 1 Scoring Questions",
    intentIntro:
      "SSC CGL Tier 1 consists of 100 questions carrying 200 marks across 4 sections. Enter your correct and wrong attempts below.",
    intents: [
      {
        query: "What is the negative marking in SSC CGL Tier 1?",
        answer: "For every incorrect response, 0.50 marks (25% penalty) are deducted from the total score.",
      },
      {
        query: "Are Tier 1 marks counted in final merit?",
        answer: "No, SSC CGL Tier 1 is qualifying in nature. Final merit is determined strictly by Tier 2 marks.",
      },
    ],
    faqs: [
      {
        question: "What is a good raw score in SSC CGL Tier 1?",
        answer: "A raw score of 135–150+ in moderate shifts is generally considered safe for qualifying Tier 1 in the UR category.",
      },
      {
        question: "How does normalization affect Tier 1 marks?",
        answer: "SSC applies mathematical formula normalization to equalize difficulty across multiple exam shifts.",
      },
    ],
  },
  "ssc-cgl-tier-2-marks-calculator": {
    metaTitle: "SSC CGL Tier 2 Marks Calculator — Paper 1 (390 Marks)",
    metaDescription:
      "Calculate your SSC CGL Tier 2 Paper 1 merit marks (Maths, Reasoning, English, GA) with +3 for correct and -1 negative penalty.",
    searchTerms: [
      "ssc cgl tier 2 marks calculator",
      "ssc cgl tier 2 score calculator",
      "cgl tier 2 390 marks calculation",
      "ssc cgl tier 2 negative marking",
    ],
    intentTitle: "SSC CGL Tier 2 Merit Scoring",
    intentIntro:
      "Tier 2 Paper 1 has 130 questions for 390 marks (+3 correct, -1 negative). Computer Knowledge and Typing are qualifying.",
    intents: [
      {
        query: "What is the marking scheme for SSC CGL Tier 2 Paper 1?",
        answer: "Each question carries 3 marks, and 1 mark is deducted for every incorrect attempt.",
      },
      {
        query: "What is the total marks for SSC CGL Tier 2 final merit?",
        answer: "Final merit list is prepared out of 390 marks (Section 1: 180 marks + Section 2: 210 marks).",
      },
    ],
    faqs: [
      {
        question: "Are Computer module marks added to the 390 total?",
        answer: "No, Section 3 Computer Knowledge (60 marks) is qualifying in nature with higher cutoff standards for CPT posts.",
      },
      {
        question: "What is a safe score in SSC CGL Tier 2 for 4600 GP posts?",
        answer: "Generally, 315–335+ marks out of 390 are required for top posts like ASO (MEA, CSS) and GST Inspector.",
      },
    ],
  },
  "ssc-cgl-final-score-calculator": {
    metaTitle: "SSC CGL Final Merit Score & Rank Calculator",
    metaDescription:
      "Compute your overall SSC CGL aggregate marks and check your post preference eligibility based on Tier 2 performance.",
    searchTerms: [
      "ssc cgl final score calculator",
      "ssc cgl total marks calculator",
      "ssc cgl post preference score",
      "cgl merit list marks calculator",
    ],
    intentTitle: "Final Selection & Merit Calculation",
    intentIntro:
      "Enter your normalized or raw marks across sections to see your total score out of 390 and post readiness.",
    intents: [
      {
        query: "How is SSC CGL final merit prepared?",
        answer: "Final merit ranking is based solely on Section 1 and Section 2 scores in Paper 1 of Tier 2 (390 marks).",
      },
    ],
    faqs: [
      {
        question: "Is there an interview in SSC CGL?",
        answer: "No, interviews were discontinued for Group B and C non-gazetted posts by the Government of India.",
      },
    ],
  },
  "ssc-cgl-cutoff-predictor": {
    metaTitle: "SSC CGL Expected Cutoff Predictor — Safe Score by Category",
    metaDescription:
      "Predict expected SSC CGL cutoff scores for UR, OBC, EWS, SC, ST across 4600, 4200, 2800, and 2400 Grade Pay vacancies.",
    searchTerms: [
      "ssc cgl cutoff predictor",
      "expected cutoff ssc cgl",
      "safe score ssc cgl tier 2",
      "ssc cgl category wise cutoff",
    ],
    intentTitle: "Expected Cutoff & Safe Score Analysis",
    intentIntro:
      "Cutoffs depend on total vacancies, shift difficulty, and student score distributions across tiers.",
    intents: [
      {
        query: "What is expected safe score for General category in SSC CGL?",
        answer: "For a 2400/2800 GP post, 280–295+ is typically required; for 4600 GP posts, 315+ is safe.",
      },
    ],
    faqs: [
      {
        question: "How accurate are SSC CGL cutoff predictors?",
        answer: "Predictors use historical normalization patterns and vacancy data to give an estimated target range.",
      },
    ],
  },
  "ssc-cgl-rank-predictor": {
    metaTitle: "SSC CGL Rank Predictor — Estimate All-India & Category Rank",
    metaDescription:
      "Estimate your All-India Rank (AIR) and category ranking based on your Tier 2 score and shift difficulty percentile.",
    searchTerms: [
      "ssc cgl rank predictor",
      "expected rank in ssc cgl",
      "cgl rank vs marks",
      "calculate ssc cgl air rank",
    ],
    intentTitle: "SSC CGL Rank Estimation",
    intentIntro:
      "Check where you stand compared to thousands of aspirants based on your marks.",
    intents: [
      {
        query: "What marks are needed for top 1000 rank in SSC CGL?",
        answer: "Historically, marks above 330–340 out of 390 place candidates comfortably within the top 1000 All-India ranks.",
      },
    ],
    faqs: [
      {
        question: "Does normalization change candidate rank significantly?",
        answer: "Yes, candidates from tougher shifts can gain 15–25 marks through normalization, shifting their ranks upward.",
      },
    ],
  },
  "ssc-cgl-age-limit-calculator": {
    metaTitle: "SSC CGL Age Limit Calculator — Check DOB Eligibility",
    metaDescription:
      "Verify your exact age eligibility for 18–27, 20–30, and 18–32 years SSC CGL posts with OBC/SC/ST/PwD age relaxations.",
    searchTerms: [
      "ssc cgl age limit calculator",
      "ssc cgl age criteria dob",
      "am i eligible for ssc cgl",
      "ssc cgl age relaxation obc sc st",
    ],
    intentTitle: "Age Criteria & Crucial Date Eligibility",
    intentIntro:
      "Enter your Date of Birth and category to see which SSC CGL posts and Grade Pays you can apply for.",
    intents: [
      {
        query: "What is the crucial date for age calculation in SSC CGL?",
        answer: "The crucial date is specified in the official notification, usually 1st January or 1st August of the exam year.",
      },
    ],
    faqs: [
      {
        question: "How much age relaxation is provided for OBC in SSC?",
        answer: "OBC candidates receive 3 years of upper age relaxation, while SC/ST candidates receive 5 years.",
      },
    ],
  },
  "ssc-eligibility-checker": {
    metaTitle: "SSC Exams Eligibility Checker — CGL, CHSL, MTS, GD, CPO",
    metaDescription:
      "Find which SSC exams (10th, 12th, or Graduate level) you qualify for based on your qualification, age, and category.",
    searchTerms: [
      "ssc eligibility checker",
      "which ssc exam can i give",
      "ssc qualification eligibility",
      "ssc chsl vs cgl eligibility",
    ],
    intentTitle: "Complete SSC Exam Eligibility Guide",
    intentIntro:
      "Check your eligibility across all major Staff Selection Commission competitive recruitment tests.",
    intents: [
      {
        query: "Can final year college students apply for SSC CGL?",
        answer: "Yes, provided they acquire the essential degree qualification on or before the crucial date in the notification.",
      },
    ],
    faqs: [
      {
        question: "What is minimum qualification for SSC MTS?",
        answer: "Candidates must have passed 10th Standard (Matriculation) from a recognized board.",
      },
    ],
  },
  "rrb-ntpc-normalization-calculator": {
    metaTitle: "RRB NTPC Normalization Marks Calculator — Shift Percentile",
    metaDescription:
      "Calculate your normalized score for Railway RRB NTPC CBT 1 and CBT 2 using the official Railway normalization formula.",
    searchTerms: [
      "rrb ntpc normalization calculator",
      "railway score normalization formula",
      "rrb ntpc cbt marks calculator",
      "rrb group d normalization marks",
    ],
    intentTitle: "Railway Normalization Process",
    intentIntro:
      "Indian Railways uses percentile-based or standard deviation normalization across multiple examination sessions.",
    intents: [
      {
        query: "Why do marks increase or decrease after RRB normalization?",
        answer: "If your shift average was lower than the base shift, your marks increase to balance the harder test paper.",
      },
    ],
    faqs: [
      {
        question: "What is the negative marking penalty in RRB NTPC?",
        answer: "One-third (1/3rd) of the marks assigned to that question is deducted for every incorrect response.",
      },
    ],
  },
  "ibps-score-calculator": {
    metaTitle: "IBPS PO & Clerk Score Calculator — Sectional & Overall",
    metaDescription:
      "Calculate your raw marks and sectional cutoff clearance for IBPS PO, Clerk, and RRB banking preliminary & main exams.",
    searchTerms: [
      "ibps score calculator",
      "ibps po marks calculator",
      "ibps clerk negative marking calculator",
      "banking exam score calculator",
    ],
    intentTitle: "Banking Exam Marks & Sectional Cutoff",
    intentIntro:
      "IBPS deducts 0.25 (1/4th) marks for wrong answers. Candidates must clear both sectional and overall cutoffs.",
    intents: [
      {
        query: "What is negative marking in IBPS exams?",
        answer: "A penalty of 0.25 marks is deducted for each question answered incorrectly.",
      },
    ],
    faqs: [
      {
        question: "Do IBPS exams have sectional cutoffs?",
        answer: "Yes, candidates must pass each section individually (Quantitative, Reasoning, English) as well as the total cutoff.",
      },
    ],
  },
  "bank-final-score-predictor": {
    metaTitle: "Bank Final Score Calculator — 80:20 Merit Weightage",
    metaDescription:
      "Convert your IBPS / SBI PO Mains score (80%) and Interview marks (20%) into a final 100-point merit list aggregate.",
    searchTerms: [
      "bank final score predictor",
      "ibps po 80 20 calculator",
      "mains and interview score calculator bank",
      "bank final merit score calculation",
    ],
    intentTitle: "80:20 Weightage Formula for Banking",
    intentIntro:
      "Calculate your final score out of 100: (Mains Marks / 225) * 80 + (Interview Marks / 100) * 20.",
    intents: [
      {
        query: "How is the 80:20 weightage calculated in IBPS PO?",
        answer: "Mains written score is scaled down to 80 points, and Interview marks are scaled to 20 points, totaling 100.",
      },
    ],
    faqs: [
      {
        question: "What is minimum qualifying interview marks in IBPS?",
        answer: "Minimum qualifying marks in interview is 40% (35% for SC/ST/OBC/PwD candidates).",
      },
    ],
  },
  "ctet-qualifying-marks": {
    metaTitle: "CTET Qualifying Marks Calculator — General vs Reserved Cutoffs",
    metaDescription:
      "Check if your CTET Paper 1 or Paper 2 score qualifies for teaching eligibility (60% / 90 marks General, 55% / 82 marks Reserved).",
    searchTerms: [
      "ctet qualifying marks calculator",
      "ctet pass marks general obc sc st",
      "how much marks required to clear ctet",
      "ctet paper 1 qualifying marks",
    ],
    intentTitle: "CTET Passing Criteria (CBSE Standard)",
    intentIntro:
      "CTET has 150 questions for 150 marks with no negative marking. Check passing eligibility instantly.",
    intents: [
      {
        query: "Is there negative marking in CTET?",
        answer: "No, there is no negative marking in Central Teacher Eligibility Test (CTET).",
      },
    ],
    faqs: [
      {
        question: "What is the validity period of CTET certificate?",
        answer: "CTET qualifying certificate validity is for lifetime across all categories.",
      },
    ],
  },
  "police-height-eligibility": {
    metaTitle: "Police Height Eligibility Checker — Constable & SI Criteria",
    metaDescription:
      "Check your height and chest measurements against official physical requirements for UP Police, Bihar Police, Delhi Police & SSC GD.",
    searchTerms: [
      "police height eligibility checker",
      "up police constable height criteria",
      "bihar police height for female obc",
      "ssc gd physical height requirements",
    ],
    intentTitle: "Physical Standards Test (PST) Eligibility",
    intentIntro:
      "Select your state, gender, and category to check whether you meet the mandatory physical recruitment cutoff.",
    intents: [
      {
        query: "What is the minimum height for female candidates in UP Police?",
        answer: "General, OBC, and SC female candidates require 152 cm minimum height (147 cm for ST female candidates).",
      },
    ],
    faqs: [
      {
        question: "Is there chest expansion requirement for female candidates?",
        answer: "No, chest measurement criteria is only applicable to male candidates in police recruitment.",
      },
    ],
  },
  "7th-pay-salary-calculator": {
    metaTitle: "7th Pay Commission Salary Calculator — In-Hand, 50% DA & HRA",
    metaDescription:
      "Calculate your exact monthly in-hand salary for 7th Pay Commission Levels 1 to 10 with 50% DA, revised HRA (30%, 20%, 10%), TA, and NPS deductions.",
    searchTerms: [
      "7th pay commission salary calculator",
      "7th cpc salary calculator with 50 da",
      "ssc cgl salary after 7th pay commission",
      "level 7 in hand salary ssc cgl aso",
      "level 4 in hand salary tax assistant",
      "central government salary calculator 2024 2025",
      "x y z city hra rates central government",
    ],
    intentTitle: "7th CPC Central Salary & Allowance Rules",
    intentIntro:
      "Select your Pay Level (1 to 10) and posting city category (X, Y, Z) to see your complete monthly salary breakdown.",
    intents: [
      {
        query: "How is in-hand salary calculated under 7th Pay Commission?",
        answer: "In-hand salary = Gross Salary (Basic Pay + DA + HRA + TA + DA on TA) minus mandatory deductions (NPS 10%, CGHS, and CGEGIS).",
      },
      {
        query: "What are the revised HRA rates after DA reached 50%?",
        answer: "When DA touched 50%, HRA rates automatically revised upward to 30% for X Cities (Metros), 20% for Y Cities (Tier 2), and 10% for Z Cities (Rural/Small Towns).",
      },
      {
        query: "What is Level 7 Grade Pay 4600 in-hand salary in Delhi (X City)?",
        answer: "For Level 7 (Basic ₹44,900), monthly gross salary is approx ₹84,270 and net monthly in-hand is approx ₹74,500 after NPS and CGHS deductions.",
      },
      {
        query: "How much is deducted for NPS from central government employees?",
        answer: "The employee contributes 10% of (Basic Pay + DA) towards NPS, while the Central Government adds a matching 14% contribution into the employee pension account.",
      },
    ],
    faqs: [
      {
        question: "Did HRA increase to 30%, 20%, and 10% when DA touched 50%?",
        answer:
          "Yes, as per official Department of Expenditure guidelines, when DA crossed 50%, HRA rates automatically revised from 27%/18%/9% to 30%/20%/10% for X, Y, and Z class cities.",
      },
      {
        question: "What is the difference between Gross Salary and In-Hand Salary?",
        answer:
          "Gross salary includes Basic Pay + DA + HRA + TA. In-hand (net) salary is the actual amount credited to your bank account after mandatory deductions for Employee NPS, CGHS, and CGEGIS.",
      },
      {
        question: "How much does the Government contribute to NPS?",
        answer:
          "The Central Government contributes 14% of (Basic Pay + DA) towards the employee's NPS Tier-1 account, while 10% is deducted from the employee's monthly pay.",
      },
    ],
  },
  "gaj-to-square-feet": {
    metaTitle: "Gaj to Square Feet Calculator — 100 Gaj, 50 Gaj & Plot Dimensions",
    metaDescription:
      "Convert Gaj (Square Yard) to Square Feet and Square Meters instantly. Calculate plot dimensions, boundary wall length, and registry costs with 100% precision.",
    searchTerms: [
      "gaj to square feet",
      "gaj to sq ft",
      "100 gaj in square feet",
      "50 gaj in square feet",
      "60 gaj in square feet",
      "square feet to gaj",
      "plot size calculator in gaj",
      "gaj to square meter",
      "plot cost calculator by gaj",
      "1 gaj kitna square feet hota hai",
    ],
    intentTitle: "Gaj to Square Feet & Plot Size Conversions",
    intentIntro:
      "Convert any plot area in Gaj to Square Feet and calculate length, width, and property registry charges instantly.",
    intents: [
      {
        query: "1 Gaj me kitne square feet hote hain?",
        answer: "1 Gaj (Square Yard) me exactly 9 Square Feet hote hain. Length 3 feet aur breadth 3 feet hone par 3 × 3 = 9 sq ft banta hai.",
      },
      {
        query: "100 Gaj me kitne square feet hote hain aur plot size kya hota hai?",
        answer: "100 Gaj = 900 Square Feet. Iska sabse standard residential plot dimension 20 feet front × 45 feet depth (lambai) ya 18 × 50 feet hota hai.",
      },
      {
        query: "50 Gaj plot size in square feet and dimensions",
        answer: "50 Gaj = 450 Square Feet. Iska most popular dimension 15 feet front × 30 feet depth hota hai, jo 1 BHK ya budget ghar ke liye best hai.",
      },
      {
        query: "How to calculate plot cost from Gaj and rate?",
        answer: "Total Plot Cost = Total Gaj × Rate per Gaj. Example: 100 Gaj plot at ₹25,000/gaj costs ₹25,00,000 + state stamp duty (approx 5%-7%).",
      },
    ],
    faqs: [
      {
        question: "Is Gaj equal to Square Yard?",
        answer:
          "Yes, in Indian real estate terminology, Gaj is the colloquial Hindi term for Square Yard (sq yd). 1 Gaj = 1 Sq Yard = 9 Sq Ft = 0.8361 Square Meters.",
      },
      {
        question: "How many Gaj are in 1 Bigha?",
        answer:
          "In Punjab and Haryana, 1 Bigha = 1,000 Gaj (9,000 sq ft). In Eastern UP and Bihar, 1 Pucca Bigha = 3,025 Gaj (27,225 sq ft). In Rajasthan, 1 Bigha = 1,936 Gaj.",
      },
      {
        question: "How many Gaj are in 1 Acre?",
        answer: "1 Acre always equals exactly 4,840 Gaj (43,560 Square Feet).",
      },
    ],
  },
  "signature-resizer-10-to-20-kb": {
    metaTitle: "Govt Exam Signature & Photo Resizer — 10KB to 20KB & 20KB to 50KB",
    metaDescription:
      "Resize signatures to 10KB–20KB (140x60 px) and photos to 20KB–50KB for SSC CGL, CHSL, MTS, UPSC, and IBPS online forms. 100% free and private.",
    searchTerms: [
      "signature resizer 10 to 20 kb",
      "signature resize online 10 to 20 kb",
      "ssc signature resizer 10 to 20 kb",
      "upsc signature resize 10 to 20 kb",
      "photo and signature resizer for govt exams",
      "signature 140x60 px converter",
      "thumb impression resizer 20 to 50 kb",
      "reduce signature size below 20 kb",
    ],
    intentTitle: "Government Exam Signature & Photo Resizing Guidelines",
    intentIntro:
      "Choose your exam preset below to automatically compress and resize your signature or photo strictly within the required KB range.",
    intents: [
      {
        query: "How to resize signature to 10KB–20KB for SSC?",
        answer: "Upload your signature photo, select the SSC Signature preset (140x60 px), and our client-side tool will compress it to ~15 KB in JPG format instantly.",
      },
      {
        query: "What are the official SSC CGL signature specifications?",
        answer: "SSC requires signature file size strictly between 10.0 KB and 20.0 KB, image dimensions 140 width × 60 height pixels (4.0 cm × 2.0 cm), and JPG/JPEG format.",
      },
      {
        query: "What are IBPS thumb impression and declaration requirements?",
        answer: "IBPS requires Left Thumb Impression between 20 KB and 50 KB (240x240 px) and Handwritten Declaration between 50 KB and 100 KB.",
      },
    ],
    faqs: [
      {
        question: "Why do SSC portals reject signatures as 'file size not within limits'?",
        answer:
          "SSC validation code strictly rejects any image smaller than 10.00 KB or larger than 20.00 KB. Our resizer uses binary-search canvas compression to guarantee the exact byte range.",
      },
      {
        question: "Is my signature photo secure and private?",
        answer:
          "Yes, 100%. Processing takes place entirely within your browser on your device using the HTML5 Canvas API. The image is never uploaded to any external server.",
      },
    ],
  },
  "typing-speed-test": {
    metaTitle: "SSC & Court Typing Speed Test Online — 1, 5, 10, 15 Min Practice",
    metaDescription:
      "Practice free typing tests for SSC CGL Tier 2, CHSL, and High Court exams with official Net WPM, accuracy %, and KDPH error evaluation formula.",
    searchTerms: [
      "ssc typing test online",
      "ssc chsl typing test 35 wpm",
      "ssc cgl tier 2 typing test dest",
      "court typing speed test 35 wpm",
      "typing test 10 minutes online",
      "typing test net wpm calculation ssc",
      "free typing test with backspace allowed",
      "key depressions per hour kdph calculator",
    ],
    intentTitle: "Official Typing Test Speed & Evaluation Criteria",
    intentIntro:
      "Select your test duration and practice real exam paragraphs modeled after SSC CHSL, CGL DEST, and High Court clerk tests.",
    intents: [
      {
        query: "What is the typing speed requirement for SSC CHSL?",
        answer: "SSC CHSL requires 35 Words Per Minute (WPM) in English or 30 WPM in Hindi in a 10-minute test with permissible error limit of 5% to 7%.",
      },
      {
        query: "What is the typing speed requirement for SSC CGL Tier 2?",
        answer: "SSC CGL DEST requires 2,000 Key Depressions in 15 minutes (approx 27 WPM) with maximum 5% errors for UR and 7% for reserved categories.",
      },
      {
        query: "How is Net WPM calculated in government typing tests?",
        answer: "Net WPM = Gross WPM - (Errors / Test Duration in Minutes), where 1 Standard Word equals 5 keystrokes including spacebar.",
      },
    ],
    faqs: [
      {
        question: "Is backspace allowed in the official SSC typing exam?",
        answer:
          "Yes, SSC typing software allows candidates to use backspace to edit and rectify mistakes before the test timer expires.",
      },
      {
        question: "What is KDPH in typing tests?",
        answer:
          "KDPH stands for Key Depressions Per Hour. For SSC CGL, 2,000 key depressions in 15 minutes equals 8,000 KDPH.",
      },
    ],
  },
}

export function getToolSeoProfile(slug: string): ToolSeoProfile | undefined {
  return TOOL_SEO_PROFILES[slug]
}
