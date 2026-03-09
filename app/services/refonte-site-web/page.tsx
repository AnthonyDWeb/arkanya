import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";

export default function RefonteSiteWeb() {
    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/services-refonte.avif"
                title="Refonte et modernisation de sites web"
                subtitle="Transformez un site vieillissant en un outil moderne, rapide et performant."
            />

            {/* INTRO */}

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            Un site vieillissant peut freiner votre développement
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            De nombreuses entreprises possèdent un site web conçu il y a
                            plusieurs années. Technologies obsolètes, performances faibles
                            ou expérience utilisateur dépassée peuvent nuire à votre
                            crédibilité et limiter votre croissance.
                        </p>
                    </FadeIn>

                </div>
            </section>

            {/* TYPES DE REFONTE */}

            <section className="pb-32">

                <div className="w-[90%] xl:w-[75%] mx-auto space-y-20">

                    {/* AUDIT */}

                    <FadeIn>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Audit et analyse
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Analyse complète de votre site existant afin
                                        d’identifier les points bloquants et les axes
                                        d’amélioration.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Analyse technique</li>
                                        <li>• Analyse SEO</li>
                                        <li>• Analyse des performances</li>
                                        <li>• Audit de l’expérience utilisateur</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 500 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* REFONTE VISUELLE */}

                    <FadeIn delay={0.1}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Refonte visuelle
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Modernisation de l’interface et amélioration
                                        de l’expérience utilisateur afin de rendre
                                        votre site plus professionnel et plus efficace.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Nouveau design</li>
                                        <li>• Amélioration UX</li>
                                        <li>• Responsive mobile</li>
                                        <li>• Modernisation de l’interface</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 1500 €
                                    </p>

                                </div>

                            </div>

                        </div>
                    </FadeIn>


                    {/* REFONTE TECHNIQUE */}

                    <FadeIn delay={0.2}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Refonte technique
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Reconstruction partielle ou complète de votre site
                                        afin d’améliorer ses performances, sa sécurité
                                        et sa maintenabilité.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Refonte du code</li>
                                        <li>• Amélioration des performances</li>
                                        <li>• Optimisation SEO technique</li>
                                        <li>• Sécurisation du site</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 2500 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* MIGRATION */}

                    <FadeIn delay={0.3}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Migration et modernisation
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Migration vers des technologies modernes afin
                                        d’améliorer la stabilité et la capacité d’évolution
                                        de votre plateforme.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Migration vers un nouveau framework</li>
                                        <li>• Modernisation de l’infrastructure</li>
                                        <li>• Optimisation des performances</li>
                                        <li>• Amélioration de la maintenabilité</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 3500 €
                                    </p>

                                </div>

                            </div>

                        </div>
                    </FadeIn>

                </div>

            </section>


            {/* CTA */}

            <section className="py-28 bg-deep text-white text-center">

                <FadeIn>
                    <h2 className="text-3xl font-semibold mb-6">
                        Modernisons votre site
                    </h2>
                </FadeIn>

                <MotionButton
                    href="/contact"
                    className="px-10 py-4 rounded-md bg-gold text-black"
                >
                    Discuter de votre projet
                </MotionButton>

            </section>

        </main>
    );
}