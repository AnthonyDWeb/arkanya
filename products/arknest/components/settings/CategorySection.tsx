import { Button, Card, Input } from "@arkanya/ui/core";
import { Stack } from "@arkanya/ui/layout";
import { Category } from "@/types";

type Props = {
  title: string;
  categories: Category[];
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
};

export default function CategorySection({ title, categories, onDelete, onRename }: Props) {
  return (
    <Stack gap="sm">
      <h3 className="font-semibold">{title}</h3>
      {categories.map((category) => (
        <Card
          key={category.id}
          variant="outlined"
          padding="sm"
          className="flex items-center justify-between gap-2"
        >
          <Input
            value={category.name}
            onChange={(event) => onRename(category.id, event.target.value)}
            className="flex-1"
            aria-label={`${title} ${category.name}`}
          />
          <Button variant="danger" size="sm" onClick={() => onDelete(category.id)}>
            Supprimer
          </Button>
        </Card>
      ))}
    </Stack>
  );
}
