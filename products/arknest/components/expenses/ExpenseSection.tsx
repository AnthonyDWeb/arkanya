import ExpenseCard from "@/components/expenses/ExpenseCard";
import { Stack } from "@arkanya/ui/layout";
import { Category, Expense, ExpenseType, Member } from "@/types";

type Props = {
  title: string;
  expenses: Expense[];
  categories: Category[];
  members: Member[];
  expenseTypes: ExpenseType[];
  isIndividual: boolean;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseSection(props: Props) {
  return (
    <Stack gap="md">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      <div className="flex flex-wrap justify-around gap-4">
        {props.expenses.map((expense) => (
          <div key={expense.id} className="w-full max-w-64">
            <ExpenseCard
              expense={expense}
              categories={props.categories}
              members={props.members}
              expenseTypes={props.expenseTypes}
              isIndividual={props.isIndividual}
              onUpdate={props.onUpdate}
              onDelete={props.onDelete}
            />
          </div>
        ))}
      </div>
    </Stack>
  );
}
