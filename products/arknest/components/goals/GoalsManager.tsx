"use client";

import { useEffect, useState } from "react";
import { Plus } from "@arkanya/icons";
import { Button } from "@arkanya/ui/core";
import { Stack } from "@arkanya/ui/layout";
import GoalForm from "./GoalForm";
import GoalLists from "./GoalLists";
import { draftFromGoal, initialGoalDraft, validateGoalDraft } from "./goalDraft";
import { monthKey } from "@/lib/analytics";
import { useAppData } from "@/lib/useAppData";
import type { BudgetGoal } from "@/types";

export default function GoalsManager() {
  const { data, update } = useAppData();
  const [draft, setDraft] = useState(initialGoalDraft);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const goalId = sessionStorage.getItem("arknest-edit-goal");
    const goal = goalId ? data.goals.find((item) => item.id === goalId) : undefined;
    if (!goal) return;
    const timeoutId = window.setTimeout(() => {
      sessionStorage.removeItem("arknest-edit-goal");
      setEditingGoalId(goal.id);
      setIsFormOpen(true);
      setDraft(draftFromGoal(goal));
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [data]);

  if (!data) return null;

  const closeForm = () => {
    setDraft(initialGoalDraft);
    setEditingGoalId(null);
    setError(null);
    setIsFormOpen(false);
  };

  const saveGoal = () => {
    const validationError = validateGoalDraft(draft);
    if (validationError) return setError(validationError);
    const previous = editingGoalId ? data.goals.find((goal) => goal.id === editingGoalId) : undefined;
    const transferValue = Number(draft.transferValue);
    const goal: BudgetGoal = {
      id: previous?.id ?? crypto.randomUUID(),
      name: draft.name.trim(),
      type: draft.type,
      targetAmount: Number(draft.targetAmount),
      savedAmount: draft.type === "savings" ? Math.max(0, Number(draft.savedAmount) || 0) : undefined,
      categoryId: draft.type === "expense-limit" ? draft.categoryId : undefined,
      memberId: draft.type === "expense-limit" && draft.memberId ? draft.memberId : undefined,
      deadline: draft.deadline || undefined,
      createdAt: previous?.createdAt ?? new Date().toISOString(),
      archivedAt: previous?.archivedAt,
      transferRule: draft.type === "savings" ? {
        enabled: draft.transferEnabled,
        type: draft.transferType,
        value: draft.transferType === "all" ? undefined : transferValue,
        startMonth: draft.transferEnabled
          ? previous?.transferRule?.enabled
            ? previous.transferRule.startMonth ?? monthKey(new Date(previous.createdAt))
            : monthKey()
          : undefined,
      } : undefined,
    };
    update((current) => ({ ...current, goals: previous ? current.goals.map((item) => item.id === goal.id ? goal : item) : [...current.goals, goal] }));
    closeForm();
  };

  const editGoal = (goal: BudgetGoal) => {
    setIsFormOpen(true);
    setEditingGoalId(goal.id);
    setDraft(draftFromGoal(goal));
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addContribution = (goalId: string, amount: number) => update((current) => ({
    ...current,
    goalContributions: [...current.goalContributions, { id: crypto.randomUUID(), goalId, amount, date: new Date().toISOString(), month: monthKey(), source: amount > 0 ? "manual" : "withdrawal" }],
  }));

  const deleteGoal = (id: string) => {
    if (!window.confirm("Supprimer définitivement cet objectif et son historique de mouvements ?")) return;
    update((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== id), goalContributions: current.goalContributions.filter((item) => item.goalId !== id), expenses: current.expenses.filter((expense) => expense.goalId !== id) }));
    if (editingGoalId === id) closeForm();
  };

  return <Stack gap="lg">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">Objectifs en cours</h2>
      <Button size="sm" onClick={() => { closeForm(); setIsFormOpen(true); }} aria-label="Créer un nouvel objectif" title="Créer un nouvel objectif"><Plus aria-hidden="true" size={18} /></Button>
    </div>
    {isFormOpen ? <GoalForm data={data} draft={draft} setDraft={setDraft} editing={Boolean(editingGoalId)} error={error} onSave={saveGoal} onCancel={closeForm} /> : null}
    <GoalLists data={data} onContribution={addContribution} onEdit={editGoal} onArchive={(goal, archived) => update((current) => ({ ...current, goals: current.goals.map((item) => item.id === goal.id ? { ...item, archivedAt: archived ? new Date().toISOString() : undefined } : item) }))} onDelete={deleteGoal} />
  </Stack>;
}
