import type { Treatment } from "@/types";

export function getNextDoseDate(treatment: Treatment, from = new Date()) {
  const dates = buildDoseDates(treatment, from, 1);
  return dates[0];
}

export function buildDoseDates(treatment: Treatment, from = new Date(), maxDays = 30) {
  return buildDoseSchedule(treatment, from, maxDays).map((entry) => entry.date);
}

export function buildDoseSchedule(treatment: Treatment, from = new Date(), maxDays = 30) {
  const schedules = getReminderSchedules(treatment);
  const start = new Date(`${treatment.startDate}T${schedules[0].time}`);
  const visibleFrom = startOfDay(from);
  const end = new Date(from);
  end.setDate(end.getDate() + maxDays);
  const limit = treatment.endDate ? minDate(end, new Date(`${treatment.endDate}T23:59`)) : end;
  const doses: Array<{ date: Date; dosage?: string }> = [];
  const cursor = new Date(start);

  while (cursor <= limit) {
    if (shouldTakeOnDate(cursor, start, treatment)) {
      schedules.forEach((schedule) => {
        const doseDate = withTime(cursor, schedule.time);
        const adjusted = applyAdjustments(doseDate, treatment);
        if (adjusted >= visibleFrom) doses.push({ date: adjusted, dosage: schedule.dosage });
      });
    }
    advance(cursor, treatment);
  }

  return doses.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getReminderTimes(treatment: Treatment) {
  const times = treatment.reminderTimes?.length
    ? treatment.reminderTimes
    : [treatment.reminderTime || "09:00"];
  return [...new Set(times.filter(Boolean))].sort();
}

export function getReminderSchedules(treatment: Treatment) {
  return getReminderTimes(treatment).map((time) => ({
    time,
    dosage: treatment.reminderDosages?.[time]?.trim() || treatment.dosage?.trim() || undefined,
  }));
}

function advance(date: Date, treatment: Treatment) {
  const value = Math.max(1, treatment.frequencyValue || 1);
  if (treatment.frequencyType === "cycle") date.setDate(date.getDate() + 1);
  if (treatment.frequencyType === "daily") date.setDate(date.getDate() + 1);
  if (treatment.frequencyType === "weekly") date.setDate(date.getDate() + 7);
  if (treatment.frequencyType === "every_x_days") date.setDate(date.getDate() + value);
  if (treatment.frequencyType === "every_x_weeks") date.setDate(date.getDate() + value * 7);
  if (treatment.frequencyType === "monthly") {
    const anchorDay = Number(treatment.startDate.slice(8, 10));
    const target = new Date(date.getFullYear(), date.getMonth() + value + 1, 0);
    date.setFullYear(target.getFullYear(), target.getMonth(), Math.min(anchorDay, target.getDate()));
  }
}

function shouldTakeOnDate(date: Date, start: Date, treatment: Treatment) {
  if (treatment.frequencyType !== "cycle") return true;
  const activeDays = Math.max(1, treatment.cycleActiveDays || 21);
  const restDays = Math.max(1, treatment.cycleRestDays || 7);
  const elapsed = Math.floor((startOfDay(date).getTime() - startOfDay(start).getTime()) / 86400000);
  return elapsed % (activeDays + restDays) < activeDays;
}

function minDate(a: Date, b: Date) {
  return a < b ? a : b;
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function withTime(date: Date, time: string) {
  const [hours = "9", minutes = "0"] = time.split(":");
  const value = new Date(date);
  value.setHours(Number(hours), Number(minutes), 0, 0);
  return value;
}

function applyAdjustments(date: Date, treatment: Treatment) {
  const shift = (treatment.scheduleAdjustments || []).reduce((total, adjustment) => {
    return date > new Date(adjustment.fromScheduledAt) ? total + adjustment.shiftMs : total;
  }, 0);
  return new Date(date.getTime() + shift);
}
