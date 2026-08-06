"use client";

import { useState } from "react";
import { Button, Input, Select } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Panel, Stack } from "@arkanya/ui/layout";
import CategorySection from "@/components/settings/CategorySection";
import { useAppData } from "@/lib/useAppData";
import { Category, CategoryType } from "@/types";

export default function CategoriesManager() {
  const { data, update } = useAppData();
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("expense");
  const [feedback, setFeedback] = useState<{ message: string; tone: "success" | "danger" } | null>(
    null,
  );

  if (!data) return null;

  const addCategory = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFeedback({ message: "Le nom de la catégorie est requis.", tone: "danger" });
      return;
    }

    const category: Category = { id: crypto.randomUUID(), name: trimmedName, type };
    update((appData) => ({ ...appData, categories: [...appData.categories, category] }));
    setName("");
    setFeedback({ message: "Catégorie ajoutée.", tone: "success" });
  };

  const deleteCategory = (id: string) => {
    const linkedCount =
      data.incomes.filter((item) => item.categoryId === id).length +
      data.expenses.filter((item) => item.categoryId === id).length;
    const message =
      linkedCount > 0
        ? `Cette catégorie est utilisée par ${linkedCount} opération(s). Les opérations seront conservées mais ne seront plus classées. Continuer ?`
        : "Supprimer cette catégorie ?";
    if (!window.confirm(message)) return;

    update((appData) => ({
      ...appData,
      categories: appData.categories.filter((category) => category.id !== id),
    }));
    setFeedback({ message: "Catégorie supprimée.", tone: "success" });
  };

  const renameCategory = (id: string, name: string) => {
    update((appData) => ({
      ...appData,
      categories: appData.categories.map((category) =>
        category.id === id ? { ...category, name } : category,
      ),
    }));
  };

  return (
    <Panel padding="md">
      <Stack gap="md">
        {feedback ? (
          <Notice tone={feedback.tone}>
            <p>{feedback.message}</p>
          </Notice>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-sm arknest-muted">Gere tes categories de revenus et depenses</p>
        </div>
        <Stack gap="sm">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nouvelle categorie"
          />
          <Select value={type} onChange={(event) => setType(event.target.value as CategoryType)}>
            <option value="income">Revenu</option>
            <option value="expense">Depense</option>
          </Select>
          <Button onClick={addCategory}>Ajouter</Button>
        </Stack>
        <CategorySection
          title="Revenus"
          categories={data.categories.filter((c) => c.type === "income")}
          onDelete={deleteCategory}
          onRename={renameCategory}
        />
        <CategorySection
          title="Depenses"
          categories={data.categories.filter((c) => c.type === "expense")}
          onDelete={deleteCategory}
          onRename={renameCategory}
        />
      </Stack>
    </Panel>
  );
}
