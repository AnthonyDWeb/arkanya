import type { DoseStatus, Option } from "@/types";

export const doseStatuses: Option<Exclude<DoseStatus, "deleted">>[] = [
  { value: "pending", label: "Prevue" },
  { value: "taken", label: "Prise" },
  { value: "missed", label: "Oubliee" },
  { value: "postponed", label: "Reportee" },
];
