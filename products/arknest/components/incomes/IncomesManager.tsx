"use client";

import { useState } from "react";
import IncomeForm from "@/components/incomes/IncomeForm";
import IncomeGroup from "@/components/incomes/IncomeGroup";
import { useAppData } from "@/lib/useAppData";
import { Income } from "@/types";
import { Notice } from "@arkanya/ui/feedback";
import { Stack } from "@arkanya/ui/layout";

export default function IncomesManager() {
  const { data, update } = useAppData();
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "weekly">("monthly");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState(false);

  if (!data) return null;

  const categories = data.categories.filter((category) => category.type === "income");
  const canSubmit = Boolean(amount && memberId && categoryId);

  const updateIncome = (id: string, patch: Partial<Income>) => {
    update((appData) => ({
      ...appData,
      incomes: appData.incomes.map((income) =>
        income.id === id ? { ...income, ...patch } : income,
      ),
    }));
  };

  const deleteIncome = (id: string) => {
    update((appData) => ({
      ...appData,
      incomes: appData.incomes.filter((income) => income.id !== id),
    }));
  };

  const addIncome = () => {
    if (!amount || !memberId || !categoryId) {
      setFeedbackError(true);
      setFeedback("Remplis tous les champs pour ajouter un revenu.");
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedbackError(true);
      setFeedback("Le montant du revenu doit être supérieur à 0.");
      return;
    }

    setFeedbackError(false);
    const income: Income = {
      id: crypto.randomUUID(),
      memberId,
      amount: parsedAmount,
      categoryId,
      frequency,
    };

    update((appData) => ({ ...appData, incomes: [...appData.incomes, income] }));
    setFeedback("Revenu ajouté.");
    setAmount("");
    setMemberId("");
    setCategoryId("");
    setFrequency("monthly");
  };

  return (
    <Stack gap="lg">
      {feedback ? (
        <Notice tone={feedbackError ? "danger" : "success"}>
          <p>{feedback}</p>
        </Notice>
      ) : null}
      {categories.map((category) => (
        <IncomeGroup
          key={category.id}
          category={category}
          incomes={data.incomes.filter((income) => income.categoryId === category.id)}
          members={data.members}
          onUpdate={updateIncome}
          onDelete={deleteIncome}
        />
      ))}
      <IncomeForm
        amount={amount}
        memberId={memberId}
        categoryId={categoryId}
        frequency={frequency}
        members={data.members}
        categories={categories}
        onAmountChange={setAmount}
        onMemberChange={setMemberId}
        onCategoryChange={setCategoryId}
        onFrequencyChange={setFrequency}
        onSubmit={addIncome}
        canSubmit={canSubmit}
      />
    </Stack>
  );
}
