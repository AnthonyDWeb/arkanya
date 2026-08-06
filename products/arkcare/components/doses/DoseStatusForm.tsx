"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import { doseStatuses } from "@/data";
import type { DoseStatus } from "@/types";
import { PostponeDateDialog } from "./PostponeDateDialog";
import {
  CompletedStatusIcon,
  DeletedStatusIcon,
  MissedStatusIcon,
  PendingStatusIcon,
  PostponedStatusIcon,
  type ArkanyaIcon,
} from "@arkanya/icons";

const tones = {
  pending: "slate",
  taken: "teal",
  missed: "rose",
  postponed: "amber",
  deleted: "slate",
} as const;

const icons: Record<DoseStatus, ArkanyaIcon> = {
  pending: PendingStatusIcon,
  taken: CompletedStatusIcon,
  missed: MissedStatusIcon,
  postponed: PostponedStatusIcon,
  deleted: DeletedStatusIcon,
};

export function DoseStatusForm({
  status,
  postponedTo,
  initialDate,
  onSave,
}: {
  status: DoseStatus;
  postponedTo?: string;
  initialDate?: string;
  onSave: (status: DoseStatus, postponedTo?: string, shiftFollowing?: boolean) => void;
}) {
  const [value, setValue] = useState(status);
  const [isPostponeOpen, setIsPostponeOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const canValidate = canValidateDose(postponedTo || initialDate, now);
  const statuses = doseStatuses.filter((item) => {
    if (item.value === "missed" || item.value === "taken") return canValidate;
    return true;
  });

  function save(nextStatus: DoseStatus, nextDate?: string, shiftFollowing = false) {
    if (nextStatus === "postponed" && !nextDate) {
      setIsPostponeOpen(true);
      return;
    }
    setValue(nextStatus);
    const savedDate = nextStatus === "postponed" || (nextStatus === "missed" && postponedTo);
    onSave(nextStatus, savedDate ? nextDate || postponedTo : undefined, shiftFollowing);
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap justify-end gap-1.5">
        {statuses.map((item) => {
          const StatusIcon = icons[item.value];

          return (
            <button
              className="rounded-full transition hover:scale-105"
              key={item.value}
              onClick={() => save(item.value)}
              title={item.label}
              aria-label={item.label}
              type="button"
            >
              {item.value === value ? (
                <Badge tone={tones[item.value]}>
                  <StatusIcon aria-hidden="true" className="mr-1 h-3.5 w-3.5" />
                  {item.label}
                </Badge>
              ) : (
                <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <StatusIcon aria-hidden="true" className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {isPostponeOpen ? (
        <PostponeDateDialog
          initialDate={postponedTo || initialDate}
          onClose={() => setIsPostponeOpen(false)}
          onConfirm={(date, shiftFollowing) => {
            setIsPostponeOpen(false);
            save("postponed", date, shiftFollowing);
          }}
        />
      ) : null}
    </div>
  );
}

function canValidateDose(value: string | undefined, now: number) {
  return value ? new Date(value).getTime() <= now : true;
}
