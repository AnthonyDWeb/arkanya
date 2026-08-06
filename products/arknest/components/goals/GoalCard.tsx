"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input } from "@arkanya/ui/core";
import { goalProgress } from "@/lib/analytics";
import { formatAmount } from "@/lib/format";
import type { AppData, BudgetGoal } from "@/types";

type Props = {
  goal: BudgetGoal;
  data: AppData;
  compact?: boolean;
  onContribution?: (amount: number) => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
};

export default function GoalCard({ goal, data, compact, onContribution, onEdit, onArchive, onDelete }: Props) {
  const [movementAmount, setMovementAmount] = useState("");
  const [movementError, setMovementError] = useState<string | null>(null);
  const state = goalProgress(goal, data);
  const isLimit = goal.type === "expense-limit";
  const exceeded = isLimit && state.current > goal.targetAmount;
  const reached = !isLimit && state.current >= goal.targetAmount;
  const movements = data.goalContributions
    .filter((item) => item.goalId === goal.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const moveSavings = (direction: 1 | -1) => {
    const amount = Number(movementAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMovementError("Indique un montant supérieur à zéro.");
      return;
    }
    if (direction === -1 && amount > state.current) {
      setMovementError("Le retrait ne peut pas dépasser l’épargne disponible.");
      return;
    }
    onContribution?.(Number((amount * direction).toFixed(2)));
    setMovementAmount("");
    setMovementError(null);
  };

  return (
    <Card padding="md" variant="outlined" className="arknest-goal-card">
      <Link href={`/objectifs/detail?id=${encodeURIComponent(goal.id)}`} className="arknest-goal-card__link">
        <div className="arknest-goal-card__header">
          <div><h2>{goal.name}</h2><p>{goalTypeLabel(goal.type)}</p></div>
          <strong className={exceeded ? "arknest-negative" : reached ? "arknest-positive" : ""}>{Math.round(state.progress)} %</strong>
        </div>
        <div className="arknest-goal-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(state.progress)}>
          <span style={{ width: `${state.progress}%` }} data-danger={exceeded || undefined} />
        </div>
        <div className="arknest-goal-card__amounts">
          <span>Actuel <strong>{formatAmount(state.current)} €</strong></span>
          <span>Objectif <strong>{formatAmount(goal.targetAmount)} €</strong></span>
        </div>
        {goal.deadline ? <p className="text-xs arknest-muted">Échéance : {new Intl.DateTimeFormat("fr-FR").format(new Date(`${goal.deadline}T12:00:00`))}</p> : null}
        {goal.type === "savings" && goal.transferRule?.enabled ? <p className="text-xs arknest-muted">Virement automatique : {transferRuleLabel(goal.transferRule)}</p> : null}
        <span className="arknest-goal-card__open">Voir le détail →</span>
      </Link>
      {!compact && goal.type === "savings" && onContribution ? (
        <div className="arknest-savings-movement">
          <label><span>Ajouter ou retirer de l’épargne</span><Input type="number" inputMode="decimal" min="0" step="0.01" value={movementAmount} onChange={(event) => setMovementAmount(event.target.value)} placeholder="Montant" /></label>
          {movementError ? <p className="text-xs arknest-negative">{movementError}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => moveSavings(1)}>Ajouter</Button>
            <Button variant="secondary" size="sm" onClick={() => moveSavings(-1)}>Retirer</Button>
          </div>
        </div>
      ) : null}
      {!compact && movements.length ? (
        <details className="arknest-goal-history">
          <summary>Historique ({movements.length})</summary>
          <ul>{movements.slice(0, 8).map((movement) => <li key={movement.id}><span>{movementLabel(movement.source)} · {new Intl.DateTimeFormat("fr-FR").format(new Date(movement.date))}</span><strong className={movement.amount >= 0 ? "arknest-positive" : "arknest-negative"}>{movement.amount >= 0 ? "+" : ""}{formatAmount(movement.amount)} €</strong></li>)}</ul>
        </details>
      ) : null}
      {!compact && (onEdit || onArchive || onDelete) ? (
        <div className="flex flex-wrap gap-2">
          {onEdit ? <Button variant="secondary" size="sm" onClick={onEdit}>Modifier</Button> : null}
          {onArchive ? <Button variant="secondary" size="sm" onClick={onArchive}>{goal.archivedAt ? "Réactiver" : "Archiver"}</Button> : null}
          {onDelete ? <Button variant="danger" size="sm" onClick={onDelete}>Supprimer</Button> : null}
        </div>
      ) : null}
    </Card>
  );
}

export function transferRuleLabel(rule: NonNullable<BudgetGoal["transferRule"]>) {
  if (rule.type === "all") return "tout le reste disponible";
  if (rule.type === "percentage") return `${formatAmount(rule.value ?? 0)} % du reste`;
  return `${formatAmount(rule.value ?? 0)} € maximum`;
}

export function movementLabel(source: AppData["goalContributions"][number]["source"]) {
  if (source === "automatic") return "Virement automatique";
  if (source === "withdrawal") return "Retrait";
  return "Ajout manuel";
}

export function goalTypeLabel(type: BudgetGoal["type"]) {
  if (type === "savings") return "Objectif d’épargne";
  if (type === "expense-limit") return "Plafond de dépenses";
  return "Reste mensuel minimum";
}
