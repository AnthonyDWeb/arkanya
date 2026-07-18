import MotionButton from "@/components/animations/motionbutton";
import HeroParallax from "@/components/parallax/HeroParallax";

export default function HomeHero() {
    const title =
        "Structurer aujourd'hui les outils qui soutiendront votre croissance.";

    const subtitle =
        "Conception, modernisation et développement de solutions web.";

    return (
        <HeroParallax
            title={title}
            subtitle={subtitle}
        >
            <div className="my-10 flex flex-wrap gap-4">
                <MotionButton
                    href="/contact"
                    className="ark-hero-button ark-hero-button--primary px-8 py-4 font-semibold"
                >
                    Discuter de votre projet
                </MotionButton>

                <MotionButton
                    href="/realisations"
                    className="ark-hero-button ark-hero-button--secondary px-8 py-4"
                >
                    Voir nos réalisations
                </MotionButton>
            </div>
        </HeroParallax>
    );
}
