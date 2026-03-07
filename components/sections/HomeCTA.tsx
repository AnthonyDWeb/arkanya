import MotionButton from "@/components/animations/motionbutton"
import Container from "@/components/ui/container"

import ScrollReveal from "@/components/animations/ScrollReveal"
import ScrollTitle from "@/components/animations/scrolltitle"

export default function HomeCTA() {

    return (
        <section className="py-28 bg-deep text-white text-center">

            <Container className="xl:w-[60%] space-y-6">

                <ScrollTitle>
                    <h2 className="text-3xl font-semibold">
                        Construisons un projet solide.
                    </h2>
                </ScrollTitle>

                <ScrollReveal>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Discutons de vos objectifs et identifions
                        la meilleure stratégie digitale.
                    </p>
                </ScrollReveal>

                <div className="pt-4">
                    <MotionButton
                        href="/contact"
                        className="px-10 py-4 rounded-md bg-gold text-black font-medium shadow-soft-lg hover:shadow-xl transition"
                    >
                        Planifier un échange
                    </MotionButton>
                </div>

            </Container>

        </section>
    )
}