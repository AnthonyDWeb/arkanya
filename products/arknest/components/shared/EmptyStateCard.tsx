import { Card } from "@arkanya/ui/core";

type Props = {
  title: string;
  description: string;
};

export default function EmptyStateCard({ title, description }: Props) {
  return (
    <Card padding="md">
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm arknest-muted">{description}</p>
      </div>
    </Card>
  );
}
