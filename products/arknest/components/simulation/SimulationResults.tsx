import { Card } from "@arkanya/ui/core";
import DashboardBalanceRows from "@/components/dashboard/DashboardBalanceRows";
import DashboardExpenseSection from "@/components/dashboard/DashboardExpenseSection";
import DashboardSummaryRows from "@/components/dashboard/DashboardSummaryRows";
import MobileBudgetCards from "@/components/dashboard/MobileBudgetCards";
import { formatAmount } from "@/lib/format";
import type { SimulationModel } from "./useSimulationScenario";

export default function SimulationResults({ model }: { model: SimulationModel }) {
  if (!model.appliedScenario || !model.scenarioResult || !model.data) {
    return <Card padding="md"><p className="text-sm arknest-muted">Les résultats du scénario apparaîtront ici après validation.</p></Card>;
  }
  const categories = [
    ...model.data.categories.filter((category) => category.type === "expense"),
    { id: "sim", name: "Simulation", type: "expense" as const },
  ];
  const displayExpenses = [...model.expenses, ...model.simulatedExpenses];
  return <div className="space-y-4">
    <Card padding="md" className="space-y-4">
      <div><h3 className="font-semibold">Résultat : {model.appliedScenario.label}</h3><p className="text-sm arknest-muted">Les montants simulés sont intégrés au budget sans modifier les données réelles.</p></div>
      <MobileBudgetCards members={model.members} result={model.scenarioResult} expenses={displayExpenses} />
      <div className="arknest-table-wrap">
        <table className="arknest-table"><thead><tr><th></th>{model.members.map((member) => <th key={member.id}>{member.name}</th>)}</tr></thead><tbody>
          <DashboardSummaryRows result={model.scenarioResult} memberCount={model.members.length} />
          <DashboardExpenseSection title="Dépenses globales" shortTitle="D.Glo" categories={categories} expenses={model.scenarioResult.globalExpenses} members={model.members} result={model.scenarioResult} mode="global" />
          <DashboardExpenseSection title="Dépenses individuelles" shortTitle="D.Ind" categories={categories} expenses={model.scenarioResult.individualExpenses} members={model.members} result={model.scenarioResult} mode="individual" />
          <DashboardBalanceRows result={model.scenarioResult} />
        </tbody></table>
      </div>
    </Card>
    <Card padding="md" className="space-y-4">
      <div><h3 className="font-semibold">Comparatif du scénario</h3><p className="text-sm arknest-muted">Compare le budget actuel avec le résultat simulé.</p></div>
      <div className="arknest-comparison-cards">{model.comparisonRows.map((row) => <ComparisonCard key={row.label} {...row} />)}</div>
      <div className="arknest-table-wrap"><table className="arknest-table"><thead><tr><th>Élément</th><th>Budget actuel</th><th>Scénario</th><th>Écart</th></tr></thead><tbody>{model.comparisonRows.map((row) => <tr key={row.label}><td>{row.label}</td><td>{formatAmount(row.current)} €</td><td>{formatAmount(row.scenario)} €</td><td className={row.diff >= 0 ? "arknest-positive" : "arknest-negative"}>{row.diff >= 0 ? "+" : ""}{formatAmount(row.diff)} €</td></tr>)}</tbody></table></div>
    </Card>
  </div>;
}

function ComparisonCard({ label, current, scenario, diff }: { label: string; current: number; scenario: number; diff: number }) {
  return <div className="arknest-comparison-card"><strong>{label}</strong><dl><div><dt>Actuel</dt><dd>{formatAmount(current)} €</dd></div><div><dt>Simulation</dt><dd>{formatAmount(scenario)} €</dd></div><div><dt>Écart</dt><dd className={diff >= 0 ? "arknest-positive" : "arknest-negative"}>{diff >= 0 ? "+" : ""}{formatAmount(diff)} €</dd></div></dl></div>;
}
