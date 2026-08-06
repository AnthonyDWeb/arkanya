export type IncomeRow = { id: string; label: string; amount: string; memberId: string };
export type ExpenseRow = { id: string; label: string; amount: string; memberId: string };
export type ScenarioState = {
  label: string;
  incomes: Array<{ label: string; amount: number; memberId: string }>;
  expenses: Array<{ label: string; amount: number; memberId?: string }>;
};

export function makeSimulationId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function parseSimulationAmount(value: string) {
  const parsed = Number(value.replace(/,/g, ".").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}
