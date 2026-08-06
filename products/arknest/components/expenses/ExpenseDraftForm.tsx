import { Button, Field, Input, Select } from "@arkanya/ui/core";
import { Panel } from "@arkanya/ui/layout";
import { Category, ExpenseType, Member } from "@/types";

type Draft = {
  label: string;
  amount: string;
  categoryId: string;
  memberId?: string;
  typeId?: string;
};

type Props = {
  draft: Draft;
  categories: Category[];
  members: Member[];
  expenseTypes: ExpenseType[];
  isIndividual: boolean;
  onChange: (draft: Draft) => void;
  onSubmit: () => void;
};

export default function ExpenseDraftForm(props: Props) {
  const { draft, categories, members, expenseTypes, isIndividual, onChange, onSubmit } = props;

  return (
    <Panel padding="sm">
      <div className="space-y-2.5">
        <Field label="Portée de la dépense">
          <Select
            value={draft.categoryId}
            onChange={(e) => {
              const categoryId = e.target.value;
              const individual =
                categories.find((category) => category.id === categoryId)?.name === "Individuel";
              onChange({ ...draft, categoryId, memberId: individual ? draft.memberId : "" });
            }}
            className="w-full text-sm"
          >
            <option value="">Choisir une portée</option>
            {categories
              .filter((category) => category.name === "Global" || category.name === "Individuel")
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </Select>
        </Field>

        <div className="grid gap-2 md:grid-cols-[1.2fr_0.7fr]">
          <Field label="Nom">
            <Input
              placeholder="Nom"
              value={draft.label}
              onChange={(e) => onChange({ ...draft, label: e.target.value })}
              className="text-sm"
            />
          </Field>
          <Field label="Montant">
            <Input
              inputMode="decimal"
              placeholder="Montant"
              value={draft.amount}
              onChange={(e) => onChange({ ...draft, amount: e.target.value })}
              className="text-sm"
            />
          </Field>
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {isIndividual && (
            <Field label="Membre">
              <Select
                value={draft.memberId}
                onChange={(e) => onChange({ ...draft, memberId: e.target.value })}
                className="text-sm"
              >
                <option value="">Membre</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {isIndividual && (
            <Field label="Type de dépense">
              <Select
                value={draft.typeId}
                onChange={(e) => onChange({ ...draft, typeId: e.target.value })}
                className="text-sm"
              >
                <option value="">Type (optionnel)</option>
                {expenseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onSubmit} className="arknest-mobile-full-button h-9">
            Ajouter une depense {isIndividual ? "individuelle" : "globale"}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
