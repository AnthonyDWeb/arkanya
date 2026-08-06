import type { Dose, Treatment } from "@/types";

export type CalendarDose = {
  id: string;
  dateKey: string;
  effectiveStatus?: Dose["status"];
  kind: "scheduled" | "postponedTarget" | "manual";
  scheduledAt: string;
  treatment: Treatment;
  dose?: Dose;
};
