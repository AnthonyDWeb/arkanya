export type SetupIncomeDraft = {
  amount: string;
  categoryId: string;
  frequency: "monthly" | "weekly";
};

export type SetupMemberDraft = {
  name: string;
  incomes: SetupIncomeDraft[];
};

export type SetupExpenseDraft = {
  label: string;
  amount: string;
  categoryId: string;
  memberId?: string;
};
