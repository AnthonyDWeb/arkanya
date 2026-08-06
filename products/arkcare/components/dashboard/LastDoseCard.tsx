import { Badge, Card, EmptyState } from "@/components/ui";
import { doseStatuses } from "@/data";
import { formatDate } from "@/lib/dates";
import type { Dose, DoseStatus, Treatment } from "@/types";
import {
  CompletedStatusIcon,
  DeletedStatusIcon,
  MissedStatusIcon,
  PendingStatusIcon,
  PostponedStatusIcon,
  type ArkanyaIcon,
} from "@arkanya/icons";

const tones: Record<DoseStatus, "slate" | "teal" | "rose" | "amber"> = {
  pending: "slate",
  taken: "teal",
  missed: "rose",
  postponed: "amber",
  deleted: "slate",
};
const icons: Record<DoseStatus, ArkanyaIcon> = {
  pending: PendingStatusIcon,
  taken: CompletedStatusIcon,
  missed: MissedStatusIcon,
  postponed: PostponedStatusIcon,
  deleted: DeletedStatusIcon,
};

export function LastDoseCard({ dose, treatment }: { dose?: Dose; treatment?: Treatment }) {
  if (!dose) {
    return (
      <EmptyState
        title="Aucune derniere prise"
        description="Les prises passees apparaitront ici."
      />
    );
  }

  const status = doseStatuses.find((item) => item.value === dose.status);
  const StatusIcon = icons[dose.status];

  return (
    <Card className="border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">Derniere prise</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {treatment?.name || "Traitement supprime"}
          </h2>
        </div>
        <span title={status?.label || dose.status} aria-label={status?.label || dose.status}>
          <Badge tone={tones[dose.status]}>
            <StatusIcon aria-hidden="true" className="h-3.5 w-3.5" />
          </Badge>
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{formatDate(dose.scheduledAt)}</p>
      {dose.takenAt ? (
        <p className="mt-1 text-sm text-teal-700">Validee le {formatDate(dose.takenAt)}</p>
      ) : null}
      {treatment?.dosage ? <p className="mt-2 text-sm text-slate-700">{treatment.dosage}</p> : null}
    </Card>
  );
}
