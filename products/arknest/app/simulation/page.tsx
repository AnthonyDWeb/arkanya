import { PageHeader } from "@arkanya/ui/layout";
import SimulationPageContent from "@/components/shared/SimulationPageContent";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function SimulationPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Simulation"
        description="Renseigne un scénario de revenu et de dépense pour comparer son impact sur le budget."
        className="arknest-page-header mb-6"
      />
      <ArkanyaPremiumGate feature="arknest.simulations" productName="ArkNest">
        <SimulationPageContent />
      </ArkanyaPremiumGate>
    </main>
  );
}
