import { Button, Card } from "@/components/ui";

export function DashboardActions() {
  return (
    <Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button href="/treatments/new">Ajouter un traitement</Button>
        <Button href="/history" variant="secondary">
          Voir l’historique
        </Button>
      </div>
    </Card>
  );
}
