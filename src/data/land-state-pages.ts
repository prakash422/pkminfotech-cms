export type LandStateKey = "bihar" | "up_east" | "up_west" | "west_bengal"

export interface LandStatePageConfig {
  stateKey: LandStateKey
  /** Alternate state keys selectable on this page */
  allowedStates: LandStateKey[]
  h1Suffix: string
  intro: string
  historyTitle: string
  historyHtml: string
  practiceTitle: string
  practiceHtml: string
  faq: { q: string; a: string }[]
}

export const LAND_STATE_PAGES: Record<string, LandStatePageConfig> = {
  "bigha-to-square-feet-bihar": {
    stateKey: "bihar",
    allowedStates: ["bihar"],
    h1Suffix: "Bihar",
    intro:
      "This page is written specifically for Bihar land deals, mutation papers, and local sale agreements where Bigha, Kattha and Dhur still appear in everyday speech — even when modern documents also mention square feet or hectares.",
    historyTitle: "How Bihar still uses Bigha and Kattha",
    historyHtml: `
      <p>In Bihar, rural and peri-urban plots are frequently described in <strong>Bigha–Kattha–Dhur</strong>. The widely used practical standard is:</p>
      <ul>
        <li><strong>1 Bigha = 20 Kattha</strong></li>
        <li><strong>1 Kattha = 20 Dhur</strong></li>
        <li><strong>1 Bigha ≈ 27,225 square feet</strong> (so 1 Kattha ≈ 1,361.25 sq ft)</li>
      </ul>
      <p>That means <strong>1 Acre (43,560 sq ft) is about 1.6 Bigha or 32 Kattha</strong> in Bihar. Buyers comparing a Patna outskirts plot listed in Kattha with a city flat brochure listed in sq ft should convert both sides before negotiating.</p>
      <p>Always cross-check the circle rate / stamp duty notification for your district. Local practice can use the same unit names with slightly different rods historically; for online estimates, the 27,225 sq ft Bigha is the common reference used across Bihar converter tools.</p>
    `,
    practiceTitle: "Practical tips for Bihar property paperwork",
    practiceHtml: `
      <p>When reading a Bihar sale deed or family partition note:</p>
      <ol>
        <li>Confirm whether the area is written in Bigha, Kattha, or Decimal/Dismil in newer papers.</li>
        <li>Convert everything to square feet once, then to acre — do not mix Kattha from Bihar with Kattha from West Bengal (those are different sizes).</li>
        <li>For bank valuation or online listing portals, brokers often restate Bihar Kattha as sq ft; verify the multiplier (≈1,361.25) rather than assuming 720 or 1,350 from another state.</li>
      </ol>
      <p>This converter locks the Bihar standard so you do not accidentally apply a West Bengal or Punjab Bigha size to a Bihar plot.</p>
    `,
    faq: [
      {
        q: "How many square feet is 1 Bigha in Bihar?",
        a: "The common practical value is 27,225 square feet for 1 Bigha in Bihar (20 Kattha × 1,361.25 sq ft).",
      },
      {
        q: "How many Kattha make 1 Acre in Bihar?",
        a: "About 32 Kattha, because 43,560 ÷ 1,361.25 ≈ 32.",
      },
      {
        q: "Is Bihar Kattha the same as West Bengal Kattha?",
        a: "No. Bihar Kattha is much larger (~1,361 sq ft) than the common West Bengal Kattha (~720 sq ft). Always pick the state first.",
      },
    ],
  },
  "bigha-to-kattha-up": {
    stateKey: "up_east",
    allowedStates: ["up_east", "up_west"],
    h1Suffix: "Uttar Pradesh",
    intro:
      "Uttar Pradesh uses Bigha and Biswa widely in eastern and western belts, but the square-foot size of a Bigha is not identical everywhere. This page helps you convert using the two most common UP references: Eastern UP (≈27,225 sq ft) and Western UP (≈27,000 sq ft).",
    historyTitle: "Eastern vs Western UP Bigha",
    historyHtml: `
      <p>In many Eastern UP districts, people still quote land in Bigha/Biswa with a Bigha close to the classic <strong>27,225 sq ft</strong> figure (similar to the Bihar/standard pucca reference). In parts of Western UP, a slightly smaller <strong>≈27,000 sq ft</strong> Bigha is commonly used in local talk and older notes.</p>
      <p>Both regions typically keep the nested structure of <strong>1 Bigha = 20 Biswa (often called Kattha in conversation)</strong>. The difference that matters for money is the square-foot base — a 2% gap on a large farm adds up.</p>
      <p>If your document simply says “Bigha” without district context, ask the writer whether they mean the eastern or western convention, or convert both ways and see how far the quote moves.</p>
    `,
    practiceTitle: "Using this converter for UP deals",
    practiceHtml: `
      <ol>
        <li>Select <strong>Eastern Uttar Pradesh</strong> or <strong>Western Uttar Pradesh</strong> in the dropdown.</li>
        <li>Enter Bigha (decimals allowed, e.g. 1.5).</li>
        <li>Compare Kattha/Biswa, sq ft, gaj, and acre before you finalize brokerage talk.</li>
      </ol>
      <p>For registry, stamp vendors and advocates may still prefer metric units on the final deed. Use this tool for negotiation clarity, then align the final paperwork with the unit your sub-registrar expects.</p>
    `,
    faq: [
      {
        q: "What is 1 Bigha in Eastern UP?",
        a: "Commonly treated as 27,225 square feet with 20 Biswa/Kattha per Bigha.",
      },
      {
        q: "What is 1 Bigha in Western UP?",
        a: "Often taken as about 27,000 square feet with 20 Biswa per Bigha.",
      },
      {
        q: "Are Pucca and Kucha Bigha the same in UP?",
        a: "No. In some western belts, a Kucha Bigha is treated as one-third of a Pucca Bigha. Confirm which term is written on the paper.",
      },
    ],
  },
  "bigha-to-kattha-west-bengal": {
    stateKey: "west_bengal",
    allowedStates: ["west_bengal"],
    h1Suffix: "West Bengal",
    intro:
      "West Bengal land talk still uses Bigha and Kattha, but the sizes differ sharply from Bihar or UP. Here, 1 Bigha is commonly 14,400 sq ft and 1 Kattha is 720 sq ft — roughly half of a Bihar Kattha.",
    historyTitle: "West Bengal Bigha–Kattha sizes",
    historyHtml: `
      <p>A practical West Bengal reference used in many converters and local explanations is:</p>
      <ul>
        <li><strong>1 Bigha = 20 Kattha</strong></li>
        <li><strong>1 Kattha = 720 square feet</strong></li>
        <li><strong>1 Bigha = 14,400 square feet</strong> (about 0.33 acre)</li>
      </ul>
      <p>That is why a “2 Kattha plot in Kolkata suburbs” is a very different absolute area from a “2 Kattha plot in Bihar”. Always convert to sq ft before comparing interstate listings.</p>
      <p>Urban apartments are usually marketed in sq ft or sq m; peri-urban and rural Bengal still mix Bigha/Kattha in verbal negotiation. This page locks the Bengal multipliers so you do not paste a Bihar number by mistake.</p>
    `,
    practiceTitle: "Tips for Bengal buyers and sellers",
    practiceHtml: `
      <ol>
        <li>Ask whether the quoted Kattha uses the 720 sq ft convention.</li>
        <li>Convert to sq ft and acre, then compare with circle rates published in sq ft where applicable.</li>
        <li>If a broker quotes “Bigha” for a small urban parcel, double-check — many city deals are actually in Katha/Chatak variants; clarify the exact unit.</li>
      </ol>
      <p>Use the calculator below for quick Bengal conversions, then verify critical deals with a local deed writer or advocate.</p>
    `,
    faq: [
      {
        q: "How many square feet is 1 Kattha in West Bengal?",
        a: "Commonly 720 square feet per Kattha, with 20 Kattha making one 14,400 sq ft Bigha.",
      },
      {
        q: "How many West Bengal Bigha make an Acre?",
        a: "About 3 Bigha (43,560 ÷ 14,400 ≈ 3.025).",
      },
      {
        q: "Can I use a Bihar converter for Bengal land?",
        a: "No. Bihar Kattha is roughly 1,361 sq ft versus Bengal’s ~720 sq ft. Always choose the West Bengal tool for Bengal plots.",
      },
    ],
  },
}
