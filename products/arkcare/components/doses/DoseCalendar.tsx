"use client";

import { Button, Card } from "@/components/ui";
import { toDateKey } from "@/lib/dates";
import type { CalendarDose } from "./calendarTypes";
import { TreatmentBlocks, TreatmentDots } from "./calendarViewHelpers";

export function DoseCalendar({
  entries,
  maxMonth,
  minMonth,
  month,
  onMonthChange,
  onSelect,
  referenceMonth,
  variant = "blocks",
}: {
  entries: CalendarDose[];
  maxMonth: Date;
  minMonth: Date;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (dateKey: string) => void;
  referenceMonth: Date;
  variant?: "blocks" | "dots";
}) {
  const days = calendarDays(month);
  const entriesByDay = groupEntries(entries);
  const previous = addMonths(month, -1);
  const next = addMonths(month, 1);

  return (
    <Card className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <Button
          className="px-3"
          disabled={previous < minMonth}
          onClick={() => onMonthChange(previous)}
          type="button"
          variant="secondary"
        >
          ‹
        </Button>
        <h2 className="text-center text-lg font-bold capitalize text-slate-950">
          {monthLabel(month)}
        </h2>
        <Button
          className="px-3"
          disabled={next > maxMonth}
          onClick={() => onMonthChange(next)}
          type="button"
          variant="secondary"
        >
          ›
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day);
          const dayEntries = entriesByDay.get(key) || [];
          const hasDose = dayEntries.length > 0;
          const marker = dayMarker(dayEntries);
          const isNext = isNextDose(dayEntries, entries);
          const tone = dayTone(day, referenceMonth);
          return (
            <button
              className={`relative aspect-square overflow-hidden rounded-lg text-sm font-semibold ring-1 ring-inset transition enabled:hover:scale-[1.03] enabled:hover:shadow-md ${dayClasses(tone, hasDose, marker, isNext, variant)}`}
              key={key}
              onClick={() => onSelect(key)}
              type="button"
            >
              {hasDose && variant === "blocks" ? <TreatmentBlocks entries={dayEntries} /> : null}
              <span
                className={
                  hasDose && variant === "blocks" ? "relative z-10 text-white drop-shadow" : ""
                }
              >
                {day.getDate()}
              </span>
              {marker === "postponedOriginal" ? (
                <span className="pointer-events-none absolute inset-0 text-amber-200">×</span>
              ) : null}
              {hasDose && variant === "dots" ? <TreatmentDots entries={dayEntries} /> : null}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function mondayOffset(date: Date) {
  return (date.getDay() + 6) % 7;
}

function addMonths(date: Date, value: number) {
  return new Date(date.getFullYear(), date.getMonth() + value, 1);
}

function dayTone(day: Date, referenceMonth: Date) {
  const dayMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  if (dayMonth.getTime() === referenceMonth.getTime()) return "current";
  return dayMonth < referenceMonth ? "previous" : "next";
}

function dayClasses(
  tone: string,
  hasDose: boolean,
  marker: string,
  isNext: boolean,
  variant: string,
) {
  const text = variant === "blocks" ? "text-white" : "bg-white text-slate-700";
  if (hasDose && marker === "missed") return `${text} ring-1 ring-rose-400 sm:ring-2`;
  if (hasDose && marker === "postponedTarget") return `${text} ring-1 ring-amber-400 sm:ring-2`;
  if (hasDose && marker === "postponedOriginal") return `${text} ring-1 ring-amber-300 sm:ring-2`;
  if (hasDose && isNext) return `${text} ring-1 ring-slate-500 sm:ring-2`;
  if (hasDose && marker === "taken") return `${text} ring-1 ring-emerald-400 sm:ring-2`;
  if (hasDose) return "bg-white text-slate-700 ring-slate-200";
  if (tone === "previous") return "bg-slate-200 text-slate-600 ring-slate-300";
  if (tone === "next") return "bg-sky-100 text-sky-800 ring-sky-200";
  return "bg-white text-slate-700 ring-slate-200";
}

function groupEntries(entries: CalendarDose[]) {
  const map = new Map<string, CalendarDose[]>();
  entries.forEach((entry) => map.set(entry.dateKey, [...(map.get(entry.dateKey) || []), entry]));
  return map;
}

function dayMarker(entries: CalendarDose[]) {
  if (
    entries.some((entry) => entry.kind === "postponedTarget" && entry.effectiveStatus === "missed")
  )
    return "missed";
  if (entries.some((entry) => entry.kind === "postponedTarget")) return "postponedTarget";
  if (entries.some((entry) => entry.dose?.postponedTo)) return "postponedOriginal";
  if (entries.some((entry) => entry.effectiveStatus === "missed")) return "missed";
  if (entries.some((entry) => entry.effectiveStatus === "taken")) return "taken";
  return "";
}

function isNextDose(dayEntries: CalendarDose[], entries: CalendarDose[]) {
  const now = Date.now();
  const nextId = entries
    .filter((entry) => (entry.effectiveStatus || "pending") === "pending")
    .filter((entry) => new Date(entry.scheduledAt).getTime() >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]?.id;
  return dayEntries.some((entry) => entry.id === nextId);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}

function calendarDays(month: Date) {
  const start = new Date(month);
  start.setDate(start.getDate() - mondayOffset(month));
  return Array.from({ length: 35 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}
