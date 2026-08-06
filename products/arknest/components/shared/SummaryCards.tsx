import { Card } from "@arkanya/ui/core";
import { ExpensesIcon, HandCoins, IncomesIcon, Percent, type ArkanyaIcon } from "@arkanya/icons";
import { formatAmount } from "@/lib/format";

type Props = { totalIncome: number; totalExpenses: number; remaining: number; percentUsed: number };

export default function SummaryCards({ totalIncome, totalExpenses, remaining, percentUsed }: Props) {
  const items = [
    { label: "Revenus", value: `${formatAmount(totalIncome)} €`, kind: "income", icon: IncomesIcon },
    { label: "Dépenses", value: `${formatAmount(totalExpenses)} €`, kind: "expenses", icon: ExpensesIcon },
    { label: "Reste", value: `${formatAmount(remaining)} €`, kind: "remaining", icon: HandCoins },
    { label: "Utilisation", value: `${percentUsed}%`, kind: "usage", icon: Percent },
  ] satisfies Array<{ label: string; value: string; kind: string; icon: ArkanyaIcon }>;
  return <div className="arknest-summary-grid">{items.map((item) => {
    const Icon = item.icon;
    return <Card key={item.label} padding="none" className="arknest-summary-card" data-kind={item.kind}><div className="arknest-summary-card__heading"><span className="arknest-summary-card__icon"><Icon aria-hidden="true" /></span><p>{item.label}</p></div><strong>{item.value}</strong></Card>;
  })}</div>;
}
