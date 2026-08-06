"use client";

import { useState } from "react";
import { Button, Card, Input } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Panel, Stack } from "@arkanya/ui/layout";
import { useAppData } from "@/lib/useAppData";
import { ExpenseType } from "@/types";

export default function ExpenseTypesManager() {
  const { data, update } = useAppData();
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; tone: "success" | "danger" } | null>(
    null,
  );

  if (!data) return null;

  const types = data.expenseTypes ?? [];

  const addType = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFeedback({ message: "Le nom du type est requis.", tone: "danger" });
      return;
    }

    const newType: ExpenseType = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    update((d) => ({
      ...d,
      expenseTypes: [...types, newType],
    }));

    setName("");
    setFeedback({ message: "Type ajouté.", tone: "success" });
  };

  const deleteType = (id: string) => {
    const linkedCount = data.expenses.filter((expense) => expense.typeId === id).length;
    const message =
      linkedCount > 0
        ? `Ce type est utilisé par ${linkedCount} dépense(s). Les dépenses seront conservées sans ce classement. Continuer ?`
        : "Supprimer ce type de dépense ?";
    if (!window.confirm(message)) return;

    update((d) => ({
      ...d,
      expenseTypes: types.filter((t) => t.id !== id),
      expenses: d.expenses.map((expense) =>
        expense.typeId === id ? { ...expense, typeId: undefined } : expense,
      ),
    }));
    setFeedback({ message: "Type supprimé.", tone: "success" });
  };

  const renameType = (id: string, name: string) => {
    update((d) => ({
      ...d,
      expenseTypes: (d.expenseTypes ?? []).map((type) =>
        type.id === id ? { ...type, name } : type,
      ),
    }));
  };

  return (
    <Panel padding="md">
      <Stack gap="md">
        {feedback ? (
          <Notice tone={feedback.tone}>
            <p>{feedback.message}</p>
          </Notice>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold">Types de depenses</h2>
          <p className="text-sm arknest-muted">Classe tes depenses</p>
        </div>

        <Stack gap="sm">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
          <Button onClick={addType}>Ajouter</Button>
        </Stack>

        <Stack gap="sm">
          {types.map((type) => (
            <Card
              key={type.id}
              variant="outlined"
              padding="sm"
              className="flex items-center justify-between gap-2"
            >
              <Input
                value={type.name}
                onChange={(e) => renameType(type.id, e.target.value)}
                className="flex-1"
                aria-label={`Nom du type ${type.name}`}
              />
              <Button variant="danger" size="sm" onClick={() => deleteType(type.id)}>
                Supprimer
              </Button>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Panel>
  );
}
