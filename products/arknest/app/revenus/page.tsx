import IncomesManager from "@/components/incomes/IncomesManager";
import { PageHeader } from "@arkanya/ui/layout";

export default function RevenusPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Revenus"
        description="Gere les revenus de chaque membre."
        className="arknest-page-header mb-6"
      />
      <IncomesManager />
    </main>
  );
}
