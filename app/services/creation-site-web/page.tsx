import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";

export default function CreationSiteWeb() {
    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/services-site-web.avif"
                title="Création de sites web professionnels"
                subtitle="Des plateformes modernes, performantes et structurées pour soutenir le développement de votre activité."
            />

            {/* INTRO */}

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            Un site web doit être un véritable outil pour votre entreprise
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Un site web professionnel ne se limite pas à une simple présence
                            en ligne. Il doit renforcer votre crédibilité, améliorer votre
                            visibilité et soutenir le développement de votre activité.
                        </p>
                    </FadeIn>

                </div>
            </section>

            {/* TYPES DE SITES */}

            <section className="pb-32">

                <div className="w-[90%] xl:w-[75%] mx-auto space-y-20">

                    {/* LANDING PAGE */}

                    <FadeIn>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Landing page
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Une page unique conçue pour maximiser la conversion.
                                        Idéale pour les campagnes marketing, les lancements
                                        de produits ou la promotion d’un service spécifique.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Design orienté conversion</li>
                                        <li>• Structure SEO optimisée</li>
                                        <li>• Performance optimisée</li>
                                        <li>• Responsive mobile</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 1000 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>


                    {/* SITE VITRINE */}

                    <FadeIn delay={0.1}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="order-2 md:order-1 bg-background rounded-xl border-subtle h-72"/>

                                <div className="order-1 md:order-2">

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Site vitrine
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Un site professionnel pour présenter votre activité,
                                        vos services et votre expertise.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Toutes les fonctionnalités d’une landing page</li>
                                        <li>• Pages multiples</li>
                                        <li>• Présentation entreprise et services</li>
                                        <li>• Formulaire de contact</li>
                                        <li>• Navigation complète</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 2000 €
                                    </p>

                                </div>

                            </div>

                        </div>
                    </FadeIn>


                    {/* ECOMMERCE */}

                    <FadeIn delay={0.2}>
                        <div className="bg-surface border-subtle rounded-2xl shadow-soft-lg p-10">

                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        Site e-commerce
                                    </h3>

                                    <p className="text-text-medium mb-6 leading-relaxed">
                                        Une plateforme de vente performante conçue pour gérer
                                        vos produits, vos commandes et soutenir le développement
                                        de votre activité en ligne.
                                    </p>

                                    <ul className="space-y-2 text-text-medium text-sm">
                                        <li>• Toutes les fonctionnalités d’un site vitrine</li>
                                        <li>• Catalogue produits</li>
                                        <li>• Paiement sécurisé</li>
                                        <li>• Gestion des commandes</li>
                                        <li>• Gestion du stock</li>
                                    </ul>

                                    <p className="text-gold font-medium mt-6">
                                        À partir de 4000 €
                                    </p>

                                </div>

                                <div className="bg-background rounded-xl border-subtle h-72"/>

                            </div>

                        </div>
                    </FadeIn>

                </div>

            </section>


            {/* PROCESSUS */}

            <section className="py-24 bg-surface">

                <div className="w-[90%] xl:w-[70%] mx-auto">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold text-center mb-16">
                            Une approche structurée pour chaque projet
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-4 gap-10">

                        <FadeIn>
                            <div>
                                <h3 className="font-semibold mb-2">1. Analyse</h3>
                                <p className="text-sm text-text-medium">
                                    Compréhension de votre activité,
                                    de vos objectifs et de votre marché.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <div>
                                <h3 className="font-semibold mb-2">2. Architecture</h3>
                                <p className="text-sm text-text-medium">
                                    Structuration du site et de son contenu
                                    pour une navigation claire et efficace.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div>
                                <h3 className="font-semibold mb-2">3. Développement</h3>
                                <p className="text-sm text-text-medium">
                                    Création d’un site rapide, sécurisé
                                    et optimisé pour le web moderne.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div>
                                <h3 className="font-semibold mb-2">4. Mise en ligne</h3>
                                <p className="text-sm text-text-medium">
                                    Déploiement du site et vérification
                                    de sa performance.
                                </p>
                            </div>
                        </FadeIn>

                    </div>

                </div>

            </section>


            {/* INCLUS */}

            <section className="py-24">

                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            Ce qui est inclus dans chaque projet
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>

                        <div className="grid md:grid-cols-2 gap-6 text-left">

                            <div className="bg-surface p-6 rounded-lg border-subtle">
                                Design responsive
                            </div>

                            <div className="bg-surface p-6 rounded-lg border-subtle">
                                Performance optimisée
                            </div>

                            <div className="bg-surface p-6 rounded-lg border-subtle">
                                Architecture SEO
                            </div>

                            <div className="bg-surface p-6 rounded-lg border-subtle">
                                Sécurité et stabilité
                            </div>

                        </div>

                    </FadeIn>

                </div>

            </section>


            {/* CTA */}

            <section className="py-28 bg-deep text-white text-center">

                <FadeIn>
                    <h2 className="text-3xl font-semibold mb-6">
                        Discutons de votre projet
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