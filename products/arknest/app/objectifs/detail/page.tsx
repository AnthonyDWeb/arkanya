import { Suspense } from "react";
import { PageHeader } from "@arkanya/ui/layout";
import GoalDetails from "@/components/goals/GoalDetails";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function GoalDetailsPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Détail de l’objectif"
        description="Suis sa progression et retrouve tous ses mouvements."
        className="arknest-page-header mb-6"
      />
      <ArkanyaPremiumGate feature="arknest.goals" productName="ArkNest">
        <Suspense fallback={null}>
          <GoalDetails />
        </Suspense>
      </ArkanyaPremiumGate>
    </main>
  );
}
