import { Panel, PageHeader, Stack } from "@arkanya/ui/layout";
import ExportImportBar from "@/components/shared/ExportImportBar";
import SettingsDangerZone from "@/components/settings/SettingsDangerZone";
import { ArkanyaPremiumGate } from "@arkanya/auth-client";

export default function DataSettingsPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Données et sauvegarde"
        description="Sauvegarde, restaure ou efface les données locales."
        className="mb-6"
      />
      <Stack gap="md">
        <ArkanyaPremiumGate feature="arknest.cloud_backup" productName="ArkNest">
          <Panel padding="md">
            <Stack gap="sm">
              <div>
                <h2 className="text-xl font-semibold">Sauvegarde</h2>
                <p className="text-sm arknest-muted">
                  Conserve une copie JSON de ton budget ou restaure une sauvegarde.
                </p>
              </div>
              <ExportImportBar />
            </Stack>
          </Panel>
        </ArkanyaPremiumGate>
        <SettingsDangerZone />
      </Stack>
    </main>
  );
}
