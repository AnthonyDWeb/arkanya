import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";

export default function DeveloppementSurMesure() {
    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/services-sur-mesure.avif"
                title="Développement de solutions digitales sur mesure"
                subtitle="Applications web, outils métier et plateformes conçues pour répondre précisément aux besoins de votre organisation."
            />

            {/* INTRO */}

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            Des solutions conçues pour vos besoins spécifiques
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Certaines problématiques ne peuvent pas être résolues
                            par un site classique ou un outil standard.
                            Le développement sur mesure permet de concevoir
                            des applications adaptées à vos processus
                            et à votre organisation.
                        </p>
                    </FadeIn>

                </div>
            </section>


            {/* SERVICES */}

            <section className="pb-32">

                <div className="w-[90%] xl:w-[75%] mx-auto space-y-20">

                    {/* APPLICATION WEB */}

                    <FadeIn>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Applications web
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Développement d’applications accessibles via navigateur,
                                        permettant de gérer des données, automatiser des tâches
                                        ou offrir des services interactifs.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Tableaux de bord</li>
                                        <li>• Interfaces de gestion</li>
                                        <li>• Espaces clients</li>
                                        <li>• Applications SaaS</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 4000 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* OUTILS METIER */}

                    <FadeIn delay={0.1}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Outils métier
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Création d’outils adaptés à vos processus internes
                                        afin de simplifier la gestion et améliorer l’efficacité
                                        de votre organisation.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Gestion interne</li>
                                        <li>• Automatisation de processus</li>
                                        <li>• Gestion de données</li>
                                        <li>• Interfaces d’administration</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 5000 €
                                    </p>

                                </div>

                            </div>

                        </div>
                    </FadeIn>


                    {/* PLATEFORME */}

                    <FadeIn delay={0.2}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Plateformes et services en ligne
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Développement de plateformes permettant
                                        de connecter utilisateurs, données et services
                                        au sein d’un même environnement.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Plateformes SaaS</li>
                                        <li>• Plateformes clients</li>
                                        <li>• Gestion multi-utilisateurs</li>
                                        <li>• Interfaces de gestion avancées</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 8000 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* AUTOMATISATION */}

                    <FadeIn delay={0.3}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Automatisation
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Mise en place de systèmes permettant d’automatiser
                                        certaines tâches répétitives et d’améliorer
                                        la productivité de votre organisation.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Automatisation de processus</li>
                                        <li>• Intégrations API</li>
                                        <li>• Synchronisation de données</li>
                                        <li>• Automatisation de tâches</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 3000 €
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
                        Construisons votre solution
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