"use client";

import { Button } from "@arkanya/ui/core";
import { Stack } from "@arkanya/ui/layout";
import SetupExpensesSection from "@/components/setup/SetupExpensesSection";
import SetupMembersSection from "@/components/setup/SetupMembersSection";
import { useSetupForm } from "@/components/setup/useSetupForm";

export default function SetupForm() {
  const setup = useSetupForm();
  const data = setup.data;

  if (!data) return null;

  const incomeCategories = data.categories.filter((category) => category.type === "income");
  const expenseCategories = data.categories.filter((category) => category.type === "expense");

  return (
    <Stack gap="xl">
      <SetupMembersSection
        members={setup.members}
        incomeCategories={incomeCategories}
        onAddMember={setup.addMember}
        onRemoveMember={setup.removeMember}
        onUpdateMemberName={setup.updateMemberName}
        onAddIncome={setup.addIncome}
        onRemoveIncome={setup.removeIncome}
        onUpdateIncome={setup.updateIncome}
      />
      <SetupExpensesSection
        title="Depenses globales"
        expenses={setup.globalExpenses}
        categories={expenseCategories}
        onAdd={setup.addGlobalExpense}
        onRemove={setup.removeGlobalExpense}
        onUpdate={setup.updateGlobalExpense}
      />
      <SetupExpensesSection
        title="Depenses individuelles"
        expenses={setup.individualExpenses}
        categories={expenseCategories}
        members={setup.members}
        onAdd={setup.addIndividualExpense}
        onRemove={setup.removeIndividualExpense}
        onUpdate={setup.updateIndividualExpense}
      />
      <Button onClick={setup.submit} size="lg">
        Valider
      </Button>
    </Stack>
  );
}
