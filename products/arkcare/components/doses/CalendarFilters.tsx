"use client";

import { getTreatmentColor } from "@/data";
import type { Treatment } from "@/types";

export function CalendarFilters({
  activeId,
  onChange,
  treatments,
}: {
  activeId: string;
  onChange: (id: string) => void;
  treatments: Treatment[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterButton active={activeId === "all"} label="Tous" onClick={() => onChange("all")} />
      {treatments.map((treatment) => (
        <FilterButton
          active={activeId === treatment.id}
          color={getTreatmentColor(treatment.color).dot}
          key={treatment.id}
          label={treatment.name}
          onClick={() => onChange(treatment.id)}
        />
      ))}
    </div>
  );
}

function FilterButton({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
      onClick={onClick}
      type="button"
    >
      {color ? <span className={`mr-2 inline-block h-2 w-2 rounded-full ${color}`} /> : null}
      {label}
    </button>
  );
}
