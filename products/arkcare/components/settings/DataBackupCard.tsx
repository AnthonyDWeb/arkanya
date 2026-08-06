"use client";

import { useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { createBackup, getDoses, getTreatments, parseBackup, restoreBackup } from "@/lib/storage";

export function DataBackupCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function download() {
    const backup = createBackup(getTreatments(), getDoses());
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `arkcare-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsError(false);
    setMessage("Sauvegarde exportee.");
  }

  async function importFile(file?: File) {
    if (!file) return;
    try {
      const backup = parseBackup(await file.text());
      if (!window.confirm("Remplacer toutes les donnees actuelles par cette sauvegarde ?")) return;
      restoreBackup(backup);
      setIsError(false);
      setMessage(`${backup.treatments.length} traitement(s) et ${backup.doses.length} prise(s) restaures.`);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Impossible de restaurer ce fichier.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Sauvegarde des donnees</h2>
      <p className="mt-1 text-sm text-slate-600">
        Exportez vos traitements et votre historique avant une reinstallation ou un changement
        d’appareil. Une restauration remplace les donnees actuellement presentes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={download}>Exporter</Button>
        <Button onClick={() => inputRef.current?.click()} variant="secondary">
          Restaurer un fichier
        </Button>
        <input
          ref={inputRef}
          accept="application/json,.json"
          className="sr-only"
          onChange={(event) => void importFile(event.target.files?.[0])}
          type="file"
        />
      </div>
      {message ? (
        <p className={`mt-3 text-sm ${isError ? "text-rose-700" : "text-teal-700"}`} role="status">
          {message}
        </p>
      ) : null}
    </Card>
  );
}
