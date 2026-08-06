import { allocateCents, fromCents, monthlyIncomeAmount, toCents } from "./money.ts";
import type { Expense, Income, Member, RepartitionMode } from "@/types";

export type MemberResult = { memberId: string; income: number; percent: number; toPay: number; remaining: number };
export type CalculateResult = { members: MemberResult[]; globalExpenses: Expense[]; individualExpenses: Expense[] };
export type SummarySnapshot = { totalIncome: number; totalExpenses: number; remaining: number; percentUsed: number };

export function calculateSummary(members: Member[], incomes: Income[], expenses: Expense[], mode: RepartitionMode, month?: string, customShares?: Record<string, number>): SummarySnapshot {
  const result = calculateFull(members, incomes, expenses, mode, month, customShares);
  const totalIncome = fromCents(result.members.reduce((sum, member) => sum + toCents(member.income), 0));
  const totalExpenses = fromCents([...result.globalExpenses, ...result.individualExpenses].reduce((sum, expense) => sum + toCents(expense.amount), 0));
  return {
    totalIncome,
    totalExpenses,
    remaining: fromCents(toCents(totalIncome) - toCents(totalExpenses)),
    percentUsed: totalIncome > 0 ? Number(((totalExpenses / totalIncome) * 100).toFixed(0)) : 0,
  };
}

export function calculateFull(members: Member[], incomes: Income[], expenses: Expense[], mode: RepartitionMode, month?: string, customShares?: Record<string, number>): CalculateResult {
  const applicableExpenses = expenses.filter((expense) => expense.recurrence !== "one-time" || expense.month === (month ?? currentMonth()));
  const globalExpenses = applicableExpenses.filter((expense) => !expense.memberId);
  const individualExpenses = applicableExpenses.filter((expense) => expense.memberId);
  const memberIncomes = members.map((member) => fromCents(incomes
    .filter((income) => income.memberId === member.id)
    .reduce((sum, income) => sum + toCents(monthlyIncomeAmount(income.amount, income.frequency)), 0)));
  const weights = repartitionWeights(members, memberIncomes, mode, customShares);
  const globalShares = allocateCents(globalExpenses.reduce((sum, expense) => sum + toCents(expense.amount), 0), weights);
  const memberResults = members.map((member, index) => {
    const individualCents = individualExpenses.filter((expense) => expense.memberId === member.id).reduce((sum, expense) => sum + toCents(expense.amount), 0);
    const toPay = fromCents(globalShares[index] + individualCents);
    return { memberId: member.id, income: memberIncomes[index], percent: weights[index] ?? 0, toPay, remaining: fromCents(toCents(memberIncomes[index]) - toCents(toPay)) };
  });
  return { members: memberResults, globalExpenses, individualExpenses };
}

function repartitionWeights(members: Member[], incomes: number[], mode: RepartitionMode, customShares?: Record<string, number>) {
  if (!members.length) return [];
  if (mode === "custom" && members.length > 1) {
    const shares = members.map((member) => customShares?.[member.id] ?? 0);
    const total = shares.reduce((sum, share) => sum + share, 0);
    if (shares.every((share) => Number.isFinite(share) && share >= 0) && Math.abs(total - 100) < 0.001) return shares.map((share) => share / 100);
  }
  if (mode === "proportional") {
    const total = incomes.reduce((sum, income) => sum + income, 0);
    if (total > 0) return incomes.map((income) => income / total);
  }
  return members.map(() => 1 / members.length);
}

function currentMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
