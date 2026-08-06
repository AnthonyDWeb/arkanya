import { PageHeader } from "@/components/layout";
import { ApkDownloadCard, UpdateCheckCard } from "@/components/settings";

export default function ApplicationSettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <PageHeader
        title="Application et mises à jour"
        description="Vérifiez la version installée ou téléchargez l’application Android."
      />
      <div className="grid gap-4">
        <UpdateCheckCard />
        <ApkDownloadCard />
      </div>
    </div>
  );
}
