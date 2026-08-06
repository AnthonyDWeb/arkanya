import type { AppData, MonthlySnapshot } from "../../types/index.ts";
import { monthKey } from "./months.ts";
import { applyAutomaticSavingsTransfers } from "./savingsTransfers.ts";
import { backfillMissingMonths, createMonthlySnapshot } from "./snapshots.ts";

export function createDemoHistory(data: AppData, months = 12, end = new Date()): MonthlySnapshot[] {
  const current = createMonthlySnapshot(data, end);
  const baseMembers = current.members.length
    ? current.members
    : [
        { memberId: "demo-alex", memberName: "Alex", income: 2400, expenses: 1450, remaining: 950 },
        { memberId: "demo-camille", memberName: "Camille", income: 1800, expenses: 1200, remaining: 600 },
      ];
  return Array.from({ length: Math.max(0, months - 1) }, (_, index) => {
    const distance = months - 1 - index;
    const date = new Date(end.getFullYear(), end.getMonth() - distance, 15, 12);
    const incomeFactor = 0.92 + index * 0.008 + Math.sin(index * 1.7) * 0.035;
    const expenseFactor = 0.88 + index * 0.014 + Math.cos(index * 1.25) * 0.08;
    const membersData = baseMembers.map((member, memberIndex) => {
      const personalVariation = 1 + Math.sin(index + memberIndex) * 0.025;
      const income = Number((member.income * incomeFactor * personalVariation).toFixed(2));
      const expenses = Number((member.expenses * expenseFactor * personalVariation).toFixed(2));
      return { ...member, income, expenses, remaining: Number((income - expenses).toFixed(2)) };
    });
    const totalIncome = Number(membersData.reduce((sum, member) => sum + member.income, 0).toFixed(2));
    const totalExpenses = Number(membersData.reduce((sum, member) => sum + member.expenses, 0).toFixed(2));
    return {
      month: monthKey(date),
      totalIncome,
      totalExpenses,
      remaining: Number((totalIncome - totalExpenses).toFixed(2)),
      members: membersData,
      updatedAt: date.toISOString(),
      source: "demo",
    };
  });
}

export function recordCurrentSnapshot(data: AppData, date = new Date()): AppData {
  const completedData = applyAutomaticSavingsTransfers(backfillMissingMonths(data, date), date);
  const snapshot = createMonthlySnapshot(completedData, date);
  return {
    ...completedData,
    snapshots: [...completedData.snapshots.filter((item) => item.month !== snapshot.month), snapshot]
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}
