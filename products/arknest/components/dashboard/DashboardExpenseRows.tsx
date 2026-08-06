import { Fragment } from "react";
import { formatAmount } from "@/lib/format";
import type { CalculateResult } from "@/lib/calculate";
import type { Category, Expense, Member } from "@/types";

export function DashboardCategoryRows({ category, expenses, members, result, mode }: { category: Category; expenses: Expense[]; members: Member[]; result: CalculateResult; mode: "global" | "individual" }) {
  if (!expenses.length) return null;
  return <Fragment>
    {expenses.map((expense) => <tr key={expense.id}><td>{expense.label} ({formatAmount(expense.amount)} €)</td>{mode === "global" ? result.members.map((member) => <td key={member.memberId}>{formatAmount(expense.amount * member.percent)} EUR</td>) : members.map((member) => <td key={member.id}>{expense.memberId === member.id ? `${formatAmount(expense.amount)} EUR` : "-"}</td>)}</tr>)}
    <DashboardCategoryTotal category={category} expenses={expenses} members={members} result={result} mode={mode} />
  </Fragment>;
}

function DashboardCategoryTotal({ category, expenses, members, result, mode }: { category: Category; expenses: Expense[]; members: Member[]; result: CalculateResult; mode: "global" | "individual" }) {
  const categoryTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return <tr><td className="arknest-muted">Total {category.name} ({formatAmount(categoryTotal)} €)</td>{members.map((member) => {
    const resultMember = result.members.find((item) => item.memberId === member.id);
    const total = mode === "global"
      ? expenses.reduce((sum, expense) => sum + expense.amount * (resultMember?.percent ?? 0), 0)
      : expenses.filter((expense) => expense.memberId === member.id).reduce((sum, expense) => sum + expense.amount, 0);
    return <td key={member.id} className="arknest-muted"><strong>{formatAmount(total)} EUR</strong></td>;
  })}</tr>;
}
