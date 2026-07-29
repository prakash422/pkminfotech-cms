"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Calculator, HelpCircle } from "lucide-react"
import ToolFocusAd from "@/components/tools/ToolFocusAd"
import GuideSectionHeader from "@/components/tools/GuideSectionHeader"
import ToolPageHeader from "@/components/tools/ToolPageHeader"
import { LAND_STATE_PAGES, type LandStateKey } from "@/data/land-state-pages"

interface StateConfig {
  name: string
  bighaToKattha: number
  bighaToSqFt: number
  bighaToBiswa: number
  note: string
}

const STATE_CONFIGS: Record<LandStateKey, StateConfig> = {
  bihar: {
    name: "Bihar",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Bihar, 1 Bigha is standardly 20 Kattha, and 1 Kattha equals 1,361.25 sq ft.",
  },
  up_east: {
    name: "Eastern Uttar Pradesh",
    bighaToKattha: 20,
    bighaToSqFt: 27225,
    bighaToBiswa: 20,
    note: "In Eastern UP, 1 Bigha equals 20 Biswa (Kattha) ≈ 27,225 sq ft.",
  },
  up_west: {
    name: "Western Uttar Pradesh",
    bighaToKattha: 20,
    bighaToSqFt: 27000,
    bighaToBiswa: 20,
    note: "In Western UP, 1 Bigha equals 20 Biswa ≈ 27,000 sq ft.",
  },
  west_bengal: {
    name: "West Bengal",
    bighaToKattha: 20,
    bighaToSqFt: 14400,
    bighaToBiswa: 20,
    note: "In West Bengal, 1 Bigha equals 20 Kattha, where 1 Kattha is 720 sq ft.",
  },
}

const CLUSTER_LINKS = [
  { href: "/tools/land-area/bigha-to-kattha", label: "All states", shortLabel: "All", match: "All-state" },
  { href: "/tools/land-area/bigha-to-square-feet-bihar", label: "Bihar", shortLabel: "Bihar", match: "Bihar" },
  { href: "/tools/land-area/bigha-to-kattha-up", label: "Uttar Pradesh", shortLabel: "UP", match: "Uttar Pradesh" },
  { href: "/tools/land-area/bigha-to-kattha-west-bengal", label: "West Bengal", shortLabel: "WB", match: "West Bengal" },
]

export default function StateLandConverterPage({
  title,
  description,
  basePath,
  pageKey,
}: {
  title: string
  description: string
  basePath: string
  pageKey: string
}) {
  const page = LAND_STATE_PAGES[pageKey]
  const initialState = page?.stateKey ?? "bihar"
  const allowed = page?.allowedStates ?? [initialState]

  const [stateKey, setStateKey] = useState<LandStateKey>(initialState)
  const [bighaInput, setBighaInput] = useState("1")
  const [results, setResults] = useState({
    kattha: 20,
    biswa: 20,
    sqFt: 27225,
    sqGaj: 3025,
    sqMeter: 2529.28,
    acre: 0.625,
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
      sqFt,
      sqGaj: parseFloat((sqFt / 9).toFixed(2)),
      sqMeter: parseFloat((sqFt / 10.7639).toFixed(2)),
      acre: parseFloat((sqFt / 43560).toFixed(4)),
    })
  }, [stateKey, bighaInput])

  if (!page) {
    return (
      <div className="alert alert-warning">
        Land page config missing.{" "}
        <Link href="/tools/land-area/bigha-to-kattha">Open main converter</Link>
      </div>
    )
  }

  return (
    <div>
      <BreadcrumbNav
          compact
          items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Land Area", href: basePath },
          { label: title },
        ]}
      />
      <ToolPageHeader title={title} description={description} />

      <div className="chip-row">
        {CLUSTER_LINKS.map((link) => {
          const active = title.includes(link.match)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`chip ${active ? "chip-active" : ""}`}
            >
              <span className="d-md-none">{link.shortLabel}</span>
              <span className="d-none d-md-inline">{link.label}</span>
            </Link>
          )
        })}
      </div>

      <p className="text-secondary small mb-4">{page.intro}</p>

      <div className="row g-4 mb-3">
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Calculator size={18} className="text-primary" /> Input Details
            </h2>
            {allowed.length > 1 && (
              <div className="mb-3">
                <label htmlFor="stateSelect" className="form-label small fw-semibold text-secondary">
                  Select region
                </label>
                <select
                  id="stateSelect"
                  className="form-select"
                  value={stateKey}
                  onChange={(e) => setStateKey(e.target.value as LandStateKey)}
                >
                  {allowed.map((key) => (
                    <option key={key} value={key}>
                      {STATE_CONFIGS[key].name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="bighaInput" className="form-label small fw-semibold text-secondary">
                Bigha
              </label>
              <input
                id="bighaInput"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={bighaInput}
                onChange={(e) => setBighaInput(e.target.value)}
              />
              <p className="small text-secondary mt-2 mb-0">{STATE_CONFIGS[stateKey].note}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="tool-panel p-4 h-100">
            <h2 className="h5 fw-bold mb-3 text-dark">Converted results</h2>
            <ul className="list-unstyled mb-0 small">
              <li className="d-flex justify-content-between border-bottom py-2">
                <span className="text-secondary">Kattha / Biswa</span>
                <strong>{results.kattha}</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom py-2">
                <span className="text-secondary">Square Feet</span>
                <strong>{results.sqFt.toLocaleString("en-IN")}</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom py-2">
                <span className="text-secondary">Square Gaj (Yards)</span>
                <strong>{results.sqGaj.toLocaleString("en-IN")}</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom py-2">
                <span className="text-secondary">Square Meter</span>
                <strong>{results.sqMeter.toLocaleString("en-IN")}</strong>
              </li>
              <li className="d-flex justify-content-between py-2">
                <span className="text-secondary">Acre</span>
                <strong>{results.acre}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ToolFocusAd />

      <section className="flat-content-section border-top pt-4">
        <GuideSectionHeader title={page.historyTitle} label="State guide" />
        <div
          className="text-secondary small lh-lg"
          dangerouslySetInnerHTML={{ __html: page.historyHtml }}
        />
        <h3 className="h5 fw-bold text-dark mt-4 mb-3">{page.practiceTitle}</h3>
        <div
          className="text-secondary small lh-lg"
          dangerouslySetInnerHTML={{ __html: page.practiceHtml }}
        />
        <h3 className="guide-subheading">
          <HelpCircle size={18} className="text-primary" /> FAQ — {page.h1Suffix}
        </h3>
        <div className="border-top pt-3">
          {page.faq.map((item) => (
            <div className="mb-4" key={item.q}>
              <h4 className="h6 fw-bold text-dark mb-1">{item.q}</h4>
              <p className="text-muted mb-0 small">{item.a}</p>
            </div>
          ))}
        </div>
        <p className="small text-secondary mb-0">
          Need another state? Open the{" "}
          <Link href="/tools/land-area/bigha-to-kattha" className="fw-semibold">
            multi-state Bigha to Kattha converter
          </Link>{" "}
          or browse all{" "}
          <Link href="/tools/land-area" className="fw-semibold">
            land area tools
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
