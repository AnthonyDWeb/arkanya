import ExpensesManager from "@/components/expenses/ExpensesManager";
import { PageHeader } from "@arkanya/ui/layout";

export default function DepensesPage() {
  return (
    <main className="arknest-page">
      <PageHeader
        title="Depenses"
        description="Gere les depenses globales et individuelles."
        className="arknest-page-header mb-6"
      />
      <ExpensesManager />
    </main>
  );
}
