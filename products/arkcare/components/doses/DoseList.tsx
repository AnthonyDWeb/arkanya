import { EmptyState } from "@/components/ui";
import type { Dose, DoseStatus, Treatment } from "@/types";
import { DoseCard } from "./DoseCard";

export function DoseList({
  doses,
  treatments,
  onTaken,
  onMissed,
  onPostpone,
  onNote,
  onStatus,
  onDelete,
  canEditSavedNote,
}: {
  doses: Dose[];
  treatments: Treatment[];
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
  if (!doses.length) {
    return (
      <EmptyState
        title="Aucune prise prévue"
        description="Ajoutez un traitement pour générer les prises des 30 prochains jours."
        actionHref="/treatments/new"
        actionLabel="Ajouter un traitement"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {doses.map((dose) => (
        <DoseCard
          canEditSavedNote={canEditSavedNote}
          dose={dose}
          key={dose.id}
          onDelete={onDelete}
          onMissed={onMissed}
          onNote={onNote}
          onPostpone={onPostpone}
          onStatus={onStatus}
          onTaken={onTaken}
          treatment={treatments.find((treatment) => treatment.id === dose.treatmentId)}
        />
      ))}
    </div>
  );
}
