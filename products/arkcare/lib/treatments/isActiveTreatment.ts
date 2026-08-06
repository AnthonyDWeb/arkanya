import type { Treatment } from "@/types";

export function isActiveTreatment(treatment: Treatment) {
  if (treatment.deletedAt) return false;
  if (!treatment.endDate) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${treatment.endDate}T23:59`).getTime() >= today.getTime();
}
