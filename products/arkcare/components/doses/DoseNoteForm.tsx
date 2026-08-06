"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Button, Textarea, TrashButton } from "@/components/ui";

type DoseNoteFormProps = {
  note?: string;
  onSave: (note: string) => void;
  onDelete?: () => void;
  canEditSavedNote?: boolean;
};

export function DoseNoteForm({
  note,
  onSave,
  onDelete,
  canEditSavedNote = true,
}: DoseNoteFormProps) {
  const savedNote = note ?? "";
  const hasSavedNote = savedNote.trim().length > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(savedNote);
  const hasChanged = value.trim() !== savedNote.trim();

  if (!canEditSavedNote && !hasSavedNote) return null;

  function handleEdit() {
    setValue(savedNote);
    setIsEditing(true);
  }

  function handleCancel() {
    setValue(savedNote);
    setIsEditing(false);
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanged) return;
    onSave(value.trim());
    setIsEditing(false);
  }

  return (
    <div className="grid gap-2 rounded-lg bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-slate-500">Note</p>
        {canEditSavedNote ? (
          <div className="flex items-center gap-1">
            {hasSavedNote && onDelete ? (
              <TrashButton label="Supprimer la note" onClick={onDelete} />
            ) : null}
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-900"
              aria-label={hasSavedNote ? "Modifier la note" : "Ajouter une note"}
              title={hasSavedNote ? "Modifier la note" : "Ajouter une note"}
            >
              ✎
            </button>
          </div>
        ) : null}
      </div>

      <form className="grid gap-2" onSubmit={handleSubmit}>
        {isEditing ? (
          <Textarea
            label="Note"
            value={value}
            onChange={handleChange}
            placeholder="Ajouter une note..."
            rows={3}
          />
        ) : hasSavedNote ? (
          <p className="whitespace-pre-wrap text-sm text-slate-800">{savedNote}</p>
        ) : null}

        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            {hasChanged ? (
              <Button type="submit" variant="secondary">
                Valider
              </Button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
