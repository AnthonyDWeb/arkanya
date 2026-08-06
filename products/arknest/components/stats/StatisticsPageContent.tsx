"use client";

import { useMemo, useState } from "react";
import { Notice } from "@arkanya/ui/feedback";
import BudgetBarChart from "./BudgetBarChart";
import StatisticsControls, { historicalMembers, type StatisticsPeriod } from "./StatisticsControls";
import StatisticsSummary from "./StatisticsSummary";
import TrendLineChart from "./TrendLineChart";
import { buildTrend, createDemoHistory, monthKey } from "@/lib/analytics";
import { useAppData } from "@/lib/useAppData";

export default function StatisticsPageContent() {
  const { data, update } = useAppData();
  const [period, setPeriod] = useState<StatisticsPeriod>("6");
  const [scope, setScope] = useState("global");
  const monthCount = period === "year" ? new Date().getMonth() + 1 : Number(period);
  const memberId = scope === "global" ? undefined : scope;
  const trends = useMemo(() => data ? {
    income: buildTrend(data.snapshots, "income", monthCount, memberId),
    expenses: buildTrend(data.snapshots, "expenses", monthCount, memberId),
    remaining: buildTrend(data.snapshots, "remaining", monthCount, memberId),
  } : null, [data, memberId, monthCount]);
  if (!data || !trends) return null;

  const months = trends.income.map((point) => point.month);
  const available = trends.income.filter((point) => point.value !== null).length;
  const carriedCount = data.snapshots.filter((snapshot) => snapshot.source === "carried-forward" && months.includes(snapshot.month)).length;
  const loadDemo = () => {
    if (!window.confirm("Ajouter 11 mois simulés à l’historique local ? Tes vraies données et le mois actuel seront conservés.")) return;
    update((current) => {
      const recorded = current.snapshots.filter((snapshot) => snapshot.source !== "demo");
      const recordedMonths = new Set(recorded.map((snapshot) => snapshot.month));
      return { ...current, snapshots: [...recorded, ...createDemoHistory(current).filter((snapshot) => !recordedMonths.has(snapshot.month))].sort((a, b) => a.month.localeCompare(b.month)) };
    });
  };
  const removeDemo = () => update((current) => ({ ...current, snapshots: current.snapshots.filter((snapshot) => snapshot.source !== "demo") }));
  const averageRemaining = average(trends.remaining.map((point) => point.value));
  const insights = [trendMessage("Les revenus", trends.income.map((point) => point.value)), trendMessage("Les dépenses", trends.expenses.map((point) => point.value)), trendMessage("Le reste", trends.remaining.map((point) => point.value))].filter((message): message is string => Boolean(message));
  const updatedAt = data.snapshots.find((item) => item.month === monthKey())?.updatedAt;

  return <div className="space-y-4">
    <StatisticsControls period={period} scope={scope} members={historicalMembers(data)} hasDemoHistory={data.snapshots.some((snapshot) => snapshot.source === "demo")} onPeriodChange={setPeriod} onScopeChange={setScope} onLoadDemo={loadDemo} onRemoveDemo={removeDemo} />
    {available < 2 ? <Notice tone="info"><p>L’historique commence ce mois-ci. Les courbes évolueront automatiquement à chaque nouveau mois.</p></Notice> : null}
    {carriedCount ? <Notice tone="info"><p>{carriedCount} mois de cette période ont été reportés à partir du dernier budget connu, car ArkNest n’avait pas été ouverte.</p></Notice> : null}
    <StatisticsSummary income={trends.income.at(-1)?.value ?? 0} expenses={trends.expenses.at(-1)?.value ?? 0} remaining={trends.remaining.at(-1)?.value ?? 0} averageRemaining={averageRemaining} insights={insights} />
    <TrendLineChart title="Évolution des revenus" points={trends.income} color="#2563eb" />
    <TrendLineChart title="Évolution des dépenses" points={trends.expenses} color="#e11d48" />
    <TrendLineChart title="Évolution du reste" points={trends.remaining} color="#059669" />
    <BudgetBarChart snapshots={data.snapshots} months={months} memberId={memberId} />
    <p className="text-xs arknest-muted">Dernière actualisation : {updatedAt ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(updatedAt)) : "aucune"}.</p>
  </div>;
}

function average(values: Array<number | null>) {
  const present = values.filter((value): value is number => value !== null);
  return present.length ? present.reduce((sum, value) => sum + value, 0) / present.length : 0;
}

function trendMessage(label: string, values: Array<number | null>) {
  const present = values.filter((value): value is number => value !== null);
  if (present.length < 2) return null;
  const previous = present.at(-2) ?? 0;
  const current = present.at(-1) ?? 0;
  const change = previous === 0 ? 0 : ((current - previous) / Math.abs(previous)) * 100;
  return `${label} ${change >= 0 ? "augmentent" : "diminuent"} de ${Math.abs(change).toFixed(0)} % par rapport au mois précédent.`;
}
