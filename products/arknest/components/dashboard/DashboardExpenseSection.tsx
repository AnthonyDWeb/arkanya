import { DashboardCategoryRows } from "./DashboardExpenseRows";
import { formatAmount } from "@/lib/format";
import type { CalculateResult } from "@/lib/calculate";
import type { Category, Expense, Member } from "@/types";

type Props = {
  title: string;
  shortTitle?: string;
  categories: Category[];
  expenses: Expense[];
  members: Member[];
  result: CalculateResult;
  mode: "global" | "individual";
  scenarioExpenses?: Array<Pick<Expense, "id" | "label" | "amount" | "memberId" | "categoryId">>;
};

export default function DashboardExpenseSection({ title, shortTitle, categories, expenses, members, result, mode, scenarioExpenses = [] }: Props) {
  return <>
    <tr className="arknest-table-section"><td colSpan={members.length + 1}>{shortTitle ? <span className="arknest-table-title-short">{shortTitle}</span> : null}<span className={shortTitle ? "arknest-table-title-full" : undefined}>{title}</span></td></tr>
    {scenarioExpenses.map((expense) => <tr key={`scenario-${mode}-${expense.id}`}><td>{expense.label} ({formatAmount(expense.amount)} €)</td>{mode === "global" ? members.map((member) => {
      const share = expense.amount * (result.members.find((item) => item.memberId === member.id)?.percent ?? 0);
      return <td key={member.id}>{formatAmount(share)} EUR</td>;
    }) : members.map((member) => <td key={member.id}>{expense.memberId === member.id ? `${formatAmount(expense.amount)} EUR` : "-"}</td>)}</tr>)}
    {categories.map((category) => <DashboardCategoryRows key={category.id} category={category} expenses={expenses.filter((expense) => expense.categoryId === category.id)} members={members} result={result} mode={mode} />)}
  </>;
}
