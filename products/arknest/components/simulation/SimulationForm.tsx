import type { ReactNode } from "react";
import { Button, Card, Input, Select } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import type { SimulationModel } from "./useSimulationScenario";

export default function SimulationForm({ model }: { model: SimulationModel }) {
  return <Card padding="md" className="space-y-4">
    <div><h3 className="font-semibold">Créer un scénario</h3><p className="text-sm arknest-muted">Ajoute autant de revenus et de dépenses que tu veux, puis valide pour comparer leur impact sur le budget.</p></div>
    {model.feedback ? <Notice tone="success"><p>{model.feedback}</p></Notice> : null}
    <Field label="Nom du scénario"><Input value={model.scenarioLabel} onChange={(event) => model.setScenarioLabel(event.target.value)} placeholder="Ex. vacances, achat, mois à venir" /></Field>
    <ScenarioRows title="Revenus du scénario" addLabel="+ Ajouter un revenu" onAdd={model.addIncome}>
      {model.incomeRows.map((row) => <div key={row.id} className="grid items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="Nom du revenu"><Input value={row.label} onChange={(event) => model.updateIncome(row.id, { label: event.target.value })} placeholder="Ex. salaire, cadeau" /></Field>
        <Field label="Montant du revenu"><Input inputMode="decimal" value={row.amount} onChange={(event) => model.updateIncome(row.id, { amount: event.target.value })} placeholder="Ex. 1200" /></Field>
        <Field label="Membre concerné"><Select value={row.memberId} onChange={(event) => model.updateIncome(row.id, { memberId: event.target.value })}><option value="">Choisir un membre</option>{model.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></Field>
        {model.incomeRows.length > 1 ? <Button variant="secondary" onClick={() => model.removeIncome(row.id)}>Supprimer</Button> : null}
      </div>)}
    </ScenarioRows>
    <ScenarioRows title="Dépenses du scénario" addLabel="+ Ajouter une dépense" onAdd={model.addExpense}>
      {model.expenseRows.map((row) => <div key={row.id} className="grid items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="Nom de la dépense"><Input value={row.label} onChange={(event) => model.updateExpense(row.id, { label: event.target.value })} placeholder="Ex. courses, forfait" /></Field>
        <Field label="Montant de la dépense"><Input inputMode="decimal" value={row.amount} onChange={(event) => model.updateExpense(row.id, { amount: event.target.value })} placeholder="Ex. 85" /></Field>
        <Field label="Type"><Select value={row.memberId} onChange={(event) => model.updateExpense(row.id, { memberId: event.target.value })}><option value="global">Globale</option>{model.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></Field>
        {model.expenseRows.length > 1 ? <Button variant="secondary" onClick={() => model.removeExpense(row.id)}>Supprimer</Button> : null}
      </div>)}
    </ScenarioRows>
    <div className="flex flex-wrap gap-2"><Button onClick={model.validate}>Valider le scénario</Button><Button variant="secondary" onClick={model.reset}>Réinitialiser</Button></div>
  </Card>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="text-sm font-medium text-slate-700">{label}</span><span>{children}</span></label>;
}

function ScenarioRows({ title, addLabel, onAdd, children }: { title: string; addLabel: string; onAdd: () => void; children: ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">{title}</h4><Button variant="secondary" onClick={onAdd} className="arknest-mobile-full-button">{addLabel}</Button></div><div className="space-y-3">{children}</div></section>;
}
