"use client";

import { useMemo, useState } from "react";
import { Button, Field, Select } from "@/components/ui";
import type { DoseStatus, Treatment } from "@/types";

type ManualStatus = Exclude<DoseStatus, "postponed" | "deleted">;

const statusOptions: { value: ManualStatus; label: string }[] = [
  { value: "pending", label: "◷ Prevue" },
  { value: "taken", label: "✓ Prise" },
  { value: "missed", label: "× Oubliee" },
];

export function ManualDoseForm({
  dateKey,
  selectedTreatmentId,
  treatments,
  onCancel,
  onCreate,
}: {
  dateKey: string;
  selectedTreatmentId?: string;
  treatments: Treatment[];
  onCancel: () => void;
  onCreate: (treatmentId: string, scheduledAt: string, status: ManualStatus) => void;
}) {
  const firstTreatmentId = treatments[0]?.id || "";
  const [treatmentId, setTreatmentId] = useState(selectedTreatmentId || firstTreatmentId);
  const selectedId = treatmentId || selectedTreatmentId || firstTreatmentId;
  const treatment = treatments.find((item) => item.id === selectedId);
  const firstTime = treatment?.reminderTimes?.[0] || treatment?.reminderTime || "08:00";
  const [time, setTime] = useState(firstTime);
  const [status, setStatus] = useState<ManualStatus>("pending");
  const options = useMemo(
    () => treatments.map((item) => ({ value: item.id, label: item.name })),
    [treatments],
  );

  if (!treatments.length) {
    return (
      <p className="text-sm text-slate-600">Ajoutez un traitement actif pour creer une prise.</p>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-lg border border-dashed border-slate-300 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!selectedId) return;
        onCreate(selectedId, new Date(`${dateKey}T${time}`).toISOString(), status);
      }}
    >
      <p className="text-sm font-semibold text-slate-700">Ajouter une prise</p>
      <Select
        label="Traitement"
        onChange={(event) =>
          changeTreatment(event.target.value, treatments, setTreatmentId, setTime)
        }
        options={options}
        value={selectedId}
      />
      <Field
        label="Heure"
        onChange={(event) => setTime(event.target.value)}
        type="time"
        value={time}
      />
      <Select
        label="Statut"
        onChange={(event) => setStatus(event.target.value as ManualStatus)}
        options={statusOptions}
        value={status}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="secondary" disabled={!selectedId}>
          Ajouter la prise
        </Button>
      </div>
    </form>
  );
}

function changeTreatment(
  id: string,
  treatments: Treatment[],
  setTreatmentId: (id: string) => void,
  setTime: (time: string) => void,
) {
  const treatment = treatments.find((item) => item.id === id);
  setTreatmentId(id);
  setTime(treatment?.reminderTimes?.[0] || treatment?.reminderTime || "08:00");
}
