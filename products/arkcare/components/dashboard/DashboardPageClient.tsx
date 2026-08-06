"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
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
import { isToday, sortByDate } from "@/lib/dates";
import type { Dose, DoseStatus, Treatment } from "@/types";
import { DashboardActions } from "./DashboardActions";
import { LastDoseCard } from "./LastDoseCard";
import { NextDoseCard } from "./NextDoseCard";
import { TodayDoses } from "./TodayDoses";

export function DashboardPageClient() {
  const [doses, setDoses] = useState<Dose[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [now, setNow] = useState(0);

  function refresh() {
    setNow(Date.now());
    restoreLegacyDeletedDoses();
    const visibleDoses = markOverdueDosesMissed().filter((dose) => dose.status !== "deleted");
    setDoses(sortByDate(visibleDoses, (dose) => dose.scheduledAt));
    setTreatments(getTreatments());
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNow(Date.now());
      refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const pending = doses.filter((dose) => dose.status === "pending");
  const nextDose = pending.find((dose) => new Date(dose.scheduledAt).getTime() >= now);
  const lastDose = [...doses].reverse().find((dose) => {
    return dose.takenAt || new Date(dose.scheduledAt).getTime() < now;
  });
  const todayDoses = doses.filter((dose) => isToday(dose.scheduledAt));
  const findTreatment = (dose?: Dose) => treatments.find((item) => item.id === dose?.treatmentId);

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
      <PageHeader title="Dashboard" description="Suivi rapide de vos traitements et prises." />
      <DashboardActions />
      <NextDoseCard
        dose={nextDose}
        onPostpone={(dose, date, shiftFollowing) =>
          handleStatus(dose, "postponed", date, shiftFollowing)
        }
        treatment={findTreatment(nextDose)}
      />
      <LastDoseCard dose={lastDose} treatment={findTreatment(lastDose)} />
      <TodayDoses
        doses={todayDoses}
        onMissed={(dose) => handleStatus(dose, "missed")}
        onNote={(dose, note) => patchDose(dose, { note })}
        onDelete={(dose) => {
          softDeleteDose(dose.id);
          reconcileDosesForTreatment(dose.treatmentId);
          refresh();
        }}
        onPostpone={(dose, date) => {
          handleStatus(dose, "postponed", date, false);
        }}
        onStatus={handleStatus}
        onTaken={(dose) => handleStatus(dose, "taken")}
        treatments={treatments}
      />
    </>
  );
}
