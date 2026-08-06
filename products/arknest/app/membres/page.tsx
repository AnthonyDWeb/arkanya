import MembersManager from "@/components/members/MembersManager";
import { PageHeader } from "@arkanya/ui/layout";

export default function MembresPage() {
  return (
    <main className="arknest-page arknest-page--narrow">
      <PageHeader
        title="Membres"
        description="Gere les personnes du foyer."
        className="arknest-page-header mb-6"
      />
      <MembersManager />
    </main>
  );
}
