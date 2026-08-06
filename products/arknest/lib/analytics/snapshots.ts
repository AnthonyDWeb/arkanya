import { calculateFull, calculateSummary } from "../calculate.ts";
import type { AppData, MonthlySnapshot } from "../../types/index.ts";
import { monthKey, nextMonth } from "./months.ts";

export function createMonthlySnapshot(
  data: Pick<AppData, "members" | "incomes" | "expenses" | "settings">,
  date = new Date(),
): MonthlySnapshot {
  const snapshotMonth = monthKey(date);
  const result = calculateFull(data.members, data.incomes, data.expenses, data.settings.repartitionMode, snapshotMonth, data.settings.customShares);
  const summary = calculateSummary(data.members, data.incomes, data.expenses, data.settings.repartitionMode, snapshotMonth, data.settings.customShares);
  return {
    month: snapshotMonth,
    totalIncome: summary.totalIncome,
    totalExpenses: summary.totalExpenses,
    remaining: summary.remaining,
    members: data.members.map((member) => {
      const memberResult = result.members.find((item) => item.memberId === member.id);
      return {
        memberId: member.id,
        memberName: member.name,
        income: memberResult?.income ?? 0,
        expenses: memberResult?.toPay ?? 0,
        remaining: memberResult?.remaining ?? 0,
      };
    }),
    updatedAt: date.toISOString(),
    source: "recorded",
  };
}

export function backfillMissingMonths(data: AppData, date = new Date()): AppData {
  const currentMonth = monthKey(date);
  const realSnapshots = data.snapshots
    .filter((snapshot) => snapshot.source !== "demo" && snapshot.month < currentMonth)
    .sort((a, b) => a.month.localeCompare(b.month));
  const latest = realSnapshots.at(-1);
  if (!latest) return data;
  const missingMonths: string[] = [];
  let cursor = nextMonth(latest.month);
  while (cursor < currentMonth) {
    missingMonths.push(cursor);
    cursor = nextMonth(cursor);
  }
  if (!missingMonths.length) return data;
  const existingRealMonths = new Set(realSnapshots.map((snapshot) => snapshot.month));
  const additions = missingMonths
    .filter((month) => !existingRealMonths.has(month))
    .map((month) => {
      const [year, monthNumber] = month.split("-").map(Number);
      return {
        ...createMonthlySnapshot(data, new Date(year, monthNumber - 1, 15, 12)),
        month,
        source: "carried-forward" as const,
        copiedFromMonth: latest.month,
      };
    });
  if (!additions.length) return data;
  const replacedMonths = new Set(additions.map((snapshot) => snapshot.month));
  return {
    ...data,
    snapshots: [...data.snapshots.filter((snapshot) => !replacedMonths.has(snapshot.month)), ...additions]
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}
