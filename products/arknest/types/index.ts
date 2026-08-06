export type Member = {
  id: string;
  name: string;
};

export type CategoryType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

export type Income = {
  id: string;
  memberId: string;
  amount: number;
  categoryId: string;
  frequency: "monthly" | "weekly";
};

export type ExpenseType = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  label: string;
  amount: number;
  categoryId: string;
  typeId?: string;
  memberId?: string;
  recurrence?: "monthly" | "one-time";
  month?: string;
  goalId?: string;
  isSavingsTransfer?: boolean;
};

export type RepartitionMode = "equal" | "proportional" | "custom";

export type Settings = {
  repartitionMode: RepartitionMode;
  isSetupComplete: boolean;
  customShares?: Record<string, number>;
};

export type MonthlyMemberSnapshot = {
  memberId: string;
  memberName: string;
  income: number;
  expenses: number;
  remaining: number;
};

export type MonthlySnapshot = {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
  members: MonthlyMemberSnapshot[];
  updatedAt: string;
  source?: "recorded" | "carried-forward" | "demo";
  copiedFromMonth?: string;
};

export type BudgetGoalType = "savings" | "expense-limit" | "monthly-remaining";

export type BudgetGoal = {
  id: string;
  name: string;
  type: BudgetGoalType;
  targetAmount: number;
  savedAmount?: number;
  categoryId?: string;
  memberId?: string;
  deadline?: string;
  archivedAt?: string;
  createdAt: string;
  transferRule?: {
    enabled: boolean;
    type: "fixed" | "percentage" | "all";
    value?: number;
    startMonth?: string;
  };
};

export type GoalContribution = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  month: string;
  source: "manual" | "automatic" | "withdrawal";
};

export type AppData = {
  schemaVersion: 2;
  members: Member[];
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  expenseTypes: ExpenseType[];
  settings: Settings;
  snapshots: MonthlySnapshot[];
  goals: BudgetGoal[];
  goalContributions: GoalContribution[];
};
