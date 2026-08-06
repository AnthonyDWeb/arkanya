import { Button, Card, Input, Select } from "@arkanya/ui/core";
import { Panel, Stack } from "@arkanya/ui/layout";
import { Category } from "@/types";
import { SetupIncomeDraft, SetupMemberDraft } from "./setupTypes";

type Props = {
  members: SetupMemberDraft[];
  incomeCategories: Category[];
  onAddMember: () => void;
  onRemoveMember: (index: number) => void;
  onUpdateMemberName: (index: number, name: string) => void;
  onAddIncome: (memberIndex: number) => void;
  onRemoveIncome: (memberIndex: number, incomeIndex: number) => void;
  onUpdateIncome: (
    memberIndex: number,
    incomeIndex: number,
    field: keyof SetupIncomeDraft,
    value: string,
  ) => void;
};

export default function SetupMembersSection(props: Props) {
  return (
    <Stack gap="md">
      <h2 className="text-xl font-semibold">Membres et revenus</h2>
      {props.members.map((member, memberIndex) => (
        <Panel key={memberIndex} padding="md">
          <Stack gap="md">
            <div className="flex flex-wrap gap-2">
              <Input
                value={member.name}
                onChange={(e) => props.onUpdateMemberName(memberIndex, e.target.value)}
                placeholder="Nom"
                className="min-w-0 flex-1"
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => props.onRemoveMember(memberIndex)}
                className="arknest-mobile-full-button"
              >
                Supprimer
              </Button>
            </div>
            {member.incomes.map((income, incomeIndex) => (
              <Card key={incomeIndex} variant="outlined" padding="sm">
                <Stack gap="sm">
                  <Input
                    value={income.amount}
                    onChange={(e) =>
                      props.onUpdateIncome(memberIndex, incomeIndex, "amount", e.target.value)
                    }
                    placeholder="Montant"
                  />
                  <Select
                    value={income.categoryId}
                    onChange={(e) =>
                      props.onUpdateIncome(memberIndex, incomeIndex, "categoryId", e.target.value)
                    }
                  >
                    <option value="">Categorie</option>
                    {props.incomeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <Select value={income.frequency} onChange={(e) => props.onUpdateIncome(memberIndex, incomeIndex, "frequency", e.target.value)}>
                    <option value="monthly">Mensuel</option>
                    <option value="weekly">Hebdomadaire</option>
                  </Select>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => props.onRemoveIncome(memberIndex, incomeIndex)}
                  >
                    Supprimer ce revenu
                  </Button>
                </Stack>
              </Card>
            ))}
            <Button variant="secondary" onClick={() => props.onAddIncome(memberIndex)}>
              Ajouter un revenu
            </Button>
          </Stack>
        </Panel>
      ))}
      <Button onClick={props.onAddMember}>Ajouter un membre</Button>
    </Stack>
  );
}
