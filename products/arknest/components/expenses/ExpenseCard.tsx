import { Button, Card, Input, Select } from "@arkanya/ui/core";
import { Category, Expense, ExpenseType, Member } from "@/types";

type Props = {
  expense: Expense;
  categories: Category[];
  members: Member[];
  expenseTypes: ExpenseType[];
  isIndividual: boolean;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseCard(props: Props) {
  const { expense, categories, members, isIndividual, onUpdate, onDelete } = props;
  const currentCategory = categories.find((category) => category.id === expense.categoryId);
  const isSectionCategory = currentCategory?.name === "Global" || currentCategory?.name === "Individuel";

  if (expense.isSavingsTransfer) {
    return (
      <Card variant="outlined" padding="sm" className="min-h-0">
        <div className="flex flex-col items-center gap-2 text-center">
          <strong>{expense.label}</strong>
          <span className="text-xs arknest-muted">
            Virement automatique{expense.month ? ` · ${formatMonth(expense.month)}` : ""}
          </span>
          <strong>{expense.amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</strong>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="sm" className="min-h-0">
      <div className="flex flex-col items-center gap-2 text-center">
        <Input
          value={expense.label}
          onChange={(e) => onUpdate(expense.id, "label", e.target.value)}
          aria-label="Nom de la depense"
          className="w-full max-w-52 text-center text-sm"
          placeholder="Nom"
        />

        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {!isSectionCategory && (
            <div className="w-full max-w-52">
                <Select
                  value={expense.categoryId}
                  onChange={(e) => onUpdate(expense.id, "categoryId", e.target.value)}
                  aria-label="Categorie"
                  className="text-sm w-full text-center"
                >
                  {categories
                    .filter((category) => category.name !== "Global" && category.name !== "Individuel")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </Select>
            </div>
          )}

          {isIndividual && (
            <div className="w-full max-w-40">
              <Select
                  value={expense.memberId}
                  onChange={(e) => onUpdate(expense.id, "memberId", e.target.value)}
                  aria-label="Membre"
                  className="text-sm w-full text-center"
                >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <Input
            value={expense.amount}
            onChange={(e) => onUpdate(expense.id, "amount", e.target.value)}
            aria-label="Montant"
            className="w-28 text-center text-sm"
          />

          <div>
            <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)} className="h-8 px-3 text-xs">
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(year, monthNumber - 1, 1, 12),
  );
}
