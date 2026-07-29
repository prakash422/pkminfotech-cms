"use client"

import React, { useState, useEffect } from "react"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { GraduationCap, Calculator, Info, Percent, Milestone } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"

interface UniversityFormula {
  name: string
  formula: string
  calculate: (cgpa: number) => number
  description: string
}

const FORMULA_REGISTRY: Record<string, UniversityFormula> = {
  cbse: {
    name: "CBSE / Standard (9.5x)",
    formula: "Percentage = CGPA * 9.5",
    calculate: (cgpa) => cgpa * 9.5,
    description: "Standard formula recommended by CBSE, CBSE Board, and various state boards across India."
  },
  aktu: {
    name: "AKTU (Dr. A.P.J. Abdul Kalam Technical University)",
    formula: "Percentage = (CGPA - 0.75) * 10",
    calculate: (cgpa) => (cgpa - 0.75) * 10,
    description: "Official formula used for engineering (B.Tech, B.Arch) and MBA courses in AKTU."
  },
  vtu: {
    name: "VTU (Visvesvaraya Technological University)",
    formula: "Percentage = (CGPA - 0.75) * 10",
    calculate: (cgpa) => (cgpa - 0.75) * 10,
    description: "Standard calculation formula used by VTU Karnataka for CGPA conversion."
  },
  mumbai: {
    name: "Mumbai University (10x Scale)",
    formula: "Percentage = CGPA * 7.1 + 12 (if CGPA is between 4 and 7), else CGPA * 10",
    calculate: (cgpa) => {
      if (cgpa >= 4 && cgpa <= 7) {
        return parseFloat((cgpa * 7.1 + 12).toFixed(2))
      }
      return cgpa * 10
    },
    description: "Official scale mapping conversion rule of Mumbai University for CBCS pattern."
  },
  standard_10x: {
    name: "Standard 10x Scale",
    formula: "Percentage = CGPA * 10",
    calculate: (cgpa) => cgpa * 10,
    description: "Standard multiplier used by IITs, NITs, and other central universities where 10 equals 100%."
  }
}

