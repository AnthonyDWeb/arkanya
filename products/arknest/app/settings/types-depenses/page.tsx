import { PageHeader } from "@arkanya/ui/layout";
import ExpenseTypesManager from "@/components/expenses/ExpenseTypesManager";

export default function ExpenseTypesPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Types de dépenses"
        description="Classe les dépenses individuelles selon leur usage."
        className="mb-6"
      />
      <ExpenseTypesManager />
    </main>
  );
}
