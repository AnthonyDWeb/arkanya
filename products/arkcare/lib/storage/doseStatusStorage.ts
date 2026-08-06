import { createId } from "@/lib/ids";
import { buildDoseSchedule } from "@/lib/scheduling";
import type { Dose, DoseStatus } from "@/types";
import { getDoses, saveDoses, updateDose } from "./doseStorage";
import { getTreatments, saveTreatments } from "./treatmentStorage";

export function softDeleteDose(id: string) {
  updateDose(id, { deletedAt: new Date().toISOString(), status: "deleted" });
}

export function restoreLegacyDeletedDoses() {
  const updated = getDoses().map((dose) => {
    if (dose.status !== "deleted" || dose.deletedAt) return dose;
    return { ...dose, status: "pending" as const, updatedAt: new Date().toISOString() };
  });
  saveDoses(updated);
  return updated;
}

export function updateDoseStatus(dose: Dose, status: DoseStatus, postponedTo?: string) {
  updateDose(dose.id, statusPatch(status, postponedTo));
}

export function shiftFutureDoses(dose: Dose, postponedTo: string) {
  const delta = new Date(postponedTo).getTime() - new Date(dose.scheduledAt).getTime();
  if (!delta) return;
  addScheduleAdjustment(dose, delta);

  const updated = getDoses().flatMap((item): Dose[] => {
    if (item.id === dose.id) {
      return [{ ...item, isScheduleShift: true, updatedAt: new Date().toISOString() }];
    }
    if (shouldDropFuturePlannedDose(item, dose)) {
      return [];
    }
    return [item];
  });
  saveDoses(updated);
  reconcileDosesForTreatment(dose.treatmentId);
}

export function reconcileDosesForTreatment(treatmentId: string) {
  const treatment = getTreatments().find((item) => item.id === treatmentId);
  if (!treatment) return getDoses();
  if (treatment.deletedAt) return getDoses();

  const now = Date.now();
  const expected = buildDoseSchedule(treatment).map((entry) => ({
    dosage: entry.dosage,
    scheduledAt: entry.date.toISOString(),
  }));
  const current = getDoses();
  const kept = current.filter((dose) => shouldKeepDose(dose, treatmentId, now));
  const keys = new Set(kept.map((dose) => `${dose.treatmentId}:${dose.scheduledAt}`));
  const createdAt = new Date().toISOString();
  const additions = expected
    .filter((entry) => !keys.has(`${treatmentId}:${entry.scheduledAt}`))
    .map(
      (entry): Dose => ({
        createdAt,
        dosage: entry.dosage,
        id: createId("dose"),
        scheduledAt: entry.scheduledAt,
        status: "pending",
        treatmentId,
        updatedAt: createdAt,
      }),
    );

  saveDoses([...kept, ...additions]);
  return getDoses();
}

function addScheduleAdjustment(dose: Dose, shiftMs: number) {
  const fromTime = new Date(dose.scheduledAt).getTime();
  saveTreatments(
    getTreatments().map((treatment) => {
      if (treatment.id !== dose.treatmentId) return treatment;
      const previous = (treatment.scheduleAdjustments || []).filter((adjustment) => {
        return new Date(adjustment.fromScheduledAt).getTime() < fromTime;
      });
      return {
        ...treatment,
        scheduleAdjustments: [
          ...previous,
          {
            fromScheduledAt: dose.scheduledAt,
            shiftedScheduledAt: new Date(
              new Date(dose.scheduledAt).getTime() + shiftMs,
            ).toISOString(),
            shiftMs,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
    }),
  );
}

export function markOverdueDosesMissed() {
  const now = Date.now();
  const doses = getDoses();
  const updated = doses.map((dose) => {
    const isOverdue = dose.status === "pending" && new Date(dose.scheduledAt).getTime() < now;
    return isOverdue
      ? { ...dose, status: "missed" as const, updatedAt: new Date().toISOString() }
      : dose;
  });
  saveDoses(updated);
  return updated;
}

export function statusPatch(status: DoseStatus, postponedTo?: string) {
  return {
    isScheduleShift: false,
    postponedTo: status === "postponed" || status === "missed" ? postponedTo : undefined,
    status,
    takenAt: status === "taken" ? new Date().toISOString() : undefined,
  };
}

function shouldKeepDose(dose: Dose, treatmentId: string, now: number) {
  if (dose.treatmentId !== treatmentId) return true;
  if (dose.status !== "pending") return true;
  if (new Date(dose.scheduledAt).getTime() < now) return true;
  return Boolean(
    dose.note || dose.postponedTo || dose.deletedAt || dose.isManual || dose.isScheduleShift,
  );
}

function shouldDropFuturePlannedDose(dose: Dose, shiftedDose: Dose) {
  if (dose.treatmentId !== shiftedDose.treatmentId) return false;
  if (new Date(dose.scheduledAt) <= new Date(shiftedDose.scheduledAt)) return false;
  if (dose.deletedAt || dose.isManual || dose.note) return false;
  return dose.status === "pending" || dose.status === "postponed" || Boolean(dose.isScheduleShift);
}
