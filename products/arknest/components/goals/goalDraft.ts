import type { BudgetGoal, BudgetGoalType } from "@/types";

export type GoalDraft = {
  name: string;
  type: BudgetGoalType;
  targetAmount: string;
  savedAmount: string;
  categoryId: string;
  memberId: string;
  deadline: string;
  transferEnabled: boolean;
  transferType: "fixed" | "percentage" | "all";
  transferValue: string;
};

export const initialGoalDraft: GoalDraft = {
  name: "",
  type: "savings",
  targetAmount: "",
  savedAmount: "",
  categoryId: "",
  memberId: "",
  deadline: "",
  transferEnabled: false,
  transferType: "all",
  transferValue: "",
};

export function draftFromGoal(goal: BudgetGoal): GoalDraft {
  return {
    name: goal.name,
    type: goal.type,
    targetAmount: String(goal.targetAmount),
    savedAmount: String(goal.savedAmount ?? ""),
    categoryId: goal.categoryId ?? "",
    memberId: goal.memberId ?? "",
    deadline: goal.deadline ?? "",
    transferEnabled: goal.transferRule?.enabled ?? false,
    transferType: goal.transferRule?.type ?? "all",
    transferValue: goal.transferRule?.value == null ? "" : String(goal.transferRule.value),
  };
}

export function validateGoalDraft(draft: GoalDraft): string | null {
  const targetAmount = Number(draft.targetAmount);
  const transferValue = Number(draft.transferValue);
  if (!draft.name.trim() || !Number.isFinite(targetAmount) || targetAmount <= 0) return "Ajoute un nom et un montant cible supérieur à zéro.";
  if (draft.type === "expense-limit" && !draft.categoryId) return "Choisis la catégorie concernée par le plafond.";
  if (draft.type === "savings" && draft.transferEnabled && draft.transferType !== "all" && (!Number.isFinite(transferValue) || transferValue <= 0 || (draft.transferType === "percentage" && transferValue > 100))) {
    return "Indique un montant positif ou un pourcentage compris entre 1 et 100.";
  }
  return null;
}
