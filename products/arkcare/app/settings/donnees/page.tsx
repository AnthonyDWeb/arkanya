import { PageHeader } from "@/components/layout";
import { DataBackupCard, ResetApplicationCard } from "@/components/settings";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function DataSettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <PageHeader
        title="Données et sauvegarde"
        description="Sauvegardez, restaurez ou effacez les données locales d’ArkCare."
      />
      <div className="grid gap-4">
        <ArkanyaPremiumGate feature="arkcare.cloud_backup" productName="ArkCare">
          <DataBackupCard />
        </ArkanyaPremiumGate>
        <ResetApplicationCard />
      </div>
    </div>
  );
}
