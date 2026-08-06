import { Button, Card, Input, Select } from "@arkanya/ui/core";
import { Stack } from "@arkanya/ui/layout";
import { formatAmount } from "@/lib/format";
import { Category, Income, Member } from "@/types";

type Props = {
  category: Category;
  incomes: Income[];
  members: Member[];
  onUpdate: (id: string, patch: Partial<Income>) => void;
  onDelete: (id: string) => void;
};

export default function IncomeGroup({ category, incomes, members, onUpdate, onDelete }: Props) {
  return (
    <Stack gap="sm">
      <h2 className="text-sm uppercase arknest-muted">{category.name}</h2>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {incomes.map((income) => {
          const member = members.find((item) => item.id === income.memberId);
          return (
          <Card
            key={income.id}
            padding="md"
            variant="outlined"
            className="flex min-w-0 w-full flex-col items-stretch gap-3 md:gap-4"
          >
            <div className="min-w-0 text-center">
              <p className="truncate font-semibold">{member?.name}</p>
              <p className="text-sm arknest-muted">{formatAmount(income.amount)} EUR</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-2">
              <Input
                type="number"
                defaultValue={income.amount}
                onBlur={(event) => onUpdate(income.id, { amount: Number(event.target.value) })}
                className="min-w-0 w-full text-center"
                aria-label="Montant du revenu"
              />
              <Select value={income.frequency} onChange={(event) => onUpdate(income.id, { frequency: event.target.value as Income["frequency"] })} aria-label="Fréquence du revenu">
                <option value="monthly">Mensuel</option>
                <option value="weekly">Hebdomadaire</option>
              </Select>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => onDelete(income.id)}
              >
                Supprimer
              </Button>
            </div>
            </Card>
          );
        })}
      </div>
    </Stack>
  );
}
