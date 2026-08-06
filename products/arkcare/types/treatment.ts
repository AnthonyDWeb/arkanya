export type TreatmentType = "injection" | "comprime" | "gelule" | "perfusion" | "autre";

export type FrequencyType =
  | "daily"
  | "weekly"
  | "every_x_days"
  | "every_x_weeks"
  | "monthly"
  | "cycle";

export type TreatmentColor = "teal" | "sky" | "violet" | "rose" | "amber" | "brown" | "indigo";

export type Treatment = {
  id: string;
  name: string;
  color?: TreatmentColor;
  type: TreatmentType;
  dosage?: string;
  frequencyType: FrequencyType;
  frequencyValue: number;
  cycleActiveDays?: number;
  cycleRestDays?: number;
  startDate: string;
  endDate?: string;
  reminderTime?: string;
  reminderTimes?: string[];
  reminderDosages?: Record<string, string>;
  scheduleAdjustments?: ScheduleAdjustment[];
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleAdjustment = {
  fromScheduledAt: string;
  shiftedScheduledAt?: string;
  shiftMs: number;
};

export type TreatmentInput = Omit<
  Treatment,
  "id" | "createdAt" | "updatedAt" | "scheduleAdjustments"
>;
