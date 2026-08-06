"use client";

import { useState } from "react";
import { Card, EmptyState, Button } from "@/components/ui";
import { PostponeDateDialog } from "@/components/doses";
import { formatDate } from "@/lib/dates";
import type { Dose, Treatment } from "@/types";

export function NextDoseCard({
  dose,
  treatment,
  onPostpone,
}: {
  dose?: Dose;
  treatment?: Treatment;
  onPostpone?: (dose: Dose, date: string, shiftFollowing: boolean) => void;
}) {
  const [isPostponeOpen, setIsPostponeOpen] = useState(false);

  if (!dose) {
    return (
      <EmptyState
        title="Aucune prochaine prise"
        description="Créez un traitement pour planifier vos rappels."
        actionHref="/treatments/new"
        actionLabel="Ajouter"
      />
    );
  }

  return (
    <Card className="border-teal-200 bg-teal-50">
      <p className="text-sm font-semibold text-teal-800">Prochaine prise</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        {treatment?.name || "Traitement supprimé"}
      </h2>
      <p className="mt-1 text-sm text-slate-700">{formatDate(dose.scheduledAt)}</p>
      {dose.dosage || treatment?.dosage ? (
        <p className="mt-2 text-sm text-slate-700">{dose.dosage || treatment?.dosage}</p>
      ) : null}
      {onPostpone ? (
        <div className="mt-4">
          <Button type="button" variant="secondary" onClick={() => setIsPostponeOpen(true)}>
            Decaler la prise
          </Button>
        </div>
      ) : null}
      {isPostponeOpen ? (
        <PostponeDateDialog
          initialDate={dose.postponedTo || dose.scheduledAt}
          onClose={() => setIsPostponeOpen(false)}
          onConfirm={(date, shiftFollowing) => {
            setIsPostponeOpen(false);
            onPostpone?.(dose, date, shiftFollowing);
          }}
        />
      ) : null}
    </Card>
  );
}
