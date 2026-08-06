import { Panel, PageHeader, Stack } from "@arkanya/ui/layout";
import BackButton from "@/components/layout/BackButton";

export default function PrivacyPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <BackButton />
      <PageHeader
        title="Confidentialité"
        description="Comment ArkNest protège les données de votre budget."
        className="mb-6"
      />
      <Panel padding="md">
        <Stack gap="md" className="text-sm arknest-muted">
          <p>
            ArkNest conserve les membres, revenus, dépenses, objectifs et réglages localement sur
            votre appareil. Aucun compte ni synchronisation distante n’est utilisé actuellement.
          </p>
          <p>
            Les simulations restent séparées du budget réel. Les données de démonstration sont
            identifiées et peuvent être supprimées sans effacer vos données personnelles.
          </p>
          <p>
            Un fichier exporté contient les informations enregistrées dans l’application.
            Conservez cette sauvegarde dans un emplacement sécurisé et ne la partagez qu’avec une
            personne de confiance.
          </p>
          <p>
            Vous pouvez exporter, restaurer ou réinitialiser vos données depuis Paramètres, puis
            Données et sauvegarde.
          </p>
          <p className="text-xs">Dernière mise à jour : 22 juillet 2026.</p>
        </Stack>
      </Panel>
    </main>
  );
}
