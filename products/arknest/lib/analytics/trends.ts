import type { MonthlySnapshot } from "../../types/index.ts";
import { monthKey } from "./months.ts";

export type TrendMetric = "income" | "expenses" | "remaining";
export type TrendPoint = { month: string; label: string; value: number | null };

export function buildTrend(snapshots: MonthlySnapshot[], metric: TrendMetric, months: number, memberId?: string, end = new Date()): TrendPoint[] {
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - (months - 1 - index), 1);
    const key = monthKey(date);
    const snapshot = snapshots.find((item) => item.month === key);
    const member = memberId ? snapshot?.members.find((item) => item.memberId === memberId) : undefined;
    const value = memberId
      ? member?.[metric]
      : metric === "income"
        ? snapshot?.totalIncome
        : metric === "expenses"
          ? snapshot?.totalExpenses
          : snapshot?.remaining;
    return {
      month: key,
      label: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date).replace(".", ""),
      value: value ?? null,
    };
  });
}
