import { Button, Card, Input, Select } from "@arkanya/ui/core";
import { Stack } from "@arkanya/ui/layout";
import { Category } from "@/types";
import { SetupExpenseDraft, SetupMemberDraft } from "./setupTypes";

type Props = {
  title: string;
  expenses: SetupExpenseDraft[];
  categories: Category[];
  members?: SetupMemberDraft[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof SetupExpenseDraft, value: string) => void;
};

export default function SetupExpensesSection(props: Props) {
  const isIndividual = Boolean(props.members);

  return (
    <Stack gap="md">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      {props.expenses.map((expense, index) => (
        <Card key={index} variant="outlined" padding="md">
          <Stack gap="sm">
            <Input
              value={expense.label}
              onChange={(e) => props.onUpdate(index, "label", e.target.value)}
              placeholder="Nom"
            />
            <Input
              value={expense.amount}
              onChange={(e) => props.onUpdate(index, "amount", e.target.value)}
              placeholder="EUR"
            />
            {isIndividual && (
              <Select
                value={expense.memberId}
                onChange={(e) => props.onUpdate(index, "memberId", e.target.value)}
              >
                <option value="">Membre</option>
                {props.members?.map((member, memberIndex) => (
                  <option key={memberIndex} value={`u${memberIndex}`}>
                    {member.name || `Membre ${memberIndex + 1}`}
                  </option>
                ))}
              </Select>
            )}
            <Select
              value={expense.categoryId}
              onChange={(e) => props.onUpdate(index, "categoryId", e.target.value)}
            >
              <option value="">Categorie</option>
              {props.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Button variant="danger" size="sm" onClick={() => props.onRemove(index)}>
              Supprimer cette depense
            </Button>
          </Stack>
        </Card>
      ))}
      <Button variant="secondary" onClick={props.onAdd}>
        Ajouter une depense
      </Button>
    </Stack>
  );
}
