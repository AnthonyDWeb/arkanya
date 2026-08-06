import { calculateSummary } from "../calculate.ts";
import type { AppData, BudgetGoal } from "../../types/index.ts";
import { monthKey } from "./months.ts";
import type { TrendPoint } from "./trends.ts";

export function goalProgress(goal: BudgetGoal, data: AppData) {
  const summary = calculateSummary(data.members, data.incomes, data.expenses, data.settings.repartitionMode, undefined, data.settings.customShares);
  let current = (goal.savedAmount ?? 0) + data.goalContributions
    .filter((contribution) => contribution.goalId === goal.id)
    .reduce((sum, contribution) => sum + contribution.amount, 0);
  if (goal.type === "expense-limit") {
    current = data.expenses
      .filter((expense) => (!goal.categoryId || expense.categoryId === goal.categoryId) && (!goal.memberId || expense.memberId === goal.memberId))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }
  if (goal.type === "monthly-remaining") current = summary.remaining;
  const progress = goal.targetAmount > 0 ? Math.max(0, Math.min(100, (current / goal.targetAmount) * 100)) : 0;
  return { current, remaining: Math.max(0, goal.targetAmount - current), progress };
}

export function buildGoalTrend(goal: BudgetGoal, data: AppData): TrendPoint[] {
  const createdMonth = monthKey(new Date(goal.createdAt));
  const months = new Set(data.snapshots.filter((snapshot) => snapshot.source !== "demo" && snapshot.month >= createdMonth).map((snapshot) => snapshot.month));
  months.add(monthKey());
  for (const contribution of data.goalContributions) {
    if (contribution.goalId === goal.id && contribution.month >= createdMonth) months.add(contribution.month);
  }
  return [...months].sort().map((month) => {
    let value = 0;
    if (goal.type === "savings") {
      value = (goal.savedAmount ?? 0) + data.goalContributions
        .filter((item) => item.goalId === goal.id && item.month <= month)
        .reduce((sum, item) => sum + item.amount, 0);
    } else if (goal.type === "monthly-remaining") {
      value = data.snapshots.find((snapshot) => snapshot.month === month)?.remaining ?? (month === monthKey() ? goalProgress(goal, data).current : 0);
    } else {
      value = data.expenses
        .filter((expense) => (!goal.categoryId || expense.categoryId === goal.categoryId) && (!goal.memberId || expense.memberId === goal.memberId) && (expense.recurrence !== "one-time" || expense.month === month))
        .reduce((sum, expense) => sum + expense.amount, 0);
    }
    const [year, monthNumber] = month.split("-").map(Number);
    return {
      month,
      label: new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(new Date(year, monthNumber - 1, 1, 12)).replace(".", ""),
      value: Number(value.toFixed(2)),
    };
  });
}
