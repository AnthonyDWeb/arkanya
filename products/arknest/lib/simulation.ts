import type { Expense, Income, Member } from "@/types";

export type AppliedScenario = {
  incomes: Array<{ label: string; amount: number; memberId: string }>;
  expenses: Array<{ label: string; amount: number; memberId?: string }>;
};

export function buildScenarioBudget(baseIncomes: Income[], baseExpenses: Expense[], members: Member[], scenario: AppliedScenario) {
  const scenarioIncomes: Income[] = scenario.incomes.map((row, index) => ({ id: `sim-income-${index}`, memberId: row.memberId || members[0]?.id || "", amount: row.amount, categoryId: "sim", frequency: "monthly" }));
  const scenarioExpenses: Expense[] = scenario.expenses.map((row, index) => ({ id: `sim-expense-${index}`, label: row.label || "Dépense simulée", amount: row.amount, categoryId: "sim", memberId: row.memberId && row.memberId !== "global" ? row.memberId : undefined }));
  return { incomes: [...baseIncomes, ...scenarioIncomes], expenses: [...baseExpenses, ...scenarioExpenses], scenarioExpenses };
}
