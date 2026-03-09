import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";
import Link from "next/link";

export default function Solutions() {

    const herotitle =
        "Des solutions digitales structurées pour bâtir durablement.";

    const herosubtitle =
        "Création, modernisation et développement de solutions web fiables et évolutives pour les entreprises.";

    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/solutions-hero.avif"
                title={herotitle}
                subtitle={herosubtitle}
            />

            {/* INTRO */}
            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Des solutions pensées pour soutenir votre activité
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Chaque projet est conçu comme un système digital structuré,
                            capable d’évoluer avec votre organisation et vos objectifs.
                        </p>
                    </FadeIn>

                </div>
            </section>

            {/* SERVICES */}
            <section className="pb-32">

                <div className="w-[90%] xl:w-[70%] mx-auto grid md:grid-cols-2 gap-10">

                    {/* CREATION SITE */}
                    <FadeIn>
                        <Link
                            href="/services/creation-site-web"
                            className="group block p-10 rounded-2xl bg-surface border-subtle shadow-soft hover:shadow-soft-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                Création de site web
                            </h3>

                            <p className="text-text-medium mb-4">
                                Conception de sites modernes et performants.
                            </p>

                            <p className="text-text-medium leading-relaxed mb-6">
                                Un site professionnel qui renforce votre crédibilité,
                                améliore votre visibilité et soutient
                                le développement de votre activité.
                            </p>

                            <p className="text-sm text-gold font-medium">
                                À partir de 1000 €
                            </p>

                        </Link>
                    </FadeIn>


                    {/* MODERNISATION */}
                    <FadeIn delay={0.05}>
                        <Link
                            href="/services/refonte-site-web"
                            className="group block p-10 rounded-2xl bg-surface border-subtle shadow-soft hover:shadow-soft-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                Modernisation digitale
                            </h3>

                            <p className="text-text-medium mb-4">
                                Refonte et transformation de plateformes existantes.
                            </p>

                            <p className="text-text-medium leading-relaxed mb-6">
                                Transformez un site vieillissant en un outil
                                rapide, fiable et adapté aux standards actuels.
                            </p>

                            <p className="text-sm text-gold font-medium">
                                À partir de 2500 €
                            </p>

                        </Link>
                    </FadeIn>


                    {/* DEVELOPPEMENT */}
                    <FadeIn delay={0.1}>
                        <Link
                            href="/services/developpement-sur-mesure"
                            className="group block p-10 rounded-2xl bg-surface border-subtle shadow-soft hover:shadow-soft-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                Développement sur mesure
                            </h3>

                            <p className="text-text-medium mb-4">
                                Création d’applications et d’outils digitaux adaptés.
                            </p>

                            <p className="text-text-medium leading-relaxed mb-6">
                                Des solutions conçues pour automatiser,
                                structurer et faire évoluer vos processus internes.
                            </p>

                            <p className="text-sm text-gold font-medium">
                                À partir de 4000 €
                            </p>

                        </Link>
                    </FadeIn>


                    {/* ACCOMPAGNEMENT */}
                    <FadeIn delay={0.15}>
                        <Link
                            href="/services/accompagnement"
                            className="group block p-10 rounded-2xl bg-surface border-subtle shadow-soft hover:shadow-soft-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                Accompagnement technique
                            </h3>

                            <p className="text-text-medium mb-4">
                                Suivi et optimisation continue de vos outils digitaux.
                            </p>

                            <p className="text-text-medium leading-relaxed mb-6">
                                Un accompagnement durable pour maintenir
                                la performance et l’évolution de votre infrastructure.
                            </p>

                            <p className="text-sm text-gold font-medium">
                                À partir de 250 € / mois
                            </p>

                        </Link>
                    </FadeIn>

                </div>

            </section>


            {/* CTA */}
            <section className="py-28 bg-deep text-white text-center">

                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Discutons de votre projet
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-white/80 mb-10">
                            Un échange permet d’identifier rapidement
                            la solution adaptée à votre organisation.
                        </p>
                    </FadeIn>

                    <MotionButton
                        href="/contact"
                        className="px-10 py-4 rounded-md bg-gold text-black font-medium shadow-soft-lg hover:shadow-xl transition"
                    >
                        Planifier un échange
                    </MotionButton>

                </div>

            </section>

        </main>
    );
}