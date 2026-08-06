import { EmptyState } from "@/components/ui";
import type { Treatment } from "@/types";
import { TreatmentCard } from "./TreatmentCard";

export function TreatmentList({
  treatments,
  onDelete,
}: {
  treatments: Treatment[];
  onDelete: (id: string) => void;
}) {
  if (!treatments.length) {
    return (
      <EmptyState
        title="Aucun traitement"
        description="Ajoutez votre premier traitement pour générer les prises à venir."
        actionHref="/treatments/new"
        actionLabel="Ajouter un traitement"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {treatments.map((treatment) => (
        <TreatmentCard key={treatment.id} onDelete={onDelete} treatment={treatment} />
      ))}
    </div>
  );
}
