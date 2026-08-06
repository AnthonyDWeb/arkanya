import DashboardView from "@/components/dashboard/DashboardView";
import { PageHeader } from "@arkanya/ui/layout";

export default function Home() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de ton budget partage."
        className="arknest-page-header mb-6"
      />
      <DashboardView />
    </main>
  );
}
