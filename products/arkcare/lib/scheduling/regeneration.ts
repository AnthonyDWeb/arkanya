import type { Dose } from "@/types";

export function dosesKeptDuringRegeneration(doses: Dose[], treatmentId: string, now: number) {
  return doses.filter(
    (dose) =>
      dose.treatmentId !== treatmentId ||
      dose.status !== "pending" ||
      new Date(dose.scheduledAt).getTime() < now,
  );
}
