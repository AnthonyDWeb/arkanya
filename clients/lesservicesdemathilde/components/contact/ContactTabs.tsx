"use client";

import { useState } from "react";

interface ContactTabsProps {
  onChange: (value: "contact" | "reservation") => void;
}

export default function ContactTabs({ onChange }: ContactTabsProps) {
  const [active, setActive] = useState<"contact" | "reservation">("reservation");

  const switchTab = (val: "contact" | "reservation") => {
    setActive(val);
    onChange(val);
  };

  return (
    <div className="tabs-container mb-8">
      <div className="tabs-inner">
        <button
          onClick={() => switchTab("contact")}
          className={`
                        tab-btn tab-left tab-left-shape
                        ${active === "contact" ? "tab-active" : "text-gray-500"}
                    `}
        >
          Contact
        </button>

        <button
          onClick={() => switchTab("reservation")}
          className={`
                        tab-btn tab-right tab-right-shape
                        ${active === "reservation" ? "tab-active" : "text-gray-500"}
                    `}
        >
          Réservation
        </button>
      </div>
    </div>
  );
}
