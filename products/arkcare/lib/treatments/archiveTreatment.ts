import type { Dose, Treatment } from "@/types";

export function archiveTreatmentData(
  treatments: Treatment[],
  doses: Dose[],
  treatmentId: string,
  archivedAt: string,
) {
  const archiveTime = new Date(archivedAt).getTime();
  return {
    treatments: treatments.map((treatment) =>
      treatment.id === treatmentId
        ? { ...treatment, deletedAt: archivedAt, updatedAt: archivedAt }
        : treatment,
    ),
    doses: doses.filter((dose) => {
      if (dose.treatmentId !== treatmentId) return true;
      if (new Date(dose.scheduledAt).getTime() < archiveTime) return true;
      return dose.status !== "pending" && dose.status !== "postponed";
    }),
  };
}
