import type { FrequencyType, Option } from "@/types";

export const frequencyTypes: Option<FrequencyType>[] = [
  { value: "every_x_days", label: "Jours" },
  { value: "every_x_weeks", label: "Semaine" },
  { value: "monthly", label: "Mois" },
  { value: "cycle", label: "Cycle" },
];
