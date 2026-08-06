"use client";

import { useState } from "react";
import { Button, Card, TrashButton } from "@/components/ui";
import { getTreatmentColor } from "@/data";
import { formatDate } from "@/lib/dates";
import type { Treatment } from "@/types";
import { TreatmentTypeBadge } from "./TreatmentTypeBadge";

export function TreatmentCard({
  treatment,
  onDelete,
}: {
  treatment: Treatment;
  onDelete?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const frequency = frequencyLabel(treatment.frequencyType);
  const frequencyText =
    treatment.frequencyType === "cycle"
      ? `${frequency} (${treatment.cycleActiveDays || 21} jours de prise / ${treatment.cycleRestDays || 7} jours sans prise)`
      : frequencyDescription(treatment);
  const color = getTreatmentColor(treatment.color);
  const reminders = treatment.reminderTimes?.length
    ? treatment.reminderTimes.join(", ")
    : treatment.reminderTime || "Aucun";

  return (
    <Card className={`grid gap-4 border-l-4 ${color.border} ${color.soft}`}>
      <button
        className="flex items-start justify-between gap-3 text-left"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{treatment.name}</h2>
          {treatment.dosage ? <p className="text-sm text-slate-600">{treatment.dosage}</p> : null}
          <p className="mt-1 text-sm font-medium text-slate-700">{frequencyText}</p>
        </div>
        <TreatmentTypeBadge type={treatment.type} />
      </button>
      {isOpen ? (
        <>
          <dl className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <Info label="Frequence" value={frequencyText} />
            <Info label="Debut" value={formatDate(treatment.startDate)} />
            <Info label="Fin" value={formatDate(treatment.endDate)} />
            <Info label="Rappels" value={reminders} />
          </dl>
          <div className="flex flex-wrap gap-2">
            <Button href={`/treatments/edit?id=${treatment.id}`} variant="secondary">
              Modifier
            </Button>
            {onDelete ? (
              <TrashButton label="Supprimer le traitement" onClick={() => onDelete(treatment.id)} />
            ) : null}
          </div>
        </>
      ) : null}
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function frequencyLabel(type: Treatment["frequencyType"]) {
  if (type === "daily" || type === "every_x_days") return "Jours";
  if (type === "weekly" || type === "every_x_weeks") return "Semaine";
  if (type === "monthly") return "Mois";
  return "Cycle";
}

function frequencyDescription(treatment: Treatment) {
  const count = treatment.frequencyValue || 1;
  if (treatment.frequencyType === "daily" || treatment.frequencyType === "every_x_days") {
    return `Tous les ${count} jour(s)`;
  }
  if (treatment.frequencyType === "weekly" || treatment.frequencyType === "every_x_weeks") {
    return `Toutes les ${count} semaine(s)`;
  }
  return `Tous les ${count} mois`;
}
