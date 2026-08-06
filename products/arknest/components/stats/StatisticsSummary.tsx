import { Card } from "@arkanya/ui/core";
import { formatAmount } from "@/lib/format";

export default function StatisticsSummary({ income, expenses, remaining, averageRemaining, insights }: { income: number; expenses: number; remaining: number; averageRemaining: number; insights: string[] }) {
  return <>
    <div className="arknest-stat-summary"><Stat label="Revenus actuels" value={income} /><Stat label="Dépenses actuelles" value={expenses} /><Stat label="Reste actuel" value={remaining} /><Stat label="Reste moyen" value={averageRemaining} /></div>
    {insights.length ? <Card padding="md"><h2 className="font-semibold">Tendances</h2><ul className="mt-2 space-y-1 text-sm arknest-muted">{insights.map((message) => <li key={message}>• {message}</li>)}</ul></Card> : null}
  </>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <Card padding="sm"><p className="text-xs arknest-muted">{label}</p><strong>{formatAmount(value)} €</strong></Card>;
}
