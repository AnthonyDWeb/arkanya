import { PageHeader } from "@arkanya/ui/layout";
import ApplicationSettings from "@/components/settings/ApplicationSettings";

export default function ApplicationSettingsPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Application et mises à jour"
        description="Vérifie la version installée ou télécharge ArkNest pour Android."
        className="mb-6"
      />
      <ApplicationSettings />
    </main>
  );
}
