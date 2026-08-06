"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { deleteTreatment, getTreatments } from "@/lib/storage";
import { isActiveTreatment } from "@/lib/treatments";
import type { Treatment } from "@/types";
import { TreatmentList } from "./TreatmentList";

export function TreatmentsPageClient() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    const timer = window.setTimeout(() => setTreatments(getTreatments()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function handleDelete(id: string) {
    deleteTreatment(id);
    setTreatments(getTreatments());
  }

  const availableTreatments = treatments.filter((treatment) => !treatment.deletedAt);
  const visibleTreatments =
    filter === "all" ? availableTreatments : availableTreatments.filter(isActiveTreatment);

  return (
    <>
      <PageHeader
        title="Traitements"
        description="Creez, modifiez ou supprimez vos traitements."
        actionHref="/treatments/new"
        actionLabel="Ajouter"
      />
      <div className="flex flex-wrap gap-2">
        <button
          className={filterClass(filter === "active")}
          onClick={() => setFilter("active")}
          type="button"
        >
          En cours
        </button>
        <button
          className={filterClass(filter === "all")}
          onClick={() => setFilter("all")}
          type="button"
        >
          Tous
        </button>
      </div>
      <TreatmentList onDelete={handleDelete} treatments={visibleTreatments} />
    </>
  );
}

function filterClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`;
}
