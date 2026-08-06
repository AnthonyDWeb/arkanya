import { PageHeader } from "@/components/layout";
import { SettingsHub } from "@/components/settings";

export default function SettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <PageHeader
        title="Paramètres"
        description="Choisissez le réglage que vous souhaitez modifier."
      />
      <SettingsHub />
    </div>
  );
}
