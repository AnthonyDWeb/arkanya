"use client";

import ExpenseDraftForm from "@/components/expenses/ExpenseDraftForm";
import ExpenseSection from "@/components/expenses/ExpenseSection";
import { useExpensesManager } from "@/components/expenses/useExpensesManager";
import { Notice } from "@arkanya/ui/feedback";
import { Stack } from "@arkanya/ui/layout";

export default function ExpensesManager() {
  const manager = useExpensesManager();
  const data = manager.data;

  if (!data) return null;

  const categories = data.categories.filter((category) => category.type === "expense");
  const isIndividual = categories.find((category) => category.id === manager.newExpense.categoryId)?.name === "Individuel";
  const globalExpenses = data.expenses.filter((expense) => !expense.memberId);
  const individualExpenses = data.expenses.filter((expense) => expense.memberId);

  return (
    <Stack gap="xl">
      {manager.feedback ? (
        <Notice tone={manager.feedbackError ? "danger" : "success"}>
          <p>{manager.feedback}</p>
        </Notice>
      ) : null}
      <ExpenseDraftForm
        draft={manager.newExpense}
        categories={categories}
        members={data.members}
        expenseTypes={data.expenseTypes}
        isIndividual={isIndividual}
        onChange={manager.setNewExpense}
        onSubmit={() => manager.addExpense(isIndividual)}
      />
      <ExpenseSection
        title="Depenses globales"
        expenses={globalExpenses}
        categories={categories}
        members={data.members}
        expenseTypes={data.expenseTypes}
        isIndividual={false}
        onUpdate={manager.updateExpense}
        onDelete={manager.deleteExpense}
      />
      <ExpenseSection
        title="Depenses individuelles"
        expenses={individualExpenses}
        categories={categories}
        members={data.members}
        expenseTypes={data.expenseTypes}
        isIndividual
        onUpdate={manager.updateExpense}
        onDelete={manager.deleteExpense}
      />
    </Stack>
  );
}
