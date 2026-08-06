import { Card } from "@/components/ui";
import { BackButton, PageHeader } from "@/components/layout";

export default function PrivacyPage() {
  return (
    <>
      <BackButton />
      <PageHeader title="Confidentialite" />
      <Card className="space-y-4 text-sm text-slate-700">
        <p>
          ArkCare conserve les traitements, prises, dosages et notes localement sur votre
          appareil. Arkanya ne recoit pas ces donnees par l’intermediaire de l’application.
        </p>
        <p>
          Les notifications locales sont planifiees sur l’appareil apres votre autorisation. La
          verification de mise a jour contacte uniquement le serveur ArkCare pour lire le
          manifeste de version.
        </p>
        <p>
          Vous pouvez exporter une sauvegarde depuis les reglages. Ce fichier peut contenir des
          informations sensibles : conservez-le dans un emplacement protege et ne le partagez
          qu’avec une personne de confiance.
        </p>
        <p>
          La suppression des donnees s’effectue en supprimant les traitements dans l’application,
          en effacant les donnees du navigateur ou en desinstallant l’application Android. Pour
          toute question : contact@arkanya.fr.
        </p>
        <p className="text-xs text-slate-500">Derniere mise a jour : 22 juillet 2026.</p>
      </Card>
    </>
  );
}