export default function CgpaToPercentagePage({ title, description, basePath }: { title: string; description: string; basePath: string }) {
  const [formulaKey, setFormulaKey] = useState("cbse")
  const [scoreInput, setScoreInput] = useState("8.5")
  const [percentage, setPercentage] = useState<number>(80.75)
  const [classDivision, setClassDivision] = useState("First Class")

  useEffect(() => {
    const cgpa = parseFloat(scoreInput) || 0
    if (cgpa <= 0 || cgpa > 10) {
      setPercentage(0)
      setClassDivision("N/A")
      return
    }

    const formula = FORMULA_REGISTRY[formulaKey]
    const calculatedPercentage = parseFloat(formula.calculate(cgpa).toFixed(2))
    setPercentage(calculatedPercentage)

    if (calculatedPercentage >= 75) {
      setClassDivision("First Class with Distinction")
    } else if (calculatedPercentage >= 60) {
      setClassDivision("First Class")
    } else if (calculatedPercentage >= 50) {
      setClassDivision("Second Class")
    } else if (calculatedPercentage >= 35) {
      setClassDivision("Pass Class")
    } else {
      setClassDivision("Fail")
    }
  }, [formulaKey, scoreInput])

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "CGPA to Percentage" }
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="row g-4 mb-3">
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> Input Details
            </h2>
            <div className="mb-3">
              <label htmlFor="formulaSelect" className="form-label small fw-semibold text-secondary">Select Board / University Formula</label>
              <select
                id="formulaSelect"
                className="form-select border-light-subtle rounded-3"
                value={formulaKey}
                onChange={(e) => setFormulaKey(e.target.value)}
                style={{ padding: '10px 14px' }}
              >
                {Object.entries(FORMULA_REGISTRY).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="scoreInput" className="form-label small fw-semibold text-secondary">Enter SGPA / CGPA (out of 10)</label>
              <input
                id="scoreInput"
                type="number"
                step="any"
                min="0"
                max="10"
                className="form-control border-light-subtle rounded-3"
                placeholder="e.g. 8.5"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="alert bg-light border-0 text-secondary small p-3 rounded-3 d-flex gap-2 align-items-start mt-2">
              <Info size={16} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <strong className="text-dark d-block mb-1">Formula Applied:</strong>
                <code>{FORMULA_REGISTRY[formulaKey].formula}</code>
                <span className="d-block mt-2 text-muted">{FORMULA_REGISTRY[formulaKey].description}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <GraduationCap size={18} className="text-primary" /> Conversion Results
            </h2>
            <div className="p-4 bg-light rounded-3 text-center border mb-3">
              <span className="small text-secondary d-block mb-1">Estimated Percentage</span>
              <span className="display-4 fw-bold text-primary">{percentage}%</span>
            </div>
            <div className="row g-2">
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <span className="small text-secondary">Equivalent Grade Class</span>
                  <span className="fw-bold text-dark">{classDivision}</span>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <span className="small text-secondary">CGPA Input Scale</span>
                  <span className="fw-bold text-dark">{parseFloat(scoreInput) || 0} / 10.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      {/* SEO rich content (More than 1000 words, highly unique) */}
      <section className="flat-content-section border-top pt-4 mt-4">
        <GuideSectionHeader
          title="Academic Score Mapping: The Complete CGPA to Percentage Conversion Guide"
          subtitle="Formula logic for CBSE, AKTU, VTU, Mumbai University, and standard global 10-point systems"
        />

        <div className="text-secondary small lh-lg">
          <p className="lead text-dark mb-4" style={{ fontSize: '1.05rem', fontWeight: 400 }}>
            Modern educational systems in India are increasingly shifting away from traditional percentage marks towards grading systems, which are computed as **CGPA (Cumulative Grade Point Average)** or **SGPA (Semester Grade Point Average)**. However, since most recruitment application forms, government job portals (like SSC, UPSC, IBPS), and university admission procedures still ask for equivalent percentage marks, students must know how to accurately calculate percentage from CGPA.
          </p>

          <h3 className="guide-subheading">
            <Milestone size={18} className="text-primary" /> 1. The CBSE 9.5x Conversion Factor Explained
          </h3>
          <p>
            One of the most frequently asked questions is: **Why does CBSE multiply CGPA by 9.5?** Why not a direct 10?
          </p>
          <p>
            When CBSE introduced the CGPA system for Class 10 board exams, it studied the board results of preceding five years. By analyzing the scores, researchers mapped the average marks scored by students to their grade point distributions. Mathematically, the average percentage of marks scored by candidates corresponding to a particular grade band was found to be approximately 9.5 times the grade points.
          </p>
          <p>
            For example, if you score a CGPA of 9.0, your percentage equivalent is calculated as:
          </p>
          <div className="bg-light p-3 rounded-3 border border-light-subtle font-monospace mb-3">
            Formula: Percentage = CGPA * 9.5 <br />
            Calculation: 9.0 * 9.5 = 85.5%
          </div>

          <h3 className="guide-subheading">
            <Percent size={18} className="text-primary" /> 2. Engineering &amp; Technical University Formulas
          </h3>
          <p>
            Unlike school boards, technical universities have independent evaluation frameworks where the grading curves are different.
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>AKTU (Dr. A.P.J. Abdul Kalam Technical University):</strong> AKTU Uttar Pradesh calculates engineering percentage using: <code>Percentage = (CGPA - 0.75) * 10</code>. If a student secures a CGPA of 8.2: <code>(8.2 - 0.75) * 10 = 7.45 * 10 = 74.5%</code>.</li>
            <li><strong>VTU (Visvesvaraya Technological University):</strong> VTU Karnataka follows the same subtraction-adjustment formula: <code>Percentage = (CGPA - 0.75) * 10</code>, providing a standard across major engineering institutes in the state.</li>
            <li><strong>Mumbai University:</strong> Under the Choice Based Credit System (CBCS) for 10-point scales, Mumbai University uses a split calculation curve. If your CGPA falls between 4.0 and 7.0, the percentage is: <code>Percentage = CGPA * 7.1 + 12</code>. For CGPA scores above 7.0, it follows the standard <code>CGPA * 10</code> scale.</li>
            <li><strong>IITs &amp; NITs:</strong> Most central institutes use the direct multiplier 10 (<code>CGPA * 10</code>) because their internal grading is highly competitive, and 10 points represent a clean 100% equivalent.</li>
          </ul>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">3. CGPA vs. SGPA: Difference in Calculation</h3>
          <p>
            It is critical to distinguish between SGPA and CGPA:
          </p>
          <ul className="ps-3 mb-4">
            <li><strong>SGPA (Semester Grade Point Average):</strong> Measures your performance in a single semester. Calculated by dividing the sum of credits earned in a semester by the total credits registered.</li>
            <li><strong>CGPA (Cumulative Grade Point Average):</strong> Represents your cumulative performance across all semesters. Calculated as the weighted average of your SGPA scores across all completed terms.</li>
          </ul>
          <p>
            To convert SGPA to percentage, you can apply the same university formula configured for CGPA on the individual semester score.
          </p>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">4. Conversion Chart: Quick Reference Guide</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2 mb-4">
              <thead>
                <tr className="table-light">
                  <th>CGPA Score (Out of 10)</th>
                  <th>CBSE / Standard % (9.5x)</th>
                  <th>AKTU / VTU % ((CGPA - 0.75) * 10)</th>
                  <th>Mumbai University %</th>
                  <th>IIT / NIT % (10x)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>9.5</strong></td>
                  <td>90.25%</td>
                  <td>87.50%</td>
                  <td>95.00%</td>
                  <td>95.00%</td>
                </tr>
                <tr>
                  <td><strong>9.0</strong></td>
                  <td>85.50%</td>
                  <td>82.50%</td>
                  <td>90.00%</td>
                  <td>90.00%</td>
                </tr>
                <tr>
                  <td><strong>8.5</strong></td>
                  <td>80.75%</td>
                  <td>77.50%</td>
                  <td>85.00%</td>
                  <td>85.00%</td>
                </tr>
                <tr>
                  <td><strong>8.0</strong></td>
                  <td>76.00%</td>
                  <td>72.50%</td>
                  <td>80.00%</td>
                  <td>80.00%</td>
                </tr>
                <tr>
                  <td><strong>7.5</strong></td>
                  <td>71.25%</td>
                  <td>67.50%</td>
                  <td>75.00%</td>
                  <td>75.00%</td>
                </tr>
                <tr>
                  <td><strong>7.0</strong></td>
                  <td>66.50%</td>
                  <td>62.50%</td>
                  <td>61.70%</td>
                  <td>70.00%</td>
                </tr>
                <tr>
                  <td><strong>6.5</strong></td>
                  <td>61.75%</td>
                  <td>57.50%</td>
                  <td>58.15%</td>
                  <td>65.00%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="h5 fw-bold text-dark mt-4 mb-3">5. Frequently Asked Questions (FAQ)</h3>
          <div className="border-top pt-3">
            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q1: How do I convert percentage back to CGPA?</h4>
              <p className="text-muted mb-0">
                To convert percentage back to CGPA under the standard CBSE system, divide the percentage score by 9.5. For example, if you got 76% marks: <code>76 / 9.5 = 8.0 CGPA</code>.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q2: What is the passing percentage in CBSE CGPA scale?</h4>
              <p className="text-muted mb-0">
                CBSE board requires students to get a minimum grade point D (Grade Point 4) to pass a subject, which translates to roughly 38% under the conversion scale.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q3: How is CGPA calculated from multiple subject grade points?</h4>
              <p className="text-muted mb-0">
                To calculate your cumulative CGPA, sum the grade points secured in your five main subjects and divide that total by 5. For instance, if your subject grade points are 8, 9, 8, 7, 9: <code>(8 + 9 + 8 + 7 + 9) / 5 = 41 / 5 = 8.2 CGPA</code>.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold text-dark mb-1">Q4: Is CGPA to GPA conversion for US universities different?</h4>
              <p className="text-muted mb-0">
                Yes. US universities evaluate candidates on a **4.0 GPA scale**. Converting a 10-point Indian CGPA to a 4-point US GPA standardly requires credential evaluation agencies like WES (World Education Services), which assess subject difficulty rather than using simple multipliers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
