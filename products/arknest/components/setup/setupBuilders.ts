import { Expense, Income, Member } from "@/types";
import { SetupExpenseDraft, SetupMemberDraft } from "./setupTypes";

export function buildIncomes(members: SetupMemberDraft[], savedMembers: Member[]): Income[] {
  return members.flatMap((member, memberIndex) =>
    member.incomes
      .filter((income) => income.amount && income.categoryId)
      .map((income, incomeIndex) => ({
        id: `i${memberIndex}-${incomeIndex}`,
        memberId: savedMembers[memberIndex].id,
        amount: Number(income.amount),
        categoryId: income.categoryId,
        frequency: income.frequency,
      })),
  );
}

export function buildExpenses(
  globalExpenses: SetupExpenseDraft[],
  individualExpenses: SetupExpenseDraft[],
): Expense[] {
  return [
    ...globalExpenses.map((expense, index) => ({
      id: `g${index}`,
      label: expense.label,
      amount: Number(expense.amount),
      categoryId: expense.categoryId,
    })),
    ...individualExpenses.map((expense, index) => ({
      id: `e${index}`,
      label: expense.label,
      amount: Number(expense.amount),
      categoryId: expense.categoryId,
      memberId: expense.memberId,
    })),
  ];
}
