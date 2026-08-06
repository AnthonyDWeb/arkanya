import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "../ui/FeatureCard";

export default function Method() {
  return (
    <section id="method" className="section">
      <Container>
        <SectionTitle>Méthode</SectionTitle>

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          <FeatureCard title="Analyse" description="Comprendre votre besoin réel." />

          <FeatureCard title="Architecture" description="Choisir les technologies adaptées." />

          <FeatureCard title="Développement" description="Code robuste et évolutif." />

          <FeatureCard title="Livraison" description="Produit fiable et maintenable." />
        </div>
      </Container>
    </section>
  );
}
