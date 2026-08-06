import MotionButton from "@/components/animations/motionbutton";
import Container from "@/components/ui/container";

import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollTitle from "@/components/animations/scrolltitle";

export default function HomeCTA() {
  return (
    <section className="premium-final-cta text-center text-white">
      <Container className="space-y-6 xl:w-[60%]">
        <ScrollTitle>
          <h2 className="text-3xl font-semibold">Construisons un projet solide.</h2>
        </ScrollTitle>

        <ScrollReveal>
          <p className="mx-auto max-w-2xl text-white/80">
            Discutons de vos objectifs et identifions la meilleure stratégie digitale.
          </p>
        </ScrollReveal>

        <div className="pt-4">
          <MotionButton href="/contact" className="cta-button px-10 py-4">
            Planifier un échange
          </MotionButton>
        </div>
      </Container>
    </section>
  );
}
