import Image from "next/image";
import FadeUp from "@/components/animations/fadeup";
import StaggerContainer from "@/components/animations/staggercontainer";
import AnimatedCard from "@/components/animations/animatedcard";
import MotionButton from "@/components/animations/motionbutton";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground">

            {/* HERO */}
            <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">

                {/* Image optimisée Next */}
                <Image
                    src="/hero-office.png"
                    alt="Modern office environment"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Overlay plus contrasté pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/70 to-deep/40"/>

                {/* Contenu */}
                <div className="relative z-10 w-[90%] xl:w-[75%] mx-auto text-left text-white">

                    <FadeUp>
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl drop-shadow-md">
                            Structurer aujourd’hui les outils
                            qui soutiendront votre croissance.
                        </h1>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-xl mt-6 text-white/95 max-w-2xl drop-shadow-sm">
                            Modernisation digitale, développement sur mesure
                            et structuration stratégique.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <div className="flex gap-4 mt-10 flex-wrap">

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

                </div>
            </section>

            {/* INTRO */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[65%] mx-auto text-center">

                    <FadeUp>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-8">
                            Une approche orientée clarté et impact.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-text-medium leading-relaxed max-w-3xl mx-auto">
                            Chaque projet est conçu comme un système structuré,
                            capable d’évoluer avec votre organisation.
                            Nous privilégions performance, cohérence
                            et vision stratégique.
                        </p>
                    </FadeUp>

                </div>
            </section>

            {/* SERVICES */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[75%] mx-auto">

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
                                        className="bg-surface p-10 rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition duration-300">

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

                </div>
            </section>

            {/* DIFFERENCIATION */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-10">
                            Plus qu’un site, une base stratégique.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Nous ne livrons pas simplement une interface.
                            Nous concevons une architecture durable,
                            pensée pour accompagner votre développement.
                        </p>
                    </FadeUp>

                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-20 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-6">
                            Construisons un projet solide.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-white/80 mb-10">
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

                </div>
            </section>

        </main>
    );
}