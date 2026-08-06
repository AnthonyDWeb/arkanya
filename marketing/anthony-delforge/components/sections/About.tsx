import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";
import ExternalLink from "../ui/ExternalLink";

export default function About() {
  return (
    <section id="about" className="section">
      <Container>
        <SectionTitle>À propos</SectionTitle>

        <div className="max-w-3xl mx-auto text-center text-neutral-300 leading-relaxed space-y-6">
          <p>
            Je suis <span className="text-white font-medium">Anthony Delforge</span>, développeur
            web spécialisé dans la conception et le développement d’applications modernes,
            performantes et évolutives.
          </p>

          <p>
            J’aide les entreprises et entrepreneurs à concevoir des outils digitaux solides : sites
            web, applications et plateformes sur mesure pensées pour accompagner leur croissance et
            structurer leur présence en ligne.
          </p>

          <p>
            Je suis également le fondateur de{" "}
            <ExternalLink
              href="https://arkanya.fr"
              className="text-green-400 font-medium hover:underline"
            >
              Arkanya
            </ExternalLink>
            , une initiative dédiée au développement de solutions digitales structurées, combinant
            expertise technique, architecture logicielle et vision produit.
          </p>

          <p>
            À travers mon travail et le projet Arkanya, mon objectif est de créer des solutions
            fiables, durables et évolutives qui apportent une réelle valeur aux organisations qui
            les utilisent.
          </p>
        </div>
      </Container>
    </section>
  );
}
