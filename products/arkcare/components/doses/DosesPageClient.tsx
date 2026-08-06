"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import {
  createDose,
  dedupeExactDoses,
  getDoses,
  getTreatments,
  markOverdueDosesMissed,
  reconcileDosesForTreatment,
  restoreLegacyDeletedDoses,
  shiftFutureDoses,
  softDeleteDose,
  statusPatch,
  updateDose,
} from "@/lib/storage";
import { isActiveTreatment } from "@/lib/treatments";
import { hasDoseAtSchedule } from "@/lib/scheduling";
import { toDateKey } from "@/lib/dates";
import type { Dose, DoseStatus, Treatment } from "@/types";
import { CalendarFilters } from "./CalendarFilters";
import { DoseCalendar } from "./DoseCalendar";
import { DoseDayModal } from "./DoseDayModal";
import type { CalendarDose } from "./calendarTypes";
import { addYears, buildEntries, shouldShift, startOfMonth } from "./dosesPageHelpers";

export function DosesPageClient() {
  const [entries, setEntries] = useState<CalendarDose[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [calendarTreatmentId, setCalendarTreatmentId] = useState("all");
  const [selectedDate, setSelectedDate] = useState<string>();
  const [bounds] = useState(() => {
    const current = startOfMonth(new Date());
    return { current, min: addYears(current, -100), max: addYears(current, 100) };
  });

  const refresh = useCallback(
    (monthDate = month) => {
      const storedTreatments = getTreatments();
      restoreLegacyDeletedDoses();
      dedupeExactDoses();
      const doses = markOverdueDosesMissed();
      ensureVisibleMissedDoses(storedTreatments, doses, monthDate);
      setTreatments(storedTreatments);
      setEntries(buildEntries(storedTreatments, getDoses(), monthDate));
    },
    [month],
  );

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  function saveNote(entry: CalendarDose, note: string) {
    if (entry.dose) {
      updateDose(entry.dose.id, { note });
      reconcileDosesForTreatment(entry.dose.treatmentId);
    } else {
      createDose({
        note,
        scheduledAt: entry.scheduledAt,
        status: "pending",
        treatmentId: entry.treatment.id,
      });
      reconcileDosesForTreatment(entry.treatment.id);
    }
    refresh();
  }

  function saveStatus(
    entry: CalendarDose,
    status: DoseStatus,
    postponedTo?: string,
    shiftFollowing = false,
  ) {
    const patch = statusPatch(status, postponedTo);
    if (entry.dose) {
      updateDose(entry.dose.id, patch);
      if (shouldShift(status, postponedTo, shiftFollowing))
        shiftFutureDoses(entry.dose, postponedTo as string);
      else reconcileDosesForTreatment(entry.dose.treatmentId);
    } else {
      const dose = createDose({
        ...patch,
        scheduledAt: entry.scheduledAt,
        treatmentId: entry.treatment.id,
      });
      if (shouldShift(status, postponedTo, shiftFollowing))
        shiftFutureDoses(dose, postponedTo as string);
      else reconcileDosesForTreatment(entry.treatment.id);
    }
    if (status === "postponed" && postponedTo) {
      focusDate(postponedTo);
      return;
    }
    refresh();
  }

  function deleteEntry(entry: CalendarDose) {
    if (entry.dose) {
      softDeleteDose(entry.dose.id);
    } else {
      createDose({
        deletedAt: new Date().toISOString(),
        scheduledAt: entry.scheduledAt,
        status: "deleted",
        treatmentId: entry.treatment.id,
      });
    }
    reconcileDosesForTreatment(entry.treatment.id);
    refresh();
  }

  function createManualDose(treatmentId: string, scheduledAt: string, status: DoseStatus) {
    createDose({ ...statusPatch(status), isManual: true, scheduledAt, treatmentId });
    reconcileDosesForTreatment(treatmentId);
    refresh();
  }

  function changeMonth(nextMonth: Date) {
    setMonth(nextMonth);
    refresh(nextMonth);
    setSelectedDate(undefined);
  }

  function focusDate(value: string) {
    const date = new Date(value);
    const nextMonth = startOfMonth(date);
    setMonth(nextMonth);
    setSelectedDate(toDateKey(date));
    refresh(nextMonth);
  }

  const visibleEntries =
    calendarTreatmentId === "all"
      ? entries
      : entries.filter((entry) => entry.treatment.id === calendarTreatmentId);
  const selectedEntries = visibleEntries.filter((entry) => entry.dateKey === selectedDate);
  const activeTreatments = treatments.filter(isActiveTreatment);

  return (
    <>
      <PageHeader
        title="Calendrier des prises"
        description="Cliquez sur une date de prise pour remplir ou modifier sa note."
      />
      <CalendarFilters
        activeId={calendarTreatmentId}
        onChange={setCalendarTreatmentId}
        treatments={activeTreatments}
      />
      <DoseCalendar
        entries={visibleEntries}
        maxMonth={bounds.max}
        minMonth={bounds.min}
        month={month}
        onMonthChange={changeMonth}
        onSelect={setSelectedDate}
        referenceMonth={bounds.current}
        variant={calendarTreatmentId === "all" ? "dots" : "blocks"}
      />
      {selectedDate ? (
        <DoseDayModal
          dateKey={selectedDate}
          entries={selectedEntries}
          isAllMode={calendarTreatmentId === "all"}
          onClose={() => setSelectedDate(undefined)}
          onCreateDose={createManualDose}
          onDelete={deleteEntry}
          onSaveNote={saveNote}
          onSaveStatus={saveStatus}
          selectedTreatmentId={calendarTreatmentId === "all" ? undefined : calendarTreatmentId}
          treatments={activeTreatments}
        />
      ) : null}
    </>
  );
}

function ensureVisibleMissedDoses(treatments: Treatment[], doses: Dose[], month: Date) {
  buildEntries(treatments, doses, month).forEach((entry) => {
    if (entry.dose || entry.effectiveStatus !== "missed") return;
    const existing = hasDoseAtSchedule(getDoses(), entry.treatment.id, entry.scheduledAt);
    if (existing) return;

    createDose({
      scheduledAt: entry.scheduledAt,
      status: "missed",
      treatmentId: entry.treatment.id,
    });
  });
}
