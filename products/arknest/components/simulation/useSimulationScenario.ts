"use client";

import { useMemo, useState } from "react";
import { calculateFull, calculateSummary } from "@/lib/calculate";
import { buildScenarioBudget } from "@/lib/simulation";
import { useAppData } from "@/lib/useAppData";
import { makeSimulationId, parseSimulationAmount, type ExpenseRow, type IncomeRow, type ScenarioState } from "./types";

export function useSimulationScenario() {
  const { data } = useAppData();
  const [scenarioLabel, setScenarioLabel] = useState("Scénario mensuel");
  const [incomeRows, setIncomeRows] = useState<IncomeRow[]>([{ id: makeSimulationId(), label: "", amount: "", memberId: "" }]);
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([{ id: makeSimulationId(), label: "", amount: "", memberId: "global" }]);
  const [appliedScenario, setAppliedScenario] = useState<ScenarioState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const members = useMemo(() => data?.members ?? [], [data?.members]);
  const incomes = useMemo(() => data?.incomes ?? [], [data?.incomes]);
  const expenses = useMemo(() => data?.expenses ?? [], [data?.expenses]);
  const mode = data?.settings.repartitionMode ?? "equal";
  const customShares = data?.settings.customShares;
  const baseResult = useMemo(() => calculateFull(members, incomes, expenses, mode, undefined, customShares), [customShares, expenses, incomes, members, mode]);
  const baseSummary = useMemo(() => calculateSummary(members, incomes, expenses, mode, undefined, customShares), [customShares, expenses, incomes, members, mode]);
  const scenarioBudget = appliedScenario ? buildScenarioBudget(incomes, expenses, members, appliedScenario) : null;
  const scenarioResult = scenarioBudget ? calculateFull(members, scenarioBudget.incomes, scenarioBudget.expenses, mode, undefined, customShares) : null;
  const scenarioSummary = scenarioBudget ? calculateSummary(members, scenarioBudget.incomes, scenarioBudget.expenses, mode, undefined, customShares) : null;
  const comparisonRows = appliedScenario && scenarioResult && scenarioSummary ? [
    { label: "Revenus totaux", current: baseSummary.totalIncome, scenario: scenarioSummary.totalIncome, diff: scenarioSummary.totalIncome - baseSummary.totalIncome },
    { label: "Dépenses totales", current: baseSummary.totalExpenses, scenario: scenarioSummary.totalExpenses, diff: scenarioSummary.totalExpenses - baseSummary.totalExpenses },
    { label: "Reste", current: baseSummary.remaining, scenario: scenarioSummary.remaining, diff: scenarioSummary.remaining - baseSummary.remaining },
    ...members.map((member) => { const current = baseResult.members.find((item) => item.memberId === member.id)?.remaining ?? 0; const scenario = scenarioResult.members.find((item) => item.memberId === member.id)?.remaining ?? 0; return { label: member.name, current, scenario, diff: scenario - current }; }),
  ] : [];
  const validate = () => {
    setAppliedScenario({ label: scenarioLabel.trim() || "Scénario", incomes: incomeRows.filter((row) => row.amount.trim() || row.label.trim()).map((row) => ({ label: row.label.trim() || "Revenu simulé", amount: parseSimulationAmount(row.amount), memberId: row.memberId })), expenses: expenseRows.filter((row) => row.amount.trim() || row.label.trim()).map((row) => ({ label: row.label.trim() || "Dépense simulée", amount: parseSimulationAmount(row.amount), memberId: row.memberId })) });
    setFeedback("Scénario validé. Les résultats comparent le budget actuel avec la simulation.");
  };
  const reset = () => { setAppliedScenario(null); setScenarioLabel("Scénario mensuel"); setIncomeRows([{ id: makeSimulationId(), label: "", amount: "", memberId: "" }]); setExpenseRows([{ id: makeSimulationId(), label: "", amount: "", memberId: "global" }]); setFeedback("Formulaire réinitialisé."); };
  return {
    data, members, expenses, scenarioLabel, setScenarioLabel, incomeRows, expenseRows, appliedScenario, scenarioResult, comparisonRows, simulatedExpenses: scenarioBudget?.scenarioExpenses ?? [], feedback, validate, reset,
    addIncome: () => setIncomeRows((rows) => [...rows, { id: makeSimulationId(), label: "", amount: "", memberId: members[0]?.id ?? "" }]), updateIncome: (id: string, patch: Partial<IncomeRow>) => setIncomeRows((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row)), removeIncome: (id: string) => setIncomeRows((rows) => rows.filter((row) => row.id !== id)),
    addExpense: () => setExpenseRows((rows) => [...rows, { id: makeSimulationId(), label: "", amount: "", memberId: "global" }]), updateExpense: (id: string, patch: Partial<ExpenseRow>) => setExpenseRows((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row)), removeExpense: (id: string) => setExpenseRows((rows) => rows.filter((row) => row.id !== id)),
  };
}

export type SimulationModel = ReturnType<typeof useSimulationScenario>;
