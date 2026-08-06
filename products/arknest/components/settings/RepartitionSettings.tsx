"use client";

import { useState } from "react";
import { Button, Input } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Panel, Stack } from "@arkanya/ui/layout";
import { useAppData } from "@/lib/useAppData";
import type { RepartitionMode } from "@/types";

export default function RepartitionSettings() {
  const { data, update } = useAppData();
  const [draftShares, setDraftShares] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean } | null>(null);
  if (!data) return null;
  const canCustomize = data.members.length > 1;
  const baseCents = canCustomize ? Math.floor(10_000 / data.members.length) : 10_000;
  const extraCents = canCustomize ? 10_000 - baseCents * data.members.length : 0;
  const defaultShares = Object.fromEntries(data.members.map((member, index) => [member.id, (baseCents + (index < extraCents ? 1 : 0)) / 100]));
  const shareFor = (memberId: string) => draftShares[memberId] ?? String(data.settings.customShares?.[memberId] ?? defaultShares[memberId] ?? 0);

  const setMode = (mode: Exclude<RepartitionMode, "custom">) => {
    update((current) => ({ ...current, settings: { ...current.settings, repartitionMode: mode } }));
    setFeedback({ message: "Mode de répartition mis à jour." });
  };
  const saveCustom = () => {
    if (!canCustomize) return setFeedback({ message: "Ajoute au moins deux membres pour utiliser la répartition personnalisée.", error: true });
    const shares = Object.fromEntries(data.members.map((member) => [member.id, Number(shareFor(member.id))]));
    if (Object.values(shares).some((share) => !Number.isFinite(share) || share < 0 || share > 100)) return setFeedback({ message: "Chaque part doit être comprise entre 0 et 100 %.", error: true });
    const total = Object.values(shares).reduce((sum, share) => sum + share, 0);
    if (Math.abs(total - 100) > 0.001) return setFeedback({ message: `Le total doit être égal à 100 % (actuellement ${total.toFixed(2)} %).`, error: true });
    update((current) => ({ ...current, settings: { ...current.settings, repartitionMode: "custom", customShares: shares } }));
    setDraftShares(Object.fromEntries(Object.entries(shares).map(([id, share]) => [id, String(share)])));
    setFeedback({ message: "Répartition personnalisée enregistrée et activée." });
  };

  return <Panel padding="md"><Stack gap="md">
    <div><h2 className="text-xl font-semibold">Mode de répartition</h2><p className="text-sm arknest-muted">Choisis comment répartir les dépenses globales du foyer.</p></div>
    {feedback ? <Notice tone={feedback.error ? "danger" : "success"}><p>{feedback.message}</p></Notice> : null}
    <Stack gap="sm">
      {(["equal", "proportional"] as const).map((mode) => <ModeOption key={mode} mode={mode} active={data.settings.repartitionMode === mode} onChoose={() => setMode(mode)} />)}
      <div className="arknest-repartition-option" data-active={data.settings.repartitionMode === "custom" || undefined}><div><strong>Personnalisé</strong><p>Définis toi-même la part de chaque membre. Le total doit être égal à 100 %.</p></div>{!canCustomize ? <span className="text-xs arknest-muted">Disponible à partir de 2 membres</span> : null}</div>
      {canCustomize ? <div className="arknest-custom-shares">{data.members.map((member) => <label key={member.id}><span>{member.name}</span><span className="arknest-custom-share-input"><Input type="number" inputMode="decimal" min="0" max="100" step="0.01" value={shareFor(member.id)} onChange={(event) => setDraftShares((current) => ({ ...current, [member.id]: event.target.value }))} /><b>%</b></span></label>)}<Button onClick={saveCustom}>{data.settings.repartitionMode === "custom" ? "Enregistrer les parts" : "Enregistrer et activer"}</Button></div> : null}
    </Stack>
    <Notice tone="info"><p>Le changement recalcule immédiatement le budget sans modifier les dépenses enregistrées. Une configuration personnalisée invalide utilise temporairement la répartition égalitaire.</p></Notice>
  </Stack></Panel>;
}

function ModeOption({ mode, active, onChoose }: { mode: "equal" | "proportional"; active: boolean; onChoose: () => void }) {
  const equal = mode === "equal";
  return <div className="arknest-repartition-option" data-active={active || undefined}><div><strong>{equal ? "Égalitaire" : "Proportionnel"}</strong><p>{equal ? "Chaque membre prend la même part des dépenses globales." : "La part dépend du revenu mensuel de chaque membre."}</p></div><Button onClick={onChoose} variant={active ? "primary" : "secondary"} aria-pressed={active}>{active ? "Sélectionné" : "Choisir"}</Button></div>;
}
