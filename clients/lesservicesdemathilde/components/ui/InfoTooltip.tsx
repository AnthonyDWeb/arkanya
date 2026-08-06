"use client";

import { useState } from "react";

interface InfoTooltipProps {
  content: string[];
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="tooltip-wrapper ml-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className={`
                    inline-flex items-center justify-center
                    w-6 h-6 text-xs font-bold
                    rounded-full cursor-pointer
                    transition-all duration-200

                    ${open ? "bg-[#6c8064] scale-110 shadow-md" : "bg-[#809877]"}
                    
                    text-white
                `}
      >
        ?
      </span>

      {open && (
        <div className="tooltip-box">
          <ul className="space-y-1">
            {content.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
