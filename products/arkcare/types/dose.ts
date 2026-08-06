export type DoseStatus = "pending" | "taken" | "missed" | "postponed" | "deleted";

export type Dose = {
  id: string;
  treatmentId: string;
  scheduledAt: string;
  dosage?: string;
  takenAt?: string;
  status: DoseStatus;
  note?: string;
  postponedTo?: string;
  deletedAt?: string;
  isManual?: boolean;
  isScheduleShift?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DoseInput = Omit<Dose, "id" | "createdAt" | "updatedAt">;
