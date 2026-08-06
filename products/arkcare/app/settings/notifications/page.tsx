import { PageHeader } from "@/components/layout";
import { NotificationSettings } from "@/components/settings";

export default function NotificationSettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <PageHeader
        title="Notifications"
        description="Gérez les autorisations et vérifiez les rappels de prise."
      />
      <NotificationSettings />
    </div>
  );
}
