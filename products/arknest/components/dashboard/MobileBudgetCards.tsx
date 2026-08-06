import { Card } from "@arkanya/ui/core";
import type { CalculateResult } from "@/lib/calculate";
import { formatAmount } from "@/lib/format";
import type { Expense, Member } from "@/types";

type Props = {
  members: Member[];
  result: CalculateResult;
  expenses?: Expense[];
};

export default function MobileBudgetCards({ members, result, expenses = [] }: Props) {
  const totalGlobal = result.globalExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="arknest-mobile-budget">
      {members.map((member) => {
        const memberResult = result.members.find((item) => item.memberId === member.id);
        if (!memberResult) return null;

        const memberExpenses = expenses.filter((expense) => expense.memberId === member.id);

        return (
          <Card key={member.id} padding="md" variant="outlined" className="arknest-member-summary">
            <div className="arknest-member-summary__header">
              <h2>{member.name}</h2>
              <strong
                className={memberResult.remaining < 0 ? "arknest-negative" : "arknest-positive"}
              >
                {formatAmount(memberResult.remaining)} €
              </strong>
            </div>

            <dl className="arknest-member-summary__metrics">
              <div>
                <dt>Revenus</dt>
                <dd>{formatAmount(memberResult.income)} €</dd>
              </div>
              <div>
                <dt>Répartition</dt>
                <dd>{(memberResult.percent * 100).toFixed(2)} %</dd>
              </div>
              <div>
                <dt>À payer</dt>
                <dd>{formatAmount(memberResult.toPay)} €</dd>
              </div>
              <div>
                <dt>Reste</dt>
                <dd>{formatAmount(memberResult.remaining)} €</dd>
              </div>
            </dl>

            <details className="arknest-member-summary__details">
              <summary>Voir le détail</summary>
              <div className="space-y-3 pt-3">
                <ExpenseList
                  title="Dépenses globales"
                  expenses={result.globalExpenses}
                  share={memberResult.percent}
                />
                <ExpenseList title="Dépenses individuelles" expenses={memberExpenses} />
              </div>
            </details>
          </Card>
        );
      })}

      {totalGlobal > 0 ? (
        <p className="arknest-mobile-budget__total">
          Dépenses globales du foyer : <strong>{formatAmount(totalGlobal)} €</strong>
        </p>
      ) : null}
    </div>
  );
}

function ExpenseList({
  title,
  expenses,
  share = 1,
}: {
  title: string;
  expenses: Expense[];
  share?: number;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold">{title}</h3>
      {expenses.length ? (
        <ul className="mt-1 space-y-1">
          {expenses.map((expense) => (
            <li key={expense.id} className="arknest-member-expense">
              <span className="arknest-member-expense__label">
                <span>{expense.label}</span>
                <small>Total : {formatAmount(expense.amount)} €</small>
              </span>
              <span className="arknest-member-expense__share">
                <small>Part</small>
                <strong>{formatAmount(expense.amount * share)} €</strong>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm arknest-muted">Aucune dépense.</p>
      )}
    </section>
  );
}
