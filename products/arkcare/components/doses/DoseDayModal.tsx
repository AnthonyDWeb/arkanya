"use client";

import { useState } from "react";
import { Button, Card, TrashButton } from "@/components/ui";
import { getTreatmentColor } from "@/data";
import { formatDate } from "@/lib/dates";
import { DoseNoteForm } from "./DoseNoteForm";
import { DoseStatusForm } from "./DoseStatusForm";
import { ManualDoseForm } from "./ManualDoseForm";
import type { CalendarDose } from "./calendarTypes";
import type { DoseStatus, Treatment } from "@/types";

export function DoseDayModal({
  dateKey,
  entries,
  isAllMode = false,
  selectedTreatmentId,
  treatments,
  onClose,
  onCreateDose,
  onDelete,
  onSaveNote,
  onSaveStatus,
}: {
  dateKey: string;
  entries: CalendarDose[];
  isAllMode?: boolean;
  selectedTreatmentId?: string;
  treatments: Treatment[];
  onClose: () => void;
  onCreateDose: (treatmentId: string, scheduledAt: string, status: DoseStatus) => void;
  onDelete: (entry: CalendarDose) => void;
  onSaveNote: (entry: CalendarDose, note: string) => void;
  onSaveStatus: (
    entry: CalendarDose,
    status: DoseStatus,
    postponedTo?: string,
    shiftFollowing?: boolean,
  ) => void;
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function createDose(treatmentId: string, scheduledAt: string, status: DoseStatus) {
    onCreateDose(treatmentId, scheduledAt, status);
    setIsCreateOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-xl sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="grid gap-4 rounded-none border-0 shadow-none sm:rounded-xl">
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-teal-800">{formatDate(dateKey)}</p>
              <h2 className="text-xl font-bold text-slate-950">{entries.length} prise(s)</h2>
            </div>
            <Button onClick={onClose} type="button" variant="ghost">
              Fermer
            </Button>
          </header>
          {isCreateOpen ? (
            <ManualDoseForm
              dateKey={dateKey}
              onCancel={() => setIsCreateOpen(false)}
              onCreate={createDose}
              selectedTreatmentId={selectedTreatmentId}
              treatments={treatments}
            />
          ) : (
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(true)}>
              + Creer une prise
            </Button>
          )}
          <div className="grid gap-3">
            {entries.map((entry) => (
              <section
                className={`grid gap-3 rounded-lg border p-3 ${cardClass(entry, isAllMode)}`}
                key={entry.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-950">
                      {entry.treatment.name}
                    </h3>
                    <p className="text-sm text-slate-600">{doseSubtitle(entry)}</p>
                  </div>
                  <DoseStatusForm
                    initialDate={entry.scheduledAt}
                    onSave={(status, postponedTo, shiftFollowing) =>
                      onSaveStatus(entry, status, postponedTo, shiftFollowing)
                    }
                    postponedTo={entry.dose?.postponedTo}
                    status={entry.dose?.status || entry.effectiveStatus || "pending"}
                  />
                </div>
                <DoseNoteForm
                  note={entry.dose?.note}
                  onDelete={() => onSaveNote(entry, "")}
                  onSave={(note) => onSaveNote(entry, note)}
                />
                <div className="flex justify-end">
                  <TrashButton label="Supprimer la prise" onClick={() => onDelete(entry)} />
                </div>
              </section>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function cardClass(entry: CalendarDose, isAllMode: boolean) {
  if (!isAllMode) return "border-slate-200 bg-white";
  const color = getTreatmentColor(entry.treatment.color);
  return `${color.border} ${color.soft}`;
}

function doseSubtitle(entry: CalendarDose) {
  return [entry.treatment.dosage, formatDate(entry.scheduledAt)].filter(Boolean).join(" · ");
}
