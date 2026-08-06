import { Button, Card, Input } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { goalTypeLabel, movementLabel, transferRuleLabel } from "./GoalCard";
import { formatAmount } from "@/lib/format";
import type { AppData, BudgetGoal } from "@/types";

type Progress = { current: number; remaining: number; progress: number };

export function GoalOverview({ goal, state }: { goal: BudgetGoal; state: Progress }) {
  return <Card padding="md" className="arknest-goal-detail-hero">
    <div className="arknest-goal-card__header"><div><h1>{goal.name}</h1><p>{goalTypeLabel(goal.type)}</p></div><strong>{Math.round(state.progress)} %</strong></div>
    <div className="arknest-goal-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(state.progress)}><span style={{ width: `${state.progress}%` }} /></div>
    <div className="arknest-goal-detail-metrics"><Metric label="Valeur actuelle" value={`${formatAmount(state.current)} €`} /><Metric label="Objectif" value={`${formatAmount(goal.targetAmount)} €`} /><Metric label="Reste à atteindre" value={`${formatAmount(state.remaining)} €`} />{goal.deadline ? <Metric label="Échéance" value={formatDate(goal.deadline)} /> : null}</div>
    {goal.type === "savings" && goal.transferRule?.enabled ? <p className="text-sm arknest-muted">Virement automatique : <strong>{transferRuleLabel(goal.transferRule)}</strong></p> : null}
  </Card>;
}

export function GoalMovementPanel({ amount, error, totalAdded, totalWithdrawn, onAmountChange, onMove }: { amount: string; error: string | null; totalAdded: number; totalWithdrawn: number; onAmountChange: (value: string) => void; onMove: (direction: 1 | -1) => void }) {
  return <div className="arknest-goal-detail-grid">
    <Card padding="md" className="space-y-3"><div><h2 className="font-semibold">Faire un mouvement</h2><p className="text-sm arknest-muted">Ajoute ou retire une somme de l’épargne disponible.</p></div><Input type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(event) => onAmountChange(event.target.value)} placeholder="Montant" />{error ? <p className="text-xs arknest-negative">{error}</p> : null}<div className="flex flex-wrap gap-2"><Button onClick={() => onMove(1)}>Ajouter</Button><Button variant="secondary" onClick={() => onMove(-1)}>Retirer</Button></div></Card>
    <Card padding="md" className="space-y-3"><h2 className="font-semibold">Bilan des mouvements</h2><div className="arknest-goal-detail-metrics"><Metric label="Total ajouté" value={`${formatAmount(totalAdded)} €`} /><Metric label="Total retiré" value={`${formatAmount(totalWithdrawn)} €`} /></div></Card>
  </div>;
}

export function GoalHistory({ movements }: { movements: AppData["goalContributions"] }) {
  return <Card padding="md" className="space-y-3"><div><h2 className="font-semibold">Historique</h2><p className="text-sm arknest-muted">Tous les changements enregistrés pour cet objectif.</p></div>{movements.length ? <ul className="arknest-goal-detail-history">{movements.map((movement) => <li key={movement.id}><span><strong>{movementLabel(movement.source)}</strong><small>{formatDateTime(movement.date)}</small></span><strong className={movement.amount >= 0 ? "arknest-positive" : "arknest-negative"}>{movement.amount >= 0 ? "+" : ""}{formatAmount(movement.amount)} €</strong></li>)}</ul> : <Notice tone="info"><p>Aucun mouvement enregistré pour le moment.</p></Notice>}</Card>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("fr-FR").format(new Date(`${value.slice(0, 10)}T12:00:00`)); }
function formatDateTime(value: string) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
