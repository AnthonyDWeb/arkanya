export default function MentionsLegales() {
  return (
    <main className="bg-background text-foreground py-24">
      <div className="w-[90%] max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold">Mentions légales</h1>

          <p className="text-neutral-500 leading-relaxed">
            Les présentes mentions légales ont pour objectif d’informer les utilisateurs du site
            arkanya.fr sur l’identité de son éditeur, son hébergement ainsi que les conditions
            d’utilisation du site.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">1. Éditeur du site</h2>

          <p>
            Le site <strong>arkanya.fr</strong> est édité par
            <strong> Anthony Delforge</strong>, entrepreneur individuel exerçant sous le nom
            commercial <strong>Arkanya</strong>.
          </p>

          <p>
            Arkanya propose des prestations de développement web, de création de sites internet et
            de solutions digitales destinées aux entreprises souhaitant structurer ou faire évoluer
            leurs outils numériques.
          </p>

          <div className="space-y-1 text-neutral-700">
            <p>Statut : Micro-entreprise</p>
            <p>SIRET : 949 939 037 00014</p>
            <p>Adresse : La Ferté-Gaucher, 77320, France</p>
            <p>Email : contact@arkanya.fr</p>
            <p>Téléphone : 06 28 63 80 55</p>
            <p>TVA intracommunautaire : non applicable (micro-entreprise)</p>
          </div>

          <p>Directeur de la publication : Anthony Delforge.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">2. Hébergement</h2>

          <ul className="space-y-2 text-neutral-700">
            <li>Vercel Inc.</li>
            <li>340 S Lemon Ave #4133</li>
            <li>Walnut, CA 91789</li>
            <li>États-Unis</li>
            <li>https://vercel.com</li>
          </ul>

          <p className="text-neutral-700">
            Le nom de domaine arkanya.fr est enregistré auprès de la société OVH SAS.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>

          <p>
            L’ensemble du contenu présent sur ce site (textes, images, graphismes, logo, structure,
            code source, etc.) est protégé par les lois relatives à la propriété intellectuelle.
          </p>

          <p>
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou
            partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite
            sans l’autorisation écrite préalable de l’éditeur.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">4. Responsabilité</h2>

          <p>
            Les informations présentes sur ce site sont fournies à titre indicatif. L’éditeur
            s’efforce de fournir des informations aussi précises que possible, mais ne peut garantir
            l’exactitude, la complétude ou l’actualité des informations diffusées.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">5. Liens externes</h2>

          <p>
            Le site peut contenir des liens vers des sites externes. L’éditeur ne peut être tenu
            responsable du contenu ou du fonctionnement de ces sites.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">6. Droit applicable</h2>

          <p>
            Le présent site est soumis au droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </section>
      </div>
    </main>
  );
}
