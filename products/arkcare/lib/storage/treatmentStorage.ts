import { createId } from "@/lib/ids";
import { generateDosesForTreatment, regenerateFutureDoses } from "@/lib/scheduling";
import { archiveTreatmentData } from "@/lib/treatments";
import type { Treatment, TreatmentInput } from "@/types";
import { getDoses, saveDoses } from "./doseStorage";
import { readStorage, storageKeys, writeStorage } from "./localStorage";

export function getTreatments() {
  return readStorage<Treatment[]>(storageKeys.treatments, []);
}

export function saveTreatments(treatments: Treatment[]) {
  writeStorage(storageKeys.treatments, treatments);
}

export function createTreatment(input: TreatmentInput) {
  const now = new Date().toISOString();
  const treatment: Treatment = {
    ...input,
    color: input.color || "teal",
    id: createId("treatment"),
    createdAt: now,
    updatedAt: now,
  };
  saveTreatments([...getTreatments(), treatment]);
  saveDoses(generateDosesForTreatment(treatment, getDoses()));
  return treatment;
}

export function updateTreatment(id: string, input: TreatmentInput) {
  let updatedTreatment: Treatment | undefined;
  const treatments = getTreatments().map((treatment) => {
    if (treatment.id !== id) return treatment;
    updatedTreatment = { ...treatment, ...input, updatedAt: new Date().toISOString() };
    return updatedTreatment;
  });
  saveTreatments(treatments);
  if (updatedTreatment) saveDoses(regenerateFutureDoses(updatedTreatment, getDoses()));
  return updatedTreatment;
}

export function deleteTreatment(id: string) {
  const archivedAt = new Date().toISOString();
  const archived = archiveTreatmentData(getTreatments(), getDoses(), id, archivedAt);
  saveTreatments(archived.treatments);
  saveDoses(archived.doses);
}
