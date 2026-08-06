import { createId } from "@/lib/ids";
import type { Dose, DoseInput } from "@/types";
import { readStorage, storageKeys, writeStorage } from "./localStorage";

export function getDoses() {
  return readStorage<Dose[]>(storageKeys.doses, []);
}

export function saveDoses(doses: Dose[]) {
  writeStorage(storageKeys.doses, doses);
}

export function createDose(input: DoseInput) {
  const now = new Date().toISOString();
  const existing = getDoses().find((dose) => {
    return dose.treatmentId === input.treatmentId && dose.scheduledAt === input.scheduledAt;
  });
  if (existing?.status === "deleted") {
    return updateDose(existing.id, { ...input, deletedAt: undefined }) || existing;
  }
  if (existing && input.isManual) {
    return updateDose(existing.id, input) || existing;
  }
  if (existing) return existing;

  const dose: Dose = { ...input, id: createId("dose"), createdAt: now, updatedAt: now };
  saveDoses([...getDoses(), dose]);
  return dose;
}

export function dedupeExactDoses() {
  const seen = new Set<string>();
  const deduped = getDoses().filter((dose) => {
    const key = `${dose.treatmentId}:${dose.scheduledAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  saveDoses(deduped);
  return deduped;
}

export function updateDose(id: string, patch: Partial<Dose>) {
  const doses = getDoses();
  const updated = doses.map((dose) =>
    dose.id === id ? { ...dose, ...patch, updatedAt: new Date().toISOString() } : dose,
  );
  saveDoses(updated);
  return updated.find((dose) => dose.id === id);
}

export function deleteDose(id: string) {
  saveDoses(getDoses().filter((dose) => dose.id !== id));
}

export function deleteDosesByTreatment(treatmentId: string) {
  saveDoses(getDoses().filter((dose) => dose.treatmentId !== treatmentId));
}
