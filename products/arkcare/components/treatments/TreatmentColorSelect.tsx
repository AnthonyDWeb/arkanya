"use client";

import { treatmentColors } from "@/data";
import type { TreatmentColor } from "@/types";

export function TreatmentColorSelect({
  value,
  onChange,
}: {
  value?: TreatmentColor;
  onChange: (value: TreatmentColor) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-slate-800">Couleur</p>
      <div className="flex flex-wrap gap-2">
        {treatmentColors.map((color) => (
          <button
            aria-label={color.label}
            className={`h-8 w-8 rounded-full ${color.dot} ${value === color.value ? "ring-2 ring-slate-950 ring-offset-2" : ""}`}
            key={color.value}
            onClick={() => onChange(color.value)}
            title={color.label}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
