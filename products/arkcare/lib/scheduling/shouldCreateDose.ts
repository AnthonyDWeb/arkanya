import type { Dose } from "@/types";

export function shouldCreateDose(doses: Dose[], treatmentId: string, scheduledAt: string) {
  return !hasDoseAtSchedule(doses, treatmentId, scheduledAt);
}

export function hasDoseAtSchedule(doses: Dose[], treatmentId: string, scheduledAt: string) {
  return doses.some(
    (dose) =>
      dose.treatmentId === treatmentId &&
      dose.scheduledAt === scheduledAt,
  );
}
