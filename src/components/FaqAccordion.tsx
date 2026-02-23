"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

export type FaqItem = { question: string; answer: string }

export default function FaqAccordion({ items, title }: { items: FaqItem[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="card border-0 shadow-sm mt-3 faq-accordion-section">
      <div className="card-body p-0">
        <h2 className="h5 fw-semibold mb-0 px-3 pt-3 px-md-4 pt-md-4">{title}</h2>
        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`faq-item border-top border-secondary-subtle ${isOpen ? "faq-item-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question-btn w-100 text-start d-flex align-items-center gap-2 px-3 py-3 px-md-4 py-md-3"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-icon flex-shrink-0">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                  <span className="fw-semibold small">{item.question}</span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="faq-answer-wrap"
                  hidden={!isOpen}
                >
                  <div className="faq-answer px-3 pb-3 px-md-4 pb-md-4 pt-0 ps-md-5 small text-secondary">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .faq-accordion-section .faq-question-btn { background: none; border: none; color: inherit; cursor: pointer; transition: background 0.2s; }
        .faq-accordion-section .faq-question-btn:hover { background: rgba(0,0,0,0.03); }
        .faq-accordion-section .faq-icon { color: #2563eb; transition: transform 0.2s; }
        .faq-accordion-section .faq-item-open .faq-icon { transform: rotate(0deg); }
        .faq-accordion-section .faq-answer-wrap[hidden] { display: none; }
        .faq-accordion-section .faq-answer { line-height: 1.6; }
      `}} />
    </section>
  )
}
