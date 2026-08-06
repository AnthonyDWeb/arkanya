import { PageHeader } from "@arkanya/ui/layout";
import StatisticsPageContent from "@/components/stats/StatisticsPageContent";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function StatisticsPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Statistiques"
        description="Suis l’évolution réelle de ton budget mois après mois."
        className="arknest-page-header mb-6"
      />
      <ArkanyaPremiumGate feature="arknest.statistics" productName="ArkNest">
        <StatisticsPageContent />
      </ArkanyaPremiumGate>
    </main>
  );
}
