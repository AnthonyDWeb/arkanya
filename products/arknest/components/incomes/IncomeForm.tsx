import { Button, Input, Select } from "@arkanya/ui/core";
import { Panel, Stack } from "@arkanya/ui/layout";
import { Category, Member } from "@/types";

type Props = {
  amount: string;
  memberId: string;
  categoryId: string;
  frequency: "monthly" | "weekly";
  members: Member[];
  categories: Category[];
  onAmountChange: (value: string) => void;
  onMemberChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFrequencyChange: (value: "monthly" | "weekly") => void;
  onSubmit: () => void;
  canSubmit: boolean;
};

export default function IncomeForm(props: Props) {
  return (
    <Panel padding="md">
      <Stack gap="sm">
        <h2 className="font-semibold">Ajouter un revenu</h2>
        <Select value={props.memberId} onChange={(e) => props.onMemberChange(e.target.value)} aria-label="Membre du revenu">
          <option value="">Membre</option>
          {props.members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
        <Select value={props.categoryId} onChange={(e) => props.onCategoryChange(e.target.value)} aria-label="Catégorie du revenu">
          <option value="">Categorie</option>
          {props.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          value={props.amount}
          onChange={(e) => props.onAmountChange(e.target.value)}
          placeholder="Montant"
          aria-label="Montant du revenu"
        />
        <Select value={props.frequency} onChange={(event) => props.onFrequencyChange(event.target.value as "monthly" | "weekly")} aria-label="Fréquence du revenu">
          <option value="monthly">Mensuel</option>
          <option value="weekly">Hebdomadaire</option>
        </Select>
        <Button onClick={props.onSubmit} disabled={!props.canSubmit}>Ajouter</Button>
      </Stack>
    </Panel>
  );
}
