import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "../ui/FeatureCard";

export default function Expertise() {
  return (
    <section id="expertise" className="section">
      <Container>
        <SectionTitle>Expertise</SectionTitle>

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          <FeatureCard
            title="Applications sur mesure"
            description="Un outil parfaitement adapté à votre activité."
          />

          <FeatureCard
            title="Architecture technique"
            description="Une base solide pour accompagner votre croissance."
          />

          <FeatureCard title="Performance" description="Des applications rapides et fiables." />

          <FeatureCard
            title="Modernisation"
            description="Transformez un système vieillissant en solution moderne."
          />
        </div>
      </Container>
    </section>
  );
}
