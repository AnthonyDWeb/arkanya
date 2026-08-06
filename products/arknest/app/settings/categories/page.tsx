import { PageHeader } from "@arkanya/ui/layout";
import CategoriesManager from "@/components/settings/CategoriesManager";

export default function CategoriesPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Catégories"
        description="Organise les catégories de revenus et de dépenses."
        className="mb-6"
      />
      <CategoriesManager />
    </main>
  );
}
