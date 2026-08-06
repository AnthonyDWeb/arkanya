"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Stack } from "@arkanya/ui/layout";
import { GoalHistory, GoalMovementPanel, GoalOverview } from "./GoalDetailSections";
import TrendLineChart from "@/components/stats/TrendLineChart";
import { buildGoalTrend, goalProgress, monthKey } from "@/lib/analytics";
import { useAppData } from "@/lib/useAppData";

export default function GoalDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, update } = useAppData();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!data) return null;
  const goal = data.goals.find((item) => item.id === searchParams.get("id"));
  if (!goal)
    return (
      <Notice tone="info">
        <p>Cet objectif n’existe plus ou son adresse est incorrecte.</p>
        <Link href="/objectifs" className="font-semibold underline">
          Retour aux objectifs
        </Link>
      </Notice>
    );
  const state = goalProgress(goal, data);
  const movements = data.goalContributions
    .filter((item) => item.goalId === goal.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const moveSavings = (direction: 1 | -1) => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0)
      return setError("Indique un montant supérieur à zéro.");
    if (direction === -1 && parsed > state.current)
      return setError("Le retrait ne peut pas dépasser l’épargne disponible.");
    update((current) => ({
      ...current,
      goalContributions: [
        ...current.goalContributions,
        {
          id: crypto.randomUUID(),
          goalId: goal.id,
          amount: Number((parsed * direction).toFixed(2)),
          date: new Date().toISOString(),
          month: monthKey(),
          source: direction === 1 ? "manual" : "withdrawal",
        },
      ],
    }));
    setAmount("");
    setError(null);
  };
  const editGoal = () => {
    sessionStorage.setItem("arknest-edit-goal", goal.id);
    router.push("/objectifs");
  };
  const toggleArchive = () =>
    update((current) => ({
      ...current,
      goals: current.goals.map((item) =>
        item.id === goal.id
          ? { ...item, archivedAt: item.archivedAt ? undefined : new Date().toISOString() }
          : item,
      ),
    }));
  const deleteGoal = () => {
    if (!window.confirm("Supprimer définitivement cet objectif et son historique de mouvements ?"))
      return;
    update((current) => ({
      ...current,
      goals: current.goals.filter((item) => item.id !== goal.id),
      goalContributions: current.goalContributions.filter((item) => item.goalId !== goal.id),
      expenses: current.expenses.filter((expense) => expense.goalId !== goal.id),
    }));
    router.replace("/objectifs");
  };
  const totalAdded = movements
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);
  const totalWithdrawn = Math.abs(
    movements.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0),
  );

  return (
    <Stack gap="lg">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={editGoal}>
            Modifier
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleArchive}>
            {goal.archivedAt ? "Réactiver" : "Archiver"}
          </Button>
          <Button size="sm" variant="danger" onClick={deleteGoal}>
            Supprimer
          </Button>
        </div>
      </div>
      <GoalOverview goal={goal} state={state} />
      <TrendLineChart
        title="Évolution de l’objectif"
        points={buildGoalTrend(goal, data)}
        color="#6558d3"
      />
      {goal.type === "savings" ? (
        <GoalMovementPanel
          amount={amount}
          error={error}
          totalAdded={totalAdded}
          totalWithdrawn={totalWithdrawn}
          onAmountChange={setAmount}
          onMove={moveSavings}
        />
      ) : null}
      <GoalHistory movements={movements} />
    </Stack>
  );
}
