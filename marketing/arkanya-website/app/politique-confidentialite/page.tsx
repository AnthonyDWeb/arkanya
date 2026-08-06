export default function PolitiqueConfidentialite() {
  return (
    <main className="bg-background text-foreground py-24">
      <div className="w-[90%] max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold">Politique de confidentialité</h1>

          <p className="text-neutral-500">
            Cette politique explique comment les données personnelles sont collectées et utilisées
            sur le site arkanya.fr.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">1. Responsable du traitement</h2>

          <p>Les données personnelles collectées sur ce site sont traitées par :</p>

          <ul className="space-y-2 text-neutral-700">
            <li>Anthony Delforge</li>
            <li>contact@arkanya.fr</li>
            <li>La Ferté-Gaucher, France</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">2. Données collectées</h2>

          <p>Les données peuvent être collectées lorsque vous utilisez le formulaire de contact.</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>nom</li>
            <li>adresse email</li>
            <li>type de projet</li>
            <li>budget estimatif</li>
            <li>message</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">3. Utilisation des données</h2>

          <p>Les données sont utilisées uniquement pour :</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>répondre aux demandes envoyées via le formulaire</li>
            <li>établir des devis</li>
            <li>échanger dans le cadre d’un projet</li>
            <li>gérer la relation commerciale</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">4. Durée de conservation</h2>

          <p>
            Les données sont conservées uniquement le temps nécessaire à la gestion de la relation
            commerciale et dans la limite de trois ans.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">5. Sécurité</h2>

          <p>
            Des mesures techniques et organisationnelles sont mises en place afin de protéger les
            données personnelles contre tout accès non autorisé, perte ou divulgation.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">6. Cookies</h2>

          <p>Le site n’utilise actuellement aucun cookie de suivi publicitaire ou analytique.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">7. Vos droits</h2>

          <p>Conformément au RGPD, vous disposez des droits suivants :</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>droit d’accès</li>
            <li>droit de rectification</li>
            <li>droit de suppression</li>
            <li>droit d’opposition</li>
          </ul>

          <p>Vous pouvez exercer ces droits en contactant : contact@arkanya.fr</p>
        </section>
      </div>
    </main>
  );
}
