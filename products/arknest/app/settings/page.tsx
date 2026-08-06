import { PageHeader } from "@arkanya/ui/layout";
import SettingsHub from "@/components/settings/SettingsHub";

export default function SettingsPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Paramètres"
        description="Choisis le réglage que tu souhaites modifier."
        className="mb-6"
      />
      <SettingsHub />
    </main>
  );
}
