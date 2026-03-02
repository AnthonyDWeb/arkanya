import SlideIn from "@/components/animations/slidein";
import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Hero from "@/components/ui/hero";

export default function Solutions() {
    const herotitle = "Des solutions digitales structurées pour bâtir solidement.";
    const herosubtitle = "Modernisation, structuration et développement sur mesure, adaptés à la réalité de votre organisation.";
    return (
        <main className="bg-background text-foreground">
            <Hero image="/solutions-hero.avif" title={herotitle} subtitle={herosubtitle}/>

            <section className="py-20">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Une approche orientée clarté et performance
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Chaque intervention repose sur une analyse précise de votre
                            structure actuelle. L’objectif : concevoir des solutions
                            fiables, évolutives et cohérentes avec votre développement.
                        </p>
                    </FadeIn>

                </div>
            </section>

            <section className="py-32">
                <div className="w-[90%] xl:w-[75%] mx-auto space-y-32">

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <SlideIn direction="left">
                            <div>
                                <h3 className="text-2xl font-semibold mb-6">
                                    Modernisation Digitale
                                </h3>

                                <p className="text-text-medium mb-6 leading-relaxed">
                                    Transformation complète de plateformes existantes vers
                                    des standards modernes, performants et optimisés.
                                </p>

                                <ul className="space-y-3 text-text-medium">
                                    <li>• Audit technique et structurel</li>
                                    <li>• Refonte UX / UI stratégique</li>
                                    <li>• Optimisation performance & SEO</li>
                                    <li>• Migration sécurisée</li>
                                </ul>
                            </div>
                        </SlideIn>

                        <div className="bg-surface rounded-2xl border-subtle shadow-soft-lg h-80"/>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 bg-surface rounded-2xl border-subtle shadow-soft-lg h-80"/>
                        <SlideIn direction="right">
                            <div className="order-1 md:order-2">
                                <h3 className="text-2xl font-semibold mb-6">
                                    Développement sur Mesure
                                </h3>

                                <p className="text-text-medium mb-6 leading-relaxed">
                                    Conception d’outils digitaux spécifiquement adaptés
                                    à votre organisation et à vos enjeux métier.
                                </p>

                                <ul className="space-y-3 text-text-medium">
                                    <li>• Outils métiers personnalisés</li>
                                    <li>• Automatisation de processus</li>
                                    <li>• Interfaces adaptées aux équipes</li>
                                    <li>• Architecture scalable</li>
                                </ul>
                            </div>
                        </SlideIn>

                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <SlideIn direction="left">
                            <div>
                                <h3 className="text-2xl font-semibold mb-6">
                                    Accompagnement & Évolution
                                </h3>

                                <p className="text-text-medium mb-6 leading-relaxed">
                                    Un suivi structuré pour garantir stabilité,
                                    optimisation continue et cohérence technique.
                                </p>

                                <ul className="space-y-3 text-text-medium">
                                    <li>• Maintenance proactive</li>
                                    <li>• Support prioritaire</li>
                                    <li>• Optimisations régulières</li>
                                    <li>• Conseil stratégique</li>
                                </ul>
                            </div>
                        </SlideIn>

                        <div className="bg-surface rounded-2xl border-subtle shadow-soft-lg h-80"/>

                    </div>

                </div>
            </section>


            {/* CTA FINAL */}
            <section className="py-32 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Planifions un échange
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-white/80 mb-10">
                            Discutons de vos objectifs et identifions
                            la solution adaptée à votre structure.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <MotionButton
                            href="/contact"
                            className="px-10 py-4 rounded-md bg-gold text-black font-medium shadow-soft-lg hover:shadow-xl transition"
                        >
                            Planifier un échange
                        </MotionButton>
                    </FadeIn>

                </div>
            </section>

        </main>
    );
}