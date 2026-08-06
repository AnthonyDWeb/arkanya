"use client";

import { useState } from "react";
import { ChevronDown } from "@arkanya/icons";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-10 space-y-4">
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <div key={index} className="border border-[#EDEDED] rounded-xl bg-white shadow-sm">
            <button
              className="
                                w-full flex items-center justify-between
                                p-4 text-left font-medium
                                text-[#444444]
                            "
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
              <ChevronDown
                className={`transition-transform text-[#809877] ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 text-sm text-[#555] leading-relaxed">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
