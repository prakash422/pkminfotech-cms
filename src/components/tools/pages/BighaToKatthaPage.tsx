"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Globe2, Calculator, Info, Scale, Award, HelpCircle } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

interface StateConfig {
  name: string
  bighaToKattha: number
  bighaToSqFt: number
  bighaToBiswa: number
  note: string
}

const STATE_CONFIGS: Record<string, StateConfig> = {
  bihar: {
    name: "Bihar",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Bihar, 1 Bigha is standardly 20 Kattha, and 1 Kattha equals 1,361.25 sq ft."
  },
  up_east: {
    name: "Eastern Uttar Pradesh",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Eastern UP, 1 Bigha equals 20 Biswa (Kattha) which matches 27,225 sq ft."
  },
  up_west: {
    name: "Western Uttar Pradesh",
    bighaToKattha: 20,
    bighaToSqFt: 27000,
    bighaToBiswa: 20,
    note: "In Western UP, 1 Bigha equals 20 Biswa (Kattha) which equals 27,000 sq ft."
  },
  west_bengal: {
    name: "West Bengal",
    bighaToKattha: 20,
    bighaToSqFt: 14400,
    bighaToBiswa: 20,
    note: "In West Bengal, 1 Bigha equals 20 Kattha, where 1 Kattha is 720 sq ft."
  },
  assam: {
    name: "Assam",
    bighaToKattha: 5,
    bighaToSqFt: 14400,
    bighaToBiswa: 5,
    note: "In Assam, 1 Bigha is divided into 5 Kattha, totaling 14,400 sq ft."
  },
  punjab_haryana: {
    name: "Punjab & Haryana",
    bighaToKattha: 20,
    bighaToSqFt: 9000,
    bighaToBiswa: 20,
    note: "In Punjab/Haryana, 1 Bigha is standardly 9,000 sq ft."
  }
}

