import type { TreatmentColor } from "@/types";

export const treatmentColors: {
  value: TreatmentColor;
  label: string;
  dot: string;
  soft: string;
  border: string;
  hex: string;
}[] = [
  {
    value: "teal",
    label: "Teal",
    dot: "bg-teal-600",
    soft: "bg-teal-50",
    border: "border-teal-500",
    hex: "#0d9488",
  },
  {
    value: "sky",
    label: "Bleu",
    dot: "bg-sky-600",
    soft: "bg-sky-50",
    border: "border-sky-500",
    hex: "#0284c7",
  },
  {
    value: "violet",
    label: "Violet",
    dot: "bg-violet-600",
    soft: "bg-violet-50",
    border: "border-violet-500",
    hex: "#7c3aed",
  },
  {
    value: "rose",
    label: "Rose",
    dot: "bg-pink-500",
    soft: "bg-pink-50",
    border: "border-pink-500",
    hex: "#ec4899",
  },
  {
    value: "amber",
    label: "Orange",
    dot: "bg-amber-500",
    soft: "bg-amber-50",
    border: "border-amber-500",
    hex: "#f59e0b",
  },
  {
    value: "brown",
    label: "Marron",
    dot: "bg-stone-700",
    soft: "bg-stone-100",
    border: "border-stone-600",
    hex: "#44403c",
  },
  {
    value: "indigo",
    label: "Indigo",
    dot: "bg-indigo-600",
    soft: "bg-indigo-50",
    border: "border-indigo-500",
    hex: "#4f46e5",
  },
];

export function getTreatmentColor(color?: TreatmentColor) {
  return treatmentColors.find((item) => item.value === color) || treatmentColors[0];
}
