import Card from "@/components/ui/card";
import FadeUp from "@/components/animations/fadeup";
import StaggerContainer from "@/components/animations/staggercontainer";
import AnimatedCard from "@/components/animations/animatedcard";
import MotionButton from "@/components/animations/motionbutton";

export default function Home() {
    return (
        <main className="min-h-screen bg-hero-radial">

            {/* HERO */}
            <section className="px-6 md:px-12 py-24 text-center max-w-5xl mx-auto">

                <FadeUp>
                    <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#d9ad45]">
                        Arkanya
                    </h1>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <p className="text-xl md:text-2xl font-light mb-6">
                        Solutions digitales pour entreprises.
                    </p>
                </FadeUp>

                <FadeUp delay={0.2}>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Nous concevons, modernisons et faisons évoluer
                        des solutions web performantes et adaptées à vos besoins réels.
                    </p>
                </FadeUp>

                <FadeUp delay={0.3}>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <MotionButton
                            href="/contact"
                            className="px-8 py-4 bg-black text-white rounded-md"
                        >
                            Discuter d’un projet
                        </MotionButton>

                        <MotionButton
                            href="/solutions"
                            className="px-8 py-4 border rounded-md"
                            style={{borderColor: "#d9ad45", color: "#d9ad45"}}
                        >
                            Découvrir nos solutions
                        </MotionButton>
                    </div>
                </FadeUp>

            </section>


            {/* SOLUTIONS */}
            <section className="mb-32">
                <div className="w-[90%] xl:w-[85%] mx-auto">

                    <StaggerContainer>
                        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">

                            <AnimatedCard>
                                <Card
                                    title="Modernisation & refonte"
                                    description="Refonte complète de sites web avec une architecture moderne, rapide et optimisée pour la performance."
                                />
                            </AnimatedCard>

                            <AnimatedCard>
                                <Card
                                    title="Applications sur mesure"
                                    description="Conception d’outils digitaux adaptés à votre organisation et à vos besoins spécifiques."
                                />
                            </AnimatedCard>

                            <AnimatedCard>
                                <Card
                                    title="Accompagnement technique"
                                    description="Un partenaire fiable pour assurer l’évolution et la stabilité de vos solutions dans le temps."
                                />
                            </AnimatedCard>

                        </div>
                    </StaggerContainer>

                </div>
            </section>


            {/* APPROCHE */}
            <section className="px-6 md:px-12 mb-32 text-center max-w-4xl mx-auto">

                <FadeUp>
                    <h2 className="text-2xl font-semibold mb-6">
                        Une approche claire et structurée
                    </h2>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <p className="text-neutral-600 leading-relaxed">
                        Chaque projet débute par une compréhension précise de votre activité.
                        Nous concevons ensuite une solution performante, évolutive
                        et alignée avec vos objectifs.
                    </p>
                </FadeUp>

            </section>


            {/* CTA FINAL */}
            <section className="px-6 md:px-12 pb-24 text-center">

                <FadeUp>
                    <h2 className="text-2xl font-semibold mb-6">
                        Parlons de votre projet
                    </h2>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <MotionButton
                        href="/contact"
                        className="px-10 py-4 rounded-md text-white"
                        style={{backgroundColor: "#d9ad45"}}
                    >
                        Prendre rendez-vous
                    </MotionButton>
                </FadeUp>

            </section>

        </main>
    );
}