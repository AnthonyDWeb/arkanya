import type { AppData, BudgetGoal } from "../../types/index.ts";
import { monthKey } from "./months.ts";
import { createMonthlySnapshot } from "./snapshots.ts";

export function applyAutomaticSavingsTransfers(data: AppData, date = new Date()): AppData {
  const currentMonth = monthKey(date);
  const eligibleGoals = data.goals.filter((goal) => !goal.archivedAt && goal.type === "savings" && goal.transferRule?.enabled);
  if (!eligibleGoals.length) return data;
  let nextData = data;
  const months = nextData.snapshots
    .filter((snapshot) => snapshot.source !== "demo" && snapshot.month < currentMonth)
    .map((snapshot) => snapshot.month)
    .sort();

  for (const month of months) {
    let availableThisMonth = Math.max(0, nextData.snapshots.find((item) => item.month === month)?.remaining ?? 0);
    for (const goal of eligibleGoals) {
      const ruleStartMonth = goal.transferRule?.startMonth ?? monthKey(new Date(goal.createdAt));
      if (month < ruleStartMonth) continue;
      const alreadyTransferred = nextData.goalContributions.some((item) => item.goalId === goal.id && item.month === month && item.source === "automatic");
      if (alreadyTransferred) continue;
      const rule = goal.transferRule;
      if (!rule?.enabled || availableThisMonth <= 0) continue;
      const savedBeforeMonth = (goal.savedAmount ?? 0) + nextData.goalContributions
        .filter((item) => item.goalId === goal.id && item.month <= month)
        .reduce((sum, item) => sum + item.amount, 0);
      const amount = Math.min(automaticTransferAmount(availableThisMonth, rule), Math.max(0, goal.targetAmount - savedBeforeMonth));
      if (amount <= 0) continue;
      availableThisMonth = Number((availableThisMonth - amount).toFixed(2));
      const transferId = `savings-transfer:${goal.id}:${month}`;
      nextData = {
        ...nextData,
        categories: nextData.categories.some((category) => category.id === "arknest-savings")
          ? nextData.categories
          : [...nextData.categories, { id: "arknest-savings", name: "Épargne", type: "expense" }],
        expenses: [
          ...nextData.expenses.filter((expense) => expense.id !== transferId),
          { id: transferId, label: `Épargne – ${goal.name}`, amount, categoryId: "arknest-savings", recurrence: "one-time", month, goalId: goal.id, isSavingsTransfer: true },
        ],
        goalContributions: [...nextData.goalContributions, { id: transferId, goalId: goal.id, amount, date: `${month}-28T12:00:00.000Z`, month, source: "automatic" }],
      };
    }
    const previous = nextData.snapshots.find((snapshot) => snapshot.month === month);
    if (previous) {
      const [year, monthNumber] = month.split("-").map(Number);
      const recalculated = createMonthlySnapshot(nextData, new Date(year, monthNumber - 1, 28, 12));
      nextData = {
        ...nextData,
        snapshots: nextData.snapshots.map((snapshot) => snapshot.month === month
          ? { ...recalculated, source: previous.source, copiedFromMonth: previous.copiedFromMonth }
          : snapshot),
      };
    }
  }
  return nextData;
}

function automaticTransferAmount(available: number, rule: NonNullable<BudgetGoal["transferRule"]>) {
  if (rule.type === "all") return Number(available.toFixed(2));
  if (rule.type === "percentage") return Number((available * Math.max(0, Math.min(100, rule.value ?? 0)) / 100).toFixed(2));
  return Number(Math.max(0, rule.value ?? 0).toFixed(2));
}
