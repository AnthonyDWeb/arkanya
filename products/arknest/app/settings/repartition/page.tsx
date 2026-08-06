import { PageHeader } from "@arkanya/ui/layout";
import RepartitionSettings from "@/components/settings/RepartitionSettings";

export default function RepartitionPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Mode de répartition"
        description="Définis comment les dépenses globales sont partagées."
        className="mb-6"
      />
      <RepartitionSettings />
    </main>
  );
}
