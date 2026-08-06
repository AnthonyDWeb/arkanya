import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import ContactForm from "@/components/contact/ContactForm";
import Hero from "@/components/ui/hero";

export default function Contact() {
  const herotitle = "Parlons de votre projet.";
  const herosubtitle =
    "Un échange clair et structuré pour comprendre vos objectifs et identifier la solution adaptée.";
  return (
    <main className="bg-background text-foreground">
      <Hero
        image="/page/contact-hero.webp"
        title={herotitle}
        subtitle={herosubtitle}
        variant="contact"
      />

      <section className="py-20">
        <div className="w-[90%] xl:w-[65%] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Une approche structurée et transparente</h2>

              <p className="text-text-medium leading-relaxed">
                Chaque demande est analysée avec rigueur afin de proposer une solution cohérente,
                adaptée à votre organisation et à votre stade de développement.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Échange sans engagement</h3>
                  <p className="text-text-medium text-sm leading-relaxed">
                    Un premier entretien pour comprendre vos enjeux et évaluer les pistes possibles.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Confidentialité assurée</h3>
                  <p className="text-text-medium text-sm leading-relaxed">
                    Vos informations sont traitées avec discrétion et professionnalisme.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Réponse sous 24–48h</h3>
                  <p className="text-text-medium text-sm leading-relaxed">
                    Nous revenons vers vous rapidement avec une première analyse.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      <section className="premium-final-cta text-white text-center">
        <div className="w-[90%] xl:w-[60%] mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-semibold mb-6">Une question avant de vous lancer ?</h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-white/80 mb-8">
              Nous sommes disponibles pour clarifier vos interrogations et vous orienter vers la
              solution adaptée.
            </p>
          </FadeIn>

          <MotionButton href="/solutions" className="cta-button px-10 py-3">
            Découvrir nos solutions
          </MotionButton>
        </div>
      </section>
    </main>
  );
}
