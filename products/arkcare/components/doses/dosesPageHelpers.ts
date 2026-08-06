import { sortByDate, toDateKey } from "@/lib/dates";
import { buildDoseDates } from "@/lib/scheduling";
import type { Dose, DoseStatus, Treatment } from "@/types";
import type { CalendarDose } from "./calendarTypes";

export function buildEntries(treatments: Treatment[], doses: Dose[], month: Date) {
  const visibleStart = calendarStart(month);
  const scheduled = treatments.filter((treatment) => !treatment.deletedAt).flatMap((treatment) => {
    return buildDoseDates(treatment, visibleStart, 35)
      .filter((date) => isVisible(date, visibleStart))
      .flatMap((date): CalendarDose[] => {
        const scheduledAt = date.toISOString();
        const dose = doses.find(
          (item) => item.treatmentId === treatment.id && item.scheduledAt === scheduledAt,
        );
        if (dose?.status === "deleted") return [];
        const effectiveStatus =
          dose?.status || (date.getTime() < Date.now() ? "missed" : "pending");
        return [
          {
            dateKey: toDateKey(date),
            dose,
            effectiveStatus,
            id: `${treatment.id}_${scheduledAt}`,
            kind: "scheduled",
            scheduledAt,
            treatment,
          },
        ];
      });
  });
  const postponed = postponedTargets(treatments, doses, visibleStart);
  const manual = manualEntries(treatments, doses, visibleStart, [...scheduled, ...postponed]);
  return sortByDate([...scheduled, ...postponed, ...manual], (entry) => entry.scheduledAt);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addYears(date: Date, years: number) {
  return new Date(date.getFullYear() + years, date.getMonth(), 1);
}

export function calendarStart(month: Date) {
  const start = new Date(month);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export function shouldShift(status: DoseStatus, postponedTo?: string, shiftFollowing = false) {
  return status === "postponed" && Boolean(postponedTo) && shiftFollowing;
}

function isVisible(date: Date, start: Date) {
  const end = new Date(start);
  end.setDate(end.getDate() + 35);
  return date >= start && date < end;
}

function postponedTargets(treatments: Treatment[], doses: Dose[], start: Date) {
  return doses.flatMap((dose): CalendarDose[] => {
    if (dose.status === "deleted") return [];
    if (!dose.postponedTo) return [];
    if (!isVisible(new Date(dose.postponedTo), start)) return [];
    const treatment = treatments.find((item) => item.id === dose.treatmentId);
    if (!treatment) return [];
    return [
      {
        dateKey: toDateKey(dose.postponedTo),
        dose,
        effectiveStatus: dose.status,
        id: `${dose.id}_report`,
        kind: "postponedTarget",
        scheduledAt: dose.postponedTo,
        treatment,
      },
    ];
  });
}

function manualEntries(
  treatments: Treatment[],
  doses: Dose[],
  start: Date,
  existing: CalendarDose[],
) {
  return doses.flatMap((dose): CalendarDose[] => {
    if (dose.status === "deleted" || !isVisible(new Date(dose.scheduledAt), start)) return [];
    if (existing.some((entry) => entry.dose?.id === dose.id)) return [];
    const treatment = treatments.find((item) => item.id === dose.treatmentId);
    if (!treatment) return [];
    return [
      {
        dateKey: toDateKey(dose.scheduledAt),
        dose,
        effectiveStatus: dose.status,
        id: dose.id,
        kind: "manual",
        scheduledAt: dose.scheduledAt,
        treatment,
      },
    ];
  });
}
