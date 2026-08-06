import type { Dose, DoseStatus, FrequencyType, Treatment, TreatmentType } from "@/types";
import { STORAGE_SCHEMA_VERSION, storageChangeEvent, storageKeys } from "./storageSchema.js";

export type ArkCareBackup = {
  app: "arkcare";
  schemaVersion: number;
  exportedAt: string;
  treatments: Treatment[];
  doses: Dose[];
};

const treatmentTypes = new Set<TreatmentType>([
  "injection",
  "comprime",
  "gelule",
  "perfusion",
  "autre",
]);
const frequencies = new Set<FrequencyType>([
  "daily",
  "weekly",
  "every_x_days",
  "every_x_weeks",
  "monthly",
  "cycle",
]);
const statuses = new Set<DoseStatus>(["pending", "taken", "missed", "postponed", "deleted"]);

export function createBackup(treatments: Treatment[], doses: Dose[]): ArkCareBackup {
  return {
    app: "arkcare",
    schemaVersion: STORAGE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    treatments,
    doses,
  };
}

export function parseBackup(raw: string): ArkCareBackup {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Le fichier ne contient pas de JSON valide.");
  }
  if (!isRecord(value)) throw new Error("Format de sauvegarde invalide.");
  if (value.app !== undefined && value.app !== "arkcare") {
    throw new Error("Ce fichier ne provient pas de ArkCare.");
  }
  const version = value.schemaVersion === undefined ? 1 : value.schemaVersion;
  if (typeof version !== "number" || version < 1 || version > STORAGE_SCHEMA_VERSION) {
    throw new Error("Version de sauvegarde non prise en charge.");
  }
  if (!Array.isArray(value.treatments) || !value.treatments.every(isTreatment)) {
    throw new Error("La liste des traitements est invalide.");
  }
  if (!Array.isArray(value.doses) || !value.doses.every(isDose)) {
    throw new Error("La liste des prises est invalide.");
  }
  const treatmentIds = new Set(value.treatments.map((item) => item.id));
  if (value.doses.some((dose) => !treatmentIds.has(dose.treatmentId))) {
    throw new Error("Une prise reference un traitement absent.");
  }
  return {
    app: "arkcare",
    schemaVersion: STORAGE_SCHEMA_VERSION,
    exportedAt: typeof value.exportedAt === "string" ? value.exportedAt : new Date().toISOString(),
    treatments: value.treatments,
    doses: dedupeDoses(value.doses),
  };
}

export function restoreBackup(backup: ArkCareBackup) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.treatments, JSON.stringify(backup.treatments));
  window.localStorage.setItem(storageKeys.doses, JSON.stringify(backup.doses));
  window.localStorage.setItem(storageKeys.schemaVersion, String(STORAGE_SCHEMA_VERSION));
  window.dispatchEvent(new CustomEvent(storageChangeEvent, { detail: { key: "restore" } }));
}

function isTreatment(value: unknown): value is Treatment {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    treatmentTypes.has(value.type as TreatmentType) &&
    frequencies.has(value.frequencyType as FrequencyType) &&
    typeof value.frequencyValue === "number" &&
    value.frequencyValue >= 1 &&
    isDateString(value.startDate) &&
    isDateString(value.createdAt) &&
    isDateString(value.updatedAt) &&
    (value.reminderTimes === undefined ||
      (Array.isArray(value.reminderTimes) && value.reminderTimes.every(isTimeString))) &&
    (value.reminderDosages === undefined || isStringRecord(value.reminderDosages))
  );
}

function isDose(value: unknown): value is Dose {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.treatmentId) &&
    isDateString(value.scheduledAt) &&
    statuses.has(value.status as DoseStatus) &&
    isDateString(value.createdAt) &&
    isDateString(value.updatedAt)
  );
}

function dedupeDoses(doses: Dose[]) {
  const seen = new Set<string>();
  return doses.filter((dose) => {
    const key = `${dose.treatmentId}:${dose.scheduledAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(new Date(value).getTime());
}

function isTimeString(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string");
}
