"use client";

import { useState } from "react";
import { Button, Card } from "@arkanya/ui/core";
import DashboardBalanceRows from "@/components/dashboard/DashboardBalanceRows";
import DashboardExpenseSection from "@/components/dashboard/DashboardExpenseSection";
import DashboardSummaryRows from "@/components/dashboard/DashboardSummaryRows";
import EmptyStateCard from "@/components/shared/EmptyStateCard";
import SummaryCards from "@/components/shared/SummaryCards";
import MobileBudgetCards from "@/components/dashboard/MobileBudgetCards";
import DashboardInsights from "@/components/dashboard/DashboardInsights";
import { calculateFull, calculateSummary } from "@/lib/calculate";
import { useAppData } from "@/lib/useAppData";

export default function DashboardTable() {
  const { data } = useAppData();
  const [displayMode, setDisplayMode] = useState<"cards" | "table">("cards");

  const hasData = data?.members.length || data?.incomes.length || data?.expenses.length;

  if (!data) return null;

  if (!data.settings.isSetupComplete && !hasData) {
    return (
      <EmptyStateCard
        title="Pas encore de budget"
        description="Ajoute des membres, des revenus et des depenses pour voir le dashboard."
      />
    );
  }

  const result = calculateFull(
    data.members,
    data.incomes,
    data.expenses,
    data.settings.repartitionMode,
    undefined,
    data.settings.customShares,
  );
  const summary = calculateSummary(
    data.members,
    data.incomes,
    data.expenses,
    data.settings.repartitionMode,
    undefined,
    data.settings.customShares,
  );
  const expenseCategories = data.categories.filter((category) => category.type === "expense");
  const table = (
    <Card padding="none">
      <div className="arknest-table-wrap">
        <table className="arknest-table">
          <thead>
            <tr>
              <th></th>
              {data.members.map((member) => (
                <th key={member.id}>{member.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <DashboardSummaryRows result={result} memberCount={data.members.length} />
            <DashboardExpenseSection
              title="Dépenses globales"
              shortTitle="D.Glo"
              categories={expenseCategories}
              expenses={result.globalExpenses}
              members={data.members}
              result={result}
              mode="global"
            />
            <DashboardExpenseSection
              title="Dépenses individuelles"
              shortTitle="D.Ind"
              categories={expenseCategories}
              expenses={result.individualExpenses}
              members={data.members}
              result={result}
              mode="individual"
            />
            <DashboardBalanceRows result={result} />
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <DashboardInsights section="links" />
      <SummaryCards
        totalIncome={summary.totalIncome}
        totalExpenses={summary.totalExpenses}
        remaining={summary.remaining}
        percentUsed={summary.percentUsed}
      />
      <div className="arknest-dashboard-view-toggle" role="group" aria-label="Affichage du budget">
        <Button
          size="sm"
          variant={displayMode === "cards" ? "primary" : "secondary"}
          aria-pressed={displayMode === "cards"}
          onClick={() => setDisplayMode("cards")}
        >
          Cartes
        </Button>
        <Button
          size="sm"
          variant={displayMode === "table" ? "primary" : "secondary"}
          aria-pressed={displayMode === "table"}
          onClick={() => setDisplayMode("table")}
        >
          Tableau
        </Button>
      </div>
      {displayMode === "cards" ? (
        <MobileBudgetCards members={data.members} result={result} expenses={data.expenses} />
      ) : table}
      <DashboardInsights section="goals" />
    </div>
  );
}
