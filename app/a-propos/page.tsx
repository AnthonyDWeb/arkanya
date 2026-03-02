import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";

export default function APropos() {
    return (
        <main className="bg-background text-foreground">

            {/* HERO */}
            <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{backgroundImage: "url('/apropos-hero.avif')"}}
                />

                {/* Assombrissement global léger */}
                <div className="absolute inset-0 bg-black/40"/>

                <div className="relative z-10 w-[90%] xl:w-[70%] mx-auto text-white">

                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-2xl">
                            Une vision structurée du digital.
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-lg md:text-xl mt-6 text-white/90 max-w-xl">
                            Concevoir des systèmes fiables, évolutifs et cohérents
                            avec la réalité de votre organisation.
                        </p>
                    </FadeIn>

                </div>
            </section>


            {/* INTRO */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[55%] mx-auto text-center">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Construire des bases solides.
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed mb-4">
                            Trop de projets digitaux sont conçus pour répondre à un besoin immédiat,
                            sans vision d’évolution. Cela crée rigidité, dette technique
                            et fragilité structurelle.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-text-medium leading-relaxed">
                            Arkanya privilégie une approche méthodique :
                            comprendre vos objectifs,
                            structurer une architecture cohérente
                            et bâtir des fondations capables d’évoluer.
                        </p>
                    </FadeIn>

                </div>
            </section>


            {/* MÉTHODE */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[60%] mx-auto space-y-14">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold text-center mb-12">
                            Notre méthode
                        </h2>
                    </FadeIn>

                    {[
                        {
                            title: "Analyse stratégique",
                            text: "Compréhension approfondie de votre activité, de vos enjeux et de vos objectifs."
                        },
                        {
                            title: "Architecture & structuration",
                            text: "Conception d’une base technique solide et cohérente."
                        },
                        {
                            title: "Développement maîtrisé",
                            text: "Implémentation rigoureuse, code maintenable et performance optimisée."
                        },
                        {
                            title: "Évolution & optimisation",
                            text: "Accompagnement structuré pour garantir stabilité et adaptation."
                        }
                    ].map((step, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div>

                                <div className="text-sm text-gold font-medium mb-2">
                                    0{index + 1}
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-text-medium leading-relaxed">
                                    {step.text}
                                </p>

                            </div>
                        </FadeIn>
                    ))}

                </div>
            </section>


            {/* STANDARDS */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[60%] mx-auto space-y-14">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold text-center mb-12">
                            Nos standards
                        </h2>
                    </FadeIn>

                    {[
                        {
                            title: "Architecture évolutive",
                            text: "Conçue pour grandir avec votre activité sans refonte systématique."
                        },
                        {
                            title: "Performance maîtrisée",
                            text: "Optimisation des temps de chargement et des infrastructures."
                        },
                        {
                            title: "Code maintenable",
                            text: "Structure claire, bonnes pratiques et documentation cohérente."
                        },
                        {
                            title: "Sécurité & fiabilité",
                            text: "Protection des données et gestion rigoureuse des accès."
                        }
                    ].map((item, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div>
                                <h3 className="text-xl font-semibold mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-text-medium leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </FadeIn>
                    ))}

                </div>
            </section>


            {/* CTA FINAL */}
            <section className="py-20 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Un partenaire structurant.
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-white/80 mb-8">
                            Cohérence, stabilité et performance durable.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <MotionButton
                            href="/contact"
                            className="px-10 py-3 rounded-md bg-gold text-black font-medium transition"
                        >
                            Discuter de votre projet
                        </MotionButton>
                    </FadeIn>

                </div>
            </section>

        </main>
    );
}