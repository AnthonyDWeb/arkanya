import { createId } from "@/lib/ids";
import type { Dose, Treatment } from "@/types";
import { buildDoseSchedule } from "./getNextDoseDate";
import { shouldCreateDose } from "./shouldCreateDose";
import { dosesKeptDuringRegeneration } from "./regeneration";

export function generateDosesForTreatment(treatment: Treatment, existingDoses: Dose[] = []) {
  const now = new Date().toISOString();
  const generated = buildDoseSchedule(treatment).map((entry) => ({
    scheduledAt: entry.date.toISOString(),
    dosage: entry.dosage,
  }));
  const newDoses = generated
    .filter((entry) => shouldCreateDose(existingDoses, treatment.id, entry.scheduledAt))
    .map((entry) => ({
      id: createId("dose"),
      treatmentId: treatment.id,
      scheduledAt: entry.scheduledAt,
      dosage: entry.dosage,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    }));

  return [...existingDoses, ...newDoses];
}

export function regenerateFutureDoses(treatment: Treatment, doses: Dose[]) {
  const now = Date.now();
  const kept = dosesKeptDuringRegeneration(doses, treatment.id, now);
  return generateDosesForTreatment(treatment, kept);
}
