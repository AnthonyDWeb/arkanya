import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";

export default function Accompagnement() {
    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/services-accompagnement.avif"
                title="Accompagnement et suivi technique"
                subtitle="Un suivi durable pour maintenir la performance et l’évolution de vos outils digitaux."
            />

            {/* INTRO */}

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            Un projet digital évolue dans le temps
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Un site ou une application nécessite un suivi régulier
                            pour rester performant, sécurisé et adapté à vos besoins.
                            L’accompagnement permet d’assurer la stabilité et
                            l’évolution de votre infrastructure digitale.
                        </p>
                    </FadeIn>

                </div>
            </section>

            {/* SERVICES */}

            <section className="pb-32">

                <div className="w-[90%] xl:w-[75%] mx-auto space-y-20">

                    {/* MAINTENANCE */}

                    <FadeIn>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Maintenance
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Suivi technique de votre site ou application
                                        afin d’assurer sa stabilité et sa sécurité.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Surveillance technique</li>
                                        <li>• Corrections de bugs</li>
                                        <li>• Mises à jour</li>
                                        <li>• Sécurisation</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 250 € / mois
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* OPTIMISATION */}

                    <FadeIn delay={0.1}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Optimisation
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Amélioration continue des performances
                                        et de l’efficacité de votre plateforme.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Optimisation performance</li>
                                        <li>• Amélioration SEO</li>
                                        <li>• Optimisation UX</li>
                                        <li>• Amélioration technique</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        Selon besoin
                                    </p>

                                </div>

                            </div>

                        </div>
                    </FadeIn>


                    {/* SUPPORT */}

                    <FadeIn delay={0.2}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Support technique
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Assistance technique pour répondre
                                        aux questions et résoudre rapidement
                                        les problèmes rencontrés.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Assistance technique</li>
                                        <li>• Résolution de problèmes</li>
                                        <li>• Conseils techniques</li>
                                        <li>• Support prioritaire</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        Sur demande
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* EVOLUTION */}

                    <FadeIn delay={0.3}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Évolution et amélioration
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Développement de nouvelles fonctionnalités
                                        afin de faire évoluer votre site ou application
                                        en fonction de vos besoins.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Ajout de fonctionnalités</li>
                                        <li>• Amélioration de l’interface</li>
                                        <li>• Développement de modules</li>
                                        <li>• Adaptation aux nouveaux besoins</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        Sur devis
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
                        Assurons la pérennité de votre projet
                    </h2>
                </FadeIn>

                <MotionButton
                    href="/contact"
                    className="px-10 py-4 rounded-md bg-gold text-black"
                >
                    Planifier un échange
                </MotionButton>

            </section>

        </main>
    );
}