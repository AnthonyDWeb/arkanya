import { PageHeader } from "@arkanya/ui/layout";
import GoalsManager from "@/components/goals/GoalsManager";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function GoalsPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Objectifs"
        description="Transforme ton budget en projets concrets et mesurables."
        className="arknest-page-header mb-6"
      />
      <ArkanyaPremiumGate feature="arknest.goals" productName="ArkNest">
        <GoalsManager />
      </ArkanyaPremiumGate>
    </main>
  );
}
