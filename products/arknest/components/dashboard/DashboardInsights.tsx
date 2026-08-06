"use client";

import Link from "next/link";
import { ChartSpline, Rocket } from "@arkanya/icons";
import GoalCard from "@/components/goals/GoalCard";
import { useAppData } from "@/lib/useAppData";

export default function DashboardInsights({ section }: { section: "links" | "goals" }) {
  const { data } = useAppData();
  if (!data) return null;
  const goals = data.goals.filter((goal) => !goal.archivedAt).slice(0, 2);
  if (section === "links") {
    return (
      <div className="arknest-dashboard-links">
        <Link href="/statistiques">
          <ChartSpline aria-hidden="true" className="h-5 w-5" />
          <span>
            <strong>Statistiques</strong>
            <small>Voir l’évolution du budget</small>
          </span>
          <b aria-hidden="true">›</b>
        </Link>
        <Link href="/objectifs">
          <Rocket aria-hidden="true" className="h-5 w-5" />
          <span>
            <strong>Objectifs</strong>
            <small>Suivre les projets et plafonds</small>
          </span>
          <b aria-hidden="true">›</b>
        </Link>
      </div>
    );
  }

  return goals.length ? (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold">Objectifs prioritaires</h2>
        <Link href="/objectifs" className="text-sm font-semibold text-teal-800">
          Tout voir
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} data={data} compact />
        ))}
      </div>
    </section>
  ) : null;
}
