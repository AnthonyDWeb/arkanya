"use client";

import { useState } from "react";
import { Button, Card, Input } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Inline, Stack } from "@arkanya/ui/layout";
import { useAppData } from "@/lib/useAppData";
import { Member } from "@/types";

export default function MembersManager() {
  const { data, update } = useAppData();
  const [newName, setNewName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState(false);

  if (!data) return <div>Chargement...</div>;

  const addMember = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setFeedbackError(true);
      setFeedback("Le nom du membre est requis.");
      return;
    }

    setFeedbackError(false);
    const newMember: Member = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    update((d) => ({
      ...d,
      members: [...d.members, newMember],
    }));

    setNewName("");
    setFeedback("Membre ajouté.");
  };

  const deleteMember = (id: string) => {
    const linkedCount =
      data.incomes.filter((income) => income.memberId === id).length +
      data.expenses.filter((expense) => expense.memberId === id).length;
    if (
      !window.confirm(
        `Supprimer ce membre et ses ${linkedCount} revenu(s) ou dépense(s) associés ?`,
      )
    )
      return;

    setFeedbackError(false);
    update((d) => {
      const members = d.members.filter((member) => member.id !== id);
      return {
        ...d,
        members,
        incomes: d.incomes.filter((income) => income.memberId !== id),
        expenses: d.expenses.filter((expense) => expense.memberId !== id),
        settings: {
          ...d.settings,
          repartitionMode:
            d.settings.repartitionMode === "custom" && members.length < 2
              ? "equal"
              : d.settings.repartitionMode,
        },
      };
    });
    setFeedback("Membre supprimé.");
  };

  const updateMember = (id: string, name: string) => {
    update((d) => ({
      ...d,
      members: d.members.map((u) => (u.id === id ? { ...u, name } : u)),
    }));
  };

  return (
    <Stack gap="lg">
      {feedback ? (
        <Notice tone={feedbackError ? "danger" : "success"}>
          <p>{feedback}</p>
        </Notice>
      ) : null}
      <Stack gap="sm">
        {data.members.map((member) => (
          <Card
            key={member.id}
            variant="outlined"
            padding="sm"
            className="flex flex-wrap items-center gap-2"
          >
            <Input
              defaultValue={member.name}
              onBlur={(e) => updateMember(member.id, e.target.value)}
              className="flex-1"
            />

            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteMember(member.id)}
              className="arknest-mobile-full-button"
            >
              Supprimer
            </Button>
          </Card>
        ))}
      </Stack>

      <Card padding="md">
        <Inline gap="sm" className="items-stretch">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom du membre"
            className="min-w-0 flex-1"
          />

          <Button onClick={addMember} className="arknest-mobile-full-button">
            Ajouter
          </Button>
        </Inline>
      </Card>
    </Stack>
  );
}
