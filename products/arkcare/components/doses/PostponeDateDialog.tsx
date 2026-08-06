"use client";

import { useState } from "react";
import { Button, Card, Field } from "@/components/ui";
import { formatDateTimeLocal } from "@/lib/dates";

export function PostponeDateDialog({
  initialDate,
  onClose,
  onConfirm,
}: {
  initialDate?: string;
  onClose: () => void;
  onConfirm: (date: string, shiftFollowing: boolean) => void;
}) {
  const [shiftFollowing, setShiftFollowing] = useState(false);
  const [date, setDate] = useState(() => {
    return initialDate ? formatDateTimeLocal(new Date(initialDate)) : formatDateTimeLocal();
  });

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
        <Card className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Reporter la prise</h2>
            <p className="text-sm text-slate-600">
              Choisissez la nouvelle date et heure de cette prise.
            </p>
          </div>
          <Field
            label="Date et heure"
            onChange={(event) => {
              setDate(event.target.value);
              event.currentTarget.blur();
            }}
            type="datetime-local"
            value={date}
          />
          <label className="flex items-start gap-2 text-sm font-medium text-slate-700">
            <input
              checked={shiftFollowing}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-teal-700"
              onChange={(event) => setShiftFollowing(event.target.checked)}
              type="checkbox"
            />
            Utiliser cette date comme nouveau point de depart des prochaines prises
          </label>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} type="button" variant="ghost">
              Annuler
            </Button>
            <Button
              onClick={() => onConfirm(new Date(date).toISOString(), shiftFollowing)}
              type="button"
            >
              Valider
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
