"use client";

import { useState } from "react";
import { Button, Card } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { useAppData } from "@/lib/useAppData";
import { normalizeAppData } from "@/lib/storage";
import { validateAppData } from "@/lib/dataValidation";
import type { AppData } from "@/types";

export default function ExportImportBar() {
  const { data, update } = useAppData();
  const [feedback, setFeedback] = useState<{ message: string; tone: "success" | "danger" } | null>(
    null,
  );
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);

  const exportData = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "arknest-export.json";
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ message: "Export JSON prêt à télécharger.", tone: "success" });
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        if (file.size > 5_000_000) throw new Error("Le fichier dépasse la limite de 5 Mo.");
        const parsed: unknown = JSON.parse(await file.text());
        const validation = validateAppData(parsed);
        if (!validation.valid) throw new Error(validation.error);
        setPendingImport(normalizeAppData(parsed as Partial<AppData>));
        setFeedback(null);
      } catch (error) {
        setPendingImport(null);
        setFeedback({
          message: error instanceof Error ? error.message : "Le fichier ne contient pas une sauvegarde ArkNest valide.",
          tone: "danger",
        });
      }
    };
    input.click();
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    update(() => pendingImport);
    setPendingImport(null);
    setFeedback({ message: "Données importées avec succès.", tone: "success" });
  };

  return (
    <div className="space-y-3">
      {feedback ? (
        <Notice tone={feedback.tone}>
          <p>{feedback.message}</p>
        </Notice>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button onClick={exportData} className="arknest-mobile-full-button">
          Exporter JSON
        </Button>
        <Button variant="secondary" onClick={importData} className="arknest-mobile-full-button">
          Importer JSON
        </Button>
      </div>
      {pendingImport ? (
        <Card padding="sm" variant="outlined" className="space-y-3">
          <div>
            <strong>Sauvegarde détectée</strong>
            <p className="mt-1 text-sm arknest-muted">
              {pendingImport.members.length} membre(s), {pendingImport.incomes.length} revenu(s) et{" "}
              {pendingImport.expenses.length} dépense(s).
            </p>
          </div>
          <Notice tone="danger">
            <p>L&apos;import remplacera les données actuellement enregistrées.</p>
          </Notice>
          <div className="flex flex-wrap gap-2">
            <Button onClick={confirmImport} className="arknest-mobile-full-button">
              Confirmer l&apos;import
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPendingImport(null)}
              className="arknest-mobile-full-button"
            >
              Annuler
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
