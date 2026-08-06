"use client";

import { useState } from "react";
import { useAppData } from "@/lib/useAppData";
import { Expense } from "@/types";

type DraftExpense = {
  label: string;
  amount: string;
  categoryId: string;
  memberId?: string;
  typeId?: string;
};

const emptyExpense = { label: "", amount: "", categoryId: "", memberId: "", typeId: "" };

export function useExpensesManager() {
  const { data, update } = useAppData();
  const [newExpense, setNewExpense] = useState<DraftExpense>(emptyExpense);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState(false);

  const updateExpense = (id: string, field: string, value: string) => {
    update((appData) => ({
      ...appData,
      expenses: appData.expenses.map((expense) =>
        expense.id === id
          ? { ...expense, [field]: field === "amount" ? Number(value) : value }
          : expense,
      ),
    }));
  };

  const deleteExpense = (id: string) => {
    setFeedbackError(false);
    update((appData) => ({
      ...appData,
      expenses: appData.expenses.filter((expense) => expense.id !== id),
    }));
    setFeedback("Depense supprimée.");
  };

  const addExpense = (isIndividual: boolean) => {
    const draft = newExpense;

    if (!draft.label || !draft.amount || !draft.categoryId) {
      setFeedbackError(true);
      setFeedback("Le libellé, le montant et la catégorie sont requis.");
      return;
    }

    if (isIndividual && !draft.memberId) {
      setFeedbackError(true);
      setFeedback("Selectionne un membre pour une depense individuelle.");
      return;
    }

    const parsedAmount = Number(draft.amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedbackError(true);
      setFeedback("Le montant de la depense doit être supérieur à 0.");
      return;
    }

    setFeedbackError(false);
    const expense: Expense = {
      id: crypto.randomUUID(),
      label: draft.label,
      amount: parsedAmount,
      categoryId: draft.categoryId,
      memberId: isIndividual ? draft.memberId : undefined,
      typeId: isIndividual ? draft.typeId || undefined : undefined,
    };

    update((appData) => ({ ...appData, expenses: [...appData.expenses, expense] }));
    setNewExpense(emptyExpense);
    setFeedback("Depense ajoutée.");
  };

  return {
    data,
    newExpense,
    setNewExpense,
    updateExpense,
    deleteExpense,
    feedback,
    feedbackError,
    addExpense,
  };
}
