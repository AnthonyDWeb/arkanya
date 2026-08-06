"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import { sortByDate } from "@/lib/dates";
import {
  getTreatments,
  markOverdueDosesMissed,
  reconcileDosesForTreatment,
  restoreLegacyDeletedDoses,
  shiftFutureDoses,
  softDeleteDose,
  updateDose,
  updateDoseStatus,
} from "@/lib/storage";
import type { Dose, DoseStatus, Treatment } from "@/types";
import { CalendarFilters } from "./CalendarFilters";
import { DoseList } from "./DoseList";

const filters = [
  { value: "taken", label: "Prises" },
  { value: "missed", label: "Oubliees" },
  { value: "postponed", label: "Reportees" },
] as const;

export function HistoryPageClient() {
  const [active, setActive] = useState<(typeof filters)[number]["value"]>("taken");
  const [activeTreatmentId, setActiveTreatmentId] = useState("all");
  const [doses, setDoses] = useState<Dose[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [now, setNow] = useState(0);

  function refresh() {
    restoreLegacyDeletedDoses();
    const visibleDoses = markOverdueDosesMissed().filter((dose) => dose.status !== "deleted");
    setDoses(sortByDate(visibleDoses, (dose) => dose.scheduledAt).reverse());
    setTreatments(getTreatments());
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNow(Date.now());
      refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const history = doses.filter((dose) => {
    const isPast = new Date(dose.scheduledAt).getTime() < now;
    const isDone = dose.status !== "pending";
    const matchesTreatment = activeTreatmentId === "all" || dose.treatmentId === activeTreatmentId;
    return dose.status === active && matchesTreatment && (isPast || isDone);
  });

  function handleStatus(
    dose: Dose,
    status: DoseStatus,
    postponedTo?: string,
    shiftFollowing = false,
  ) {
    updateDoseStatus(dose, status, postponedTo);
    if (status === "postponed" && postponedTo && shiftFollowing) {
      shiftFutureDoses(dose, postponedTo);
    }
    reconcileDosesForTreatment(dose.treatmentId);
    refresh();
  }

  function patchDose(dose: Dose, patch: Partial<Dose>) {
    updateDose(dose.id, patch);
    reconcileDosesForTreatment(dose.treatmentId);
    refresh();
  }

  return (
    <>
      <PageHeader title="Historique" description="Consultez les prises passees ou deja validees." />
      <CalendarFilters
        activeId={activeTreatmentId}
        onChange={setActiveTreatmentId}
        treatments={treatments}
      />
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <Button
            className="whitespace-nowrap"
            key={filter.value}
            onClick={() => setActive(filter.value)}
            type="button"
            variant={active === filter.value ? "primary" : "secondary"}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <DoseList
        doses={history}
        onDelete={(dose) => {
          softDeleteDose(dose.id);
          reconcileDosesForTreatment(dose.treatmentId);
          refresh();
        }}
        onMissed={(dose) => handleStatus(dose, "missed")}
        onNote={(dose, note) => patchDose(dose, { note })}
        onPostpone={(dose, date) => handleStatus(dose, "postponed", date)}
        onStatus={handleStatus}
        onTaken={(dose) => handleStatus(dose, "taken")}
        treatments={treatments}
      />
    </>
  );
}