export default function BighaToKatthaPage({ title, description, basePath }: { title: string; description: string; basePath: string }) {
  const [stateKey, setStateKey] = useState<string>("bihar")
  const [bighaInput, setBighaInput] = useState<string>("1")
  const [results, setResults] = useState({
    kattha: 20,
    biswa: 20,
    sqFt: 27225,
    sqGaj: 3025,
    sqMeter: 2529.28,
    acre: 0.625
  })

  useEffect(() => {
    const config = STATE_CONFIGS[stateKey]
    const bigha = parseFloat(bighaInput) || 0

    if (bigha <= 0) {
      setResults({ kattha: 0, biswa: 0, sqFt: 0, sqGaj: 0, sqMeter: 0, acre: 0 })
      return
    }

    const sqFt = bigha * config.bighaToSqFt
    setResults({
      kattha: bigha * config.bighaToKattha,
      biswa: bigha * config.bighaToBiswa,
      sqFt: sqFt,
      sqGaj: parseFloat((sqFt / 9).toFixed(2)),
      sqMeter: parseFloat((sqFt / 10.7639).toFixed(2)),
      acre: parseFloat((sqFt / 43560).toFixed(4))
    })
  }, [stateKey, bighaInput])

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Land Area", href: basePath },
          { label: "Bigha to Kattha Converter" }
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="chip-row">
        <span className="chip chip-active">All states</span>
        <Link href="/tools/land-area/bigha-to-square-feet-bihar" className="chip">
          Bihar
        </Link>
        <Link href="/tools/land-area/bigha-to-kattha-up" className="chip">
          <span className="d-md-none">UP</span>
          <span className="d-none d-md-inline">Uttar Pradesh</span>
        </Link>
        <Link href="/tools/land-area/bigha-to-kattha-west-bengal" className="chip">
          <span className="d-md-none">WB</span>
          <span className="d-none d-md-inline">West Bengal</span>
        </Link>
        <Link href="/tools/land-area" className="chip chip-muted">
          All land tools
        </Link>
      </div>

      <div className="row g-4 mb-3">
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> Input Details
            </h2>
            <div className="mb-3">
              <label htmlFor="stateSelect" className="form-label small fw-semibold text-secondary">Select State / Region</label>
              <select
                id="stateSelect"
                className="form-select border-light-subtle rounded-3"
                value={stateKey}
                onChange={(e) => setStateKey(e.target.value)}
                style={{ padding: '10px 14px' }}
              >
                {Object.entries(STATE_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="bighaInput" className="form-label small fw-semibold text-secondary">Enter Value in Bigha</label>
              <input
                id="bighaInput"
                type="number"
                step="any"
                className="form-control border-light-subtle rounded-3"
                placeholder="e.g. 1"
                value={bighaInput}
                onChange={(e) => setBighaInput(e.target.value)}
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="alert bg-light border-0 text-secondary small p-3 rounded-3 d-flex gap-2 align-items-start mt-2">
              <Info size={16} className="text-primary mt-1 flex-shrink-0" />
              <span>{STATE_CONFIGS[stateKey].note}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Globe2 size={18} className="text-primary" /> Conversion Results
            </h2>
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Kattha</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.kattha}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Biswa</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.biswa}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Square Feet</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.sqFt}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Square Gaj (Yards)</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.sqGaj}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Square Meters</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.sqMeter}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="small text-secondary mb-1">Acres</div>
                  <div className="h4 fw-bold text-dark mb-0">{results.acre}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      {/* High-quality Comprehensive SEO Article (>1000 words, highly unique) */}
      <section className="flat-content-section border-top pt-4 mt-4">
        <GuideSectionHeader
          title="The Ultimate Guide to Bigha & Kattha Conversion in Indian Real Estate"
          subtitle="Deep Historical Analysis, State-wise Calculations, and Mathematical Formulations"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: '1.05rem', fontWeight: 400 }}>
            If you are buying agricultural land, checking ancestry registry maps (Khesra/Khata books), or dealing with local property transactions in Northern, Eastern, and Western India, you will immediately face traditional units like <strong>Bigha</strong>, <strong>Kattha</strong>, and <strong>Biswa</strong>. Understanding these units is challenging because a Bigha in Bihar is completely different from a Bigha in Uttar Pradesh or West Bengal.
          </p>

          <h3 className="guide-subheading">
            <Scale size={18} className="text-primary" /> 1. The Origin of Bigha and Kattha: A Historical Legacy
          </h3>
          <p>
            The concept of Bigha dates back to pre-colonial India. In medieval times, agricultural land was assessed for taxation based on actual crop yields. During Emperor Akbar&apos;s administration, his finance minister, <strong>Raja Todar Mal</strong>, revolutionized land surveying by introducing a standard measurement rod called the <strong>Jarib</strong> (made of bamboo joined by iron rings) and the <strong>Lagga</strong> (measurement pole).
          </p>
          <p>
            A Bigha was defined as the area of land that could be cultivated by a single farmer with a pair of bullocks in a day. As local administration and ruler configurations changed across different princely states, the length of the Lagga changed. Since a Bigha and its sub-divisions (Kattha, Biswa, Dhur) are direct mathematical squares of the local Lagga size, the absolute size of 1 Bigha varied between districts.
          </p>

          <h3 className="guide-subheading">
            <Calculator size={18} className="text-primary" /> 2. The Mathematics: How Local Jarib &amp; Lagga Determine Bigha and Kattha
          </h3>
          <p>
            To understand the calculations used in states like Bihar, Jharkhand, and Uttar Pradesh, you must understand the <strong>Lagga</strong> (measured in cubits or *Hath*, where 1 Hath is roughly 1.5 feet or 18 inches):
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>Dhur:</strong> The basic building block. <code>1 Dhur = (Lagga length in cubits * 1.5) ^ 2</code> square feet.</li>
            <li><strong>Kattha:</strong> 1 Kattha contains exactly 20 Dhur. <code>1 Kattha = 20 * Dhur</code>.</li>
            <li><strong>Bigha:</strong> 1 Bigha contains exactly 20 Kattha (or 400 Dhur). <code>1 Bigha = 20 * Kattha</code>.</li>
          </ul>
          <p>
            Let&apos;s run a step-by-step example for <strong>Patna, Bihar</strong>, where a standard <strong>Lagga of 5.5 Hath (cubits)</strong> is used:
          </p>
          <div className="bg-light p-3 rounded-3 border border-light-subtle font-monospace mb-4">
            1 Hath = 1.5 feet <br />
            Lagga Length = 5.5 Hath = 5.5 * 1.5 = 8.25 feet <br />
            1 Dhur = (8.25) ^ 2 = 68.0625 square feet <br />
            1 Kattha = 20 * 68.0625 = 1,361.25 square feet <br />
            1 Bigha = 20 * 1,361.25 = 27,225 square feet
          </div>
          <p>
            However, in districts like Gaya or Munger, the local Lagga can be 6 Hath or 7 Hath, meaning a local Kattha there can exceed 1,600 square feet. This is why our tool provides state-standardized configurations to clear local ambiguity.
          </p>

          <h3 className="guide-subheading">
            <Award size={18} className="text-primary" /> 3. Regional Classification Table: How States Compare
          </h3>
          <p>
            The table below highlights the standard conversions configured under state revenue department regulations:
          </p>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2 mb-4">
              <thead>
                <tr className="table-light">
                  <th>State / Region</th>
                  <th>Standard Lagga</th>
                  <th>1 Bigha in Sq Ft</th>
                  <th>1 Bigha in Kattha/Biswa</th>
                  <th>Equivalent 1 Kattha (Sq Ft)</th>
                  <th>Acre Conversion</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Bihar</strong></td>
                  <td>5.5 Hath</td>
                  <td>27,225 sq ft</td>
                  <td>20 Kattha</td>
                  <td>1,361.25 sq ft</td>
                  <td>0.625 Acres</td>
                </tr>
                <tr>
                  <td><strong>UP (East)</strong></td>
                  <td>5.5 Hath</td>
                  <td>27,225 sq ft</td>
                  <td>20 Biswa</td>
                  <td>1,361.25 sq ft</td>
                  <td>0.625 Acres</td>
                </tr>
                <tr>
                  <td><strong>UP (West)</strong></td>
                  <td>5.47 Hath</td>
                  <td>27,000 sq ft</td>
                  <td>20 Biswa</td>
                  <td>1,350.00 sq ft</td>
                  <td>0.619 Acres</td>
                </tr>
                <tr>
                  <td><strong>West Bengal</strong></td>
                  <td>4.0 Hath</td>
                  <td>14,400 sq ft</td>
                  <td>20 Kattha</td>
                  <td>720.00 sq ft</td>
                  <td>0.330 Acres</td>
                </tr>
                <tr>
                  <td><strong>Assam</strong></td>
                  <td>8.0 Hath</td>
                  <td>14,400 sq ft</td>
                  <td>5 Kattha</td>
                  <td>2,880.00 sq ft</td>
                  <td>0.330 Acres</td>
                </tr>
                <tr>
                  <td><strong>Punjab &amp; Haryana</strong></td>
                  <td>N/A</td>
                  <td>9,000 sq ft</td>
                  <td>20 Biswa</td>
                  <td>450.00 sq ft</td>
                  <td>0.206 Acres</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">4. Pucca Bigha vs. Kucha Bigha: What Buyers Must Know</h3>
          <p>
            In western parts of Uttar Pradesh, Rajasthan, and Uttarakhand, you will frequently hear the terms <strong>Pucca Bigha</strong> (also known as Pukka Bigha) and <strong>Kucha Bigha</strong> (or raw Bigha). 
          </p>
          <p>
            Pucca and Kucha Bigha are local conventions rather than one nationwide legal ratio. Some regions use a Pucca Bigha near 27,225 square feet and may treat a Kucha Bigha as a smaller fraction, but the value can vary by district. When reading mutation papers or inheritance registries, confirm the recorded convention with the local revenue office or deed professional before valuing the plot.
          </p>

          <h3 className="guide-subheading">
            <HelpCircle size={18} className="text-primary" /> 5. Frequently Asked Questions (FAQ)
          </h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: Why is Bigha to Kattha conversion not standard all over India?</h4>
              <p className="text-muted mb-0">
                Land classification in India is a state subject under the constitution. Since local governments historically used different rods (laggas) for land taxation, regional variations persisted even after the adoption of standard metric systems (hectares and square meters).
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: How many Kattha make one Acre?</h4>
              <p className="text-muted mb-0">
                It depends on the state&apos;s Kattha size. For the Bihar figure (about 32 Kattha per acre), use the{" "}
                <Link href="/tools/land-area/bigha-to-square-feet-bihar" className="fw-semibold">
                  Bihar Bigha to Square Feet converter
                </Link>
                . Compare other regions with the table above or open the matching state page.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: What is the relation between Bigha, Kattha, and Dhur?</h4>
              <p className="text-muted mb-0">
                In the common Bihar-style system, the units follow a base-20 nested multiplier: 1 Bigha = 20 Kattha, and 1 Kattha = 20 Dhur. This means 1 Bigha contains exactly 400 Dhur. Confirm the local convention before relying on this for deeds.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q4: How do I convert Bigha to Square Yards (Gaj)?</h4>
              <p className="text-muted mb-0">
                First convert Bigha to square feet for the selected state, then divide by 9. The calculator shows Gaj automatically after you choose a region.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q5: How do Eastern and Western UP Bigha differ?</h4>
              <p className="text-muted mb-0">
                Both commonly use 20 Biswa per Bigha, but the square-foot base can differ. Use the{" "}
                <Link href="/tools/land-area/bigha-to-kattha-up" className="fw-semibold">
                  Uttar Pradesh converter
                </Link>{" "}
                for East vs West UP details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
