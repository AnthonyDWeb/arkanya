import { Card, TrashButton } from "@/components/ui";
import { getTreatmentColor } from "@/data";
import { formatDate } from "@/lib/dates";
import type { Dose, DoseStatus, Treatment } from "@/types";
import { DoseActions } from "./DoseActions";
import { DoseNoteForm } from "./DoseNoteForm";
import { DoseStatusForm } from "./DoseStatusForm";

export function DoseCard({
  dose,
  treatment,
  onTaken,
  onMissed,
  onPostpone,
  onNote,
  onStatus,
  onDelete,
  canEditSavedNote,
}: {
  dose: Dose;
  treatment?: Treatment;
  onTaken: (dose: Dose) => void;
  onMissed: (dose: Dose) => void;
  onPostpone: (dose: Dose, date: string) => void;
  onNote: (dose: Dose, note: string) => void;
  onStatus: (
    dose: Dose,
    status: DoseStatus,
    postponedTo?: string,
    shiftFollowing?: boolean,
  ) => void;
  onDelete?: (dose: Dose) => void;
  canEditSavedNote?: boolean;
}) {
  const color = getTreatmentColor(treatment?.color);

  return (
    <Card className={`grid gap-3 border-l-4 ${color.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">
            {formatDate(dose.scheduledAt)}
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-950">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color.dot}`} />
            <span className="truncate">{treatment?.name || "Traitement supprime"}</span>
          </h2>
          {dose.dosage || treatment?.dosage ? (
            <p className="mt-1 text-sm text-slate-600">{dose.dosage || treatment?.dosage}</p>
          ) : null}
          {dose.postponedTo ? (
            <p className="mt-1 text-sm font-medium text-amber-700">
              Reportee au {formatDate(dose.postponedTo)}
            </p>
          ) : null}
          {dose.takenAt ? (
            <p className="mt-1 text-sm font-medium text-teal-700">
              Prise le {formatDate(dose.takenAt)}
            </p>
          ) : null}
        </div>
        <DoseStatusForm
          initialDate={dose.scheduledAt}
          onSave={(status, postponedTo, shiftFollowing) =>
            onStatus(dose, status, postponedTo, shiftFollowing)
          }
          postponedTo={dose.postponedTo}
          status={dose.status}
        />
      </div>
      <DoseNoteForm
        canEditSavedNote={canEditSavedNote}
        note={dose.note}
        onDelete={() => onNote(dose, "")}
        onSave={(note) => onNote(dose, note)}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        {dose.status === "pending" ? (
          <DoseActions
            onMissed={() => onMissed(dose)}
            onPostpone={(date) => onPostpone(dose, date)}
            onTaken={() => onTaken(dose)}
          />
        ) : (
          <span />
        )}
        {onDelete ? (
          <TrashButton label="Supprimer la prise" onClick={() => onDelete(dose)} />
        ) : null}
      </div>
    </Card>
  );
}
