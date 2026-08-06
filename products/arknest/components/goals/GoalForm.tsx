import type { Dispatch, SetStateAction } from "react";
import { Button, Field, Input, Select } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Panel, Stack } from "@arkanya/ui/layout";
import type { AppData, BudgetGoalType } from "@/types";
import type { GoalDraft } from "./goalDraft";

type Props = {
  data: AppData;
  draft: GoalDraft;
  setDraft: Dispatch<SetStateAction<GoalDraft>>;
  editing: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function GoalForm({ data, draft, setDraft, editing, error, onSave, onCancel }: Props) {
  const patch = (value: Partial<GoalDraft>) => setDraft((current) => ({ ...current, ...value }));
  return (
    <Panel padding="md">
      <Stack gap="md">
        <div>
          <h2 className="text-xl font-semibold">{editing ? "Modifier l’objectif" : "Nouvel objectif"}</h2>
          <p className="text-sm arknest-muted">{editing ? "Ajuste les paramètres sans perdre l’historique." : "Choisis un objectif simple et mesurable."}</p>
        </div>
        {error ? <Notice tone="danger"><p>{error}</p></Notice> : null}
        <div className="arknest-goal-form">
          <Field label="Nom"><Input value={draft.name} onChange={(event) => patch({ name: event.target.value })} placeholder="Ex. Vacances" /></Field>
          <Field label="Type">
            <Select value={draft.type} onChange={(event) => patch({ type: event.target.value as BudgetGoalType })}>
              <option value="savings">Épargne</option><option value="expense-limit">Plafond de dépenses</option><option value="monthly-remaining">Reste mensuel minimum</option>
            </Select>
          </Field>
          <Field label="Montant cible"><Input type="number" inputMode="decimal" min="0" step="0.01" value={draft.targetAmount} onChange={(event) => patch({ targetAmount: event.target.value })} /></Field>
          {draft.type === "savings" ? <Field label="Solde initial"><Input type="number" inputMode="decimal" min="0" step="0.01" value={draft.savedAmount} onChange={(event) => patch({ savedAmount: event.target.value })} /></Field> : null}
          {draft.type === "expense-limit" ? (
            <Field label="Catégorie"><Select value={draft.categoryId} onChange={(event) => patch({ categoryId: event.target.value })}><option value="">Choisir</option>{data.categories.filter((category) => category.type === "expense").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Field>
          ) : null}
          {draft.type === "expense-limit" ? (
            <Field label="Membre (optionnel)"><Select value={draft.memberId} onChange={(event) => patch({ memberId: event.target.value })}><option value="">Tout le foyer</option>{data.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></Field>
          ) : null}
          <Field label="Échéance (optionnelle)"><Input type="date" value={draft.deadline} onChange={(event) => patch({ deadline: event.target.value })} /></Field>
        </div>
        {draft.type === "savings" ? (
          <div className="arknest-transfer-rule">
            <label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={draft.transferEnabled} onChange={(event) => patch({ transferEnabled: event.target.checked })} />Virer automatiquement le reste mensuel vers cet objectif</label>
            {draft.transferEnabled ? <div className="arknest-goal-form">
              <Field label="Règle"><Select value={draft.transferType} onChange={(event) => patch({ transferType: event.target.value as GoalDraft["transferType"] })}><option value="all">Tout le reste disponible</option><option value="percentage">Un pourcentage du reste</option><option value="fixed">Un montant fixe</option></Select></Field>
              {draft.transferType !== "all" ? <Field label={draft.transferType === "percentage" ? "Pourcentage" : "Montant"}><Input type="number" inputMode="decimal" min="0" max={draft.transferType === "percentage" ? 100 : undefined} step="0.01" value={draft.transferValue} onChange={(event) => patch({ transferValue: event.target.value })} /></Field> : null}
            </div> : null}
            <p className="text-xs arknest-muted">À la clôture d’un mois, le virement est enregistré comme mouvement d’épargne et comme dépense ponctuelle. Il ne peut être créé qu’une fois par mois.</p>
          </div>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2"><Button onClick={onSave} className="arknest-mobile-full-button">{editing ? "Enregistrer les modifications" : "Créer l’objectif"}</Button><Button variant="secondary" onClick={onCancel}>Annuler</Button></div>
      </Stack>
    </Panel>
  );
}
