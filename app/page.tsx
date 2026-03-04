import FadeUp from "@/components/animations/fadeup";
import StaggerContainer from "@/components/animations/staggercontainer";
import AnimatedCard from "@/components/animations/animatedcard";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";
import Container from "@/components/ui/container";

export default function Home() {
    const herotitle = "Structurer aujourd’hui les outils qui soutiendront votre croissance.";
    const herosubtitle = "Conception, modernisation et développement de solutions web.";

    return (
        <main className="min-h-screen bg-background text-foreground">

            <Hero image="/hero-office.avif" title={herotitle} subtitle={herosubtitle}>
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
            </Hero>

            <section className="py-24 bg-background">
                <Container className="xl:w-[65%] text-center">

                    <FadeUp>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-8">
                            Une approche claire et structurée.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-text-medium leading-relaxed max-w-2xl mx-auto">
                            Chaque projet est conçu comme un système structuré,
                            capable d’évoluer avec votre organisation.
                            Nous privilégions performance, cohérence
                            et vision stratégique.
                        </p>
                    </FadeUp>

                </Container>
            </section>

            <section className="py-24 bg-surface">
                <Container className="xl:w-[75%]">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-20 text-center">
                            Nos expertises
                        </h2>
                    </FadeUp>

                    <StaggerContainer>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">

                            {[
                                {
                                    title: "Modernisation Digitale",
                                    desc: "Refonte stratégique et optimisation technique."
                                },
                                {
                                    title: "Développement sur Mesure",
                                    desc: "Applications et outils adaptés à votre réalité métier."
                                },
                                {
                                    title: "Structuration & Performance",
                                    desc: "Architecture pensée pour évoluer durablement."
                                }
                            ].map((item, index) => (
                                <AnimatedCard key={index}>
                                    <div
                                        className="bg-background p-10 rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition duration-300">

                                        <h3 className="text-xl font-semibold mb-4">
                                            {item.title}
                                        </h3>

                                        <p className="text-text-medium leading-relaxed">
                                            {item.desc}
                                        </p>

                                    </div>
                                </AnimatedCard>
                            ))}

                        </div>
                    </StaggerContainer>

                </Container>
            </section>

            <section className="py-24 bg-background">
                <Container className="xl:w-[60%] text-center">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-10">
                            Plus qu’un site, une base durable.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-text-medium leading-relaxed max-w-2xl mx-auto">
                            Nous ne livrons pas simplement une interface.
                            Nous concevons une architecture durable,
                            pensée pour accompagner votre développement.
                        </p>
                    </FadeUp>

                </Container>
            </section>

            <section className="py-28 bg-deep text-white text-center">
                <Container className="xl:w-[60%]">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-6">
                            Construisons un projet solide.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-white/80 mb-10 max-w-2xl mx-auto">
                            Discutons de vos objectifs et identifions
                            la meilleure stratégie digitale.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <MotionButton
                            href="/contact"
                            className="px-10 py-4 rounded-md bg-gold text-black font-medium shadow-soft-lg hover:shadow-xl transition"
                        >
                            Planifier un échange
                        </MotionButton>
                    </FadeUp>

                </Container>
            </section>

        </main>
    );
}