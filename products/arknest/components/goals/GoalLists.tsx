import { Notice } from "@arkanya/ui/feedback";
import GoalCard from "./GoalCard";
import type { AppData, BudgetGoal } from "@/types";

type Props = {
  data: AppData;
  onContribution: (goalId: string, amount: number) => void;
  onEdit: (goal: BudgetGoal) => void;
  onArchive: (goal: BudgetGoal, archived: boolean) => void;
  onDelete: (goalId: string) => void;
};

export default function GoalLists({ data, onContribution, onEdit, onArchive, onDelete }: Props) {
  const active = data.goals.filter((goal) => !goal.archivedAt);
  const archived = data.goals.filter((goal) => goal.archivedAt);
  return <>
    <section>{active.length ? <div className="grid gap-3 md:grid-cols-2">{active.map((goal) => <GoalCard key={goal.id} goal={goal} data={data} onContribution={(amount) => onContribution(goal.id, amount)} onEdit={() => onEdit(goal)} onArchive={() => onArchive(goal, true)} onDelete={() => onDelete(goal.id)} />)}</div> : <Notice tone="info"><p>Aucun objectif pour le moment.</p></Notice>}</section>
    {archived.length ? <details className="arknest-archived-goals"><summary>Objectifs archivés ({archived.length})</summary><div className="mt-3 grid gap-3 md:grid-cols-2">{archived.map((goal) => <GoalCard key={goal.id} goal={goal} data={data} onEdit={() => onEdit(goal)} onArchive={() => onArchive(goal, false)} onDelete={() => onDelete(goal.id)} />)}</div></details> : null}
  </>;
}
