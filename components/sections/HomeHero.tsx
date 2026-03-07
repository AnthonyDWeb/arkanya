import FadeUp from "@/components/animations/fadeup"
import MotionButton from "@/components/animations/motionbutton"
import HeroParallax from "@/components/parallax/HeroParallax"

export default function HomeHero() {

    const title =
        "Structurer aujourd’hui les outils qui soutiendront votre croissance."

    const subtitle =
        "Conception, modernisation et développement de solutions web."

    return (
        <HeroParallax
            image="/hero-office.avif"
            title={title}
            subtitle={subtitle}
        >

            <FadeUp>
                <p className="text-sm tracking-[0.2em] uppercase text-white/70 mb-6">
                    Arkanya
                </p>
            </FadeUp>

            <FadeUp delay={0.3}>
                <div className="flex gap-4 my-10 flex-wrap">

                    <MotionButton
                        href="/contact"
                        className="px-8 py-4 bg-gold text-black rounded-md font-medium shadow-soft-lg hover:shadow-xl transition"
                    >
                        Discuter de votre projet
                    </MotionButton>

                    <MotionButton
                        href="/realisations"
                        className="px-8 py-4 border border-white/50 text-white rounded-md hover:bg-white/10 transition"
                    >
                        Voir nos réalisations
                    </MotionButton>

                </div>
            </FadeUp>

        </HeroParallax>
    )
}