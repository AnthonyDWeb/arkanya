import SetupForm from "@/components/setup/SetupForm";
import { PageHeader } from "@arkanya/ui/layout";

export default function SetupPage() {
  return (
    <main className="arknest-page arknest-page--narrow">
      <PageHeader
        title="Configuration initiale"
        description="Prepare les membres, revenus et depenses de depart."
        className="arknest-page-header mb-6"
      />
      <SetupForm />
    </main>
  );
}
